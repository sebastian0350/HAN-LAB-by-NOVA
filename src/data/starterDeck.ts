export interface StarterWord {
  hanzi: string;
  pinyin: string;
  tone: number;
  translation: string;
  unitId: string;
}

export interface LearningUnit {
  id: string;
  seal: string;
  title: string;
  chinese: string;
  description: string;
}

export const UNITS: LearningUnit[] = [
  {
    id: 'greetings',
    seal: '礼',
    title: 'Приветствия',
    chinese: '问候',
    description: 'Первые фразы вежливости',
  },
  {
    id: 'numbers',
    seal: '数',
    title: 'Числа',
    chinese: '数字',
    description: 'Счёт от одного до десяти',
  },
  {
    id: 'people',
    seal: '人',
    title: 'Люди',
    chinese: '人称',
    description: 'Местоимения и близкий круг',
  },
  {
    id: 'daily',
    seal: '日',
    title: 'Повседневность',
    chinese: '日常',
    description: 'Еда, чай, бытие и отрицание',
  },
];

export const STARTER_DECK: StarterWord[] = [
  { hanzi: '你', pinyin: 'nǐ', tone: 3, translation: 'ты', unitId: 'greetings' },
  { hanzi: '好', pinyin: 'hǎo', tone: 3, translation: 'хороший; здравствуй', unitId: 'greetings' },
  { hanzi: '你好', pinyin: 'nǐ hǎo', tone: 3, translation: 'здравствуйте', unitId: 'greetings' },
  { hanzi: '谢谢', pinyin: 'xièxie', tone: 4, translation: 'спасибо', unitId: 'greetings' },
  { hanzi: '再见', pinyin: 'zàijiàn', tone: 4, translation: 'до свидания', unitId: 'greetings' },
  { hanzi: '请', pinyin: 'qǐng', tone: 3, translation: 'пожалуйста; прошу', unitId: 'greetings' },
  { hanzi: '一', pinyin: 'yī', tone: 1, translation: 'один', unitId: 'numbers' },
  { hanzi: '二', pinyin: 'èr', tone: 4, translation: 'два', unitId: 'numbers' },
  { hanzi: '三', pinyin: 'sān', tone: 1, translation: 'три', unitId: 'numbers' },
  { hanzi: '四', pinyin: 'sì', tone: 4, translation: 'четыре', unitId: 'numbers' },
  { hanzi: '五', pinyin: 'wǔ', tone: 3, translation: 'пять', unitId: 'numbers' },
  { hanzi: '十', pinyin: 'shí', tone: 2, translation: 'десять', unitId: 'numbers' },
  { hanzi: '我', pinyin: 'wǒ', tone: 3, translation: 'я', unitId: 'people' },
  { hanzi: '他', pinyin: 'tā', tone: 1, translation: 'он', unitId: 'people' },
  { hanzi: '她', pinyin: 'tā', tone: 1, translation: 'она', unitId: 'people' },
  { hanzi: '朋友', pinyin: 'péngyou', tone: 2, translation: 'друг', unitId: 'people' },
  { hanzi: '是', pinyin: 'shì', tone: 4, translation: 'быть; являться', unitId: 'daily' },
  { hanzi: '不', pinyin: 'bù', tone: 4, translation: 'не', unitId: 'daily' },
  { hanzi: '的', pinyin: 'de', tone: 0, translation: 'показатель определения', unitId: 'daily' },
  { hanzi: '有', pinyin: 'yǒu', tone: 3, translation: 'иметь; есть', unitId: 'daily' },
  { hanzi: '吃', pinyin: 'chī', tone: 1, translation: 'есть (пищу)', unitId: 'daily' },
  { hanzi: '水', pinyin: 'shuǐ', tone: 3, translation: 'вода', unitId: 'daily' },
  { hanzi: '茶', pinyin: 'chá', tone: 2, translation: 'чай', unitId: 'daily' },
  { hanzi: '学', pinyin: 'xué', tone: 2, translation: 'учиться', unitId: 'daily' },
];
