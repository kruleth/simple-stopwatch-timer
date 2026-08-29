type ClassValue = string | false | null | undefined;

/** Joins class names, dropping falsy entries. Keeps conditional styling readable. */
export const cn = (...values: ClassValue[]) => values.filter(Boolean).join(' ');
