import { useDispatch, useSelector } from 'react-redux'
import { addToCart, toggleWishlist } from '../store/shoppingCartReducer'
import { useHistory } from 'react-router-dom'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import { toast } from 'react-toastify'

// ── Helpers ───────────────────────────────────────────────────────────────────
function genderSlug(gender) {
  const g = (gender ?? '').toLowerCase();
  if (g === 'k' || g === 'kadin' || g === 'women') return 'kadin';
  if (g === 'e' || g === 'erkek' || g === 'men')   return 'erkek';
  return g || 'unisex';
}

export function slugify(str) {
  return (str ?? '')
    .toLowerCase()
    .normalize('NFD')                  // decompose accented chars
    .replace(/[\u0300-\u036f]/g, '')   // strip diacritics
    .replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u')
    .replace(/ö/g, 'o').replace(/ı/g, 'i').replace(/ç/g, 'c')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'product';
}

// ── Field normaliser ─────────────────────────────────────────────────────────
// Handles both mock-data shape and the real API shape.
//
// API product:  id, name, description, price, discount_price?, rating,
//               sell_count, stock, category_id, images[{url, index}]
// Mock product: id, name, department, price, oldPrice, rating, image, colors
//
export function normaliseProduct(p) {
  const image    = p.images?.[0]?.url ?? p.image ?? null;
  const curPrice = p.discount_price ?? p.price ?? 0;
  const oldPrice = p.discount_price != null ? p.price : (p.oldPrice ?? p.price ?? 0);

  return {
    ...p,
    _image:    image,
    _price:    Number(curPrice),
    _oldPrice: Number(oldPrice),
  };
}

// ── ProductCard ───────────────────────────────────────────────────────────────
export default function ProductCard({
  product: raw,
  cardWidth   = 'w-full',
  imageHeight = 'h-[427px] md:h-[300px]',
  objectFit   = 'object-cover',
}) {
  const dispatch   = useDispatch()
  const history    = useHistory()
  const isWished   = useSelector(s => s.wishlist.items.some(i => i.id === raw.id))
  const categories = useSelector(s => s.product.categories)

  const product = normaliseProduct(raw)

  // Build the detail URL: shop/:gender/:categoryName/:categoryId/:productSlug/:productId
  // Falls back to /product/:id if the category isn't in the store yet (e.g. mock data).
  const buildUrl = () => {
    const cat = categories.find(c => c.id === product.category_id);
    if (cat) {
      const gender   = genderSlug(cat.gender);
      const catSlug  = slugify(cat.title);
      const prodSlug = slugify(product.name);
      return `/shop/${gender}/${catSlug}/${cat.id}/${prodSlug}/${product.id}`;
    }
    return `/product/${product.id}`;   // graceful fallback for mock products
  };

  const goDetail = () => history.push(buildUrl());

  const handleAddToCart = e => {
    e.stopPropagation();
    dispatch(addToCart(product));
    toast.success(`${product.name} added!`, { autoClose: 2000 });
  };

  const handleToggleWish = e => {
    e.stopPropagation();
    dispatch(toggleWishlist(product));
    toast.info(isWished ? 'Removed from wishlist' : 'Added to wishlist!', { autoClose: 2000 });
  };

  const imgSrc = product._image
    ? product._image.startsWith('http') ? product._image : `/${product._image}`
    : 'https://placehold.co/300x400/f3f3f3/bdbdbd?text=No+Image';

  return (
    <div
      onClick={goDetail}
      className={`${cardWidth} bg-white cursor-pointer flex flex-col group
                  hover:shadow-xl hover:-translate-y-1
                  transition-all duration-300 rounded-sm`}
    >
      {/* Image */}
      <div className={`w-full ${imageHeight} overflow-hidden relative flex-shrink-0`}>
        <img
          src={imgSrc}
          alt={product.name}
          className={`w-full h-full ${objectFit} group-hover:scale-105 transition-transform duration-500`}
          onError={e => { e.target.src = 'https://placehold.co/300x400/f3f3f3/bdbdbd?text=No+Image'; }}
        />
        {/* Action overlay */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center gap-2
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ActionBtn onClick={handleAddToCart}  title="Add to Cart"><ShoppingCart size={15} /></ActionBtn>
          <ActionBtn onClick={handleToggleWish} title="Wishlist" red={isWished}>
            <Heart size={15} fill={isWished ? '#fff' : 'none'} />
          </ActionBtn>
          <ActionBtn onClick={e => { e.stopPropagation(); goDetail(); }} title="View"><Eye size={15} /></ActionBtn>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col items-center pt-[25px] px-[25px] pb-[35px] gap-[10px]">
        <h5 className="m-0 font-bold text-[16px] text-[#252B42] text-center leading-[24px] tracking-[0.1px] line-clamp-2">
          {product.name}
        </h5>
        {product.department && (
          <span className="font-bold text-[14px] text-[#737373] text-center leading-[24px] tracking-[0.2px]">
            {product.department}
          </span>
        )}
        <div className="flex items-center gap-[5px]">
          {product._oldPrice !== product._price && (
            <span className="font-bold text-[16px] text-[#BDBDBD] line-through">
              ${product._oldPrice.toFixed(2)}
            </span>
          )}
          <span className="font-bold text-[16px] text-[#23856D]">
            ${product._price.toFixed(2)}
          </span>
        </div>
        {product.colors && (
          <div className="flex items-center gap-[6px]">
            {product.colors.map((color, i) => (
              <span key={i} className="w-[16px] h-[16px] rounded-full inline-block border border-white shadow-sm"
                style={{ backgroundColor: color }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ActionBtn({ children, onClick, title, red = false }) {
  return (
    <button onClick={onClick} title={title}
      className={`w-[34px] h-[34px] rounded-full border-none cursor-pointer
                  flex items-center justify-center shadow-md transition-colors duration-200
                  ${red ? 'bg-[#E2462C] text-white' : 'bg-white text-[#252B42] hover:bg-[#23A6F0] hover:text-white'}`}
    >
      {children}
    </button>
  );
}
