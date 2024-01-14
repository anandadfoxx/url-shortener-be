function isKey<T extends object>(
  t: T,
  k: PropertyKey
): k is keyof T {
  return k in t;
}

export function isEmptyable<T extends object>(
  t: T,
  k: PropertyKey
): boolean {
  return isKey(t, k) && (t[k as keyof T] === undefined);
}

export function getObjectKeys<T extends object>(t: T): string[] {
  let keys: string[] = [];
  Object.keys(t).forEach((key) => {
    if (isKey(t, key))
      keys.push(key as string);
  });
  return keys;
}