import React from "react";
import { v4 } from "uuid";

const CLIENT_ID = process.env.CLIENT_ID
const REDIRECT_URI = process.env.REDIRECT_URI
const STATE = v4()

export default function Login() {
  return (
    <div className="loading">
      <img className="logo-img" src="/logo.svg" />
      <div className="title">Learnshell</div>
      <br />
      Unauthorized
      <br />
      <a href={`https://auth.fit.cvut.cz/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}`}>Please, login via CTU account</a>
    </div>
  )
}
