import '../styles/globals.css'
import '@atlaskit/css-reset';

import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: "https://c6cc13fa595942959e487394f7e51680@o458142.ingest.sentry.io/5455173",
  integrations: [
    new Integrations.BrowserTracing(),
  ],

  tracesSampleRate: 1.0,
});


function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
