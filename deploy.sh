#!/bin/bash
yarn build
git add .
git commit -m "deploy"
git push