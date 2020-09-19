import { GraphQLClient } from "graphql-request";

const createClient = (): GraphQLClient => {
  const endpoint = "http://localhost:8000/graphql/";

  return new GraphQLClient(endpoint, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

// actual fetcher
export async function fetcher (query: string) {
  const client = createClient()
  const data = await client.request(query);
  return data
}
