import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Truck, Headphones } from 'lucide-react';

const CATEGORIES = [
  { id: 'acrylic', label: 'Acrylic Art',  icon: 'layers', desc: 'Crystal-clear panels with stunning visual depth and modern finish.', color: 'blue', bgClass: 'bg-blue-50 text-blue-600' },
  { id: 'mdf',     label: 'MDF Art',      icon: 'leaf',   desc: 'Precision laser-cut MDF for intricate wall decor and organic patterns.', color: 'amber', bgClass: 'bg-amber-50 text-amber-600' },
  { id: 'acp',     label: 'ACP Signage',  icon: 'building-stroke', desc: 'Professional aluminium composite panels for premium signage & branding.', color: 'slate', bgClass: 'bg-slate-50 text-slate-600' },
  { id: 'pvc',     label: 'PVC Displays', icon: 'file-stroke', desc: 'Lightweight and weather-resistant PVC displays, backdrops & letters.', color: 'cyan', bgClass: 'bg-cyan-50 text-cyan-600' },
  { id: '3d',      label: '3D Designs',   icon: 'box',    desc: 'Cutting-edge 3D printed creations, miniatures and technical models.', color: 'purple', bgClass: 'bg-purple-50 text-purple-600' },
];

const FEATURES = [
  { icon: <Star size={24} />,      title: 'Premium Quality', desc: 'CNC Precision Technology' },
  { icon: <ShieldCheck size={24} />, title: 'Secure Payment',  desc: '100% Safe Checkout' },
  { icon: <Truck size={24} />,      title: 'Fast Shipping',   desc: 'Delivered Across India' },
  { icon: <Headphones size={24} />, title: '24/7 Support',    desc: 'Expert Design Advice' },
];

