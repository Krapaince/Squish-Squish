import { Cheese } from '../types/cheese'


export async function getCheeses(): Promise<Array<Cheese>> {
  const query = `
  SELECT DISTINCT ?cheese
    WHERE {
        ?cheese
            rdf:type dbo:Cheese ;
            rdfs:label ?label .
    FILTER (lang(?label) = "en")
    }
  `;
  const results = await fetch(`https://dbpedia.org/sparql?query=${query}`, {
    method: 'GET',
    headers: {
      "Accept": "application/sparql-results+json"
    }
  })
  .then(function (data) {
    return data.text().then(JSON.parse);
  })
  .catch(function (error) {
    console.log('Request failed', error);
  });

  return results.results.bindings.map((binding: unknown) => binding.cheese)
}
