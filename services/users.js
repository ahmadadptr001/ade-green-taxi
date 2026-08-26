import axios from 'axios';
import { getAuthHeaders, getApiErrorMessage } from '@/lib/client-auth';

export async function getUsers() {
  // Hanya admin/super admin — server memvalidasi token.
  const resp = await axios.get('/api/users', { headers: getAuthHeaders() });
  if (resp.status !== 200)
    throw new Error(getApiErrorMessage(resp.data?.message, 'Gagal mengambil pengguna'));
  return resp.data;
}

export async function getUserByEmail(email) {
  const resp = await axios.get('/api/user/' + email, { headers: getAuthHeaders() });
  if (resp.status !== 200)
    throw new Error(resp.data?.message || 'Gagal mengambil data pengguna');
  return resp.data;
}

export async function getCountsAllUser() {
  const response = await axios.get('/api/users/counts');
  return response.data;
}

export async function getCountsAllUserByActive() {
  const response = await axios.get('/api/users/counts/active');
  return response.data;
}

export async function getCountsAllUserBySuspended() {
  const response = await axios.get('/api/users/counts/suspended');
  return response.data;
}

export async function updateRoleUser(id, role, email) {
  const response = await axios.post(
    '/api/user/role/update',
    { id, role, email },
    { headers: getAuthHeaders() }
  );
  return response.data;
}

export async function updateStatusUser(id, status, email) {
  const response = await axios.post(
    '/api/user/status/update',
    { id, status, email },
    { headers: getAuthHeaders() }
  );
  return response.data;
}

export async function deleteUser(id) {
  const response = await axios.post(
    '/api/user/delete',
    { id },
    { headers: getAuthHeaders() }
  );
  return response.data;
}
