import { Cheese } from '../types/cheese'


export async function getCheeses(): Promise<Array<Cheese>> {
  const query = `
  SELECT DISTINCT ?cheese ?label ?country ?source ?thumbnail
    WHERE {
        ?cheese
            rdf:type dbo:Cheese ;
            rdfs:label ?label ;
            dbp:country ?country ;
            dbp:source ?source ;
            dbo:thumbnail ?thumbnail .
    FILTER (lang(?label) = "en")
    }
  `;
  const results = await fetch(`https://dbpedia.org/sparql?query=${query}`, {
    method: 'GET',
    headers: {
      "Accept": "application/sparql-results+json"
    }
  })
  .then(async function (data) {
    return data.text().then(JSON.parse);

  })
  .catch(function (error) {
    console.log('Request failed', error);
  });
  console.log(results.results)
  return results.results.bindings.map((binding:unknown) => {
    return {
      link: binding.cheese.value,
      label: binding.label.value,
      country: binding.country.value,
      source: binding.source.value,
      thumbnail: binding.thumbnail.value
    };
  }).sort(function compareFn(elem1: Cheese, elem2: Cheese) {
    return elem1.label.localeCompare(elem2.label)
  })
}
