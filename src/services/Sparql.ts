export async function fetchFromSparqlEndpoint(
  query: String,
  endpoint: String,
): Promise<JSON> {
  return await fetch(encodeURI(endpoint + '?query=' + query), {
    method: 'GET',
    redirect: 'follow',
    mode: 'cors',
    headers: {
      Accept: 'application/sparql-results+json',
    },
  })
    .then(async function(data) {
      const response = await data.text()
      return JSON.parse(response)
    })
    .catch(function(error) {
      console.log('Request failed', error)
    })
}
