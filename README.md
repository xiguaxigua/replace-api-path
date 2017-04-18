# replace-api-path

### 开始使用
1. 添加依赖 `npm i replace-api-path --save-dev`
2. 添加`./node_modules/.bin/replace-path`到faas命令

### 参数
`./node_modules/.bin/replace-path s=source-path d=dist-path`

s url-map文件的路径 可选 默认为 '/config/urls.js'

d shell脚本生成目录 可选 默认为 '/dist'

### url-map格式
```js
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
```
URL_MAP中的`prod`对应的是production环境，其余的对应faas的测试环境
