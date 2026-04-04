import { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Heart, ShoppingCart, Share2, ChevronLeft, ChevronRight, ArrowLeft, Star, Loader2 } from 'lucide-react';
import { fetchProductById } from '../store/thunks';
import { addToCart, toggleWishlist } from '../store/shoppingCartReducer';
import ProductCard from '../components/ProductCard';
import BrandLogos from '../components/BrandLogos';
import Stars from '../components/Stars';

// ── Small round icon button ───────────────────────────────────────────────────
function IconRoundBtn({ children, active = false, onClick, title }) {
  return (
    <button title={title} onClick={onClick}
      className={[
        'w-[40px] h-[40px] rounded-full flex items-center justify-center',
        'border cursor-pointer transition-all duration-200',
        active
          ? 'border-[#23A6F0] bg-[#23A6F0] text-white'
          : 'border-[#E8E8E8] bg-white text-[#252B42] hover:border-[#23A6F0] hover:text-[#23A6F0]',
      ].join(' ')}>
      {children}
    </button>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 size={52} className="animate-spin text-[#23A6F0]" strokeWidth={2} />
      <p className="font-bold text-[14px] text-[#737373] tracking-[0.2px]">Loading product…</p>
    </div>
  );
}

// ── Star rating display ───────────────────────────────────────────────────────
function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-[6px]">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(n => (
          <Star
            key={n}
            size={16}
            className={n <= Math.round(rating) ? 'text-[#FFCE31]' : 'text-[#E8E8E8]'}
            fill={n <= Math.round(rating) ? '#FFCE31' : '#E8E8E8'}
          />
        ))}
      </div>
      <span className="font-bold text-[14px] text-[#737373]">{Number(rating).toFixed(1)}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ProductDetailPage
