import { supabase_coolify } from '@/config/supabase';
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

export async function uploadMainImageArticle(file) {
  try {
    console.log('file debug: ', file);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `images/${fileName}`;

    const { data, error } = await supabase_coolify.storage
      .from('articles') //
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error.message);
      throw error;
    }

    // ambil public url
    const { data: publicData } = supabase_coolify.storage
      .from('articles')
      .getPublicUrl(data.path);

    return {
      message: 'Berhasil mengupload gambar utama berita',
      url: publicData.publicUrl,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function insertDataArticle(payload) {
  const response = await axios.post('/api/article/upload/data', { payload });
  if (!response.statusText) throw response;
  return response.data;
}

export async function insertDataTag(tags, article_id) {
  // tags = [..,...,...]
  const response = await axios.post('/api/articles/tag/upload/data', {
    tags,
    article_id,
  });
  if (!response.statusText) throw response;
  return response.data;
}
export async function insertDataArticleCategorie(categorie_id, article_id) {
  const response = await axios.post('/api/articles/category/upload/data', {
    categorie_id,
    artID: article_id,
  });
  if (!response.statusText) throw response;
  return response.data;
}

export async function insertDataArticleTopic(article_id, topic_id) {
  const response = await axios.post('/api/articles/topic/upload/data', {
    artID: article_id,
    topic_id,
  });
  if (!response.statusText) throw response;
  return response.data;
}

export async function updateViewArticle(view, slug) {
  const response = await axios.post('/api/article/update/view', {
    view,
    slug,
  });
  return response.data;
}

export async function updateIsLikeArticle(article_id, profile_id) {
  const response = await axios.post('/api/article/update/like', {
    article_id,
    profile_id,
  });
  return response.data;
}

export async function updateIsBookmarkedArticle(article_id, profile_id) {
  const response = await axios.post('/api/article/update/bookmark', {
    article_id,
    profile_id,
  });
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

export async function getHighlight() {
  try {
    const response = await axios.get('/api/articles/highlight/');
    if (!response.statusText) throw response;
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function addTag(name, slug) {
  const response = await axios.post('/api/articles/tag/add', {name, slug})
  return response.data
}
export async function removeTag(id) {
  const response = await axios.post('/api/articles/tag/remove', {id})
  return response.data
}
export async function addTopic(name, slug) {
  const response = await axios.post('/api/articles/topic/add', {name, slug})
  return response.data
}
export async function removeTopic(id) {
  const response = await axios.post('/api/articles/topic/remove', {id})
  return response.data
}
export async function addCategory(name, slug) {
  const response = await axios.post('/api/articles/category/add', {name, slug})
  return response.data
}
export async function removeCategory(id) {
  const response = await axios.post('/api/articles/category/remove', {id})
  return response.data
}

export async function updateContentArticle(id, content) {
  const response = await axios.post('/api/article/update/content', { id, content })
  return response.data;
}

export async function deleteArticle(id) {
  const response = await axios.post('/api/article/delete', { id })
  return response.data;
}