import useSWR from "swr";
import { gql } from "graphql-request";
import { useRouter } from "next/router";
import React, { useState, Fragment } from "react";
import Lozenge from "@atlaskit/lozenge";
import Button, { ButtonGroup } from "@atlaskit/button";
import Form, { Field, FormFooter, ErrorMessage } from "@atlaskit/form";
import TextField from "@atlaskit/textfield";
import Layout from "../../layout/Layout";
import {
  LSBreadcrumbs,
  BreadcrumbsItem,
} from "../../components/LSBreadcrumbs/LSBreadcrumbs";
import {
  Table,
  Row,
  LeftCell,
  RightCell,
  Header,
  HRow,
  HTag,
  ButtonCell,
} from "../../pages-styles/UserPage/UserPage.styles";
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
  const formatDate = (rawDate: string) => {
    const date = String(rawDate)
      .split("-")
      .join(",")
      .split("T")
      .join(",")
      .split("+")
      .join(",")
      .split(",");

    return `${date[2]}. ${date[1]}. ${date[0]}`;
  };

  // handle password-edit event
  const [editPasswordState, setEditPasswordState] = useState(false);

  const handleSubmit = (data: { password: string; repeatPassword: string }) => {
    const error = {
      repeatPassword:
        data.password !== data.repeatPassword
          ? "Your passwords do not match."
          : undefined,
    };

    if(!error.repeatPassword) {
      fetcher(gql`mutation {
        UserSetPassword(data: {id: "${UserPage}", password: "${data.password}" }) {
          object {
            id
            username
            firstName
            lastName
          }
        }
      
      }`).catch(e => console.log(e));

      setEditPasswordState(!editPasswordState);
    }

    return error;
  };

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
          {/* The following elements cant be rendered for some reason */ }
          {/* Getting assignments.totalCount undefined */ }
          {/* <HTag>
            <strong>{assignments.totalCount}</strong> assignments
          </HTag> */}
          {/* <HTag>
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
              {formatDate(dateJoined)}
            </strong>
          </RightCell>
        </Row>
        <Row>
          <LeftCell>Email</LeftCell>
          <RightCell>
            <strong>{email}</strong>
          </RightCell>
        </Row>
        <Row>
          <LeftCell>Password</LeftCell>
          <RightCell>
            {editPasswordState ? (
              <Form onSubmit={handleSubmit}>
                {({ formProps, submitting }) => (
                  <form {...formProps}>
                    <Field
                      name="password"
                      defaultValue=""
                      label="New Password"
                      isRequired
                    >
                      {({ fieldProps }) => (
                        <TextField type="password" {...fieldProps} />
                      )}
                    </Field>
                    <Field
                      name="repeatPassword"
                      defaultValue=""
                      label="Repeat Password"
                      isRequired
                    >
                      {({ fieldProps, error }) => (
                        <Fragment>
                          <TextField type="password" {...fieldProps} />
                          {error && <ErrorMessage>{error}</ErrorMessage>}
                        </Fragment>
                      )}
                    </Field>
                    <FormFooter>
                      <ButtonGroup>
                        <Button
                          appearance="subtle"
                          onClick={() =>
                            setEditPasswordState(!editPasswordState)
                          }
                        >
                          Cancel
                        </Button>
                        <Button
                          appearance="primary"
                          type="submit"
                          isLoading={submitting}
                        >
                          Save
                        </Button>
                      </ButtonGroup>
                    </FormFooter>
                  </form>
                )}
              </Form>
            ) : (
              <strong>●●●●●●</strong>
            )}
          </RightCell>
          <ButtonCell>
            {editPasswordState ? null : (
              <Button
                appearance="primary"
                spacing="compact"
                onClick={() => setEditPasswordState(!editPasswordState)}
              >
                Change password
              </Button>
            )}
          </ButtonCell>
        </Row>
      </Table>
    </Layout>
  );
}