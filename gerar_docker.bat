@echo off
echo Construindo imagem Docker...
docker build -t sistema-pu:latest .

echo Gerando arquivo .tar...
docker save -o sistema-pu.tar sistema-pu:latest

echo Imagem salva como sistema-pu.tar
pause