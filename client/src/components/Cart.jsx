import { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart({ open, onClose }) {
  const { cart, dispatch, total } = useCart();
  const [checkout, setCheckout] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          address: form.address,
          items: cart,
          total,
        }),
      });
      dispatch({ type: 'CLEAR_CART' });
      setSubmitted(true);
    } catch (err) {
      alert('Order failed. Please try again.');
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="cart-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="cart-drawer">
        <div className="cart-header">
          <h2 className="cart-title"><ShoppingBag size={20} /> Cart {cart.length > 0 && `(${cart.length})`}</h2>
          <button className="cart-close" onClick={onClose}><X size={22} /></button>
        </div>

        {submitted ? (
          <div className="cart-success">
            <div className="cart-success-icon">✓</div>
            <h3>Order Placed!</h3>
            <p>Thank you for your order. We'll reach out shortly to confirm.</p>
            <button className="btn-primary" onClick={() => { setSubmitted(false); setCheckout(false); onClose(); }}>
              Continue Shopping
            </button>
          </div>
        ) : checkout ? (
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h3 className="checkout-title">Checkout</h3>
            {[
              { key: 'name', label: 'Full Name', type: 'text', required: true },
              { key: 'email', label: 'Email Address', type: 'email', required: true },
              { key: 'phone', label: 'Phone Number', type: 'tel' },
              { key: 'address', label: 'Delivery Address', type: 'text' },
            ].map(f => (
              <div key={f.key} className="form-group">
                <label>{f.label}{f.required && ' *'}</label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                  required={f.required}
                />
              </div>
            ))}
            <div className="checkout-summary">
              <span>Total</span>
              <strong>₹{total.toLocaleString('en-IN')}</strong>
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Placing Order…' : 'Place Order'}
            </button>
            <button type="button" className="btn-ghost" onClick={() => setCheckout(false)}>
              ← Back to Cart
            </button>
          </form>
        ) : (
          <>
            {cart.length === 0 ? (
              <div className="cart-empty">
                <ShoppingBag size={48} strokeWidth={1} />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <img src={item.image} alt={item.name} className="cart-item-img" />
                      <div className="cart-item-info">
                        <p className="cart-item-name">{item.name}</p>
                        <p className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</p>
                        <div className="cart-item-qty">
                          <button onClick={() => dispatch({ type: 'UPDATE_QUANTITY', id: item.id, quantity: item.quantity - 1 })}>
                            <Minus size={14} />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => dispatch({ type: 'UPDATE_QUANTITY', id: item.id, quantity: item.quantity + 1 })}>
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <button className="cart-item-remove" onClick={() => dispatch({ type: 'REMOVE_ITEM', id: item.id })}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total</span>
                    <strong>₹{total.toLocaleString('en-IN')}</strong>
                  </div>
                  <button className="btn-primary" onClick={() => setCheckout(true)}>
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
