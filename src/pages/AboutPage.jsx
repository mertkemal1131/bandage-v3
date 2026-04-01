// src/pages/AboutPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// NOTE: Move InitialsAvatar to src/components/InitialsAvatar.jsx and import
// it in both AboutPage and TeamPage to avoid duplication.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Facebook, Instagram, Twitter, Play } from "lucide-react";

// ── Shared: Initials fallback avatar (same logic as TeamPage) ─────────────────
function InitialsAvatar({ name, bg }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: bg }}>
      <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "2rem", color: "#fff", letterSpacing: "0.05em" }}>
        {initials}
      </span>
    </div>
  );
}

// ── Team data for About page (3 members, with social links) ──────────────────
// Replace image, name, title and social hrefs with real data.
const ABOUT_TEAM = [
  { id: 1, name: "Username", title: "Profession", bg: "#F5C518", image: "" },  // ← replace
  { id: 2, name: "Username", title: "Profession", bg: "#B5CFD8", image: "" },  // ← replace
  { id: 3, name: "Username", title: "Profession", bg: "#6BCB77", image: "" },  // ← replace
];

// ── Stats data ────────────────────────────────────────────────────────────────
const STATS = [
  { value: "15K",  label: "Happy Customers" },
  { value: "150K", label: "Monthly Visitors" },
  { value: "15",   label: "Countries Worldwide" },
  { value: "100+", label: "Top Partners" },
];

// ── Client logos (text-based placeholders until real SVGs are provided) ───────
const CLIENTS = ["hooli", "Lyft", "stripe", "aws", "reddit"];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

// About team card — same card structure as TeamPage but with social icons
function AboutTeamCard({ member }) {
  const [imgError, setImgError] = React.useState(!member.image);
  return (
    <div className="flex flex-col items-center w-full md:w-[316px] bg-white rounded-md overflow-hidden">
      {/* Photo */}
      <div className="w-full" style={{ height: 231 }}>
        {member.image && !imgError ? (
          <img src={member.image} alt={member.name} onError={() => setImgError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <InitialsAvatar name={member.name} bg={member.bg} />
        )}
      </div>
      {/* Info */}
      <div className="flex flex-col items-center gap-[10px] py-[30px] px-[30px] w-full">
        <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 16, color: "#252B42", letterSpacing: "0.1px" }}>
          {member.name}
        </span>
        <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14, color: "#737373", letterSpacing: "0.2px" }}>
          {member.title}
        </span>
        {/* Social icons */}
        <div className="flex items-center gap-5 mt-1">
          <a href="#" aria-label="Facebook"><Facebook size={20} color="#23A6F0" /></a>
          <a href="#" aria-label="Instagram"><Instagram size={20} color="#23A6F0" /></a>
          <a href="#" aria-label="Twitter"><Twitter size={20} color="#23A6F0" /></a>
        </div>
      </div>
    </div>
  );
}

// Section heading helper
function SectionHeading({ label, title, paragraph, light = false }) {
  return (
    <div className="flex flex-col items-center gap-[10px] text-center">
      {label && (
        <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400, fontSize: 14, color: light ? "#fff" : "#E74040", letterSpacing: "0.2px", margin: 0 }}>
          {label}
        </p>
      )}
      <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "clamp(24px, 4vw, 40px)", lineHeight: "1.25", color: light ? "#fff" : "#252B42", letterSpacing: "0.2px", margin: 0 }}>
        {title}
      </h2>
      {paragraph && (
        <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400, fontSize: 14, lineHeight: "20px", color: light ? "#fff" : "#737373", maxWidth: 469, margin: 0, letterSpacing: "0.2px" }}>
          {paragraph}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <main style={{ background: "#FFFFFF", width: "100%" }}>

      {/* ══════════════════════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white overflow-hidden">
        <div className="max-w-[1050px] mx-auto px-6 py-16 md:py-28 flex flex-col md:flex-row items-center gap-10 md:gap-8">
          {/* Left — text */}
          <div className="flex flex-col items-start gap-[35px] w-full md:w-[599px]">
            <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 16, color: "#252B42", letterSpacing: "0.1px" }}>
              ABOUT COMPANY
            </span>
            <h1 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "clamp(36px, 6vw, 58px)", lineHeight: "1.38", color: "#252B42", letterSpacing: "0.2px", margin: 0 }}>
              ABOUT US
            </h1>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400, fontSize: 20, lineHeight: "30px", color: "#737373", letterSpacing: "0.2px", margin: 0, maxWidth: 376 }}>
              We know how large objects will act, but things on a small scale
            </p>
            <button style={{ background: "#23A6F0", borderRadius: 5, border: "none", padding: "15px 40px", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14, color: "#FFFFFF", cursor: "pointer", letterSpacing: "0.2px" }}>
              Get Quote Now
            </button>
          </div>

          {/* Right — hero image placeholder */}
          <div className="w-full md:w-[415px] flex-shrink-0 flex items-center justify-center">
            <div className="relative w-[280px] h-[280px] md:w-[380px] md:h-[380px]">
              {/* Pink circle background */}
              <div className="absolute inset-0 rounded-full" style={{ background: "#FFE9EA" }} />
              {/* Replace src with your hero image import */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span style={{ fontFamily: "Montserrat, sans-serif", color: "#737373", fontSize: 13 }}>
                  <img src="/background.png" alt="Hero Background" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2. CONTENT BLOCK (label + heading + paragraph)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white border-t border-[#E6E6E6]">
        <div className="max-w-[1050px] mx-auto px-6 py-10 flex flex-col md:flex-row items-start gap-10 md:gap-[60px]">
          {/* Left */}
          <div className="flex flex-col gap-6 w-full md:w-[394px]">
            <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400, fontSize: 14, color: "#E74040", letterSpacing: "0.2px", margin: 0 }}>
              Problems trying
            </p>
            <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 24, lineHeight: "32px", color: "#252B42", letterSpacing: "0.1px", margin: 0 }}>
              Met minim Mollie non desert Alame est ali cliquy dolor do met sent.
            </h3>
          </div>
          {/* Right */}
          <div className="w-full md:w-[529px]">
            <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400, fontSize: 14, lineHeight: "20px", color: "#737373", letterSpacing: "0.2px", margin: 0 }}>
              Problems trying to resolve the conflict between the two major realms of Classical physics: Newtonian mechanics
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. STATS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white">
        <div className="max-w-[1050px] mx-auto px-6 py-[80px]">
          <div className="flex flex-wrap justify-center gap-8 md:gap-[30px]">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 w-[140px]">
                <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "clamp(36px, 5vw, 58px)", lineHeight: "80px", color: "#252B42", letterSpacing: "0.2px" }}>
                  {s.value}
                </span>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 16, color: "#737373", letterSpacing: "0.1px", textAlign: "center" }}>
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
          <div className="relative w-full rounded-[20px] overflow-hidden" style={{ height: "clamp(240px, 50vw, 540px)", background: "#B5CFD8" }}>
            {/* Replace this div's background with your video thumbnail image */}
            {/* e.g. style={{ backgroundImage: "url('/assets/video-thumb.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} */}
