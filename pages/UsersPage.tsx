// dependencies
import useSWR from "swr";
import { GraphQLClient, gql, request } from "graphql-request";

import Layout from "../layout/Layout";

// fetching
const fetcher = (query) => request("http://localhost:8000/graphql/", query);

const fetcher2 = async query => {
  const token = window.sessionStorage.getItem("token");
  const endpoint = "http://localhost:8000/graphql/";
  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': 'QwH0WksqYzQe2syYveViyibgntOEuS8U8xJtg5CQOheMZBTDdHzq7pPxyDJCwfLM',
      'Sec-Fetch-Site': 'same-origin',
      'Cookie': 'tr825uc1phpgt13lhfnuorihmn94b8a7; expires=Thu, 01 Jan 2030 00:00:00 UTC; path=/',
      'Access-Control-Allow-Origin': '*'
    }
  });

  const data = await graphQLClient.request(query);
  console.log(JSON.stringify(data, undefined, 2))
}

export default function UsersPage() {
  const { data, error } = useSWR(
    `{
      UserList {
        results {
          email
        }
      }
    }`,
    fetcher
  );

  if (error) {
    console.log("error: " + error);
    return <div>failed to load </div>;
  }
  if (!data) return <div>loading...</div>;

  return (
    <Layout>
      <h1>Users</h1>
    </Layout>
  );
}
