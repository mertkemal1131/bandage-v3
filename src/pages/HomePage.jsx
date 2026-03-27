import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { TrendingUp, Heart, ShoppingCart, Eye, Star, Tag, Calendar, BarChart2, ArrowRight, BookOpen, BookMarked } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import ProductCard from '../components/ProductCard'
import BrandLogos from '../components/BrandLogos'
import { products, featuredPosts } from '../data/mockData'

// ── Hero Slider ───────────────────────────────────────────────────────────────
const heroSlides = [
  {
    season: 'SUMMER 2024',
    title: 'NEW COLLECTION',
    desc: 'We know how much it matters in what you wear, and how important these details can be.',
    img: '/hero-model.png',
    bg: 'bg-[linear-gradient(90deg,#96E9FB_0%,#ABECD6_100%)]',
  },
  {
    season: 'FALL 2024',
    title: 'AUTUMN STYLES',
    desc: 'Discover our curated selection of warm tones and cozy textures for the season ahead.',
    img: '/hero-model.png',
    bg: 'bg-[linear-gradient(90deg,#F9D4A0_0%,#F6A96B_100%)]',
  },
  {
    season: 'WINTER 2024',
    title: 'COLD SEASON FITS',
    desc: 'Stay warm and stylish with our latest winter collection, designed for every occasion.',
    img: '/hero-model.png',
    bg: 'bg-[linear-gradient(90deg,#C3CFE2_0%,#B8D4F0_100%)]',
  },
]