<div 
  className="absolute inset-0" 
  style={{ 
    backgroundImage: "url('/Video card.png')",
    backgroundSize: "cover",
    backgroundPosition: "center"
  }} 
/>            {/* Play button */}
            <button
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border-none cursor-pointer"
              style={{ width: 92, height: 92, background: "#23A6F0" }}
              aria-label="Play video"
            >
              <Play size={28} color="#FFFFFF" fill="#FFFFFF" />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          5. MEET OUR TEAM
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white">
        <div className="max-w-[1050px] mx-auto px-6 py-[112px] flex flex-col items-center gap-[112px]">
          <SectionHeading
            title="Meet Our Team"
            paragraph="Problems trying to resolve the conflict between the two major realms of Classical physics: Newtonian mechanics"
          />
          <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-[30px] w-full">
            {ABOUT_TEAM.map((m) => (
              <AboutTeamCard key={m.id} member={m} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          6. BIG COMPANIES / CLIENTS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="w-full" style={{ background: "#FAFAFA" }}>
        <div className="max-w-[1050px] mx-auto px-6 py-[80px] flex flex-col items-center gap-[24px]">
          <SectionHeading
            title="Big Companies Are Here"
            paragraph="Problems trying to resolve the conflict between the two major realms of Classical physics: Newtonian mechanics"
          />
          {/* Client logos — replace these spans with real <img> or SVG imports */}
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-[30px] py-[50px]">
            {CLIENTS.map((name) => (
              <div key={name} className="flex items-center justify-center w-[120px] md:w-[153px]">
                {/* Replace with: <img src={logoSrc} alt={name} className="max-h-[72px] object-contain opacity-50" /> */}
                <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 22, color: "#737373", letterSpacing: "0.1px" }}>
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          7. CTA / TESTIMONIAL — blue background
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="w-full overflow-hidden" style={{ background: "#2A7CC7" }}>
        <div className="max-w-[1050px] mx-auto px-6 py-[112px] flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left — text */}
          <div className="flex flex-col items-start gap-6 w-full md:max-w-[438px]">
            <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 16, color: "#FFFFFF", letterSpacing: "0.1px" }}>
              WORK WITH US
            </span>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "clamp(28px, 4vw, 40px)", lineHeight: "1.25", color: "#FFFFFF", letterSpacing: "0.2px", margin: 0 }}>
              Now Let's Grow Yours
            </h2>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400, fontSize: 14, lineHeight: "20px", color: "#FFFFFF", letterSpacing: "0.2px", margin: 0 }}>
              The gradual accumulation of information about atomic and small-scale behaviour during the first quarter of the 20th
            </p>
            <button style={{ border: "1px solid #FAFAFA", borderRadius: 5, background: "transparent", padding: "15px 40px", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14, color: "#FAFAFA", cursor: "pointer", letterSpacing: "0.2px" }}>
              Button
            </button>
          </div>

          {/* Right — woman image placeholder */}
          {/* Right — woman image */}
<div className="hidden md:block w-[340px] flex-shrink-0">
  <img src="/desktop-testimonials-4.png" alt="Work with us" className="w-full h-[412px] object-cover rounded-lg" />
</div>
        </div>
      </section>

    </main>
  );
}
