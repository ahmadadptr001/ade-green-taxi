import axios from 'axios';
import Swal from 'sweetalert2';

const base_url = process.env.NEXT_PUBLIC_URL_SEND_OTP;

export async function sendOTP(email) {
  try {
    const response = await axios.post(base_url, { email });
    if (response?.data.status === 200) return;
    throw new Error('Gagal mengirim OTP : ', response.data.message);
  } catch (err) {
    throw err;
  }
}

export async function otpValidate(email, otp) {
  try {
    const resp = await axios.post('/api/otp/validate', {email, code: otp})
    if (!resp.data.success) throw new Error(resp.data.message)
    return resp.data
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: err.message
    })
  }
}

export async function changePassword(id, newPassword) {
  const response = await axios.post('/api/user/password/update', { id, newPassword });
  return response.data
}

export async function changeUsername(id, newFullname) {
  const response = await axios.post('/api/user/username/update', { id, newFullname });
  return response.data
}

export async function login(email, password) {
  const payload = {
    email,
    password,
  };
  try {
    const resp = await axios.post('/api/auth/login', payload);
    if (!resp.statusText === 200) throw resp.data.message;
    return resp.data;
  } catch (err) {
    throw err;
  }
}
export async function daftar(payload) {
  const newPayload = {
    fullname: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role,
    phone: payload.whatsapp,
    status: payload.status,
  };
  try {
    const resp = await axios.post('/api/auth/daftar', newPayload);
    if (!resp.statusText === 200) throw resp.data.message;
    return resp.data;
  } catch (err) {
    throw err;
  }
}

export async function emailCheck(email) {
  try {
    const resp = await axios.post('/api/auth/emails/check', { email });
    if (!resp.statusText === 200) return resp.data.message;
    return resp.data;
  } catch (err) {
    throw err;
  }
}
