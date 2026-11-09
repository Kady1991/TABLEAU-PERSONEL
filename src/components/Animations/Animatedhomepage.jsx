import { Children, useEffect, useState } from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";
import { fadeSlideUp } from "./HomeAnimations";

// ── Apparition en fondu + glissement vers le haut ─────────────────────────────
export function FadeSlideIn({ children, delay = 0, duration = 600, sx }) {
  return (
    <Box
      sx={{
        height: "100%",
        animation: `${fadeSlideUp} ${duration}ms ease ${delay}ms both`,
        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
FadeSlideIn.propTypes = {
  children: PropTypes.node,
  delay: PropTypes.number,
  duration: PropTypes.number,
  sx: PropTypes.object,
};

// ── Nombre qui s'incrémente jusqu'à sa valeur ─────────────────────────────────
export function AnimatedNumber({ value, delay = 0, duration = 1000, format }) {
  const isString = typeof value === "string";
  const target = isString
    ? parseFloat(value.replace(/[^\d.,-]/g, "").replace(",", ".")) || 0
    : Number(value) || 0;
  const suffix = isString && value.includes("%") ? "%" : "";

  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf;
    let start = null;
    const timeout = setTimeout(() => {
      const step = (ts) => {
        if (start === null) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(target * eased);
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [target, delay, duration]);

  const rounded = Math.round(display);
  return (
    <>
      {format ? format(rounded) : rounded}
      {suffix}
    </>
  );
}
AnimatedNumber.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  delay: PropTypes.number,
  duration: PropTypes.number,
  format: PropTypes.func,
};

// ── Fait apparaître les enfants les uns après les autres ──────────────────────
export function StaggerChildren({ children, baseDelay = 0, step = 100, sx }) {
  return (
    <Box sx={sx}>
      {Children.map(children, (child, i) => (
        <FadeSlideIn delay={baseDelay + i * step}>{child}</FadeSlideIn>
      ))}
    </Box>
  );
}
StaggerChildren.propTypes = {
  children: PropTypes.node,
  baseDelay: PropTypes.number,
  step: PropTypes.number,
  sx: PropTypes.object,
};