// Route: /shop/:gender/:categoryName/:categoryId/:productNameSlug/:productId
// ─────────────────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { productId, gender, categoryName, categoryId } = useParams();
  const history  = useHistory();
  const dispatch = useDispatch();

  const product    = useSelector(s => s.product.selectedProduct);
  const fetchState = useSelector(s => s.product.fetchState);
  const productList = useSelector(s => s.product.productList);  // for related products
  const isWishlisted = useSelector(s => s.wishlist.items.some(i => i.id === product?.id));

  const [activeImg,     setActiveImg]     = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [activeTab,     setActiveTab]     = useState('description');

  // ── Fetch the product on mount / productId change ─────────────────────────
  useEffect(() => {
    dispatch(fetchProductById(productId));
    setActiveImg(0);      // reset image carousel on product change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch, productId]);

  // ── Derived helpers ───────────────────────────────────────────────────────
  const images = product?.images ?? [];
  const imgSrc = (i) => {
    const url = images[i]?.url ?? images[0]?.url ?? null;
    if (!url) return 'https://placehold.co/506x450/f3f3f3/bdbdbd?text=No+Image';
    return url.startsWith('http') ? url : `/${url}`;
  };

  const prevImg = () => setActiveImg(i => (i - 1 + images.length) % Math.max(images.length, 1));
  const nextImg = () => setActiveImg(i => (i + 1) % Math.max(images.length, 1));

  const handleAddToCart   = () => { dispatch(addToCart(product));      toast.success(`${product.name} added to cart!`, { autoClose: 2000 }); };
  const handleToggleWish  = () => { dispatch(toggleWishlist(product)); toast.info(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!', { autoClose: 2000 }); };

  // Back to the category shop page
  const backUrl = categoryId
    ? `/shop/${gender}/${categoryName}/${categoryId}`
    : '/shop';

  // Related: other products from the same productList (same category fetch)
  const related = productList.filter(p => p.id !== product?.id).slice(0, 8);

  // ── States ─────────────────────────────────────────────────────────────────
  if (fetchState === 'FETCHING' || (!product && fetchState !== 'FAILED')) {
    return (
      <div className="w-full bg-white font-['Montserrat']">
        <BreadcrumbBar backUrl={backUrl} gender={gender} categoryName={categoryName} productName="…" />
        <Spinner />
      </div>
    );
  }

  if (fetchState === 'FAILED' || !product) {
    return (
      <div className="w-full bg-white font-['Montserrat']">
        <BreadcrumbBar backUrl={backUrl} gender={gender} categoryName={categoryName} productName="Not found" />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="font-bold text-[20px] text-[#E74040]">Product not found</p>
          <button onClick={() => history.goBack()}
            className="flex items-center gap-2 px-6 py-3 bg-[#23A6F0] text-white font-bold text-[14px]
                       rounded-[5px] border-none cursor-pointer hover:bg-[#1a8fd1] transition-colors">
            <ArrowLeft size={16} /> Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white font-['Montserrat']">

      {/* ── BREADCRUMB + BACK BUTTON ─────────────────────────────────────── */}
      <BreadcrumbBar backUrl={backUrl} gender={gender} categoryName={categoryName} productName={product.name} />

      {/* ── PRODUCT SECTION ──────────────────────────────────────────────── */}
      <section className="w-full bg-[#FAFAFA]">
        <div className="max-w-[1050px] mx-auto px-4 md:px-0 pb-[48px]">

          {/* Back button — visible above the product card on mobile, top-left on desktop */}
          <div className="pt-4 pb-2 md:pt-6 md:pb-4">
            <button
              onClick={() => history.goBack()}
              className="flex items-center gap-2 text-[#23A6F0] font-bold text-[14px]
                         bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:gap-[30px]">

            {/* ── IMAGE COLUMN ─────────────────────────────────────────────── */}
            <div className="w-full md:w-[510px] md:flex-shrink-0">

              {/* Mobile */}
              <div className="block md:hidden">
                <div className="w-[348px] mx-auto">
                  <div className="relative w-[348px] h-[277px] rounded-[5px] overflow-hidden bg-white">
                    <img src={imgSrc(activeImg)} alt={product.name} className="w-full h-full object-contain" />
                    {images.length > 1 && (
                      <>
                        <button onClick={prevImg}
                          className="absolute left-[10px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full
                                     bg-white/80 border-none cursor-pointer flex items-center justify-center shadow-sm">
                          <ChevronLeft size={18} color="#252B42" />
                        </button>
                        <button onClick={nextImg}
                          className="absolute right-[10px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full
                                     bg-white/80 border-none cursor-pointer flex items-center justify-center shadow-sm">
                          <ChevronRight size={18} color="#252B42" />
                        </button>
                      </>
                    )}
                  </div>
                  {/* Thumbnails */}
                  {images.length > 1 && (
                    <div className="flex gap-[10px] mt-[10px] overflow-x-auto pb-1">
                      {images.map((img, i) => (
                        <button key={i} onClick={() => setActiveImg(i)}
                          className={`w-[75px] h-[56px] flex-shrink-0 rounded overflow-hidden border-2 p-0 cursor-pointer transition-all
                            ${activeImg === i ? 'border-[#23A6F0]' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop */}
              <div className="hidden md:block">
                <div className="relative w-[506px] h-[450px] rounded-[5px] overflow-hidden bg-white">
                  <img src={imgSrc(activeImg)} alt={product.name}
                    className="w-full h-full object-contain transition-opacity duration-300" />
                  {images.length > 1 && (
                    <>
                      <button onClick={prevImg}
                        className="absolute left-[10px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                                   bg-white/80 border-none cursor-pointer flex items-center justify-center shadow">
                        <ChevronLeft size={20} color="#252B42" />
                      </button>
                      <button onClick={nextImg}
                        className="absolute right-[10px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                                   bg-white/80 border-none cursor-pointer flex items-center justify-center shadow">
                        <ChevronRight size={20} color="#252B42" />
                      </button>
                    </>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="flex gap-[10px] mt-[10px]">
                    {images.map((img, i) => (
                      <button key={i} onClick={() => setActiveImg(i)}
                        className={`w-[100px] h-[75px] p-0 flex-shrink-0 rounded overflow-hidden border-2 cursor-pointer transition-all
                          ${activeImg === i ? 'border-[#23A6F0]' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── INFO COLUMN ──────────────────────────────────────────────── */}
            <div className="flex-1 pt-6 md:pt-[11px] px-4 md:px-0">

              {/* Product name */}
              <h1 className="font-normal text-[20px] leading-[30px] tracking-[0.2px] text-[#252B42] m-0 mb-[11px]">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-[11px]">
                <RatingStars rating={product.rating ?? 0} />
                <span className="font-normal text-[14px] text-[#737373]">
                  {product.sell_count ?? 0} sold
                </span>
              </div>

              {/* Price */}
              <div className="mb-[11px]">
                <span className="font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42]">
                  ${Number(product.price).toFixed(2)}
                </span>
              </div>

              {/* Availability */}
              <div className="flex items-center gap-[5px] mb-[24px]">
                <span className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#737373]">
                  Availability:
                </span>
                <span className={`font-bold text-[14px] leading-[24px] tracking-[0.2px]
                  ${(product.stock ?? 0) > 0 ? 'text-[#23A6F0]' : 'text-[#E74040]'}`}>
                  {(product.stock ?? 0) > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </span>
              </div>

              {/* Description */}
              <p className="font-normal text-[14px] leading-[20px] tracking-[0.2px] text-[#858585]
                            m-0 mb-[24px] max-w-[464px]">
                {product.description}
              </p>

              <div className="h-px bg-[#BDBDBD] mb-[19px] max-w-[445px]" />

              {/* Actions */}
              <div className="flex items-center gap-[10px] flex-wrap">
                <button
                  onClick={handleAddToCart}
                  disabled={(product.stock ?? 0) === 0}
                  className={`w-[148px] h-[44px] flex-shrink-0 border-none rounded-[5px] cursor-pointer
                    font-['Montserrat'] font-bold text-[14px] leading-[24px] tracking-[0.2px] transition-colors duration-200
                    ${(product.stock ?? 0) > 0
                      ? 'bg-[#23A6F0] text-white hover:bg-[#1a8fd1]'
                      : 'bg-[#BDBDBD] text-white cursor-not-allowed'}`}
                >
                  Add to Cart
                </button>

                <IconRoundBtn onClick={handleToggleWish} title="Wishlist" active={isWishlisted}>
                  <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
                </IconRoundBtn>

                <IconRoundBtn onClick={handleAddToCart} title="Add to Cart">
                  <ShoppingCart size={16} />
                </IconRoundBtn>

                <IconRoundBtn title="Share">
                  <Share2 size={16} />
                </IconRoundBtn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TAB NAVIGATION ───────────────────────────────────────────────── */}
      <div className="w-full bg-white border-b border-[#ECECEC]">
        <div className="max-w-[1050px] mx-auto">
          <nav className="flex items-center">
            {[
              { key: 'description', label: 'Description' },
              { key: 'additional',  label: 'Additional Information' },
              { key: 'reviews',     label: `Reviews` },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={[
                  'px-[24px] py-[24px] border-none bg-transparent cursor-pointer shrink-0',
                  "font-['Montserrat'] font-bold text-[14px] leading-[24px] tracking-[0.2px]",
                  'transition-colors duration-200 border-b-2 -mb-px',
                  activeTab === tab.key
                    ? 'text-[#737373] border-b-[#23856D]'
                    : 'text-[#737373] border-b-transparent hover:text-[#252B42]',
                ].join(' ')}>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ── TAB CONTENT ─────────────────────────────────────────────────── */}
      <section className="w-full bg-white py-[48px]">
        <div className="w-[332px] mx-auto md:max-w-[1100px] md:w-auto md:px-0">

          {activeTab === 'description' && (
            <div className="flex flex-col md:flex-row gap-[30px]">
              <div className="w-full md:w-[337px] md:flex-shrink-0 h-[292px] md:h-[392px]
                              rounded-[9px] overflow-hidden bg-[rgba(196,196,196,0.2)]">
                <img src={imgSrc(0)} alt={product.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col gap-[30px] md:w-[332px] md:flex-shrink-0 py-[25px] md:pt-0">
                <h2 className="font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42] m-0">
                  {product.name}
                </h2>
                <p className="font-normal text-[14px] leading-[20px] tracking-[0.2px] text-[#737373] m-0">
                  {product.description}
                </p>
                <p className="font-normal text-[14px] leading-[20px] tracking-[0.2px] text-[#737373] m-0">
                  Met minim Mollie non desert Alamo est sit cliquey dolor do met sent. RELIT official consequent door ENIM RELIT Mollie.
                </p>
                <p className="font-normal text-[14px] leading-[20px] tracking-[0.2px] text-[#737373] m-0">
                  Excitation venial consequent sent nostrum met. RELIT official consequent door ENIM RELIT Mollie.
                </p>
              </div>
              <div className="flex flex-col md:w-[332px] md:flex-shrink-0">
                <div className="flex flex-col gap-[30px] pb-[25px]">
                  <h2 className="font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42] m-0">
                    the quick fox jumps over
                  </h2>
                  <ul className="flex flex-col gap-[10px] p-0 m-0 list-none max-w-[303px]">
                    {Array(4).fill('the quick fox jumps over the lazy dog').map((item, i) => (
                      <li key={i} className="flex items-start gap-[20px]">
                        <svg width="9" height="16" viewBox="0 0 9 16" fill="none" className="mt-1 flex-shrink-0">
                          <path d="M1 1L8 8L1 15" stroke="#737373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#737373]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-[30px] pt-[25px]">
                  <h2 className="font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42] m-0">
                    the quick fox jumps over
                  </h2>
                  <ul className="flex flex-col gap-[10px] p-0 m-0 list-none max-w-[303px]">
                    {Array(3).fill('the quick fox jumps over the lazy dog').map((item, i) => (
                      <li key={i} className="flex items-start gap-[20px]">
                        <svg width="9" height="16" viewBox="0 0 9 16" fill="none" className="mt-1 flex-shrink-0">
                          <path d="M1 1L8 8L1 15" stroke="#737373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#737373]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'additional' && (
            <div className="max-w-[680px]">
              <h2 className="font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42] mb-6">
                Additional Information
              </h2>
              <div className="flex flex-col">
                {[
                  ['Product ID',   product.id],
                  ['Store ID',     product.store_id ?? '—'],
                  ['Category ID',  product.category_id ?? '—'],
                  ['Rating',       `${Number(product.rating).toFixed(2)} / 5`],
                  ['Sold',         `${product.sell_count ?? 0} units`],
                  ['Stock',        product.stock ?? 0],
                  ['SKU',          `BND-${String(product.id).padStart(5, '0')}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-4 py-3 border-b border-[#E8E8E8]">
                    <span className="font-bold text-[14px] text-[#252B42] w-[120px] shrink-0">{k}</span>
                    <span className="font-normal text-[14px] text-[#737373]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-[680px]">
              <h2 className="font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42] mb-6">
                Customer Reviews
              </h2>
              <div className="flex items-center gap-4 mb-8 p-6 bg-[#FAFAFA] rounded-[9px]">
                <span className="font-bold text-[48px] leading-none text-[#252B42]">
                  {Number(product.rating).toFixed(1)}
                </span>
                <div className="flex flex-col gap-2">
                  <RatingStars rating={product.rating ?? 0} />
                  <span className="font-normal text-[14px] text-[#737373]">
                    Based on {product.sell_count ?? 0} purchases
                  </span>
                </div>
              </div>
              {['Alice', 'Bob', 'Carol'].map((name, i) => (
                <div key={i} className="flex flex-col gap-2 pb-6 mb-6 border-b border-[#E8E8E8] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#23A6F0] flex items-center justify-center text-white font-bold text-[14px] shrink-0">
                      {name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-[14px] text-[#252B42] m-0">{name}</p>
                      <RatingStars rating={5} />
                    </div>
                  </div>
                  <p className="font-normal text-[14px] text-[#737373] leading-5 m-0">
                    Great quality product, highly recommend!
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── RELATED PRODUCTS ─────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="w-full bg-[#FAFAFA] py-[48px]">
          <div className="hidden md:block max-w-[1124px] mx-auto px-6">
            <div className="flex flex-col items-start gap-[10px] mb-[24px]">
              <h2 className="font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42] m-0">
                BESTSELLER PRODUCTS
              </h2>
              <div className="w-full h-[2px] bg-[#ECECEC]" />
            </div>
            <div className="grid grid-cols-4 gap-[30px]">
              {related.slice(0, 4).map(p => (
                <ProductCard key={p.id} product={p} cardWidth="w-full" imageHeight="h-[280px]" />
              ))}
            </div>
          </div>
          <div className="block md:hidden w-[331px] mx-auto">
            <h2 className="font-bold text-[24px] text-[#252B42] text-center m-0 mb-4">
              BESTSELLER PRODUCTS
            </h2>
            <div className="flex flex-col gap-[30px]">
              {related.slice(0, 4).map(p => (
                <ProductCard key={p.id} product={p} cardWidth="w-[331px]" imageHeight="h-[350px]" />
              ))}
            </div>
          </div>
        </section>
      )}

      <BrandLogos />
    </div>
  );
}

// ── Breadcrumb bar ────────────────────────────────────────────────────────────
function BreadcrumbBar({ backUrl, gender, categoryName, productName }) {
  return (
    <div className="w-full bg-[#FAFAFA]">
      <div className="max-w-[1050px] mx-auto px-4 md:px-6 py-[24px]">
        <nav className="flex items-center gap-[10px] flex-wrap">
          <Link to="/"
            className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#252B42] no-underline hover:text-[#23A6F0]">
            Home
          </Link>
          <Chevron />
          <Link to="/shop"
            className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#252B42] no-underline hover:text-[#23A6F0]">
            Shop
          </Link>
          {categoryName && (
            <>
              <Chevron />
              <Link to={backUrl}
                className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#252B42] no-underline hover:text-[#23A6F0] capitalize">
                {categoryName}
              </Link>
            </>
          )}
          <Chevron />
          <span className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#BDBDBD] truncate max-w-[200px]">
            {productName}
          </span>
        </nav>
      </div>
    </div>
  );
}

function Chevron() {
  return (
    <svg width="9" height="16" viewBox="0 0 9 16" fill="none" className="shrink-0">
      <path d="M1 1L8 8L1 15" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
