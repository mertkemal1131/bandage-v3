import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Plus, Edit2, Trash2, MapPin, Loader2,
  ChevronRight, CreditCard, Lock, CheckCircle,
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { setAddressList } from '../store/clientReducer';
import { setPayment, clearCart } from '../store/shoppingCartReducer';
import { normaliseProduct } from '../components/ProductCard';

// ── Turkish cities ─────────────────────────────────────────────────────────────
const CITIES = [
  'Adana','Adıyaman','Afyonkarahisar','Ağrı','Amasya','Ankara','Antalya','Artvin',
  'Aydın','Balıkesir','Bilecik','Bingöl','Bitlis','Bolu','Burdur','Bursa','Çanakkale',
  'Çankırı','Çorum','Denizli','Diyarbakır','Edirne','Elazığ','Erzincan','Erzurum',
  'Eskişehir','Gaziantep','Giresun','Gümüşhane','Hakkari','Hatay','Isparta','Mersin',
  'İstanbul','İzmir','Kars','Kastamonu','Kayseri','Kırklareli','Kırşehir','Kocaeli',
  'Konya','Kütahya','Malatya','Manisa','Kahramanmaraş','Mardin','Muğla','Muş',
  'Nevşehir','Niğde','Ordu','Rize','Sakarya','Samsun','Siirt','Sinop','Sivas',
  'Tekirdağ','Tokat','Trabzon','Tunceli','Şanlıurfa','Uşak','Van','Yozgat',
  'Zonguldak','Aksaray','Bayburt','Karaman','Kırıkkale','Batman','Şırnak','Bartın',
  'Ardahan','Iğdır','Yalova','Karabük','Kilis','Osmaniye','Düzce',
];

const MONTHS = ['01','02','03','04','05','06','07','08','09','10','11','12'];
const YEARS  = Array.from({ length: 12 }, (_, i) => String(new Date().getFullYear() + i));

// ── Empty forms ────────────────────────────────────────────────────────────────
const EMPTY_ADDR = {
  title:'', name:'', surname:'', phone:'',
  city:'', district:'', neighborhood:'', address:'',
};
const EMPTY_CARD = {
  cardNumber:'', cardName:'', expMonth:'', expYear:'', cvv:'', saveCard: false,
};

// ── Price helpers ──────────────────────────────────────────────────────────────
function getPrice(p) { return p._price ?? p.discount_price ?? p.price ?? 0; }

