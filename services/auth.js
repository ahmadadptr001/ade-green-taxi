import axios from 'axios';
import Swal from 'sweetalert2';
import { getAuthHeaders, getApiErrorMessage } from '@/lib/client-auth';

const base_url = process.env.NEXT_PUBLIC_URL_SEND_OTP;

export async function sendOTP(email) {
  try {
    const response = await axios.post(base_url, { email });
    if (response?.data.status === 200) return;
    throw new Error(`Gagal mengirim OTP : ${response?.data?.message || 'coba lagi nanti'}`);
  } catch (err) {
    throw err;
  }
}

export async function otpValidate(email, otp) {
  try {
    // Respons sukses memuat { success, token, data } — token dipakai
    // untuk melanjutkan reset password tanpa login ulang.
    const resp = await axios.post('/api/otp/validate', {email, code: otp})
    if (!resp.data.success) throw new Error(resp.data.message)
    return resp.data
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: getApiErrorMessage(err, 'OTP tidak valid')
    })
  }
}

export async function changePassword(id, newPassword) {
  const response = await axios.post(
    '/api/user/password/update',
    { id, newPassword },
    { headers: getAuthHeaders() }
  );
  return response.data
}

export async function changeUsername(id, newFullname) {
  const response = await axios.post(
    '/api/user/username/update',
    { id, newFullname },
    { headers: getAuthHeaders() }
  );
  return response.data
}

export async function login(email, password) {
  const payload = { email, password };
  try {
    const resp = await axios.post('/api/auth/login', payload);
    if (resp.status !== 200) throw new Error(resp.data.message);
    return resp.data; // { message, token, data }
  } catch (err) {
    throw err;
  }
}

export async function daftar(payload) {
  // role & status ditentukan server; client hanya mengirim data profil.
  const newPayload = {
    fullname: payload.name,
    email: payload.email,
    password: payload.password,
    phone: payload.whatsapp,
  };
  try {
    const resp = await axios.post('/api/auth/daftar', newPayload);
    if (resp.status !== 200) throw new Error(resp.data.message);
    return resp.data; // { message, token, data }
  } catch (err) {
    throw err;
  }
}

export async function emailCheck(email) {
  try {
    const resp = await axios.post('/api/auth/emails/check', { email });
    if (resp.status !== 200) throw new Error(resp.data.message);
    return resp.data;
  } catch (err) {
    throw err;
  }
}

export async function updateLoginHostory(id) {
  const resp = await axios.post(
    '/api/auth/activity',
    { id },
    { headers: getAuthHeaders() }
  )
  return resp.data
}
