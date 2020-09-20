// documentation 
// Breadcrumbs: https://atlassian.design/components/breadcrumbs/examples
// Lozenge: https://atlassian.design/components/lozenge/examples

import styled from "styled-components";
import Breadcrumbs, { BreadcrumbsItem } from "@atlaskit/breadcrumbs";
import Lozenge from '@atlaskit/lozenge';

const StyledBreadcrumbs = styled.div`
    margin-bottom: 50px;
`;

const LSBreadcrumbs = ({children}) => (
    <StyledBreadcrumbs>
        <Breadcrumbs>
            {children}
        </Breadcrumbs>
    </StyledBreadcrumbs>
);

export {LSBreadcrumbs, BreadcrumbsItem};