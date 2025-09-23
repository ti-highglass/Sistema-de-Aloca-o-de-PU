@echo off
echo Configurando repositorio remoto...
git remote add origin https://github.com/ti-highglass/Sistema-de-Aloca-o-de-PU.git

echo Fazendo push para GitHub...
git branch -M main
git push -u origin main

echo.
echo Deploy concluido!
pause