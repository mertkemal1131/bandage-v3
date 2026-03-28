import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Heart, ShoppingCart, ChevronRight, ChevronLeft, Share2 } from 'lucide-react';
import { products } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import BrandLogos from '../components/BrandLogos';
import Stars from '../components/Stars';

function IconRoundBtn({ children, active = false, onClick, title }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={[
        'w-[40px] h-[40px] rounded-full flex items-center justify-center',
        'border cursor-pointer transition-all duration-200',
        active
          ? 'border-[#23A6F0] bg-[#23A6F0] text-white'
          : 'border-[#E8E8E8] bg-white text-[#252B42] hover:border-[#23A6F0] hover:text-[#23A6F0]',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

/* ─── main component ─────────────────────────────────────────────────────── */
export default function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));
  const dispatch = useDispatch();
  const isWishlisted = useSelector(s => s.wishlist.items.some(i => i.id === product?.id));

  const [activeImg, setActiveImg]       = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize]  = useState(null);
  const [activeTab, setActiveTab]        = useState('description');

  if (!product) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 font-['Montserrat']">
      <p className="text-[20px] font-bold text-[#737373]">Product not found</p>
      <Link to="/shop" className="text-[#23A6F0] font-bold no-underline">Back to Shop</Link>
    </div>
  );

  const thumbImgs = [product.image, product.image, product.image];
  const related   = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 8);

  const addToCart  = () => { dispatch({ type: 'ADD_TO_CART', payload: product }); toast.success(`${product.name} added to cart!`, { autoClose: 2000 }); };
  const toggleWish = () => { dispatch({ type: 'TOGGLE_WISHLIST', payload: product }); toast.info(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!', { autoClose: 2000 }); };
  const prevImg    = () => setActiveImg(i => (i - 1 + thumbImgs.length) % thumbImgs.length);
  const nextImg    = () => setActiveImg(i => (i + 1) % thumbImgs.length);

  return (
    <div className="w-full bg-white font-['Montserrat']">

      {/* ══════════════════════════════════════════════
          BREADCRUMB — bg #FAFAFA
      ══════════════════════════════════════════════ */}
      <div className="w-full bg-[#FAFAFA]">
        <div className="max-w-[1050px] mx-auto px-4 md:px-6 py-[24px]">
          <nav className="flex items-center gap-[15px]">
            <Link to="/"
              className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#252B42] no-underline">
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

      {/* ══════════════════════════════════════════════
          PRODUCT SECTION — bg #FAFAFA
          Desktop: 2-col (image | info), 1050px container
          Mobile: stacked column
      ══════════════════════════════════════════════ */}
      <section className="w-full bg-[#FAFAFA]">
        <div className="max-w-[1050px] mx-auto px-4 md:px-0 pb-[48px]">
          <div className="flex flex-col md:flex-row md:gap-[30px]">

            {/* ── IMAGE COLUMN ────────────────────────────────────── */}
            <div className="w-full md:w-[510px] md:flex-shrink-0">

              {/* Mobile: full-width with arrows + dots */}
              <div className="block md:hidden relative w-full pt-4 pb-2">
                <div className="w-full h-[340px] overflow-hidden rounded-[5px] bg-white">
                  <img src={`/${thumbImgs[activeImg]}`} alt={product.name}
                    className="w-full h-full object-contain" />
                </div>
                <button onClick={prevImg}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80
                             border-none shadow flex items-center justify-center cursor-pointer">
                  <ChevronLeft size={18} color="#252B42" />
                </button>
                <button onClick={nextImg}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80
                             border-none shadow flex items-center justify-center cursor-pointer">
                  <ChevronRight size={18} color="#252B42" />
                </button>
                <div className="flex justify-center gap-2 mt-3">
                  {thumbImgs.map((_, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-[8px] h-[8px] rounded-full border-none cursor-pointer transition-all
                        ${activeImg === i ? 'bg-[#23A6F0]' : 'bg-[#BDBDBD]'}`} />
                  ))}
                </div>
              </div>

              {/* Desktop: 506×450 main + 100×75 thumbnail strip */}
              <div className="hidden md:block pt-0">
                <div className="relative w-[506px] h-[450px] rounded-[5px] overflow-hidden bg-white">
                  <img src={`/${thumbImgs[activeImg]}`} alt={product.name}
                    className="w-full h-full object-contain transition-opacity duration-300" />
                  {/* prev arrow */}
                  <button onClick={prevImg}
                    className="absolute left-[40px] top-1/2 -translate-y-1/2 w-6 h-[44px]
                               bg-transparent border-none cursor-pointer flex items-center justify-center">
                    <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
                  </button>
                  {/* next arrow */}
                  <button onClick={nextImg}
                    className="absolute right-[40px] top-1/2 -translate-y-1/2 w-6 h-[44px]
                               bg-transparent border-none cursor-pointer flex items-center justify-center">
                    <ChevronRight size={24} color="#FFFFFF" strokeWidth={2.5} />
                  </button>
                </div>
                {/* thumbnails — 100×75, gap 19px, at bottom */}
                <div className="flex gap-[19px] mt-[10px]">
                  {thumbImgs.map((src, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-[100px] h-[75px] rounded overflow-hidden p-0 border-2 cursor-pointer flex-shrink-0
                        transition-all duration-200
                        ${activeImg === i ? 'border-[#23A6F0]' : 'border-transparent opacity-50 hover:opacity-100'}`}>
                      <img src={`/${src}`} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── PRODUCT INFO COLUMN ─────────────────────────────── */}
            {/*
              Figma col-md-6: 510×471px
              h4: 20px 400 weight — product name
              Stars + "10 Reviews"
              h5 price 24px bold
              Availability: In Stock
              paragraph description
              hr
              color swatches (30px circles)
              action row: Add to Cart btn + icon buttons
            */}
            <div className="flex-1 pt-6 md:pt-[11px]">

              {/* h4 — name, 20px 400 */}
              <h1 className="font-normal text-[20px] leading-[30px] tracking-[0.2px] text-[#252B42] m-0 mb-3">
                {product.name}
              </h1>

              

              {/* h5 price — 24px bold */}
              <div className="mb-3">
                <span className="font-bold text-[24px] leading-[32px] tracking-[0.1px] text-center text-[#252B42]">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {/* Availability — "Availability : In Stock" */}
              <div className="flex items-center gap-[5px] mb-4">
                <span className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#737373]">
                  Availability :
                </span>
                <span className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#23A6F0]">
                  In Stock
                </span>
              </div>

              {/* Description paragraph — max 464px */}
              <p className="font-normal text-[14px] leading-[20px] tracking-[0.2px] text-[#858585] m-0 mb-5 max-w-[464px]">
                {product.description}
              </p>

              {/* hr — 445px wide, 1px #BDBDBD */}
              <div className="w-full max-w-[445px] h-px bg-[#BDBDBD] mb-5" />

              {/* Color swatches — 4 × 30px circles */}
              <div className="flex items-center gap-[10px] mb-6">
                {product.colors.map((color, i) => (
                  <button key={i} onClick={() => setSelectedColor(i)} title={color}
                    className={[
                      'w-[30px] h-[30px] rounded-full border-none cursor-pointer transition-all duration-200',
                      selectedColor === i ? 'ring-2 ring-offset-2 ring-[#252B42]' : 'hover:scale-110',
                    ].join(' ')}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>


              {/* product-actions — Figma: flex-row, gap 10px, 298px */}
              {/* Add to Cart: 148×44 bg #23A6F0; like/basket/more: 40×40 circle */}
              <div className="flex items-center gap-[10px] flex-wrap">
                <button onClick={addToCart}
                  className={[
                    'flex items-center justify-center gap-2',
                    'w-[148px] h-[44px] bg-[#23A6F0] text-white',
                    'border-none rounded-[5px] cursor-pointer',
                    "font-['Montserrat'] font-bold text-[14px] leading-[24px] tracking-[0.2px]",
                    'hover:bg-[#1a8fd1] transition-colors duration-200',
                  ].join(' ')}
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>

                {/* like */}
                <IconRoundBtn onClick={toggleWish} title="Wishlist" active={isWishlisted}>
                  <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
                </IconRoundBtn>

                {/* basket */}
                <IconRoundBtn onClick={addToCart} title="Quick Add">
                  <ShoppingCart size={16} />
                </IconRoundBtn>

                {/* more */}
                <IconRoundBtn title="Share">
                  <Share2 size={16} />
                </IconRoundBtn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TAB NAV — navbar-style-3 pattern
          Figma: Description | Additional Info | Reviews
          1440px, 91px height, border-bottom #ECECEC
      ══════════════════════════════════════════════ */}
      <div className="w-full bg-white border-b border-[#ECECEC]">
        <div className="max-w-[1050px] mx-auto px-4 md:px-6">
          <div className="flex items-center overflow-x-auto gap-0">
            {[
              { key: 'description', label: 'Description' },
              { key: 'additional',  label: 'Additional Information' },
              { key: 'reviews',     label: `Reviews (${product.reviews})` },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={[
                  'px-6 py-[24px] border-none bg-transparent cursor-pointer shrink-0 -mb-px',
                  "font-['Montserrat'] font-bold text-[14px] leading-[24px] tracking-[0.2px]",
                  'transition-colors duration-200 border-b-2',
                  activeTab === tab.key
                    ? 'text-[#252B42] border-b-[#23856D]'
                    : 'text-[#737373] border-b-transparent hover:text-[#252B42]',
                ].join(' ')}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          DESCRIPTION SECTION — desktop-product-description-1
          Figma: 3-col, col1=image card 337×392, col2=text, col3=two lists
          bg white, pt 108px desktop
      ══════════════════════════════════════════════ */}
      <section className="w-full bg-white py-[48px] md:pt-[64px] md:pb-[64px]">
        <div className="max-w-[1056px] mx-auto px-4 md:px-6">

          {/* DESCRIPTION TAB */}
          {activeTab === 'description' && (
            <div className="flex flex-col md:flex-row gap-[30px]">

              {/* Col 1: image — 337×392 rounded card */}
              <div className="w-full md:w-[337px] md:flex-shrink-0 h-[280px] md:h-[392px] rounded-[9px] overflow-hidden bg-[rgba(196,196,196,0.2)]">
                <img src={`/${product.image}`} alt={product.name}
                  className="w-full h-full object-cover" />
              </div>

              {/* Col 2: title + paragraphs */}
              <div className="flex flex-col gap-[30px] md:w-[332px] md:flex-shrink-0 pb-[25px]">
                <h2 className="font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42] m-0">
                  the quick fox jumps over
                </h2>
                {['Met minim Mollie non desert Alamo est sit cliquey dolor do met sent. RELIT official consequent door ENIM RELIT Mollie. Excitation venial consequent sent nostrum met.',
                  'Met minim Mollie non desert Alamo est sit cliquey dolor do met sent. RELIT official consequent door ENIM RELIT Mollie. Excitation venial consequent sent nostrum met.',
                  'Met minim Mollie non desert Alamo est sit cliquey dolor do met sent. RELIT official consequent door ENIM RELIT Mollie. Excitation venial consequent sent nostrum met.',
                ].map((text, i) => (
                  <p key={i} className="font-normal text-[14px] leading-[20px] tracking-[0.2px] text-[#737373] m-0">
                    {text}
                  </p>
                ))}
              </div>

              {/* Col 3: two bulleted list blocks */}
              <div className="flex flex-col gap-[30px] flex-1">
                {/* list 1 */}
                <div className="flex flex-col gap-[30px]">
                  <h2 className="font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42] m-0">
                    the quick fox jumps over
                  </h2>
                  <ul className="flex flex-col gap-[10px] p-0 m-0 list-none">
                    {Array(4).fill('the quick fox jumps over the lazy dog').map((item, i) => (
                      <li key={i} className="flex items-start gap-[20px]">
                        <svg width="9" height="16" viewBox="0 0 9 16" fill="none" className="mt-[4px] flex-shrink-0">
                          <path d="M1 1L8 8L1 15" stroke="#737373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#737373]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* list 2 */}
                <div className="flex flex-col gap-[30px]">
                  <h2 className="font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42] m-0">
                    the quick fox jumps over
                  </h2>
                  <ul className="flex flex-col gap-[10px] p-0 m-0 list-none">
                    {Array(3).fill('the quick fox jumps over the lazy dog').map((item, i) => (
                      <li key={i} className="flex items-start gap-[20px]">
                        <svg width="9" height="16" viewBox="0 0 9 16" fill="none" className="mt-[4px] flex-shrink-0">
                          <path d="M1 1L8 8L1 15" stroke="#737373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#737373]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ADDITIONAL INFO TAB */}
          {activeTab === 'additional' && (
            <div className="max-w-[680px]">
              <h2 className="font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42] mb-6">
                Additional Information
              </h2>
              <div className="flex flex-col">
                {[['Material','100% Cotton'],['Fit','Regular Fit'],['Care','Machine wash cold'],['Origin','Made in USA'],['SKU',`BND-${String(product.id).padStart(4,'0')}`]].map(([k,v]) => (
                  <div key={k} className="flex gap-4 py-3 border-b border-[#E8E8E8]">
                    <span className="font-bold text-[14px] text-[#252B42] w-[120px] shrink-0">{k}</span>
                    <span className="font-normal text-[14px] text-[#737373]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          BESTSELLER PRODUCTS — desktop-product-cards-15
          Figma: bg #FAFAFA, 4-col grid, 2 rows
          Container 1124px, padding 48px, gap 30px
          Product card: 239×442 (img 280px + info 162px)
      ══════════════════════════════════════════════ */}
      <section className="w-full bg-[#FAFAFA] py-[48px]">
        <div className="max-w-[1124px] mx-auto px-4 md:px-6">

          {/* Section header — h3 title + hr rule */}
          <div className="flex flex-col items-start gap-[10px] mb-[24px]">
            <h2 className="font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42] m-0">
              BESTSELLER PRODUCTS
            </h2>
            <div className="w-full h-[2px] bg-[#ECECEC]" />
          </div>

          {/* Row 1 — 4 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[30px] mb-[30px]">
            {related.slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} cardWidth="w-full" imageHeight="h-[280px]" />
            ))}
          </div>

          {/* Row 2 — 4 more cards */}
          {related.length > 4 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[30px]">
              {related.slice(4, 8).map(p => (
                <ProductCard key={p.id} product={p} cardWidth="w-full" imageHeight="h-[280px]" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BRAND LOGOS — desktop-clients-1 */}
      <BrandLogos />

    </div>
  );
}
