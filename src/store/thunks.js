import axiosInstance from '../api/axiosInstance';
import { setRoles } from './clientReducer';

// ─────────────────────────────────────────────────────────────────────────────
// fetchRoles — thunk action creator
// Fetches roles from the API and stores them in the client reducer.
// Should ONLY be dispatched when roles are not yet loaded (NOT_FETCHED / empty).
//
// Usage (call this wherever roles are first needed, e.g. SignupPage):
//   dispatch(fetchRolesIfNeeded())
// ─────────────────────────────────────────────────────────────────────────────
export const fetchRolesIfNeeded = () => async (dispatch, getState) => {
  const { roles } = getState().client;

  // Guard: skip if roles are already loaded
  if (roles && roles.length > 0) return;

  try {
    const res = await axiosInstance.get('/roles');
    dispatch(setRoles(res.data));
  } catch (err) {
    console.error('Failed to fetch roles:', err);
  }
};
