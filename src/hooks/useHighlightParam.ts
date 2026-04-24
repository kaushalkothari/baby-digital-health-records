import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Scrolls to `document.getElementById(elementId)` when `?highlight=` matches `paramValue`,
 * applies a short ring highlight, then removes the query param (replace).
 */
export function useHighlightScroll(paramValue: string | null, elementId: string | null, ready: boolean) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!paramValue || !elementId || !ready) return;
    const el = document.getElementById(elementId);
    if (!el) return;

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'rounded-xl');

    const clear = window.setTimeout(() => {
      el.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'rounded-xl');
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete('highlight');
          return next;
        },
        { replace: true },
      );
    }, 2200);

    return () => {
      window.clearTimeout(clear);
      el.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'rounded-xl');
    };
  }, [paramValue, elementId, ready, setSearchParams]);
}
