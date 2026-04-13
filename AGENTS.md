# Проект приложения для записи на звонки

## Стек проекта
1. Backend: Java 21 + Spring Boot 3
2. Frontend: Angular 21 + Angular Material (библиотека UI компонентов) + [Angular Calendar](https://www.npmjs.com/package/angular-calendar) для просмотра календаря встреч
3. Database: SQLite, работает в памяти

## Структура проекта
1. Компоненты проекта разложены по папкам `backend`, `frontend`, `database`
2. Документация лежит в `docs`, примеры экранов UI в `docs/img`
3. Проект со спецификацией API TypeSpec в `docs/api/typespec`. Если добавляешь или изменяешь endpoints – сначала изменяй спецификации!

## Сборка frontend проекта
1. Для компиляции и запуска проекта используй Node нужной версии через `nvm use v20.19.1`

## Запуск backend проекта
1. Для запуска используй Java 21 версии, используй команду `mvn clean spring-boot:run`
