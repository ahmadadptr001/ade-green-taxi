import axios from 'axios';
import { getAuthHeaders, getApiErrorMessage } from '@/lib/client-auth';

export async function getViewsAllArticle() {
  const response = await axios.get('/api/articles/views');
  return response.data;
}

export async function getCountsAllArticle() {
  const response = await axios.get('/api/articles/counts');
  return response.data;
}

export async function getArticles() {
  const response = await axios.get('/api/articles');
  return response.data;
}

export async function getArticlesByKeyword(keyword) {
  const response = await axios.get(
    '/api/articles/' + encodeURIComponent(keyword)
  );
  return response.data;
}

export async function uploadMainImageArticle(file) {
  try {
    // Upload lewat API server (validasi tipe & ukuran di sisi server),
    // bukan langsung ke storage dari browser.
    const formData = new FormData();
    formData.append('file', file);

    const resp = await axios.post('/api/article/upload/image', formData, {
      headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' },
    });
    if (resp.status !== 200)
      throw new Error(getApiErrorMessage(resp.data?.message, 'Gagal mengupload gambar utama berita'));

    return {
      message: resp.data.message,
      url: resp.data.url,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function insertDataArticle(payload) {
  const response = await axios.post(
    '/api/article/upload/data',
    { payload },
    { headers: getAuthHeaders() }
  );
  if (response.status !== 200)
    throw new Error(getApiErrorMessage(response.data?.message, 'Gagal menyimpan artikel'));
  return response.data;
}

export async function insertDataTag(tags, article_id) {
  // tags = [..,...,...]
  const response = await axios.post(
    '/api/articles/tag/upload/data',
    { tags, article_id },
    { headers: getAuthHeaders() }
  );
  if (response.status !== 200)
    throw new Error(getApiErrorMessage(response.data?.message, 'Gagal menautkan tag'));
  return response.data;
}

export async function insertDataArticleCategorie(categorie_id, article_id) {
  const response = await axios.post(
    '/api/articles/category/upload/data',
    { categorie_id, artID: article_id },
    { headers: getAuthHeaders() }
  );
  if (response.status !== 200)
    throw new Error(getApiErrorMessage(response.data?.message, 'Gagal menautkan kategori'));
  return response.data;
}

export async function insertDataArticleTopic(article_id, topic_id) {
  const response = await axios.post(
    '/api/articles/topic/upload/data',
    { artID: article_id, topic_id },
    { headers: getAuthHeaders() }
  );
  if (response.status !== 200)
    throw new Error(getApiErrorMessage(response.data?.message, 'Gagal menautkan topik'));
  return response.data;
}

export async function updateViewArticle(view, slug) {
  // View dihitung server-side; nilai view dari client tidak dipercaya.
  const response = await axios.post('/api/article/update/view', {
    view: null,
    slug,
  });
  return response.data;
}

export async function updateIsLikeArticle(article_id) {
  // Identitas like diambil server dari token sesi.
  const response = await axios.post(
    '/api/article/update/like',
    { article_id },
    { headers: getAuthHeaders() }
  );
  return response.data;
}

export async function updateIsBookmarkedArticle(article_id) {
  const response = await axios.post(
    '/api/article/update/bookmark',
    { article_id },
    { headers: getAuthHeaders() }
  );
  return response.data;
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
  const response = await axios.get('/api/articles/tag/' + slug);
  return response.data;
}
export async function getArticlesByTopicSlug(slug) {
  const response = await axios.get('/api/articles/topic/' + slug);
  return response.data;
}

export async function getHighlight() {
  const response = await axios.get('/api/articles/highlight/');
  return response.data;
}

export async function updateHighlightMessage(text) {
  const response = await axios.post(
    '/api/articles/highlight/update',
    { text },
    { headers: getAuthHeaders() }
  );
  if (response.status !== 200)
    throw new Error(getApiErrorMessage(response.data?.message, 'Gagal mempublikasikan'));
  return response.data;
}

export async function addTag(name, slug) {
  const response = await axios.post(
    '/api/articles/tag/add',
    { name, slug },
    { headers: getAuthHeaders() }
  );
  return response.data;
}
export async function removeTag(id) {
  const response = await axios.post(
    '/api/articles/tag/remove',
    { id },
    { headers: getAuthHeaders() }
  );
  return response.data;
}
export async function addTopic(name, slug) {
  const response = await axios.post(
    '/api/articles/topic/add',
    { name, slug },
    { headers: getAuthHeaders() }
  );
  return response.data;
}
export async function removeTopic(id) {
  const response = await axios.post(
    '/api/articles/topic/remove',
    { id },
    { headers: getAuthHeaders() }
  );
  return response.data;
}
export async function addCategory(name, slug) {
  const response = await axios.post(
    '/api/articles/category/add',
    { name, slug },
    { headers: getAuthHeaders() }
  );
  return response.data;
}
export async function removeCategory(id) {
  const response = await axios.post(
    '/api/articles/category/remove',
    { id },
    { headers: getAuthHeaders() }
  );
  return response.data;
}

export async function updateCategory(id, name, slug) {
  const response = await axios.post(
    '/api/articles/category/update',
    { id, name, slug },
    { headers: getAuthHeaders() }
  );
  return response.data;
}
export async function updateTag(id, name, slug) {
  const response = await axios.post(
    '/api/articles/tag/update',
    { id, name, slug },
    { headers: getAuthHeaders() }
  );
  return response.data;
}
export async function updateTopic(id, name, slug) {
  const response = await axios.post(
    '/api/articles/topic/update',
    { id, name, slug },
    { headers: getAuthHeaders() }
  );
  return response.data;
}

export async function updateContentArticle(id, content) {
  const response = await axios.post(
    '/api/article/update/content',
    { id, content },
    { headers: getAuthHeaders() }
  );
  return response.data;
}

export async function deleteArticle(id) {
  const response = await axios.post(
    '/api/article/delete',
    { id },
    { headers: getAuthHeaders() }
  );
  return response.data;
}
