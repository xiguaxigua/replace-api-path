#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const argv = process.argv.slice(2)

const sourceFilePath = getParam(argv, 's') || './config/urls.js'
const distFilePath = getParam(argv, 'd') || './dist/'
const disablePerf = getParam(argv, 'p') || false

const alphaPerf = 'http:\\/\\/perf.alpha.elenet.me'
const prodPerf = 'https:\\/\\/perf.ele.me'

const urls = require(path.resolve(sourceFilePath)).URL_MAP

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

  prodShTpl.push('" `find * -type f | grep -E "\.js$"`\n')

  if (!disablePerf) {
    prodShTpl.push('  sed -i "')
    prodShTpl.push(`s/${alphaPerf}/${prodPerf}`)
    prodShTpl.push('" `find * -type f | grep -E "\.html$"`\n')
  }

  writeFile(distFilePath + 'install_production.sh', prodShTpl.join(''))

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

  writeFile(distFilePath + 'install_testing.sh', testShTpl.join(''))
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

function writeFile (targetPath, data) {
  fs.writeFile(path.resolve(targetPath), data, function (e) { if (e) console.log(e) })
}
