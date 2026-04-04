import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setFilter, setSort } from '../store/productReducer';
import { fetchProducts } from '../store/thunks';
import { addToCart } from '../store/shoppingCartReducer';
import { Link } from 'react-router-dom';
import { ChevronDown, LayoutGrid, List, Loader2, Search } from 'lucide-react';
import ProductCard, { normaliseProduct } from '../components/ProductCard';
import BrandLogos from '../components/BrandLogos';

// ── Category banner strip (static decorative strip at top of shop page) ────────
const SHOP_CATEGORIES = [
  { label: 'CLOTHES', count: 5, image: 'e403f3234352fbe297a33da49162435ddfc7ebb3.jpg' },
  { label: 'CLOTHES', count: 5, image: '7e03d89b289c20edd2275a08f2d2df5371ff7f8c.jpg' },
  { label: 'CLOTHES', count: 5, image: 'd2676d3818335f67670e7c2f65d5314312756628.jpg' },
  { label: 'CLOTHES', count: 5, image: '5267105824e3c5c922730b2e509c49e6b03b75f8.jpg' },
  { label: 'CLOTHES', count: 5, image: 'ca3428bbb53263f3cb265f6e0a1129f5afc25e74.jpg' },
];

// ── Sort options (exact API values) ───────────────────────────────────────────
const SORT_OPTIONS = [
  { value: '',            label: 'Select sort'      },
  { value: 'price:asc',  label: 'Price: Low → High' },
  { value: 'price:desc', label: 'Price: High → Low' },
  { value: 'rating:asc', label: 'Rating: Low → High' },
  { value: 'rating:desc',label: 'Rating: High → Low' },
];

// ── Pagination config (matches API default) ───────────────────────────────────
const LIMIT = 25;

// ── Loading spinner ────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <Loader2 size={52} className="animate-spin text-[#23A6F0]" strokeWidth={2} />
      <p className="font-bold text-[14px] text-[#737373] tracking-[0.2px]">
        Loading products…
      </p>
    </div>
  );
}

// ── Error state ────────────────────────────────────────────────────────────────
function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <p className="font-bold text-[18px] text-[#E74040]">Failed to load products.</p>
      <button
        onClick={onRetry}
        className="px-8 py-3 bg-[#23A6F0] text-white font-bold text-[14px] rounded-[5px] border-none cursor-pointer hover:bg-[#1a8fd1] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ShopPage
