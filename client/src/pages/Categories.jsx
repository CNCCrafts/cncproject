import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ShoppingCart, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

const SECTIONS = [
  { id: 'acrylic', label: 'Acrylic Art',  emoji: '🖼️', desc: 'Vibrant, crystal-clear acrylic panels for home & office.' },
  { id: 'mdf',     label: 'MDF Art',       emoji: '🌿', desc: 'Intricate laser-cut MDF wall art and decorative pieces.' },
  { id: 'acp',     label: 'ACP',           emoji: '🏢', desc: 'Aluminium composite panels — ideal for signage & branding.' },
  { id: 'pvc',     label: 'PVC',           emoji: '✨', desc: 'Lightweight and weather-resistant PVC displays & backdrops.' },
  { id: '3d',      label: '3D Designs',    emoji: '🔷', desc: 'Cutting-edge 3D printed custom creations and miniatures.' },
];

function ProductCard({ product, onAdd }) {
  const [added, setAdded] = useState(false);
  const hasOffer = product.offer_price && product.offer_price < product.price;

  const handleAdd = () => {
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-card">
      <div className="product-card__img-wrap">
        {product.image
          ? <img src={product.image} alt={product.name} className="product-card__img" loading="lazy" />
          : <div className="product-card__img product-card__img--placeholder" />}
        {product.stock === 0 && (
          <span className="product-card__badge product-card__badge--out">Out of Stock</span>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="product-card__badge product-card__badge--low">Only {product.stock} left</span>
        )}
        {hasOffer && product.stock > 0 && (
          <span className="product-card__badge product-card__badge--offer">
            {Math.round((1 - product.offer_price / product.price) * 100)}% OFF
          </span>
        )}
      </div>
      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__desc">{product.description}</p>
        <div className="product-card__footer">
          <div className="product-card__pricing">
            {hasOffer ? (
              <>
                <span className="product-card__price">₹{product.offer_price.toLocaleString('en-IN')}</span>
                <span className="product-card__original-price">₹{product.price.toLocaleString('en-IN')}</span>
              </>
            ) : (
              <span className="product-card__price">₹{product.price.toLocaleString('en-IN')}</span>
            )}
          </div>
          <button
            className={`product-card__btn ${added ? 'product-card__btn--added' : ''}`}
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            {added ? '✓ Added' : <><ShoppingCart size={16} /> Add</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Categories() {
  const { dispatch } = useCart();
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const location    = useLocation();
  const sectionRefs = useRef({});

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (location.hash && sectionRefs.current[location.hash.slice(1)]) {
      setTimeout(() => {
        sectionRefs.current[location.hash.slice(1)]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [location.hash, loading]);

  const addToCart = (product) => dispatch({ type: 'ADD_ITEM', item: product });

  const filtered = (category) =>
    products
      .filter(p => p.category === category)
      .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <main className="categories-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="page-hero__title">Our Collection</h1>
          <p className="page-hero__sub">Browse our full range of CNC-crafted products</p>
          <div className="search-bar">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="cat-nav">
        <div className="container">
          {SECTIONS.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="cat-nav__link"
              onClick={e => {
                e.preventDefault();
                sectionRefs.current[s.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {s.emoji} {s.label}
            </a>
          ))}
        </div>
      </div>

      <div className="container">
        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : (
          SECTIONS.map(section => {
            const items = filtered(section.id);
            return (
              <section
                key={section.id}
                id={section.id}
                ref={el => sectionRefs.current[section.id] = el}
                className="product-section"
              >
                <div className="product-section__header">
                  <span className="product-section__emoji">{section.emoji}</span>
                  <div>
                    <h2 className="product-section__title">{section.label}</h2>
                    <p className="product-section__desc">{section.desc}</p>
                  </div>
                </div>
                {items.length === 0 ? (
                  <p className="no-products">No products found{search ? ` for "${search}"` : ''}.</p>
                ) : (
                  <div className="product-grid">
                    {items.map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} />)}
                  </div>
                )}
              </section>
            );
          })
        )}
      </div>
    </main>
  );
}
