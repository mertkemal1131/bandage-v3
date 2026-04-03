import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Mail, Lock, User, ChevronRight, Loader } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

// ── Validation constants ───────────────────────────────────────────────────
const IBAN_REGEX     = /^TR\d{24}$/;
const TR_PHONE_REGEX = /^(05)\d{9}$/;
const TAX_NO_REGEX   = /^T\d{4}V\d{6}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

const inputCls =
  "w-full border border-[#E8E8E8] rounded-[5px] py-3 px-4 text-[14px] font-['Montserrat'] outline-none text-[#252B42] bg-white transition-colors focus:border-[#23A6F0] box-border";

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label className="font-bold text-[13px] text-[#252B42]">{label}</label>
      {children}
      {error && <p className="text-[12px] text-[#E2462C] font-semibold">{error.message}</p>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
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
          {/* Tabs */}
          <div className="flex">
            {['login', 'register'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-4 border-none cursor-pointer font-['Montserrat'] font-bold text-[14px] capitalize transition-all ${
                  mode === m ? 'bg-[#23A6F0] text-white' : 'bg-white text-[#737373] hover:bg-[#F5F5F5]'
                }`}
              >
                {m === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>
          <div className="p-8">
            {mode === 'login'
              ? <LoginForm onSwitch={() => setMode('register')} />
              : <RegisterForm onSwitch={() => setMode('login')} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LOGIN FORM — real API call to POST /login
// ═══════════════════════════════════════════════════════════════════════════
function LoginForm({ onSwitch }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { loading, error } = useSelector(s => s.auth);
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '', password: '' } });

  const onSubmit = async (data) => {
    dispatch({ type: 'AUTH_LOADING' });
    try {
      const res = await axiosInstance.post('/login', {
        email: data.email,
        password: data.password,
      });
      // API returns { token, user } — save token for future requests
      const { token, user, name, email } = res.data;
      if (token) localStorage.setItem('token', token);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: user || { name: name || data.email, email: email || data.email },
      });
      toast.success('Welcome back!');
      history.goBack();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        'Invalid email or password.';
      dispatch({ type: 'AUTH_FAIL', payload: typeof msg === 'string' ? msg : 'Login failed.' });
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="text-center mb-6">
        <h2 className="font-bold text-[22px] text-[#252B42] mb-1.5">Welcome Back</h2>
        <p className="text-[14px] text-[#737373]">Login to your Bandage account</p>
      </div>

      {/* Email */}
      <Field label="Email" error={errors.email}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2"><Mail size={14} color="#BDBDBD" /></span>
          <input
            type="email"
            placeholder="your@email.com"
            className={`${inputCls} pl-10`}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
            })}
          />
        </div>
      </Field>

      {/* Password */}
      <Field label="Password" error={errors.password}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2"><Lock size={14} color="#BDBDBD" /></span>
          <input
            type={showPw ? 'text' : 'password'}
            placeholder="••••••••"
            className={`${inputCls} pl-10 pr-10`}
            {...register('password', { required: 'Password is required' })}
          />
          <button type="button" onClick={() => setShowPw(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0">
            {showPw ? <EyeOff size={14} color="#BDBDBD" /> : <Eye size={14} color="#BDBDBD" />}
          </button>
        </div>
      </Field>

      {/* API / Redux error */}
      {error && (
        <p className="text-[13px] text-[#E2462C] font-semibold bg-[#fff5f5] px-[14px] py-[10px] rounded-[5px] mb-4">{error}</p>
      )}

      <div className="flex items-center justify-between mb-5 text-[13px]">
        <label className="flex items-center gap-1.5 cursor-pointer text-[#737373] font-semibold">
          <input type="checkbox" className="accent-[#23A6F0]" /> Remember me
        </label>
        <button type="button" className="bg-transparent border-none cursor-pointer text-[#23A6F0] font-['Montserrat'] font-bold text-[13px]">
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || loading}
        className={`w-full flex items-center justify-center gap-2 text-white border-none rounded-[5px] py-[14px] font-['Montserrat'] font-bold text-[14px] mb-4 transition-colors ${
          isSubmitting || loading ? 'bg-[#9dd4f7] cursor-not-allowed' : 'bg-[#23A6F0] cursor-pointer hover:bg-[#1a8fd1]'
        }`}
      >
        {(isSubmitting || loading) && <Loader size={16} className="animate-spin" />}
        {isSubmitting || loading ? 'Signing in...' : 'Login'}
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

// ═══════════════════════════════════════════════════════════════════════════
// REGISTER FORM — real API call to POST /signup with roles + store fields
// ═══════════════════════════════════════════════════════════════════════════
function RegisterForm({ onSwitch }) {
  const history = useHistory();
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role_id: '',
      store: { name: '', phone: '', tax_no: '', bank_account: '' },
    },
  });

  const watchedRoleId = watch('role_id');
  const watchedPassword = watch('password');

  // Clear server error on any field change
  useEffect(() => {
    const sub = watch(() => { if (serverError) setServerError(''); });
    return () => sub.unsubscribe();
  }, [watch, serverError]);

  // Fetch roles on mount
  useEffect(() => {
    axiosInstance
      .get('/roles')
      .then((res) => {
        const data = res.data;
        setRoles(data);
        const customer = data.find(
          r => r.code?.toLowerCase() === 'customer' ||
               r.name?.toLowerCase() === 'customer' ||
               r.name?.toLowerCase() === 'müşteri'
        );
        if (customer) setValue('role_id', String(customer.id));
        else if (data.length) setValue('role_id', String(data[0].id));
      })
      .catch(() => {
        setRolesError(true);
        toast.error('Could not load roles. Please refresh.');
      })
      .finally(() => setRolesLoading(false));
  }, [setValue]);

  const selectedRole = roles.find(r => String(r.id) === String(watchedRoleId));
  const isStore =
    selectedRole?.code?.toLowerCase() === 'store' ||
    selectedRole?.name?.toLowerCase() === 'store' ||
    selectedRole?.name?.toLowerCase() === 'mağaza';

  const onSubmit = async (data) => {
    setServerError('');
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      role_id: Number(data.role_id),
    };
    if (isStore) {
      payload.store = {
        name: data.store.name,
        phone: data.store.phone,
        tax_no: data.store.tax_no,
        bank_account: data.store.bank_account,
      };
    }
    try {
      await axiosInstance.post('/signup', payload);
      toast.success('You need to click link in email to activate your account!', { autoClose: 6000 });
      history.goBack();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Something went wrong. Please try again.';
      setServerError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="text-center mb-6">
        <h2 className="font-bold text-[22px] text-[#252B42] mb-1.5">Create Account</h2>
        <p className="text-[14px] text-[#737373]">Join Bandage today</p>
      </div>

      {/* Name */}
      <Field label="Full Name" error={errors.name}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2"><User size={14} color="#BDBDBD" /></span>
          <input type="text" placeholder="John Doe" className={`${inputCls} pl-10`}
            {...register('name', {
              required: 'Name is required',
              minLength: { value: 3, message: 'Name must be at least 3 characters' },
            })} />
        </div>
      </Field>

      {/* Email */}
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

      {/* Password */}
      <Field label="Password" error={errors.password}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2"><Lock size={14} color="#BDBDBD" /></span>
          <input type={showPassword ? 'text' : 'password'}
            placeholder="Min 8 chars, upper, lower, number, special"
            className={`${inputCls} pl-10 pr-10`}
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

      {/* Confirm Password */}
      <Field label="Confirm Password" error={errors.confirmPassword}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2"><Lock size={14} color="#BDBDBD" /></span>
          <input type={showConfirm ? 'text' : 'password'}
            placeholder="Repeat your password" className={`${inputCls} pl-10 pr-10`}
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

      {/* Role */}
      <Field label="Role" error={errors.role_id}>
        {rolesLoading ? (
          <div className="flex items-center gap-2 text-[#737373] text-[14px] py-2">
            <Loader size={14} className="animate-spin" /> Loading roles...
          </div>
        ) : rolesError ? (
          <div className="flex items-center gap-2 text-[#E2462C] text-[13px] font-semibold bg-[#fff5f5] border border-[#E2462C] rounded-[5px] px-4 py-3">
            Could not load roles.{' '}
            <button type="button" onClick={() => window.location.reload()}
              className="underline bg-transparent border-none cursor-pointer text-[#E2462C] font-semibold text-[13px] p-0">
              Refresh
            </button>
          </div>
        ) : (
          <select className={`${inputCls} cursor-pointer`}
            {...register('role_id', { required: 'Please select a role' })}>
            <option value="" disabled>Select a role</option>
            {roles.map(role => (
              <option key={role.id} value={String(role.id)}>{role.name}</option>
            ))}
          </select>
        )}
      </Field>

      {/* Store fields — appear when Store role is selected */}
      {isStore && (
        <div className="flex flex-col gap-4 border border-[#E8E8E8] rounded-[8px] p-4 bg-[#FAFAFA] mb-4">
          <p className="font-bold text-[13px] text-[#252B42] m-0 uppercase tracking-wide">Store Details</p>

          <Field label="Store Name" error={errors.store?.name}>
            <input type="text" placeholder="Your store name" className={inputCls}
              {...register('store.name', {
                required: 'Store name is required',
                minLength: { value: 3, message: 'At least 3 characters' },
              })} />
          </Field>

          <Field label="Store Phone (05XXXXXXXXX)" error={errors.store?.phone}>
            <input type="tel" placeholder="05XXXXXXXXX" className={inputCls}
              {...register('store.phone', {
                required: 'Phone number is required',
                pattern: { value: TR_PHONE_REGEX, message: 'Must be a valid Türkiye number (05XXXXXXXXX)' },
              })} />
          </Field>

          <Field label="Store Tax ID (TXXXXVXXXXXX)" error={errors.store?.tax_no}>
            <input type="text" placeholder="TXXXXVXXXXXX" className={inputCls}
              {...register('store.tax_no', {
                required: 'Tax ID is required',
                pattern: { value: TAX_NO_REGEX, message: 'Pattern: T + 4 digits + V + 6 digits' },
              })} />
          </Field>

          <Field label="Store IBAN (TR + 24 digits)" error={errors.store?.bank_account}>
            <input type="text" placeholder="TR000000000000000000000000" className={inputCls}
              {...register('store.bank_account', {
                required: 'IBAN is required',
                pattern: { value: IBAN_REGEX, message: 'Must be a valid Turkish IBAN (TR + 24 digits)' },
              })} />
          </Field>
        </div>
      )}

      {/* Server error */}
      {serverError && (
        <div className="bg-[#fff5f5] border border-[#E2462C] rounded-[5px] px-4 py-3 mb-4">
          <p className="text-[13px] text-[#E2462C] font-semibold m-0">{serverError}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || rolesLoading || rolesError}
        className={`w-full flex items-center justify-center gap-2 text-white border-none rounded-[5px] py-[14px] font-['Montserrat'] font-bold text-[14px] mb-4 transition-colors ${
          isSubmitting || rolesLoading || rolesError
            ? 'bg-[#9dd4f7] cursor-not-allowed'
            : 'bg-[#23A6F0] cursor-pointer hover:bg-[#1a8fd1]'
        }`}
      >
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
