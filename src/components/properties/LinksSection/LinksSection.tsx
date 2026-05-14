import { useState, useEffect, useCallback } from "react";
import {
  Autocomplete,
  Box,
  Stack,
  TextField,
  Typography,
  createFilterOptions,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HubIcon from "@mui/icons-material/Hub";

import type { NodeData, LinkData } from "@/types/index";
import { getConnectedNodes } from "@/utils/getConnectedNodes";
import { getLinkableNodes } from "@/utils/getLinkableNodes";
import GradientButton from "@/components/ui/GradientButton";
import { colors } from "@/theme/tokens";

const filterOptions = createFilterOptions<NodeData>({
  limit: 8,
  stringify: (option) => `${option.name} ${option.id}`,
});

type Props = {
  node: NodeData;
  nodes: NodeData[];
  links: LinkData[];
  onAddLink: (from: string, to: string) => void;
  onSelect: (id: string) => void;
};

export default function LinksSection({ node, nodes, links, onAddLink, onSelect }: Props) {
  const [linkTargetId, setLinkTargetId] = useState("");

  useEffect(() => {
    setLinkTargetId("");
  }, [node.id]);

  const connectedNodes = getConnectedNodes(node.id, links, nodes);

  const handleCreateLink = useCallback(() => {
    onAddLink(node.id, linkTargetId);
    setLinkTargetId("");
  }, [node.id, linkTargetId, onAddLink]);

  return (
    <Box sx={{ px: 2.5, py: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.5 }}>
        <HubIcon sx={{ fontSize: 16, color: colors.primary }} />
        <Typography
          sx={{
            color: colors.primary,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.8px",
            textTransform: "uppercase",
          }}
        >
          Links ({connectedNodes.length})
        </Typography>
      </Box>

      {connectedNodes.length > 0 ? (
        <Stack spacing={0.5} sx={{ mb: 2 }}>
          {connectedNodes.map((connectedNode) => (
            <Box
              key={connectedNode.id}
              onClick={() => onSelect(connectedNode.id)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 1.5,
                py: 1,
                borderRadius: "8px",
                border: `1px solid ${colors.border}`,
                cursor: "pointer",
                "&:hover": {
                  bgcolor: colors.surfaceSubtle,
                  borderColor: colors.borderHover,
                },
                transition: "all 0.1s",
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "text.primary",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {connectedNode.name}
                </Typography>
                <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
                  {connectedNode.id}
                </Typography>
              </Box>
              <ArrowForwardIcon
                sx={{
                  fontSize: 14,
                  color: "text.disabled",
                  flexShrink: 0,
                  ml: 1,
                }}
              />
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography sx={{ fontSize: 12, color: "text.disabled", mb: 2 }}>No links yet.</Typography>
      )}

      <Stack spacing={1}>
        <Autocomplete
          options={getLinkableNodes(node.id, nodes, links)}
          getOptionLabel={(option) => option.name}
          value={nodes.find((other) => other.id === linkTargetId) ?? null}
          onChange={(_, selected) => {
            setLinkTargetId(selected?.id ?? "");
            if (selected) (document.activeElement as HTMLElement)?.blur();
          }}
          filterOptions={filterOptions}
          size="small"
          noOptionsText="No node found"
          renderOption={({ key, ...props }, option) => (
            <li key={key ?? option.id} {...props}>
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 500, color: "text.primary" }}>
                  {option.name}
                </Typography>
                <Typography sx={{ fontSize: 10, color: "text.secondary" }}>{option.id}</Typography>
              </Box>
            </li>
          )}
          slotProps={{
            paper: {
              sx: {
                "& .MuiAutocomplete-option": { alignItems: "flex-start" },
                "& .MuiAutocomplete-noOptions": { fontSize: 12 },
              },
            },
            popper: {
              placement: "top-start",
              modifiers: [{ name: "flip", enabled: false }],
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Type a name or ID…"
              size="small"
              helperText="Type to search among all nodes"
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: 12,
                  borderRadius: "8px",
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
                "& .MuiFormHelperText-root": { fontSize: 10, color: "text.disabled", mt: 0.5 },
              }}
            />
          )}
        />
        <GradientButton fullWidth disabled={!linkTargetId} onClick={handleCreateLink}>
          Create link
        </GradientButton>
      </Stack>
    </Box>
  );
}
