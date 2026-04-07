import { Link } from 'react-router-dom';
import { Calendar, BarChart2, ChevronRight } from 'lucide-react';

// ── Blog post data ─────────────────────────────────────────────────────────────
// Images will be supplied by you — drop your files into /public and update the
// `image` paths below (e.g. 'blog-1.jpg', 'blog-2.jpg' …).
// The `badge` field controls the red pill ("NEW", "SALE", etc.) — set to null
// to hide it.
const POSTS = [
  {
    id: 1,
    desktopImage: 'blog-1.jpg',
    mobileImage:  'blog-1-mobile.jpg',
    badge: 'NEW',
    tags: ['Google', 'Trending', 'New'],
    title: "Koudetat à la Maison #1 (L'Intégrale)",
    description:
      "We focus on ergonomics and meeting you where you work. It's only a keystroke away.",
    date: '22 April 2021',
    comments: 10,
  },
  {
    id: 2,
    desktopImage: 'blog-2.jpg',
    mobileImage:  'blog-2-mobile.jpg',
    badge: 'NEW',
    tags: ['Google', 'Trending', 'New'],
    title: "Koudetat à la Maison #1 (L'Intégrale)",
    description:
      "We focus on ergonomics and meeting you where you work. It's only a keystroke away.",
    date: '22 April 2021',
    comments: 10,
  },
  {
    id: 3,
    desktopImage: 'blog-3.jpg',
    mobileImage:  'blog-1.jpg',
    badge: 'NEW',
    tags: ['Google', 'Trending', 'New'],
    title: "Koudetat à la Maison #1 (L'Intégrale)",
    description:
      "We focus on ergonomics and meeting you where you work. It's only a keystroke away.",
    date: '22 April 2021',
    comments: 10,
  },
  {
    id: 4,
    desktopImage: 'blog-4.jpg',
    mobileImage:  'blog-2.jpg',
    badge: 'NEW',
    tags: ['Google', 'Trending', 'New'],
    title: "Koudetat à la Maison #1 (L'Intégrale)",
    description:
      "We focus on ergonomics and meeting you where you work. It's only a keystroke away.",
    date: '22 April 2021',
    comments: 10,
  },
  {
    id: 5,
    desktopImage: 'blog-5.jpg',
    mobileImage:  'e403f3234352fbe297a33da49162435ddfc7ebb3.jpg',
    badge: 'NEW',
    tags: ['Google', 'Trending', 'New'],
    title: "Koudetat à la Maison #1 (L'Intégrale)",
    description:
      "We focus on ergonomics and meeting you where you work. It's only a keystroke away.",
    date: '22 April 2021',
    comments: 10,
  },
  {
    id: 6,
    desktopImage: 'blog-6.jpg',
    mobileImage:  'd2676d3818335f67670e7c2f65d5314312756628.jpg',
    badge: 'NEW',
    tags: ['Google', 'Trending', 'New'],
    title: "Koudetat à la Maison #1 (L'Intégrale)",
    description:
      "We focus on ergonomics and meeting you where you work. It's only a keystroke away.",
    date: '22 April 2021',
    comments: 10,
  },
];

