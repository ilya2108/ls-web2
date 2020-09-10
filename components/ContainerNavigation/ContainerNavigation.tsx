// dependencies
import { Fragment } from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';

// old SideNavigation dependencies
import {
  GroupHeading,
  HeaderSection,
  Item,
  LayoutManager,
  MenuSection,
  NavigationProvider,
  Separator,
  ItemAvatar,
  ContainerHeader,
} from "@atlaskit/navigation-next";

// new SideNavigation dependencies
import {
  SideNavigation,
  Header,
  NavigationHeader,
  NavigationContent,
  ButtonItem,
  Section,
} from "@atlaskit/side-navigation";

// ICONS
import HomeIcon from "@atlaskit/icon/glyph/home";
import PersonIcon from "@atlaskit/icon/glyph/person";
import QuestionIcon from "@atlaskit/icon/glyph/question-circle";
import LabsIcon from "@atlaskit/icon/glyph/jira/labs";
import TestIcon from "@atlaskit/icon/glyph/jira/test-session";
import UsersIcon from "@atlaskit/icon/glyph/people-group";
import ReposIcon from "@atlaskit/icon/glyph/bitbucket/repos";

// New SideNavigation - Is not being used at the moment
const NewContainerNavigation = () => (
  <SideNavigation label="project">
    <NavigationHeader>
      <Header>
        <ButtonItem iconBefore={<ReposIcon label="" />}>
          Learn Shell 2.0
        </ButtonItem>
      </Header>
    </NavigationHeader>
    <NavigationContent>
      <ButtonItem iconBefore={<HomeIcon label="" />}>Home</ButtonItem>
      <ButtonItem iconBefore={<PersonIcon label="" />}>Profile</ButtonItem>
      <ButtonItem iconBefore={<QuestionIcon label="" />}>Help</ButtonItem>
      <ButtonItem iconBefore={<LabsIcon label="" />}>Tasks</ButtonItem>
      <ButtonItem iconBefore={<TestIcon label="" />}>Exams</ButtonItem>
      <ButtonItem iconBefore={<UsersIcon label="" />}>Users</ButtonItem>
    </NavigationContent>
  </SideNavigation>
);

// json version of the old container navigation
const jsonContainerNavigation = [
  {
    type: "HeaderSection",
    id: "header",
    items: [
      {
        type: "Item",
        before: ReposIcon,
        text: "Learn Shell 2.0",
        id: "learn-shell-wordmark",
      },
    ],
  },
  {
    type: "MenuSection",
    id: "menu",
    items: [
      {
        type: "Item",
        id: "Home",
        before: HomeIcon,
        text: "Home",
      },
      // {
      //   type: "InlineComponent",
      //   component: LinkItem,
      //   to: "/ProfilePage",
      //   id: "Profile",
      //   before: PersonIcon,
      //   text: "Profile"
      // },
      {
        type: "Item",
        id: "Profile",
        before: PersonIcon,
        text: "Profile",
      },
      {
        type: "Item",
        id: "Help",
        before: QuestionIcon,
        text: "Help",
      },
      {
        type: "Item",
        id: "Tasks",
        before: LabsIcon,
        text: "Tasks",
      },
      {
        type: "Item",
        id: "Exams",
        before: TestIcon,
        text: "Exams",
      },
      {
        type: "Item",
        id: "Users",
        before: UsersIcon,
        text: "Users",
      },
    ],
  },
];

// currently using
// jsx version of the old container navigation
const ContainerNavigation = () => {
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
