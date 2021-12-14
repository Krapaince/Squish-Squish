export async function fetchFromSparqlEndpoint(
  query: string,
  endpoint: string = 'https://dbpedia.org/sparql'
): Promise<JSON> {
  return await fetch(endpoint + '?query=' + query, {
    method: 'GET',
    redirect: 'follow',
    headers: {
      Accept: 'application/sparql-results+json',
    },
  })
    .then(async function (data) {
      return data.text().then(JSON.parse)
    })
    .catch(function (error) {
      console.log('Request failed', error)
    })
}
