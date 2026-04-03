import axiosInstance from '../api/axiosInstance';
import { setRoles, setUser } from './clientReducer';
import { toast } from 'react-toastify';

// ─────────────────────────────────────────────────────────────────────────────
// fetchRolesIfNeeded — thunk action creator
// Fetches roles from the API and stores them in the client reducer.
// Should ONLY be dispatched when roles are not yet loaded (NOT_FETCHED / empty).
// ─────────────────────────────────────────────────────────────────────────────
export const fetchRolesIfNeeded = () => async (dispatch, getState) => {
  const { roles } = getState().client;
  if (roles && roles.length > 0) return;

  try {
    const res = await axiosInstance.get('/roles');
    dispatch(setRoles(res.data));
  } catch (err) {
    console.error('Failed to fetch roles:', err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// loginUser — thunk action creator
//
// Flow:
//  1. POST /login with { email, password }
//  2. Always set the token in axios header (no Bearer prefix per spec)
//     so the current session is authenticated regardless of rememberMe
//  3. Only write to localStorage when rememberMe === true
//     (unchecked → clear localStorage so next app-load starts as guest)
//  4. Dispatch setUser → success toast → redirect
//  5. On failure → error toast, stay on /login
// ─────────────────────────────────────────────────────────────────────────────
export const loginUser = (email, password, rememberMe, history) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.post('/login', { email, password });

    console.log('[loginUser] API response:', data);
    console.log('[loginUser] rememberMe:', rememberMe, '| token:', data?.token);

    const { token, ...user } = data;

    // Always authenticate the current session — no Bearer prefix
    axiosInstance.defaults.headers.common['Authorization'] = token;

    // Persist only when "Remember me" is checked
    if (rememberMe) {
      localStorage.setItem('token', token);
      console.log('[loginUser] Token saved to localStorage ✅');
    } else {
      localStorage.removeItem('token');
      console.log('[loginUser] rememberMe=false → token NOT saved to localStorage');
    }

    dispatch(setUser(user));
    toast.success(`Welcome back, ${user.name || email}!`);

    // Redirect to the previous page, or home if there is no history
    if (history.length > 2) {
      history.goBack();
    } else {
      history.push('/');
    }
  } catch (err) {
    const raw = err?.response?.data?.message ?? err?.response?.data;
    const msg = typeof raw === 'string' ? raw : 'Invalid email or password.';
    toast.error(msg);
    // Do NOT navigate — keep user on login page
  }
};