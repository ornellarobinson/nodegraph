export const MAX_NAME_LENGTH = 25;

export type NameValidation = { isValid: boolean; error: string | null };

export function validateNodeName(name: string): NameValidation {
  if (!name.trim()) return { isValid: false, error: "Name can't be empty." };
  if (name.length >= MAX_NAME_LENGTH)
    return { isValid: false, error: "Max 25 characters reached." };
  return { isValid: true, error: null };
}
