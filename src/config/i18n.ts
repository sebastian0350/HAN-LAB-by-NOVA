// Локализация на русском языке

export const ru = {
  // Общие
  app: {
    name: 'Хань-Лаб',
    subtitle: 'by Nova',
  },

  // Навигация
  nav: {
    today: 'Сегодня',
    path: 'Путь',
    tones: 'Тоны',
    review: 'Повторение',
    profile: 'Профиль',
  },

  // Приветствие
  welcome: {
    title: 'Добро пожаловать',
    subtitle: 'Универсальный тренажёр китайского',
    startGuest: 'Начать без аккаунта',
    createAccount: 'Создать аккаунт',
    signIn: 'Войти',
  },

  // Аккаунты
  auth: {
    email: 'E-mail',
    password: 'Пароль',
    displayName: 'Имя (необязательно)',
    signUp: 'Регистрация',
    logIn: 'Войти',
    logOut: 'Выйти',
    forgotPassword: 'Забыли пароль?',
    resetPassword: 'Сбросить пароль',
    magicLink: 'Войти по ссылке',
    ageConsent: 'Мне есть 14 лет или у меня есть согласие родителей',
    passwordTooShort: 'Пароль должен быть не короче 10 символов',
    emailAlreadyUsed: 'Этот e-mail уже зарегистрирован',
    invalidCredentials: 'Неверный e-mail или пароль',
    checkEmail: 'Проверьте почту для подтверждения',
    passwordResetSent: 'Ссылка для сброса отправлена на почту',
    createAccountLater: 'Создать аккаунт и сохранить прогресс',
  },

  // Профиль
  profile: {
    title: 'Профиль',
    email: 'E-mail',
    memberSince: 'Член с',
    syncStatus: 'Синхронизация',
    synced: 'Синхронизировано {time} назад',
    syncError: 'Ошибка синхронизации',
    exportData: 'Экспорт данных',
    deleteAccount: 'Удалить аккаунт',
    settings: 'Настройки',
  },

  // Удаление аккаунта
  deleteAccount: {
    title: 'Удаление аккаунта',
    warning: 'Это действие необратимо. Все ваши данные в облаке будут удалены.',
    localDataWarning: 'Локальные данные на этом устройстве останутся, пока вы их не очистите вручную.',
    confirm: 'Введите слово «УДАЛИТЬ» для подтверждения',
    confirmPlaceholder: 'УДАЛИТЬ',
    deleteButton: 'Удалить аккаунт',
    cancelled: 'Удаление отменено',
    success: 'Аккаунт удалён',
  },

  // Карточки
  card: {
    forgot: 'Забыл',
    hard: 'Трудно',
    good: 'Хорошо',
    easy: 'Легко',
    showAnswer: 'Показать ответ',
    next: 'Далее',
  },

  // Тоны
  tones: {
    title: 'Тренировка тонов',
    record: 'Записать',
    stop: 'Остановить',
    play: 'Воспроизвести',
    replay: 'Повторить',
    tone1: 'Первый тон (¯)',
    tone2: 'Второй тон (ˊ)',
    tone3: 'Третий тон (ˇ)',
    tone4: 'Четвёртый тон (ˋ)',
    neutral: 'Нейтральный',
    pitch: 'Высота тона',
    time: 'Время',
    yourVoice: 'Ваш голос',
    reference: 'Эталон',
    accuracy: 'Точность',
  },

  // Диагностика
  diagnostic: {
    title: 'Определение уровня',
    start: 'Начать тест',
    question: 'Вопрос',
    of: 'из',
    complete: 'Тест завершён',
    yourLevel: 'Ваш уровень',
    recommended: 'Рекомендуемый уровень',
    restart: 'Пройти заново',
  },

  // Настройки
  settings: {
    title: 'Настройки',
    theme: 'Тема',
    themeLight: 'Светлая',
    themeDark: 'Тёмная',
    themeAuto: 'Системная',
    sound: 'Звуки',
    soundOn: 'Включены',
    soundOff: 'Выключены',
    mascot: 'Панда Бао',
    mascotOn: 'Показывать',
    mascotOff: 'Скрыть',
    font: 'Шрифт иероглифов',
    fontSans: 'Noto Sans SC',
    fontSerif: 'Noto Serif SC',
    dailyGoal: 'Дневная цель',
    cards: 'карточек',
    language: 'Язык интерфейса',
  },

  // Прогресс
  progress: {
    streak: 'Серия',
    days: 'дней',
    today: 'Сегодня',
    completed: 'Выполнено',
    xp: 'XP',
    level: 'Уровень',
    totalWords: 'Всего слов',
    mastered: 'Освоено',
    learning: 'Изучается',
  },

  // Путь
  path: {
    title: 'Ваш путь',
    skip: 'Пропустить тему → пройти тест',
    startLesson: 'Начать занятие',
    locked: 'Заблокировано',
    completed: 'Завершено',
  },

  // Ошибки
  error: {
    network: 'Ошибка сети. Проверьте подключение к интернету.',
    microphone: 'Нет доступа к микрофону. Разрешите доступ в настройках браузера.',
    sync: 'Ошибка синхронизации. Данные сохранены локально.',
    unknown: 'Произошла ошибка. Попробуйте позже.',
  },

  // Страницы
  pages: {
    privacy: 'Политика конфиденциальности',
    terms: 'Условия использования',
    about: 'О проекте',
  },

  // Печать (достижения)
  seal: {
    mastered: 'Освоено',
    excellent: 'Отлично',
    perfect: 'Совершенно',
    tonesMaster: 'Мастер тонов',
    hundredWords: '100 слов',
    streakWeek: 'Неделя серии',
  },
} as const;

export type TranslationKey = keyof typeof ru;
