// documentation
// SWR data fetching: https://swr.vercel.app/docs/data-fetching
// gql request: https://github.com/prisma-labs/graphql-request

// dependencies
import useSWR from "swr";
import { GraphQLClient, gql, request } from "graphql-request";
import Cookie from "js-cookie"

// components
import Layout from "../layout/Layout";

// fetching
// fetcher for testing connection
const testFetcher = (query) => request("http://localhost:8000/graphql/", query);

// TODO: make this work, cors - headers apparently not allowed by backend

// actual fetcher
const fetcher = async query => {
  const csrftoken = Cookie.get('csrftoken');
  const sid = Cookie.get('sessionid');
  const endpoint = "http://localhost:8000/graphql/";

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      // 'Access-Control-Allow-Headers': 'X-CSRF-Token',
      // 'Access-Control-Allow-Credentials': 'true',
      // 'accept': 'application/json',
      'Content-Type': 'application/json',
      // 'cookie': `csrftoken=${csrftoken}; sessionid=${sid}`,
      // 'origin': 'http://localhost:8000',
      // 'host': 'localhost:8000',
      // 'x-csrftoken': csrftoken,
    }
  });

  const data = await graphQLClient.request(query);
  console.log("raw data: " + data);
  return JSON.stringify(data, undefined, 2)
}

export default function UsersPage() {
  const { data, error } = useSWR(
    gql`{
      UserList {
        totalCount
      }
    }`,
    fetcher
  );

  console.log(error);
  console.log("data: " + data);
  console.log("cookie: " + Cookie.get('csrftoken'));

  // if (error) {
  //   console.log("error: " + error);
  //   return <div>failed to load </div>;
  // }
  // if (!data) return <div>loading...</div>;

  return (
    <Layout>
      <h1>Users</h1>
    </Layout>
  );
}
