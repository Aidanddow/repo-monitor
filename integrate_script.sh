#!/bin/bash

cd dev-evaluation
npm run build
sed '1 i\
 {% load static %}
 ' build/index.html > ../backend/templates/index.html
cp  -R "build/static" "../backend/"
