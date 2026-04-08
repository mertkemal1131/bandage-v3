import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ShoppingCart, Heart, Search, Phone, Mail, Menu, X, ChevronDown, User, LogOut } from 'lucide-react'
import { setUser } from '../store/clientReducer'
import axiosInstance from '../api/axiosInstance'

// ── Gravatar helper ────────────────────────────────────────────────────────
// Pure-JS MD5 (RFC 1321) — no extra npm package needed.
// Returns a 32-char lowercase hex string of the email hash.
function md5(str) {
  function safeAdd(x, y) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    return (((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xffff);
  }
  function bitRotateLeft(num, cnt) { return (num << cnt) | (num >>> (32 - cnt)); }
  function md5cmn(q, a, b, x, s, t) { return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b); }
  function md5ff(a, b, c, d, x, s, t) { return md5cmn((b & c) | (~b & d), a, b, x, s, t); }
  function md5gg(a, b, c, d, x, s, t) { return md5cmn((b & d) | (c & ~d), a, b, x, s, t); }
  function md5hh(a, b, c, d, x, s, t) { return md5cmn(b ^ c ^ d, a, b, x, s, t); }
  function md5ii(a, b, c, d, x, s, t) { return md5cmn(c ^ (b | ~d), a, b, x, s, t); }

  const bytes = unescape(encodeURIComponent(str));
  const m = [];
  for (let i = 0; i < bytes.length; i++) m[i >> 2] |= bytes.charCodeAt(i) << ((i % 4) * 8);
  m[bytes.length >> 2] |= 0x80 << ((bytes.length % 4) * 8);
  m[(((bytes.length + 8) >> 6) + 1) * 16 - 2] = bytes.length * 8;

  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
  for (let i = 0; i < m.length; i += 16) {
    const [aa, bb, cc, dd] = [a, b, c, d];
    a = md5ff(a,b,c,d,m[i+0],7,-680876936);   b = md5ff(d,a,b,c,m[i+1],12,-389564586);
    c = md5ff(c,d,a,b,m[i+2],17,606105819);    d = md5ff(b,c,d,a,m[i+3],22,-1044525330);
    a = md5ff(a,b,c,d,m[i+4],7,-176418897);    b = md5ff(d,a,b,c,m[i+5],12,1200080426);
    c = md5ff(c,d,a,b,m[i+6],17,-1473231341);  d = md5ff(b,c,d,a,m[i+7],22,-45705983);
    a = md5ff(a,b,c,d,m[i+8],7,1770035416);    b = md5ff(d,a,b,c,m[i+9],12,-1958414417);
    c = md5ff(c,d,a,b,m[i+10],17,-42063);      d = md5ff(b,c,d,a,m[i+11],22,-1990404162);
    a = md5ff(a,b,c,d,m[i+12],7,1804603682);   b = md5ff(d,a,b,c,m[i+13],12,-40341101);
    c = md5ff(c,d,a,b,m[i+14],17,-1502002290); d = md5ff(b,c,d,a,m[i+15],22,1236535329);

    a = md5gg(a,b,c,d,m[i+1],5,-165796510);    b = md5gg(d,a,b,c,m[i+6],9,-1069501632);
    c = md5gg(c,d,a,b,m[i+11],14,643717713);   d = md5gg(b,c,d,a,m[i+0],20,-373897302);
    a = md5gg(a,b,c,d,m[i+5],5,-701558691);    b = md5gg(d,a,b,c,m[i+10],9,38016083);
    c = md5gg(c,d,a,b,m[i+15],14,-660478335);  d = md5gg(b,c,d,a,m[i+4],20,-405537848);
    a = md5gg(a,b,c,d,m[i+9],5,568446438);     b = md5gg(d,a,b,c,m[i+14],9,-1019803690);
    c = md5gg(c,d,a,b,m[i+3],14,-187363961);   d = md5gg(b,c,d,a,m[i+8],20,1163531501);
    a = md5gg(a,b,c,d,m[i+13],5,-1444681467);  b = md5gg(d,a,b,c,m[i+2],9,-51403784);
    c = md5gg(c,d,a,b,m[i+7],14,1735328473);   d = md5gg(b,c,d,a,m[i+12],20,-1926607734);

    a = md5hh(a,b,c,d,m[i+5],4,-378558);       b = md5hh(d,a,b,c,m[i+8],11,-2022574463);
    c = md5hh(c,d,a,b,m[i+11],16,1839030562);  d = md5hh(b,c,d,a,m[i+14],23,-35309556);
    a = md5hh(a,b,c,d,m[i+1],4,-1530992060);   b = md5hh(d,a,b,c,m[i+4],11,1272893353);
    c = md5hh(c,d,a,b,m[i+7],16,-155497632);   d = md5hh(b,c,d,a,m[i+10],23,-1094730640);
    a = md5hh(a,b,c,d,m[i+13],4,681279174);    b = md5hh(d,a,b,c,m[i+0],11,-358537222);
    c = md5hh(c,d,a,b,m[i+3],16,-722521979);   d = md5hh(b,c,d,a,m[i+6],23,76029189);
    a = md5hh(a,b,c,d,m[i+9],4,-640364487);    b = md5hh(d,a,b,c,m[i+12],11,-421815835);
    c = md5hh(c,d,a,b,m[i+15],16,530742520);   d = md5hh(b,c,d,a,m[i+2],23,-995338651);

    a = md5ii(a,b,c,d,m[i+0],6,-198630844);    b = md5ii(d,a,b,c,m[i+7],10,1126891415);
    c = md5ii(c,d,a,b,m[i+14],15,-1416354905); d = md5ii(b,c,d,a,m[i+5],21,-57434055);
    a = md5ii(a,b,c,d,m[i+12],6,1700485571);   b = md5ii(d,a,b,c,m[i+3],10,-1894986606);
    c = md5ii(c,d,a,b,m[i+10],15,-1051523);    d = md5ii(b,c,d,a,m[i+1],21,-2054922799);
    a = md5ii(a,b,c,d,m[i+8],6,1873313359);    b = md5ii(d,a,b,c,m[i+15],10,-30611744);
    c = md5ii(c,d,a,b,m[i+6],15,-1560198380);  d = md5ii(b,c,d,a,m[i+13],21,1309151649);
    a = md5ii(a,b,c,d,m[i+4],6,-145523070);    b = md5ii(d,a,b,c,m[i+11],10,-1120210379);
    c = md5ii(c,d,a,b,m[i+2],15,718787259);    d = md5ii(b,c,d,a,m[i+9],21,-343485551);

    a = safeAdd(a, aa); b = safeAdd(b, bb); c = safeAdd(c, cc); d = safeAdd(d, dd);
  }
  return [a, b, c, d].map(n =>
    ('00000000' + (n < 0 ? n + 0x100000000 : n).toString(16)).slice(-8)
      .match(/.{2}/g).reverse().join('')
  ).join('');
}

