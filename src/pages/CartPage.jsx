import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Trash2, Plus, Minus, ShoppingBag, CheckCircle2 } from 'lucide-react';
import {
  removeFromCart,
  updateCartItemCount,
  toggleChecked,
  toggleAllChecked,
} from '../store/shoppingCartReducer';
import { normaliseProduct } from '../components/ProductCard';

// ── Small helpers ─────────────────────────────────────────────────────────────
function getImgSrc(product) {
  const raw = product._image ?? product.images?.[0]?.url ?? product.image ?? null;
  if (!raw) return 'https://placehold.co/80x80/f3f3f3/bdbdbd?text=?';
  return raw.startsWith('http') ? raw : `/${raw}`;
}

function getPrice(product) {
  return product._price ?? product.discount_price ?? product.price ?? 0;
}

// ── Checkbox ──────────────────────────────────────────────────────────────────
function Checkbox({ checked, onChange, size = 20 }) {
  return (
    <button
      onClick={onChange}
      className="flex-shrink-0 border-none bg-transparent cursor-pointer p-0"
      aria-label={checked ? 'Deselect' : 'Select'}
    >
      <div
        className={`rounded flex items-center justify-center transition-colors duration-150`}
        style={{ width: size, height: size,
          background: checked ? '#5C3EE8' : 'white',
          border: checked ? '2px solid #5C3EE8' : '2px solid #BDBDBD',
        }}
      >
        {checked && (
          <svg width={size - 6} height={size - 6} viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </button>
  );
}

// ── Quantity stepper ──────────────────────────────────────────────────────────
function Stepper({ count, onDec, onInc }) {
  return (
    <div className="flex items-center border border-[#BDBDBD] rounded-[4px] overflow-hidden bg-white">
      <button
        onClick={onDec}
        className="w-[32px] h-[32px] flex items-center justify-center bg-white
                   border-none cursor-pointer hover:bg-[#f5f5f5] transition-colors"
      >
        <Minus size={12} color="#252B42" />
      </button>
      <span className="w-[36px] text-center font-bold text-[14px] text-[#252B42]
                       border-x border-[#BDBDBD] h-[32px] flex items-center justify-center">
        {count}
      </span>
      <button
        onClick={onInc}
        className="w-[32px] h-[32px] flex items-center justify-center bg-white
                   border-none cursor-pointer hover:bg-[#f5f5f5] transition-colors"
      >
        <Plus size={12} color="#252B42" />
      </button>
    </div>
  );
}

// ── Cart item row ─────────────────────────────────────────────────────────────
function CartRow({ item, dispatch }) {
  const { count, checked, product: raw } = item;
  const product = normaliseProduct(raw);
  const price   = getPrice(product);
  const imgSrc  = getImgSrc(product);

  return (
    <div className="flex items-center gap-4 bg-white border border-[#E8E8E8]
                    rounded-[5px] p-4 hover:shadow-sm transition-shadow">
      {/* Checkbox */}
      <Checkbox
        checked={!!checked}
        onChange={() => dispatch(toggleChecked(product.id))}
      />

      {/* Product image */}
      <img
        src={imgSrc}
        alt={product.name}
        className="w-[80px] h-[80px] object-cover rounded flex-shrink-0"
        onError={e => { e.target.src = 'https://placehold.co/80x80/f3f3f3/bdbdbd?text=?'; }}
      />

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[14px] text-[#252B42] m-0 leading-[20px] line-clamp-2">
          {product.name}
        </p>
        {product.department && (
          <p className="font-normal text-[12px] text-[#737373] m-0 mt-[2px]">
            {product.department}
          </p>
        )}
      </div>

      {/* Stepper */}
      <div className="flex-shrink-0">
        <Stepper
          count={count}
          onDec={() => count > 1
            ? dispatch(updateCartItemCount(product.id, count - 1))
            : dispatch(removeFromCart(product.id))
          }
          onInc={() => dispatch(updateCartItemCount(product.id, count + 1))}
        />
      </div>

      {/* Line total */}
      <span className="font-bold text-[16px] text-[#23856D] flex-shrink-0 w-[90px] text-right">
        ${(price * count).toFixed(2)}
      </span>

      {/* Delete */}
      <button
        onClick={() => {
          dispatch(removeFromCart(product.id));
          toast.info(`${product.name} removed from cart`, { autoClose: 2000 });
        }}
        className="flex-shrink-0 w-[32px] h-[32px] flex items-center justify-center
                   bg-transparent border-none cursor-pointer rounded
                   hover:bg-[#fff0f0] transition-colors"
        title="Remove"
      >
        <Trash2 size={16} color="#BDBDBD" className="hover:text-[#E74040]" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CartPage
// ─────────────────────────────────────────────────────────────────────────────
export default function CartPage() {
  const dispatch = useDispatch();
  const history  = useHistory();
  const cart     = useSelector(s => s.shoppingCart.cart);

  // Only checked items count toward the total
  const checkedItems  = cart.filter(item => item.checked);
  const allChecked    = cart.length > 0 && checkedItems.length === cart.length;
  const someChecked   = checkedItems.length > 0 && !allChecked;

  const total = checkedItems.reduce((sum, { count, product: raw }) => {
    const product = normaliseProduct(raw);
    return sum + getPrice(product) * count;
  }, 0);

  const totalCount = cart.reduce((sum, item) => sum + item.count, 0);

  // Pricing breakdown (matching the screenshot layout)
  const productTotal    = total;
  const SHIPPING_RATE   = 29.99;
  const FREE_SHIPPING_THRESHOLD = 150;
  // Free shipping applies when productTotal >= threshold
  const shippingFee     = checkedItems.length > 0 ? SHIPPING_RATE : 0;
  const shippingDiscount = productTotal >= FREE_SHIPPING_THRESHOLD ? SHIPPING_RATE : 0;
  const grandTotal      = productTotal + shippingFee - shippingDiscount;

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] font-['Montserrat']">
        {/* Breadcrumb */}
        <div className="w-full bg-[#FAFAFA] border-b border-[#E8E8E8]">
          <div className="max-w-[1050px] mx-auto px-6 py-[24px] flex items-center gap-[15px]">
            <Link to="/" className="font-bold text-[14px] text-[#252B42] no-underline">Home</Link>
            <Chevron />
            <span className="font-bold text-[14px] text-[#BDBDBD]">Cart</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-[100px] gap-5">
          <ShoppingBag size={72} color="#E8E8E8" />
          <h2 className="font-bold text-[22px] text-[#252B42] m-0">Your cart is empty</h2>
          <p className="text-[14px] text-[#737373] m-0">
            Looks like you haven't added anything yet.
          </p>
          <Link to="/shop"
            className="bg-[#23A6F0] text-white no-underline py-[14px] px-[40px]
                       rounded-[5px] font-bold text-[14px] mt-2 hover:bg-[#1a8fd1] transition-colors">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-['Montserrat']">

      {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
      <div className="w-full bg-[#FAFAFA] border-b border-[#E8E8E8]">
        <div className="max-w-[1050px] mx-auto px-6 py-[24px] flex items-center gap-[15px]">
          <Link to="/" className="font-bold text-[14px] text-[#252B42] no-underline hover:text-[#23A6F0]">
            Home
          </Link>
          <Chevron />
          <span className="font-bold text-[14px] text-[#BDBDBD]">Cart</span>
        </div>
      </div>

      <div className="max-w-[1050px] mx-auto px-4 md:px-6 py-8">

        {/* ── Page title ────────────────────────────────────────────────── */}
        <h1 className="font-bold text-[24px] text-[#252B42] m-0 mb-6">
          Sepetim ({totalCount} Ürün)
        </h1>

        {/* ── Info banner ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 bg-[#EEF9EE] border border-[#C3E6C3]
                        rounded-[5px] px-4 py-3 mb-6">
          <CheckCircle2 size={20} color="#2ECC71" className="flex-shrink-0" />
          <p className="font-normal text-[13px] text-[#252B42] m-0">
            Sepetindeki Ürünleri Bireysel Veya Kurumsal Fatura Seçerek Alabilirsin.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── Left: item list ─────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Select-all row */}
            <div className="flex items-center gap-3 bg-white border border-[#E8E8E8]
                            rounded-[5px] px-4 py-3 mb-3">
              <Checkbox
                checked={allChecked}
                onChange={() => dispatch(toggleAllChecked(!allChecked))}
              />
              <span className="font-bold text-[14px] text-[#252B42]">
                {allChecked
                  ? 'Tümünü Kaldır'
                  : someChecked
                    ? `${checkedItems.length} ürün seçili`
                    : 'Tümünü Seç'}
              </span>
            </div>

            {/* Cart rows */}
            <div className="flex flex-col gap-3">
              {cart.map(item => (
                <CartRow key={item.product.id} item={item} dispatch={dispatch} />
              ))}
            </div>

            {/* Continue shopping */}
            <div className="mt-4">
              <Link to="/shop"
                className="font-bold text-[14px] text-[#23A6F0] no-underline hover:underline">
                ← Alışverişe Devam Et
              </Link>
            </div>
          </div>

          {/* ── Right: Order Summary ─────────────────────────────────────── */}
          <div className="w-full lg:w-[296px] shrink-0 flex flex-col gap-3">

            {/* Summary card */}
            <div className="bg-white border border-[#E8E8E8] rounded-[5px] overflow-hidden">
              <div className="px-5 pt-5 pb-4">
                <h2 className="font-bold text-[20px] text-[#252B42] m-0 mb-4">
                  Sipariş Özeti
                </h2>

                {/* Ürünün Toplamı */}
                <div className="flex justify-between items-center mb-3">
                  <span className="font-normal text-[14px] text-[#252B42]">
                    Ürünün Toplamı
                  </span>
                  <span className="font-bold text-[14px] text-[#252B42]">
                    {productTotal.toFixed(2)} TL
                  </span>
                </div>

                {/* Kargo Toplam */}
                <div className="flex justify-between items-center mb-3">
                  <span className="font-normal text-[14px] text-[#252B42]">
                    Kargo Toplam
                  </span>
                  <span className="font-bold text-[14px] text-[#252B42]">
                    {shippingFee.toFixed(2)} TL
                  </span>
                </div>

                {/* Free shipping discount line */}
                {shippingDiscount > 0 && (
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-normal text-[13px] text-[#252B42] max-w-[160px] leading-[18px]">
                      150 TL ve Üzeri Kargo Bedava (Satıcı Karşılar)
                    </span>
                    <span className="font-bold text-[14px] text-[#FF6000]">
                      -{shippingDiscount.toFixed(2)} TL
                    </span>
                  </div>
                )}

                {/* Divider */}
                <div className="h-px bg-[#E8E8E8] my-4" />

                {/* Toplam */}
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[16px] text-[#252B42]">
                    Toplam
                  </span>
                  <span className="font-bold text-[18px] text-[#FF6000]">
                    {grandTotal.toFixed(2)} TL
                  </span>
                </div>
              </div>

              {/* Discount code row */}
              <div className="border-t border-[#E8E8E8] px-5 py-4">
                <button className="flex items-center gap-2 font-bold text-[13px]
                                   text-[#252B42] bg-transparent border-none cursor-pointer
                                   hover:text-[#FF6000] transition-colors w-full">
                  <span className="text-[16px] font-normal">+</span>
                  İNDİRİM KODU GİR
                </button>
              </div>
            </div>

            {/* Bottom "Sepeti Onayla" button */}
            <button
              disabled={checkedItems.length === 0}
              onClick={() => checkedItems.length > 0 && history.push('/order')}
              className={`w-full py-[16px] rounded-[5px] font-bold text-[16px]
                border-none flex items-center justify-center gap-2 transition-colors
                ${checkedItems.length > 0
                  ? 'bg-[#FF6000] text-white cursor-pointer hover:bg-[#e05500]'
                  : 'bg-[#BDBDBD] text-white cursor-not-allowed'}`}
            >
              Sepeti Onayla ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chevron() {
  return (
    <svg width="9" height="16" viewBox="0 0 9 16" fill="none" className="flex-shrink-0">
      <path d="M1 1L8 8L1 15" stroke="#BDBDBD" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
