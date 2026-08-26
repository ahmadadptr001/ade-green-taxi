export function formatDate(isoDate) {
  // null/undefined/'' -> kosong (bukan epoch 1970)
  if (!isoDate) return '';
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getDate()} ${d.toLocaleString('en-US', {
    month: 'short',
  })} ${d.getFullYear()}`;
}
