import * as go from "gojs";

export const ZOOM_PADDING = 400;
const FREE_POSITION_SPACING = 120;
const FREE_POSITION_RINGS = 6;

export function zoomToNode(diagram: go.Diagram, nodeId: string, duration?: number): void {
  const found = diagram.findNodeForKey(nodeId);

  if (!found) return;

  const bounds = found.actualBounds;

  if (bounds.width === 0) {
    requestAnimationFrame(() => zoomToNode(diagram, nodeId, duration));
    return;
  }

  smoothZoomToRect(
    diagram,
    new go.Rect(
      bounds.x - ZOOM_PADDING,
      bounds.y - ZOOM_PADDING,
      bounds.width + ZOOM_PADDING * 2,
      bounds.height + ZOOM_PADDING * 2,
    ),
    duration,
  );
}

export function smoothZoomToRect(diagram: go.Diagram, rect: go.Rect, duration = 550): void {
  const vb = diagram.viewportBounds;
  const canvasW = vb.width * diagram.scale;
  const canvasH = vb.height * diagram.scale;
  const targetScale = Math.min(canvasW / rect.width, canvasH / rect.height);
  const targetPos = new go.Point(
    rect.centerX - canvasW / (2 * targetScale),
    rect.centerY - canvasH / (2 * targetScale),
  );
  const anim = new go.Animation();

  anim.duration = duration;
  anim.add(diagram, "scale", diagram.scale, targetScale);
  anim.add(diagram, "position", diagram.position.copy(), targetPos);
  anim.start();
}

export function findFreePosition(diagram: go.Diagram, center: go.Point): go.Point {
  const positions: go.Point[] = [center];

  for (let ring = 1; ring <= FREE_POSITION_RINGS; ring++) {
    const count = ring * 6;

    for (let index = 0; index < count; index++) {
      const angle = (index / count) * 2 * Math.PI;

      positions.push(
        new go.Point(
          center.x + Math.cos(angle) * ring * FREE_POSITION_SPACING,
          center.y + Math.sin(angle) * ring * FREE_POSITION_SPACING,
        ),
      );
    }
  }

  for (const candidate of positions) {
    let isFree = true;

    diagram.nodes.each((node) => {
      if (!isFree) return;

      const bounds = node.actualBounds;
      const cx = bounds.width > 0 ? bounds.centerX : node.location.x;
      const cy = bounds.width > 0 ? bounds.centerY : node.location.y;

      if (Math.hypot(cx - candidate.x, cy - candidate.y) < FREE_POSITION_SPACING * 0.8)
        isFree = false;
    });
    if (isFree) return candidate;
  }

  return center;
}
