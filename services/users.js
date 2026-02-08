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