// ── BlogCard ──────────────────────────────────────────────────────────────────
// `image` is already resolved to the correct desktop or mobile src by the caller.
function BlogCard({ post, image }) {
  return (
    <article
      className="flex flex-col bg-white w-full"
      style={{ boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}
    >
      {/* ── Image area — fixed 300px tall ──────────────────────────────── */}
      <div className="relative w-full h-[300px] overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={e => {
            e.target.style.display = 'none';
            e.target.parentElement.style.background =
              ['#96E9FB','#F9D4A0','#C3CFE2','#ABECD6','#F6A96B','#B8D4F0'][post.id % 6];
          }}
        />

        {/* Red "NEW" badge — Figma: absolute left:20 top:20, 56×24, bg #E74040 */}
        {post.badge && (
          <span
            className="absolute left-[20px] top-[20px] flex items-center justify-center
                       px-[10px] h-[24px] bg-[#E74040] rounded-[3px]
                       font-['Montserrat'] font-bold text-[14px] leading-[24px]
                       tracking-[0.2px] text-white"
            style={{ boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}
          >
            {post.badge}
          </span>
        )}
      </div>

      {/* ── Content area — Figma: padding 25px 25px 35px, gap 10px ──────── */}
      <div className="flex flex-col items-start px-[25px] pt-[25px] pb-[35px] gap-[10px] flex-1">

        {/* Tags row — Figma: gap 15px, small 12px */}
        <div className="flex items-center gap-[15px]">
          {post.tags.map((tag, i) => (
            <span
              key={tag}
              className={`font-['Montserrat'] font-normal text-[12px] leading-[16px] tracking-[0.2px]
                ${i === 0 ? 'text-[#8EC2F2]' : 'text-[#737373]'}`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title — Figma: h4, 20px weight 400, color #252B42 */}
        <h2
          className="font-['Montserrat'] font-normal text-[20px] leading-[30px]
                     tracking-[0.2px] text-[#252B42] m-0"
          style={{ width: '247px' }}
        >
          {post.title}
        </h2>

        {/* Description — Figma: 14px, color #737373 */}
        <p
          className="font-['Montserrat'] font-normal text-[14px] leading-[20px]
                     tracking-[0.2px] text-[#737373] m-0"
          style={{ width: '280px' }}
        >
          {post.description}
        </p>

        {/* Meta row — Figma: justify-between, padding 15px 0, gap 10px */}
        <div className="flex items-center justify-between w-full py-[15px] gap-[10px]">
          {/* Date */}
          <div className="flex items-center gap-[5px]">
            <Calendar size={16} color="#23A6F0" />
            <span className="font-['Montserrat'] font-normal text-[12px] leading-[16px] tracking-[0.2px] text-[#737373]">
              {post.date}
            </span>
          </div>
          {/* Comments */}
          <div className="flex items-center gap-[5px]">
            <BarChart2 size={16} color="#23856D" />
            <span className="font-['Montserrat'] font-normal text-[12px] leading-[16px] tracking-[0.2px] text-[#737373]">
              {post.comments} comments
            </span>
          </div>
        </div>

        {/* Learn More link — Figma: h6 bold 14px #737373, arrow-next #23A6F0 */}
        <Link
          to={`/blog/${post.id}`}
          className="flex items-center gap-[10px] no-underline group"
        >
          <span
            className="font-['Montserrat'] font-bold text-[14px] leading-[24px]
                       tracking-[0.2px] text-[#737373] group-hover:text-[#23A6F0] transition-colors"
          >
            Learn More
          </span>
          <ChevronRight size={9} color="#23A6F0" />
        </Link>
      </div>
    </article>
  );
}

// ── BlogPage ──────────────────────────────────────────────────────────────────
// Desktop: 1050px container, 160px padding top/bottom, 80px gap between rows
//          2-column grid (470px cols, 30px gap) → rows of 2 cards
// Mobile:  414px → single column, 80px padding, cards 330px wide
export default function BlogPage() {
  return (
    <main
      className="w-full bg-white font-['Montserrat']"
      style={{ minHeight: '100vh' }}
    >
      {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
      <div className="w-full bg-[#FAFAFA]">
        <div className="max-w-[1050px] mx-auto px-4 md:px-6 py-[24px]">
          <nav className="flex items-center gap-[15px]">
            <Link
              to="/"
              className="font-bold text-[14px] leading-[24px] tracking-[0.2px]
                         text-[#252B42] no-underline hover:text-[#23A6F0] transition-colors"
            >
              Home
            </Link>
            <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
              <path d="M1 1L8 8L1 15" stroke="#BDBDBD" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#BDBDBD]">
              Blog
            </span>
          </nav>
        </div>
      </div>

      {/* ── Container ──────────────────────────────────────────────────── */}
      {/*
        Figma desktop:
          container: 1050px, padding 160px 0, gap 80px
          row: 970px, gap 30px, 2 × col-md-6 (470px each)
          card inside col: 465px wide

        Figma mobile:
          container: 414px, padding 80px 0, gap 80px
          row: 329px, single column, gap 30px
          card: 330px wide
      */}

      {/* ── Desktop (md+) ─────────────────────────────────────────────── */}
      <div className="hidden md:flex flex-col items-center py-[160px] gap-[80px]">
        {/* Split posts into rows of 2 */}
        {chunk(POSTS, 2).map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="flex flex-row justify-center items-start gap-[30px]"
            style={{ width: '970px' }}
          >
            {row.map(post => (
              // col-md-6: 470px wide, card inside is 465px
              <div key={post.id} className="flex flex-col items-center" style={{ width: '470px' }}>
                <div style={{ width: '465px' }}>
                  <BlogCard post={post} image={post.desktopImage} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ── Mobile (< md) ─────────────────────────────────────────────── */}
      <div className="flex md:hidden flex-col items-center py-[80px] gap-[80px] px-4">
        <div className="flex flex-col gap-[30px] w-full max-w-[330px]">
          {POSTS.map(post => (
            <BlogCard key={post.id} post={post} image={post.mobileImage} />
          ))}
        </div>
      </div>
    </main>
  );
}

// ── utility: split array into chunks of n ────────────────────────────────────
function chunk(arr, n) {
  const result = [];
  for (let i = 0; i < arr.length; i += n) result.push(arr.slice(i, i + n));
  return result;
}