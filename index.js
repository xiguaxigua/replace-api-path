#!/usr/bin/env node

var argv = process.argv.slice(2)

let sourceFilePath = getParam(argv, 's') || '/src/common/urls.js'
let distFilePath = getParam(argv, 'd') || '/dist'

const urls = require(process.cwd() + sourceFilePath).URL_MAP
const fs = require('fs')

Object.keys(urls).forEach(env => {
  Object.keys(urls[env]).forEach(key => {
    urls[env][key] = urls[env][key].replace(/\//g, '\\/')
  })
})

if (urls.prod) {
  const prodShTpl = ['#!/bin/bash\n']
  const prodSSO = urls.prod.SSO
  const prodApiPrefix = urls.prod.API_PREFIX

  prodShTpl.push('  sed -i "')

  Object.keys(urls).forEach(env => {
    if (env !== 'prod') {
      prodShTpl.push(`s/${urls[env].SSO}/${prodSSO};`)
      prodShTpl.push(`s/${urls[env].API_PREFIX}/${prodApiPrefix};`)
    }
  })

  prodShTpl.push('" `find * -type f | grep -E "\.js$"`')

  fs.writeFile(process.cwd() + distFilePath + '/install_production.sh', prodShTpl.join(''), function (e) {
    if (e) console.log(e)
  })

  delete urls.prod
}
if (Object.keys(urls).length > 1) {
  const testShTpl = ['#!/bin/bash\n']

  Object.keys(urls).forEach(env => {
    testShTpl.push(!testShTpl[1] ? 'if' : 'elif')
    testShTpl.push(` [ "$ENV" = "${env}" ]; then\n`)
    testShTpl.push(`  sed -i "`)

    Object.keys(urls).forEach(innerEnv => {
      if (env !== innerEnv) {
        testShTpl.push(`s/${urls[innerEnv].SSO}/${urls[env].SSO}/g;`)
        testShTpl.push(`s/${urls[innerEnv].API_PREFIX}/${urls[env].API_PREFIX}/g;`)
      }
    })

    testShTpl.push('" `find * -type f | grep -E "\.js$"`\n')
  })

  testShTpl.push('fi')

  fs.writeFile(process.cwd() + distFilePath + '/install_testing.sh', testShTpl.join(''), function (e) {
    if (e) console.log(e)
  })
}

function getParam (argv, label) {
  const reg = new RegExp(`^${label}=.+`)
  let result
  argv.some(arg => {
    if (reg.test(arg)) {
      result = arg.split('=')[1]
      return true
    }
  })
  return result
}

