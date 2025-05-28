export function formatValibotPath(path: unknown[] = []): string {
  return (
    path
      .map((item) => {
        if (typeof item === 'string' || typeof item === 'number')
          return String(item);
        if (typeof item === 'object' && item !== null && 'key' in item) {
          return String((item as any).key);
        }
        return '[unknown]';
      })
      .join('.') || '(root)'
  );
}
