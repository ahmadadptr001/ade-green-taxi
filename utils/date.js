export function formatDate(isoDate) {
   const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return '';
    return `${d.getDate()} ${d.toLocaleString('en-US', {
      month: 'short',
    })} ${d.getFullYear()}`;
}