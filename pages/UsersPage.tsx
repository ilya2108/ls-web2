import useSWR from "swr";
import { gql } from "graphql-request";

import Layout from "../layout/Layout";

import { fetcher } from '../modules/api';

export default function UsersPage() {
  const { data, error } = useSWR(
    gql`{
      UserList {
          results {
            id
            email
            username
            firstName
            lastName
          }
      }
    }`,
    fetcher
  );

  // TODO: Loading.
  const users = data?.UserList?.results || []

  return (
    <Layout>
      <h1>Users</h1>
      <section>
        {
          users
            .map((user) => {
              console.log(user)
              return (
                <div key={user.id} className='users-container'>
                  <a className='user' href={`/users/${user.id}`}>{user.firstName} {user.lastName} ({user.username})</a>
                  <br />
                </div>
              )
            })
        }
      </section>
    </Layout>
  );
}
