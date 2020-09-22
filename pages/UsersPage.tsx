import Link from "next/link";
import useSWR from "swr";
import { gql } from "graphql-request";
import DynamicTable from "@atlaskit/dynamic-table";
import PageHeader from '@atlaskit/page-header';
import Layout from "../layout/Layout";
import { BreadcrumbsItem, BreadcrumbsStateless } from '@atlaskit/breadcrumbs';
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

  const breadcrumbs = (
    <BreadcrumbsStateless onExpand={() => {}}>
      <BreadcrumbsItem text="Users" href="/UsersPage" />
    </BreadcrumbsStateless>
  );

  // TODO: Come up with a prettier design, this is really ugly.
  return (
    <Layout>
      <PageHeader breadcrumbs={breadcrumbs}>
        User list
      </PageHeader>
      <section>
        <DynamicTable
          caption={null}
          head={tableHeadRow}
          rows={tableRows}
          loadingSpinnerSize="large"
          isLoading={false}
          isFixedSize
          defaultSortKey="Name"
          defaultSortOrder="ASC"
        />
      </section>
    </Layout>
  );
}
