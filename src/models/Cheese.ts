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
      thumbnail: Url.tryFromString(cheese.thumbnail),
    }
  }
}

export interface CheeseFilter {
  country: String
  query: String
}

export namespace NCheeseFilter {
  export function isFilter(filter: CheeseFilter, cheese: Cheese): boolean {
    const region = filter.country == cheese.country.name || filter.country == 'All'
    const query = filter.query.length == 0 || (filter.query.length && cheese.label.startsWith(filter.query))

    return region && query
  }
}