export default function BrandLogos() {
  return (
    <section className="w-full bg-[#FAFAFA]" style={{ height: '175px' }}>
      <div
        className="mx-auto flex flex-row justify-center items-center"
        style={{ maxWidth: '1050px', height: '175px', padding: '50px 0', gap: '30px' }}
      >
        {/* fa-brands-1 — Hooli: 103×34 */}
        <div className="flex items-center justify-center" style={{ width: '153px', height: '34px', flexShrink: 0 }}>
          <svg viewBox="0 0 103 34" width="103" height="34" xmlns="http://www.w3.org/2000/svg">
            <text
              x="1" y="30"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontStyle="italic"
              fontWeight="700"
              fontSize="30"
              fill="#737373"
            >hooli</text>
          </svg>
        </div>

        {/* fa-brands-2 — Lyft: 83×59 */}
        <div className="flex items-center justify-center" style={{ width: '146px', height: '59px', flexShrink: 0 }}>
          <svg viewBox="0 0 83 59" width="83" height="59" xmlns="http://www.w3.org/2000/svg">
            <text
              x="1" y="52"
              fontFamily="'Arial Black', 'Montserrat', sans-serif"
              fontWeight="900"
              fontStyle="italic"
              fontSize="50"
              fill="#737373"
            >lyft</text>
          </svg>
        </div>

        {/* fa-brands-3 — Quill/Feather icon: 102×75 */}
        <div className="flex items-center justify-center" style={{ width: '152px', height: '75px', flexShrink: 0 }}>
          <svg viewBox="0 0 102 75" width="102" height="75" xmlns="http://www.w3.org/2000/svg" fill="none">
            <path
              d="M88 4 C92 4 96 16 78 32 C64 46 44 54 22 72 L14 72 C28 54 50 44 64 30 C82 14 84 4 88 4 Z"
              fill="#737373"
            />
            <path d="M14 72 L10 72 L20 60 Z" fill="#737373" />
            <line x1="70" y1="16" x2="36" y2="56" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" />
            <line x1="78" y1="20" x2="46" y2="56" stroke="#FAFAFA" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* fa-brands-4 — Stripe: 103×42 */}
        <div className="flex items-center justify-center" style={{ width: '151px', height: '42px', flexShrink: 0 }}>
          <svg viewBox="0 0 103 42" width="103" height="42" xmlns="http://www.w3.org/2000/svg">
            <text
              x="1" y="34"
              fontFamily="'Montserrat', 'Arial', sans-serif"
              fontWeight="800"
              fontSize="34"
              fill="#737373"
            >stripe</text>
          </svg>
        </div>

        {/* fa-brands-5 — AWS: 104×62 */}
        <div className="flex items-center justify-center" style={{ width: '151px', height: '62px', flexShrink: 0 }}>
          <svg viewBox="0 0 104 62" width="104" height="62" xmlns="http://www.w3.org/2000/svg">
            <text
              x="1" y="34"
              fontFamily="'Montserrat', 'Arial', sans-serif"
              fontWeight="900"
              fontSize="34"
              letterSpacing="3"
              fill="#737373"
            >aws</text>
            <path
              d="M10 50 Q52 68 94 50"
              stroke="#737373"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M88 44 L94 50 L86 53"
              stroke="#737373"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* fa-brands-6 — Reddit: 76×72 */}
        <div className="flex items-center justify-center" style={{ width: '151px', height: '72px', flexShrink: 0 }}>
          <svg viewBox="0 0 76 72" width="76" height="72" xmlns="http://www.w3.org/2000/svg" fill="#737373">
            <circle cx="38" cy="44" r="28" fill="#737373" />
            <circle cx="57" cy="14" r="5" fill="#737373" />
            <line x1="38" y1="16" x2="54" y2="16" stroke="#737373" strokeWidth="3" strokeLinecap="round"/>
            <line x1="38" y1="16" x2="38" y2="26" stroke="#737373" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="38" cy="44" r="22" fill="white" />
            <circle cx="29" cy="40" r="3.5" fill="#737373" />
            <circle cx="47" cy="40" r="3.5" fill="#737373" />
            <path d="M27 50 Q38 58 49 50" stroke="#737373" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <circle cx="13" cy="44" r="6" fill="#737373" />
            <circle cx="63" cy="44" r="6" fill="#737373" />
            <circle cx="13" cy="44" r="3" fill="white" />
            <circle cx="63" cy="44" r="3" fill="white" />
          </svg>
        </div>
      </div>
    </section>
  )
}
