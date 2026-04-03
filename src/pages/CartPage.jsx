import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { removeFromCart, updateCartItemCount, clearCart } from '../store/shoppingCartReducer';

export default function CartPage() {
  const dispatch = useDispatch();
  const cart     = useSelector(s => s.shoppingCart.cart); // [{count, product}]

  // Derived totals from the new cart shape
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.count, 0);
  const shipping  = subtotal > 50 ? 0 : 4.99;
  const tax       = subtotal * 0.08;
  const grand     = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-['Montserrat']">
      <div className="bg-[#FAFAFA] py-10 text-center border-b border-[#E8E8E8]">
        <h1 className="font-bold text-[24px] text-[#252B42] mb-2">Shopping Cart</h1>
        <div className="flex justify-center gap-2 font-bold text-[14px] text-[#737373]">
          <Link to="/" className="text-[#252B42] no-underline">Home</Link>
          <span className="text-[#BDBDBD]">›</span>
          <span>Cart</span>
        </div>
      </div>

      <div className="max-w-[1050px] mx-auto px-6 py-10">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[100px] gap-4">
            <ShoppingBag size={72} color="#E8E8E8" />
            <h2 className="font-bold text-[22px] text-[#252B42]">Your cart is empty</h2>
            <p className="text-[14px] text-[#737373]">Looks like you haven't added anything yet.</p>
            <Link to="/shop" className="bg-[#23A6F0] text-white no-underline py-[14px] px-[40px] rounded-[5px] font-bold text-[14px] mt-2">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex gap-6 items-start flex-wrap">
            {/* Items table */}
            <div className="flex-1 min-w-[320px]">
              <div className="bg-white border border-[#E8E8E8] rounded-[5px] overflow-hidden">
                <div className="flex py-[14px] px-5 bg-[#FAFAFA] border-b border-[#E8E8E8]">
                  <span className="flex-[3] font-bold text-[12px] text-[#737373] uppercase tracking-[0.2px]">Product</span>
                  <span className="flex-[1] font-bold text-[12px] text-[#737373] uppercase">Price</span>
                  <span className="flex-[1.5] font-bold text-[12px] text-[#737373] uppercase">Quantity</span>
                  <span className="flex-[1] font-bold text-[12px] text-[#737373] uppercase">Total</span>
                  <span className="w-[40px]"></span>
                </div>

                {cart.map(({ count, product }) => (
                  <div key={product.id} className="flex py-4 px-5 border-b border-[#E8E8E8] items-center">
                    <div className="flex-[3] flex items-center gap-3">
                      <Link to={`/product/${product.id}`}>
                        <img src={product.image} alt={product.name} className="w-[60px] h-[72px] object-cover rounded" />
                      </Link>
                      <div>
                        <p className="font-bold text-[14px] text-[#252B42] mb-[3px]">{product.name}</p>
                        <p className="font-semibold text-[12px] text-[#737373]">{product.department}</p>
                      </div>
                    </div>
                    <span className="flex-[1] font-bold text-[14px] text-[#252B42]">${product.price.toFixed(2)}</span>
                    <div className="flex-[1.5] flex border border-[#E8E8E8] rounded w-[100px] overflow-hidden">
                      <button onClick={() => dispatch(updateCartItemCount(product.id, count - 1))}
                        className="w-8 h-9 border-none bg-white cursor-pointer flex items-center justify-center">
                        <Minus size={12} color="#737373" />
                      </button>
                      <span className="w-9 flex items-center justify-center font-bold text-[14px] border-x border-[#E8E8E8]">{count}</span>
                      <button onClick={() => dispatch(updateCartItemCount(product.id, count + 1))}
                        className="w-8 h-9 border-none bg-white cursor-pointer flex items-center justify-center">
                        <Plus size={12} color="#737373" />
                      </button>
                    </div>
                    <span className="flex-[1] font-bold text-[14px] text-[#23856D]">${(product.price * count).toFixed(2)}</span>
                    <button onClick={() => { dispatch(removeFromCart(product.id)); toast.info(`${product.name} removed`); }}
                      className="w-[40px] bg-transparent border-none cursor-pointer flex items-center justify-center">
                      <Trash2 size={16} color="#BDBDBD" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4">
                <Link to="/shop" className="flex items-center gap-1.5 text-[#23A6F0] no-underline font-bold text-[14px]">
                  <ArrowLeft size={14} /> Continue Shopping
                </Link>
                <button onClick={() => { dispatch(clearCart()); toast.info('Cart cleared'); }}
                  className="bg-transparent border-none cursor-pointer text-[#737373] font-['Montserrat'] font-bold text-[13px] flex items-center gap-[5px]">
                  <Trash2 size={13} /> Clear Cart
                </button>
              </div>

              <div className="bg-white border border-[#E8E8E8] rounded-[5px] p-5 mt-4">
                <h3 className="font-bold text-[15px] text-[#252B42] mb-3">Coupon Code</h3>
                <div className="flex border border-[#E8E8E8] rounded-[5px] overflow-hidden">
                  <input type="text" placeholder="Enter coupon code"
                    className="flex-1 border-none py-3 px-[14px] font-['Montserrat'] text-[14px] outline-none text-[#252B42]" />
                  <button className="bg-[#23A6F0] text-white border-none py-3 px-5 font-['Montserrat'] font-bold text-[14px] cursor-pointer">
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-[300px] shrink-0 bg-white border border-[#E8E8E8] rounded-[5px] p-6 sticky top-[90px]">
              <h2 className="font-bold text-[18px] text-[#252B42] mb-5">Order Summary</h2>
              {[
                ['Subtotal', `$${subtotal.toFixed(2)}`],
                ['Shipping', shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`],
                ['Tax (8%)',  `$${tax.toFixed(2)}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between mb-[14px] text-[14px]">
                  <span className="font-semibold text-[#737373]">{k}</span>
                  <span className={`font-bold ${v === 'FREE' ? 'text-[#23856D]' : 'text-[#252B42]'}`}>{v}</span>
                </div>
              ))}
              {shipping > 0 && (
                <p className="text-[12px] text-[#23A6F0] font-semibold bg-[#f0f9ff] px-3 py-2 rounded mb-[14px]">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
              <div className="border-t border-[#E8E8E8] pt-[14px] flex justify-between mb-5">
                <span className="font-bold text-[16px] text-[#252B42]">Total</span>
                <span className="font-bold text-[20px] text-[#252B42]">${grand.toFixed(2)}</span>
              </div>
              <Link to="/checkout"
                className="block text-center bg-[#23A6F0] text-white no-underline py-[14px] rounded-[5px] font-bold text-[14px] mb-3">
                Proceed to Checkout
              </Link>
              <div className="text-center text-[12px] text-[#737373] font-semibold">🔒 Secure checkout</div>
              <div className="flex justify-center gap-1.5 mt-[10px]">
                {['VISA', 'MC', 'AMEX', 'PP'].map(p => (
                  <span key={p} className="text-[10px] font-bold border border-[#E8E8E8] rounded-[3px] px-1.5 py-[3px] text-[#737373]">{p}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
