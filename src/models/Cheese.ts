import { Country } from './Country'
import * as Url from '../services/Url'

export interface FetchedCheese {
  link: URL
  label: string
  country: string
  source: string
  thumbnail?: URL
}

export interface Cheese {
  link: URL
  label: string
  country: Country
  source: string
  thumbnail?: URL
}

export namespace NCheese {

  export function fromCountryAndFetchedCheese(country: Country, cheese: FetchedCheese): Cheese {
    return {
      link: cheese.link,
      label: cheese.label,
      country: country,
      source: cheese.source,
      thumbnail: Url.tryFromString(cheese.thumbnail)
    }
  }
}

export interface CheeseFilter {
  country: String
}