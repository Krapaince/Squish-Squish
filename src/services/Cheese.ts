import { Cheese, FetchedCheese } from '../models/Cheese'
import { Country } from '../models/Country'
import { fetchFromSparqlEndpoint } from './Sparql'
import { match } from 'ts-pattern'

export async function fetchCheesesInformation(): Promise<Array<FetchedCheese>> {
  const query = `
  SELECT DISTINCT ?cheese ?label ?country ?source ?thumbnail
    WHERE {
      ?cheese
        rdf:type dbo:Cheese ;
        rdfs:label ?label ;
        dbp:country ?country ;
        dbp:source ?source .
      OPTIONAL { ?cheese dbo:thumbnail ?thumbnail }.
      FILTER (lang(?label) = "en")
    }`
  const results: any = await fetchFromSparqlEndpoint(query)

  return results.results.bindings
    .map((binding: any) => {
      let thumbnail: String | undefined = match(binding.thumbnail === undefined)
        .with(false, (): String => binding.thumbnail.value)
        .otherwise((): undefined => undefined)

      return {
        link: binding.cheese.value,
        label: binding.label.value,
        country: binding.country.value,
        source: binding.source.value,
        thumbnail: thumbnail,
      }
    })
    .sort(function compareFn(elem1: FetchedCheese, elem2: FetchedCheese) {
      return elem1.label.localeCompare(elem2.label)
    })
}

export function toCheese(fetched_cheeses: Array<FetchedCheese>, countries: Array<Country>): Array<Cheese> {
  const cheeses: Array<Cheese> = []

  for (const [i, cheese] of fetched_cheeses.entries()) {
    cheeses.push({
      link: cheese.link,
      label: cheese.label,
      country: countries[i],
      source: cheese.source,
      thumbnail: cheese.thumbnail,
    })
  }
  return cheeses
}
