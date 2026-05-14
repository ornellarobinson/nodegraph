export function truncateLabel(name: string): string {
  return name.length > 30 ? name.slice(0, 27) + "…" : name;
}
