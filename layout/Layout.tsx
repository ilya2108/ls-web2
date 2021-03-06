import React from "react";
import useSWR from 'swr'
import styled from "styled-components";
import Page from "@atlaskit/page";
import { Content, PageLayout, Main } from "@atlaskit/page-layout";
import { LayoutManager, NavigationProvider } from "@atlaskit/navigation-next";

import Login from "../components/Login";
import ContainerNavigation from "../components/ContainerNavigation/ContainerNavigation";
import LSGlobalNavigation from "../components/LSGlobalNavigation/LSGlobalNavigation";
import { auth } from "../modules/api"
import Loading from "../components/Loading";
import FlagGroup from "../components/FlagGroup/FlagGroup"
import { isAdmin } from "../utils/user-utils";


type ILayoutProps = {
  children: React.ReactNode
}

type ILoggedInLayoutProps = {
  admin: boolean
  children: React.ReactNode
}

const Padding = styled.div`
  padding: 40px;
`;

export default function Layout({ children }: ILayoutProps) {
  const { data, error } = useSWR('/api/user', auth)
  if (!data && !error) {
    return (
      <Loading />
    )
  }

  if (data?.UserMyself?.id) {
    const admin = isAdmin(data.UserMyself)
    return <LoggedInLayout admin={admin}>{children}</LoggedInLayout>
  }

  return <Login />
}

function LoggedInLayout({ children, admin }: ILoggedInLayoutProps) {
  return (
    <Page>
      <FlagGroup/>
      <NavigationProvider>
        <LayoutManager
          globalNavigation={() => <LSGlobalNavigation admin={admin}/> }
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
  );
}
