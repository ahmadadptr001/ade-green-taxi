import axios from 'axios';

export async function getViewsAllArticle() {
  try {
    const response = await axios.get('/api/articles/views');
    if (!response.statusText) throw response;
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getCountsAllArticle() {
  try {
    const response = await axios.get('/api/articles/counts');
    if (!response.statusText) throw response;
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getArticles() {
  const response = await axios.get('/api/articles');
  if (!response.statusText) throw response;
  return response.data;
}

export async function updateViewArticle(view, slug) {
  try {
    const response = await axios.post('/api/article/update/view', {
      view,
      slug,
    });
    if (!response.statusText) throw response;
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getCategories() {
    const response = await axios.get('/api/articles/categories');
    return response.data;
}

export async function getTags() {
    const response = await axios.get('/api/articles/tags');
    return response.data;
}

export async function getTopics() {
    const response = await axios.get('/api/articles/topics');
    return response.data;
}

export async function getArticlesByCategorySlug(slug) {
    const response = await axios.get('/api/articles/category/' + slug);
    return response.data;
}
export async function getArticlesByTagSlug(slug) {
  try {
    const response = await axios.get('/api/articles/tag/' + slug);
    if (!response.statusText) throw response;
    return response.data;
  } catch (err) {
    throw err;
  }
}
export async function getArticlesByTopicSlug(slug) {
  try {
    const response = await axios.get('/api/articles/topic/' + slug);
    if (!response.statusText) throw response;
    return response.data;
  } catch (err) {
    throw err;
  }
}
