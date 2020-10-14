import '@atlaskit/css-reset';
import { Provider } from 'react-redux';
import { useStore } from '../modules/core/redux/store';

import '../styles/globals.css'
import { initSentry } from '../modules/tracker'

if (process.env.PROD) {
  initSentry()
}

function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState)
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
