import axios from 'axios';

export async function getArticles() {
  try {
    const response = await axios.get('/api/articles');
    if (!response.ok) throw response;
    return response.data;
  } catch (err) {
    throw err;
  }
}
