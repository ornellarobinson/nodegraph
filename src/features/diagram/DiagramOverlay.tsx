import type { RefObject } from "react";
import { colors, shadows } from "@/theme/tokens";

type Props = {
  nodeCount: number;
  linkCount: number;
  overviewRef: RefObject<HTMLDivElement | null>;
};

export function DiagramOverlay({ nodeCount, linkCount, overviewRef }: Props) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 16,
          width: 200,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: 10,
          overflow: "hidden",
          boxShadow: shadows.card,
          zIndex: 10,
        }}
      >
        <div
          style={{
            padding: "5px 10px",
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.8px",
              color: "#5d5d78",
              textTransform: "uppercase",
            }}
          >
            Overview
          </span>
          <span
            style={{
              display: "block",
              fontSize: 10,
              color: "#626262",
              fontVariantNumeric: "tabular-nums",
              textAlign: "right",
            }}
          >
            {nodeCount} nodes · {linkCount} links
          </span>
        </div>
        <div ref={overviewRef} style={{ width: "100%", height: 110, background: colors.surface }} />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: "50%",
          transform: "translateX(-50%)",
          background: shadows.hintBg,
          color: colors.primaryContrast,
          borderRadius: 20,
          padding: "4px 14px",
          fontSize: 12,
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        Scroll to zoom · Drag to pan · Drag node border to link
      </div>
    </>
  );
}
