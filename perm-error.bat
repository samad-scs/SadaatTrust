@echo off
echo =============================
echo  Cleaning Node Modules, Prisma, and Cache
echo =============================

REM Stop any Node/Next.js/Prisma processes if needed
echo Please make sure to stop any running dev servers before proceeding.
pause

REM Remove node_modules
echo Deleting node_modules folder...
rd /s /q node_modules

REM Remove .next folder (for Next.js projects)
if exist ".next" (
    echo Deleting .next folder...
    rd /s /q .next
)

REM Remove .prisma folder
if exist ".prisma" (
    echo Deleting .prisma folder...
    rd /s /q .prisma
)

REM Remove yarn.lock file
if exist "yarn.lock" (
    echo Deleting yarn.lock file...
    del /f /q yarn.lock
)

echo =============================
echo  Reinstalling Dependencies...
echo =============================
yarn install

echo =============================
echo  All Done!
echo Now you can run your yarn add or yarn dev command.
echo =============================
pause
