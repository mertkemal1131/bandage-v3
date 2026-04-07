import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Plus, Edit2, Trash2, MapPin, Loader2,
  ChevronRight, CreditCard, Lock, CheckCircle,
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { setAddressList } from '../store/clientReducer';
import { setPayment } from '../store/shoppingCartReducer';
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
  const productTotal   = checkedItems.reduce((s, { count, product: raw }) => {
    const p = normaliseProduct(raw);
    return s + getPrice(p) * count;
  }, 0);
  const shippingFee      = checkedItems.length > 0 ? 29.99 : 0;
  const shippingDiscount = productTotal >= 150 ? shippingFee : 0;
  const grandTotal       = productTotal + shippingFee - shippingDiscount;

  return (
    <div className="w-full lg:w-[296px] shrink-0 flex flex-col gap-3">
      <button onClick={onConfirm} disabled={!canConfirm}
        className={`w-full py-[16px] rounded-[5px] font-bold text-[16px] border-none
          flex items-center justify-center gap-2 transition-colors
          ${canConfirm
            ? 'bg-[#FF6000] text-white cursor-pointer hover:bg-[#e05500]'
            : 'bg-[#BDBDBD] text-white cursor-not-allowed'}`}>
        {btnLabel} <ChevronRight size={18} />
      </button>

      {/* Terms */}
      <div className="bg-white border border-[#E8E8E8] rounded-[5px] p-4 flex items-start gap-3">
        <input type="checkbox" id="terms" className="mt-[3px] accent-[#FF6000] flex-shrink-0" />
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

      <button onClick={onConfirm} disabled={!canConfirm}
        className={`w-full py-[16px] rounded-[5px] font-bold text-[16px] border-none
          flex items-center justify-center gap-2 transition-colors
          ${canConfirm
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
function AddressStep({ onNext }) {
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
        const { data } = await axiosInstance.put('/user/address', { ...formData, id: editAddr.id });
        dispatch(setAddressList(addressList.map(a => a.id === data.id ? data : a)));
        toast.success('Adres güncellendi');
      } else {
        const { data } = await axiosInstance.post('/user/address', formData);
        const next = [...addressList, data];
        dispatch(setAddressList(next));
        if (!shippingId) setShippingId(data.id);
        toast.success('Adres eklendi');
      }
      setShowForm(false); setEditAddr(null);
    } catch { toast.error('Adres kaydedilemedi'); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu adresi silmek istiyor musunuz?')) return;
    try {
      await axiosInstance.delete(`/user/address/${id}`);
      const next = addressList.filter(a => a.id !== id);
      dispatch(setAddressList(next));
      if (shippingId === id) setShippingId(next[0]?.id ?? null);
      if (billingId  === id) setBillingId(next[0]?.id ?? null);
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

      {/* Mobile next button */}
      <button onClick={handleNext} disabled={!canProceed}
        className={`lg:hidden w-full py-[14px] rounded-[5px] font-bold text-[15px]
          border-none flex items-center justify-center gap-2 transition-colors
          ${canProceed
            ? 'bg-[#FF6000] text-white cursor-pointer hover:bg-[#e05500]'
            : 'bg-[#BDBDBD] text-white cursor-not-allowed'}`}>
        Kaydet ve Devam Et <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ── Step 2: Payment ────────────────────────────────────────────────────────────
function PaymentStep({ onBack, onComplete }) {
  const dispatch = useDispatch();
  const [card, setCard] = useState(EMPTY_CARD);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (f, v) => setCard(p => ({ ...p, [f]: v }));

  // Format card number: add a space every 4 digits
  const formatCardNum = (val) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const validate = () => {
    const e = {};
    const digits = card.cardNumber.replace(/\s/g, '');
    if (digits.length < 16)          e.cardNumber = 'Geçerli kart numarası girin (16 hane)';
    if (!card.cardName.trim())        e.cardName   = 'Kart üzerindeki isim gerekli';
    if (!card.expMonth)               e.expMonth   = 'Ay seçin';
    if (!card.expYear)                e.expYear    = 'Yıl seçin';
    if (!/^\d{3,4}$/.test(card.cvv)) e.cvv        = 'CVV 3-4 haneli olmalı';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    // Store payment info in Redux (no API call yet — next task)
    dispatch(setPayment({
      cardNumber: card.cardNumber.replace(/\s/g, '').slice(-4), // only last 4 for security
      cardName:   card.cardName,
      expMonth:   card.expMonth,
      expYear:    card.expYear,
    }));
    setTimeout(() => {
      setSubmitting(false);
      onComplete();
    }, 600);
  };

  const F = ({ label, field, err, children }) => (
    <div className="flex flex-col gap-1">
      <label className="font-bold text-[12px] text-[#252B42]">{label}</label>
      {children}
      {err && <span className="text-[11px] text-[#E74040]">{err}</span>}
    </div>
  );

  const inputCls = (hasErr) =>
    `border rounded-[5px] px-3 py-[10px] text-[14px] font-['Montserrat'] outline-none
     transition-colors w-full ${hasErr ? 'border-[#E74040]' : 'border-[#E8E8E8] focus:border-[#FF6000]'}`;

  const selCls = (hasErr) =>
    `border rounded-[5px] px-3 py-[10px] text-[14px] font-['Montserrat'] outline-none
     bg-white appearance-none transition-colors w-full
     ${hasErr ? 'border-[#E74040]' : 'border-[#E8E8E8] focus:border-[#FF6000]'}`;

  return (
    <div className="flex flex-col gap-4">
      {/* Header card */}
      <div className="bg-white border border-[#E8E8E8] rounded-[5px] p-5">
        <h2 className="font-bold text-[18px] text-[#252B42] m-0 mb-1 flex items-center gap-2">
          <CreditCard size={18} color="#FF6000" /> Ödeme Seçenekleri
        </h2>
        <p className="font-normal text-[13px] text-[#737373] m-0">
          <strong>Banka/Kredi Kartı</strong> veya <strong>Alışveriş Kredisi</strong> ile ödemenizi güvenle yapabilirsiniz.
        </p>
      </div>

      {/* Card form */}
      <div className="bg-white border border-[#E8E8E8] rounded-[5px] p-5">
        <div className="flex items-center gap-2 mb-5">
          <Lock size={15} color="#23856D" />
          <span className="font-bold text-[13px] text-[#23856D]">256-bit SSL ile korumalı güvenli ödeme</span>
        </div>

        {/* Card number preview strip */}
        <div className="bg-gradient-to-br from-[#252B42] to-[#23A6F0] rounded-[10px]
                        p-5 mb-5 text-white relative overflow-hidden">
          <div className="absolute top-3 right-4 opacity-20 text-[60px] font-bold">◈</div>
          <p className="font-mono text-[18px] tracking-[4px] mb-2 m-0">
            {card.cardNumber || '•••• •••• •••• ••••'}
          </p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] opacity-70 m-0 mb-[2px]">Kart Sahibi</p>
              <p className="font-bold text-[13px] m-0 uppercase">
                {card.cardName || 'AD SOYAD'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] opacity-70 m-0 mb-[2px]">Son Kullanma</p>
              <p className="font-bold text-[13px] m-0">
                {card.expMonth || 'MM'}/{card.expYear ? card.expYear.slice(-2) : 'YY'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Card number */}
          <F label="Kart Numarası *" field="cardNumber" err={errors.cardNumber}>
            <input
              type="text" inputMode="numeric"
              value={card.cardNumber}
              onChange={e => set('cardNumber', formatCardNum(e.target.value))}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              className={inputCls(errors.cardNumber)}
            />
          </F>

          {/* Name on card */}
          <F label="Kart Üzerindeki İsim *" field="cardName" err={errors.cardName}>
            <input
              type="text" value={card.cardName}
              onChange={e => set('cardName', e.target.value.toUpperCase())}
              placeholder="AD SOYAD"
              className={inputCls(errors.cardName)}
            />
          </F>

          {/* Expiry + CVV */}
          <div className="grid grid-cols-3 gap-3">
            <F label="Ay *" field="expMonth" err={errors.expMonth}>
              <select value={card.expMonth} onChange={e => set('expMonth', e.target.value)}
                className={selCls(errors.expMonth)}>
                <option value="">MM</option>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </F>
            <F label="Yıl *" field="expYear" err={errors.expYear}>
              <select value={card.expYear} onChange={e => set('expYear', e.target.value)}
                className={selCls(errors.expYear)}>
                <option value="">YYYY</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </F>
            <F label="CVV *" field="cvv" err={errors.cvv}>
              <input
                type="text" inputMode="numeric"
                value={card.cvv}
                onChange={e => set('cvv', e.target.value.replace(/\D/g,'').slice(0,4))}
                placeholder="•••"
                maxLength={4}
                className={inputCls(errors.cvv)}
              />
            </F>
          </div>

          {/* Save card */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={card.saveCard}
              onChange={e => set('saveCard', e.target.checked)}
              className="accent-[#FF6000] w-[16px] h-[16px]" />
            <span className="font-normal text-[13px] text-[#252B42]">Bu kartı kaydet</span>
          </label>
        </div>
      </div>

      {/* Back + mobile submit */}
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
          Siparişi Tamamla
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
  const [addressData,   setAddressData]   = useState(null); // set when step 1 completes

  // step 1 → 2
  const handleAddressNext = (data) => {
    setAddressData(data);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // step 2 complete
  const handleComplete = () => {
    toast.success('Siparişiniz alındı! Teşekkürler 🎉');
    // Navigate to home or order confirmation page
    history.push('/');
  };

  // Sidebar confirm action depends on step
  const sidebarConfirm = step === 1
    ? () => {} // step 1 confirm is triggered by the AddressStep internally via onNext
    : handleComplete;

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
              <AddressStep onNext={handleAddressNext} />
            )}
            {step === 2 && (
              <PaymentStep
                onBack={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                onComplete={handleComplete}
              />
            )}
          </div>

          {/* ── Right: Order Summary ──────────────────────────────────────── */}
          <OrderSummary
            checkedItems={checkedItems}
            canConfirm={step === 2}
            onConfirm={step === 1
              ? () => toast.info('Önce teslimat adresinizi seçin')
              : handleComplete}
            btnLabel={step === 1 ? 'Kaydet ve Devam Et' : 'Siparişi Tamamla'}
          />
        </div>
      </div>
    </div>
  );
}