// ── Shared: Step Indicator ─────────────────────────────────────────────────────
function StepBar({ step }) {
  const steps = [
    { n: 1, label: 'Adres Bilgileri' },
    { n: 2, label: 'Ödeme Seçenekleri' },
  ];
  return (
    <div className="flex items-center gap-4 mb-6">
      {steps.map((s, idx) => (
        <div key={s.n} className="flex items-center gap-2 flex-1">
          <div className={`w-[28px] h-[28px] rounded-full font-bold text-[13px]
            flex items-center justify-center flex-shrink-0 transition-colors
            ${step >= s.n ? 'bg-[#FF6000] text-white' : 'bg-[#E8E8E8] text-[#737373]'}`}>
            {step > s.n ? <CheckCircle size={16} /> : s.n}
          </div>
          <span className={`font-bold text-[14px] transition-colors
            ${step >= s.n ? 'text-[#FF6000]' : 'text-[#737373]'}`}>
            {s.label}
          </span>
          {idx < steps.length - 1 && (
            <div className={`flex-1 h-px mx-2 transition-colors
              ${step > s.n ? 'bg-[#FF6000]' : 'bg-[#E8E8E8]'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Shared: Order Summary Sidebar ──────────────────────────────────────────────
function OrderSummary({ checkedItems, canConfirm, onConfirm, btnLabel = 'Kaydet ve Devam Et' }) {
  const [termsAccepted, setTermsAccepted] = useState(false);

  const productTotal   = checkedItems.reduce((s, { count, product: raw }) => {
    const p = normaliseProduct(raw);
    return s + getPrice(p) * count;
  }, 0);
  const shippingFee      = checkedItems.length > 0 ? 29.99 : 0;
  const shippingDiscount = productTotal >= 150 ? shippingFee : 0;
  const grandTotal       = productTotal + shippingFee - shippingDiscount;

  const isActive = canConfirm && termsAccepted;

  return (
    <div className="w-full lg:w-[296px] shrink-0 flex flex-col gap-3">
      {/* Terms */}
      <div className="bg-white border border-[#E8E8E8] rounded-[5px] p-4 flex items-start gap-3">
        <input type="checkbox" id="terms" checked={termsAccepted}
          onChange={e => setTermsAccepted(e.target.checked)}
          className="mt-[3px] accent-[#FF6000] flex-shrink-0 cursor-pointer" />
        <label htmlFor="terms" className="font-normal text-[12px] text-[#737373] cursor-pointer leading-[18px]">
          <span className="text-[#23A6F0] underline">Ön Bilgilendirme Koşulları</span>&#39;nı ve{' '}
          <span className="text-[#23A6F0] underline">Mesafeli Satış Sözleşmesi</span>&#39;ni okudum, onaylıyorum.
        </label>
      </div>

      {/* Summary card */}
      <div className="bg-white border border-[#E8E8E8] rounded-[5px] overflow-hidden">
        <div className="px-5 pt-5 pb-4">
          <h2 className="font-bold text-[20px] text-[#252B42] m-0 mb-4">Sipariş Özeti</h2>

          <Row label="Ürünün Toplamı" value={`${productTotal.toFixed(2)} TL`} />
          <Row label="Kargo Toplam"   value={`${shippingFee.toFixed(2)} TL`} />
          {shippingDiscount > 0 && (
            <Row
              label="150 TL ve Üzeri Kargo Bedava (Satıcı Karşılar)"
              value={`-${shippingDiscount.toFixed(2)} TL`}
              valueColor="text-[#FF6000]"
              small
            />
          )}
          <div className="h-px bg-[#E8E8E8] my-4" />
          <div className="flex justify-between items-center">
            <span className="font-bold text-[16px] text-[#252B42]">Toplam</span>
            <span className="font-bold text-[18px] text-[#FF6000]">{grandTotal.toFixed(2)} TL</span>
          </div>
        </div>
      </div>

      <button onClick={onConfirm} disabled={!isActive}
        className={`w-full py-[16px] rounded-[5px] font-bold text-[16px] border-none
          flex items-center justify-center gap-2 transition-colors
          ${isActive
            ? 'bg-[#FF6000] text-white cursor-pointer hover:bg-[#e05500]'
            : 'bg-[#BDBDBD] text-white cursor-not-allowed'}`}>
        {btnLabel} <ChevronRight size={18} />
      </button>
    </div>
  );
}

function Row({ label, value, valueColor = 'text-[#252B42]', small = false }) {
  return (
    <div className={`flex justify-between items-start mb-3 gap-2 ${small ? 'text-[12px]' : 'text-[14px]'}`}>
      <span className={`font-normal text-[#252B42] leading-[18px] ${small ? 'max-w-[160px]' : ''}`}>{label}</span>
      <span className={`font-bold flex-shrink-0 ${valueColor}`}>{value}</span>
    </div>
  );
}

// ── Address Card ───────────────────────────────────────────────────────────────
function AddressCard({ addr, selected, onSelect, onEdit, onDelete }) {
  return (
    <div onClick={onSelect}
      className={`relative rounded-[5px] border-2 p-4 cursor-pointer transition-all
        ${selected ? 'border-[#FF6000] bg-[#FFF8F3]' : 'border-[#E8E8E8] bg-white hover:border-[#BDBDBD]'}`}>
      <div className="flex items-start gap-3">
        <div className={`w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 mt-[2px]
          flex items-center justify-center transition-colors
          ${selected ? 'border-[#FF6000]' : 'border-[#BDBDBD]'}`}>
          {selected && <div className="w-[8px] h-[8px] rounded-full bg-[#FF6000]" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-bold text-[14px] text-[#252B42]">{addr.title}</span>
            <div className="flex items-center gap-1">
              <button onClick={e => { e.stopPropagation(); onEdit(); }}
                className="p-1 bg-transparent border-none cursor-pointer text-[#737373] hover:text-[#23A6F0]">
                <Edit2 size={13} />
              </button>
              <button onClick={e => { e.stopPropagation(); onDelete(); }}
                className="p-1 bg-transparent border-none cursor-pointer text-[#737373] hover:text-[#E74040]">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
          <p className="font-normal text-[13px] text-[#252B42] m-0">{addr.name} {addr.surname}</p>
          <p className="font-normal text-[12px] text-[#737373] m-0 mt-[2px]">{addr.phone}</p>
          <p className="font-normal text-[12px] text-[#737373] m-0 mt-[2px]">
            {addr.neighborhood}, {addr.district}, {addr.city}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Address Form ───────────────────────────────────────────────────────────────
function AddressForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState(initial
    ? { ...EMPTY_ADDR, ...initial }
    : EMPTY_ADDR
  );
  const [errors, setErrors] = useState({});
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const validate = () => {
    const e = {};
    if (!form.title.trim())        e.title        = 'Gerekli';
    if (!form.name.trim())         e.name         = 'Gerekli';
    if (!form.surname.trim())      e.surname      = 'Gerekli';
    if (!/^[0-9]{10,11}$/.test(form.phone.replace(/\s/g,'')))
                                   e.phone        = 'Geçersiz telefon';
    if (!form.city)                e.city         = 'Şehir seçin';
    if (!form.district.trim())     e.district     = 'Gerekli';
    if (!form.neighborhood.trim()) e.neighborhood = 'Gerekli';
    if (!form.address.trim())      e.address      = 'Gerekli';
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  const inp = (label, field, opts = {}) => (
    <div className="flex flex-col gap-1">
      <label className="font-bold text-[12px] text-[#252B42]">{label}</label>
      {opts.as === 'textarea' ? (
        <textarea rows={3} value={form[field]}
          onChange={e => set(field, e.target.value)}
          placeholder={opts.placeholder}
          className={`border rounded-[5px] px-3 py-2 text-[13px] font-['Montserrat']
            outline-none resize-none transition-colors
            ${errors[field] ? 'border-[#E74040]' : 'border-[#E8E8E8] focus:border-[#FF6000]'}`} />
      ) : opts.as === 'select' ? (
        <select value={form[field]} onChange={e => set(field, e.target.value)}
          className={`border rounded-[5px] px-3 py-2 text-[13px] font-['Montserrat']
            outline-none bg-white appearance-none transition-colors
            ${errors[field] ? 'border-[#E74040]' : 'border-[#E8E8E8] focus:border-[#FF6000]'}`}>
          <option value="">Şehir seçin…</option>
          {CITIES.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
        </select>
      ) : (
        <input type={opts.type || 'text'} value={form[field]}
          onChange={e => set(field, e.target.value)}
          placeholder={opts.placeholder}
          className={`border rounded-[5px] px-3 py-2 text-[13px] font-['Montserrat']
            outline-none transition-colors
            ${errors[field] ? 'border-[#E74040]' : 'border-[#E8E8E8] focus:border-[#FF6000]'}`} />
      )}
      {errors[field] && <span className="text-[11px] text-[#E74040]">{errors[field]}</span>}
    </div>
  );

  return (
    <div className="bg-[#FFF8F3] border-2 border-[#FF6000] rounded-[5px] p-5 mt-4">
      <h3 className="font-bold text-[15px] text-[#252B42] m-0 mb-4">
        {initial?.id ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {inp('Adres Başlığı *', 'title', { placeholder: 'Ev, İş…' })}
        <div />
        {inp('Ad *',    'name',    { placeholder: 'Alişan' })}
        {inp('Soyad *', 'surname', { placeholder: 'Karababa' })}
        {inp('Telefon *', 'phone', { placeholder: '05376845834', type: 'tel' })}
        {inp('Şehir (İl) *', 'city', { as: 'select' })}
        {inp('İlçe *',    'district',    { placeholder: 'Esenler' })}
        {inp('Mahalle *', 'neighborhood', { placeholder: 'Adres detayları' })}
        <div className="md:col-span-2">
          {inp('Adres *', 'address', { as: 'textarea', placeholder: 'Sokak, bina no, daire no…' })}
        </div>
      </div>
      <div className="flex gap-3 mt-4 justify-end">
        <button onClick={onCancel}
          className="px-5 py-2 border border-[#BDBDBD] rounded-[5px] font-bold text-[13px]
                     text-[#737373] bg-white cursor-pointer hover:border-[#252B42]">
          İptal
        </button>
        <button onClick={submit} disabled={loading}
          className="px-5 py-2 bg-[#FF6000] text-white rounded-[5px] font-bold text-[13px]
                     border-none cursor-pointer hover:bg-[#e05500] flex items-center gap-2
                     disabled:opacity-60 disabled:cursor-not-allowed">
          {loading && <Loader2 size={13} className="animate-spin" />}
          Kaydet
        </button>
      </div>
    </div>
  );
}

// ── Step 1: Address ────────────────────────────────────────────────────────────
function AddressStep({ onNext, onReadyChange, registerNext }) {
  const dispatch    = useDispatch();
  const user        = useSelector(s => s.client.user);
  const addressList = useSelector(s => s.client.addressList);

  const [loading,       setLoading]       = useState(false);
  const [formLoading,   setFormLoading]   = useState(false);
  const [showForm,      setShowForm]      = useState(false);
  const [editAddr,      setEditAddr]      = useState(null);
  const [shippingId,    setShippingId]    = useState(null);
  const [billingSameAs, setBillingSameAs] = useState(true);
  const [billingId,     setBillingId]     = useState(null);

  // ── Shared: fetch fresh list from API and sync state ──────────────────────
  const refreshAddresses = async (currentShippingId = shippingId, currentBillingId = billingId) => {
    const { data: fresh } = await axiosInstance.get('/user/address');
    dispatch(setAddressList(fresh));

    // Keep selected ids valid; if the previously selected one still exists keep it,
    // otherwise fall back to the first item (or null).
    const ids = fresh.map(a => a.id);
    const newShipping = ids.includes(currentShippingId)
      ? currentShippingId
      : (fresh[0]?.id ?? null);
    const newBilling  = ids.includes(currentBillingId)
      ? currentBillingId
      : (fresh[0]?.id ?? null);
    setShippingId(newShipping);
    setBillingId(newBilling);
    return fresh;
  };

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    axiosInstance.get('/user/address')
      .then(({ data }) => {
        dispatch(setAddressList(data));
        if (data.length > 0) setShippingId(data[0].id);
      })
      .catch(() => toast.error('Adresler yüklenemedi'))
      .finally(() => setLoading(false));
  }, [dispatch, user]);

  const handleSave = async (formData) => {
    setFormLoading(true);
    try {
      if (editAddr?.id) {
        await axiosInstance.put('/user/address', { ...formData, id: editAddr.id });
        toast.success('Adres güncellendi');
      } else {
        await axiosInstance.post('/user/address', formData);
        toast.success('Adres eklendi');
      }
      // Re-fetch so we get the real objects with correct ids and fields
      const fresh = await refreshAddresses();
      // If this was a new address, select the last one (most recently added)
      if (!editAddr?.id && fresh.length > 0) {
        setShippingId(fresh[fresh.length - 1].id);
      }
      setShowForm(false); setEditAddr(null);
    } catch { toast.error('Adres kaydedilemedi'); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu adresi silmek istiyor musunuz?')) return;
    try {
      await axiosInstance.delete(`/user/address/${id}`);
      // Re-fetch to get authoritative list; pass null for the deleted id
      await refreshAddresses(
        shippingId === id ? null : shippingId,
        billingId  === id ? null : billingId,
      );
      toast.success('Adres silindi');
    } catch { toast.error('Adres silinemedi'); }
  };

  const canProceed = !!shippingId && (billingSameAs || !!billingId);

  const handleNext = () => {
    if (!canProceed) { toast.warning('Lütfen bir teslimat adresi seçin'); return; }
    const shippingAddr = addressList.find(a => a.id === shippingId);
    const billingAddr  = billingSameAs ? shippingAddr : addressList.find(a => a.id === billingId);
    onNext({ shippingAddr, billingAddr });
  };

  // Notify parent whenever ready-state changes, and keep its next-fn ref current
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { onReadyChange?.(canProceed); }, [canProceed]);
  useEffect(() => { registerNext?.(handleNext); });

  return (
    <div className="flex flex-col gap-4">
      {/* Info banner */}
      <div className="flex items-start gap-3 bg-[#FFF8E7] border border-[#FFD580]
                      rounded-[5px] px-4 py-3 text-[13px] text-[#252B42]">
        <span className="text-[#FF6000] font-bold flex-shrink-0">ⓘ</span>
        Kurumsal faturalı alışveriş yapmak için "Faturamı Aynı Adrese Gönder" tikini kaldırın
        ve Fatura adresi olarak kayıtlı Kurumsal Fatura adresinizi seçin.
      </div>

      {/* Teslimat Adresi */}
      <div className="bg-white border border-[#E8E8E8] rounded-[5px] p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="font-bold text-[18px] text-[#252B42] m-0 flex items-center gap-2">
            <MapPin size={18} color="#FF6000" /> Teslimat Adresi
          </h2>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={billingSameAs}
              onChange={e => setBillingSameAs(e.target.checked)}
              className="accent-[#FF6000] w-[16px] h-[16px]" />
            <span className="font-normal text-[13px] text-[#252B42]">Faturamı Aynı Adrese Gönder</span>
          </label>
        </div>

        {loading
          ? <div className="flex justify-center py-8"><Loader2 size={32} className="animate-spin text-[#FF6000]" /></div>
          : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Add new */}
              <button onClick={() => { setEditAddr(null); setShowForm(s => !s); }}
                className="h-[110px] flex flex-col items-center justify-center gap-2
                           border-2 border-dashed border-[#BDBDBD] rounded-[5px]
                           bg-white cursor-pointer hover:border-[#FF6000] group transition-colors text-[#737373]">
                <Plus size={26} className="group-hover:text-[#FF6000] transition-colors" />
                <span className="font-bold text-[13px] group-hover:text-[#FF6000] transition-colors">Yeni Adres Ekle</span>
              </button>
              {addressList.map(a => (
                <AddressCard key={a.id} addr={a}
                  selected={shippingId === a.id}
                  onSelect={() => setShippingId(a.id)}
                  onEdit={() => { setEditAddr(a); setShowForm(true); }}
                  onDelete={() => handleDelete(a.id)} />
              ))}
            </div>
            {showForm && (
              <AddressForm initial={editAddr} loading={formLoading}
                onSave={handleSave}
                onCancel={() => { setShowForm(false); setEditAddr(null); }} />
            )}
          </>
        )}
      </div>

      {/* Fatura Adresi — only when different */}
      {!billingSameAs && (
        <div className="bg-white border border-[#E8E8E8] rounded-[5px] p-5">
          <h2 className="font-bold text-[18px] text-[#252B42] m-0 mb-4 flex items-center gap-2">
            <MapPin size={18} color="#23A6F0" /> Fatura Adresi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {addressList.map(a => (
              <AddressCard key={a.id} addr={a}
                selected={billingId === a.id}
                onSelect={() => setBillingId(a.id)}
                onEdit={() => { setEditAddr(a); setShowForm(true); }}
                onDelete={() => handleDelete(a.id)} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────
// Mask card number: "5421 19** **** 5420"
function maskCard(no) {
  const d = String(no).replace(/\s/g, '');
  if (d.length < 8) return d;
  return `${d.slice(0,4)} ${d.slice(4,6)}** **** ${d.slice(-4)}`;
}

// Format card number input with spaces every 4 digits
function formatCardNum(val) {
  return val.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
}

// ── SavedCardTile ──────────────────────────────────────────────────────────────
function SavedCardTile({ card, selected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`relative rounded-[8px] p-4 cursor-pointer transition-all min-w-[180px] w-[220px]
        border-2 ${selected ? 'border-[#FF6000]' : 'border-[#E8E8E8] hover:border-[#BDBDBD]'}`}
      style={{ background: selected ? '#FFF8F3' : '#fff' }}
    >
      {/* Bank logo area */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-bold text-[13px] text-[#252B42]">
          {card.card_label || card.name_on_card?.split(' ')[0] || 'Kartım'}
        </span>
        {/* Mastercard icon placeholder */}
        <div className="flex">
          <div className="w-[20px] h-[20px] rounded-full bg-[#EB001B] opacity-90 -mr-2" />
          <div className="w-[20px] h-[20px] rounded-full bg-[#F79E1B] opacity-90" />
        </div>
      </div>
      <p className="font-mono text-[13px] text-[#252B42] m-0 mb-1">
        {maskCard(card.card_no)}
      </p>
      <p className="font-normal text-[12px] text-[#737373] m-0">
        {card.expire_month}/{card.expire_year}
      </p>
    </div>
  );
}

// ── Step 2: Payment ────────────────────────────────────────────────────────────
const EMPTY_CARD_FORM = { card_no:'', card_label:'', name_on_card:'', expire_month:'', expire_year:'', cvv:'' };

function PaymentStep({ onBack, onComplete, addressData, registerSubmit }) {
  const dispatch = useDispatch();
  const checkedItems = useSelector(s => s.shoppingCart.cart.filter(i => i.checked));

  // Grand total for installment table
  const productTotal = checkedItems.reduce((s, { count, product: raw }) => {
    const p = normaliseProduct(raw);
    return s + getPrice(p) * count;
  }, 0);
  const shippingFee      = checkedItems.length > 0 ? 29.99 : 0;
  const shippingDiscount = productTotal >= 150 ? shippingFee : 0;
  const grandTotal       = productTotal + shippingFee - shippingDiscount;

  // ── Card list state ──────────────────────────────────────────────────────────
  const [cards,        setCards]        = useState([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);

  // ── Card form state (add & edit share the same form) ─────────────────────────
  const [showForm,    setShowForm]    = useState(false);
  const [editCardId,  setEditCardId]  = useState(null);   // null = new, id = edit
  const [cardForm,    setCardForm]    = useState(EMPTY_CARD_FORM);
  const [formErrors,  setFormErrors]  = useState({});
  const [formLoading, setFormLoading] = useState(false);

  // ── Other ─────────────────────────────────────────────────────────────────────
  const [use3D,      setUse3D]      = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setF = (f, v) => setCardForm(p => ({ ...p, [f]: v }));

  // ── Helpers: open form ────────────────────────────────────────────────────────
  const openNewForm = () => {
    setEditCardId(null);
    setCardForm(EMPTY_CARD_FORM);
    setFormErrors({});
    setShowForm(true);
  };

  const openEditForm = (card) => {
    setEditCardId(card.id);
    setCardForm({
      card_no:      String(card.card_no),
      card_label:   card.card_label ?? '',
      name_on_card: card.name_on_card ?? '',
      expire_month: String(card.expire_month),
      expire_year:  String(card.expire_year),
      cvv: '',
    });
    setFormErrors({});
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditCardId(null);
    setCardForm(EMPTY_CARD_FORM);
    setFormErrors({});
  };

  // ── Re-fetch cards and sync selection ────────────────────────────────────────
  const refreshCards = async (keepId = selectedCard) => {
    const { data: fresh } = await axiosInstance.get('/user/card');
    setCards(fresh);
    const ids = fresh.map(c => c.id);
    setSelectedCard(ids.includes(keepId) ? keepId : (fresh[0]?.id ?? null));
    return fresh;
  };

  // ── Fetch saved cards on mount ────────────────────────────────────────────────
  useEffect(() => {
    setCardsLoading(true);
    axiosInstance.get('/user/card')
      .then(({ data }) => {
        setCards(data);
        if (data.length > 0) setSelectedCard(data[0].id);
        else openNewForm();   // no saved cards → go straight to new-card form
      })
      .catch(() => openNewForm())
      .finally(() => setCardsLoading(false));
  }, []); // eslint-disable-line

  // ── Validate form ─────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    const digits = cardForm.card_no.replace(/\s/g,'');
    if (digits.length < 16)               e.card_no      = 'Geçerli kart numarası girin';
    if (!cardForm.name_on_card.trim())     e.name_on_card = 'Kart sahibi adı gerekli';
    if (!cardForm.expire_month)            e.expire_month = 'Ay seçin';
    if (!cardForm.expire_year)             e.expire_year  = 'Yıl seçin';
    // CVV required only for new cards
    if (!editCardId && !/^\d{3,4}$/.test(cardForm.cvv)) e.cvv = '3-4 hane';
    return e;
  };

  // ── Save card (POST or PUT) ───────────────────────────────────────────────────
  const handleSaveCard = async () => {
    const e = validate();
    if (Object.keys(e).length) { setFormErrors(e); return; }
    setFormLoading(true);
    try {
      const payload = {
        card_no:      cardForm.card_no.replace(/\s/g,''),
        expire_month: Number(cardForm.expire_month),
        expire_year:  Number(cardForm.expire_year),
        name_on_card: cardForm.name_on_card,
      };

      if (editCardId) {
        // PUT — update existing card
        await axiosInstance.put('/user/card', { ...payload, id: editCardId });
        toast.success('Kart güncellendi');
        const fresh = await refreshCards(editCardId);
        // Stay on saved-card view, select the updated card
        setSelectedCard(editCardId);
        if (!fresh.find(c => c.id === editCardId)) setSelectedCard(fresh[0]?.id ?? null);
      } else {
        // POST — add new card
        await axiosInstance.post('/user/card', payload);
        toast.success('Kart kaydedildi');
        const fresh = await refreshCards();
        // Select the newly added card (last in list)
        if (fresh.length > 0) setSelectedCard(fresh[fresh.length - 1].id);
      }
      closeForm();
    } catch {
      toast.error('Kart kaydedilemedi');
    } finally {
      setFormLoading(false);
    }
  };

  // ── Delete card ───────────────────────────────────────────────────────────────
  const handleDeleteCard = async (cardId) => {
    if (!window.confirm('Bu kartı silmek istiyor musunuz?')) return;
    try {
      await axiosInstance.delete(`/user/card/${cardId}`);
      const fresh = await refreshCards(selectedCard === cardId ? null : selectedCard);
      if (fresh.length === 0) openNewForm();
      toast.success('Kart silindi');
    } catch {
      toast.error('Kart silinemedi');
    }
  };

  // ── Submit order ──────────────────────────────────────────────────────────────
  const canPay = !showForm && !!selectedCard;

  const handleSubmit = async () => {
    if (!canPay) { toast.warning('Lütfen bir kart seçin'); return; }
    const chosen = cards.find(c => c.id === selectedCard);
    if (!chosen) return;

    setSubmitting(true);
    try {
      const payload = {
        address_id:        addressData.shippingAddr?.id,
        order_date:        new Date().toISOString().slice(0, 19),
        card_no:           Number(String(chosen.card_no).replace(/\s/g, '')),
        card_name:         chosen.name_on_card,
        card_expire_month: chosen.expire_month,
        card_expire_year:  chosen.expire_year,
        card_ccv:          use3D ? 1 : 0,  // CCV not stored; placeholder
        price:             grandTotal,
        products: checkedItems.map(({ count, product: raw }) => {
          const p = normaliseProduct(raw);
          return {
            product_id: p.id,
            count,
            detail: `${p.name ?? ''}`,
          };
        }),
      };

      await axiosInstance.post('/order', payload);
      dispatch(clearCart());
      onComplete();
    } catch {
      toast.error('Sipariş oluşturulamadı. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  // Keep parent's submit ref current so sidebar button always calls latest fn
  useEffect(() => { registerSubmit?.(handleSubmit); });

  // ── Input / select CSS helpers ────────────────────────────────────────────────
  const inputCls = (err) =>
    `w-full border rounded-[5px] px-3 py-[10px] text-[14px] font-['Montserrat'] outline-none
     transition-colors ${err ? 'border-[#E74040]' : 'border-[#E8E8E8] focus:border-[#FF6000]'}`;
  const selCls = (err) =>
    `w-full border rounded-[5px] px-3 py-[10px] text-[14px] font-['Montserrat'] bg-white
     outline-none appearance-none transition-colors
     ${err ? 'border-[#E74040]' : 'border-[#E8E8E8] focus:border-[#FF6000]'}`;

  return (
    <div className="flex flex-col gap-4">

      {/* ── Address summary header ───────────────────────────────────────── */}
      {addressData && (
        <div className="bg-white border border-[#E8E8E8] rounded-[5px] p-5
                        flex flex-col md:flex-row md:items-start gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-[16px] text-[#252B42] m-0 mb-1">Adres Bilgileri</h3>
            <p className="font-normal text-[13px] text-[#737373] m-0">
              {addressData.shippingAddr?.title}
            </p>
            <p className="font-normal text-[13px] text-[#737373] m-0">
              {addressData.shippingAddr?.neighborhood}, {addressData.shippingAddr?.district}
            </p>
            <p className="font-normal text-[13px] text-[#737373] m-0">
              {addressData.shippingAddr?.city}
            </p>
          </div>
          <button onClick={onBack}
            className="font-bold text-[13px] text-[#252B42] underline bg-transparent
                       border-none cursor-pointer self-start">
            Değiştir
          </button>
          <div className="hidden md:block h-full w-px bg-[#E8E8E8] mx-2" />
          <div className="flex-1">
            <h3 className="font-bold text-[16px] text-[#FF6000] m-0 mb-1">Ödeme Seçenekleri</h3>
            <p className="font-normal text-[13px] text-[#737373] m-0">
              <strong>Banka/Kredi Kartı</strong> veya <strong>Alışveriş Kredisi</strong> ile
              ödemenizi güvenle yapabilirsiniz.
            </p>
          </div>
        </div>
      )}

      {/* ── Kart ile Öde section ─────────────────────────────────────────── */}
      <div className="bg-white border border-[#E8E8E8] rounded-[5px] p-5">

        {/* Section header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-[20px] h-[20px] rounded-full border-2 border-[#FF6000] flex-shrink-0
                          flex items-center justify-center">
            <div className="w-[10px] h-[10px] rounded-full bg-[#FF6000]" />
          </div>
          <div>
            <p className="font-bold text-[15px] text-[#252B42] m-0">Kart ile Öde</p>
            <p className="font-normal text-[12px] text-[#737373] m-0">
              Kart ile ödemeyi seçtiniz. Banka veya Kredi Kartı kullanarak ödemenizi güvenle yapabilirsiniz.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT: Kart Bilgileri */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[16px] text-[#252B42] m-0">Kart Bilgileri</h3>
              {!showForm && cards.length > 0 && (
                <button onClick={openNewForm}
                  className="font-bold text-[13px] text-[#252B42] underline bg-transparent
                             border-none cursor-pointer hover:text-[#FF6000] transition-colors">
                  Başka bir Kart ile Ödeme Yap
                </button>
              )}
              {showForm && cards.length > 0 && (
                <button onClick={closeForm}
                  className="font-bold text-[13px] text-[#252B42] underline bg-transparent
                             border-none cursor-pointer hover:text-[#FF6000] transition-colors">
                  Kayıtlı kartımla ödeme yap
                </button>
              )}
            </div>

            {/* Loading */}
            {cardsLoading && (
              <div className="flex justify-center py-6">
                <Loader2 size={28} className="animate-spin text-[#FF6000]" />
              </div>
            )}

            {/* ── Saved card tiles ────────────────────────────────────────── */}
            {!cardsLoading && !showForm && cards.length > 0 && (
              <div className="flex flex-col gap-4">
                {cards.map(c => (
                  <div key={c.id}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="savedCard"
                          checked={selectedCard === c.id}
                          onChange={() => setSelectedCard(c.id)}
                          className="accent-[#FF6000] w-[16px] h-[16px]" />
                        <span className={`font-bold text-[13px] transition-colors
                          ${selectedCard === c.id ? 'text-[#FF6000]' : 'text-[#737373]'}`}>
                          {c.card_label || c.name_on_card} kartım
                        </span>
                      </label>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEditForm(c)}
                          className="p-1 bg-transparent border-none cursor-pointer
                                     text-[#BDBDBD] hover:text-[#23A6F0] transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDeleteCard(c.id)}
                          className="p-1 bg-transparent border-none cursor-pointer
                                     text-[#BDBDBD] hover:text-[#E74040] transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <SavedCardTile
                      card={c}
                      selected={selectedCard === c.id}
                      onSelect={() => setSelectedCard(c.id)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* ── Add / Edit card form ─────────────────────────────────────── */}
            {!cardsLoading && showForm && (
              <div className="flex flex-col gap-4">
                {/* Card number */}
                <div>
                  <label className="font-normal text-[14px] text-[#252B42] block mb-2">
                    Kart Numarası
                  </label>
                  <input
                    type="text" inputMode="numeric"
                    value={cardForm.card_no}
                    onChange={e => setF('card_no', formatCardNum(e.target.value))}
                    maxLength={19}
                    className={inputCls(formErrors.card_no)}
                  />
                  {formErrors.card_no && (
                    <p className="text-[11px] text-[#E74040] mt-1 m-0">{formErrors.card_no}</p>
                  )}
                </div>

                {/* Card label (nickname) */}
                <div>
                  <label className="font-normal text-[14px] text-[#252B42] block mb-2">
                    Kart Adı <span className="text-[#BDBDBD] font-normal text-[12px]">(isteğe bağlı, ör: İş Kartım)</span>
                  </label>
                  <input
                    type="text"
                    value={cardForm.card_label}
                    onChange={e => setF('card_label', e.target.value)}
                    placeholder="İş Kartım, Bonus Kartım…"
                    className={inputCls(false)}
                  />
                </div>

                {/* Name on card */}
                <div>
                  <label className="font-normal text-[14px] text-[#252B42] block mb-2">
                    Kart Üzerindeki İsim
                  </label>
                  <input
                    type="text"
                    value={cardForm.name_on_card}
                    onChange={e => setF('name_on_card', e.target.value)}
                    placeholder="Ad Soyad"
                    className={inputCls(formErrors.name_on_card)}
                  />
                  {formErrors.name_on_card && (
                    <p className="text-[11px] text-[#E74040] mt-1 m-0">{formErrors.name_on_card}</p>
                  )}
                </div>

                {/* Expiry + CVV */}
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <label className="font-normal text-[14px] text-[#252B42] block mb-2">
                      Son Kullanma Tarihi
                    </label>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <select value={cardForm.expire_month}
                          onChange={e => setF('expire_month', e.target.value)}
                          className={selCls(formErrors.expire_month)}>
                          <option value="">Ay</option>
                          {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        {formErrors.expire_month && (
                          <p className="text-[11px] text-[#E74040] mt-1 m-0">{formErrors.expire_month}</p>
                        )}
                      </div>
                      <div className="flex-1">
                        <select value={cardForm.expire_year}
                          onChange={e => setF('expire_year', e.target.value)}
                          className={selCls(formErrors.expire_year)}>
                          <option value="">Yıl</option>
                          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        {formErrors.expire_year && (
                          <p className="text-[11px] text-[#E74040] mt-1 m-0">{formErrors.expire_year}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CVV — only for new cards */}
                  {!editCardId && (
                    <div className="w-[140px]">
                      <label className="font-normal text-[14px] text-[#252B42] block mb-2">
                        CVV
                        <span className="ml-1 text-[#FF6000] font-bold cursor-help"
                          title="Kartınızın arkasındaki 3-4 haneli güvenlik kodu">ⓘ</span>
                      </label>
                      <input
                        type="text" inputMode="numeric"
                        value={cardForm.cvv}
                        onChange={e => setF('cvv', e.target.value.replace(/\D/g,'').slice(0,4))}
                        maxLength={4}
                        className={inputCls(formErrors.cvv)}
                      />
                      {formErrors.cvv && (
                        <p className="text-[11px] text-[#E74040] mt-1 m-0">{formErrors.cvv}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Form action buttons */}
                <div className="flex items-center gap-3">
                  <button onClick={handleSaveCard} disabled={formLoading}
                    className="px-5 py-2 bg-[#FF6000] text-white rounded-[5px]
                               font-bold text-[13px] border-none cursor-pointer
                               hover:bg-[#e05500] transition-colors flex items-center gap-2
                               disabled:opacity-60 disabled:cursor-not-allowed">
                    {formLoading && <Loader2 size={13} className="animate-spin" />}
                    {editCardId ? 'Güncelle' : 'Kartı Kaydet'}
                  </button>
                  {cards.length > 0 && (
                    <button onClick={closeForm}
                      className="px-5 py-2 border border-[#BDBDBD] rounded-[5px] font-bold text-[13px]
                                 text-[#737373] bg-white cursor-pointer hover:border-[#252B42] transition-colors">
                      İptal
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 3D Secure */}
            <label className="flex items-center gap-2 cursor-pointer select-none mt-5">
              <input type="checkbox" checked={use3D} onChange={e => setUse3D(e.target.checked)}
                className="w-[18px] h-[18px] accent-[#FF6000]" />
              <Lock size={14} color="#252B42" className="flex-shrink-0" />
              <span className="font-bold text-[13px] text-[#252B42]">3D Secure</span>
              <span className="font-normal text-[13px] text-[#252B42]">ile ödemek istiyorum.</span>
            </label>
          </div>

          {/* RIGHT: Taksit Seçenekleri */}
          <div className="lg:w-[340px] flex-shrink-0">
            <h3 className="font-bold text-[16px] text-[#252B42] m-0 mb-1">Taksit Seçenekleri</h3>
            <p className="font-normal text-[13px] text-[#737373] m-0 mb-4">
              Kartınıza uygun taksit seçeneğini seçiniz
            </p>
            <table className="w-full border border-[#E8E8E8] rounded-[5px] overflow-hidden">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#E8E8E8]">
                  <th className="font-bold text-[13px] text-[#252B42] text-left px-4 py-3">
                    Taksit Sayısı
                  </th>
                  <th className="font-bold text-[13px] text-[#252B42] text-right px-4 py-3">
                    Aylık Ödeme
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#F5F5F5]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-[16px] h-[16px] rounded-full border-2 border-[#FF6000]
                                      flex items-center justify-center flex-shrink-0">
                        <div className="w-[8px] h-[8px] rounded-full bg-[#FF6000]" />
                      </div>
                      <span className="font-bold text-[13px] text-[#FF6000]">Tek Çekim</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-[13px] text-[#FF6000]">
                    {grandTotal.toFixed(2)} TL
                  </td>
                </tr>
                {[2, 3, 6].map(n => (
                  <tr key={n} className="border-b border-[#F5F5F5] opacity-40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-[16px] h-[16px] rounded-full border-2 border-[#BDBDBD]
                                        flex-shrink-0" />
                        <span className="font-normal text-[13px] text-[#737373]">{n} Taksit</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-normal text-[13px] text-[#737373]">
                      {(grandTotal / n).toFixed(2)} TL
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Mobile: Back + Submit ────────────────────────────────────────── */}
      <div className="flex gap-3 lg:hidden">
        <button onClick={onBack}
          className="flex-1 py-[13px] border border-[#BDBDBD] rounded-[5px] font-bold text-[14px]
                     text-[#737373] bg-white cursor-pointer hover:border-[#252B42] transition-colors">
          ← Geri Dön
        </button>
        <button onClick={handleSubmit} disabled={submitting}
          className="flex-1 py-[13px] bg-[#FF6000] text-white rounded-[5px] font-bold text-[14px]
                     border-none cursor-pointer hover:bg-[#e05500] transition-colors
                     flex items-center justify-center gap-2 disabled:opacity-60">
          {submitting && <Loader2 size={14} className="animate-spin" />}
          Ödeme Yap
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CreateOrderPage — orchestrates both steps
// ─────────────────────────────────────────────────────────────────────────────
export default function CreateOrderPage() {
  const history      = useHistory();
  const cart         = useSelector(s => s.shoppingCart.cart);
  const checkedItems = cart.filter(i => i.checked);

  const [step,          setStep]          = useState(1);
  const [addressData,   setAddressData]   = useState(null);
  const [addressReady,  setAddressReady]  = useState(false);
  const addressNextRef  = useRef(null);
  const paymentSubmitRef = useRef(null);

  // step 1 → 2
  const handleAddressNext = (data) => {
    setAddressData(data);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // called by PaymentStep after successful POST /order
  const handleComplete = () => {
    toast.success('🎉 Siparişiniz başarıyla oluşturuldu! Teşekkürler.');
    history.push('/');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-['Montserrat']">

      {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
      <div className="w-full bg-[#FAFAFA] border-b border-[#E8E8E8]">
        <div className="max-w-[1140px] mx-auto px-4 md:px-6 py-[24px]
                        flex items-center gap-[10px] flex-wrap">
          <Link to="/" className="font-bold text-[14px] text-[#252B42] no-underline hover:text-[#23A6F0]">
            Ana Sayfa
          </Link>
          <ChevronRight size={12} color="#BDBDBD" />
          <Link to="/cart" className="font-bold text-[14px] text-[#252B42] no-underline hover:text-[#23A6F0]">
            Sepet
          </Link>
          <ChevronRight size={12} color="#BDBDBD" />
          <span className="font-bold text-[14px] text-[#BDBDBD]">Sipariş Oluştur</span>
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-4 md:px-6 py-8">

        {/* Step bar */}
        <StepBar step={step} />

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── Left: current step content ───────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {step === 1 && (
              <AddressStep
                onNext={handleAddressNext}
                onReadyChange={setAddressReady}
                registerNext={fn => { addressNextRef.current = fn; }}
              />
            )}
            {step === 2 && (
              <PaymentStep
                onBack={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                onComplete={handleComplete}
                addressData={addressData}
                registerSubmit={fn => { paymentSubmitRef.current = fn; }}
              />
            )}
          </div>

          {/* ── Right: Order Summary ──────────────────────────────────────── */}
          <OrderSummary
            checkedItems={checkedItems}
            canConfirm={step === 1 ? addressReady : true}
            onConfirm={step === 1
              ? () => addressNextRef.current?.()
              : () => paymentSubmitRef.current?.()}
            btnLabel={step === 1 ? 'Kaydet ve Devam Et' : 'Ödeme Yap'}
          />
        </div>
      </div>
    </div>
  );
}