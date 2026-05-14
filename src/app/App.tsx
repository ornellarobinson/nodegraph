import { useState, useCallback, lazy, Suspense } from "react";
import { Box, Drawer, IconButton, Typography, useMediaQuery } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";

import SidePanel from "@/components/sidepanel/SidePanel";
import PropertiesPanel from "@/components/properties/PropertiesPanel";
import GradientButton from "@/components/ui/GradientButton";
import { colors, shadows } from "@/theme/tokens";

const DiagramCanva = lazy(() => import("@/features/diagram/DiagramCanva"));
import { useGraphState } from "./hooks/useGraphState";

function App() {
  const {
    nodes,
    links,
    selectedNodeId,
    setSelectedNodeId,
    selectedNode,
    addNode,
    addLink,
    updateNodeName,
    lastAddedNodeId,
  } = useGraphState();

  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const isTablet = useMediaQuery("(min-width: 768px)");
  const isDesktop = useMediaQuery("(min-width: 1100px)");

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedNodeId(id);
      if (!isTablet) setIsLeftOpen(false);
    },
    [isTablet, setSelectedNodeId],
  );

  const handleDiagramSelect = useCallback(
    (id: string | null) => {
      if (id === null && !isDesktop) return;
      setSelectedNodeId(id);
    },
    [isDesktop, setSelectedNodeId],
  );

  const sidePanel = (
    <SidePanel
      nodes={nodes}
      links={links}
      selectedNodeId={selectedNodeId}
      onSelect={handleSelect}
    />
  );

  const propertiesPanel = selectedNode && (
    <PropertiesPanel
      node={selectedNode}
      nodes={nodes}
      links={links}
      onClose={() => setSelectedNodeId(null)}
      onUpdateName={updateNodeName}
      onAddLink={addLink}
      onSelect={setSelectedNodeId}
      autoFocusName={selectedNodeId === lastAddedNodeId}
    />
  );

  return (
    <main style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/*
        Layout tiers:
          mobile  (<768px)   — both panels as drawers
          tablet  (768–1099) — node list inline; properties as right drawer
          desktop (≥1100px)  — both panels inline on the left, canvas fills the rest
      */}
      {isTablet ? (
        <>
          {sidePanel}
          {isDesktop &&
            (selectedNode ? (
              propertiesPanel
            ) : (
              <Box
                sx={{
                  width: 300,
                  height: "100vh",
                  flexShrink: 0,
                  bgcolor: "background.paper",
                  borderLeft: `1px solid ${colors.border}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: `2px solid ${colors.border}`,
                    bgcolor: colors.surfaceSubtle,
                  }}
                />
                <Box sx={{ textAlign: "center", px: 3 }}>
                  <Typography
                    sx={{ fontSize: 13, fontWeight: 500, color: "text.secondary", mb: 0.5 }}
                  >
                    Select a node
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "text.disabled", lineHeight: 1.6 }}>
                    Click a node in the list or on the canvas to view its properties
                  </Typography>
                </Box>
              </Box>
            ))}
        </>
      ) : (
        <Drawer
          open={isLeftOpen}
          onClose={() => setIsLeftOpen(false)}
          slotProps={{ paper: { sx: { border: "none" } } }}
        >
          {sidePanel}
        </Drawer>
      )}

      {/* Properties drawer — tablet only (desktop renders it inline above) */}
      {!isDesktop && (
        <Drawer
          anchor="right"
          open={!!selectedNode}
          onClose={() => setSelectedNodeId(null)}
          slotProps={{ paper: { sx: { border: "none" } } }}
        >
          {propertiesPanel}
        </Drawer>
      )}

      {/* Canvas */}
      <div style={{ flex: 1, position: "relative", minWidth: 0 }}>
        <Suspense
          fallback={<div style={{ width: "100%", height: "100%", background: colors.canvas }} />}
        >
          <DiagramCanva
            nodes={nodes}
            links={links}
            selectedNodeId={selectedNodeId}
            onSelectionChange={handleDiagramSelect}
            onAddLink={addLink}
          />
        </Suspense>

        {!isTablet && (
          <IconButton
            aria-label="Open navigation"
            onClick={() => setIsLeftOpen(true)}
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              zIndex: 10,
              bgcolor: "background.paper",
              boxShadow: shadows.overlay,
              "&:hover": { bgcolor: colors.surfaceSubtle },
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
        )}

        <GradientButton
          aria-label={isTablet ? undefined : "Add new node"}
          onClick={addNode}
          startIcon={isTablet ? <AddIcon /> : undefined}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            minWidth: { xs: 40, md: "auto" },
            boxShadow: shadows.button,
            zIndex: 10,
          }}
        >
          {isTablet ? "New node" : <AddIcon />}
        </GradientButton>
      </div>
    </main>
  );
}

export default App;
