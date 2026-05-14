export const colors = {
  // Primary accent
  primary: "#2db0fc",
  primaryDark: "#3BAFD8",
  primaryBg: "#bae6ff",
  primaryContrast: "#ffffff",
  primaryText: "#1a7fa0",

  // CTA (gradient button)
  ctaFrom: "#EB7866",
  ctaTo: "#FFB05A",
  ctaFromHover: "#DC6E5E",
  ctaToHover: "#ECA058",

  // Liquid Sky (create link)
  liquidSky200: "#6fdeff",

  // Text hierarchy
  textPrimary: "#1a1a1a",
  textSecondary: "#767676",
  textCaption: "#8888aa",
  textMuted: "#b0b0b8",
  textDisabled: "#c0c0c8",

  // Surfaces
  surface: "#ffffff",
  surfaceSubtle: "#f5f5f8",
  surfaceBadge: "#f0f0f5",
  surfaceAvatar: "#1a1a2e",

  // Canvas
  canvas: "#e6f4fa",

  // Borders
  border: "#e8e8ec",
  borderHover: "#d0d0dc",

  // Diagram (GoJS — used outside MUI)
  diagramNodeFill: "rgba(60,60,60,0.22)",
  diagramNodeStroke: "rgba(60,60,60,0.3)",
  diagramNodeLabel: "#333333",
  diagramLink: "#2f55a1",
} as const;

export const gradients = {
  cta: `linear-gradient(135deg, ${colors.ctaFrom} 7.24%, ${colors.ctaTo} 180.3%)`,
  ctaHover: `linear-gradient(135deg, ${colors.ctaFromHover} 7.24%%, ${colors.ctaToHover} 180.3%)`,
  createLink: `linear-gradient(90deg, #32befc 0%, #82f0f0 48%)`,
  brandText: `linear-gradient(268deg, #82dcf0 22.51%, #32befc 44.01%)`,
} as const;

export const gradientText = {
  background: gradients.brandText,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  backgroundRepeat: "no-repeat",
} as const;

export const textures = {
  canvasDots: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='390' height='753' viewBox='0 0 390 753' fill='none'%3E%3Crect x='-413' width='1216' height='2936.8' fill='url(%23pattern0_1560_29477)'/%3E%3Cdefs%3E%3Cpattern id='pattern0_1560_29477' patternUnits='userSpaceOnUse' patternTransform='matrix(20.48 0 0 20.48 -413 0)' preserveAspectRatio='none' viewBox='0 0 128 128' width='1' height='1'%3E%3Cg id='pattern0_1560_29477_inner'%3E%3Ccircle cx='4' cy='4' r='4' fill='%2332BEFC'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3C/svg%3E")`,
} as const;

export const shadows = {
  card: "0 2px 8px rgba(0,0,0,0.08)",
  button: "0 2px 8px rgba(232,122,106,0.4)",
  overlay: "0 2px 8px rgba(0,0,0,0.12)",
  hintBg: "rgba(0,0,0,0.45)",
} as const;
