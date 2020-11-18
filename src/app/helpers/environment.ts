declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: StagingEnvironment
      ELECTRON_NODE_INTEGRATION: boolean
      WEBPACK_DEV_SERVER_URL: string
      IS_TEST: boolean
    }
  }
}

enum StagingEnvironment {
  // development = 'development',
  // test = 'test',
  production = 'production'
}
const env = process.env
const isProduction = env.NODE_ENV === StagingEnvironment.production
const isTest = env.IS_TEST
export const MODE = {
  development: !isProduction && !isTest,
  testing: isTest,
  production: isProduction
}
