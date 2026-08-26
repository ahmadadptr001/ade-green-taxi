import axios from 'axios';

export function getAuthHeaders() {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Ambil pesan error yang ramah dari respons API / objek error / string. */
export function getApiErrorMessage(err, fallback = 'Terjadi kesalahan') {
  if (typeof err === 'string' && err) return err;
  return err?.response?.data?.message || err?.message || fallback;
}
