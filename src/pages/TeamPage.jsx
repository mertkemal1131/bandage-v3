// src/pages/TeamPage.jsx

import React from "react";

// ── Team data ─────────────────────────────────────────────────────────────────
// Exported so AboutPage can reuse the same list.
// Replace `image` paths and names/titles with real assets.
export const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Gökhan Özdemir",
    title: "Project Manager",
    image: "/54268cf04ad0f612e9f8f311e9d1c6bbd31a03f3.jpg",
    bg: "#F5C518",
  },
  {
    id: 2,
    name: "Your Name",      // ← replace with your name
    title: "Full Stack Developer",
    image: "/0a05d6ce0fd1eeff9355b162a7e7c01605dd3c55.jpg", // ← replace
    bg: "#B5CFD8",
  },
];

// ── Fallback initials avatar ──────────────────────────────────────────────────
// Exported so AboutPage can reuse it.
export function InitialsAvatar({ name, bg }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: bg }}
    >
      <span
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: "2rem",
          color: "#fff",
          letterSpacing: "0.05em",
          textShadow: "0 1px 4px rgba(0,0,0,0.18)",
        }}
      >
        {initials}
      </span>
    </div>
  );
}

// ── Team card ─────────────────────────────────────────────────────────────────
// Exported so AboutPage can reuse it.
export function TeamCard({ member }) {
  const [imgError, setImgError] = React.useState(!member.image);

  return (
    <div
      className="flex flex-col items-center w-full md:w-[240px]"
      style={{ background: "#FFFFFF", borderRadius: 5, overflow: "hidden" }}
    >
      {/* Image — taller on mobile, fixed on desktop */}
      <div className="w-full" style={{ height: "clamp(156px, 45vw, 200px)", overflow: "hidden" }}>
        {member.image && !imgError ? (
          <img
            src={member.image}
            alt={member.name}
            onError={() => setImgError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <InitialsAvatar name={member.name} bg={member.bg} />
        )}
      </div>

      {/* Name + title */}
      <div className="flex flex-col items-center" style={{ padding: "15px 50px", gap: 10 }}>
        <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 16, lineHeight: "24px", textAlign: "center", letterSpacing: "0.1px", color: "#252B42", whiteSpace: "nowrap" }}>
          {member.name}
        </span>
        <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14, lineHeight: "24px", textAlign: "center", letterSpacing: "0.2px", color: "#23A6F0", whiteSpace: "nowrap" }}>
          {member.title}
        </span>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function TeamPage() {
  return (
    <main style={{ background: "#FAFAFA", width: "100%" }}>
      <div
        className="w-full flex flex-col items-center"
        style={{ maxWidth: 1050, margin: "0 auto", padding: "60px 24px 80px", gap: 48 }}
      >
        {/* Header */}
        <div className="flex flex-col items-center" style={{ gap: 10, textAlign: "center" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "clamp(28px, 5vw, 40px)", lineHeight: "1.25", letterSpacing: "0.2px", color: "#252B42", margin: 0 }}>
            Meet Our Team
          </h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400, fontSize: 14, lineHeight: "20px", textAlign: "center", letterSpacing: "0.2px", color: "#737373", maxWidth: 469, margin: 0 }}>
            Problems trying to resolve the conflict between the two major realms
            of Classical physics: Newtonian mechanics
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col md:flex-row md:flex-wrap justify-center items-center gap-[30px] w-full">
          {TEAM_MEMBERS.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </main>
  );
}
