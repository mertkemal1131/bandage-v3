import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, setOffset } from '../store/productReducer';
import { addToCart } from '../store/shoppingCartReducer';
import { Link } from 'react-router-dom';
import { ChevronDown, LayoutGrid, List } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import BrandLogos from '../components/BrandLogos';
import { products } from '../data/mockData';

// ── Category banners ─────────────────────────────────────────────────────────
// Figma: 5 cards × 205px wide, 223px tall, gap 15px, inside 1088px container
const SHOP_CATEGORIES = [
  { label: 'CLOTHES', count: 5, image: 'e403f3234352fbe297a33da49162435ddfc7ebb3.jpg' },
  { label: 'CLOTHES', count: 5, image: '7e03d89b289c20edd2275a08f2d2df5371ff7f8c.jpg' },
  { label: 'CLOTHES', count: 5, image: 'd2676d3818335f67670e7c2f65d5314312756628.jpg' },
  { label: 'CLOTHES', count: 5, image: '5267105824e3c5c922730b2e509c49e6b03b75f8.jpg' },
  { label: 'CLOTHES', count: 5, image: 'ca3428bbb53263f3cb265f6e0a1129f5afc25e74.jpg' },
];


const ITEMS_PER_PAGE = 12;

export default function ShopPage() {
  const dispatch = useDispatch();
  // filter string from Redux (text search); category & sort are local UI state
  const searchFilter = useSelector(s => s.product.filter);
  const [category, setCategory] = useState('all');
  const [sort,     setSort]     = useState('featured');
  const [view,     setView]     = useState('grid');
  const [page,     setPage]     = useState(1);

  // Dispatch search string to Redux store; reset pagination
  const handleSearchChange = (search) => { dispatch(setFilter(search)); setPage(1); };
  const handleCategoryChange = (cat)  => { setCategory(cat); setPage(1); };
  const handleSortChange     = (s)    => { setSort(s);       setPage(1); };

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== 'all') list = list.filter(p => p.category === category);
    if (searchFilter)       list = list.filter(p => p.name.toLowerCase().includes(searchFilter.toLowerCase()));
    if (sort === 'price-asc')  list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'rating')     list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [searchFilter, category, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-white font-['Montserrat']">

      {/* ── 1. Breadcrumb banner ─────────────────────────────────────────── */}
      {/* Figma: bg #FAFAFA, 92px tall, "Shop" h3 left + breadcrumb right */}
      <div className="w-full bg-[#FAFAFA]">
        <div className="max-w-[1050px] mx-auto px-6 py-6
                        flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <h2 className="font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42] m-0">
            Shop
          </h2>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-[15px]">
            <Link to="/" className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#252B42] no-underline">
              Home
            </Link>
            {/* arrow */}
            <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
              <path d="M1 1L8 8L1 15" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#BDBDBD]">
              Shop
            </span>
          </nav>
        </div>
      </div>

      {/* ── 2. Category banners ──────────────────────────────────────────── */}
      {/* Figma desktop: 1088px container, 5×205px×223px, gap 15px, pb 48px */}
      {/* Figma mobile:  333px container, cards 332px×300px, gap 15px        */}
      <div className="w-full bg-[#FAFAFA] pb-0 md:pb-[48px]">

        {/* Mobile: centered 333px container, vertical stack */}
        <div className="flex flex-col md:hidden items-center px-0 py-[24px] gap-[15px]"
             style={{ width: '100%' }}>
          <div className="flex flex-col gap-[15px] w-full max-w-[333px] mx-auto">
            {SHOP_CATEGORIES.map((cat, i) => (
              <MobileCatCard key={i} cat={cat} />
            ))}
          </div>
        </div>

        {/* Desktop: horizontal row, fixed 205×223, gap 15 */}
        <div className="hidden md:flex flex-row items-start gap-[15px] justify-center pt-0 max-w-[1088px] mx-auto">
          {SHOP_CATEGORIES.map((cat, i) => (
            <DesktopCatCard key={i} cat={cat} />
          ))}
        </div>
      </div>

      {/* ── 3. Filter / toolbar row ──────────────────────────────────────── */}
      {/* Figma desktop: bg white, 3-col: [results] [views] [dropdown+filter] */}
      {/* Figma mobile:  bg white, column-center: [results] → [views] → [dropdown+filter] */}
      <div className="w-full bg-white border-y border-[#E8E8E8]">
        <div className="max-w-[1050px] mx-auto px-6 py-6">

          {/* ── Mobile layout: centered column ── */}
          <div className="flex flex-col items-center gap-6 md:hidden">

            {/* Row 1: Showing X results */}
            <p className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#737373] m-0">
              Showing all {filtered.length} results
            </p>

            {/* Row 2: Views toggle */}
            <div className="flex items-center gap-[15px]">
              <span className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#737373]">Views:</span>
              <button
                onClick={() => setView('grid')}
                className={`w-[46px] h-[46px] flex items-center justify-center rounded-[5px] border cursor-pointer transition-colors
                  ${view === 'grid' ? 'bg-[#252B42] border-[#252B42]' : 'bg-white border-[#ECECEC]'}`}
              >
                <LayoutGrid size={16} color={view === 'grid' ? '#FFFFFF' : '#252B42'} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`w-[46px] h-[46px] flex items-center justify-center rounded-[5px] border cursor-pointer transition-colors
                  ${view === 'list' ? 'bg-[#252B42] border-[#252B42]' : 'bg-white border-[#ECECEC]'}`}
              >
                <List size={16} color={view === 'list' ? '#FFFFFF' : '#737373'} />
              </button>
            </div>

            {/* Row 3: Dropdown + Filter */}
            <div className="flex items-center gap-[15px]">
              <div className="relative">
                <select
                  value={sort}
                  onChange={e => handleSortChange(e.target.value)}
                  className="w-[141px] h-[50px] bg-[#F9F9F9] border border-[#DDDDDD] rounded-[5px]
                             pl-[18px] pr-[36px] text-[14px] leading-[28px] tracking-[0.2px]
                             font-['Montserrat'] text-[#737373] appearance-none cursor-pointer outline-none"
                >
                  <option value="featured">Popularity</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="rating">Best Rating</option>
                </select>
                <ChevronDown size={14} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none" />
              </div>
              <button className="w-[94px] h-[50px] bg-[#23A6F0] text-white border-none rounded-[5px]
                                 font-bold text-[14px] leading-[24px] tracking-[0.2px] cursor-pointer
                                 hover:bg-[#1a8fd1] transition-colors shrink-0">
                Filter
              </button>
            </div>
          </div>

          {/* ── Desktop layout: 3-column row ── */}
          <div className="hidden md:flex flex-row items-center justify-between">

            {/* Left: result count */}
            <p className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#737373] m-0 whitespace-nowrap">
              Showing all {filtered.length} results
            </p>

            {/* Centre: Views toggle */}
            <div className="flex items-center gap-[15px]">
              <span className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#737373]">Views:</span>
              <button
                onClick={() => setView('grid')}
                className={`w-[46px] h-[46px] flex items-center justify-center rounded-[5px] border cursor-pointer transition-colors
                  ${view === 'grid' ? 'bg-[#252B42] border-[#252B42]' : 'bg-white border-[#ECECEC]'}`}
              >
                <LayoutGrid size={16} color={view === 'grid' ? '#FFFFFF' : '#252B42'} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`w-[46px] h-[46px] flex items-center justify-center rounded-[5px] border cursor-pointer transition-colors
                  ${view === 'list' ? 'bg-[#252B42] border-[#252B42]' : 'bg-white border-[#ECECEC]'}`}
              >
                <List size={16} color={view === 'list' ? '#FFFFFF' : '#737373'} />
              </button>
            </div>

            {/* Right: dropdown + Filter button */}
            <div className="flex items-center gap-[15px]">
              <div className="relative">
                <select
                  value={sort}
                  onChange={e => handleSortChange(e.target.value)}
                  className="w-[141px] h-[50px] bg-[#F9F9F9] border border-[#DDDDDD] rounded-[5px]
                             pl-[18px] pr-[36px] text-[14px] leading-[28px] tracking-[0.2px]
                             font-['Montserrat'] text-[#737373] appearance-none cursor-pointer outline-none"
                >
                  <option value="featured">Popularity</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="rating">Best Rating</option>
                </select>
                <ChevronDown size={14} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none" />
              </div>
              <button className="w-[94px] h-[50px] bg-[#23A6F0] text-white border-none rounded-[5px]
                                 font-bold text-[14px] leading-[24px] tracking-[0.2px] cursor-pointer
                                 hover:bg-[#1a8fd1] transition-colors shrink-0">
                Filter
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── 4. Product grid / list ──────────────────────────────────────── */}
      {/* Figma desktop: 1124px container, 4 cols, gap 30, padding 48px       */}
      {/* Figma mobile:  328px container, 1 col, gap 48px, padding 80px       */}
      <div className="w-full bg-white">
        {/* Mobile wrapper: 328px centered */}
        <div className="md:hidden max-w-[328px] mx-auto py-[80px]">
          {paginated.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-bold text-[18px] text-[#737373] mb-4">No products found</p>
              <button onClick={() => setFilter({ category: 'all', search: '' })}
                className="font-bold text-[14px] text-[#23A6F0] bg-transparent border-none cursor-pointer underline">
                Clear filters
              </button>
            </div>
          ) : view === 'grid' ? (
            <div className="flex flex-col gap-[48px]">
              {paginated.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {paginated.map(p => <ListRow key={p.id} product={p} dispatch={dispatch} />)}
            </div>
          )}

          {/* Pagination — mobile */}
          <div className="flex justify-center mt-[48px]">
            <MobilePagination page={page} totalPages={totalPages} setPage={setPage} filtered={filtered} />
          </div>
        </div>

        {/* Desktop wrapper: 1124px centered */}
        <div className="hidden md:block max-w-[1124px] mx-auto px-6 py-[48px]">
          {paginated.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-bold text-[18px] text-[#737373] mb-4">No products found</p>
              <button onClick={() => setFilter({ category: 'all', search: '' })}
                className="font-bold text-[14px] text-[#23A6F0] bg-transparent border-none cursor-pointer underline">
                Clear filters
              </button>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-4 gap-[30px]">
              {paginated.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {paginated.map(p => <ListRow key={p.id} product={p} dispatch={dispatch} />)}
            </div>
          )}

          {/* Pagination — desktop */}
          <div className="flex justify-center mt-[48px]">
            <MobilePagination page={page} totalPages={totalPages} setPage={setPage} filtered={filtered} />
          </div>
        </div>
      </div>

      {/* ── 6. Brand logos ──────────────────────────────────────────────── */}
      <BrandLogos />

    </div>
  );
}

// ── Shared Pagination box (same spec for both mobile & desktop) ───────────────
// Figma: 313×74, border #BDBDBD, shadow, border-radius 6.73px
function MobilePagination({ page, totalPages, setPage, filtered }) {
  const pages = totalPages > 1
    ? Array.from({ length: totalPages }, (_, i) => i + 1)
    : [1, 2, 3];

  return (
    <div className="inline-flex border border-[#BDBDBD] rounded-[6.73px]
                    shadow-[0px_2px_4px_rgba(0,0,0,0.1)] overflow-hidden bg-white">
      <PagCell label="First" bg="bg-[#F3F3F3]" textColor="text-[#BDBDBD]" borderRight
               onClick={() => setPage(1)} disabled={page === 1} />
      {pages.map(n => (
        <PagCell key={n} label={String(n)} active={page === n} borderRight onClick={() => setPage(n)} />
      ))}
      <PagCell label="Next" textColor="text-[#23A6F0]"
               onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} />
    </div>
  );
}

// ── Desktop category card: 205×223px ──────────────────────────────────────────
function DesktopCatCard({ cat }) {
  return (
    <div className="relative w-[205px] h-[223px] overflow-hidden cursor-pointer group shrink-0">
      <img
        src={`/${cat.image}`}
        alt={cat.label}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-[rgba(33,33,33,0.25)] group-hover:bg-[rgba(33,33,33,0.40)] transition-colors duration-300" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[9px]">
        {/* Figma: h5 bold 16px white */}
        <span className="font-bold text-[16px] leading-[24px] tracking-[0.1px] text-white">
          {cat.label}
        </span>
        {/* Figma: paragraph 14px white */}
        <span className="font-normal text-[14px] leading-[20px] tracking-[0.2px] text-white">
          {cat.count} Items
        </span>
      </div>
    </div>
  );
}

// ── Mobile category card: 332×300px per Figma, centered text ────────────────
function MobileCatCard({ cat }) {
  return (
    <div className="relative w-full h-[300px] overflow-hidden cursor-pointer group"
         style={{ maxWidth: '332px' }}>
      <img
        src={`/${cat.image}`}
        alt={cat.label}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-[rgba(33,33,33,0.25)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[9px]">
        {/* Figma: h5 bold 16px white, letter-spacing 0.1px */}
        <span className="font-bold text-[16px] leading-[24px] tracking-[0.1px] text-white">
          {cat.label}
        </span>
        {/* Figma: h6 bold 14px white */}
        <span className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-white">
          {cat.count} Items
        </span>
      </div>
    </div>
  );
}

// ── Pagination cell ────────────────────────────────────────────────────────────
// Figma: each cell is 46-85px wide, 74px tall, flex center
function PagCell({ label, active = false, onClick, disabled = false, bg = '', textColor = '', borderRight = false }) {
  const base = 'flex items-center justify-center h-[74px] px-[20px] md:px-[25px] cursor-pointer border-none font-bold text-[14px] leading-[24px] tracking-[0.2px] font-["Montserrat"] transition-colors select-none';
  const activeCls = active ? 'bg-[#23A6F0] text-white' : '';
  const disabledCls = disabled ? 'cursor-not-allowed opacity-60' : '';
  const bgCls = !active ? (bg || 'bg-white') : '';
  const colorCls = !active ? (textColor || 'text-[#23A6F0]') : '';
  const borderRightCls = borderRight ? 'border-r border-r-[#E9E9E9]' : '';

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      className={`${base} ${activeCls} ${bgCls} ${colorCls} ${disabledCls} ${borderRightCls}`}
    >
      {label}
    </button>
  );
}

// ── List view row ─────────────────────────────────────────────────────────────
function ListRow({ product, dispatch }) {
  return (
    <div className="flex gap-5 bg-white border border-[#E8E8E8] rounded-[5px] p-4
                    hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow cursor-pointer">
      <img src={product.image} alt={product.name} className="w-[80px] h-[100px] object-cover rounded shrink-0" />
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <p className="font-bold text-[12px] text-[#737373] mb-1 tracking-[0.2px]">{product.department}</p>
          <h3 className="font-bold text-[16px] text-[#252B42] mb-1.5 tracking-[0.1px]">{product.name}</h3>
          <p className="font-normal text-[14px] text-[#737373] leading-5">{product.description}</p>
        </div>
        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
          <div className="flex items-center gap-[5px]">
            <span className="font-bold text-[16px] text-[#BDBDBD] line-through">${product.oldPrice.toFixed(2)}</span>
            <span className="font-bold text-[16px] text-[#23856D]">${product.price.toFixed(2)}</span>
          </div>
          <button
            onClick={() => dispatch(addToCart(product))}
            className="bg-[#23A6F0] text-white border-none rounded-[5px] py-[10px] px-6
                       font-['Montserrat'] font-bold text-[14px] cursor-pointer hover:bg-[#1a8fd1] transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
