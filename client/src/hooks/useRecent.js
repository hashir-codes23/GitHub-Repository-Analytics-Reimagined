import { useEffect, useState, useCallback } from 'react';

const KEY = 'devpulse_recent';

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function useRecent() {
  const [recent, setRecent] = useState(read);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(recent));
  }, [recent]);

  const addRecent = useCallback((summary) => {
    setRecent((prev) =>
      [{ ...summary, viewedAt: new Date().toISOString() }, ...prev.filter((r) => !(r.owner === summary.owner && r.repo === summary.repo))].slice(0, 8)
    );
  }, []);

  const clearRecent = useCallback(() => setRecent([]), []);

  return { recent, addRecent, clearRecent };
}
