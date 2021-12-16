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

export async function fetchWikidataCheeses(): Promise<Array<Cheese>> {
  const query = `
  SELECT DISTINCT ?cheese ?cheeseLabel ?cheeseImage ?country ?countryLabel ?countryImage ?source ?sourceLabel WHERE {
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    {
      SELECT DISTINCT ?cheese ?cheeseImage ?country ?countryImage ?source WHERE {
        ?cheese p:P279 ?s0.
        ?s0 (ps:P279/(wdt:P279*)) wd:Q10943.
        ?cheese p:P495 ?s1.
        ?s1 (ps:P495/(wdt:P279*)) ?country.
        ?cheese wdt:P186 ?source.
        OPTIONAL { ?country wdt:P41 ?countryImage. }.
        OPTIONAL { ?cheese wdt:P18 ?cheeseImage. }.
      }
    }
  }`
  const results: any = await fetchFromSparqlEndpoint(query, 'https://query.wikidata.org/sparql')
  let cheeses: Array<Cheese> = []
  results.results.bindings.forEach(cheese => {
    if (isNaN(cheese.cheeseLabel.value.substr(1)) && isNaN(cheese.sourceLabel.value.substr(1))) {
      const new_cheese: Cheese = {
        link: Url.tryFromString(cheese.cheese.value),
        label: cheese.cheeseLabel.value,
        country: {
          name: cheese.countryLabel ? cheese.countryLabel.value : undefined,
          link: cheese.country ? Url.tryFromString(cheese.country.value) : undefined,
          thumbnail: cheese.countryImage ? Url.tryFromString(cheese.countryImage.value) : undefined,
        },
        source: cheese.sourceLabel ? cheese.sourceLabel.value : undefined,
        thumbnail: cheese.cheeseImage ? Url.tryFromString(cheese.cheeseImage.value) : undefined,
      };
      cheeses.push(new_cheese)
    }
  });
  return (cheeses)
}