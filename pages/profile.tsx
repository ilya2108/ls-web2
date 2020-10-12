import useSWR from "swr";
import { gql } from "graphql-request";

import { fetcher } from "../modules/api";
import User from '../components/users/User'
import React from "react";
import Login from "../components/Login";

import getMyProfile from '../queries/profile.gql'

const results = [
  {
    id: 1,
    content: {
      'asd': 'asd', 
    },
    hasChildren: true,
    task: 'Tasks',
    children: [
      {
        id: 11,
        task: 'EN-001-Hello, BIE-PS1!',
        points: 1.000,
      }
    ]
  },
  {
    id: 2,
    hasChildren: true,
    task: 'Exams',
    children: [
      {
        id: 21,
        task: '03 2019 - (st 7:30) Adresare II',
        points: 2.207,
      },
      {
        id: 22,
        task: 'en-06-2019 (St 18:00) Filters I',
        points: 7.218,
      },
      {
        id: 23,
        task: 'en-08-2019 (St 16:15) Big test 1',
        points: 30.000,
      },
      {
        id: 24,
        task: 'en-08-2019 (St 16:15) Big test 1a',
        points: 32.897,
      },
      {
        id: 25,
        task: 'en-09-2019 (St 16:15) RE',
        points: 10.150,
      },
    ]
  },
]

export default function ProfilePage() {
  const { data, error } = useSWR(
    gql`${getMyProfile.loc.source.body}`,
    fetcher
  );

  if (error) {
    return <Login />
  }

  return (
    <User
      userId={data?.UserMyself?.id}
      userData={data?.UserMyself}
      error={error}
      profile
    />
  );
}
