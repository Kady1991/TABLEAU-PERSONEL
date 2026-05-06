import { useEffect, useRef, useState } from "react";

/**
 * Hook qui anime un nombre de 0 vers `target` en `duration` ms.
 * @param {number} target   - Valeur finale
 * @param {number} duration - Durée en ms (défaut 1200)
 * @param {boolean} start   - Déclenche l'animation quand true
 */
export function useCountUp(target, duration = 1200, start = true) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!start || target === 0) return;

    const startTime = performance.now();
    const startVal = 0;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing : easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(startVal + (target - startVal) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, start]);

  return value;
}