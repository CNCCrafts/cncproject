import { Link } from 'react-router-dom';
import { ArrowRight, Award, Users, Clock, MapPin } from 'lucide-react';

export default function About() {
  return (
    <main className="about-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="page-hero__title">About CNCCrafts</h1>
          <p className="page-hero__sub">Crafting quality, one cut at a time.</p>
        </div>
      </section>
      <section className="section">
        <div className="container about-grid">
          <div className="about-text">
            <h2>Our Story</h2>
            <p>CNCCrafts was born out of a passion for precision craftsmanship and creative expression. We combine cutting-edge CNC technology with artistic vision to deliver products that transform spaces.</p>
            <p>From bespoke acrylic wall art to professional ACP signage, every piece is crafted with meticulous attention to detail — because we believe your space deserves nothing less than extraordinary.</p>
            <Link to="/categories" className="btn-primary">Shop Our Products <ArrowRight size={16} /></Link>
          </div>
          <div className="about-stats">
            {[
              { icon: <Award size={28}/>, label: '5+ Years Experience', sub: 'In CNC craftsmanship' },
              { icon: <Users size={28}/>, label: '2000+ Customers', sub: 'And counting' },
              { icon: <Clock size={28}/>, label: 'Fast Turnaround', sub: '3–7 business days' },
              { icon: <MapPin size={28}/>, label: 'Pan India Delivery', sub: 'We ship across India' },
            ].map(s => (
              <div key={s.label} className="about-stat">
                <div className="about-stat__icon">{s.icon}</div>
                <div>
                  <strong>{s.label}</strong>
                  <p>{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
