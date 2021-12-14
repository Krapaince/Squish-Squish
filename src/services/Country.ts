import { Country } from '../models/Country'
import { fetchFromSparqlEndpoint } from './Sparql'
import { match } from 'ts-pattern'

export async function fetchCountriesName(raw_countries: Array<string>): Promise<Array<Country>> {
  const endpoint_url = 'http://dbpedia.org/'
  const countries_url: Array<string> = []

  raw_countries.forEach((value) => {
    if (value.startsWith(endpoint_url) && countries_url.includes(value) == false) {
      countries_url.push(value)
    }
  })
  countries_url.sort()

  const countries: Array<Country> = await Promise.all(
    countries_url.map((country) => fetchCountry(country).then((res) => res))
  ).then((res) => res)

  const all_countries: Array<Country> = []
  raw_countries.forEach((raw_country) => {
    const index = countries.findIndex((country) => country.link == raw_country)

    const country: Country = match<number, Country>(index)
      .with(-1, (): Country => {
        return match<boolean, Country>(raw_country.startsWith(endpoint_url))
          .with(true, (): Country => {
            return {
              name: raw_country.slice(raw_country.lastIndexOf('/') + 1),
              link: raw_country,
            }
          })
          .otherwise((): Country => {
            return {
              name: raw_country,
              link: undefined,
            }
          })
      })
      .otherwise((): Country => countries[index])
    all_countries.push(country)
  })
  console.log(all_countries)
  return all_countries
}

export async function fetchCountry(country_url: string): Promise<Country> {
  const query = `
    SELECT DISTINCT ?name ?thumbnail
      WHERE {
        { <${country_url}> dbp:commonName ?name . }
        UNION
        { <${country_url}> dbp:conventionalLongName ?name . }
        UNION
        { <${country_url}> dbp:name ?name . }
        UNION
        { <${country_url}> rdfs:label ?name . }.
        <${country_url}> rdf:type schema:Country.
        OPTIONAL {<${country_url}>  dbo:thumbnail ?thumbnail }.
        FILTER (lang(?name) = "en")
      }`
  const result: any = await fetchFromSparqlEndpoint(query)

  if (result.results.bindings.length == 0) {
    return {
      name: country_url.slice(country_url.lastIndexOf('/') + 1),
      link: country_url,
      thumbnail: undefined,
    }
  }
  return {
    name: result.results.bindings[0].name.value,
    link: country_url,
    thumbnail: result.results.bindings[0].thumbnail.value,
  }
}
