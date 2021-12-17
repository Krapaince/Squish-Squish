import { Country } from '../models/Country'
import { fetchFromSparqlEndpoint } from './Sparql'
import * as Url from './Url'
import { getSparqlEndpoint } from './Ontology'
import { Ontology } from '../models/Ontology'
import { mapCountryToCheese } from './Cheese'

export async function fetchDBpedoaCountries(raw_countries: Array<string>): Promise<Array<Country>> {
  const countries_url: Array<URL> = []

  await raw_countries.forEach((value) => {
    let country_url = Url.tryFromString(value)
    if (country_url != undefined) {
      let to_push = true

      for (const url of countries_url) {
        if (country_url.pathname == url.pathname) {
          to_push = false
          break
        }
      }
      if (to_push) {
        countries_url.push(country_url)
      }
    }
  })
  countries_url.sort()

  const countries: Array<Country> = await Promise.all(
    countries_url.map((country) => fetchCountry(country).then((res) => res)),
  ).then((res) => res)

  return countries
}

async function fetchCountry(country_url: URL): Promise<Country> {
  let raw_country_url = country_url.toString()
  const query = `
    SELECT DISTINCT ?name ?thumbnail
      WHERE {
        { <${raw_country_url}> dbp:commonName ?name . }
        UNION
        { <${raw_country_url}> dbp:conventionalLongName ?name . }
        UNION
        { <${raw_country_url}> dbp:name ?name . }
        UNION
        { <${raw_country_url}> rdfs:label ?name . }.
        <${raw_country_url}> rdf:type schema:Country.
        OPTIONAL {<${raw_country_url}>  dbo:thumbnail ?thumbnail }.
        FILTER (lang(?name) = "en")
      }`
  const result: JSON = await fetchFromSparqlEndpoint(query, getSparqlEndpoint(Ontology.DBpedia))

  if (result.results.bindings.length == 0) {
    return {
      name: raw_country_url.slice(raw_country_url.lastIndexOf('/') + 1),
      link: country_url,
      thumbnail: undefined,
    }
  }
  return {
    name: result.results.bindings[0].name.value,
    link: country_url,
    thumbnail: Url.tryFromString(result.results.bindings[0].thumbnail.value),
  }
}

export function concatCountries(countries_a: Array<Country>, countries_b: Array<Country>): Array<Country> {
  countries_b.forEach((country_b) => {
    let to_push = true

    for (const country_a of countries_a) {
      if (country_a.name == country_b.name) {
        to_push = false
        break
      }
    }
    if (to_push) {
      countries_a.push(country_b)
    }
  })

  return countries_a
}