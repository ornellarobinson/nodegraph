import { useState, useCallback, useMemo } from "react";
import { Box, Divider, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import CloseIcon from "@mui/icons-material/Close";
import type { NodeData, LinkData } from "@/types/index";
import NodeList from "@/features/nodes/NodeList";
import Logo from "@/components/ui/Logo";
import { filterNodes } from "@/utils/filterNodes";
import { colors, gradientText } from "@/theme/tokens";

type Props = {
  nodes: NodeData[];
  links: LinkData[];
  selectedNodeId: string | null;
  onSelect: (id: string) => void;
};

export default function SidePanel({ nodes, links, selectedNodeId, onSelect }: Props) {
  const [search, setSearch] = useState("");

  const linkCountMap = useMemo(() => {
    const map = new Map<string, number>();

    links.forEach((link) => {
      map.set(link.from, (map.get(link.from) ?? 0) + 1);
      map.set(link.to, (map.get(link.to) ?? 0) + 1);
    });
    return map;
  }, [links]);

  const filtered = useMemo(() => filterNodes(nodes, search), [nodes, search]);

  const handleSelect = useCallback((id: string) => onSelect(id), [onSelect]);

  return (
    <Box
      sx={{
        width: 280,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "background.paper",
        borderRight: `1px solid ${colors.border}`,
      }}
    >
      {/* Brand */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          pt: 2,
          pb: 1.5,
        }}
      >
        <Logo size={28} />
        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.06em",
            fontFamily: '"Avantt TRIAL", sans-serif',
            lineHeight: 1.5,
            ...gradientText,
          }}
        >
          Nodegraph
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "divider" }} />

      {/* Header */}
      <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            mb: 0.5,
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              color: colors.textCaption,
            }}
          >
            Nodes
          </Typography>
          <Typography sx={{ fontSize: 11, color: "text.disabled" }}>
            {filtered.length} of {nodes.length}
          </Typography>
        </Box>
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search nodes by name or id…"
          size="small"
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    aria-label="Clear search"
                    onClick={() => setSearch("")}
                    edge="end"
                    sx={{ color: "text.disabled", "&:hover": { color: "text.primary" } }}
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            },
            htmlInput: { "aria-label": "Search nodes by name or ID" },
          }}
          sx={{
            mt: 1,
            "& .MuiOutlinedInput-root": {
              fontSize: 12,
              borderRadius: "8px",
              bgcolor: colors.surfaceSubtle,
              "& fieldset": { border: "none" },
              "&:hover fieldset": { border: "none" },
              "&.Mui-focused fieldset": {
                border: `1px solid ${colors.primary}`,
              },
            },
          }}
        />
      </Box>

      <Divider sx={{ borderColor: "divider" }} />

      {filtered.length === 0 && search.trim() ? (
        <Box
          sx={{
            px: 2,
            pt: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <SearchOffIcon sx={{ fontSize: 28, color: "text.disabled" }} />
          <Typography sx={{ fontSize: 12, color: "primary.bg" }}>No node found.</Typography>
        </Box>
      ) : (
        <NodeList
          nodes={filtered}
          selectedId={selectedNodeId}
          onSelect={handleSelect}
          linkCountMap={linkCountMap}
        />
      )}
    </Box>
  );
}
