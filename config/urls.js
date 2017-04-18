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

module.exports = { SSO, API_PREFIX, URL_MAP }
