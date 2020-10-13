import '@atlaskit/css-reset';
import { Provider } from 'react-redux';
import { GraphQLClient, ClientContext } from 'graphql-hooks'

import { useStore } from '../modules/core/redux/store';
import { initSentry } from '../modules/tracker'

import '../styles/globals.css'

if (process.env.PROD) {
  initSentry()
}

const client = new GraphQLClient({
  url: process.env.API_ENDPOINT ?? "/graphql/"
})

function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState)
  return (
    <Provider store={store}>
      <ClientContext.Provider value={client}>
        <Component {...pageProps} />
      </ClientContext.Provider>
    </Provider>
  )
}

export default MyApp
