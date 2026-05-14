import { createTheme } from "@mui/material/styles";
import { colors } from "./tokens";

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      dark: colors.primaryDark,
      light: colors.primaryBg,
      contrastText: colors.primaryContrast,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
      disabled: colors.textMuted,
    },
    divider: colors.border,
    background: {
      default: colors.canvas,
      paper: colors.surface,
    },
  },
  typography: {
    fontFamily: '"Be Vietnam Pro", sans-serif',
    h1: { fontFamily: '"Avantt TRIAL", "Be Vietnam Pro", sans-serif' },
    h2: { fontFamily: '"Avantt TRIAL", "Be Vietnam Pro", sans-serif' },
    h3: { fontFamily: '"Avantt TRIAL", "Be Vietnam Pro", sans-serif' },
    button: { fontFamily: '"Avantt TRIAL", "Be Vietnam Pro", sans-serif', textTransform: "none" },
  },
});

export default theme;
