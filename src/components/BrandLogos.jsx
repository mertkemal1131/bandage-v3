// Drop your brand logo images into /public/brands/ and update the src paths below.
// Each entry: { name, src, width, height } — these match the Figma spec dimensions.
const BRANDS = [
  { name: 'Hooli',  src: '/brands/fa-brands-1.png', width: 103, height:  34 },
  { name: 'Lyft',   src: '/brands/fa-brands-2.png', width:  83, height:  59 },
  { name: 'Leaf',   src: '/brands/fa-brands-3.png', width: 102, height:  75 },
  { name: 'Stripe', src: '/brands/fa-brands-4.png', width: 103, height:  42 },
  { name: 'AWS',    src: '/brands/fa-brands-5.png', width: 104, height:  62 },
  { name: 'Reddit', src: '/brands/fa-brands-6.png', width:  76, height:  72 },
]

export default function BrandLogos() {
  return (
    <section className="w-full bg-[#FAFAFA]">
      <div
        className="mx-auto flex flex-col md:flex-row justify-center items-center gap-[60px] md:gap-[30px]"
        style={{ maxWidth: '1050px', padding: '50px 0' }}
      >
        {BRANDS.map(({ name, src, width, height }) => (
          <div
            key={name}
            className="flex items-center justify-center"
            style={{ flexShrink: 0 }}
          >
            <img
              src={src}
              alt={name}
              width={width}
              height={height}
              style={{ width, height, objectFit: 'contain' }}
            />
          </div>
        ))}
      </div>
    </section>
  )
}