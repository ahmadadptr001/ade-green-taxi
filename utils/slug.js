export function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")                     // pisahin huruf & aksen
    .replace(/[\u0300-\u036f]/g, "")      // hapus aksen
    .replace(/&/g, " dan ")               // opsional: ganti & jadi kata
    .replace(/[^a-z0-9]+/g, "-")          // selain huruf & angka jadi -
    .replace(/^-+|-+$/g, "")              // hapus - di awal/akhir
    .replace(/-+/g, "-");                 // hilangkan double -
}
