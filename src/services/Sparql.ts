export async function fetchFromSparqlEndpoint(
  query: string,
  endpoint: string
): Promise<JSON> {
  return await fetch(encodeURI(endpoint + '?query=' + query), {
    method: 'GET',
    redirect: 'follow',
    headers: {
      Accept: 'application/sparql-results+json',
    },
  })
    .then(async function (data) {
      const response = await data.text()
      return JSON.parse(response)
    })
    .catch(function (error) {
      console.log('Request failed', error)
    })
}
