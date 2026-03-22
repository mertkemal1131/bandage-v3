import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Mail, Lock, User, ChevronRight } from 'lucide-react';

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
                  mode === m ? 'bg-[#23A6F0] text-white' : 'bg-white text-[#737373]'
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

function FieldInput({ label, icon: Icon, type = 'text', value, onChange, placeholder }) {
  return (
    <div className="mb-4">
      <label className="block font-bold text-[13px] text-[#252B42] mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">
          <Icon size={14} color="#BDBDBD" />
        </span>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border border-[#E8E8E8] rounded-[5px] py-3 pl-10 pr-[14px] text-[14px] font-['Montserrat'] outline-none text-[#252B42] bg-white box-border transition-colors focus:border-[#23A6F0]"
        />
      </div>
    </div>
  );
}

function LoginForm({ onSwitch }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { loading, error } = useSelector(s => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return; }
    dispatch({ type: 'AUTH_LOADING' });
    setTimeout(() => {
      if (form.email === 'test@bandage.com' && form.password === 'password') {
        dispatch({ type: 'AUTH_SUCCESS', payload: { name: 'Test User', email: form.email } });
        toast.success('Welcome back!'); history.push('/');
      } else {
        dispatch({ type: 'AUTH_FAIL', payload: 'Invalid email or password' });
        toast.error('Invalid email or password');
      }
    }, 900);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-center mb-6">
        <h2 className="font-bold text-[22px] text-[#252B42] mb-1.5">Welcome Back</h2>
        <p className="text-[14px] text-[#737373]">Login to your Bandage account</p>
      </div>
      <FieldInput label="Email" icon={Mail} type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
      <div className="mb-4">
        <label className="block font-bold text-[13px] text-[#252B42] mb-1.5">Password</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2"><Lock size={14} color="#BDBDBD" /></span>
          <input
            type={showPw ? 'text' : 'password'}
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            placeholder="••••••••"
            className="w-full border border-[#E8E8E8] rounded-[5px] py-3 pl-10 pr-[40px] text-[14px] font-['Montserrat'] outline-none text-[#252B42] bg-white box-border transition-colors focus:border-[#23A6F0]"
          />
          <button
            type="button"
            onClick={() => setShowPw(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer"
          >
            {showPw ? <EyeOff size={14} color="#BDBDBD" /> : <Eye size={14} color="#BDBDBD" />}
          </button>
        </div>
      </div>
      {error && (
        <p className="text-[13px] text-[#E2462C] font-semibold bg-[#fff5f5] px-[14px] py-[10px] rounded-[5px] mb-[14px]">{error}</p>
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
        disabled={loading}
        className={`w-full text-white border-none rounded-[5px] py-[14px] font-['Montserrat'] font-bold text-[14px] mb-4 ${
          loading ? 'bg-[#9dd4f7] cursor-not-allowed' : 'bg-[#23A6F0] cursor-pointer'
        }`}
      >
        {loading ? 'Signing in...' : 'Login'}
      </button>
      <p className="text-center text-[13px] text-[#737373] mb-2">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitch} className="bg-transparent border-none cursor-pointer text-[#23A6F0] font-['Montserrat'] font-bold text-[13px]">
          Create one
        </button>
      </p>
      <p className="text-center text-[11px] text-[#BDBDBD]">Demo: test@bandage.com / password</p>
    </form>
  );
}

function RegisterForm({ onSwitch }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { loading } = useSelector(s => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill all fields'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    dispatch({ type: 'AUTH_LOADING' });
    setTimeout(() => {
      dispatch({ type: 'AUTH_SUCCESS', payload: { name: form.name, email: form.email } });
      toast.success('Account created! Welcome to Bandage 🎉'); history.push('/');
    }, 900);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-center mb-6">
        <h2 className="font-bold text-[22px] text-[#252B42] mb-1.5">Create Account</h2>
        <p className="text-[14px] text-[#737373]">Join Bandage today</p>
      </div>
      <FieldInput label="Full Name"        icon={User} placeholder="John Doe"          value={form.name}    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      <FieldInput label="Email"            icon={Mail} type="email" placeholder="your@email.com" value={form.email}   onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
      <FieldInput label="Password"         icon={Lock} type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
      <FieldInput label="Confirm Password" icon={Lock} type="password" placeholder="Repeat password"   value={form.confirm}  onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} />
      <button
        type="submit"
        disabled={loading}
        className={`w-full text-white border-none rounded-[5px] py-[14px] font-['Montserrat'] font-bold text-[14px] mb-4 ${
          loading ? 'bg-[#9dd4f7] cursor-not-allowed' : 'bg-[#23A6F0] cursor-pointer'
        }`}
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
      <p className="text-center text-[13px] text-[#737373]">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="bg-transparent border-none cursor-pointer text-[#23A6F0] font-['Montserrat'] font-bold text-[13px]">
          Sign in
        </button>
      </p>
    </form>
  );
}
