import { gql } from "graphql-request";
import * as Sentry from "@sentry/react"
import { GraphQLClient } from "graphql-request";

const createClient = (): GraphQLClient => {
  const endpoint = process.env.API_ENDPOINT ?? "/graphql/";

  return new GraphQLClient(endpoint, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

// actual fetcher
export async function fetcher (query: string) {
  try {
    const client = createClient()
    const data = await client.request(query);
    return data
  } catch (e) {
    if (e?.response?.data) {
      return e.response.data
    }

    throw e
  }
}

export async function auth() {
  return fetcher(
    gql`
      query auth {
        UserMyself {
          id
          username
          isStaff
          isSuperuser
          coursesAsTeacher {
            totalCount
          }
        }
      }
    `
  )
}
