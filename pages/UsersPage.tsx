// dependencies
import Link from "next/link";
import useSWR from "swr";
import { gql } from "graphql-request";

// atlaskit
import DynamicTable from "@atlaskit/dynamic-table";

// components
import {LSBreadcrumbs, BreadcrumbsItem} from "../components/LSBreadcrumbs/LSBreadcrumbs";
import Layout from "../layout/Layout";

// data fetching
import { fetcher } from "../modules/api";

export default function UsersPage() {
  const { data, error } = useSWR(
    gql`
      {
        UserList {
          results {
            id
            email
            username
            firstName
            lastName
          }
        }
      }
    `,
    fetcher
  );

  // TODO: Loading.
  const users = data?.UserList?.results || [];

  // Generating user table header
  const tableHeaderNames = ["Name", "Username", "Email"];

  const mappedTableHead = tableHeaderNames.map((headerNames, i) => ({
    key: headerNames,
    isSortable: true,
    shouldTurncate: false,
    content: headerNames,
    // testId: headerNames,
  }));

  const tableHeadRow = {
    cells: mappedTableHead,
  };

  // Generating user table rows
  const tableRows = users.map(({lastName, firstName, id, username, email}, i) => ({
    cells: [
      {
        // Name
        key: lastName + firstName,
        content: (
          <Link href={`/users/${encodeURIComponent(id)}`}>
            <a>
              {lastName} {firstName}
            </a>
          </Link>
        ),
      },
      {
        // Username
        key: username,
        content: (
          <Link href={`/users/${encodeURIComponent(id)}`}>
            <a>
              {username}
            </a>
          </Link>
        ),
      },
      {
        // Email
        key: email,
        content: email,
      },
    ],
    key: username,
  }));

  // TODO: Come up with a prettier design, this is really ugly.
  return (
    <Layout>
      <LSBreadcrumbs>
        <BreadcrumbsItem href="/UsersPage" text="Users"/>
      </LSBreadcrumbs>
      <section>
        <DynamicTable
          caption={null}
          head={tableHeadRow}
          rows={tableRows}
          // rowsPerPage={10}
          // defaultPage={1}
          loadingSpinnerSize="large"
          isLoading={false}
          isFixedSize
          defaultSortKey="Name"
          defaultSortOrder="ASC"
          onSort={() => console.log("onSort")}
          onSetPage={() => console.log("onSetPage")}
        />
      </section>
    </Layout>
  );
}