// ─────────────────────────────────────────────────────────────────────────────
export default function ShopPage() {
  const dispatch = useDispatch();

  // categoryId comes from the URL: /shop/:gender/:categoryName/:categoryId
  const { categoryId } = useParams();

  // ── Redux state ──────────────────────────────────────────────────────────────
  // filter and sort live in Redux so they persist across navigation and the
  // useEffect dependency array can react to their changes.
  const productList = useSelector(s => s.product.productList);
  const total       = useSelector(s => s.product.total);
  const fetchState  = useSelector(s => s.product.fetchState);
  const filter      = useSelector(s => s.product.filter);   // committed filter (sent to API)
  const sort        = useSelector(s => s.product.sort);     // committed sort   (sent to API)

  // ── Local UI state ───────────────────────────────────────────────────────────
  // filterInput: what the user is currently typing — not sent to the API until
  // the Filter button is clicked (at which point it's committed to Redux filter).
  // sortSelected: the sort option the user has chosen in the <select> — not sent
  // to the API until the Filter button is clicked.
  const [filterInput,   setFilterInput]   = useState(filter); // initialise from Redux
  const [sortSelected,  setSortSelected]  = useState(sort);   // initialise from Redux
  const [view,          setView]          = useState('grid');
  const [page,          setPage]          = useState(1);

  const isFetching = fetchState === 'FETCHING';
  const isFailed   = fetchState === 'FAILED';

  // ── API call — fires whenever category, committed filter, or committed sort changes
  // All three params are always composed together so no param is ever silently dropped.
  //
  // Flow for the sample case:
  //   1. category selected → categoryId changes → GET /products?category=2
  //   2. user types "siyah", clicks Filter → filter dispatched to Redux
  //                                        → GET /products?category=2&filter=siyah
  //   3. user selects "price:desc", clicks Filter → sort dispatched to Redux
  //                                              → GET /products?category=2&filter=siyah&sort=price:desc
  // ─────────────────────────────────────────────────────────────────────────────
  // ── API call — fires when category, filter, sort, OR page changes ─────────────
  // limit and offset are always included so the API returns exactly one page.
  // All other active params (category, filter, sort) are always composed in so
  // changing the page never silently drops the active filters.
  //
  // Offset formula:  offset = (page - 1) * LIMIT
  //   page 1 → offset 0   → GET /products?limit=25&offset=0
  //   page 2 → offset 25  → GET /products?limit=25&offset=25
  //   page 3 → offset 50  → GET /products?limit=25&offset=50
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const params = {
      limit:  LIMIT,
      offset: (page - 1) * LIMIT,
    };
    if (categoryId) params.category = categoryId;
    if (filter)     params.filter   = filter;
    if (sort)       params.sort     = sort;

    dispatch(fetchProducts(params));

    // Scroll to top of product grid on every page/filter change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch, categoryId, filter, sort, page]);

  // ── Filter button handler ─────────────────────────────────────────────────────
  // Only commits the text input — sort is committed immediately on select change.
  // Always resets to page 1 so the user sees results from the beginning.
  const handleFilterClick = () => {
    setPage(1);
    dispatch(setFilter(filterInput));
  };

  // ── Retry ─────────────────────────────────────────────────────────────────────
  const handleRetry = () => {
    const params = {};
    if (categoryId) params.category = categoryId;
    if (filter)     params.filter   = filter;
    if (sort)       params.sort     = sort;
    dispatch(fetchProducts(params));
  };

  // totalPages derived from the API's total count — not from productList.length
  // productList already contains exactly the current page (LIMIT items max),
  // so we render it directly without slicing.
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  // ── Toolbar (shared between mobile and desktop, extracted for DRY) ─────────────
  const toolbar = (
    <>
      {/* Sort select — fires immediately on change, no Filter click needed */}
      <div className="relative">
        <select
          value={sortSelected}
          onChange={e => {
            const val = e.target.value;
            setSortSelected(val);
            setPage(1);              // reset to page 1 before new sort fires
            dispatch(setSort(val));  // commits to Redux instantly → triggers useEffect
          }}
          className="w-[141px] h-[50px] bg-[#F9F9F9] border border-[#DDDDDD] rounded-[5px]
                     pl-[18px] pr-[36px] text-[14px] leading-[28px] tracking-[0.2px]
                     font-['Montserrat'] text-[#737373] appearance-none cursor-pointer outline-none"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none" />
      </div>

      {/* Filter text input */}
      <div className="relative">
        <input
          type="text"
          value={filterInput}
          onChange={e => setFilterInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleFilterClick()}
          placeholder="Search products…"
          className="h-[50px] bg-[#F9F9F9] border border-[#DDDDDD] rounded-[5px]
                     pl-[18px] pr-[36px] text-[14px] leading-[28px] tracking-[0.2px]
                     font-['Montserrat'] text-[#737373] outline-none w-[160px]"
        />
        <Search size={14} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#BDBDBD] pointer-events-none" />
      </div>

      {/* Filter button — commits filterInput + sortSelected to Redux → triggers useEffect */}
      <button
        onClick={handleFilterClick}
        className="h-[50px] px-[24px] bg-[#23A6F0] text-white border-none rounded-[5px]
                   font-bold text-[14px] cursor-pointer hover:bg-[#1a8fd1] transition-colors shrink-0"
      >
        Filter
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-white font-['Montserrat']">

      {/* ── 1. Breadcrumb banner ─────────────────────────────────────────── */}
      <div className="w-full bg-[#FAFAFA]">
        <div className="max-w-[1050px] mx-auto px-6 py-6
                        flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <h2 className="font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42] m-0">
            Shop
          </h2>
          <nav className="flex items-center gap-[15px]">
            <Link to="/" className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#252B42] no-underline">
              Home
            </Link>
            <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
              <path d="M1 1L8 8L1 15" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#BDBDBD]">
              Shop
            </span>
          </nav>
        </div>
      </div>

      {/* ── 2. Category banner strip ─────────────────────────────────────── */}
      <div className="w-full bg-[#FAFAFA] pb-0 md:pb-[48px]">
        <div className="flex flex-col md:hidden items-center px-0 py-[24px] gap-[15px]">
          <div className="flex flex-col gap-[15px] w-full max-w-[333px] mx-auto">
            {SHOP_CATEGORIES.map((cat, i) => <MobileCatCard key={i} cat={cat} />)}
          </div>
        </div>
        <div className="hidden md:flex flex-row items-start gap-[15px] justify-center pt-0 max-w-[1088px] mx-auto">
          {SHOP_CATEGORIES.map((cat, i) => <DesktopCatCard key={i} cat={cat} />)}
        </div>
      </div>

      {/* ── 3. Toolbar: result count + view toggle + sort/filter controls ─── */}
      <div className="w-full bg-white border-y border-[#E8E8E8]">
        <div className="max-w-[1050px] mx-auto px-6 py-6">

          {/* Active filter/sort badges */}
          {(filter || sort) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filter && (
                <span className="flex items-center gap-1 bg-[#F0F9FF] border border-[#23A6F0] text-[#23A6F0]
                                 rounded-full px-3 py-1 text-[12px] font-bold">
                  filter: "{filter}"
                  <button
                    onClick={() => { setFilterInput(''); dispatch(setFilter('')); }}
                    className="ml-1 text-[#23A6F0] bg-transparent border-none cursor-pointer leading-none text-[14px]"
                  >×</button>
                </span>
              )}
              {sort && (
                <span className="flex items-center gap-1 bg-[#F0F9FF] border border-[#23A6F0] text-[#23A6F0]
                                 rounded-full px-3 py-1 text-[12px] font-bold">
                  sort: {sort}
                  <button
                    onClick={() => { setSortSelected(''); dispatch(setSort('')); }}
                    className="ml-1 text-[#23A6F0] bg-transparent border-none cursor-pointer leading-none text-[14px]"
                  >×</button>
                </span>
              )}
            </div>
          )}

          {/* Mobile layout */}
          <div className="flex flex-col items-center gap-4 md:hidden">
            <p className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#737373] m-0">
              Showing {productList.length} of {total} results
            </p>
            <div className="flex items-center gap-[15px]">
              <span className="font-bold text-[14px] text-[#737373]">Views:</span>
              <ViewBtn active={view === 'grid'} onClick={() => setView('grid')} icon="grid" />
              <ViewBtn active={view === 'list'} onClick={() => setView('list')} icon="list" />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {toolbar}
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden md:flex flex-row items-center justify-between gap-4">
            <p className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#737373] m-0 whitespace-nowrap shrink-0">
              Showing {productList.length} of {total} results
            </p>
            <div className="flex items-center gap-[15px] shrink-0">
              <span className="font-bold text-[14px] text-[#737373]">Views:</span>
              <ViewBtn active={view === 'grid'} onClick={() => setView('grid')} icon="grid" />
              <ViewBtn active={view === 'list'} onClick={() => setView('list')} icon="list" />
            </div>
            <div className="flex items-center gap-3">
              {toolbar}
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Product grid / list / spinner / error ─────────────────────── */}
      <div className="w-full bg-white">
        <div className="max-w-[1124px] mx-auto px-4 md:px-6 py-[48px]">

          {isFetching && <Spinner />}

          {!isFetching && isFailed && <ErrorState onRetry={handleRetry} />}

          {!isFetching && !isFailed && productList.length === 0 && (
            <div className="text-center py-20">
              <p className="font-bold text-[18px] text-[#737373] mb-2">No products found</p>
              <p className="text-[14px] text-[#BDBDBD] mb-6">
                Try adjusting your search or removing filters.
              </p>
              <button
                onClick={() => {
                  setPage(1);
                  setFilterInput('');
                  setSortSelected('');
                  dispatch(setFilter(''));
                  dispatch(setSort(''));
                }}
                className="font-bold text-[14px] text-[#23A6F0] bg-transparent border-none cursor-pointer underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {!isFetching && !isFailed && productList.length > 0 && (
            <>
              {/* Mobile: single column */}
              <div className="flex flex-col md:hidden gap-[48px] max-w-[328px] mx-auto">
                {view === 'grid'
                  ? productList.map(p => <ProductCard key={p.id} product={p} />)
                  : productList.map(p => <ListRow key={p.id} product={p} dispatch={dispatch} />)
                }
              </div>

              {/* Desktop: 4-col grid */}
              <div className="hidden md:block">
                {view === 'grid' ? (
                  <div className="grid grid-cols-4 gap-[30px]">
                    {productList.map(p => <ProductCard key={p.id} product={p} />)}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {productList.map(p => <ListRow key={p.id} product={p} dispatch={dispatch} />)}
                  </div>
                )}
              </div>

              <div className="flex justify-center mt-[48px]">
                <Pagination page={page} totalPages={totalPages} setPage={setPage} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── 5. Brand logos ──────────────────────────────────────────────── */}
      <BrandLogos />

    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ViewBtn({ active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`w-[46px] h-[46px] flex items-center justify-center rounded-[5px] border cursor-pointer transition-colors
        ${active ? 'bg-[#252B42] border-[#252B42]' : 'bg-white border-[#ECECEC]'}`}
    >
      {icon === 'grid'
        ? <LayoutGrid size={16} color={active ? '#FFFFFF' : '#252B42'} />
        : <List       size={16} color={active ? '#FFFFFF' : '#737373'} />
      }
    </button>
  );
}

function ListRow({ product: raw, dispatch }) {
  const product = normaliseProduct(raw);
  const imgSrc  = product._image?.startsWith('http')
    ? product._image
    : product._image
      ? `/${product._image}`
      : 'https://placehold.co/80x100/f3f3f3/bdbdbd?text=?';

  return (
    <div className="flex gap-5 bg-white border border-[#E8E8E8] rounded-[5px] p-4
                    hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow cursor-pointer">
      <img
        src={imgSrc}
        alt={product.name}
        className="w-[80px] h-[100px] object-cover rounded shrink-0"
        onError={e => { e.target.src = 'https://placehold.co/80x100/f3f3f3/bdbdbd?text=No+Image'; }}
      />
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="font-bold text-[16px] text-[#252B42] mb-1.5 tracking-[0.1px] line-clamp-1">{product.name}</h3>
          <p className="font-normal text-[14px] text-[#737373] leading-5 line-clamp-2">{product.description}</p>
        </div>
        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
          <div className="flex items-center gap-[5px]">
            {product._oldPrice !== product._price && (
              <span className="font-bold text-[16px] text-[#BDBDBD] line-through">${product._oldPrice.toFixed(2)}</span>
            )}
            <span className="font-bold text-[16px] text-[#23856D]">${product._price.toFixed(2)}</span>
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

// ── Windowed Pagination ────────────────────────────────────────────────────────
// Shows: [First] [Prev] ... [n-1] [n] [n+1] ... [Next] [Last]
// Ellipsis appears when the window doesn't touch the first/last page.
function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null;

  // Build the visible page numbers (window of ±2 around current)
  const getPages = () => {
    const delta  = 2;
    const left   = Math.max(2, page - delta);
    const right  = Math.min(totalPages - 1, page + delta);
    const pages  = [];

    pages.push(1);
    if (left > 2) pages.push('...');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex items-center gap-1">
      {/* Prev */}
      <NavBtn
        label="‹ Prev"
        onClick={() => setPage(p => p - 1)}
        disabled={page === 1}
      />

      {pages.map((p, i) =>
        p === '...' ? (
          <span
            key={`ellipsis-${i}`}
            className="w-[42px] h-[42px] flex items-center justify-center text-[14px] text-[#BDBDBD] font-bold select-none"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={[
              'w-[42px] h-[42px] rounded-[5px] border font-bold text-[14px] cursor-pointer transition-colors',
              page === p
                ? 'bg-[#23A6F0] border-[#23A6F0] text-white'
                : 'bg-white border-[#DDDDDD] text-[#737373] hover:border-[#23A6F0] hover:text-[#23A6F0]',
            ].join(' ')}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <NavBtn
        label="Next ›"
        onClick={() => setPage(p => p + 1)}
        disabled={page === totalPages}
      />
    </div>
  );
}

function NavBtn({ label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        'h-[42px] px-4 rounded-[5px] border font-bold text-[14px] transition-colors',
        disabled
          ? 'border-[#DDDDDD] text-[#BDBDBD] cursor-not-allowed bg-[#F9F9F9]'
          : 'border-[#DDDDDD] text-[#23A6F0] bg-white cursor-pointer hover:border-[#23A6F0]',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

function DesktopCatCard({ cat }) {
  return (
    <div className="relative w-[205px] h-[223px] overflow-hidden cursor-pointer group shrink-0">
      <img src={`/${cat.image}`} alt={cat.label}
           className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute inset-0 bg-[rgba(33,33,33,0.25)] group-hover:bg-[rgba(33,33,33,0.40)] transition-colors duration-300" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[9px]">
        <span className="font-bold text-[16px] leading-[24px] tracking-[0.1px] text-white">{cat.label}</span>
        <span className="font-normal text-[14px] leading-[20px] tracking-[0.2px] text-white">{cat.count} Items</span>
      </div>
    </div>
  );
}

function MobileCatCard({ cat }) {
  return (
    <div className="relative w-full h-[300px] overflow-hidden cursor-pointer group" style={{ maxWidth: '332px' }}>
      <img src={`/${cat.image}`} alt={cat.label}
           className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute inset-0 bg-[rgba(33,33,33,0.25)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[9px]">
        <span className="font-bold text-[16px] leading-[24px] tracking-[0.1px] text-white">{cat.label}</span>
        <span className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-white">{cat.count} Items</span>
      </div>
    </div>
  );
}
