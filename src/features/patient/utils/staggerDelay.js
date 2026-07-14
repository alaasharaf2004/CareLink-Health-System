export function staggerDelay(index, step = 0.07, base = 0.04) {
  return `${base + index * step}s`;
}
