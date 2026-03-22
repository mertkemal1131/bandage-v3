import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import { toast } from 'react-toastify'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const history = useHistory()
  const isWished = useSelector(s => s.wishlist.items.some(i => i.id === product.id))

  const addToCart = e => { e.stopPropagation(); dispatch({ type:'ADD_TO_CART', payload:product }); toast.success(`${product.name} added!`, { autoClose:2000 }) }
  const toggleWish = e => { e.stopPropagation(); dispatch({ type:'TOGGLE_WISHLIST', payload:product }); toast.info(isWished ? 'Removed':'Added to wishlist!', { autoClose:2000 }) }
  const goDetail = () => history.push(`/product/${product.id}`)

  return (
    // Mobile: full width ~295px card, 360px image height (per Figma)
    // Desktop: fixed 183px wide card
    <div onClick={goDetail}
  className="w-[295px] md:w-[183px] bg-white cursor-pointer flex flex-col group hover:shadow-xl transition-shadow duration-300">

      {/* Mobile: 360px tall image. Desktop: 238px */}
      <div className="w-full h-[360px] md:h-[238px] overflow-hidden relative flex-shrink-0">
        <img src={product.image} alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Btn onClick={addToCart} title="Cart"><ShoppingCart size={15} /></Btn>
          <Btn onClick={toggleWish} title="Wishlist" red={isWished}><Heart size={15} fill={isWished ? '#fff':'none'} /></Btn>
          <Btn onClick={e => { e.stopPropagation(); goDetail() }} title="View"><Eye size={15} /></Btn>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col items-center pt-[25px] px-[25px] pb-[35px] gap-2.5">
        <h5 className="m-0 font-bold text-base text-[#252B42] text-center truncate w-full">{product.name}</h5>
        <span className="font-bold text-sm text-[#737373] text-center truncate w-full">{product.department}</span>
        <div className="flex items-center gap-[5px] py-[5px] px-[3px]">
          <span className="font-bold text-base text-[#BDBDBD] line-through">${product.oldPrice.toFixed(2)}</span>
          <span className="font-bold text-base text-[#23856D]">${product.price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

function Btn({ children, onClick, title, red = false }) {
  return (
    <button onClick={onClick} title={title}
      className={`w-[34px] h-[34px] rounded-full border-none cursor-pointer flex items-center justify-center shadow-md transition-colors duration-200 ${red ? 'bg-[#E2462C] text-white' : 'bg-white text-[#252B42] hover:bg-[#23A6F0] hover:text-white'}`}>
      {children}
    </button>
  )
}
