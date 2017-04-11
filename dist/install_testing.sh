#!/bin/bash
if [ "$ENV" = "alpha" ]; then
  sed -i "s/beta-sso/alpha-sso/g;s/beta-httpizza/alpha-httpizza/g;" `find * -type f | grep -E ".js$"`
elif [ "$ENV" = "beta" ]; then
  sed -i "s/alpha-sso/beta-sso/g;s/alpha-httpizza/beta-httpizza/g;" `find * -type f | grep -E ".js$"`
fi