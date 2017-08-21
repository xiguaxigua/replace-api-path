#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const argv = process.argv.slice(2)

const sourceFilePath = getParam(argv, 's') || './config/urls.js'
const distFilePath = getParam(argv, 'd') || './dist/'

const settings = require(path.resolve(sourceFilePath))

const urls = settings.URL_MAP
const prodReplace = settings.prodReplace
const testReplace = settings.testReplace
// escape '/'
Object.keys(urls).forEach(env => {
  Object.keys(urls[env]).forEach(key => {
    urls[env][key] = urls[env][key].replace(/\//g, '\\/')
  })
})

const replaceTmp = [prodReplace, testReplace]
replaceTmp.forEach(options => {
  if (options && options.length) {
    options.forEach(item => {
      if (item) {
        item.from = item.from.replace(/\//g, '\\/')
        item.to = item.to.replace(/\//g, '\\/')
      }
    })
  }
})

if (urls.prod) {
  const prodShTpl = ['#!/bin/bash\n']
  const prodSSO = urls.prod.SSO
  const prodApiPrefix = urls.prod.API_PREFIX
  if (prodSSO || prodApiPrefix) {

    prodShTpl.push('sed -i "')
    
    Object.keys(urls).forEach(env => {
      if (env !== 'prod') {
        if (prodSSO) prodShTpl.push(`s/${urls[env].SSO}/${prodSSO}/g;`)
        if (prodApiPrefix) prodShTpl.push(`s/${urls[env].API_PREFIX}/${prodApiPrefix}/g;`)
        }
      })

    prodShTpl.push('" `find * -type f | grep -E "\.js$"`\n')
  }

  if (prodReplace && prodReplace.length) {
    prodReplace.forEach(item => {
      prodShTpl.push('sed -i "')
      prodShTpl.push(`s/${item.from}/${item.to}/g`)
      prodShTpl.push(`" \`find * -type f | grep -E "\.${item.type}$"\`\n`)
    })
  }

  writeFile(distFilePath + 'install_production.sh', prodShTpl.join(''))

  delete urls.prod
}

if (Object.keys(urls).length >= 1) {
  const testShTpl = ['#!/bin/bash\n']
  
  Object.keys(urls).forEach(env => {
    const testSSO = urls[env].SSO
    const testApiPrefix = urls[env].API_PREFIX

    if (testSSO || testApiPrefix) {
      testShTpl.push(!testShTpl[1] ? 'if' : 'elif')
      testShTpl.push(` [ "$ENV" = "${env}" ]; then\n`)
      testShTpl.push(`  sed -i "`)

      Object.keys(urls).forEach(innerEnv => {
        if (env !== innerEnv) {
          if (testSSO) testShTpl.push(`s/${urls[innerEnv].SSO}/${testSSO}/g;`)
          if (testApiPrefix) testShTpl.push(`s/${urls[innerEnv].API_PREFIX}/${testApiPrefix}/g;`)
        }
      })

      testShTpl.push('" `find * -type f | grep -E "\.js$"`\n')
    }
  })

  testShTpl.push('fi\n')

  if (testReplace && testReplace.length) {
    testReplace.forEach(item => {
      testShTpl.push('sed -i "')
      testShTpl.push(`s/${item.from}/${item.to}/g`)
      testShTpl.push(`" \`find * -type f | grep -E "\.${item.type}$"\`\n`)
    })
  }

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
