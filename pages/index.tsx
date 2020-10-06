import Layout from "../layout/Layout";
import { signIn, signOut, useSession } from 'next-auth/client'

export default function HomePage() {
  const [ session, loading ] = useSession()

  return (
    <Layout>
      <h1>Home</h1>
      <div>
      {!session && <>
        Not signed in <br/>
        <button onClick={signIn}>Sign in</button>
        <br />
        <br />
        <a href='https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code&client_id=565931980682-k5eitls06t2188m826iu4ktoln9bj3of.apps.googleusercontent.com&redirect_uri=http://localhost:3000&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile'>Signin</a>
      </>}
      {session && <>
        Signed in as {session.user.email} <br/>
        <button onClick={signOut}>Sign out</button>
      </>}
      </div>
    </Layout>
  );
}
