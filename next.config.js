module.exports = {
  env: {
    API_ENDPOINT: process.env.API_ENDPOINT,
    CLIENT_ID: process.env.CLIENT_ID,
    REDIRECT_URI: process.env.REDIRECT_URI,
    BACKEND_ROOT_URI: process.env.BACKEND_ROOT_URI,
    PROD: process.env.PROD,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    return {
      ...config,
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            test: /\.(graphql|gql)$/,
            exclude: /node_modules/,
            loader: 'graphql-tag/loader'
          }
        ]
      }
    }
  },
}
