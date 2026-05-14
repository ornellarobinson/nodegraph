import React, { useState } from "react";

import { Box, Stack, TextField, Typography } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import type { NodeData } from "@/types/index";
import { validateNodeName } from "@/utils/validateNodeName";
import { colors } from "@/theme/tokens";

type Props = {
  node: NodeData;
  nodes: NodeData[];
  onUpdateName: (id: string, name: string) => void;
  autoFocus?: boolean;
};

export default function IdentitySection({ node, nodes, onUpdateName, autoFocus }: Props) {
  const [localName, setLocalName] = useState(node.name);

  const isDuplicateName = nodes.some(
    (other) => other.id !== node.id && other.name.toLowerCase() === localName.trim().toLowerCase(),
  );

  return (
    <Box sx={{ px: 2.5, py: 2 }}>
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.8px",
          textTransform: "uppercase",
          color: colors.textCaption,
          mb: 1.5,
        }}
      >
        Identity
      </Typography>
      <Stack spacing={1.5}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <TextField
            value={localName}
            onChange={(e) => {
              const val = e.target.value;

              setLocalName(val);
              if (val.trim()) onUpdateName(node.id, val.trim());
            }}
            onBlur={() => {
              if (!localName.trim()) setLocalName(node.name);
            }}
            label="Name"
            size="small"
            fullWidth
            autoFocus={autoFocus}
            error={!validateNodeName(localName).isValid}
            slotProps={{
              htmlInput: {
                maxLength: 25,
                onFocus: (e: React.FocusEvent<HTMLInputElement>) => e.currentTarget.select(),
              },
              inputLabel: { shrink: true, sx: { fontSize: 13 } },
            }}
            helperText={validateNodeName(localName).error ?? `${localName.length}/25`}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: 13,
                borderRadius: "8px",
                "&.Mui-focused fieldset": { borderColor: "primary.main" },
              },
              "& .MuiOutlinedInput-notchedOutline legend": {
                paddingLeft: "8px",
                paddingRight: "8px",
              },
              "& .MuiFormHelperText-root": { fontSize: 10, color: "text.disabled", mt: 0.5 },
              "& .MuiFormHelperText-root.Mui-error": { color: "error.main" },
            }}
          />
          {isDuplicateName && validateNodeName(localName).isValid && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.25,
                py: 0.75,
                borderRadius: "8px",
                bgcolor: "warning.light",
                opacity: 0.9,
              }}
            >
              <WarningAmberRoundedIcon sx={{ fontSize: 13, color: "white", flexShrink: 0 }} />
              <Typography sx={{ fontSize: 11, color: "white", fontWeight: 500, lineHeight: 1.4 }}>
                Another node already uses this name.
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 0.5 }}
        >
          <Typography sx={{ fontSize: 12, color: colors.textCaption }}>Type</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: 13, color: "text.primary", fontWeight: 500 }}>
              {node.type}
            </Typography>
            {/* read-only until NodeData.type becomes a discriminated union — replace with a selector at that point */}
            <Box sx={{ px: 1.5, py: 0.5, bgcolor: colors.primaryBg, borderRadius: "999px" }}>
              <Typography sx={{ fontSize: 12, color: colors.primaryText, fontWeight: 700 }}>
                read-only
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 0.5 }}
        >
          <Typography sx={{ fontSize: 12, color: colors.textCaption }}>ID</Typography>
          <Typography sx={{ fontSize: 12, color: "text.primary", fontFamily: "monospace" }}>
            {node.id}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
