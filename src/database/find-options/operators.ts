export function Like<T>(value: T): {
  operator: string;
  value: T;
} {
  return { operator: 'LIKE', value };
}
