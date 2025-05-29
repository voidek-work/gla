#!/bin/bash

# Остановка при ошибках
set -e

# Обновление кода
echo "Обновление кода..."
git pull origin master

# Установка зависимостей
echo "Установка зависимостей..."
npm install

# Сборка проекта
echo "Сборка проекта..."
npm run build

# Копирование файлов на сервер
echo "Копирование файлов на сервер..."
rsync -avz --delete dist/ /home/botuser/sto-batumi/dist/

echo "Деплой завершен успешно!" 