export function getApiBaseUrl() {
  const raw = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!raw) {
    return '';
  }

  const normalized = raw.replace(/\/$/, '');

  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    try {
      const target = new URL(normalized);
      const isLocalTarget = ['localhost', '127.0.0.1', '[::1]'].includes(target.hostname);
      const sameHost = window.location.hostname === target.hostname;
      if (isLocalTarget && !sameHost) {
        return '';
      }
    } catch (_error) {
      return normalized;
    }
  }

  return normalized;
}