function gravatarUrl(email, size = 40) {
  const hash = md5((email ?? '').trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

// ── Gender slug helper ─────────────────────────────────────────────────────
// API returns gender as "k" (kadın) or "e" (erkek)
function genderSlug(gender) {
  const g = (gender ?? '').toLowerCase();
  if (g === 'k' || g === 'kadin' || g === 'women') return 'kadin';
  if (g === 'e' || g === 'erkek' || g === 'men')   return 'erkek';
  return g;
}

export default function Header() {
  const [menuOpen, setMenuOpen]   = useState(false)
  const [pagesOpen, setPagesOpen] = useState(false)
  const [shopOpen,  setShopOpen]  = useState(false)
  const [cartOpen,  setCartOpen]  = useState(false)
  const [userOpen,  setUserOpen]  = useState(false)
  const location = useLocation()

  // ── Selectors ──────────────────────────────────────────────────────────────
  const user       = useSelector(s => s.client.user)
  const cart       = useSelector(s => s.shoppingCart.cart)
  const cartCount  = useSelector(s =>
    s.shoppingCart.cart.reduce((sum, item) => sum + item.count, 0)
  )
  const wishCount  = useSelector(s => s.wishlist.items.length)
  const categories = useSelector(s => s.product.categories)
  const dispatch   = useDispatch()

  const kadinCats = categories.filter(c => genderSlug(c.gender) === 'kadin')
  const erkekCats = categories.filter(c => genderSlug(c.gender) === 'erkek')

  // Close dropdowns on outside click
  const pagesRef = useRef(null)
  const shopRef  = useRef(null)
  const cartRef  = useRef(null)
  const userRef  = useRef(null)
  useEffect(() => {
    const handler = (e) => {
      if (pagesRef.current && !pagesRef.current.contains(e.target)) setPagesOpen(false)
      if (shopRef.current  && !shopRef.current.contains(e.target))  setShopOpen(false)
      if (cartRef.current  && !cartRef.current.contains(e.target))  setCartOpen(false)
      if (userRef.current  && !userRef.current.contains(e.target))  setUserOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const pagesLinks = [{ label: 'Team', path: '/team' }]

  const handleLogout = () => {
    localStorage.removeItem('token')
    delete axiosInstance.defaults.headers.common['Authorization']
    dispatch(setUser(null))
    setMenuOpen(false)
  }

  return (
    <header className="w-full">

      {/* ── Top bar — desktop only ─────────────────────────────────────── */}
      <div className="hidden md:flex w-full bg-[#252B42] h-[58px] items-center justify-between px-10">
        <div className="flex items-center gap-6">
          <a href="tel:2255550118" className="flex items-center gap-2 no-underline">
            <Phone size={16} color="#FFFFFF" strokeWidth={2} />
            <span className="font-bold text-sm text-white">(225) 555-0118</span>
          </a>
          <a href="mailto:michelle.rivera@example.com" className="flex items-center gap-2 no-underline">
            <Mail size={16} color="#FFFFFF" strokeWidth={2} />
            <span className="font-bold text-sm text-white">michelle.rivera@example.com</span>
          </a>
        </div>
        <span className="font-bold text-sm text-white whitespace-nowrap">
          Follow Us and get a chance to win <span className="text-[#23A6F0]">80% off</span>
        </span>
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm text-white">Follow Us :</span>
          {[
            "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
            "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
            "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
          ].map((d, i) => (
            <a key={i} href="#" className="flex items-center hover:opacity-70 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF"><path d={d} /></svg>
            </a>
          ))}
        </div>
      </div>

      {/* ── Main nav bar ───────────────────────────────────────────────── */}
      <nav className="w-full bg-white border-b border-[#E8E8E8] h-16 md:h-20 flex items-center justify-between px-4 md:px-10 sticky top-0 z-[100] shadow-sm">
        <Link to="/" className="font-extrabold text-2xl md:text-[28px] text-[#252B42] no-underline shrink-0">
          Bandage
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-5 list-none m-0 p-0">
          <li>
            <Link to="/" className="flex items-center gap-1 font-bold text-sm text-[#737373] no-underline hover:text-[#252B42] transition-colors">
              Home
            </Link>
          </li>

          {/* Shop dropdown */}
          <li className="relative" ref={shopRef}>
            <button
              onClick={() => setShopOpen(p => !p)}
              className="flex items-center gap-1 font-bold text-sm text-[#737373] bg-transparent border-none cursor-pointer hover:text-[#252B42] transition-colors p-0"
            >
              Shop
              <ChevronDown size={14} style={{ transform: shopOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>

            {shopOpen && (
              <div className="absolute top-full left-0 mt-3 bg-white shadow-xl border border-[#E8E8E8] rounded-sm z-[200] min-w-[280px] p-6">
                <div className="flex gap-10">
                  {/* Kadın column */}
                  <div>
                    <h4 className="font-bold text-sm text-[#252B42] mb-4 uppercase tracking-wide">Kadın</h4>
                    <ul className="list-none m-0 p-0 flex flex-col gap-3">
                      {kadinCats.map(cat => (
                        <li key={cat.id}>
                          <Link
                            to={`/shop/${genderSlug(cat.gender)}/${cat.title.toLowerCase()}/${cat.id}`}
                            className="font-bold text-sm text-[#737373] no-underline hover:text-[#252B42] transition-colors"
                            onClick={() => setShopOpen(false)}
                          >
                            {cat.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Erkek column */}
                  <div>
                    <h4 className="font-bold text-sm text-[#252B42] mb-4 uppercase tracking-wide">Erkek</h4>
                    <ul className="list-none m-0 p-0 flex flex-col gap-3">
                      {erkekCats.map(cat => (
                        <li key={cat.id}>
                          <Link
                            to={`/shop/${genderSlug(cat.gender)}/${cat.title.toLowerCase()}/${cat.id}`}
                            className="font-bold text-sm text-[#737373] no-underline hover:text-[#252B42] transition-colors"
                            onClick={() => setShopOpen(false)}
                          >
                            {cat.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </li>

          {[['About', '/about'], ['Blog', '/blog'], ['Contact', '/contact']].map(([label, path]) => (
            <li key={label}>
              <Link to={path} className="flex items-center gap-1 font-bold text-sm text-[#737373] no-underline hover:text-[#252B42] transition-colors">
                {label}
              </Link>
            </li>
          ))}
          <li className="relative" ref={pagesRef}>
            <button
              onClick={() => setPagesOpen(p => !p)}
              className="flex items-center gap-1 font-bold text-sm text-[#737373] bg-transparent border-none cursor-pointer hover:text-[#252B42] transition-colors p-0"
            >
              Pages
              <ChevronDown size={14} style={{ transform: pagesOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>
            {pagesOpen && (
              <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-[#E8E8E8] overflow-hidden z-[200]">
                {pagesLinks.map(({ label, path }) => (
                  <Link key={label} to={path} onClick={() => setPagesOpen(false)}
                    className="block px-4 py-3 font-bold text-sm text-[#737373] no-underline hover:bg-[#F5F5F5] hover:text-[#252B42] transition-colors">
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </li>
        </ul>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-1 shrink-0">
          {user ? (
            <div className="relative" ref={userRef}>
              {/* ── User trigger button ─────────────────────────────────── */}
              <button
                onClick={() => setUserOpen(p => !p)}
                className="flex items-center gap-2 bg-transparent border-none cursor-pointer p-1 rounded-lg hover:bg-[#F5F5F5] transition-colors"
              >
                <img
                  src={gravatarUrl(user.email, 40)}
                  alt={user.name}
                  className="w-9 h-9 rounded-full border border-[#E8E8E8] object-cover shrink-0"
                />
                <span className="font-bold text-sm text-[#252B42] max-w-[120px] truncate">
                  {user.name}
                </span>
                <ChevronDown size={14} style={{ transform: userOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: '#737373' }} />
              </button>

              {/* ── User dropdown ───────────────────────────────────────── */}
              {userOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-[#E8E8E8] overflow-hidden z-[200]">
                  {/* Profile header */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-[#F8F9FF] border-b border-[#E8E8E8]">
                    <img
                      src={gravatarUrl(user.email, 36)}
                      alt={user.name}
                      className="w-9 h-9 rounded-full border border-[#DDE0EE] object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-[#252B42] m-0 truncate">{user.name}</p>
                      <p className="text-[10px] text-[#737373] m-0 truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* My Orders link */}
                  <Link
                    to="/previous-orders"
                    onClick={() => setUserOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 font-bold text-sm text-[#252B42] no-underline hover:bg-[#F5F5F5] hover:text-[#23A6F0] transition-colors"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    Siparişlerim
                  </Link>

                  <div className="h-[1px] bg-[#E8E8E8] mx-3" />

                  {/* Logout */}
                  <button
                    onClick={() => { handleLogout(); setUserOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 font-bold text-sm text-[#E2462C] bg-transparent border-none cursor-pointer hover:bg-[#FFF5F5] transition-colors text-left"
                  >
                    <LogOut size={15} /> Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-1.5 px-3 py-2 font-bold text-sm text-[#23A6F0] no-underline whitespace-nowrap">
              <User size={16} color="#23A6F0" strokeWidth={2} />Login / Register
            </Link>
          )}
          <button className="p-2 bg-transparent border-none cursor-pointer flex items-center">
            <Search size={20} color="#23A6F0" strokeWidth={2} />
          </button>
          {/* Cart dropdown */}
          <div className="relative" ref={cartRef}>
            <button
              onClick={() => setCartOpen(p => !p)}
              className="flex items-center gap-1 p-2 bg-transparent border-none cursor-pointer relative"
            >
              <ShoppingCart size={20} color="#23A6F0" strokeWidth={2} />
              {cartCount > 0 && (
                <span className="min-w-[18px] h-[18px] rounded-full bg-[#23A6F0] text-white font-bold text-[11px] flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Cart dropdown panel */}
            {cartOpen && (
              <div className="absolute top-full right-0 mt-2 w-[380px] bg-white rounded-md shadow-2xl border border-[#E8E8E8] z-[200]">
                {/* Header */}
                <div className="px-5 py-4 border-b border-[#E8E8E8]">
                  <h3 className="font-bold text-[16px] text-[#252B42] m-0">
                    Sepetim ({cartCount} Ürün)
                  </h3>
                </div>

                {/* Item list */}
                <div className="max-h-[320px] overflow-y-auto divide-y divide-[#F3F3F3]">
                  {cart.length === 0 ? (
                    <p className="text-center text-[14px] text-[#737373] py-8">Sepetiniz boş</p>
                  ) : (
                    cart.map(({ product, count }) => {
                      const img = product._image
                        ?? product.images?.[0]?.url
                        ?? product.image
                        ?? null;
                      const imgSrc = img
                        ? img.startsWith('http') ? img : `/${img}`
                        : 'https://placehold.co/80x80/f3f3f3/bdbdbd?text=?';
                      const price = product._price ?? product.discount_price ?? product.price ?? 0;
                      return (
                        <div key={product.id} className="flex items-center gap-3 px-5 py-4">
                          {/* Product image */}
                          <img
                            src={imgSrc}
                            alt={product.name}
                            className="w-[72px] h-[72px] object-cover rounded flex-shrink-0"
                            onError={e => { e.target.src = 'https://placehold.co/72x72/f3f3f3/bdbdbd?text=?' }}
                          />
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[13px] text-[#252B42] m-0 leading-[18px] line-clamp-2">
                              {product.name}
                            </p>
                            <p className="font-normal text-[12px] text-[#737373] m-0 mt-1">
                              Adet: {count}
                            </p>
                            <p className="font-bold text-[13px] text-[#FF6000] m-0 mt-1">
                              {(price * count).toFixed(2)} TL
                            </p>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Footer buttons */}
                {cart.length > 0 && (
                  <div className="flex gap-3 px-5 py-4 border-t border-[#E8E8E8]">
                    <Link
                      to="/cart"
                      onClick={() => setCartOpen(false)}
                      className="flex-1 h-[44px] flex items-center justify-center border border-[#252B42]
                                 rounded-[5px] font-bold text-[14px] text-[#252B42] no-underline
                                 hover:bg-[#f5f5f5] transition-colors"
                    >
                      Sepete Git
                    </Link>
                    <Link
                      to="/cart"
                      onClick={() => setCartOpen(false)}
                      className="flex-1 h-[44px] flex items-center justify-center bg-[#FF6000]
                                 rounded-[5px] font-bold text-[14px] text-white no-underline
                                 hover:bg-[#e05500] transition-colors"
                    >
                      Siparişi Tamamla
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
          <button className="flex items-center gap-1 p-2 bg-transparent border-none cursor-pointer">
            <Heart size={20} color="#23A6F0" strokeWidth={2} />
            {wishCount > 0 && <span className="min-w-[18px] h-[18px] rounded-full bg-[#23A6F0] text-white font-bold text-[11px] flex items-center justify-center px-1">{wishCount}</span>}
          </button>
        </div>

        {/* Mobile: hamburger only */}
        <button onClick={() => setMenuOpen(v => !v)} className="md:hidden p-2 bg-transparent border-none cursor-pointer" aria-label="Toggle menu">
          {menuOpen ? <X size={24} color="#252B42" /> : <Menu size={24} color="#252B42" />}
        </button>
      </nav>

      {/* ── Mobile dropdown menu ───────────────────────────────────────── */}
      {menuOpen && (
        <div className="md:hidden w-full bg-white flex flex-col items-center py-[60px] gap-[30px] shadow-md z-[99] relative">
          {[['Home', '/'], ['About', '/about'], ['Blog', '/blog'], ['Contact', '/contact'], ['Pages', '/team']].map(([label, path]) => {
            const isActive = location.pathname === path
            return (
              <Link key={label} to={path} onClick={() => setMenuOpen(false)}
                className={`text-[30px] leading-[45px] tracking-[0.2px] no-underline text-center transition-colors ${
                  isActive ? 'font-bold text-[#252B42]' : 'font-normal text-[#737373]'
                }`}>
                {label}
              </Link>
            )
          })}

          {/* Mobile Shop accordion */}
          <button
            onClick={() => setShopOpen(p => !p)}
            className="flex items-center gap-2 text-[30px] leading-[45px] tracking-[0.2px] font-normal text-[#737373] bg-transparent border-none cursor-pointer"
          >
            Shop
            <ChevronDown size={22} style={{ transform: shopOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>

          {shopOpen && (
            <div className="flex gap-10 px-6">
              <div>
                <h4 className="font-bold text-base text-[#252B42] mb-3">Kadın</h4>
                {kadinCats.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/shop/${genderSlug(cat.gender)}/${cat.title.toLowerCase()}/${cat.id}`}
                    className="block font-bold text-sm text-[#737373] no-underline mb-3 hover:text-[#252B42]"
                    onClick={() => { setMenuOpen(false); setShopOpen(false); }}
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
              <div>
                <h4 className="font-bold text-base text-[#252B42] mb-3">Erkek</h4>
                {erkekCats.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/shop/${genderSlug(cat.gender)}/${cat.title.toLowerCase()}/${cat.id}`}
                    className="block font-bold text-sm text-[#737373] no-underline mb-3 hover:text-[#252B42]"
                    onClick={() => { setMenuOpen(false); setShopOpen(false); }}
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="w-full h-[1px] bg-[#E8E8E8]" />

          {user ? (
            <>
              <div className="flex items-center gap-3">
                <img
                  src={gravatarUrl(user.email, 48)}
                  alt={user.name}
                  className="w-12 h-12 rounded-full border border-[#E8E8E8] object-cover"
                />
                <span className="text-[24px] font-bold text-[#252B42]">{user.name}</span>
              </div>
              <Link
                to="/previous-orders"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-[24px] font-bold text-[#252B42] no-underline hover:text-[#23A6F0] transition-colors"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                Siparişlerim
              </Link>
              <button onClick={handleLogout}
                className="flex items-center gap-2 text-[24px] font-bold text-[#E2462C] bg-transparent border-none cursor-pointer">
                <LogOut size={24} /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-[24px] font-bold text-[#23A6F0] no-underline">
              <User size={24} color="#23A6F0" strokeWidth={2} /> Login / Register
            </Link>
          )}

          <button className="p-0 bg-transparent border-none cursor-pointer">
            <Search size={28} color="#23A6F0" strokeWidth={2} />
          </button>

          <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-1.5 no-underline">
            <ShoppingCart size={28} color="#23A6F0" strokeWidth={2} />
            {cartCount > 0 && <span className="min-w-[20px] h-[20px] rounded-full bg-[#23A6F0] text-white font-bold text-[12px] flex items-center justify-center px-1">{cartCount}</span>}
          </Link>

          <button className="flex items-center gap-1.5 p-0 bg-transparent border-none cursor-pointer">
            <Heart size={28} color="#23A6F0" strokeWidth={2} />
            {wishCount > 0 && <span className="min-w-[20px] h-[20px] rounded-full bg-[#23A6F0] text-white font-bold text-[12px] flex items-center justify-center px-1">{wishCount}</span>}
          </button>
        </div>
      )}
    </header>
  )
}