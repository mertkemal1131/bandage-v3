// src/pages/SignupPage.jsx

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff, ChevronRight, Loader } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

// ─────────────────────────────────────────────────────────────────────────────
// Validation helpers
// ─────────────────────────────────────────────────────────────────────────────

// Turkish IBAN: TR + 24 digits → 26 chars total
const IBAN_REGEX = /^TR\d{24}$/;

// Turkish phone: 05XXXXXXXXX (11 digits starting with 05)
const TR_PHONE_REGEX = /^(05)\d{9}$/;

// Tax No: T + 4 digits + V + 6 digits → "TXXXXVXXXXXX"
const TAX_NO_REGEX = /^T\d{4}V\d{6}$/;

// Password: min 8 chars, at least one uppercase, one lowercase, one digit, one special char
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

// ─────────────────────────────────────────────────────────────────────────────
// Reusable field wrapper
// ─────────────────────────────────────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-bold text-[13px] text-[#252B42]">{label}</label>
      {children}
      {error && (
        <p className="text-[12px] text-[#E2462C] font-semibold">{error.message}</p>
      )}
    </div>
  );
}

const inputCls =
  "w-full border border-[#E8E8E8] rounded-[5px] py-3 px-4 text-[14px] font-['Montserrat'] outline-none text-[#252B42] bg-white transition-colors focus:border-[#23A6F0] box-border";

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function SignupPage() {
  const history = useHistory();
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState('');

  // ── react-hook-form setup ─────────────────────────────────────────────────
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
      store: {
        name: '',
        phone: '',
        tax_no: '',
        bank_account: '',
      },
    },
  });

  const watchedRoleId = watch('role_id');
  const watchedPassword = watch('password');

  // Clear server error when user starts editing any field
  useEffect(() => {
    const subscription = watch(() => {
      if (serverError) setServerError('');
    });
    return () => subscription.unsubscribe();
  }, [watch, serverError]);

  // ── Fetch roles on mount ──────────────────────────────────────────────────
  useEffect(() => {
    axiosInstance
      .get('/roles')
      .then((res) => {
        const fetchedRoles = res.data;
        setRoles(fetchedRoles);

        // FIX: pre-select "Customer" role — match by code (case-insensitive) first,
        // then fall back to name so Turkish ("Müşteri") and English ("Customer") both work
        const customerRole = fetchedRoles.find(
          (r) =>
            r.code?.toLowerCase() === 'customer' ||
            r.name?.toLowerCase() === 'customer' ||
            r.name?.toLowerCase() === 'müşteri'
        );
        if (customerRole) {
          setValue('role_id', String(customerRole.id));
        }
      })
      .catch(() => {
        setRolesError(true);
        toast.error('Could not load roles. Please refresh the page.');
      })
      .finally(() => setRolesLoading(false));
  }, [setValue]);

  // Derive selected role — check only by code (most reliable field)
  const selectedRole = roles.find((r) => String(r.id) === String(watchedRoleId));
  const isStore =
    selectedRole?.code?.toLowerCase() === 'store' ||
    selectedRole?.name?.toLowerCase() === 'store' ||
    selectedRole?.name?.toLowerCase() === 'mağaza';

  // ── Submit handler ────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    setServerError('');

    // Build payload — exact field names required by the API
    // POST https://workintech-fe-ecommerce.onrender.com/signup
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

      // FIX: use toast.success so the color feedback is clear,
      // but inform the user they still need to activate via email.
      toast.success(
        'Account created! Check your email and click the activation link to continue.',
        { autoClose: 6000 }
      );

      // FIX: redirect to /login instead of history.goBack() — goBack() can land the user
      // on an unexpected page (e.g. the home page mid-flow). Login is the correct next step.
      history.push('/login');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        'Something went wrong. Please try again.';
      setServerError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-['Montserrat']">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E8E8E8] py-4">
        <div className="max-w-[1050px] mx-auto px-6 flex items-center gap-2 font-bold text-[14px] text-[#737373]">
          <Link to="/" className="text-[#737373] no-underline hover:text-[#252B42]">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#252B42]">Sign Up</span>
        </div>
      </div>

      {/* Card */}
      <div className="flex items-center justify-center py-[60px] px-6">
        <div className="w-full max-w-[520px] bg-white rounded-lg border border-[#E8E8E8] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">

          {/* Header */}
          <div className="bg-[#23A6F0] px-8 py-6">
            <h1 className="font-bold text-[22px] text-white m-0">Create Account</h1>
            <p className="text-[14px] text-white/80 mt-1 m-0">
              Join Bandage — already have one?{' '}
              <Link to="/login" className="text-white underline font-bold">Sign in</Link>
            </p>
          </div>

          {/* FIX: noValidate prevents browser native validation from conflicting with RHF */}
          <form noValidate onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-5">

            {/* ── Name ── */}
            <Field label="Full Name" error={errors.name}>
              <input
                type="text"
                placeholder="John Doe"
                autoFocus
                className={inputCls}
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 3, message: 'Name must be at least 3 characters' },
                })}
              />
            </Field>

            {/* ── Email ── */}
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                placeholder="your@email.com"
                className={inputCls}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address',
                  },
                })}
              />
            </Field>

            {/* ── Password ── */}
            <Field label="Password" error={errors.password}>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 chars, upper, lower, number, special"
                  className={`${inputCls} pr-11`}
                  {...register('password', {
                    required: 'Password is required',
                    pattern: {
                      value: PASSWORD_REGEX,
                      message:
                        'Must be 8+ chars with uppercase, lowercase, number & special character',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0"
                >
                  {showPassword ? <EyeOff size={16} color="#BDBDBD" /> : <Eye size={16} color="#BDBDBD" />}
                </button>
              </div>
            </Field>

            {/* ── Confirm Password ── */}
            <Field label="Confirm Password" error={errors.confirmPassword}>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  className={`${inputCls} pr-11`}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === watchedPassword || 'Passwords do not match',
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0"
                >
                  {showConfirm ? <EyeOff size={16} color="#BDBDBD" /> : <Eye size={16} color="#BDBDBD" />}
                </button>
              </div>
            </Field>

            {/* ── Role ── */}
            <Field label="Role" error={errors.role_id}>
              {rolesLoading ? (
                <div className="flex items-center gap-2 text-[#737373] text-[14px]">
                  <Loader size={14} className="animate-spin" /> Loading roles...
                </div>
              ) : rolesError ? (
                // FIX: show a clear error state when roles fail to load instead of an empty select
                <div className="flex items-center gap-2 text-[#E2462C] text-[13px] font-semibold bg-[#fff5f5] border border-[#E2462C] rounded-[5px] px-4 py-3">
                  Could not load roles.{' '}
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="underline bg-transparent border-none cursor-pointer text-[#E2462C] font-['Montserrat'] font-semibold text-[13px] p-0"
                  >
                    Refresh
                  </button>
                </div>
              ) : (
                <select
                  className={`${inputCls} cursor-pointer`}
                  {...register('role_id', { required: 'Please select a role' })}
                >
                  <option value="" disabled>Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={String(role.id)}>
                      {role.name}
                    </option>
                  ))}
                </select>
              )}
            </Field>

            {/* ── Store fields — shown only when "Store" role is selected ── */}
            {isStore && (
              <div className="flex flex-col gap-5 border border-[#E8E8E8] rounded-[8px] p-5 bg-[#FAFAFA]">
                <p className="font-bold text-[14px] text-[#252B42] m-0">Store Details</p>

                {/* Store Name */}
                <Field label="Store Name" error={errors.store?.name}>
                  <input
                    type="text"
                    placeholder="Your store name"
                    className={inputCls}
                    {...register('store.name', {
                      required: 'Store name is required',
                      minLength: { value: 3, message: 'Store name must be at least 3 characters' },
                    })}
                  />
                </Field>

                {/* Store Phone */}
                <Field label="Store Phone" error={errors.store?.phone}>
                  <input
                    type="tel"
                    placeholder="05XXXXXXXXX"
                    className={inputCls}
                    {...register('store.phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: TR_PHONE_REGEX,
                        message: 'Must be a valid Türkiye phone number (05XXXXXXXXX)',
                      },
                    })}
                  />
                </Field>

                {/* Store Tax ID */}
                <Field label="Store Tax ID" error={errors.store?.tax_no}>
                  <input
                    type="text"
                    placeholder="TXXXXVXXXXXX"
                    className={inputCls}
                    {...register('store.tax_no', {
                      required: 'Tax ID is required',
                      pattern: {
                        value: TAX_NO_REGEX,
                        message: 'Must match the pattern TXXXXVXXXXXX (T + 4 digits + V + 6 digits)',
                      },
                    })}
                  />
                </Field>

                {/* Store Bank Account (IBAN) */}
                <Field label="Store Bank Account (IBAN)" error={errors.store?.bank_account}>
                  <input
                    type="text"
                    placeholder="TR + 24 digits"
                    className={inputCls}
                    {...register('store.bank_account', {
                      required: 'IBAN is required',
                      pattern: {
                        value: IBAN_REGEX,
                        message: 'Must be a valid Turkish IBAN (TR + 24 digits)',
                      },
                    })}
                  />
                </Field>
              </div>
            )}

            {/* ── Server error ── */}
            {serverError && (
              <div className="bg-[#fff5f5] border border-[#E2462C] rounded-[5px] px-4 py-3">
                <p className="text-[13px] text-[#E2462C] font-semibold m-0">{serverError}</p>
              </div>
            )}

            {/* ── Submit ── */}
            {/* FIX: also disabled while rolesLoading — user can't submit without a valid role_id */}
            <button
              type="submit"
              disabled={isSubmitting || rolesLoading || rolesError}
              className={`w-full flex items-center justify-center gap-2 text-white border-none rounded-[5px] py-[14px] font-bold text-[14px] transition-colors ${
                isSubmitting || rolesLoading || rolesError
                  ? 'bg-[#9dd4f7] cursor-not-allowed'
                  : 'bg-[#23A6F0] cursor-pointer hover:bg-[#1a8fd1]'
              }`}
            >
              {isSubmitting && <Loader size={16} className="animate-spin" />}
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="text-center text-[13px] text-[#737373] m-0">
              Already have an account?{' '}
              <Link to="/login" className="text-[#23A6F0] font-bold no-underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
