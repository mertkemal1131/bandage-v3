import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Mail, Lock, User, ChevronRight, Loader } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { loginUser, fetchRolesIfNeeded } from '../store/thunks';
import { setUser } from '../store/clientReducer';

const IBAN_REGEX     = /^TR\d{24}$/;
const TR_PHONE_REGEX = /^(05)\d{9}$/;
const TAX_NO_REGEX   = /^T\d{4}V\d{6}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

const inputCls = "w-full border border-[#E8E8E8] rounded-[5px] py-3 px-4 text-[14px] font-['Montserrat'] outline-none text-[#252B42] bg-white transition-colors focus:border-[#23A6F0] box-border";

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label className="font-bold text-[13px] text-[#252B42]">{label}</label>
      {children}
      {error && <p className="text-[12px] text-[#E2462C] font-semibold">{error.message}</p>}
    </div>
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-['Montserrat']">
      <div className="bg-white border-b border-[#E8E8E8] py-4">
        <div className="max-w-[1050px] mx-auto px-6 flex items-center gap-2 font-bold text-[14px] text-[#737373]">
          <Link to="/" className="text-[#737373] no-underline">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#252B42]">{mode === 'login' ? 'Login' : 'Register'}</span>
        </div>
      </div>
      <div className="flex items-center justify-center py-[60px] px-6">
        <div className="w-full max-w-[440px] bg-white rounded-lg border border-[#E8E8E8] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <div className="flex">
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-4 border-none cursor-pointer font-['Montserrat'] font-bold text-[14px] capitalize transition-all ${
                  mode === m ? 'bg-[#23A6F0] text-white' : 'bg-white text-[#737373] hover:bg-[#F5F5F5]'
                }`}>
                {m === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>
          <div className="p-8">
            {mode === 'login'
              ? <LoginForm onSwitch={() => setMode('register')} />
              : <RegisterForm onSwitch={() => setMode('login')} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── LOGIN FORM ─────────────────────────────────────────────────────────────
function LoginForm({ onSwitch }) {
  const dispatch = useDispatch();
  const history  = useHistory();
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  // Delegates entirely to the loginUser thunk:
  //  • POSTs to /login
  //  • saves token to localStorage ONLY when rememberMe is checked
  //  • dispatches setUser on success → toast → redirect
  //  • shows error toast on failure, keeps user on this page
  const onSubmit = ({ email, password, rememberMe }) => {
    console.log('[LoginForm] onSubmit called — rememberMe:', rememberMe);
    dispatch(loginUser(email, password, rememberMe, history));
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="text-center mb-6">
        <h2 className="font-bold text-[22px] text-[#252B42] mb-1.5">Welcome Back</h2>
        <p className="text-[14px] text-[#737373]">Login to your Bandage account</p>
      </div>

      <Field label="Email" error={errors.email}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2"><Mail size={14} color="#BDBDBD" /></span>
          <input type="email" placeholder="your@email.com" className={`${inputCls} pl-10`}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
            })} />
        </div>
      </Field>

      <Field label="Password" error={errors.password}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2"><Lock size={14} color="#BDBDBD" /></span>
          <input type={showPw ? 'text' : 'password'} placeholder="••••••••" className={`${inputCls} pl-10 pr-10`}
            {...register('password', { required: 'Password is required' })} />
          <button type="button" onClick={() => setShowPw(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0">
            {showPw ? <EyeOff size={14} color="#BDBDBD" /> : <Eye size={14} color="#BDBDBD" />}
          </button>
        </div>
      </Field>

      <div className="flex items-center justify-between mb-5 text-[13px]">
        <label className="flex items-center gap-1.5 cursor-pointer text-[#737373] font-semibold">
          <input type="checkbox" className="accent-[#23A6F0]"
            {...register('rememberMe')} />
          Remember me
        </label>
        <button type="button" className="bg-transparent border-none cursor-pointer text-[#23A6F0] font-['Montserrat'] font-bold text-[13px]">
          Forgot password?
        </button>
      </div>

      <button type="submit" disabled={isSubmitting}
        className={`w-full flex items-center justify-center gap-2 text-white border-none rounded-[5px] py-[14px] font-['Montserrat'] font-bold text-[14px] mb-4 transition-colors ${
          isSubmitting ? 'bg-[#9dd4f7] cursor-not-allowed' : 'bg-[#23A6F0] cursor-pointer hover:bg-[#1a8fd1]'
        }`}>
        {isSubmitting && <Loader size={16} className="animate-spin" />}
        {isSubmitting ? 'Signing in...' : 'Login'}
      </button>

      <p className="text-center text-[13px] text-[#737373]">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitch}
          className="bg-transparent border-none cursor-pointer text-[#23A6F0] font-['Montserrat'] font-bold text-[13px]">
          Create one
        </button>
      </p>
    </form>
  );
}

// ── REGISTER FORM ──────────────────────────────────────────────────────────
function RegisterForm({ onSwitch }) {
  const dispatch = useDispatch();
  const history  = useHistory();

  // Pull roles from Redux — fetchRolesIfNeeded will only call API if not already loaded
  const rolesFromStore = useSelector(s => s.client.roles);

  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError,   setRolesError]   = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [serverError,  setServerError]  = useState('');

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: '', email: '', password: '', confirmPassword: '', role_id: '',
      store: { name: '', phone: '', tax_no: '', bank_account: '' },
    },
  });

  const watchedRoleId  = watch('role_id');
  const watchedPassword = watch('password');

  // Fetch roles via thunk — only hits API when store is empty
  useEffect(() => {
    dispatch(fetchRolesIfNeeded())
      .catch(() => setRolesError(true))
      .finally(() => setRolesLoading(false));
  }, [dispatch]);

  // Once roles land in store, set default to Customer
  useEffect(() => {
    if (!rolesFromStore.length) return;
    setRolesLoading(false);
    const customer = rolesFromStore.find(
      r => r.code?.toLowerCase() === 'customer' || r.name?.toLowerCase() === 'customer'
    );
    if (customer) setValue('role_id', String(customer.id));
    else setValue('role_id', String(rolesFromStore[0].id));
  }, [rolesFromStore, setValue]);

  useEffect(() => {
    const sub = watch(() => { if (serverError) setServerError(''); });
    return () => sub.unsubscribe();
  }, [watch, serverError]);

  const selectedRole = rolesFromStore.find(r => String(r.id) === String(watchedRoleId));
  const isStore =
    selectedRole?.code?.toLowerCase() === 'store' ||
    selectedRole?.name?.toLowerCase() === 'store' ||
    selectedRole?.name?.toLowerCase() === 'mağaza';

  const onSubmit = async (data) => {
    setServerError('');
    const payload = {
      name: data.name, email: data.email, password: data.password, role_id: Number(data.role_id),
    };
    if (isStore) {
      payload.store = {
        name: data.store.name, phone: data.store.phone,
        tax_no: data.store.tax_no, bank_account: data.store.bank_account,
      };
    }
    try {
      await axiosInstance.post('/signup', payload);
      toast.success('You need to click link in email to activate your account!', { autoClose: 6000 });
      history.goBack();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Something went wrong.';
      setServerError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="text-center mb-6">
        <h2 className="font-bold text-[22px] text-[#252B42] mb-1.5">Create Account</h2>
        <p className="text-[14px] text-[#737373]">Join Bandage today</p>
      </div>

      <Field label="Full Name" error={errors.name}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2"><User size={14} color="#BDBDBD" /></span>
          <input type="text" placeholder="John Doe" className={`${inputCls} pl-10`}
            {...register('name', { required: 'Name is required', minLength: { value: 3, message: 'Min 3 characters' } })} />
        </div>
      </Field>

      <Field label="Email" error={errors.email}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2"><Mail size={14} color="#BDBDBD" /></span>
          <input type="email" placeholder="your@email.com" className={`${inputCls} pl-10`}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
            })} />
        </div>
      </Field>

      <Field label="Password" error={errors.password}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2"><Lock size={14} color="#BDBDBD" /></span>
          <input type={showPassword ? 'text' : 'password'}
            placeholder="Min 8 chars, upper, lower, number, special" className={`${inputCls} pl-10 pr-10`}
            {...register('password', {
              required: 'Password is required',
              pattern: { value: PASSWORD_REGEX, message: 'Must be 8+ chars with uppercase, lowercase, number & special character' },
            })} />
          <button type="button" onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0">
            {showPassword ? <EyeOff size={14} color="#BDBDBD" /> : <Eye size={14} color="#BDBDBD" />}
          </button>
        </div>
      </Field>

      <Field label="Confirm Password" error={errors.confirmPassword}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2"><Lock size={14} color="#BDBDBD" /></span>
          <input type={showConfirm ? 'text' : 'password'} placeholder="Repeat your password" className={`${inputCls} pl-10 pr-10`}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: v => v === watchedPassword || 'Passwords do not match',
            })} />
          <button type="button" onClick={() => setShowConfirm(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0">
            {showConfirm ? <EyeOff size={14} color="#BDBDBD" /> : <Eye size={14} color="#BDBDBD" />}
          </button>
        </div>
      </Field>

      <Field label="Role" error={errors.role_id}>
        {rolesLoading ? (
          <div className="flex items-center gap-2 text-[#737373] text-[14px] py-2">
            <Loader size={14} className="animate-spin" /> Loading roles...
          </div>
        ) : rolesError ? (
          <div className="flex items-center gap-2 text-[#E2462C] text-[13px] font-semibold bg-[#fff5f5] border border-[#E2462C] rounded-[5px] px-4 py-3">
            Could not load roles.{' '}
            <button type="button" onClick={() => window.location.reload()}
              className="underline bg-transparent border-none cursor-pointer text-[#E2462C] text-[13px] p-0">
              Refresh
            </button>
          </div>
        ) : (
          <select className={`${inputCls} cursor-pointer`}
            {...register('role_id', { required: 'Please select a role' })}>
            <option value="" disabled>Select a role</option>
            {rolesFromStore.map(role => (
              <option key={role.id} value={String(role.id)}>{role.name}</option>
            ))}
          </select>
        )}
      </Field>

      {isStore && (
        <div className="flex flex-col gap-4 border border-[#E8E8E8] rounded-[8px] p-4 bg-[#FAFAFA] mb-4">
          <p className="font-bold text-[13px] text-[#252B42] m-0 uppercase tracking-wide">Store Details</p>
          <Field label="Store Name" error={errors.store?.name}>
            <input type="text" placeholder="Your store name" className={inputCls}
              {...register('store.name', { required: 'Store name is required', minLength: { value: 3, message: 'At least 3 characters' } })} />
          </Field>
          <Field label="Store Phone (05XXXXXXXXX)" error={errors.store?.phone}>
            <input type="tel" placeholder="05XXXXXXXXX" className={inputCls}
              {...register('store.phone', { required: 'Phone is required', pattern: { value: TR_PHONE_REGEX, message: 'Valid Türkiye number (05XXXXXXXXX)' } })} />
          </Field>
          <Field label="Store Tax ID (TXXXXVXXXXXX)" error={errors.store?.tax_no}>
            <input type="text" placeholder="TXXXXVXXXXXX" className={inputCls}
              {...register('store.tax_no', { required: 'Tax ID is required', pattern: { value: TAX_NO_REGEX, message: 'T + 4 digits + V + 6 digits' } })} />
          </Field>
          <Field label="Store IBAN (TR + 24 digits)" error={errors.store?.bank_account}>
            <input type="text" placeholder="TR000000000000000000000000" className={inputCls}
              {...register('store.bank_account', { required: 'IBAN is required', pattern: { value: IBAN_REGEX, message: 'Valid Turkish IBAN (TR + 24 digits)' } })} />
          </Field>
        </div>
      )}

      {serverError && (
        <div className="bg-[#fff5f5] border border-[#E2462C] rounded-[5px] px-4 py-3 mb-4">
          <p className="text-[13px] text-[#E2462C] font-semibold m-0">{serverError}</p>
        </div>
      )}

      <button type="submit" disabled={isSubmitting || rolesLoading || rolesError}
        className={`w-full flex items-center justify-center gap-2 text-white border-none rounded-[5px] py-[14px] font-['Montserrat'] font-bold text-[14px] mb-4 transition-colors ${
          isSubmitting || rolesLoading || rolesError ? 'bg-[#9dd4f7] cursor-not-allowed' : 'bg-[#23A6F0] cursor-pointer hover:bg-[#1a8fd1]'
        }`}>
        {isSubmitting && <Loader size={16} className="animate-spin" />}
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>

      <p className="text-center text-[13px] text-[#737373]">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch}
          className="bg-transparent border-none cursor-pointer text-[#23A6F0] font-['Montserrat'] font-bold text-[13px]">
          Sign in
        </button>
      </p>
    </form>
  );
}