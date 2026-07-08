import raw from './climate.json'
import type { ClimateData, CountryClimate } from './types'

export const climateData: ClimateData = raw as ClimateData

export function getCountryClimate(
  data: ClimateData,
  iso: string | null | undefined,
): CountryClimate | null {
  if (!iso) return null
  return data[iso.toUpperCase()] ?? null
}
