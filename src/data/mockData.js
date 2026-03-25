// Product images — real fashion photos
const imgs = [
  '23057910d190d178c2a7b276e896b9d38b982bf6.jpg',
  '74e648e43f346f3e64ec6890751ec33b3c7f5197.jpg',
  '4a6a10161217dc07ba1cda4632e93a5851162bcb.jpg',
  'edfda1c222054dedce3ff32fe480d8fc8eb07474.jpg',
  '41ba1a582a6be5d0abdf4716fbac8cd3a73cb266.jpg',
  '23057910d190d178c2a7b276e896b9d38b982bf6.jpg',
  'a4b9d5defc9e3b83803619da05903140ffc77947.jpg',
  '110bc11c4432558f247264194359558513a225fe.jpg',
  'c91168410dcfe4d267b32aaf7b21288f7b9656f2.jpg',
  '4a6a10161217dc07ba1cda4632e93a5851162bcb.jpg',
];

// All 10 cards use the same Figma placeholder text & prices
export const products = imgs.map((image, i) => ({
  id: i + 1,
  name: 'Graphic Design',
  department: 'English Department',
  category: 'shirts',
  price: 6.48,
  oldPrice: 16.48,
  rating: 5,
  reviews: 10,
  colors: ['#23A6F0', '#23856D', '#E77C40', '#252B42'],
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  image,
  description: 'We focus on ergonomics and meeting you where you work. It\'s only a keystroke away.',
}));

export const posts = [
  { id: 1, title: 'Graphic Design', category: 'Google', date: 'Jan 28, 2022', comments: 10, likes: 10, badge: 'NEW', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop', excerpt: 'We focus on ergonomics and meeting you where you work.' },
  { id: 2, title: 'Graphic Design', category: 'Google', date: 'Jan 28, 2022', comments: 8,  likes: 15, badge: null, image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop', excerpt: 'We focus on ergonomics and meeting you where you work.' },
];

export const categories = [
  { id: 'all',         label: 'All Products' },
  { id: 'shirts',      label: 'Shirts' },
  { id: 'dresses',     label: 'Dresses' },
  { id: 'jackets',     label: 'Jackets' },
  { id: 'pants',       label: 'Pants' },
  { id: 'shoes',       label: 'Shoes' },
  { id: 'accessories', label: 'Accessories' },
];

export const featuredPosts = [
  {
    id: 1,
    name: 'Graphic Design',
    title: "Loudest à la Madison #1 (L'integral)",
    department: 'English Department',
    rating: 4.9,
    sales: '15 Sales',
    meta: [
      { label: '22h...' },
      { label: '64 Lessons' },
      { label: 'Progress' },
    ],    
    description: "We focus on ergonomics and meeting you where you work. It's only a keystroke away.",
    oldPrice: 16.48,
    price: 6.48,
    colors: ['#23A6F0', '#23856D', '#E77C40', '#252B42'],
    date: 'Jan 14',
    comments: '22 comments',
    tag: 'Graphic',
    image: 'e403f3234352fbe297a33da49162435ddfc7ebb3.jpg', 
    mobileImage: '7e03d89b289c20edd2275a08f2d2df5371ff7f8c.jpg',
  },
  {
    id: 2,
    name: 'Graphic Design',
    title: "Loudest à la Madison #1 (L'integral)",
    department: 'English Department',
    rating: 4.9,
    sales: '15 Sales',
    meta: [
      { label: '22h...' },
      { label: '64 Lessons' },
      { label: 'Progress' },
    ],
    description: "We focus on ergonomics and meeting you where you work. It's only a keystroke away.",
    oldPrice: 16.48,
    price: 6.48,
    colors: ['#23A6F0', '#23856D', '#E77C40', '#252B42'],
    date: 'Jan 14',
    comments: '22 comments',
    tag: 'Graphic',
    image: 'd2676d3818335f67670e7c2f65d5314312756628.jpg',  
    mobileImage: '5267105824e3c5c922730b2e509c49e6b03b75f8.jpg',
  },
];