import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'

const COLS = [
  { title: 'Company Info', links: ['About Us','Carrier','We are hiring','Blog'] },
  { title: 'Legal',        links: ['About Us','Carrier','We are hiring','Blog'] },
  { title: 'Features',     links: ['Business Marketing','User Analytic','Live Chat','Unlimited Support'] },
  { title: 'Resources',    links: ['IOS & Android','Watch a Demo','Customers','API'] },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const handleSubscribe = e => { e.preventDefault(); if (!email) return; toast.success('Subscribed!'); setEmail('') }

  return (
    <footer className="w-full bg-white">

      {/* Band 1 — logo + social */}
      <div className="w-full bg-[#FAFAFA]">
        <div className="max-w-[1050px] mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:justify-between gap-3">
          <Link to="/" className="font-bold text-2xl text-[#252B42] no-underline">Bandage</Link>
          <div className="flex items-center gap-5">
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity">
                <Icon size={24} color="#23A6F0" />
              </a>
            ))}
          </div>
        </div>
        <div className="max-w-[1050px] mx-auto px-6">
          <hr className="border-t border-[#E6E6E6]" />
        </div>
      </div>

      {/* Band 2 — single column on mobile, flex row on desktop */}
      <div className="w-full bg-white">
        <div className="max-w-[1050px] mx-auto px-6 py-[70px]
                        flex flex-col gap-[30px]
                        md:flex-row md:flex-wrap md:gap-8">
          {COLS.map(col => (
            <div key={col.title} className="flex flex-col gap-5">
              <h5 className="font-bold text-base text-[#252B42] m-0">{col.title}</h5>
              <div className="flex flex-col gap-2.5">
                {col.links.map(link => (
                  <Link key={link} to="#" className="font-bold text-sm text-[#737373] no-underline hover:text-[#23A6F0] transition-colors">{link}</Link>
                ))}
              </div>
            </div>
          ))}

          {/* Newsletter */}
          <div className="flex flex-col gap-5 md:flex-1 md:min-w-[260px]">
            <h5 className="font-bold text-base text-[#252B42] m-0">Get In Touch</h5>
            <form onSubmit={handleSubscribe} className="flex h-[58px]">
              <input type="email" placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)}
                className="flex-1 bg-[#F9F9F9] border border-[#E6E6E6] border-r-0 rounded-l-[5px] pl-5 text-sm text-[#737373] outline-none min-w-0" />
              <button type="submit"
                className="w-[117px] bg-[#23A6F0] border border-[#E6E6E6] rounded-r-[5px] text-sm text-white cursor-pointer shrink-0 hover:bg-[#1a8fd1] transition-colors">
                Subscribe
              </button>
            </form>
            <span className="text-xs text-[#737373]">Lore imp sum dolor Amit</span>
          </div>
        </div>
      </div>

      {/* Band 3 — copyright */}
      <div className="w-full bg-[#FAFAFA]">
        <div className="max-w-[1050px] mx-auto px-6 py-6 text-left">
          <span className="font-bold text-sm text-[#737373]">Made With Love By Finland All Right Reserved</span>
        </div>
      </div>

    </footer>
  )
}