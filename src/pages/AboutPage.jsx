// src/pages/AboutPage.jsx

import React from "react";
import { Play } from "lucide-react";
import BrandLogos from "../components/BrandLogos";           // ← existing component
import { TeamCard, TEAM_MEMBERS } from "./TeamPage";         // ← reuse from TeamPage

// ── Stats ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "15K",  label: "Happy Customers"    },
  { value: "150K", label: "Monthly Visitors"   },
  { value: "15",   label: "Countries Worldwide"},
  { value: "100+", label: "Top Partners"       },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <main className="w-full bg-white">

      {/* ══════════════════════════════════════════════════════════════════════
          1. HERO
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white overflow-hidden">
        {/* CHANGED: Reduced gap on mobile (gap-4) to pull the image container up closer to the button */}
        <div className="max-w-[1050px] mx-auto px-6 py-20 md:py-28 flex flex-col md:flex-row items-center gap-4 md:gap-8">

          {/* ── Text ── */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-[35px] w-full md:w-[599px]">
            <span className="font-bold text-[16px] tracking-[0.1px] text-[#252B42]">
              ABOUT COMPANY
            </span>
            <h1 className="font-bold text-[#252B42] m-0 text-[40px] leading-[50px] md:text-[58px] md:leading-[80px] tracking-[0.2px]">
              ABOUT US
            </h1>
            <p className="font-normal text-[20px] leading-[30px] text-[#737373] m-0 max-w-[376px] tracking-[0.2px]">
              We know how large objects will act, but things on a small scale
            </p>
            <button className="bg-[#23A6F0] text-white border-none rounded-[5px] py-[15px] px-[40px] font-bold text-[14px] cursor-pointer tracking-[0.2px]">
              Get Quote Now
            </button>
          </div>

          {/* ── Hero image area ── */}
          <div className="w-full md:w-[550px] flex-shrink-0 flex items-center justify-center mt-10 md:mt-0">
            <div className="relative w-full max-w-[387px] h-[300px] md:w-[380px] md:h-[380px]">
              {/* CHANGED: Added origin-[75%_center] for mobile so she scales inwards instead of off-screen */}
              <img
                src="/background.png"
                alt="About hero"
                className="absolute inset-0 w-full h-full object-contain transform scale-[2] origin-[90%_center] md:scale-[2.8] md:origin-[80%_center]"
              />
            </div>
          </div>

        </div>
      </section>
      {/* ══════════════════════════════════════════════════════════════════════
          2. CONTENT BLOCK
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white md:border-t md:border-[#E6E6E6]">
        <div className="max-w-[1050px] mx-auto px-6 py-20 md:py-10 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-[60px]">
          <div className="flex flex-col gap-6 w-full md:w-[394px] items-center md:items-start">
            <p className="font-normal text-[14px] text-[#E74040] m-0 tracking-[0.2px]">
              Problems trying
            </p>
            <h3 className="font-bold text-[24px] leading-[32px] text-[#252B42] m-0 tracking-[0.1px]">
              Met minim Mollie non desert Alame est ali cliquy dolor do met sent.
            </h3>
          </div>
          <div className="w-full md:w-[529px]">
            <p className="font-normal text-[14px] leading-[20px] text-[#737373] m-0 tracking-[0.2px]">
              Problems trying to resolve the conflict between the two major realms of Classical physics: Newtonian mechanics
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. STATS
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white">
        <div className="max-w-[1050px] mx-auto px-6 py-[100px] md:py-[80px]">
          <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-[100px] md:gap-[30px]">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 w-[240px] md:w-[140px]">
                <span className="font-bold text-[#252B42] text-center text-[58px] leading-[80px] tracking-[0.2px]">
                  {s.value}
                </span>
                <span className="font-bold text-[16px] text-[#737373] text-center tracking-[0.1px] leading-[24px]">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. VIDEO
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white">
        <div className="max-w-[1050px] mx-auto px-6 pb-[80px]">
          <div className="relative w-full max-w-[307px] md:max-w-full mx-auto rounded-[20px] overflow-hidden h-[316px] md:h-[540px]">
            <div
              className="absolute inset-0 bg-[#B5CFD8]"
              style={{
                backgroundImage: "url('/Video card.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            {/* Dark gradient overlay */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 14.58%, rgba(56,56,56,0.84) 100%)" }}
            />
            {/* Play button */}
            <button
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border-none cursor-pointer bg-[#23A6F0] w-[57px] h-[57px] md:w-[92px] md:h-[92px]"
              aria-label="Play video"
            >
              <Play className="w-[14px] h-[14px] md:w-[28px] md:h-[28px]" color="#FFFFFF" fill="#FFFFFF" />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          5. MEET OUR TEAM
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white">
        <div className="max-w-[1050px] mx-auto px-6 py-16 md:py-[112px] flex flex-col items-center gap-[48px]">
          <div className="flex flex-col items-center gap-[10px] text-center">
            <h2 className="font-bold text-[#252B42] m-0 text-[40px] leading-[50px] tracking-[0.2px]">
              Meet Our Team
            </h2>
            <p className="font-normal text-[14px] leading-[20px] text-[#737373] m-0 max-w-[469px] tracking-[0.2px]">
              Problems trying to resolve the conflict between the two major realms of Classical physics: Newtonian mechanics
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:flex-wrap justify-center items-center gap-[30px] w-full">
            {TEAM_MEMBERS.map((m) => (
              <TeamCard key={m.id} member={m} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          6. BIG COMPANIES
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#FAFAFA]">
        <div className="max-w-[1050px] mx-auto px-6 pt-[120px] md:pt-[80px] flex flex-col items-center gap-[30px] md:gap-6">
          <div className="flex flex-col items-center gap-[30px] md:gap-[10px] text-center">
            <h2 className="font-bold text-[#252B42] m-0 text-[40px] leading-[50px] tracking-[0.2px]">
              Big Companies Are Here
            </h2>
            <p className="font-normal text-[14px] leading-[20px] text-[#737373] m-0 max-w-[469px] tracking-[0.2px]">
              Problems trying to resolve the conflict between the two major realms of Classical physics: Newtonian mechanics
            </p>
          </div>
        </div>
        {/* BrandLogos component layout handler */}
        <div className="py-12">
          <BrandLogos />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          7. CTA
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="w-full overflow-hidden bg-[#2A7CC7]">
        <div className="max-w-[1050px] mx-auto flex flex-col md:flex-row items-stretch">

          {/* Text */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6 flex-1 px-6 py-20 md:py-[112px]">
            <span className="font-bold text-[16px] text-white tracking-[0.1px]">
              WORK WITH US
            </span>
            <h2 className="font-bold text-white m-0 text-[40px] leading-[50px] tracking-[0.2px]">
              Now Let's Grow Yours
            </h2>
            <p className="font-normal text-[14px] leading-[20px] text-white m-0 max-w-[260px] md:max-w-none tracking-[0.2px]">
              The gradual accumulation of information about atomic and small-scale behaviour during the first quarter of the 20th
            </p>
            <button className="border border-[#FAFAFA] rounded-[5px] bg-transparent py-[15px] px-[40px] font-bold text-[14px] text-[#FAFAFA] cursor-pointer mt-2 md:mt-0 tracking-[0.2px]">
              Button
            </button>
          </div>

          {/* Image */}
          <div className="hidden md:block flex-shrink-0" style={{ width: "45%" }}>
            <img
              src="/desktop-testimonials-4.png"
              alt="Work with us"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

    </main>
  );
}