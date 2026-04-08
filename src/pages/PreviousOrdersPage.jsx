import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Package, ChevronDown, ChevronUp, ShoppingBag,
  Calendar, CreditCard, MapPin, Loader2, AlertCircle,
  ArrowLeft, Tag, Hash,
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatPrice(val) {
  if (val == null) return '—';
  return Number(val).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺';
}

function statusBadge(status) {
  const map = {
    pending:    { label: 'Beklemede',  bg: '#FFF3E0', color: '#E65100' },
    processing: { label: 'İşleniyor', bg: '#E3F2FD', color: '#1565C0' },
    shipped:    { label: 'Kargoda',   bg: '#EDE7F6', color: '#4527A0' },
    delivered:  { label: 'Teslim Edildi', bg: '#E8F5E9', color: '#2E7D32' },
    cancelled:  { label: 'İptal',     bg: '#FFEBEE', color: '#C62828' },
  };
  const s = map[(status ?? '').toLowerCase()] ?? { label: status ?? 'Belirsiz', bg: '#F5F5F5', color: '#616161' };
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

// ── OrderRow ───────────────────────────────────────────────────────────────────
// One row of the order table; expanded panel shows ordered products.
function OrderRow({ order, isOpen, onToggle }) {
  const products = order.products ?? order.orderProducts ?? order.items ?? [];

  return (
    <>
      {/* ── Main row ─────────────────────────────────────────────────────── */}
      <tr
        className="border-b border-[#F0F0F0] hover:bg-[#FAFAFA] transition-colors cursor-pointer"
        onClick={onToggle}
      >
        {/* Order ID */}
        <td className="px-4 py-4 whitespace-nowrap">
          <span className="flex items-center gap-1.5 font-bold text-sm text-[#252B42]">
            <Hash size={13} className="text-[#23A6F0] shrink-0" />
            {order.id}
          </span>
        </td>

        {/* Date */}
        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#737373]">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} className="text-[#737373] shrink-0" />
            {formatDate(order.order_date ?? order.orderDate ?? order.created_at)}
          </span>
        </td>

        {/* Total */}
        <td className="px-4 py-4 whitespace-nowrap">
          <span className="font-bold text-sm text-[#FF6000]">
            {formatPrice(order.price ?? order.total ?? order.totalPrice)}
          </span>
        </td>

        {/* Product count */}
        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#737373]">
          {products.length} ürün
        </td>

        {/* Status */}
        <td className="px-4 py-4 whitespace-nowrap">
          {statusBadge(order.status)}
        </td>

        {/* Expand toggle */}
        <td className="px-4 py-4 text-right">
          <button
            className="inline-flex items-center gap-1 text-xs font-bold text-[#23A6F0] bg-transparent border-none cursor-pointer"
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
          >
            {isOpen ? (
              <><ChevronUp size={15} /> Gizle</>
            ) : (
              <><ChevronDown size={15} /> Detaylar</>
            )}
          </button>
        </td>
      </tr>

      {/* ── Collapsible detail panel ──────────────────────────────────────── */}
      {isOpen && (
        <tr>
          <td colSpan={6} className="px-0 py-0">
            <div className="bg-[#F8F9FF] border-b border-[#E8E8E8] px-6 py-5 animate-fade-in">

              {/* Address strip */}
              {(order.address ?? order.shippingAddress) && (
                <div className="flex items-start gap-2 mb-4 text-sm text-[#555]">
                  <MapPin size={14} className="text-[#23A6F0] mt-0.5 shrink-0" />
                  <span>
                    {[
                      order.address?.title ?? order.shippingAddress?.title,
                      order.address?.neighborhood ?? order.shippingAddress?.neighborhood,
                      order.address?.district ?? order.shippingAddress?.district,
                      order.address?.city ?? order.shippingAddress?.city,
                    ].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}

              {/* Products grid */}
              {products.length === 0 ? (
                <p className="text-sm text-[#737373] italic">Ürün bilgisi bulunamadı.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-[#E8EAF0]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#EEF0F8] border-b border-[#DDE0EE]">
                        <th className="px-4 py-2.5 text-left font-bold text-[#252B42] text-xs uppercase tracking-wide">Ürün</th>
                        <th className="px-4 py-2.5 text-left font-bold text-[#252B42] text-xs uppercase tracking-wide">Adet</th>
                        <th className="px-4 py-2.5 text-left font-bold text-[#252B42] text-xs uppercase tracking-wide">Birim Fiyat</th>
                        <th className="px-4 py-2.5 text-left font-bold text-[#252B42] text-xs uppercase tracking-wide">Toplam</th>
                        <th className="px-4 py-2.5 text-left font-bold text-[#252B42] text-xs uppercase tracking-wide">Detay</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8EAF0] bg-white">
                      {products.map((item, idx) => {
                        const prod    = item.product ?? item;
                        const count   = item.count ?? item.quantity ?? 1;
                        const unitPrice = prod._price ?? prod.discount_price ?? prod.price ?? item.price ?? 0;
                        const img     = prod._image ?? prod.images?.[0]?.url ?? prod.image ?? null;
                        const imgSrc  = img
                          ? (img.startsWith('http') ? img : `/${img}`)
                          : 'https://placehold.co/48x48/eef0f8/9fa3c2?text=?';

                        return (
                          <tr key={idx} className="hover:bg-[#F8F9FF] transition-colors">
                            {/* Product */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={imgSrc}
                                  alt={prod.name}
                                  className="w-11 h-11 rounded-md object-cover border border-[#E8EAF0] shrink-0"
                                  onError={e => { e.target.src = 'https://placehold.co/44x44/eef0f8/9fa3c2?text=?' }}
                                />
                                <span className="font-semibold text-[#252B42] leading-tight line-clamp-2 max-w-[200px]">
                                  {prod.name ?? '—'}
                                </span>
                              </div>
                            </td>
                            {/* Count */}
                            <td className="px-4 py-3 text-[#555] font-medium">{count}</td>
                            {/* Unit price */}
                            <td className="px-4 py-3 text-[#555]">{formatPrice(unitPrice)}</td>
                            {/* Line total */}
                            <td className="px-4 py-3 font-bold text-[#FF6000]">
                              {formatPrice(unitPrice * count)}
                            </td>
                            {/* Detail text */}
                            <td className="px-4 py-3 text-[#737373] text-xs max-w-[160px] truncate">
                              {item.detail ?? '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Order total footer */}
              <div className="flex justify-end mt-4">
                <div className="flex items-center gap-2 bg-white border border-[#E8EAF0] rounded-lg px-5 py-3 shadow-sm">
                  <CreditCard size={15} className="text-[#23A6F0]" />
                  <span className="text-sm font-bold text-[#252B42]">Sipariş Toplamı:</span>
                  <span className="text-sm font-bold text-[#FF6000]">
                    {formatPrice(order.price ?? order.total ?? order.totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── PreviousOrdersPage ─────────────────────────────────────────────────────────
export default function PreviousOrdersPage() {
  const user = useSelector(s => s.client.user);

  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [openIds, setOpenIds] = useState(new Set());

  // ── Fetch orders ───────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setError(null);

    axiosInstance.get('/order')
      .then(({ data }) => {
        // API may return the array directly or wrapped in a key
        const list = Array.isArray(data)
          ? data
          : (data.orders ?? data.data ?? data.results ?? []);
        setOrders(list);
      })
      .catch(err => {
        const msg = err.response?.data?.message ?? err.message ?? 'Siparişler yüklenirken bir hata oluştu.';
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleRow = (id) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* ── Page header ────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#E8E8E8] px-4 md:px-10 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-[#737373] mb-3">
            <Link to="/" className="hover:text-[#23A6F0] no-underline transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-[#252B42] font-semibold">Siparişlerim</span>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EEF0F8] flex items-center justify-center">
                <Package size={20} color="#23A6F0" />
              </div>
              <div>
                <h1 className="font-extrabold text-2xl text-[#252B42] m-0 leading-none">
                  Siparişlerim
                </h1>
                {!loading && !error && (
                  <p className="text-xs text-[#737373] mt-1 m-0">
                    Toplam {orders.length} sipariş
                  </p>
                )}
              </div>
            </div>
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm font-bold text-[#737373] no-underline hover:text-[#252B42] transition-colors"
            >
              <ArrowLeft size={15} /> Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 md:px-10 py-8">

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={36} className="text-[#23A6F0] animate-spin" />
            <p className="text-sm text-[#737373] font-medium">Siparişler yükleniyor…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-[#FFEBEE] flex items-center justify-center">
              <AlertCircle size={28} color="#C62828" />
            </div>
            <p className="font-bold text-[#252B42] text-base">Bir hata oluştu</p>
            <p className="text-sm text-[#737373] max-w-xs">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-5 py-2.5 bg-[#23A6F0] text-white font-bold text-sm rounded-md border-none cursor-pointer hover:bg-[#1a8fd1] transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
            <div className="w-20 h-20 rounded-full bg-[#EEF0F8] flex items-center justify-center">
              <ShoppingBag size={36} color="#9FA3C2" />
            </div>
            <div>
              <p className="font-bold text-[#252B42] text-lg mb-1">Henüz siparişiniz yok</p>
              <p className="text-sm text-[#737373]">İlk siparişinizi vermek için alışverişe başlayın.</p>
            </div>
            <Link
              to="/shop"
              className="mt-2 px-6 py-3 bg-[#252B42] text-white font-bold text-sm rounded-md no-underline hover:bg-[#1a1f2e] transition-colors"
            >
              Alışverişe Başla
            </Link>
          </div>
        )}

        {/* Orders table */}
        {!loading && !error && orders.length > 0 && (
          <div className="bg-white rounded-xl border border-[#E8E8E8] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#252B42]">
                    {[
                      { label: 'Sipariş No',   icon: <Hash size={12} /> },
                      { label: 'Tarih',         icon: <Calendar size={12} /> },
                      { label: 'Toplam Tutar',  icon: <Tag size={12} /> },
                      { label: 'Ürünler',       icon: <Package size={12} /> },
                      { label: 'Durum',         icon: null },
                      { label: '',              icon: null },
                    ].map(({ label, icon }, i) => (
                      <th
                        key={i}
                        className="px-4 py-4 text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap"
                      >
                        <span className="flex items-center gap-1.5">
                          {icon}
                          {label}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <OrderRow
                      key={order.id}
                      order={order}
                      isOpen={openIds.has(order.id)}
                      onToggle={() => toggleRow(order.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table footer summary */}
            <div className="border-t border-[#E8E8E8] px-6 py-4 bg-[#FAFAFA] flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs text-[#737373]">
                {orders.length} sipariş listeleniyor
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#737373]">
                <Tag size={12} className="text-[#FF6000]" />
                Toplam harcama:{' '}
                <span className="font-bold text-[#FF6000]">
                  {formatPrice(
                    orders.reduce((sum, o) => sum + Number(o.price ?? o.total ?? o.totalPrice ?? 0), 0)
                  )}
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
