import '@atlaskit/css-reset';

import '../styles/globals.css'
import { initSentry } from '../modules/tracker'

if (process.env.PROD) {
  initSentry()
}

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
