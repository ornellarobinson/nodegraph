import * as go from "gojs";

import { colors } from "@/theme/tokens";
import { truncateLabel } from "@/utils/truncateLabel";

export function createNodeTemplate(): go.Node {
  return new go.Node("Auto", {
    fromLinkable: true,
    toLinkable: true,
    cursor: "pointer",
    selectionAdorned: false,
  })
    .add(
      new go.Shape("Ellipse")
        .bindObject("fill", "isSelected", (isSelected: boolean) =>
          isSelected ? colors.surfaceAvatar : colors.diagramNodeFill,
        )
        .bindObject("stroke", "isSelected", (isSelected: boolean) =>
          isSelected ? colors.primary : colors.diagramNodeStroke,
        )
        .bindObject("strokeWidth", "isSelected", (isSelected: boolean) => (isSelected ? 3 : 1)),
    )
    .add(
      new go.TextBlock({ margin: 10, font: "500 13px 'Be Vietnam Pro', sans-serif" })
        .bind("text", "name", truncateLabel)
        .bindObject("stroke", "isSelected", (isSelected: boolean) =>
          isSelected ? colors.primaryContrast : colors.diagramNodeLabel,
        ),
    );
}

export function createLinkTemplate(): go.Link {
  return new go.Link().add(
    new go.Shape()
      .bindObject("stroke", "isHighlighted", (isHighlighted: boolean) =>
        isHighlighted ? colors.primary : colors.diagramLink,
      )
      .bindObject("strokeWidth", "isHighlighted", (isHighlighted: boolean) =>
        isHighlighted ? 3.5 : 2,
      ),
  );
}
