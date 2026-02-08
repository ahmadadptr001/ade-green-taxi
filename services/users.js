import axios from "axios"

export async function getUsers() {
  try {
    const resp = await axios.get('/api/users')
    if (resp?.statusText === 200) return resp.data;
    throw new Error(resp.data.message )
  } catch (err) {
    throw err
  }
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