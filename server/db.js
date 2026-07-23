/**
 * Simple JSON-file based database for CNC-ECOM.
 * Zero native dependencies — works on any platform.
 */
const fs   = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.json');

// ─── Initial data ────────────────────────────────────────────────────────────
const DEFAULT_DATA = {
  products:  [],
  orders:    [],
  customers: [],
  settings:  [],
};

let data = { ...DEFAULT_DATA };

// Auto-increment counters
let nextProductId  = 1;
let nextOrderId    = 1;
let nextCustomerId = 1;

// ─── Load / Init ─────────────────────────────────────────────────────────────
function load() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      data = JSON.parse(raw);

      // Ensure arrays exist
      if (!data.products)  data.products  = [];
      if (!data.orders)    data.orders    = [];
      if (!data.customers) data.customers = [];
      if (!data.settings)  data.settings  = [];

      // Restore counters
      for (const p of data.products)  if (p.id >= nextProductId)  nextProductId  = p.id + 1;
      for (const o of data.orders)    if (o.id >= nextOrderId)    nextOrderId    = o.id + 1;
      for (const c of data.customers) if (c.id >= nextCustomerId) nextCustomerId = c.id + 1;
    } else {
      seedProducts();
      save();
    }
  } catch (err) {
    console.warn('⚠️  Could not load data.json, starting fresh.');
    seedProducts();
    save();
  }
}

