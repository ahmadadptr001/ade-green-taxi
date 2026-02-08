import axios from 'axios';

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

export async function login(email, password) {
  const payload = {
    email,
    password,
  };
  try {
    const resp = await axios.post('/api/auth/login', payload);
    if (!resp.statusText === 200) throw err;
  } catch (err) {
    throw err;
  }
}
