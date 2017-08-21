const URL_MAP = {
  alpha: {
    SSO: 'alpha-sso',
    API_PREFIX: 'alpha-httpizza'
  },
  beta: {
    SSO: 'beta-sso',
    API_PREFIX: 'beta-httpizza'
  },
  prod: {
    SSO: 'prod-sso',
    API_PREFIX: 'prod-httpizza'
  }
}
const CURRENT_ENV = 'alpha'
const SSO = URL_MAP[CURRENT_ENV].SSO
const API_PREFIX = URL_MAP[CURRENT_ENV].API_PREFIX
const prodReplace = [
  {
    from: 'http://a.com',
    to: 'b.com',
    type: 'html'
  },
  {
    from: 'http://e.com',
    to: 'f.com',
    type: 'html'
  }
]
const testReplace = [
  {
    from: 'http://c.com',
    to: 'd.com',
    type: 'html'
  },
  {
    from: 'http://g.com',
    to: 'h.com',
    type: 'js'
  }
]

module.exports = { SSO, API_PREFIX, URL_MAP, prodReplace, testReplace }
