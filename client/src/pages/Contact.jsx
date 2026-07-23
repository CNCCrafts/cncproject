import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="contact-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="page-hero__title">Get In Touch</h1>
          <p className="page-hero__sub">Custom orders, bulk pricing, design consultations — we're here to help.</p>
        </div>
      </section>
      <section className="section">
        <div className="container contact-grid">
          <div className="contact-info">
            <h2>Contact Information</h2>
            {[
              { icon: <Mail size={20}/>, label: 'clientscred@gmail.com' },
              { icon: <Phone size={20}/>, label: '+91 00000 00000' },
              { icon: <MapPin size={20}/>, label: 'India' },
            ].map(i => (
              <div key={i.label} className="contact-info__item">
                {i.icon} <span>{i.label}</span>
              </div>
            ))}
          </div>
          {sent ? (
            <div className="contact-success">
              <div className="cart-success-icon">✓</div>
              <h3>Message Sent!</h3>
              <p>We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              {[
                { key: 'name', label: 'Your Name', type: 'text' },
                { key: 'email', label: 'Email Address', type: 'email' },
              ].map(f => (
                <div key={f.key} className="form-group">
                  <label>{f.label}</label>
                  <input type={f.type} value={form[f.key]} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))} required />
                </div>
              ))}
              <div className="form-group">
                <label>Message</label>
                <textarea value={form.message} onChange={e => setForm(v => ({ ...v, message: e.target.value }))} rows={5} required />
              </div>
              <button className="btn-primary" type="submit"><Send size={16} /> Send Message</button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
