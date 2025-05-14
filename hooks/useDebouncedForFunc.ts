import { useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebouncedForFunc(effect: () => void, deps: any[], delay: number) {
  useEffect(() => {
    const handler = setTimeout(() => {
      effect();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
}