function save() {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── Seed ────────────────────────────────────────────────────────────────────
function seedProducts() {
  data.products = [
    { id: 1,  name: 'Floral Acrylic Wall Art',     category: 'acrylic', price: 1299, offer_price: null, description: 'Elegant hand-crafted floral design on premium acrylic panel. Perfect for living rooms.', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80', image_id: '', stock: 25,  active: true,  created_at: new Date().toISOString() },
    { id: 2,  name: 'Acrylic Family Name Plaque',  category: 'acrylic', price:  899, offer_price: null, description: 'Personalized family name plaque in crystal-clear acrylic with gold lettering.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', image_id: '', stock: 30,  active: true,  created_at: new Date().toISOString() },
    { id: 3,  name: 'Geometric Acrylic Panel',     category: 'acrylic', price: 1599, offer_price: null, description: 'Modern geometric pattern in multi-layered acrylic. UV resistant finish.', image: 'https://images.unsplash.com/photo-1561518776-e76a5e48f731?w=400&q=80', image_id: '', stock: 15,  active: true,  created_at: new Date().toISOString() },
    { id: 4,  name: 'Mandala MDF Wall Decor',      category: 'mdf',     price:  799, offer_price: null, description: 'Intricately laser-cut mandala design on 6mm MDF board. Ready to hang.', image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&q=80', image_id: '', stock: 40,  active: true,  created_at: new Date().toISOString() },
    { id: 5,  name: 'MDF Tree of Life',            category: 'mdf',     price: 1099, offer_price: null, description: 'Beautiful Tree of Life CNC-cut from premium MDF. Available in natural or painted finish.', image: 'https://images.unsplash.com/photo-1534889156217-d643df14f14a?w=400&q=80', image_id: '', stock: 20,  active: true,  created_at: new Date().toISOString() },
    { id: 6,  name: 'MDF Nameplate for Door',      category: 'mdf',     price:  499, offer_price: null, description: 'Custom door nameplate with elegant fonts and decorative borders.', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80', image_id: '', stock: 50,  active: true,  created_at: new Date().toISOString() },
    { id: 7,  name: 'ACP Office Signage',          category: 'acp',     price: 2499, offer_price: null, description: 'Professional aluminium composite panel signage with digital print. Weather-proof.', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80', image_id: '', stock: 10,  active: true,  created_at: new Date().toISOString() },
    { id: 8,  name: 'ACP Shop Board',              category: 'acp',     price: 3999, offer_price: null, description: 'High-visibility shop board with LED backlit option on ACP base.', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80', image_id: '', stock: 8,   active: true,  created_at: new Date().toISOString() },
    { id: 9,  name: 'ACP Brand Logo Panel',        category: 'acp',     price: 1999, offer_price: null, description: 'Precision-cut brand logo panel on brushed aluminium composite. Rust-proof.', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80', image_id: '', stock: 12,  active: true,  created_at: new Date().toISOString() },
    { id: 10, name: 'PVC Foam Board Letters',      category: 'pvc',     price:  649, offer_price: null, description: 'Cut-to-shape foam board letters for interior displays. Lightweight & durable.', image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=400&q=80', image_id: '', stock: 60,  active: true,  created_at: new Date().toISOString() },
    { id: 11, name: 'PVC Wedding Backdrop',        category: 'pvc',     price: 2999, offer_price: null, description: 'Elegant custom PVC backdrop for weddings & events. Printed with premium UV inks.', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80', image_id: '', stock: 5,   active: true,  created_at: new Date().toISOString() },
    { id: 12, name: 'PVC Wall Sticker Set',        category: 'pvc',     price:  399, offer_price: null, description: 'Set of decorative PVC wall stickers. Easy peel-and-stick application.', image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80', image_id: '', stock: 80,  active: true,  created_at: new Date().toISOString() },
    { id: 13, name: '3D Geometric Lamp',           category: '3d',      price: 1849, offer_price: null, description: 'Stunning 3D printed geometric lamp with warm LED. Multiple finish options.', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80', image_id: '', stock: 18,  active: true,  created_at: new Date().toISOString() },
    { id: 14, name: '3D Miniature Architecture',   category: '3d',      price: 3499, offer_price: null, description: 'Detailed 3D model of iconic architecture. Custom designs available.', image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80', image_id: '', stock: 7,   active: true,  created_at: new Date().toISOString() },
    { id: 15, name: '3D Trophy & Award',           category: '3d',      price: 1249, offer_price: null, description: 'Custom 3D printed trophy for corporate events & sports. Gold/silver finish.', image: 'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=400&q=80', image_id: '', stock: 22,  active: true,  created_at: new Date().toISOString() },
  ];
  nextProductId = 16;
  console.log('✅ Seeded sample products.');
}

// ─── Public helpers ──────────────────────────────────────────────────────────
function getAllProducts(activeOnly = false, category = null) {
  let list = [...data.products];
  if (activeOnly) list = list.filter(p => p.active);
  if (category)   list = list.filter(p => p.category === category);
  return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function getProduct(id) {
  return data.products.find(p => p.id === Number(id)) || null;
}

function addProduct(product) {
  const id = nextProductId++;
  const entry = { id, ...product, created_at: new Date().toISOString() };
  data.products.push(entry);
  save();
  return entry;
}

function updateProduct(id, updates) {
  const idx = data.products.findIndex(p => p.id === Number(id));
  if (idx === -1) return null;
  data.products[idx] = { ...data.products[idx], ...updates };
  save();
  return data.products[idx];
}

function deleteProduct(id) {
  const idx = data.products.findIndex(p => p.id === Number(id));
  if (idx === -1) return null;
  const [removed] = data.products.splice(idx, 1);
  save();
  return removed;
}

function getAllOrders() {
  return [...data.orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function getOrder(id) {
  return data.orders.find(o => o.id === Number(id)) || null;
}

function addOrder(order) {
  const id = nextOrderId++;
  const entry = { id, ...order, created_at: new Date().toISOString() };
  data.orders.push(entry);
  save();
  return entry;
}

function updateOrderStatus(id, status) {
  const idx = data.orders.findIndex(o => o.id === Number(id));
  if (idx === -1) return null;
  data.orders[idx].status = status;
  save();
  return data.orders[idx];
}

function getAllCustomers() {
  return [...data.customers];
}

function getCustomerByEmail(email) {
  return data.customers.find(c => c.email === email.toLowerCase()) || null;
}

function getCustomer(id) {
  return data.customers.find(c => c.id === Number(id)) || null;
}

function addCustomer(customer) {
  const id = nextCustomerId++;
  const entry = { id, ...customer, created_at: new Date().toISOString() };
  data.customers.push(entry);
  save();
  return entry;
}

function getSettings() {
  const s = {};
  for (const row of data.settings) s[row.key] = row.value;
  return s;
}

function setSetting(key, value) {
  const idx = data.settings.findIndex(s => s.key === key);
  if (idx >= 0) {
    data.settings[idx].value = value;
  } else {
    data.settings.push({ key, value });
  }
  save();
}

function decrementStock(productId, quantity) {
  const product = data.products.find(p => p.id === Number(productId));
  if (product) {
    product.stock = Math.max(0, product.stock - Math.abs(quantity));
    save();
  }
}

// Init
load();

module.exports = {
  getAllProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  getOrder,
  addOrder,
  updateOrderStatus,
  getAllCustomers,
  getCustomerByEmail,
  getCustomer,
  addCustomer,
  getSettings,
  setSetting,
  decrementStock,
};

