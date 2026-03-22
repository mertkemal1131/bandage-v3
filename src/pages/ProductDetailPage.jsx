import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Heart, ShoppingCart, Star, ChevronRight, Minus, Plus, Share2 } from 'lucide-react';
import { products } from '../data/mockData';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));
  const dispatch = useDispatch();
  const wishlist = useSelector(s => s.wishlist.items);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  if (!product) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 font-['Montserrat']">
      <p className="text-[20px] font-bold text-[#737373]">Product not found</p>
      <Link to="/shop" className="text-[#23A6F0] font-bold no-underline">← Back to Shop</Link>
    </div>
  );

  const isWishlisted = wishlist.some(i => i.id === product.id);
  const thumbImgs = [product.image, product.image, product.image, product.image];
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = Math.round((1 - product.price / product.oldPrice) * 100);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) dispatch({ type: 'ADD_TO_CART', payload: product });
    toast.success(`${qty}× ${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-white font-['Montserrat']">
      {/* Breadcrumb */}
      <div className="bg-[#FAFAFA] py-4 border-b border-[#E8E8E8]">
        <div className="max-w-[1050px] mx-auto px-6 flex items-center gap-2 font-bold text-[14px] text-[#737373]">
          <Link to="/" className="text-[#737373] no-underline">Home</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="text-[#737373] no-underline">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-[#252B42]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1050px] mx-auto px-6 py-10">
        {/* Product section */}
        <div className="flex gap-10 mb-[60px] flex-wrap">

          {/* Images */}
          <div className="flex gap-4 flex-[0_0_auto]">
            {/* Thumbnails */}
            <div className="flex flex-col gap-2">
              {thumbImgs.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-[72px] h-20 rounded overflow-hidden p-0 cursor-pointer border-2 ${activeImg === i ? 'border-[#23A6F0]' : 'border-transparent'}`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            {/* Main image */}
            <div className="w-[380px] h-[480px] rounded-lg overflow-hidden bg-[#FAFAFA] shrink-0">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-[280px] flex flex-col gap-4">
            <h1 className="font-bold text-[24px] leading-8 text-[#252B42] m-0">{product.name}</h1>

            {/* Stars */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14} color={s <= product.rating ? '#FFCE31' : '#BDBDBD'} fill={s <= product.rating ? '#FFCE31' : '#BDBDBD'} />
                ))}
              </div>
              <span className="font-bold text-[12px] text-[#737373]">{product.reviews} Reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="font-bold text-[28px] text-[#252B42]">${product.price.toFixed(2)}</span>
              <span className="font-bold text-[16px] text-[#BDBDBD] line-through">${product.oldPrice.toFixed(2)}</span>
              <span className="bg-[rgba(45,192,113,0.1)] text-[#2DC071] font-bold text-[12px] px-[10px] py-1 rounded">
                -{discount}% OFF
              </span>
            </div>

            <p className="font-normal text-[14px] text-[#737373] leading-5 m-0">{product.description}</p>

            {/* Colors */}
            <div>
              <p className="font-bold text-[12px] text-[#252B42] tracking-[0.1px] mb-2 uppercase">Color</p>
              <div className="flex gap-2">
                {product.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    className={`w-7 h-7 rounded-full cursor-pointer transition-all border-[3px] ${
                      selectedColor === i ? 'border-[#252B42] outline outline-2 outline-[#252B42]' : 'border-transparent outline-none'
                    }`}
                    style={{ background: color }}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className="font-bold text-[12px] text-[#252B42] tracking-[0.1px] mb-2 uppercase">Size</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(i)}
                    className={`min-w-[40px] py-1.5 px-3 rounded cursor-pointer font-['Montserrat'] font-bold text-[13px] transition-all border-2 ${
                      selectedSize === i
                        ? 'border-[#252B42] bg-[#252B42] text-white'
                        : 'border-[#E8E8E8] bg-white text-[#737373]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + CTA */}
            <div className="flex gap-3 items-center flex-wrap">
              <div className="flex border-2 border-[#E8E8E8] rounded-[5px] overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-11 border-none bg-white cursor-pointer flex items-center justify-center">
                  <Minus size={14} color="#252B42" />
                </button>
                <span className="w-11 h-11 flex items-center justify-center font-bold text-[16px] text-[#252B42] border-x-2 border-[#E8E8E8]">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-10 h-11 border-none bg-white cursor-pointer flex items-center justify-center">
                  <Plus size={14} color="#252B42" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-2 bg-[#23A6F0] text-white border-none rounded-[5px] py-3 px-6 font-['Montserrat'] font-bold text-[14px] cursor-pointer flex-1 justify-center min-w-[160px]"
              >
                <ShoppingCart size={16} /> Add to Cart
              </button>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_WISHLIST', payload: product })}
                className={`w-11 h-11 border-2 rounded-[5px] cursor-pointer flex items-center justify-center ${
                  isWishlisted ? 'border-[#E2462C] bg-[#fff5f5]' : 'border-[#E8E8E8] bg-white'
                }`}
              >
                <Heart size={16} color={isWishlisted ? '#E2462C' : '#737373'} fill={isWishlisted ? '#E2462C' : 'none'} />
              </button>
              <button className="w-11 h-11 border-2 border-[#E8E8E8] rounded-[5px] bg-white cursor-pointer flex items-center justify-center">
                <Share2 size={16} color="#737373" />
              </button>
            </div>

            {/* Meta */}
            <div className="border-t border-[#E8E8E8] pt-4 flex flex-col gap-1.5">
              {[['Availability', 'In Stock', '#23856D'], ['Category', product.category, '#252B42'], ['Department', product.department, '#252B42']].map(([k, v, c]) => (
                <p key={k} className="font-bold text-[14px] text-[#737373] m-0">
                  {k}: <span style={{ color: c }}>{v}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#E8E8E8] mb-6 flex">
          {['description', 'reviews', 'shipping'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 border-none bg-transparent cursor-pointer font-['Montserrat'] font-bold text-[14px] tracking-[0.2px] capitalize transition-colors -mb-px ${
                activeTab === tab
                  ? 'text-[#23A6F0] border-b-2 border-[#23A6F0]'
                  : 'text-[#737373] border-b-2 border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <p className="font-normal text-[14px] text-[#737373] leading-6 max-w-[680px] mb-[60px]">
          {activeTab === 'description' && `${product.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.`}
          {activeTab === 'reviews' && `${product.reviews} verified reviews. Customers love the quality and fit. Average rating: ${product.rating}/5 stars.`}
          {activeTab === 'shipping' && 'Free shipping on orders over $50. Standard delivery 3-5 business days. Express delivery available at checkout.'}
        </p>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="font-bold text-[24px] text-[#252B42] mb-6">Related Products</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(183px,1fr))] gap-[30px]">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
