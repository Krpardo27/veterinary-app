

export const COLORS = {
  // Primarios - Teales
  primary: "#0F766E",
  primary_light: "#0d6b63",
  primary_bg: "#EAF4F1",
  primary_subtle: "#0F766E/10",

  // Secundarios - Verdes oscuros
  secondary: "#2a6a5d",
  secondary_bg: "#E8F4F0",

  // Acentos - Naranjo
  accent: "#e08b4f",
  accent_light: "#f09d5f",

  // Grises - Texto y bordes
  dark: "#1D3A35",
  darker: "#0F172A",
  text: "#5C6F68",
  text_light: "#5c6f68",
  text_muted: "#64748B",
  border: "#DCE8E2",
  border_light: "#E2E8E5",
  border_subtle: "#E7EFEB",

  // Fondos
  bg_light: "#F7FAF9",
  bg_white: "#FFFFFF",

  // Decorativos
  success: "#10b981",
  error: "#ef4444",
  warning: "#f59e0b",

  // Especiales
  overlay: "rgba(0, 0, 0, 0.3)",
} as const;

export const TYPOGRAPHY = {
  heading_xl: "text-4xl font-bold tracking-tight",
  heading_lg: "text-3xl font-bold tracking-tight",
  heading_md: "text-xl font-semibold",
  heading_sm: "text-lg font-semibold",

  body_lg: "text-lg leading-8",
  body_base: "text-base",
  body_sm: "text-sm",
  body_xs: "text-xs",

  label: "text-xs font-semibold uppercase tracking-widest",
} as const;

export const SPACING = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "2.5rem",
  "3xl": "3rem",
} as const;

export const SHADOWS = {
  sm: "shadow-sm",
  base: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  ring_sm: "ring-1",
  ring_md: "ring-2",
} as const;

export const ANIMATIONS = {
  transition_fast: "transition-all duration-300",
  transition_base: "transition-all duration-500",
  transition_slow: "transition-all duration-700",
  ease_out: "ease-out",
} as const;
