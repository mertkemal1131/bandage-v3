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

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));
  const dispatch = useDispatch();
  const isWishlisted = useSelector(s => s.wishlist.items.some(i => i.id === product?.id));

  const [activeImg, setActiveImg]         = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [activeTab, setActiveTab]         = useState('description');

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

      {/* ── BREADCRUMB ─────────────────────────────────────────────────────── */}
      {/* Desktop: max-w-1050, px-6, py-24 | Mobile: centered, same bg #FAFAFA */}
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

      {/* ── PRODUCT SECTION ────────────────────────────────────────────────── */}
      {/* bg #FAFAFA | Desktop: 1050px 2-col | Mobile: stacked, 348px container */}
      <section className="w-full bg-[#FAFAFA]">
        <div className="max-w-[1050px] mx-auto px-4 md:px-0 pb-[48px]">
          <div className="flex flex-col md:flex-row md:gap-[30px]">

            {/* IMAGE COLUMN */}
            <div className="w-full md:w-[510px] md:flex-shrink-0">

              {/* Mobile carousel — 348×277 image + 2 thumbnails */}
              {/* Figma: carousel 348×394, inner 348×277, indicators 219×75 */}
              <div className="block md:hidden pt-[48px]">
                <div className="w-[348px] mx-auto">
                  {/* Main image */}
                  <div className="relative w-[348px] h-[277px] rounded-[5px] overflow-hidden bg-white">
                    <img src={`/${thumbImgs[activeImg]}`} alt={product.name}
                      className="w-full h-full object-contain" />
                    {/* Figma: prev at left 40px, top 119px */}
                    <button onClick={prevImg}
                      className="absolute left-[40px] top-[119px] w-6 h-[44px]
                                 bg-transparent border-none cursor-pointer
                                 flex items-center justify-center">
                      <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
                    </button>
                    {/* Figma: next at left 289px, top 119px */}
                    <button onClick={nextImg}
                      className="absolute left-[289px] top-[119px] w-6 h-[44px]
                                 bg-transparent border-none cursor-pointer
                                 flex items-center justify-center">
                      <ChevronRight size={24} color="#FFFFFF" strokeWidth={2.5} />
                    </button>
                  </div>
                  {/* Thumbnails — 219px wide, 2×100px, second at opacity 0.5 */}
                  <div className="flex gap-[19px] mt-[10px]" style={{ width: '219px' }}>
                    {thumbImgs.slice(0, 2).map((src, i) => (
                      <button key={i} onClick={() => setActiveImg(i)}
                        className={[
                          'w-[100px] h-[75px] p-0 border-none cursor-pointer flex-shrink-0',
                          'overflow-hidden rounded transition-opacity duration-200',
                          activeImg === i ? 'opacity-100' : 'opacity-50',
                        ].join(' ')}>
                        <img src={`/${src}`} alt="" className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop carousel — 506×450 main + 2 thumbnails below */}
              <div className="hidden md:block">
                <div className="relative w-[506px] h-[450px] rounded-[5px] overflow-hidden bg-white">
                  <img src={`/${thumbImgs[activeImg]}`} alt={product.name}
                    className="w-full h-full object-contain transition-opacity duration-300" />
                  {/* Figma: prev at left 40px */}
                  <button onClick={prevImg}
                    className="absolute left-[40px] top-1/2 -translate-y-1/2 w-6 h-[44px]
                               bg-transparent border-none cursor-pointer flex items-center justify-center">
                    <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
                  </button>
                  {/* Figma: next at left 447px */}
                  <button onClick={nextImg}
                    className="absolute left-[447px] top-1/2 -translate-y-1/2 w-6 h-[44px]
                               bg-transparent border-none cursor-pointer flex items-center justify-center">
                    <ChevronRight size={24} color="#FFFFFF" strokeWidth={2.5} />
                  </button>
                </div>
                {/* Thumbnails — 219px wide, 2×100×75, gap 19px */}
                <div className="flex gap-[19px] mt-[10px]" style={{ width: '219px' }}>
                  {thumbImgs.slice(0, 2).map((src, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={[
                        'w-[100px] h-[75px] p-0 border-none cursor-pointer flex-shrink-0',
                        'overflow-hidden rounded transition-opacity duration-200',
                        activeImg === i ? 'opacity-100' : 'opacity-50',
                      ].join(' ')}>
                      <img src={`/${src}`} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PRODUCT INFO COLUMN */}
            {/* Figma col-md-6: 510×471px desktop | 348×471px mobile */}
            {/* h4 name (20/400) | Frame31 stars+reviews | h5 price | availability | description | hr | colors | actions */}
            <div className="flex-1 pt-6 md:pt-[11px] px-4 md:px-0">

              {/* h4 — product name, 20px weight 400 */}
              <h1 className="font-normal text-[20px] leading-[30px] tracking-[0.2px] text-[#252B42]
                             m-0 mb-[11px]">
                {product.name}
              </h1>

              {/* Frame 31 — stars + "10 Reviews" */}
              <div className="flex items-center gap-[10px] mb-[11px]">
                <Stars rating={product.rating} size={22} />
                <span className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#737373]">
                  {product.reviews} Reviews
                </span>
              </div>

              {/* h5 — price, bold 24px */}
              <div className="mb-[11px]">
                <span className="font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42]">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {/* Availability: "Availability :" + "In Stock" */}
              <div className="flex items-center gap-[5px] mb-[56px]">
                <span className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#737373]">
                  Availability :
                </span>
                <span className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#23A6F0]">
                  In Stock
                </span>
              </div>

              {/* Description — 464px desktop, 271px mobile */}
              <p className="font-normal text-[14px] leading-[20px] tracking-[0.2px] text-[#858585]
                            m-0 mb-[87px] max-w-[271px] md:max-w-[464px]">
                {product.description}
              </p>

              {/* hr — 283px mobile / 445px desktop, 1px #BDBDBD */}
              <div className="h-px bg-[#BDBDBD] mb-[19px] w-[283px] md:w-[445px]" />

              {/* product-colors — 4 × 30px circles, gap 10px */}
              <div className="flex items-center gap-[10px] mb-[30px]">
                {product.colors.map((color, i) => (
                  <button key={i} onClick={() => setSelectedColor(i)} title={color}
                    className={[
                      'w-[30px] h-[30px] rounded-full border-none cursor-pointer transition-all duration-200',
                      selectedColor === i ? 'ring-2 ring-offset-2 ring-[#252B42]' : 'hover:scale-110',
                    ].join(' ')}
                    style={{ backgroundColor: color }} />
                ))}
              </div>

              {/* product-actions — gap 10px */}
              {/* Figma: "Select Options" btn 148×44 + like + basket + more (40×40 circles) */}
              <div className="flex items-center gap-[10px] flex-wrap">
                <button onClick={addToCart}
                  className={[
                    'w-[148px] h-[44px] bg-[#23A6F0] text-white flex-shrink-0',
                    'border-none rounded-[5px] cursor-pointer',
                    "font-['Montserrat'] font-bold text-[14px] leading-[24px] tracking-[0.2px]",
                    'hover:bg-[#1a8fd1] transition-colors duration-200',
                  ].join(' ')}>
                  Select Options
                </button>

                <IconRoundBtn onClick={toggleWish} title="Wishlist" active={isWishlisted}>
                  <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
                </IconRoundBtn>

                <IconRoundBtn onClick={addToCart} title="Add to Cart">
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

      {/* ── TAB NAVIGATION ─────────────────────────────────────────────────── */}
      {/* Figma navbar-style-3: bg white, 91px, border-bottom #ECECEC */}
      {/* Tabs: Description | Additional Information | Reviews (N) */}
      <div className="w-full bg-white border-b border-[#ECECEC]">
        <div className="max-w-[1050px] mx-auto">
          <nav className="flex items-center">
            {[
              { key: 'description', label: 'Description' },
              { key: 'additional',  label: 'Additional Information' },
              { key: 'reviews',     label: 'Reviews (0)' },
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

      {/* ── DESCRIPTION / TAB CONTENT ──────────────────────────────────────── */}
      {/* Figma desktop: bg white, container 1056px, 3 cols */}
      {/* Figma mobile:  bg white, container 332px centered, stacked */}
      <section className="w-full bg-white py-[48px]">
        <div className="w-[332px] mx-auto md:max-w-[1100px] md:w-auto md:px-0">

          {/* DESCRIPTION TAB — 3 col: image | text | two lists */}
          {activeTab === 'description' && (
            <div className="flex flex-col md:flex-row gap-[30px]">

              {/* Col 1: image card — 337×392 desktop, 332×292 mobile */}
              <div className="w-full md:w-[337px] md:flex-shrink-0
                              h-[292px] md:h-[392px] rounded-[9px] overflow-hidden
                              bg-[rgba(196,196,196,0.2)]">
                <img src={`/${product.image}`} alt={product.name}
                  className="w-full h-full object-contain" />
              </div>

              {/* Col 2: title + 3 paragraphs */}
              {/* Figma: card-item flex-col padding 25px 0, gap 30px */}
              <div className="flex flex-col gap-[30px] md:w-[332px] md:flex-shrink-0 py-[25px] md:pt-0">
                <h2 className="font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42] m-0">
                  the quick fox jumps over
                </h2>
                {[
                  'Met minim Mollie non desert Alamo est sit cliquey dolor do met sent. RELIT official consequent door ENIM RELIT Mollie. Excitation venial consequent sent nostrum met.',
                  'Met minim Mollie non desert Alamo est sit cliquey dolor do met sent. RELIT official consequent door ENIM RELIT Mollie. Excitation venial consequent sent nostrum met.',
                  'Met minim Mollie non desert Alamo est sit cliquey dolor do met sent. RELIT official consequent door ENIM RELIT Mollie. Excitation venial consequent sent nostrum met.',
                ].map((text, i) => (
                  <p key={i} className="font-normal text-[14px] leading-[20px] tracking-[0.2px] text-[#737373] m-0">
                    {text}
                  </p>
                ))}
              </div>

              {/* Col 3: two bulleted list blocks */}
              <div className="flex flex-col md:w-[332px] md:flex-shrink-0">

                {/* List block 1 — gap 30px */}
                <div className="flex flex-col gap-[30px] pb-[25px]">
                  <h2 className="font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42] m-0">
                    the quick fox jumps over
                  </h2>
                  <ul className="flex flex-col gap-[10px] p-0 m-0 list-none max-w-[303px]">
                    {Array(4).fill('the quick fox jumps over the lazy dog').map((item, i) => (
                      <li key={i} className="flex items-start gap-[20px]">
                        {/* Figma: icn arrow-right 9×16px #737373 */}
                        <svg width="9" height="16" viewBox="0 0 9 16" fill="none" className="mt-1 flex-shrink-0">
                          <path d="M1 1L8 8L1 15" stroke="#737373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#737373]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* List block 2 */}
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
                {[
                  ['Material', '100% Cotton'],
                  ['Fit',      'Regular Fit'],
                  ['Care',     'Machine wash cold'],
                  ['Origin',   'Made in USA'],
                  ['SKU',      `BND-${String(product.id).padStart(4, '0')}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-4 py-3 border-b border-[#E8E8E8]">
                    <span className="font-bold text-[14px] text-[#252B42] w-[120px] shrink-0">{k}</span>
                    <span className="font-normal text-[14px] text-[#737373]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div className="max-w-[680px]">
              <h2 className="font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42] mb-6">
                Customer Reviews
              </h2>
              <div className="flex items-center gap-4 mb-8 p-6 bg-[#FAFAFA] rounded-[9px]">
                <span className="font-bold text-[48px] leading-none text-[#252B42]">{product.rating}.0</span>
                <div className="flex flex-col gap-2">
                  <Stars rating={product.rating} size={20} />
                  <span className="font-normal text-[14px] text-[#737373]">Based on {product.reviews} reviews</span>
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
                      <Stars rating={5} size={12} />
                    </div>
                  </div>
                  <p className="font-normal text-[14px] text-[#737373] leading-5 m-0">
                    We focus on ergonomics and meeting you where you work. Great quality product, highly recommend!
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── BESTSELLER PRODUCTS ─────────────────────────────────────────────── */}
      {/* Desktop: bg #FAFAFA, 1124px container, 4-col × 2-row grid, gap 30px   */}
      {/* Mobile:  bg #FAFAFA, 331px container, single column, gap 30px          */}
      <section className="w-full bg-[#FAFAFA] py-[48px]">

        {/* Desktop */}
        <div className="hidden md:block max-w-[1124px] mx-auto px-6">
          <div className="flex flex-col items-start gap-[10px] mb-[24px]">
            <h2 className="font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42] m-0">
              BESTSELLER PRODUCTS
            </h2>
            <div className="w-full h-[2px] bg-[#ECECEC]" />
          </div>
          <div className="grid grid-cols-4 gap-[30px] mb-[30px]">
            {related.slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} cardWidth="w-full" imageHeight="h-[280px]" />
            ))}
          </div>
          {related.length > 4 && (
            <div className="grid grid-cols-4 gap-[30px]">
              {related.slice(4, 8).map(p => (
                <ProductCard key={p.id} product={p} cardWidth="w-full" imageHeight="h-[280px]" />
              ))}
            </div>
          )}
        </div>

        {/* Mobile — single column, 331px container, cards 348×589 */}
        {/* Figma: container 331px centered, row flex-col gap-30px */}
        <div className="block md:hidden w-[331px] mx-auto">
          <div className="flex flex-col items-center gap-[10px] mb-[24px]">
            <h2 className="font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42] text-center m-0">
              BESTSELLER PRODUCTS
            </h2>
            {/* Figma: Line 1 — 331px, 1px solid #ECECEC */}
            <div className="w-[331px] h-px bg-[#ECECEC]" />
          </div>
          {/* Figma mobile card: fixed-height 348×427, info 162px → total 589px */}
          <div className="flex flex-col gap-[30px]">
            {related.slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} cardWidth="w-[348px]" imageHeight="h-[427px]" />
            ))}
          </div>
        </div>
      </section>

      {/* BRAND LOGOS */}
      <BrandLogos />

    </div>
  );
}