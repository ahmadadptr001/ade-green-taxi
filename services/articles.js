import axios from 'axios';

export async function getArticles() {
  try {
    const response = await axios.get('/api/articles');
    if (!response.statusText) throw response;
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getCategories() {
  try {
    const response = await axios.get('/api/articles/categories')
    if (!response.statusText) throw response;
    return response.data;
  } catch (err) {
    throw err
  }
}

export async function getTags() {
  try {
    const response = await axios.get('/api/articles/tags')
    if (!response.statusText) throw response;
    return response.data;
  } catch (err) {
    throw err
  }
}

export async function getTopics() {
  try {
    const response = await axios.get('/api/articles/topics')
    if (!response.statusText) throw response;
    return response.data;
  } catch (err) {
    throw err
  }
}

export async function getArticlesByCategorySlug(slug) {
  try {
    const response = await axios.get('/api/articles/category/'+slug);
    if (!response.statusText) throw response;
    return response.data;
  } catch (err) {
    throw err
  }
}
export async function getArticlesByTagSlug(slug) {
  try {
    const response = await axios.get('/api/articles/tag/'+slug);
    if (!response.statusText) throw response;
    return response.data;
  } catch (err) {
    throw err
  }
}
export async function getArticlesByTopicSlug(slug) {
  try {
    const response = await axios.get('/api/articles/topic/'+slug);
    if (!response.statusText) throw response;
    return response.data;
  } catch (err) {
    throw err
  }
}