import useSWR from "swr";
import { gql } from "graphql-request";
import { useRouter } from "next/router";
import React from "react";
import User from '../../components/users/User'
import { fetcher } from "../../modules/api";

export default function UserPage() {
  const router = useRouter();
  const { UserPage: rawUserId } = router.query;
  const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId

  const { data, error } = useSWR(
    gql`
      {
        UserDetail(id: "${userId}") {
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

  return (
    <User
      userId={userId}
      data={data}
      error={error}
    />
  )
}
