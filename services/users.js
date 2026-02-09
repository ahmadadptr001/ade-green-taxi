import axios from 'axios';

export async function getUsers() {
  const resp = await axios.get('/api/users');
  return resp.data;
}

export async function getCountsAllUser() {
  try {
    const response = await axios.get('/api/users/counts');
    if (!response.statusText) throw response;
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getCountsAllUserByActive() {
  try {
    const response = await axios.get('/api/users/counts/active');
    if (!response.statusText) throw response;
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getCountsAllUserBySuspended() {
  try {
    const response = await axios.get('/api/users/counts/suspended');
    if (!response.statusText) throw response;
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function updateRoleUser(id, role, email) {
  const response = await axios.post('/api/user/role/update', { id, role, email });
  return response.data;
}
export async function updateStatusUser(id, status, email) {
  const response = await axios.post('/api/user/status/update', { id, status, email });
  return response.data;
}
export async function deleteUser(id) {
  const response = await axios.post('/api/user/delete', { id });
  return response.data;
}
