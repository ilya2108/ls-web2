import React from "react";

export default function Login() {
  return (
    <div className="loading">
      <img className="logo-img" src="/logo.svg" />
      <div className="title">Learnshell</div>
      <br />
      Unauthorized
      <br />
      <a href="https://auth.fit.cvut.cz/login">Please, login via CTU account</a>
    </div>
  )
}
