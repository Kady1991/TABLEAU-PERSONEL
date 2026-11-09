import { keyframes } from "@mui/material/styles";

export const growBar = keyframes`
  from { transform: scaleY(0); }
  to   { transform: scaleY(1); }
`;

export const drawLine = keyframes`
  from { stroke-dashoffset: 1; }
  to   { stroke-dashoffset: 0; }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const drawDonut = keyframes`
  from { stroke-dasharray: 0 1000; }
`;

export const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const rowIn = keyframes`
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
`;

// Animation d'apparition d'une ligne de tableau
export const rowAnimation = (delay = 0) => ({
  animation: `${rowIn} 0.45s ease ${delay}s both`,
});