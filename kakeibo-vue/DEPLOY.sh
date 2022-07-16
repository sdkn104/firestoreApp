#!/bin/bash -x

npm run build

dst=~/AppEngineNode/static/kakeibo_vue

cp -rf dist $dst