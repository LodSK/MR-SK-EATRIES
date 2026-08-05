import slugifyLib from "slugify";

export function slugify(text: string): string {
  return slugifyLib(text, { lower: true, strict: true });
}

/** Appends a short random suffix if the base slug is already taken. */
export async function uniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  const candidate = slugify(base);
  if (!(await exists(candidate))) return candidate;

  let suffix = 2;
  while (await exists(`${candidate}-${suffix}`)) {
    suffix += 1;
  }
  return `${candidate}-${suffix}`;
}
