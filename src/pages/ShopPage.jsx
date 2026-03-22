import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ChevronDown, Grid, List } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/mockData';

export default function ShopPage() {
  const dispatch = useDispatch();
  const { filter } = useSelector(s => s.products);
  const [view, setView] = useState('grid');
  const [priceMax, setPriceMax] = useState(60);
  const setFilter = (p) => dispatch({ type: 'SET_FILTER', payload: p });

  const filtered = useMemo(() => {
    let list = [...products];
    if (filter.category !== 'all') list = list.filter(p => p.category === filter.category);
    if (filter.search) list = list.filter(p => p.name.toLowerCase().includes(filter.search.toLowerCase()));
    list = list.filter(p => p.price <= priceMax);
    if (filter.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (filter.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (filter.sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [filter, priceMax]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-['Montserrat']">

      {/* Breadcrumb */}
      <div className="bg-[#FAFAFA] py-10 text-center border-b border-[#E8E8E8]">
        <h1 className="font-bold text-[24px] text-[#252B42] mb-2">Shop</h1>
        <div className="flex justify-center gap-2 font-bold text-[14px] text-[#737373]">
          <Link to="/" className="text-[#252B42] no-underline">Home</Link>
          <span className="text-[#BDBDBD]">›</span>
          <span>Shop</span>
        </div>
      </div>

      <div className="max-w-[1185px] mx-auto px-6 py-10 flex gap-[30px] items-start">

        {/* Sidebar */}
        <aside className="w-[210px] shrink-0 bg-white border border-[#E8E8E8] rounded-[5px] p-5">
          <div className="mb-6">
            <h3 className="font-bold text-[16px] text-[#252B42] tracking-[0.1px] mb-3">Category</h3>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilter({ category: cat.id })}
                className={`block w-full text-left py-[7px] px-[10px] mb-[3px] rounded border-none cursor-pointer font-['Montserrat'] font-bold text-[14px] tracking-[0.2px] transition-colors ${
                  filter.category === cat.id
                    ? 'bg-[rgba(35,166,240,0.08)] text-[#23A6F0]'
                    : 'bg-transparent text-[#737373]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-[16px] text-[#252B42] tracking-[0.1px] mb-3">Price Range</h3>
            <input
              type="range" min="0" max="60" value={priceMax}
              onChange={e => setPriceMax(+e.target.value)}
              className="w-full accent-[#23A6F0] mb-2"
            />
            <div className="flex justify-between font-bold text-[13px] text-[#737373]">
              <span>$0</span><span>${priceMax}</span>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[16px] text-[#252B42] tracking-[0.1px] mb-3">Department</h3>
            {['All', 'Men', 'Women', 'Accessories', 'Shoes'].map(d => (
              <label key={d} className="flex items-center gap-2 mb-2 cursor-pointer font-semibold text-[14px] text-[#737373]">
                <input type="checkbox" defaultChecked={d === 'All'} className="accent-[#23A6F0]" />
                {d}
              </label>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <span className="font-bold text-[14px] text-[#737373]">
              Showing <strong className="text-[#252B42]">{filtered.length}</strong> results
            </span>
            <div className="flex gap-[10px] items-center flex-wrap">
              <input
                type="text"
                placeholder="Search products..."
                value={filter.search}
                onChange={e => setFilter({ search: e.target.value })}
                className="border border-[#E8E8E8] rounded-[5px] px-[14px] py-2 text-[14px] font-['Montserrat'] outline-none text-[#252B42] bg-white w-[190px]"
              />
              <div className="relative">
                <select
                  value={filter.sort}
                  onChange={e => setFilter({ sort: e.target.value })}
                  className="border border-[#E8E8E8] rounded-[5px] px-[14px] py-2 pr-[30px] text-[14px] font-['Montserrat'] outline-none text-[#252B42] bg-white appearance-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="rating">Best Rating</option>
                </select>
                <ChevronDown size={12} className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none" />
              </div>
              <div className="flex border border-[#E8E8E8] rounded-[5px] overflow-hidden">
                {[['grid', Grid], ['list', List]].map(([v, Icon]) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-[10px] py-2 border-none cursor-pointer flex items-center ${
                      view === v ? 'bg-[#23A6F0] text-white' : 'bg-white text-[#737373]'
                    }`}
                  >
                    <Icon size={14} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-bold text-[18px] text-[#737373] mb-4">No products found</p>
              <button
                onClick={() => { setFilter({ category: 'all', search: '' }); setPriceMax(60); }}
                className="font-bold text-[14px] text-[#23A6F0] bg-none border-none cursor-pointer underline"
              >
                Clear filters
              </button>
            </div>
          ) : view === 'grid' ? (
            <div className="flex flex-wrap gap-[30px] justify-center">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map(p => <ListRow key={p.id} product={p} dispatch={dispatch} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ListRow({ product, dispatch }) {
  return (
    <div className="flex gap-5 bg-white border border-[#E8E8E8] rounded-[5px] p-4 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow">
      <img src={product.image} alt={product.name} className="w-20 h-[100px] object-cover rounded shrink-0" />
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <p className="font-bold text-[12px] text-[#737373] mb-1">{product.department}</p>
          <h3 className="font-bold text-[16px] text-[#252B42] mb-1.5">{product.name}</h3>
          <p className="font-normal text-[14px] text-[#737373] leading-5">{product.description}</p>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-2">
            <span className="font-bold text-[16px] text-[#BDBDBD] line-through">${product.oldPrice.toFixed(2)}</span>
            <span className="font-bold text-[16px] text-[#23856D]">${product.price.toFixed(2)}</span>
          </div>
          <button
            onClick={() => dispatch({ type: 'ADD_TO_CART', payload: product })}
            className="bg-[#23A6F0] text-white border-none rounded-[5px] py-[10px] px-6 font-['Montserrat'] font-bold text-[14px] cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
