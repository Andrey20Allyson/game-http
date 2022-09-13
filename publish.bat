@echo off
git add .
git commit -m %1
git push -u origin %2
@echo on