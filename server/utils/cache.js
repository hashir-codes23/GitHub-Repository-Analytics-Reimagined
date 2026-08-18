// Tiny in-memory TTL cache so we never hammer the GitHub API
// with duplicate requests.
const store = new Map();

export function cacheGet(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export function cacheSet(key, value, ttlMs = 5 * 60 * 1000) {
  store.set(key, { value, expires: Date.now() + ttlMs });
  if (store.size > 500) {
    store.delete(store.keys().next().value);
  }
}
