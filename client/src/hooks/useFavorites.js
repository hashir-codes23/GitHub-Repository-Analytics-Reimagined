import { useEffect, useState, useCallback } from 'react';

const KEY = 'devpulse_favorites';

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(read);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useCallback(
    (owner, repo) => favorites.some((f) => f.owner === owner && f.repo === repo),
    [favorites]
  );

  const toggleFavorite = useCallback((summary) => {
    let added = false;
    setFavorites((prev) => {
      const exists = prev.some((f) => f.owner === summary.owner && f.repo === summary.repo);
      added = !exists;
      return exists
        ? prev.filter((f) => !(f.owner === summary.owner && f.repo === summary.repo))
        : [{ ...summary, addedAt: new Date().toISOString() }, ...prev].slice(0, 24);
    });
    return added;
  }, []);

  const removeFavorite = useCallback((owner, repo) => {
    setFavorites((prev) => prev.filter((f) => !(f.owner === owner && f.repo === repo)));
  }, []);

  return { favorites, isFavorite, toggleFavorite, removeFavorite };
}
