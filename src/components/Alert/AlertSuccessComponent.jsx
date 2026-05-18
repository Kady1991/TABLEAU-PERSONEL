import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// ── Injection CSS globale (une seule fois) ────────────────────────────────────
const STYLE_ID = "alert-success-styles";
if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes asc-overlayIn  { from{opacity:0} to{opacity:1} }
    @keyframes asc-dropIn     { 0%{opacity:0;transform:translateY(-24px) scale(.95)} 70%{transform:translateY(4px) scale(1.01)} 100%{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes asc-circleFill { from{stroke-dashoffset:200} to{stroke-dashoffset:0} }
    @keyframes asc-personPop  { 0%{opacity:0;transform:scale(.3) translateY(10px)} 70%{opacity:1;transform:scale(1.1) translateY(-3px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes asc-checkDraw  { from{stroke-dashoffset:32} to{stroke-dashoffset:0} }
    @keyframes asc-fadeUp     { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes asc-chipPop    { 0%{opacity:0;transform:scale(.75)} 70%{transform:scale(1.08)} 100%{opacity:1;transform:scale(1)} }
    @keyframes asc-lineGrow   { from{width:0} to{width:100%} }
    @keyframes asc-subtleBob  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
    @keyframes asc-confetti   { 0%{opacity:1;transform:translateY(0) rotate(var(--r0))} 100%{opacity:0;transform:translateY(120px) rotate(var(--r1))} }

    .asc-overlay {
      position:fixed; inset:0; z-index:1400;
      display:flex; align-items:center; justify-content:center;
      background:rgba(0,0,0,0.45);
      animation: asc-overlayIn .25s ease both;
    }
    .asc-card {
      width:360px; background:#fff;
      border:0.5px solid rgba(0,0,0,0.10); border-radius:16px;
      padding:28px 24px 22px;
      display:flex; flex-direction:column; align-items:center;
      position:relative; overflow:hidden;
      animation: asc-dropIn .5s cubic-bezier(.22,1,.36,1) both;
    }
    .asc-svg-wrap {
      position:relative; width:84px; height:84px; margin-bottom:16px;
      animation: asc-subtleBob 2.5s ease-in-out 1.2s infinite;
    }
    .asc-arc {
      fill:none; stroke:#1D9E75; stroke-width:3; stroke-linecap:round;
      stroke-dasharray:200; stroke-dashoffset:200;
      transform-origin:42px 42px; transform:rotate(-90deg);
      animation: asc-circleFill .7s cubic-bezier(.22,1,.36,1) .25s forwards;
    }
    .asc-head {
      fill:#085041; opacity:0;
      transform-origin:42px 31px;
      animation: asc-personPop .45s cubic-bezier(.22,1,.36,1) .85s both;
    }
    .asc-body {
      fill:#085041; opacity:0;
      transform-origin:42px 55px;
      animation: asc-personPop .45s cubic-bezier(.22,1,.36,1) .95s both;
    }
    .asc-check {
      fill:none; stroke:#fff; stroke-width:2.5;
      stroke-linecap:round; stroke-linejoin:round;
      stroke-dasharray:32; stroke-dashoffset:32;
      animation: asc-checkDraw .35s ease 1.15s forwards;
    }
    .asc-badge {
      position:absolute; bottom:-2px; right:-2px;
      width:24px; height:24px; border-radius:50%;
      background:#1D9E75; border:2.5px solid #fff;
      display:flex; align-items:center; justify-content:center;
    }
    .asc-title {
      font-size:17px; font-weight:500; color:#111;
      margin:0 0 5px; text-align:center; font-family:inherit;
      opacity:0; animation: asc-fadeUp .35s ease 1.1s both;
    }
    .asc-sub {
      font-size:12px; color:#6b7280; line-height:1.5;
      margin:0 0 18px; text-align:center; font-family:inherit;
      opacity:0; animation: asc-fadeUp .35s ease 1.2s both;
    }
    .asc-sep {
      align-self:stretch; height:.5px; background:rgba(0,0,0,0.1);
      margin-bottom:16px; width:0;
      animation: asc-lineGrow .4s ease 1.25s both;
    }
    .asc-chips {
      display:flex; gap:8px; flex-wrap:wrap;
      justify-content:center; margin-bottom:20px;
    }
    .asc-chip {
      font-size:11px; font-weight:500; padding:5px 13px;
      border-radius:20px; font-family:inherit;
      opacity:0; animation: asc-chipPop .4s cubic-bezier(.22,1,.36,1) both;
    }
    .asc-actions {
      display:flex; gap:8px; width:100%;
      opacity:0; animation: asc-fadeUp .35s ease 1.7s both;
    }
    .asc-btn-p {
      flex:1; padding:9px 0; border-radius:10px;
      font-size:13px; font-weight:500; cursor:pointer;
      background:#003B68; color:#fff; border:none; font-family:inherit;
      transition:background .2s ease;
    }
    .asc-btn-p:hover { background:#002d52; }
    .asc-btn-s {
      padding:9px 16px; border-radius:10px; font-size:13px;
      cursor:pointer; background:transparent; color:#6b7280;
      border:0.5px solid rgba(0,0,0,0.18); font-family:inherit;
      transition:background .2s ease;
    }
    .asc-btn-s:hover { background:rgba(0,0,0,0.04); }
    .asc-conf { position:absolute; pointer-events:none; }
  `;
  document.head.appendChild(s);
}

// ── Confetti ──────────────────────────────────────────────────────────────────
const CONF_COLORS = ["#1D9E75", "#5594b1", "#7F77DD", "#0C447C", "#085041", "#02B2AF"];

function spawnConfetti(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  for (let i = 0; i < 44; i++) {
    const el  = document.createElement("div");
    el.className = "asc-conf";
    const w     = 5 + Math.random() * 7;
    const h     = Math.random() > 0.5 ? w : w * 2.2;
    const r0    = Math.random() * 360;
    const r1    = r0 + 200 + Math.random() * 160;
    const x     = 8 + Math.random() * 84;
    const delay = Math.random() * 0.55;
    const dur   = 0.9 + Math.random() * 0.55;
    el.style.cssText = `
      width:${w}px; height:${h}px;
      left:${x}%; top:-10px;
      background:${CONF_COLORS[i % CONF_COLORS.length]};
      border-radius:${Math.random() > 0.5 ? "50%" : "2px"};
      --r0:${r0}deg; --r1:${r1}deg;
      animation: asc-confetti ${dur}s ease ${delay}s both;
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), (delay + dur + 0.15) * 1000);
  }
}

// ── Composant ─────────────────────────────────────────────────────────────────
export default function AlertSuccessComponent({
  open,
  onClose,
  nom               = "",
  prenom            = "",
  service           = "",
  departement       = "",
  IDPersonneService = null,
}) {
  const navigate = useNavigate();
  const CONF_ID  = "asc-confetti-wrap";

  const triggerConfetti = useCallback(() => {
    setTimeout(() => spawnConfetti(CONF_ID), 380);
  }, []);

  useEffect(() => {
    if (open) triggerConfetti();
  }, [open, triggerConfetti]);

  if (!open) return null;

  const nomComplet = `${nom.toUpperCase()} ${prenom}`.trim();

  const chips = [
    { label: "Nouveau membre", bg: "#E1F5EE", color: "#085041", delay: "1.35s" },
    service     && { label: service,     bg: "#E6F1FB", color: "#0C447C", delay: "1.48s" },
    departement && { label: departement, bg: "#EEEDFE", color: "#3C3489", delay: "1.61s" },
  ].filter(Boolean);

  const handleVoirFiche = () => {
    if (IDPersonneService) navigate(`/personnels/${IDPersonneService}`);
    onClose();
  };

  return (
    <div className="asc-overlay" onClick={onClose}>
      <div
        className="asc-card"
        id={CONF_ID}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Cercle SVG + bonhomme ── */}
        <div className="asc-svg-wrap">
          <svg width="84" height="84" viewBox="0 0 84 84">
            <circle fill="#E1F5EE" cx="42" cy="42" r="38" />
            <circle className="asc-arc"  cx="42" cy="42" r="32" />
            <circle className="asc-head" cx="42" cy="31" r="9"  />
            <path   className="asc-body" d="M24,63 Q24,47 42,47 Q60,47 60,63 Z" />
          </svg>
          <div className="asc-badge">
            <svg width="12" height="12" viewBox="0 0 12 12">
              <polyline className="asc-check" points="2,6 5,9.5 10,2.5" />
            </svg>
          </div>
        </div>

        {/* ── Titre ── */}
        <p className="asc-title">{nomComplet} ajouté !</p>

        <div className="asc-sep" />

        {/* ── Chips ── */}
        <div className="asc-chips">
          {chips.map(({ label, bg, color, delay }) => (
            <span
              key={label}
              className="asc-chip"
              style={{ background: bg, color, animationDelay: delay }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* ── Actions ── */}
        <div className="asc-actions">
          <button className="asc-btn-p" onClick={handleVoirFiche}>
            Voir la fiche
          </button>
          <button className="asc-btn-s" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

AlertSuccessComponent.propTypes = {
  open:              PropTypes.bool.isRequired,
  onClose:           PropTypes.func.isRequired,
  nom:               PropTypes.string,
  prenom:            PropTypes.string,
  service:           PropTypes.string,
  departement:       PropTypes.string,
  IDPersonneService: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};