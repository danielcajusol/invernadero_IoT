#!/bin/bash
npm install --legacy-peer-deps -D \
jest \
ts-jest \
jest-environment-jsdom \
@types/jest \
@testing-library/react \
@testing-library/jest-dom \
@testing-library/user-event
@testing-library/dom

echo ""
echo "==================================="
echo " verifico instalacion de Jest"
echo "==================================="
echo ""

npm list jest
npm list @types/jest
npx jest --version

echo ""
echo "==================================="
echo " Ejecutando tests frontend"
echo "==================================="
echo ""

npm test

RESULT=$?

echo ""
echo "==================================="
echo " Resultado: $RESULT"
echo "==================================="

exit $RESULT