import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ShoppingCart, Heart, Search, Phone, Mail, Menu, X, ChevronDown, User, LogOut } from 'lucide-react'
import { setUser } from '../store/clientReducer'

export default function Header() {
  const [menuOpen, setMenuOpen]   = useState(false)
  const [pagesOpen, setPagesOpen] = useState(false)
  const location = useLocation()

  // ── Selectors ──────────────────────────────────────────────────────────────
  const user      = useSelector(s => s.client.user)
  const cartCount = useSelector(s =>
    s.shoppingCart.cart.reduce((sum, item) => sum + item.count, 0)
  )
  const wishCount = useSelector(s => s.wishlist.items.length)
  const dispatch  = useDispatch()

  // Close Pages dropdown on outside click
  const pagesRef = useRef(null)
  useEffect(() => {
    const handler = (e) => {
      if (pagesRef.current && !pagesRef.current.contains(e.target)) setPagesOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const pagesLinks = [{ label: 'Team', path: '/team' }]

  const handleLogout = () => {
    localStorage.removeItem('token')
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
          {[['Home', '/'], ['Shop', '/shop', true], ['About', '/about'], ['Blog', '/blog'], ['Contact', '/contact']].map(([label, path, arrow]) => (
            <li key={label}>
              <Link to={path} className="flex items-center gap-1 font-bold text-sm text-[#737373] no-underline hover:text-[#252B42] transition-colors">
                {label}{arrow && <ChevronDown size={14} />}
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
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#252B42] flex items-center gap-1.5">
                <User size={16} color="#23A6F0" /> {user.name}
              </span>
              <button onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-2 font-bold text-sm text-[#737373] bg-transparent border-none cursor-pointer hover:text-[#252B42]">
                <LogOut size={15} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-1.5 px-3 py-2 font-bold text-sm text-[#23A6F0] no-underline whitespace-nowrap">
              <User size={16} color="#23A6F0" strokeWidth={2} />Login / Register
            </Link>
          )}
          <button className="p-2 bg-transparent border-none cursor-pointer flex items-center">
            <Search size={20} color="#23A6F0" strokeWidth={2} />
          </button>
          <Link to="/cart" className="flex items-center gap-1 p-2 no-underline relative">
            <ShoppingCart size={20} color="#23A6F0" strokeWidth={2} />
            {cartCount > 0 && <span className="min-w-[18px] h-[18px] rounded-full bg-[#23A6F0] text-white font-bold text-[11px] flex items-center justify-center px-1">{cartCount}</span>}
          </Link>
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
          {[['Home', '/'], ['Shop', '/shop'], ['About', '/about'], ['Blog', '/blog'], ['Contact', '/contact'], ['Pages', '/team']].map(([label, path]) => {
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

          <div className="w-full h-[1px] bg-[#E8E8E8]" />

          {user ? (
            <>
              <span className="text-[24px] font-bold text-[#252B42] flex items-center gap-2">
                <User size={24} color="#23A6F0" /> {user.name}
              </span>
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
