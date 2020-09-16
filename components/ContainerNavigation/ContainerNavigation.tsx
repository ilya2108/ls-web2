// documentation
// https://atlaskit.atlassian.com/packages/design-system/navigation-next

// dependencies
import { Fragment } from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';

// old SideNavigation dependencies
import {
  HeaderSection,
  Item,
  MenuSection,
} from "@atlaskit/navigation-next";

// ICONS
import HomeIcon from "@atlaskit/icon/glyph/home";
import PersonIcon from "@atlaskit/icon/glyph/person";
import QuestionIcon from "@atlaskit/icon/glyph/question-circle";
import LabsIcon from "@atlaskit/icon/glyph/jira/labs";
import TestIcon from "@atlaskit/icon/glyph/jira/test-session";
import UsersIcon from "@atlaskit/icon/glyph/people-group";
import ReposIcon from "@atlaskit/icon/glyph/bitbucket/repos";

// currently using
// jsx version of the old container navigation
const ContainerNavigation: React.FunctionComponent = () => {
  const router = useRouter();

  return (
  <Fragment>
    <HeaderSection>
      {({ className }) => (
        <div className={className}>
          {/* <ContainerHeader
            before={(s) => <ReposIcon label="" size="large" />}
            text="Learn Shell 2.0"
          /> */}
          <Item before={ReposIcon} text="Learn Shell 2.0" onClick={()=>router.push("/")} />
        </div>
      )}
    </HeaderSection>
    <MenuSection>
      {({ className }) => (
        <div className={className}>
          <Link href="/">
            <Item before={HomeIcon} text="Home" isSelected={router.pathname === "/"} />
          </Link>
          <Link href="/ProfilePage">
            <Item before={PersonIcon} text="Profile" isSelected={router.pathname === "/ProfilePage"} />
          </Link>
          <Link href="/HelpPage">
            <Item before={QuestionIcon} text="Help" isSelected={router.pathname === "/HelpPage"} />
          </Link>
          <Link href="/TasksPage">
            <Item before={LabsIcon} text="Tasks" isSelected={router.pathname === "/TasksPage"} />
          </Link>
          <Link href="/ExamsPage">
            <Item before={TestIcon} text="Exams" isSelected={router.pathname === "/ExamsPage"} />
          </Link>
          <Link href="/UsersPage">
            <Item before={UsersIcon} text="Users" isSelected={router.pathname === "/UsersPage"} />
          </Link>
        </div>
      )}
    </MenuSection>
  </Fragment>
  )
}

export default ContainerNavigation;
