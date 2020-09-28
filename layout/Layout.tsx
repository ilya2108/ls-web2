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
import CustomBanner from "../components/CustomBanner/CustomBanner";
import WarningIcon from "@atlaskit/icon/glyph/warning";
import { useSelector } from "react-redux";


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
  const banner = useSelector((state) => state.user.banner);
  return (
    <Page>
      <NavigationProvider>
        {banner ? (
          <CustomBanner icon={<WarningIcon label="" />}>Hello</CustomBanner>
        ) : null}
        <LayoutManager
          globalNavigation={LSGlobalNavigation}
          productNavigation={() => null}
          containerNavigation={() => <ContainerNavigation admin={admin} />}
          topOffset={banner ? 52 : 0}
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
