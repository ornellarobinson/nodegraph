export type NodeData = {
  id: string;
  name: string;
  // Single literal for now. When new node categories are needed, expand to a
  // discriminated union: 'Node' | 'Service' | 'Database'
  type: "Node";
};
