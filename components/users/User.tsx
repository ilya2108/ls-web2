import { gql } from "graphql-request";
import React, { useState, Fragment } from "react";
import pluralize from 'pluralize'

import Lozenge from "@atlaskit/lozenge";
import Button, { ButtonGroup } from "@atlaskit/button";
import Form, { Field, FormFooter, ErrorMessage } from "@atlaskit/form";
import PageHeader from "@atlaskit/page-header";
import TextField from "@atlaskit/textfield";
import { BreadcrumbsItem, BreadcrumbsStateless } from "@atlaskit/breadcrumbs";

import Layout from "../../layout/Layout";
import Error from "../Error";
import HugeSpinner from "../HugeSpinner/HugeSpinner";
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
import UserCoursesInfoSection from "./UserCoursesInfoSection";
import UserPointsInfoSection from "./UserPointsInfoSection";
import { fetcher } from "../../modules/api";
import { formatDate } from "../../utils/date-utils";
import { useDispatch } from "react-redux";
import {
  addFlag,
  dismissFlag,
} from "../../modules/core/redux/flag/flag.actions";
import {
  PasswordChangeSuccessFlag,
  PasswordChangeErrorFlag,
} from "../LSFlags/LSFlags";

type Props = {
  userId: string,
  error: Error,
  userData: any,
  profile: boolean
}

export default function UserPage(props: Props) {
  const { userId, error, userData, profile } = props

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
    courses,
    parallels,
  } = userData || [];

  const dispatch = useDispatch();
  const dispatchDismissFlag = () => dispatch(dismissFlag());
  const dispatchPasswordChangeSuccess = () =>
    dispatch(addFlag(PasswordChangeSuccessFlag(dispatchDismissFlag)));
  const dispatchPasswordChangeError = (e) =>
    dispatch(addFlag(PasswordChangeErrorFlag(e, dispatchDismissFlag)));

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
      
      }`).catch((e) => dispatchPasswordChangeError(e));

      setEditPasswordState(!editPasswordState);
      dispatchPasswordChangeSuccess();
    }

    return err;
  };

  // render spinner
  if (!error && !userData) {
    return (
      <Layout>
        <PageHeader
          breadcrumbs={
            <BreadcrumbsStateless onExpand={() => {}}>
              {!profile && <BreadcrumbsItem text="Users" href="/users" />}
            </BreadcrumbsStateless>
          }
        ></PageHeader>
        <HugeSpinner />
      </Layout>
    );
  }

  if (error) {
    return <Error />
  }

  return (
    <Layout>
      <PageHeader
        breadcrumbs={
          <BreadcrumbsStateless onExpand={() => {}}>
            {!profile && <BreadcrumbsItem text="Users" href="/users" />}
            {!profile && <BreadcrumbsItem href={`/users/${userId}`} text={username} />}
            {profile && <BreadcrumbsItem href="/profile" text={username} />}
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
            <strong>{assignments.totalCount}</strong> <a href="/assignments">{pluralize('assignment', assignments.totalCount)}</a>
          </HTag>
          <HTag>
            <strong>{courses.totalCount}</strong> {pluralize('course', courses.totalCount)}
          </HTag>
          <HTag>
            <strong>{parallels.totalCount}</strong> {pluralize('parallel', parallels.totalCount)}
          </HTag>
        </Header>

        <Row>
          <UserCoursesInfoSection userData={userData} />
        </Row>

        <Row>
          <UserPointsInfoSection userData={userData} />
        </Row>

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
