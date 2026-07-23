import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered'];

const STATUS_META = {
  pending:   { icon: <Clock size={20} />,        color: '#f59e0b', label: 'Order Placed'   },
  confirmed: { icon: <Package size={20} />,      color: '#3b82f6', label: 'Confirmed'      },
  shipped:   { icon: <Truck size={20} />,         color: '#8b5cf6', label: 'Shipped'        },
  delivered: { icon: <CheckCircle size={20} />,  color: '#10b981', label: 'Delivered'      },
  cancelled: { icon: <XCircle size={20} />,      color: '#ef4444', label: 'Cancelled'      },
};

export default function TrackOrder() {
  const [form, setForm]     = useState({ orderId: '', email: '' });
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await fetch(
        `/api/orders/track?id=${encodeURIComponent(form.orderId)}&email=${encodeURIComponent(form.email)}`
      );
      if (!res.ok) { setError('Order not found. Please check your order ID and email.'); }
      else          { setOrder(await res.json()); }
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const currentStep = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <main className="track-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="page-hero__title">Track Your Order</h1>
          <p className="page-hero__sub">Enter your order ID and email to see real-time status.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 640 }}>
          <form className="track-form" onSubmit={handleSearch}>
            <div className="form-group">
              <label>Order ID</label>
              <input
                type="text"
                placeholder="e.g. 42"
                value={form.orderId}
                onChange={e => setForm(v => ({ ...v, orderId: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="The email you used at checkout"
                value={form.email}
                onChange={e => setForm(v => ({ ...v, email: e.target.value }))}
                required
              />
            </div>
            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Searching…' : <><Search size={16} /> Track Order</>}
            </button>
          </form>

          {error && (
            <div className="track-error">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {order && (
            <div className="track-result">
              {/* Header */}
              <div className="track-result__header">
                <div>
                  <h2>Order #{order.id}</h2>
                  <p className="track-meta">Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <span
                  className="status-pill"
                  style={{ background: (STATUS_META[order.status]?.color || '#888') + '22', color: STATUS_META[order.status]?.color || '#888' }}
                >
                  {STATUS_META[order.status]?.label || order.status}
                </span>
              </div>

              {/* Progress tracker */}
              {order.status !== 'cancelled' && (
                <div className="track-steps">
                  {STATUS_STEPS.map((step, idx) => {
                    const done    = idx <= currentStep;
                    const active  = idx === currentStep;
                    const meta    = STATUS_META[step];
                    return (
                      <div key={step} className={`track-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
                        <div className="track-step__icon" style={done ? { background: meta.color, color: '#fff', borderColor: meta.color } : {}}>
                          {meta.icon}
                        </div>
                        <p className="track-step__label">{meta.label}</p>
                        {idx < STATUS_STEPS.length - 1 && (
                          <div className={`track-step__line ${done && idx < currentStep ? 'done' : ''}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {order.status === 'cancelled' && (
                <div className="track-cancelled">
                  <XCircle size={24} /> This order has been cancelled.
                </div>
              )}

              {/* Order items */}
              <div className="track-items">
                <h3>Items Ordered</h3>
                {(Array.isArray(order.items) ? order.items : []).map((item, i) => (
                  <div key={i} className="track-item">
                    {item.image && <img src={item.image} alt={item.name} className="track-item__img" />}
                    <div className="track-item__info">
                      <p className="track-item__name">{item.name}</p>
                      <p className="track-item__meta">Qty: {item.quantity} &nbsp;·&nbsp; ₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
                <div className="track-total">
                  <span>Total</span>
                  <strong>₹{order.total.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Delivery info */}
              {order.address && (
                <div className="track-address">
                  <p><strong>Delivering to:</strong> {order.address}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
