#!/bin/bash -x

npm run build

dst=~/AppEngineNode/static/kakeibo_vue
rm -rf $dst
cp -rf dist $dst