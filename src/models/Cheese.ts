import { Country } from './Country'

export interface FetchedCheese {
  link: string
  label: string
  country: string
  source: string
  thumbnail: string
}

export interface Cheese {
  link: string
  label: string
  country: Country
  source: string
  thumbnail: string
}
