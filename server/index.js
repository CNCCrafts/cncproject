require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const crypto   = require('crypto');
const multer   = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const db         = require('./db');
const cloudinary = require('./config/cloudinary');

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── Cloudinary upload storage ────────────────────────────────────────────────
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder:          'cnc-ecom',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation:  [{ quality: 'auto', fetch_format: 'auto' }],
    public_id:       `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  }),
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'));
  },
});

app.use(cors());
app.use(express.json());

// ─── Admin token store ────────────────────────────────────────────────────────
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || 'admin@cnccrafts.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SESSION_SECRET = process.env.SESSION_SECRET || 'cnc-secret';
const activeTokens   = new Set();

function generateToken() {
  const token = crypto.createHmac('sha256', SESSION_SECRET)
    .update(`${Date.now()}-${Math.random()}`).digest('hex');
  activeTokens.add(token);
  return token;
}
function verifyToken(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token || !activeTokens.has(token)) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// ─── Customer password helpers ────────────────────────────────────────────────
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const verify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verify;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Auth — Admin ─────────────────────────────────────────────────────────────
app.post('/api/auth/admin-login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    res.json({ token: generateToken() });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/auth/verify', (req, res) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (token && activeTokens.has(token)) res.json({ valid: true });
  else res.status(401).json({ valid: false });
});

app.post('/api/auth/logout', (req, res) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  activeTokens.delete(token);
  res.json({ success: true });
});

// ─── Auth — Customers ─────────────────────────────────────────────────────────
app.post('/api/auth/customer-register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required.' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const existing = db.getCustomerByEmail(email);
    if (existing) return res.status(409).json({ error: 'An account with this email already exists.' });

    const password_hash = hashPassword(password);
    const customer = db.addCustomer({ name, email: email.toLowerCase(), password_hash });
    res.json({ customer: { id: customer.id, name: customer.name, email: customer.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/customer-login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

    const customer = db.getCustomerByEmail(email);
    if (!customer || !verifyPassword(password, customer.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    res.json({ customer: { id: customer.id, name: customer.name, email: customer.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── File Upload → Cloudinary ─────────────────────────────────────────────────
app.post('/api/upload', verifyToken, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({
    url:       req.file.path,          // Cloudinary secure_url
    public_id: req.file.filename,      // Cloudinary public_id
  });
});

// ─── Products ─────────────────────────────────────────────────────────────────
app.get('/api/products', (req, res) => {
  try {
    const products = db.getAllProducts(true, req.query.category || null);
    res.json(products);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/products/all', (req, res) => {
  try {
    res.json(db.getAllProducts(false));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.getProduct(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/products', verifyToken, (req, res) => {
  try {
    const { name, category, price, offer_price, description, image, image_id, stock } = req.body;
    const product = db.addProduct({
      name, category,
      price:       parseFloat(price) || 0,
      offer_price: offer_price != null && offer_price !== '' ? parseFloat(offer_price) : null,
      description: description || '',
      image:       image || '',
      image_id:    image_id || '',
      stock:       parseInt(stock) || 0,
      active:      true,
    });
    res.json({ id: product.id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/products/:id', verifyToken, (req, res) => {
  try {
    const { name, category, price, offer_price, description, image, image_id, stock, active } = req.body;
    db.updateProduct(req.params.id, {
      name, category,
      price:       parseFloat(price) || 0,
      offer_price: offer_price != null && offer_price !== '' ? parseFloat(offer_price) : null,
      description, image,
      image_id:    image_id || '',
      stock:       parseInt(stock) || 0,
      active:      active ?? true,
    });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/products/:id', verifyToken, (req, res) => {
  try {
    const product = db.getProduct(req.params.id);
    if (product?.image_id) {
      cloudinary.uploader.destroy(product.image_id).catch(() => {});
    }
    db.deleteProduct(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── Orders ───────────────────────────────────────────────────────────────────
app.get('/api/orders', verifyToken, (req, res) => {
  try {
    const orders = db.getAllOrders().map(o => ({
      ...o,
      items: typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []),
    }));
    res.json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/orders/track', (req, res) => {
  try {
    const { id, email } = req.query;
    if (!id || !email) return res.status(400).json({ error: 'id and email required' });
    const order = db.getOrder(id);
    if (!order || order.customerEmail !== email.toLowerCase()) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ ...order, items: typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []) });
  } catch (err) { res.status(404).json({ error: 'Order not found' }); }
});

app.post('/api/orders', (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, address, items, total } = req.body;
    const order = db.addOrder({
      customerName, customerEmail, customerPhone: customerPhone || '',
      address: address || '',
      items: JSON.stringify(items),
      total, status: 'pending',
    });

    // Decrement stock for each item
    for (const item of items) {
      db.decrementStock(item.id, item.quantity);
    }

    res.json({ id: order.id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/orders/:id/status', verifyToken, (req, res) => {
  try {
    db.updateOrderStatus(req.params.id, req.body.status);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── Inventory ────────────────────────────────────────────────────────────────
app.put('/api/inventory/:id', verifyToken, (req, res) => {
  try {
    db.updateProduct(req.params.id, { stock: parseInt(req.body.stock) || 0 });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── Settings ─────────────────────────────────────────────────────────────────
app.get('/api/settings', (req, res) => {
  try {
    res.json(db.getSettings());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/settings', verifyToken, (req, res) => {
  try {
    const updates = req.body; // { key: value, ... }
    for (const [key, value] of Object.entries(updates)) {
      db.setSetting(key, value);
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── Categories ───────────────────────────────────────────────────────────────
app.get('/api/categories', (req, res) => {
  res.json([
    { id: 'acrylic', label: 'Acrylic Art' },
    { id: 'mdf',     label: 'MDF Art'     },
    { id: 'acp',     label: 'ACP'         },
    { id: 'pvc',     label: 'PVC'         },
    { id: '3d',      label: '3D Designs'  },
  ]);
});

// ─── Static (production) ──────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CNC-ECOM server running on http://localhost:${PORT}`);
});

