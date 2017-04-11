#!/bin/bash
  sed -i "s/alpha-sso/prod-sso;s/alpha-httpizza/prod-httpizza;s/beta-sso/prod-sso;s/beta-httpizza/prod-httpizza;" `find * -type f | grep -E ".js$"`