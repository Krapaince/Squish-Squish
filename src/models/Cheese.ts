import { Country } from './Country'
import * as Url from '../services/Url'
import { Ontology } from './Ontology'

export interface FetchedCheese {
  link: URL
  label: String
  country: String
  source: String
  thumbnail?: URL
}

export interface Cheese {
  ontology: Ontology,
  link: URL
  label: String
  country: Country
  source: String
  thumbnail?: URL
}

export namespace NCheese {
  export function fromCountryAndFetchedCheese(country: Country, cheese: FetchedCheese): Cheese {
    return {
      ontology: Ontology.DBpedia,
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
  source: String
  query: String
}

export namespace NCheeseFilter {
  export function isFilter(filter: CheeseFilter, cheese: Cheese): boolean {
    const {country, source, query } = filter
    const b_region: boolean = country == cheese.country.name || country == 'All'
    const b_source: boolean = source.length == 0 || (cheese.source.toLowerCase().includes(source.toLowerCase()))
    const b_query: boolean = query.length == 0 || (query.length && cheese.label.startsWith(query))

    return b_region && b_source && b_query
  }

  export function computeNbResults(filter:CheeseFilter, cheeses: Array<Cheese>): Number {
    let nb_results = 0

    for (const cheese of cheeses) {
      if (isFilter(filter, cheese)) {
        nb_results += 1
      }
    }
    return nb_results
  }
}