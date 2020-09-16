// documentation
// Navigation: https://atlaskit.atlassian.com/packages/design-system/navigation-next
// Page, Grid: https://atlaskit.atlassian.com/packages/design-system/page
// Page Layout: https://atlaskit.atlassian.com/packages/design-system/page-layout

// dependencies
import React from 'react';
import {
  LayoutManager,
  NavigationProvider,
} from "@atlaskit/navigation-next";

// grid and layout
import Page, { Grid } from "@atlaskit/page";
import { Content, PageLayout, Main } from "@atlaskit/page-layout";

// navigation components
import ContainerNavigation from "../components/ContainerNavigation/ContainerNavigation";
import LSGlobalNavigation from "../components/LSGlobalNavigation/LSGlobalNavigation";

interface ILayoutProps {
  children: React.ReactNode
}

const Layout = ({children}: ILayoutProps) => (
  <Page>
    <NavigationProvider>
      <LayoutManager
        globalNavigation={LSGlobalNavigation}
        productNavigation={() => null}
        containerNavigation={ContainerNavigation}
      >
        <Grid>
          <PageLayout>
            <Content>
              <Main>
                {children}
              </Main>
            </Content>
          </PageLayout>
        </Grid>
      </LayoutManager>
    </NavigationProvider>
  </Page>
);

export default Layout;
