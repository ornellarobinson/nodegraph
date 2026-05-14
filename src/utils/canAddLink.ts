import type { LinkData } from "@/types";

export function canAddLink(from: string, to: string, links: LinkData[]): boolean {
  if (from === to) return false;

  return !links.some((link) => link.from === from && link.to === to);
}
