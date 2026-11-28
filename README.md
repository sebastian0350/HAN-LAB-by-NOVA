# Хань-Лаб by Nova

Универсальный тренажёр китайского языка для любого уровня (от нуля до HSK 9). PWA-приложение с local-first архитектурой, работает офлайн и поддерживает синхронизацию прогресса.

## Особенности

- **Local-first:** работает без интернета, данные хранятся на устройстве (IndexedDB)
- **Аккаунты:** гостевой режим + регистрация по e-mail через Supabase
- **Синхронизация:** прогресс синхронизируется между устройствами
- **Интервальное повторение:** алгоритм FSRS для эффективного запоминания
- **Тренировка тонов:** запись голоса и анализ через Web Audio API
- **Дизайн:** тёплый китайский стиль с бамбуком, печатью и пандой-талисманом
- **PWA:** можно добавить на главный экран iPhone/Android как приложение

## Технологии

- **Frontend:** React + TypeScript + Vite
- **База данных:** IndexedDB (Dexie) для локального хранения
- **Бэкенд:** Supabase (PostgreSQL + Auth) для синхронизации
- **Аудио:** Web Audio API для анализа тонов
- **Хостинг:** GitHub Pages (статический)
- **Тестирование:** Vitest + Playwright

## Структура проекта

```
src/
├── components/       # UI компоненты
├── screens/          # Экраны приложения
├── hooks/            # React hooks
├── core/             # Бизнес-логика (FSRS, анализ тонов)
├── db/               # Схема IndexedDB
├── lib/              # Внешние библиотеки (Supabase)
├── config/           # Конфигурация (уровни HSK, локализация)
└── styles/           # CSS переменные и глобальные стили

supabase/
└── migrations/       # SQL миграции для БД

docs/
└── DEPLOY.md         # Инструкция по запуску
```

## Разработка

### Установка зависимостей

```bash
npm install
```

### Запуск локально

```bash
npm run dev
```

### Сборка

```bash
npm run build
```

### Тесты

```bash
npm run test
```

## Переменные окружения

Создайте файл `.env` на основе `.env.example`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Запуск в продакшн

Подробная инструкция в `docs/DEPLOY.md`.

Кратко:
1. Создайте репозиторий на GitHub
2. Создайте проект в Supabase и выполните миграцию `supabase/migrations/001_init.sql`
3. Подключите репозиторий к Cloudflare Pages
4. Добавьте переменные окружения в Cloudflare
5. Обновите URL в Supabase Authentication

## Лицензия

Данные слов и примеров:
- CC-CEDICT (Creative Commons Attribution-ShareAlike 4.0)
- Tatoeba (Creative Commons Attribution 2.0)

Шрифты:
- Noto Sans SC / Noto Serif SC (SIL Open Font License 1.1)

Код проекта:
- MIT License

---

by Nova
