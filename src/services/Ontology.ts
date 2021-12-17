import { Ontology } from '../models/Ontology'

export function getSparqlEndpoint(ontology: Ontology): boolean {
  const endpoints = ['https://dbpedia.org/sparql', 'https://query.wikidata.org/sparql']

  return endpoints[ontology.valueOf()]
}

export function getOntologyLogo(ontology: Ontology): String {
  const logos = ['dbpedia.png', 'wikidata.png']

  return logos[ontology.valueOf()]
}