import React, { useState } from "react";
import { v4 } from "uuid";

const CLIENT_ID = process.env.CLIENT_ID
const REDIRECT_URI = process.env.REDIRECT_URI
const STATE = v4()

export default function Login() {
  const [tip, setTip] = useState(false)

  const handleTipClick = () => {
    setTip(!tip)
  }

  return (
    <div className="loading">
      <img className="logo-img" src="/logo.svg" />
      <div className="title">Learnshell</div>
      <br />
      <a href={`https://auth.fit.cvut.cz/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}`}>Please, login with your CTU account</a>
      <br />
      <br />
      <br />
      <span className="hints-toggle-handle" onClick={handleTipClick}>(doesn't work?)</span>
      {/* <a href='#'>We're doing maintenance. We'll be back online soon. Sorry about that.</a> */}
      <br />
      {tip ? (
        <i className="login-hints">If it doesn't work, try logging out and back in over at <u><a href="https://auth.fit.cvut.cz/login">auth.fit.cvut.cz</a></u> separately, please.</i>
      ) : (
        <i className="login-hints" />
      )}
    </div>
  )
}
