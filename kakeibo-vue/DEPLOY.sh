#!/bin/bash -c

npm run build
cp -rf dist ~/AppEngineNode/static/kakeibo_vue
