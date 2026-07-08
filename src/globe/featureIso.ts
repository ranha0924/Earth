function clean(v: unknown): string | null {
  if (typeof v !== 'string') return null
  const up = v.trim().toUpperCase()
  if (up === '' || up === '-99') return null
  return up
}

export function featureToIso(feature: unknown): string | null {
  if (!feature || typeof feature !== 'object') return null
  const props = (feature as { properties?: Record<string, unknown> }).properties
  if (!props) return null
  return clean(props.ISO_A2) ?? clean(props.ISO_A2_EH)
}
