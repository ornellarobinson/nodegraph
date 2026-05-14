import { Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import type { NodeData, LinkData } from "@/types/index";
import { colors } from "@/theme/tokens";
import IdentitySection from "@/components/properties/IdentitySection";
import LinksSection from "@/components/properties/LinksSection";

type Props = {
  node: NodeData;
  nodes: NodeData[];
  links: LinkData[];
  onClose: () => void;
  onUpdateName: (id: string, name: string) => void;
  onAddLink: (from: string, to: string) => void;
  onSelect: (id: string) => void;
  autoFocusName?: boolean;
};

export default function PropertiesPanel({
  node,
  nodes,
  links,
  onClose,
  onUpdateName,
  onAddLink,
  onSelect,
  autoFocusName,
}: Props) {
  const avatarLetter = node.name.charAt(0).toUpperCase();

  return (
    <Box
      sx={{
        width: 300,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "background.paper",
        borderLeft: `1px solid ${colors.border}`,
        overflowY: "auto",
      }}
    >
      <Box sx={{ px: 2.5, pt: 2, pb: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            sx={{
              color: colors.primary,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
            }}
          >
            Properties
          </Typography>
          <IconButton
            size="small"
            aria-label="Close"
            onClick={onClose}
            sx={{
              color: "text.disabled",
              "&:hover": { color: "text.primary" },
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              bgcolor: colors.surfaceAvatar,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: "white" }}>
              {avatarLetter}
            </Typography>
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                color: "text.primary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {node.name}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "text.secondary" }}>{node.id}</Typography>
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ borderColor: "divider" }} />
      <IdentitySection
        key={node.id}
        node={node}
        nodes={nodes}
        onUpdateName={onUpdateName}
        autoFocus={autoFocusName}
      />

      <Divider sx={{ borderColor: "divider" }} />
      <LinksSection
        node={node}
        nodes={nodes}
        links={links}
        onAddLink={onAddLink}
        onSelect={onSelect}
      />
    </Box>
  );
}
