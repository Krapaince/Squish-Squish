import { Ontology } from '../models/Ontology'

export function getSparqlEndpoint(ontology: Ontology) {
  const endpoints = ['https://dbpedia.org/sparql', 'https://query.wikidata.org/sparql']

  return endpoints[ontology.valueOf()]
}