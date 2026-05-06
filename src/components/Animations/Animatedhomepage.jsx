import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";
import { useCountUp } from "./Compteur";

// ── 1. FadeSlideIn ─────────────────────────────────────────────────────────────
export function FadeSlideIn({
  children,
  delay = 0,
  duration = 400,
  distance = 16,
  sx = {},
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <Box
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${distance}px)`,
        transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

FadeSlideIn.propTypes = {
  children: PropTypes.node.isRequired,
  delay: PropTypes.number,
  duration: PropTypes.number,
  distance: PropTypes.number,
  sx: PropTypes.object,
};

// ── 2. AnimatedNumber ──────────────────────────────────────────────────────────
export function AnimatedNumber({
  value,
  duration = 1200,
  delay = 0,
  format,
}) {
  const [started, setStarted] = useState(false);

  const raw = String(value);
  const numMatch = raw.match(/[\d\s]+/);
  const numeric = numMatch
    ? parseInt(numMatch[0].replace(/\s/g, ""), 10)
    : 0;
  const suffix = raw.replace(/[\d\s]/g, "");

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const displayed = useCountUp(numeric, duration, started);

  const formatted = format
    ? format(displayed)
    : displayed.toLocaleString("fr-BE");

  return <>{`${formatted}${suffix}`}</>;
}

AnimatedNumber.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  duration: PropTypes.number,
  delay: PropTypes.number,
  format: PropTypes.func,
};

// ── 3. AnimatedBar ─────────────────────────────────────────────────────────────
export function AnimatedBar({
  width,
  color,
  delay = 0,
  duration = 800,
}) {
  const [w, setW] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setW(width), delay + 100);
    return () => clearTimeout(t);
  }, [width, delay]);

  return (
    <Box
      sx={{
        width: `${w}%`,
        height: "100%",
        background: color,
        borderRadius: 99,
        transition: `width ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      }}
    />
  );
}

AnimatedBar.propTypes = {
  width: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  delay: PropTypes.number,
  duration: PropTypes.number,
};

// ── 4. StaggerChildren ─────────────────────────────────────────────────────────
export function StaggerChildren({
  children,
  baseDelay = 100,
  step = 80,
  sx = {},
}) {
  const items = Array.isArray(children) ? children : [children];

  return (
    <Box sx={sx}>
      {items.map((child, i) => (
        <FadeSlideIn key={i} delay={baseDelay + i * step}>
          {child}
        </FadeSlideIn>
      ))}
    </Box>
  );
}

StaggerChildren.propTypes = {
  children: PropTypes.node.isRequired,
  baseDelay: PropTypes.number,
  step: PropTypes.number,
  sx: PropTypes.object,
};