#!/bin/bash
if [ "$ENV" = "alpha" ]; then
  sed -i "s/beta-httpizza/alpha-httpizza/g;" `find * -type f | grep -E ".js$"`
elif [ "$ENV" = "beta" ]; then
  sed -i "s/alpha-httpizza/beta-httpizza/g;" `find * -type f | grep -E ".js$"`
fi
sed -i "s/http:\/\/c.com/d.com/g" `find * -type f | grep -E ".html$"`
sed -i "s/http:\/\/g.com/h.com/g" `find * -type f | grep -E ".js$"`
