export function normalizeText(value: string | undefined) {
  return (value ?? "")
    .toLowerCase()
    .replace(/\((.*?)\)/g, "")
    .replace(/[^a-z0-9]/g, "")
    .replace(/municipality|local|district|metropolitan|metro/g, "")
    .trim();
}

export function findBestMatch(query: string, options: string[]) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return undefined;

  let bestMatch: string | undefined;
  let bestScore = 0;

  for (const option of options) {
    const normalizedOption = normalizeText(option);
    if (!normalizedOption) continue;

    if (normalizedOption === normalizedQuery) {
      return option;
    }

    if (normalizedOption.includes(normalizedQuery) || normalizedQuery.includes(normalizedOption)) {
      return option;
    }

    const score = Array.from(new Set(normalizedQuery.split("").filter((char) => normalizedOption.includes(char)))).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = option;
    }
  }

  return bestMatch;
}
