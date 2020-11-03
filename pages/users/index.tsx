import React, { useState, Fragment } from "react";
import Link from "next/link";
import useSWR from "swr";
import { gql } from "graphql-request";
import { v4 } from 'uuid';
import debounce from "lodash/debounce"


import DynamicTable from "@atlaskit/dynamic-table";
import PageHeader from "@atlaskit/page-header";
import { BreadcrumbsItem, BreadcrumbsStateless } from "@atlaskit/breadcrumbs";

import Layout from "../../layout/Layout";
import { fetcher } from "../../modules/api";
import HugeSpinner from "../../components/HugeSpinner/HugeSpinner";
import Error from "../../components/Error";
import { calculateSemesterScore } from '../../utils/score-utils'
import Textfield from "@atlaskit/textfield";
import { SearchWrapper } from "../../pages-styles/UsersPage/UsersPage.styles";
import EditorSearchIcon from "@atlaskit/icon/glyph/editor/search";
import ShortcutIcon from "@atlaskit/icon/glyph/shortcut";
import Button from '@atlaskit/button';


export default function UsersPage() {
  const [inputVal, setInputVal] = useState("");
  // TODO: figure out a way to render a loading state
  const [loading, setLoading] = useState(false);
  const setInputValDebounced = debounce(setInputVal, 250)
  const handleSearchEvent = (event) => {
    const { value } = event.target;
    setInputValDebounced(value)
  };


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
  const tableHeaderNames = ["#", "Name", "Username", "Email"];

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

  const filterUsers = (users) => {
    const filteredUsers = users.filter((user) => {
      return user.username.toLowerCase().includes(inputVal.toLowerCase());
    });
    return filteredUsers;
  };


  const tableRows = filterUsers(users).map(
    ({ lastName, firstName, id, username, email, assignments }, i) => {
      const score = calculateSemesterScore(assignments)
      return {
        cells: [
          {
            key: `id-${id}-${i}`,
            content: id
          },
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
                <a>{username}</a>
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
      }
    }
  );

  if (error) {
    return <Error />
  }

  return (
    <Layout>
      <PageHeader
        breadcrumbs={
          <BreadcrumbsStateless onExpand={() => {}}>
            <BreadcrumbsItem text="Users" href="/users" />
          </BreadcrumbsStateless>
        }
      >
        User list
        </PageHeader>
      {!error && !data ? (
        <HugeSpinner />
      ) : (
        <Fragment>
          <SearchWrapper>
            <Textfield
              name="basic"
              isCompact
              placeholder="Search username"
              elemAfterInput={<EditorSearchIcon label="" />}
              onChange={(event) => handleSearchEvent(event)}
            />
          </SearchWrapper>
          <DynamicTable
            head={tableHeadRow}
            rows={tableRows}
            loadingSpinnerSize="large"
            isLoading={false}
            isFixedSize
            defaultSortKey="Name"
            defaultSortOrder="ASC"
          />
        </Fragment>
      )}

    </Layout>
  );
}
