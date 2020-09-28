// documentation
// Navigation: https://atlaskit.atlassian.com/packages/design-system/navigation-next
// Page, Grid: https://atlaskit.atlassian.com/packages/design-system/page
// Page Layout: https://atlaskit.atlassian.com/packages/design-system/page-layout

// dependencies
import React from "react";
import { LayoutManager, NavigationProvider } from "@atlaskit/navigation-next";
import styled from "styled-components";

// grid and layout
import Page from "@atlaskit/page";
import { Content, PageLayout, Main } from "@atlaskit/page-layout";

// navigation components
import ContainerNavigation from "../components/ContainerNavigation/ContainerNavigation";
import LSGlobalNavigation from "../components/LSGlobalNavigation/LSGlobalNavigation";

interface ILayoutProps {
  children: React.ReactNode;
}

// styling <Main/>
const Padding = styled.div`
  padding: 40px;
`;

const Layout = ({ children }: ILayoutProps) => (
  <Page>
    <NavigationProvider>
      <LayoutManager
        globalNavigation={LSGlobalNavigation}
        productNavigation={() => null}
        containerNavigation={ContainerNavigation}
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

export default Layout;
