// dependencies
import useSWR from "swr";
import { gql } from "graphql-request";
import { useRouter } from "next/router";

// atlaskit
import Lozenge from "@atlaskit/lozenge";
import Button from "@atlaskit/button";

// components
import Layout from "../../layout/Layout";
import {
  LSBreadcrumbs,
  BreadcrumbsItem,
} from "../../components/LSBreadcrumbs/LSBreadcrumbs";

// styles
import {
  Table,
  Row,
  LeftCell,
  RightCell,
  Header,
  HRow,
  HTag,
  ButtonCell,
} from "../../pages-styles/users/UserPage.styles";

// data fetching
import { fetcher } from "../../modules/api";

export default function UserPage() {
  const router = useRouter();
  const { UserPage } = router.query;

  const { data, error } = useSWR(
    gql`
      {
        UserDetail(id: "${UserPage}") {
          firstName
          lastName
          email
          assignments {
            totalCount
          }
          dateJoined
          ipAddress
          isActive
          isStaff
          isSuperuser
          username
          courses {
            totalCount
          }
          parallels {
            totalCount
          }
          jobs{
            totalCount
          }
        }
      }
    `,
    fetcher
  );

  const user = data?.UserDetail || [];

  const {
    firstName,
    lastName,
    email,
    assignments,
    dateJoined,
    isActive,
    isStaff,
    isSuperuser,
    username,
    jobs,
    courses,
    parallels,
  } = user;

  // date formatting - could be better
  // 2020-09-20T07:41:59+00:00
  // const date = dateJoined
  //   .split("-")
  //   .join(",")
  //   .split("T")
  //   .join(",")
  //   .split("+")
  //   .join(",")
  //   .split(",");

  return (
    <Layout>
      <LSBreadcrumbs>
        <BreadcrumbsItem href="/UsersPage" text="Users" />
        <BreadcrumbsItem href={`/users/${UserPage}`} text={username} />
      </LSBreadcrumbs>
      <Table>
        <Header>
          <h1>
            {firstName} {lastName}
          </h1>

          <HRow>
            {isActive ? (
              <HTag>
                <Lozenge appearance="success" isBold>
                  Active
                </Lozenge>
              </HTag>
            ) : (
              <HTag>
                <Lozenge isBold>Inactive</Lozenge>
              </HTag>
            )}
            {isSuperuser ? (
              <HTag>
                <Lozenge appearance="new" isBold>
                  Admin
                </Lozenge>
              </HTag>
            ) : null}
            {isStaff ? (
              <HTag>
                <Lozenge appearance="inprogress" isBold>
                  Staff
                </Lozenge>
              </HTag>
            ) : null}
          </HRow>
          {/* <HTag>
            <strong>{assignments.totalCount}</strong> assignments
          </HTag>
          <HTag>
            <strong>{jobs}</strong> jobs
          </HTag>
          <HTag>
            <strong>{courses}</strong> courses
          </HTag>
          <HTag>
            <strong>{parallels}</strong> parallels
          </HTag> */}
          <HTag>
            <strong>0</strong> assignments
          </HTag>
          <HTag>
            <strong>0</strong> jobs
          </HTag>
          <HTag>
            <strong>0</strong> courses
          </HTag>
          <HTag>
            <strong>0</strong> parallels
          </HTag>
        </Header>

        <Row>
          <LeftCell>Username</LeftCell>
          <RightCell>
            <strong>{username}</strong>
          </RightCell>
        </Row>
        <Row>
          <LeftCell>Date joined</LeftCell>
          <RightCell>
            <strong>
              {/* {date[2]}. {date[1]}. {date[0]} */}
              {dateJoined}
            </strong>
          </RightCell>
        </Row>
        <Row>
          <LeftCell>Email</LeftCell>
          <RightCell>
            <strong>{email}</strong>
          </RightCell>
          <ButtonCell>
            <Button appearance="primary" spacing="compact">
              Change email
            </Button>
          </ButtonCell>
        </Row>
        <Row>
          <LeftCell>Password</LeftCell>
          <RightCell>
            <strong>●●●●●●</strong>
          </RightCell>
          <ButtonCell>
            <Button appearance="primary" spacing="compact">
              Change password
            </Button>
          </ButtonCell>
        </Row>
      </Table>
    </Layout>
  );
}
