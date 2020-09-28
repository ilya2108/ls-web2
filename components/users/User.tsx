import { gql } from "graphql-request";
import React, { useState, Fragment } from "react";
import Lozenge from "@atlaskit/lozenge";
import Button, { ButtonGroup } from "@atlaskit/button";
import Form, { Field, FormFooter, ErrorMessage } from "@atlaskit/form";
import PageHeader from "@atlaskit/page-header";
import TextField from "@atlaskit/textfield";
import Layout from "../../layout/Layout";
import HugeSpinner from "../HugeSpinner/HugeSpinner";
import { BreadcrumbsItem, BreadcrumbsStateless } from "@atlaskit/breadcrumbs";
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

type Props = {
  userId: string,
  error: Error,
  data: any,
}

export default function UserPage(props: Props) {
  const { userId, error, data } = props
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
  } = data?.UserDetail || [];

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
    const err = {
      repeatPassword:
        data.password !== data.repeatPassword
          ? "Entered passwords do not match."
          : undefined,
    };

    if (!err.repeatPassword) {
      fetcher(gql`mutation {
        UserSetPassword(data: {id: "${userId}", password: "${data.password}" }) {
          object {
            id
            username
            firstName
            lastName
          }
        }
      
      }`).catch((e) => console.log(e));

      setEditPasswordState(!editPasswordState);
    }

    return err;
  };

  // render spinner
  if (!error && !data) {
    return (
      <Layout>
        <PageHeader
          breadcrumbs={
            <BreadcrumbsStateless onExpand={() => {}}>
              <BreadcrumbsItem text="Users" href="/UsersPage" />
            </BreadcrumbsStateless>
          }
        ></PageHeader>
        <HugeSpinner />
      </Layout>
    );
  }

  // TODO: use a banner instead
  // render Error component
  if (error) {
    return <div>Error brah</div>;
  }

  return (
    <Layout>
      <PageHeader
        breadcrumbs={
          <BreadcrumbsStateless onExpand={() => {}}>
            <BreadcrumbsItem text="Users" href="/UsersPage" />
            <BreadcrumbsItem href={`/users/${userId}`} text={username} />
          </BreadcrumbsStateless>
        }
      >
        {firstName} {lastName}
      </PageHeader>
      <Table>
        <Header>
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
          <HTag>
            <strong>{assignments.totalCount}</strong> assignments
          </HTag>
          <HTag>
            <strong>{jobs.totalCount}</strong> jobs
          </HTag>
          <HTag>
            <strong>{courses.totalCount}</strong> courses
          </HTag>
          <HTag>
            <strong>{parallels.totalCount}</strong> parallels
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
            <strong>{formatDate(dateJoined)}</strong>
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
