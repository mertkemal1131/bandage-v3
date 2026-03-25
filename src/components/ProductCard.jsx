import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import { toast } from 'react-toastify'

// cardWidth  — controls the card's outer width class (default: 'w-full', HomePage passes 'w-[295px] md:w-[239px]')
// imageHeight — controls the image area height class  (default: 'h-[427px] md:h-[300px]', HomePage passes 'h-[360px] md:h-[238px]')
export default function ProductCard({ product, cardWidth = 'w-full', imageHeight = 'h-[427px] md:h-[300px]', objectFit = 'object-cover' }) {
  const dispatch = useDispatch()
  const history = useHistory()
  const isWished = useSelector(s => s.wishlist.items.some(i => i.id === product.id))

  const addToCart = e => { e.stopPropagation(); dispatch({ type: 'ADD_TO_CART', payload: product }); toast.success(`${product.name} added!`, { autoClose: 2000 }) }
  const toggleWish = e => { e.stopPropagation(); dispatch({ type: 'TOGGLE_WISHLIST', payload: product }); toast.info(isWished ? 'Removed' : 'Added to wishlist!', { autoClose: 2000 }) }
  const goDetail = () => history.push(`/product/${product.id}`)

  return (
    <div
      onClick={goDetail}
      className={`${cardWidth} bg-white cursor-pointer flex flex-col group hover:shadow-xl transition-shadow duration-300`}
    >
      {/* Image */}
      <div className={`w-full ${imageHeight} overflow-hidden relative flex-shrink-0`}>
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full ${objectFit} group-hover:scale-105 transition-transform duration-500`}
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ActionBtn onClick={addToCart} title="Add to Cart"><ShoppingCart size={15} /></ActionBtn>
          <ActionBtn onClick={toggleWish} title="Wishlist" red={isWished}><Heart size={15} fill={isWished ? '#fff' : 'none'} /></ActionBtn>
          <ActionBtn onClick={e => { e.stopPropagation(); goDetail() }} title="View"><Eye size={15} /></ActionBtn>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col items-center pt-[25px] px-[25px] pb-[35px] gap-[10px]">
        <h5 className="m-0 font-bold text-[16px] text-[#252B42] text-center leading-[24px] tracking-[0.1px]">
          {product.name}
        </h5>
        <span className="font-bold text-[14px] text-[#737373] text-center leading-[24px] tracking-[0.2px]">
          {product.department}
        </span>
        <div className="flex items-center gap-[5px]">
          <span className="font-bold text-[16px] text-[#BDBDBD] line-through">${product.oldPrice.toFixed(2)}</span>
          <span className="font-bold text-[16px] text-[#23856D]">${product.price.toFixed(2)}</span>
        </div>
        {/* Color swatches */}
        {product.colors && (
          <div className="flex items-center gap-[6px]">
            {product.colors.map((color, i) => (
              <span
                key={i}
                className="w-[16px] h-[16px] rounded-full inline-block border border-white shadow-sm"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ActionBtn({ children, onClick, title, red = false }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-[34px] h-[34px] rounded-full border-none cursor-pointer flex items-center justify-center shadow-md transition-colors duration-200 ${red ? 'bg-[#E2462C] text-white' : 'bg-white text-[#252B42] hover:bg-[#23A6F0] hover:text-white'}`}
    >
      {children}
    </button>
  )
}
