import { useRef, useState, useCallback, useLayoutEffect, useEffect, memo } from "react";
import { Box, Typography } from "@mui/material";

import type { NodeData } from "@/types/index";
import { colors } from "@/theme/tokens";

const ROW_HEIGHT = 56;
const OVERSCAN = 5;

type Props = {
  nodes: NodeData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  linkCountMap?: Map<string, number>;
};

function NodeList({ nodes, selectedId, onSelect, linkCountMap }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(400);

  useLayoutEffect(() => {
    const el = containerRef.current;

    if (!el) return;

    const observer = new ResizeObserver(() => setContainerHeight(el.clientHeight));

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!selectedId || !containerRef.current) return;
    const index = nodes.findIndex((node) => node.id === selectedId);

    if (index === -1) return;

    const itemTop = index * ROW_HEIGHT;
    const itemBottom = itemTop + ROW_HEIGHT;
    const { scrollTop, clientHeight } = containerRef.current;

    if (itemTop < scrollTop || itemBottom > scrollTop + clientHeight) {
      containerRef.current.scrollTo({
        top: itemTop - clientHeight / 2 + ROW_HEIGHT / 2,
        behavior: "smooth",
      });
    }
  }, [selectedId]);

  const onScroll = useCallback(() => {
    setScrollTop(containerRef.current?.scrollTop ?? 0);
  }, []);

  const totalHeight = nodes.length * ROW_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  const endIndex = Math.min(
    nodes.length - 1,
    Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + OVERSCAN,
  );

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      role="listbox"
      aria-label="Node list"
      style={{ overflowY: "auto", flex: 1, minHeight: 0 }}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ position: "absolute", top: startIndex * ROW_HEIGHT, width: "100%" }}>
          {nodes.slice(startIndex, endIndex + 1).map((node, i) => {
            const isSelected = node.id === selectedId;
            const linkCount = linkCountMap?.get(node.id) ?? 0;

            return (
              <Box
                key={node.id}
                role="option"
                aria-selected={isSelected}
                aria-posinset={startIndex + i + 1}
                aria-setsize={nodes.length}
                tabIndex={0}
                onClick={() => onSelect(node.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(node.id);
                  }
                }}
                sx={{
                  height: ROW_HEIGHT,
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                  gap: 1.5,
                  cursor: "pointer",
                  bgcolor: isSelected ? "primary.light" : "transparent",
                  borderLeft: `2px solid ${isSelected ? colors.primary : "transparent"}`,
                  "&:hover": { bgcolor: isSelected ? "primary.light" : colors.surfaceSubtle },
                  transition: "background 0.1s",
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    flexShrink: 0,
                    bgcolor: isSelected ? "primary.main" : "text.secondary",
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 500,
                      lineHeight: 1.3,
                      color: isSelected ? colors.primaryText : "text.primary",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {node.name}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "text.secondary", lineHeight: 1.3 }}>
                    {node.id}
                  </Typography>
                </Box>
                {linkCount > 0 && (
                  <Typography sx={{ fontSize: 11, color: "text.disabled", flexShrink: 0 }}>
                    {linkCount} link{linkCount !== 1 ? "s" : ""}
                  </Typography>
                )}
              </Box>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(NodeList);
