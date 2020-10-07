// documentation
// https://atlaskit.atlassian.com/packages/design-system/navigation-next

// dependencies
import React, { Fragment } from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';

// old SideNavigation dependencies
import {
  HeaderSection,
  Item,
  MenuSection,
} from "@atlaskit/navigation-next";

import HomeIcon from "@atlaskit/icon/glyph/home";
import PersonIcon from "@atlaskit/icon/glyph/person";
import QuestionIcon from "@atlaskit/icon/glyph/question-circle";
import LabsIcon from "@atlaskit/icon/glyph/jira/labs";
import TestIcon from "@atlaskit/icon/glyph/jira/test-session";
import UsersIcon from "@atlaskit/icon/glyph/people-group";
import ReposIcon from "@atlaskit/icon/glyph/bitbucket/repos";
import SelectClearIcon from '@atlaskit/icon/glyph/select-clear';

type IProps = {
  admin: boolean
}

export default function ContainerNavigation({ admin }: IProps) {
  const router = useRouter();

  return (
  <Fragment>
    <HeaderSection>
      {({ className }) => (
        <div className={className}>
          <Item before={ReposIcon} text="Learn Shell 2.0" onClick={()=>router.push("/profile")} />
        </div>
      )}
    </HeaderSection>
    <MenuSection>
      {({ className }) => (
        <div className={className}>
          {/* <Link href="/">
            <Item before={HomeIcon} text="Home" isSelected={router.pathname === "/"} />
          </Link> */}
          <Link href="/profile">
            <Item before={PersonIcon} text="Profile" isSelected={router.pathname === "/profile"} />
          </Link>
          {admin &&
            <Link href="/users">
              <Item before={UsersIcon} text="Users" isSelected={router.pathname === "/users"} />
            </Link>
          }

          <Link href="/assignments">
            <Item before={LabsIcon} text="Assignments" isSelected={router.pathname === "/assignments"} />
          </Link>
          {/* <Link href="/exam">
            <Item before={TestIcon} text="Exam" isSelected={router.pathname === "/exam"} />
          </Link> */}
          <Link href="/help">
            <Item before={QuestionIcon} text="Help" isSelected={router.pathname === "/help"} />
          </Link>
          <Link href={`${process.env.BACKEND_ROOT_URI}/auth/logout`}>
            <Item before={SelectClearIcon} text="Logout" />
          </Link>
        </div>
      )}
    </MenuSection>
  </Fragment>
  )
}
