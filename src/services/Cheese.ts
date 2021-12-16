import { Cheese, FetchedCheese, NCheese } from '../models/Cheese'
import { Country } from '../models/Country'
import { fetchFromSparqlEndpoint } from './Sparql'
import { match } from 'ts-pattern'
import * as Url from './Url'

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
        link: new URL(binding.cheese.value),
        label: binding.label.value,
        country: binding.country.value,
        source: binding.source.value,
        thumbnail: Url.tryFromString(thumbnail),
      }
    })
    .sort(function compareFn(elem1: FetchedCheese, elem2: FetchedCheese) {
      return elem1.label.localeCompare(elem2.label)
    })
}

export function mapCountryToCheese(fetched_cheeses: Array<FetchedCheese>, countries: Array<Country>) {
  const cheeses: Array<Cheese> = []

  for (const fetched_cheese of fetched_cheeses) {
    const index = countries.findIndex((country) => {
      const url = Url.tryFromString(fetched_cheese.country)

      if (url == undefined) {
        return fetched_cheese.country == country.name
      } else {
        return fetched_cheese.country == country.link?.toString()
      }
    })

    const cheese: Cheese = match<number, Cheese>(index)
      .with(-1, (): Cheese => {
        let country_url = Url.tryFromString(fetched_cheese.country)
        let country = match(country_url != undefined)
          .with(true, (): Country => {
            return {
              name: fetched_cheese.country.slice(fetched_cheese.country.lastIndexOf('/') + 1),
              link: country_url,
            }
          })
          .otherwise((): Country => {
            return {
              name: fetched_cheese.country,
              link: undefined,
            }
          })
        return NCheese.fromCountryAndFetchedCheese(country, fetched_cheese)
      })
      .otherwise((): Cheese => NCheese.fromCountryAndFetchedCheese(countries[index], fetched_cheese))
    cheeses.push(cheese)
  }
  return cheeses
}