export default function Home() {
  return (
    <main className="flex flex-col bg-[#FAFAFA]">
      {/* Hero Section */}
      <section className="py-16 md:py-24 overflow-hidden">
        <div className="container grid md:grid-cols-2 items-center gap-16">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#D92D2015] border border-[#D92D2030] px-3 py-1 rounded-full text-[#D92D20] text-xs font-bold uppercase tracking-wider mb-6">
              <i className="ti ti-star-filled" />
              Premium CNC Craftsmanship
            </div>
            <h1 className="font-heading font-bold text-5xl lg:text-6xl leading-[1.1] text-gray-900 mb-6">
              Precision in<br />
              Every <span className="text-[#D92D20]">Cut</span>
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-md leading-relaxed">
              Elevate your space with handcrafted acrylic art, custom signage, and intricate 3D designs. Made for those who appreciate technical perfection.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/categories" className="btn-primary px-8 py-4">
                Shop Collection <i className="ti ti-arrow-right" />
              </Link>
              <Link to="/contact" className="btn-ghost px-8 py-4 font-bold">
                Get a Quote
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#D92D2008] rounded-full blur-3xl" />
            <div className="relative half-relief rounded-2xl overflow-hidden bg-white p-3 rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1704423896061-b0a1057e20a3?auto=format&w=800&q=80&fit=crop" 
                alt="Intricate Wood Art" 
                className="w-full h-[450px] object-cover rounded-xl"
              />
              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/50">
                <div className="text-xs font-bold text-[#D92D20] mb-1 uppercase">Best Seller</div>
                <div className="font-bold text-gray-900">Mandala Wood Relief</div>
                <div className="text-sm text-gray-500 italic">"Absolute precision on my custom order"</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-gray-900 py-12">
        <div className="container grid grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#D92D20] rounded-full flex items-center justify-center text-white shrink-0">
                {f.icon}
              </div>
              <div>
                <div className="text-white font-bold text-sm">{f.title}</div>
                <div className="text-gray-400 text-xs">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl mb-4">Browse by Material</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Explore our collection categorized by the high-grade materials we use to craft your designs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {CATEGORIES.map(cat => (
              <Link key={cat.id} to={`/categories#${cat.id}`} className="category-card bg-white p-8 rounded-2xl half-relief flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 group">
                <div className={`w-16 h-16 ${cat.bgClass} rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-[#D92D2010]`}>
                  <i className={`ti ti-${cat.icon} text-3xl`} />
                </div>
                <h3 className="font-bold text-xl mb-3">{cat.label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-heading font-bold text-3xl mb-2">Bestselling Crafts</h2>
              <p className="text-gray-500">Our most loved precision-crafted pieces.</p>
            </div>
            <Link to="/categories" className="text-[#D92D20] font-bold flex items-center gap-2 hover:underline">
              View All Products <i className="ti ti-arrow-right" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <ProductPlaceholder 
              img="https://images.unsplash.com/photo-1562541996-dc329febcdbc?auto=format&w=400&q=80&fit=crop" 
              title="Luminous LED Acrylic Sign" 
              cat="Acrylic Art" 
              price="1,249" 
              oldPrice="1,599"
              badge="OFFER"
            />
            <ProductPlaceholder 
              img="https://images.unsplash.com/photo-1679996644490-14c2e6726d0f?auto=format&w=400&q=80&fit=crop" 
              title="Parametric Wood Relief" 
              cat="MDF Art" 
              price="2,899" 
            />
            <ProductPlaceholder 
              img="https://images.unsplash.com/photo-1643199350511-ffc840cf7c34?auto=format&w=400&q=80&fit=crop" 
              title="Cityscape 3D Architecture" 
              cat="3D Designs" 
              price="4,499" 
            />
            <ProductPlaceholder 
              img="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&w=400&q=80&fit=crop" 
              title="Floral Layered Acrylic" 
              cat="Acrylic Art" 
              price="1,849" 
              badge="NEW"
              badgeColor="gray-900"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA] via-white to-white pointer-events-none" />
        <div className="container relative z-10">
          <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-[40px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#D92D20] opacity-[0.08] blur-3xl -mr-32 -mt-32 rounded-full" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-[0.03] blur-3xl -ml-40 -mb-40 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D92D20] opacity-[0.03] blur-[120px] rounded-full" />
            
            {/* Accent line */}
            <div className="w-16 h-1 bg-[#D92D20] rounded-full mx-auto mb-8" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="font-heading font-bold text-4xl md:text-5xl text-white mb-6 leading-tight tracking-tight">
                Ready to Create Something Beautiful?
              </h2>
              <p className="text-gray-400 text-lg md:text-xl mb-12 leading-relaxed max-w-lg mx-auto">
                Get in touch for custom orders, bulk pricing, and design consultations. Our team is ready to bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/categories" className="btn-primary !bg-[#D92D20] !px-10 !py-4 !text-base shadow-xl shadow-[#D92D20]/30 hover:shadow-2xl hover:shadow-[#D92D20]/40 transition-all duration-300">
                  Start Shopping <i className="ti ti-arrow-right" />
                </Link>
                <Link to="/contact" className="bg-white/10 text-white px-10 py-4 rounded-full font-bold border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 flex items-center gap-2 group">
                  <span>Contact Expert</span>
                  <i className="ti ti-arrow-right text-sm group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProductPlaceholder({ img, title, cat, price, oldPrice, badge, badgeColor }) {
  return (
    <div className="product-card group cursor-pointer">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4 border border-gray-100">
        <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-500" />
        {badge && (
          <div className={`absolute top-4 left-4 ${badgeColor === 'gray-900' ? 'bg-gray-900' : 'bg-[#D92D20]'} text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider`}>
            {badge}
          </div>
        )}
      </div>
      <h4 className="font-bold text-gray-900 mb-1 group-hover:text-[#D92D20] transition-colors">{title}</h4>
      <p className="text-xs text-gray-500 mb-3 uppercase font-medium">{cat}</p>
      <div className="flex items-center justify-between">
        <div>
          <span className="font-bold text-lg text-gray-900">₹{price}</span>
          {oldPrice && <span className="text-xs text-gray-400 line-through ml-2">₹{oldPrice}</span>}
        </div>
        <button className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-[#D92D20] transition-colors">
          <i className="ti ti-shopping-bag-plus text-lg" />
        </button>
      </div>
    </div>
  );
}
