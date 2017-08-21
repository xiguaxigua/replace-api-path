#!/bin/bash
sed -i "s/alpha-sso/prod-sso/g;s/alpha-httpizza/prod-httpizza/g;s/beta-sso/prod-sso/g;s/beta-httpizza/prod-httpizza/g;" `find * -type f | grep -E ".js$"`
sed -i "s/http:\/\/a.com/b.com/g" `find * -type f | grep -E ".html$"`
sed -i "s/http:\/\/e.com/f.com/g" `find * -type f | grep -E ".html$"`