function Hero() {
  return (
    <section className="w-full bg-[#FAFAFA] p-3 md:p-6">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="w-full max-w-[1292px] mx-auto rounded-[20px] overflow-hidden"
      >
        {heroSlides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className={`w-full ${slide.bg} relative flex flex-col items-center md:flex-row md:items-center md:h-[500px] min-h-[904px] md:min-h-0`}>
              <div className="absolute right-[8%] top-[5%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-white/40 pointer-events-none" />
              <div className="absolute left-[38%] top-[8%] w-12 h-12 md:w-20 md:h-20 rounded-full bg-white/50 pointer-events-none" />
              <div className="absolute right-[4%] top-[27%] w-[10px] h-[10px] md:w-[15px] md:h-[15px] rounded-full bg-[#977DF4] pointer-events-none" />
              <div className="absolute left-[13%] bottom-[20%] w-[10px] h-[10px] md:w-[15px] md:h-[15px] rounded-full bg-[#977DF4] pointer-events-none" />
              <div className="relative z-[2] flex flex-col items-center md:items-start gap-6 md:gap-[30px] pt-20 pb-8 px-6 md:py-[60px] md:pl-[clamp(32px,8%,206px)] w-full md:w-1/2 md:flex-shrink-0 text-center md:text-left">
                <span className="font-bold text-sm md:text-base text-[#2A7CC7]">{slide.season}</span>
                <h1 className="font-bold text-[40px] leading-[50px] md:text-[clamp(28px,4.5vw,58px)] md:leading-[1.38] text-[#252B42] m-0">{slide.title}</h1>
                <p className="text-xl md:text-[clamp(13px,1.5vw,20px)] leading-[30px] text-[#737373] m-0 max-w-[291px] md:max-w-[376px]">{slide.desc}</p>
                <Link to="/shop" className="inline-flex items-center justify-center bg-[#23A6F0] rounded-[5px] py-[15px] px-[40px] font-bold text-2xl md:text-[clamp(16px,2vw,24px)] text-white no-underline hover:bg-[#1a8fd1] transition-colors">
                  Shop Now
                </Link>
              </div>
              <div className="relative z-[1] w-full md:flex-1 md:self-stretch md:min-w-0">
                <img src={slide.img} alt={slide.title} className="block md:hidden w-[410px] h-[433px] object-cover object-top mx-auto mt-auto" />
                <img src={slide.img} alt={slide.title} className="hidden md:block absolute bottom-0 right-0 h-full w-auto object-cover" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

// ── Featured Banners ──────────────────────────────────────────────────────────
function ExploreBtn({ to }) {
  return (
    <Link to={to} className="inline-flex items-center justify-center w-[198px] h-[52px] border border-white rounded-[5px] font-bold text-sm text-white no-underline bg-transparent hover:bg-white hover:text-[#252B42] transition-colors">
      EXPLORE ITEMS
    </Link>
  )
}

function FeaturedBanners() {
  const imgs = ['812e38457d0cc7c0071c4e5eb3752a437fda3d0d.png','458786e9d5e9865170a32e0687f0a17d8581b9c8.png','81b40a6bad298edf330ec5747ae93edc6118ce4a.png']
  return (
    <section className="w-full bg-white">
      <div className="md:hidden flex flex-col items-center gap-[15px] px-[calc((100%-345px)/2)] py-6">
        {imgs.map((img, i) => (
          <div key={i} className={`relative w-[345px] overflow-hidden rounded-sm ${i === 0 ? 'h-[556px]' : 'h-[398px]'}`}>
            <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute left-0 right-0 bottom-0 h-[238px] flex flex-col justify-center gap-4 px-[41px] bg-[rgba(45,139,192,0.75)]">
              <h3 className="font-bold text-2xl text-white m-0 leading-8">Top Product Of The Week</h3>
              <ExploreBtn to="/shop" />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:flex max-w-[1185px] mx-auto px-6 py-20 gap-4">
        <div className="flex-[0_0_52%] h-[572px] relative overflow-hidden">
          <img src={imgs[0]} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute left-0 right-[30%] bottom-0 h-[238px] flex flex-col justify-center gap-4 px-[10%] bg-[rgba(45,139,192,0.75)]">
            <h3 className="font-bold text-2xl text-white m-0">Top Product Of<br />The Week</h3>
            <ExploreBtn to="/shop" />
          </div>
        </div>
        <div className="flex-[0_0_47%] h-[572px] relative">
          <div className="absolute left-0 right-0 top-0 h-[289px] overflow-hidden">
            <img src={imgs[1]} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute left-0 bottom-0 w-[65%] h-[173px] flex flex-col justify-center gap-3 px-[8%] bg-[rgba(45,139,192,0.75)]">
              <h4 className="font-normal text-xl text-white m-0">Top Product Of The Week</h4>
              <ExploreBtn to="/shop" />
            </div>
          </div>
          <div className="absolute left-0 right-0 top-[311px] h-[261px] overflow-hidden">
            <img src={imgs[2]} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute left-0 right-[35%] bottom-0 h-[153px] flex flex-col justify-center gap-3 px-[8%] bg-[rgba(45,139,192,0.75)]">
              <h4 className="font-normal text-xl text-white m-0">Top Product Of The Week</h4>
              <ExploreBtn to="/shop" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Bestsellers ───────────────────────────────────────────────────────────────
function Bestsellers() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-[1124px] mx-auto px-4 md:px-6 py-20 flex flex-col items-center gap-6">
        <div className="text-center">
          <h3 className="font-bold text-2xl text-[#252B42] m-0">BESTSELLER PRODUCTS</h3>
          <p className="text-sm text-[#737373] max-w-[261px] mx-auto mt-2">Problems trying to resolve the conflict between the two major realms of Classical physics.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-[30px] w-full">
          {products.slice(0, 8).map(p => (
            <ProductCard
              key={p.id}
              product={p}
              cardWidth="w-[295px] md:w-[239px]"
              imageHeight="h-[360px] md:h-[238px]"
              objectFit="object-contain"
            />
          ))}
        </div>
        <Link to="/shop" className="inline-flex items-center justify-center w-64 h-[52px] border border-[#23A6F0] rounded-[5px] font-bold text-sm text-[#23A6F0] no-underline hover:bg-[#23A6F0] hover:text-white transition-colors">
          LOAD MORE PRODUCTS
        </Link>
      </div>
    </section>
  )
}

// ── About Split ───────────────────────────────────────────────────────────────
function AboutSplit() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-[1050px] mx-auto px-6 py-20 flex flex-col md:flex-row gap-10 md:gap-16 items-center">
        {/* Images — LEFT */}
        <div className="flex gap-[8px] w-full md:flex-1 md:min-w-[280px] md:max-w-[513px] h-[363px] md:h-[498px] overflow-hidden order-1 md:order-1">
          <img src="7e902282946c71109661dfcd96fe9458abbd0e5b.jpg" alt="" className="flex-1 h-full object-cover min-w-0" />
          <img src="ca3428bbb53263f3cb265f6e0a1129f5afc25e74.jpg" alt="" className="flex-1 h-full object-cover min-w-0" />
        </div>
        {/* Text — RIGHT */}
        <div className="flex flex-col gap-4 flex-1 min-w-[280px] max-w-[447px] order-2 md:order-2">
          <h5 className="font-bold text-base text-[#23A6F0] m-0">Featured Products</h5>
          <h2 className="font-bold text-[40px] leading-[50px] text-[#252B42] m-0">We love what we do</h2>
          <p className="text-sm text-[#737373] leading-5 m-0">Problems trying to resolve the conflict between the two major realms of Classical physics: Newtonian mechanics and electromagnetism resulted in the development of quantum mechanics. Problems trying to resolve the conflict between the two major realms of Classical physics: Newtonian mechanics.</p>
        </div>
      </div>
    </section>
  )
}

// ── Services ──────────────────────────────────────────────────────────────────
function Services() {
  const features = [
    { Icon: BookOpen,   title: 'Easy Wins',   desc: 'Get your best looking smile now!' },
    { Icon: BookMarked, title: 'Concrete',    desc: 'Assurance that blocks are in the right place helping you grow your business.' },
    { Icon: TrendingUp, title: 'Hack Growth', desc: 'Overcome any adversity with our help.' },
  ]
  return (
    <section className="w-full bg-white">
      <div className="max-w-[1050px] mx-auto px-6 py-20 flex flex-col items-center gap-20">
        <div className="text-center">
          <h4 className="font-normal text-xl text-[#737373] m-0">Featured Products</h4>
          <h3 className="font-bold text-2xl text-[#252B42] m-0 mt-2">THE BEST SERVICES</h3>
          <p className="text-sm text-[#737373] max-w-[196px] mx-auto mt-2">Problems trying to resolve the conflict between the two major realms of Classical physics.</p>
        </div>
        <div className="flex flex-col md:flex-row flex-wrap justify-center gap-[30px] w-full">
          {features.map(({ Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center py-[35px] px-[40px] gap-5 w-full md:w-[315px]">
              <Icon size={72} color="#23A6F0" strokeWidth={1.5} />
              <h3 className="font-bold text-2xl text-[#252B42] text-center m-0">{title}</h3>
              <p className="text-sm text-[#737373] text-center m-0">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Featured Posts ────────────────────────────────────────────────────────────
function VerticalCard({ product }) {
  const history = useHistory()
  return (
    <div onClick={() => history.push(`/product/${product.id}`)} className="flex flex-col w-full max-w-[330px] bg-white overflow-hidden cursor-pointer shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-xl transition-shadow">
      <div className="w-full h-[300px] relative overflow-hidden flex-shrink-0">
        <img src={product.mobileImage || product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute top-5 left-5 flex items-center px-2.5 h-6 bg-[#E74040] rounded-[3px] shadow-[0px_2px_4px_rgba(0,0,0,0.1)]">
          <span className="font-bold text-sm text-white">NEW</span>
        </div>
      </div>
      <div className="flex flex-col p-[25px] gap-2.5">
        <div className="flex gap-[15px] text-xs">
          <span className="text-[#8EC2F2]">Google</span>
          <span className="text-[#737373]">Trending</span>
          <span className="text-[#737373]">New</span>
        </div>
        <h4 className="font-normal text-xl text-[#252B42] m-0 leading-[30px]">{product.title || product.name}</h4>
        <p className="text-sm text-[#737373] m-0 leading-5">{product.description}</p>
        <div className="flex justify-between items-center py-[15px]">
          <div className="flex items-center gap-1"><Calendar size={16} color="#23A6F0" /><span className="text-xs text-[#737373]">Jan 14</span></div>
          <div className="flex items-center gap-1"><BarChart2 size={16} color="#23856D" /><span className="text-xs text-[#737373]">64 Lessons</span></div>
        </div>
        <button onClick={e => { e.stopPropagation(); history.push(`/product/${product.id}`) }} className="flex items-center gap-2 font-bold text-sm text-[#737373] bg-transparent border-none cursor-pointer p-0 w-fit">
          Learn More <ArrowRight size={9} color="#23A6F0" />
        </button>
      </div>
    </div>
  )
}

function HorizCard({ product }) {
  const dispatch = useDispatch()
  const history = useHistory()
  const isWishlisted = useSelector(s => s.wishlist.items.some(i => i.id === product.id))
  return (
    <div onClick={() => history.push(`/product/${product.id}`)} className="flex w-full max-w-[501px] bg-white overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300">
      <div className="w-[209px] h-[404px] relative flex-shrink-0 overflow-hidden">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute top-5 left-5 flex items-center px-2.5 h-6 bg-[#E74040] rounded-[3px]">
          <span className="font-bold text-sm text-white">Sale</span>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-6 flex gap-2.5" onClick={e => e.stopPropagation()}>
          {[
            { fn: () => dispatch({ type:'TOGGLE_WISHLIST', payload:product }), node: <Heart size={16} color={isWishlisted ? '#E74040':'#BDBDBD'} fill={isWishlisted ? '#E74040':'none'} /> },
            { fn: () => dispatch({ type:'ADD_TO_CART', payload:product }),     node: <ShoppingCart size={16} color="#252B42" /> },
            { fn: () => history.push(`/product/${product.id}`),                node: <Eye size={16} color="#000" /> },
          ].map(({ fn, node }, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); fn() }} className="w-10 h-10 rounded-full bg-white border-none cursor-pointer flex items-center justify-center hover:bg-[#eef7ff] transition-colors shadow-md">
              {node}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col p-[25px] gap-2.5 flex-1 min-w-0 overflow-hidden">
        <div className="flex justify-between items-center">
          <span className="font-bold text-sm text-[#23A6F0]">{product.department}</span>
          <div className="flex items-center gap-1 px-1.5 py-1 bg-[#252B42] rounded-[20px]">
            <Star size={14} color="#FFCE31" fill="#FFCE31" />
            <span className="text-xs text-white">{product.rating}</span>
          </div>
        </div>
        <h5 className="font-bold text-base text-[#252B42] m-0 truncate">{product.name}</h5>
        <p className="text-sm text-[#737373] m-0 leading-5 line-clamp-3">{product.description}</p>
        <div className="flex items-center gap-2.5"><Tag size={16} color="#737373" /><span className="font-bold text-sm text-[#737373]">{product.sales}</span></div>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-base text-[#BDBDBD] line-through">${product.oldPrice.toFixed(2)}</span>
          <span className="font-bold text-base text-[#23856D]">${product.price.toFixed(2)}</span>
        </div>
        <div className="flex gap-1.5">{['#23A6F0','#23856D','#E77C40','#252B42'].map(c => <div key={c} className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: c }} />)}</div>
        <div className="flex justify-between items-center py-2">
          {(product.meta || []).map(({ label }, i) => (
            <div key={label} className="flex items-center gap-1">
              {[<Calendar size={14} color="#23A6F0" />, <BarChart2 size={14} color="#E77C40" />, <TrendingUp size={14} color="#23856D" />][i]}
              <span className="text-xs text-[#737373]">{label}</span>
            </div>
          ))}
        </div>
        <button onClick={e => { e.stopPropagation(); history.push(`/product/${product.id}`) }} className="flex items-center gap-2 px-5 py-2.5 border border-[#23A6F0] rounded-[37px] bg-transparent cursor-pointer w-fit group hover:bg-[#23A6F0] transition-colors">
          <span className="font-bold text-sm text-[#23A6F0] group-hover:text-white transition-colors">Learn More</span>
          <ArrowRight size={9} className="text-[#23A6F0] group-hover:text-white transition-colors" />
        </button>
      </div>
    </div>
  )
}

function FeaturedPosts() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-[1050px] mx-auto px-6 py-20 flex flex-col items-center gap-20">
        <div className="text-center">
          <h6 className="font-bold text-sm text-[#23A6F0] m-0">Practice Advice</h6>
          <h2 className="font-bold text-[40px] leading-[50px] text-[#252B42] m-0">Featured Posts</h2>
        </div>
        <div className="md:hidden flex flex-col items-center gap-[30px] w-full">
          {featuredPosts.map(p => <VerticalCard key={p.id} product={p} />)}
        </div>
        <div className="hidden md:flex flex-row gap-[30px] w-full justify-center">
          {featuredPosts.map(p => <HorizCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="w-full">
      <Hero />
      <BrandLogos />
      <FeaturedBanners />
      <Bestsellers />
      <AboutSplit />
      <Services />
      <FeaturedPosts />
    </div>
  )
}
