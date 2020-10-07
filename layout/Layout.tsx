import React from "react";
import useSWR from 'swr'
import styled from "styled-components";

import Page from "@atlaskit/page";
import { Content, PageLayout, Main } from "@atlaskit/page-layout";
import { LayoutManager, NavigationProvider } from "@atlaskit/navigation-next";

import Login from "../components/Login";
import ContainerNavigation from "../components/ContainerNavigation/ContainerNavigation";
import LSGlobalNavigation from "../components/LSGlobalNavigation/LSGlobalNavigation";
import { auth, fetcher } from "../modules/api"

type ILayoutProps = {
  children: React.ReactNode;
}

type ILoggedInLayoutProps = {
  admin: boolean
  children: React.ReactNode;
}

const Padding = styled.div`
  padding: 40px;
`;

export default function Layout({ children }: ILayoutProps) {
  const { data, error } = useSWR('/api/user', auth)
  if (!data && !error) {
    return (
      <div className="loading">loading</div>
    )
  }

  if (data?.UserMyself?.id) {
    const admin = (
      data.UserMyself.coursesAsTeacher?.totalCount >= 1 ||
      data.UserMyself.isStaff ||
      data.UserMyself.isSuperuser
    )

    return <LoggedInLayout admin={admin}>{children}</LoggedInLayout>
  }

  return <Login />
}

function LoggedInLayout({ children, admin }: ILoggedInLayoutProps) {
  return (
    <Page>
      <NavigationProvider>
        <LayoutManager
          globalNavigation={LSGlobalNavigation}
          productNavigation={() => null}
          containerNavigation={() => <ContainerNavigation admin={admin} />}
        >
          <PageLayout>
            <Content>
              <Main>
                <Padding>{children}</Padding>
              </Main>
            </Content>
          </PageLayout>
        </LayoutManager>
      </NavigationProvider>
    </Page>
  )
}
