import { Button } from "@mui/material";
import type { SxProps } from "@mui/material";

import { colors, gradients, shadows } from "@/theme/tokens";

type Props = {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  sx?: SxProps;
  "aria-label"?: string;
};

export default function GradientButton({
  onClick,
  children,
  disabled,
  fullWidth,
  startIcon,
  sx,
  "aria-label": ariaLabel,
}: Props) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      startIcon={startIcon}
      aria-label={ariaLabel}
      variant="contained"
      sx={{
        background: gradients.cta,
        color: colors.primaryContrast,
        textTransform: "none",
        fontWeight: 600,
        fontSize: 16,
        borderRadius: "10px",
        boxShadow: shadows.button,
        "&:hover": { background: gradients.ctaHover },
        "&.Mui-disabled": {
          background: colors.surfaceSubtle,
          color: colors.textDisabled,
          boxShadow: "none",
          border: `1px solid ${colors.border}`,
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
}
