// 80 базовых слов HSK 1 с примерами, пиньинем, тонами и мнемоникой

export interface HskWord {
  id: string;
  hanzi: string;
  pinyin: string;
  tones: number[]; // тон каждого слога (1, 2, 3, 4, 0 - нейтральный)
  translation: string;
  hsk: 1 | 2 | 3 | 4;
  tags: string[];
  category: string;
  example?: string;
  examplePinyin?: string;
  exampleRu?: string;
  radical?: string;
  mnemonic?: string;
}

export const HSK1_CATEGORIES: Record<string, { title: string; seal: string; description: string }> = {
  greeting: { title: 'Приветствия и вежливость', seal: '礼', description: 'Базовые фразы этикета и общения' },
  pronoun:  { title: 'Местоимения', seal: '人', description: 'Личные и указательные местоимения' },
  number:   { title: 'Числа и счёт', seal: '数', description: 'Числительные от нуля до ста' },
  time:     { title: 'Время и даты', seal: '日', description: 'Дни, месяцы и части суток' },
  verb:     { title: 'Глаголы действия', seal: '行', description: 'Основные повседневные действия' },
  noun:     { title: 'Люди, места и предметы', seal: '物', description: 'Семья, учёба, еда и окружение' },
  adj:      { title: 'Признаки и грамматика', seal: '文', description: 'Прилагательные, частицы и вопросы' },
};

export const HSK1_WORDS: HskWord[] = [
  // ── 1. Приветствия и вежливость (6 слов) ──
  { id: 'h1_001', hanzi: '你好', pinyin: 'nǐ hǎo', tones: [3, 3], translation: 'привет; здравствуйте', hsk: 1, tags: ['greeting'], category: 'greeting', example: '你好，你叫什么名字？', examplePinyin: 'Nǐ hǎo, nǐ jiào shénme míngzi?', exampleRu: 'Привет, как тебя зовут?', mnemonic: '你 (ты) + 好 (хороший) = желаю добра' },
  { id: 'h1_002', hanzi: '谢谢', pinyin: 'xièxie', tones: [4, 0], translation: 'спасибо', hsk: 1, tags: ['greeting'], category: 'greeting', example: '谢谢你的帮助！', examplePinyin: 'Xièxie nǐ de bāngzhù!', exampleRu: 'Спасибо за твою помощь!', mnemonic: 'Искреннее слово благодарности' },
  { id: 'h1_003', hanzi: '不客气', pinyin: 'bù kèqi', tones: [4, 4, 0], translation: 'пожалуйста (не за что)', hsk: 1, tags: ['greeting'], category: 'greeting', example: '— 谢谢！— 不客气。', examplePinyin: '— Xièxie! — Bù kèqi.', exampleRu: '— Спасибо! — Не за что.', mnemonic: 'Не (不) церемонься как гость (客气)' },
  { id: 'h1_004', hanzi: '再见', pinyin: 'zàijiàn', tones: [4, 4], translation: 'до свидания', hsk: 1, tags: ['greeting'], category: 'greeting', example: '明天见，再见！', examplePinyin: 'Míngtiān jiàn, zàijiàn!', exampleRu: 'Увидимся завтра, до свидания!', mnemonic: '再 (снова) + 见 (видеть) = до встречи' },
  { id: 'h1_005', hanzi: '请', pinyin: 'qǐng', tones: [3], translation: 'пожалуйста (прошу)', hsk: 1, tags: ['greeting'], category: 'greeting', example: '请喝茶。', examplePinyin: 'Qǐng hē chá.', exampleRu: 'Пожалуйста, выпейте чаю.', radical: '讠' },
  { id: 'h1_006', hanzi: '对不起', pinyin: 'duìbuqǐ', tones: [4, 0, 3], translation: 'извините; простите', hsk: 1, tags: ['greeting'], category: 'greeting', example: '对不起，我来晚了。', examplePinyin: 'Duìbuqǐ, wǒ lái wǎn le.', exampleRu: 'Извините, я опоздал.' },

  // ── 2. Местоимения (9 слов) ──
  { id: 'h1_007', hanzi: '我', pinyin: 'wǒ', tones: [3], translation: 'я', hsk: 1, tags: ['pronoun'], category: 'pronoun', example: '我是学生。', examplePinyin: 'Wǒ shì xuésheng.', exampleRu: 'Я — студент.', radical: '戈', mnemonic: 'Рука с копьём — защищаю себя = Я' },
  { id: 'h1_008', hanzi: '你', pinyin: 'nǐ', tones: [3], translation: 'ты', hsk: 1, tags: ['pronoun'], category: 'pronoun', example: '你是哪国人？', examplePinyin: 'Nǐ shì nǎ guó rén?', exampleRu: 'Из какой ты страны?', radical: '亻' },
  { id: 'h1_009', hanzi: '他', pinyin: 'tā', tones: [1], translation: 'он', hsk: 1, tags: ['pronoun'], category: 'pronoun', example: '他是我的朋友。', examplePinyin: 'Tā shì wǒ de péngyou.', exampleRu: 'Он — мой друг.', radical: '亻' },
  { id: 'h1_010', hanzi: '她', pinyin: 'tā', tones: [1], translation: 'она', hsk: 1, tags: ['pronoun'], category: 'pronoun', example: '她是汉语老师。', examplePinyin: 'Tā shì Hànyǔ lǎoshī.', exampleRu: 'Она — учитель китайского языка.', radical: '女' },
  { id: 'h1_011', hanzi: '我们', pinyin: 'wǒmen', tones: [3, 0], translation: 'мы', hsk: 1, tags: ['pronoun'], category: 'pronoun', example: '我们一起去学校。', examplePinyin: 'Wǒmen yīqǐ qù xuéxiào.', exampleRu: 'Мы вместе идём в школу.' },
  { id: 'h1_012', hanzi: '你们', pinyin: 'nǐmen', tones: [3, 0], translation: 'вы (мн. ч.)', hsk: 1, tags: ['pronoun'], category: 'pronoun', example: '你们好！', examplePinyin: 'Nǐmen hǎo!', exampleRu: 'Здравствуйте (всем вам)!' },
  { id: 'h1_013', hanzi: '他们', pinyin: 'tāmen', tones: [1, 0], translation: 'они', hsk: 1, tags: ['pronoun'], category: 'pronoun', example: '他们在看书。', examplePinyin: 'Tāmen zài kàn shū.', exampleRu: 'Они читают книгу.' },
  { id: 'h1_014', hanzi: '这', pinyin: 'zhè', tones: [4], translation: 'это; этот', hsk: 1, tags: ['pronoun'], category: 'pronoun', example: '这是我的书。', examplePinyin: 'Zhè shì wǒ de shū.', exampleRu: 'Это моя книга.' },
  { id: 'h1_015', hanzi: '那', pinyin: 'nà', tones: [4], translation: 'то; тот', hsk: 1, tags: ['pronoun'], category: 'pronoun', example: '那是什么？', examplePinyin: 'Nà shì shénme?', exampleRu: 'Что то такое?' },

  // ── 3. Числа и счёт (12 слов) ──
  { id: 'h1_016', hanzi: '零', pinyin: 'líng', tones: [2], translation: 'ноль', hsk: 1, tags: ['number'], category: 'number', example: '二零二六年', examplePinyin: 'Èr líng èr liù nián', exampleRu: '2026 год' },
  { id: 'h1_017', hanzi: '一', pinyin: 'yī', tones: [1], translation: 'один', hsk: 1, tags: ['number'], category: 'number', example: '一个人', examplePinyin: 'Yī gè rén', exampleRu: 'Один человек', radical: '一', mnemonic: 'Одна горизонтальная черта = 1' },
  { id: 'h1_018', hanzi: '二', pinyin: 'èr', tones: [4], translation: 'два', hsk: 1, tags: ['number'], category: 'number', example: '二月', examplePinyin: 'Èr yuè', exampleRu: 'Февраль (второй месяц)', radical: '二', mnemonic: 'Две горизонтальные черты = 2' },
  { id: 'h1_019', hanzi: '三', pinyin: 'sān', tones: [1], translation: 'три', hsk: 1, tags: ['number'], category: 'number', example: '三本书', examplePinyin: 'Sān běn shū', exampleRu: 'Три книги', radical: '一', mnemonic: 'Три горизонтальные черты = 3' },
  { id: 'h1_020', hanzi: '四', pinyin: 'sì', tones: [4], translation: 'четыре', hsk: 1, tags: ['number'], category: 'number', example: '四个人', examplePinyin: 'Sì gè rén', exampleRu: 'Четыре человека', radical: '囗', mnemonic: 'Окно с четырьмя углами = 4' },
  { id: 'h1_021', hanzi: '五', pinyin: 'wǔ', tones: [3], translation: 'пять', hsk: 1, tags: ['number'], category: 'number', example: '星期五', examplePinyin: 'Xīngqīwǔ', exampleRu: 'Пятница' },
  { id: 'h1_022', hanzi: '六', pinyin: 'liù', tones: [4], translation: 'шесть', hsk: 1, tags: ['number'], category: 'number', example: '六点', examplePinyin: 'Liù diǎn', exampleRu: 'Шесть часов' },
  { id: 'h1_023', hanzi: '七', pinyin: 'qī', tones: [1], translation: 'семь', hsk: 1, tags: ['number'], category: 'number', example: '七天', examplePinyin: 'Qī tiān', exampleRu: 'Семь дней' },
  { id: 'h1_024', hanzi: '八', pinyin: 'bā', tones: [1], translation: 'восемь', hsk: 1, tags: ['number'], category: 'number', example: '八月八日', examplePinyin: 'Bā yuè bā rì', exampleRu: 'Восьмое августа', radical: '八', mnemonic: 'Символ богатства и удачи в Китае = 8' },
  { id: 'h1_025', hanzi: '九', pinyin: 'jiǔ', tones: [3], translation: 'девять', hsk: 1, tags: ['number'], category: 'number', example: '九月', examplePinyin: 'Jiǔ yuè', exampleRu: 'Сентябрь' },
  { id: 'h1_026', hanzi: '十', pinyin: 'shí', tones: [2], translation: 'десять', hsk: 1, tags: ['number'], category: 'number', example: '十块钱', examplePinyin: 'Shí kuài qián', exampleRu: 'Десять юаней', radical: '十', mnemonic: 'Перекрёсток из двух линий = 10' },
  { id: 'h1_027', hanzi: '百', pinyin: 'bǎi', tones: [3], translation: 'сто', hsk: 1, tags: ['number'], category: 'number', example: '一百', examplePinyin: 'Yībǎi', exampleRu: 'Сто (100)' },

  // ── 4. Время и даты (10 слов) ──
  { id: 'h1_028', hanzi: '今天', pinyin: 'jīntiān', tones: [1, 1], translation: 'сегодня', hsk: 1, tags: ['time'], category: 'time', example: '今天天气很好。', examplePinyin: 'Jīntiān tiānqì hěn hǎo.', exampleRu: 'Сегодня погода очень хорошая.' },
  { id: 'h1_029', hanzi: '明天', pinyin: 'míngtiān', tones: [2, 1], translation: 'завтра', hsk: 1, tags: ['time'], category: 'time', example: '明天我去北京。', examplePinyin: 'Míngtiān wǒ qù Běijīng.', exampleRu: 'Завтра я поеду в Пекин.' },
  { id: 'h1_030', hanzi: '昨天', pinyin: 'zuótiān', tones: [2, 1], translation: 'вчера', hsk: 1, tags: ['time'], category: 'time', example: '昨天是星期日。', examplePinyin: 'Zuótiān shì xīngqīrì.', exampleRu: 'Вчера было воскресенье.' },
  { id: 'h1_031', hanzi: '年', pinyin: 'nián', tones: [2], translation: 'год', hsk: 1, tags: ['time'], category: 'time', example: '今年是哪一年？', examplePinyin: 'Jīnnián shì nǎ yī nián?', exampleRu: 'Какой сейчас год?' },
  { id: 'h1_032', hanzi: '月', pinyin: 'yuè', tones: [4], translation: 'месяц; луна', hsk: 1, tags: ['time'], category: 'time', example: '五月一日', examplePinyin: 'Wǔ yuè yī rì', exampleRu: 'Первое мая', radical: '月', mnemonic: 'Силуэт полумесяца на небе' },
  { id: 'h1_033', hanzi: '日', pinyin: 'rì', tones: [4], translation: 'день; солнце', hsk: 1, tags: ['time'], category: 'time', example: '今日', examplePinyin: 'Jīnrì', exampleRu: 'Сегодняшний день', radical: '日', mnemonic: 'Контур солнца с лучом внутри' },
  { id: 'h1_034', hanzi: '星期', pinyin: 'xīngqī', tones: [1, 1], translation: 'неделя; день недели', hsk: 1, tags: ['time'], category: 'time', example: '今天星期几？', examplePinyin: 'Jīntiān xīngqī jǐ?', exampleRu: 'Какой сегодня день недели?' },
  { id: 'h1_035', hanzi: '现在', pinyin: 'xiànzài', tones: [4, 4], translation: 'сейчас', hsk: 1, tags: ['time'], category: 'time', example: '现在几点？', examplePinyin: 'Xiànzài jǐ diǎn?', exampleRu: 'Который сейчас час?' },
  { id: 'h1_036', hanzi: '上午', pinyin: 'shàngwǔ', tones: [4, 3], translation: 'утро (до полудня)', hsk: 1, tags: ['time'], category: 'time', example: '上午我在工作。', examplePinyin: 'Shàngwǔ wǒ zài gōngzuò.', exampleRu: 'Утром я работаю.' },
  { id: 'h1_037', hanzi: '下午', pinyin: 'xiàwǔ', tones: [4, 3], translation: 'день (после полудня)', hsk: 1, tags: ['time'], category: 'time', example: '下午我们去喝茶。', examplePinyin: 'Xiàwǔ wǒmen qù hē chá.', exampleRu: 'После полудня мы пойдём пить чай.' },

  // ── 5. Глаголы действия (17 слов) ──
  { id: 'h1_038', hanzi: '是', pinyin: 'shì', tones: [4], translation: 'быть; являться', hsk: 1, tags: ['verb'], category: 'verb', example: '我是中国人。', examplePinyin: 'Wǒ shì Zhōngguórén.', exampleRu: 'Я — китаец.' },
  { id: 'h1_039', hanzi: '有', pinyin: 'yǒu', tones: [3], translation: 'иметь; есть (в наличии)', hsk: 1, tags: ['verb'], category: 'verb', example: '我有一个好朋友。', examplePinyin: 'Wǒ yǒu yī gè hǎo péngyou.', exampleRu: 'У меня есть хороший друг.' },
  { id: 'h1_040', hanzi: '叫', pinyin: 'jiào', tones: [4], translation: 'звать; называться', hsk: 1, tags: ['verb'], category: 'verb', example: '我叫李明。', examplePinyin: 'Wǒ jiào Lǐ Míng.', exampleRu: 'Меня зовут Ли Мин.' },
  { id: 'h1_041', hanzi: '来', pinyin: 'lái', tones: [2], translation: 'приходить; приезжать', hsk: 1, tags: ['verb'], category: 'verb', example: '欢迎你来中国！', examplePinyin: 'Huānyíng nǐ lái Zhōngguó!', exampleRu: 'Добро пожаловать в Китай!' },
  { id: 'h1_042', hanzi: '去', pinyin: 'qù', tones: [4], translation: 'идти; ехать (туда)', hsk: 1, tags: ['verb'], category: 'verb', example: '我去商店买东西。', examplePinyin: 'Wǒ qù shāngdiàn mǎi dōngxi.', exampleRu: 'Я иду в магазин за покупками.' },
  { id: 'h1_043', hanzi: '吃', pinyin: 'chī', tones: [1], translation: 'есть; кушать', hsk: 1, tags: ['verb'], category: 'verb', example: '你喜欢吃什么？', examplePinyin: 'Nǐ xǐhuān chī shénme?', exampleRu: 'Что ты любишь есть?', radical: '口' },
  { id: 'h1_044', hanzi: '喝', pinyin: 'hē', tones: [1], translation: 'пить', hsk: 1, tags: ['verb'], category: 'verb', example: '我想喝水。', examplePinyin: 'Wǒ xiǎng hē shuǐ.', exampleRu: 'Я хочу выпить воды.', radical: '口' },
  { id: 'h1_045', hanzi: '看', pinyin: 'kàn', tones: [4], translation: 'смотреть; читать', hsk: 1, tags: ['verb'], category: 'verb', example: '我在看书。', examplePinyin: 'Wǒ zài kàn shū.', exampleRu: 'Я читаю книгу.', mnemonic: 'Рука (手) над глазом (目) — всматриваться вдаль' },
  { id: 'h1_046', hanzi: '听', pinyin: 'tīng', tones: [1], translation: 'слушать', hsk: 1, tags: ['verb'], category: 'verb', example: '请听老师说。', examplePinyin: 'Qǐng tīng lǎoshī shuō.', exampleRu: 'Пожалуйста, послушайте учителя.' },
  { id: 'h1_047', hanzi: '说', pinyin: 'shuō', tones: [1], translation: 'говорить; сказать', hsk: 1, tags: ['verb'], category: 'verb', example: '你会说汉语吗？', examplePinyin: 'Nǐ huì shuō Hànyǔ ma?', exampleRu: 'Ты умеешь говорить по-китайски?', radical: '讠' },
  { id: 'h1_048', hanzi: '读', pinyin: 'dú', tones: [2], translation: 'читать (вслух)', hsk: 1, tags: ['verb'], category: 'verb', example: '请读这个汉字。', examplePinyin: 'Qǐng dú zhège Hànzì.', exampleRu: 'Пожалуйста, прочитайте этот иероглиф.' },
  { id: 'h1_049', hanzi: '写', pinyin: 'xiě', tones: [3], translation: 'писать', hsk: 1, tags: ['verb'], category: 'verb', example: '我学习写汉字。', examplePinyin: 'Wǒ xuéxí xiě Hànzì.', exampleRu: 'Я учусь писать китайские иероглифы.' },
  { id: 'h1_050', hanzi: '学习', pinyin: 'xuéxí', tones: [2, 2], translation: 'учиться; изучать', hsk: 1, tags: ['verb'], category: 'verb', example: '我在学习汉语。', examplePinyin: 'Wǒ zài xuéxí Hànyǔ.', exampleRu: 'Я изучаю китайский язык.' },
  { id: 'h1_051', hanzi: '工作', pinyin: 'gōngzuò', tones: [1, 4], translation: 'работать; работа', hsk: 1, tags: ['verb'], category: 'verb', example: '他在医院工作。', examplePinyin: 'Tā zài yīyuàn gōngzuò.', exampleRu: 'Он работает в больнице.' },
  { id: 'h1_052', hanzi: '买', pinyin: 'mǎi', tones: [3], translation: 'покупать', hsk: 1, tags: ['verb'], category: 'verb', example: '我想买苹果。', examplePinyin: 'Wǒ xiǎng mǎi píngguǒ.', exampleRu: 'Я хочу купить яблоки.' },
  { id: 'h1_053', hanzi: '喜欢', pinyin: 'xǐhuān', tones: [3, 1], translation: 'нравиться; любить', hsk: 1, tags: ['verb'], category: 'verb', example: '我喜欢喝中国茶。', examplePinyin: 'Wǒ xǐhuān hē Zhōngguó chá.', exampleRu: 'Мне нравится пить китайский чай.' },
  { id: 'h1_054', hanzi: '想', pinyin: 'xiǎng', tones: [3], translation: 'хотеть; думать; скучать', hsk: 1, tags: ['verb'], category: 'verb', example: '我想去中国。', examplePinyin: 'Wǒ xiǎng qù Zhōngguó.', exampleRu: 'Я хочу поехать в Китай.', radical: '心' },

  // ── 6. Люди, места и предметы (14 слов) ──
  { id: 'h1_055', hanzi: '人', pinyin: 'rén', tones: [2], translation: 'человек; люди', hsk: 1, tags: ['noun'], category: 'noun', example: '他是一个好人。', examplePinyin: 'Tā shì yī gè hǎo rén.', exampleRu: 'Он — хороший человек.', radical: '人', mnemonic: 'Шагающий человек в профиль' },
  { id: 'h1_056', hanzi: '中国', pinyin: 'Zhōngguó', tones: [1, 2], translation: 'Китай', hsk: 1, tags: ['noun', 'country'], category: 'noun', example: '中国很大。', examplePinyin: 'Zhōngguó hěn dà.', exampleRu: 'Китай очень большой.', mnemonic: '中 (середина) + 国 (государство)' },
  { id: 'h1_057', hanzi: '汉语', pinyin: 'Hànyǔ', tones: [4, 3], translation: 'китайский язык', hsk: 1, tags: ['noun', 'language'], category: 'noun', example: '汉语很有意思。', examplePinyin: 'Hànyǔ hěn yǒu yìsi.', exampleRu: 'Китайский язык очень интересный.' },
  { id: 'h1_058', hanzi: '朋友', pinyin: 'péngyou', tones: [2, 0], translation: 'друг', hsk: 1, tags: ['noun'], category: 'noun', example: '他是我的好朋友。', examplePinyin: 'Tā shì wǒ de hǎo péngyou.', exampleRu: 'Он — мой хороший друг.', mnemonic: 'Две луны (朋) рядом + две руки (友) = друг' },
  { id: 'h1_059', hanzi: '老师', pinyin: 'lǎoshī', tones: [3, 1], translation: 'учитель; преподаватель', hsk: 1, tags: ['noun', 'occupation'], category: 'noun', example: '王老师好！', examplePinyin: 'Wáng lǎoshī hǎo!', exampleRu: 'Здравствуйте, учитель Ван!' },
  { id: 'h1_060', hanzi: '学生', pinyin: 'xuésheng', tones: [2, 0], translation: 'студент; ученик', hsk: 1, tags: ['noun', 'occupation'], category: 'noun', example: '我是大学生。', examplePinyin: 'Wǒ shì dàxuéshēng.', exampleRu: 'Я — студент университета.' },
  { id: 'h1_061', hanzi: '家', pinyin: 'jiā', tones: [1], translation: 'дом; семья', hsk: 1, tags: ['noun'], category: 'noun', example: '我回家。', examplePinyin: 'Wǒ huí jiā.', exampleRu: 'Я возвращаюсь домой.', radical: '宀', mnemonic: 'Крыша (宀) над очагом = дом, семья' },
  { id: 'h1_062', hanzi: '学校', pinyin: 'xuéxiào', tones: [2, 4], translation: 'школа; учебное заведение', hsk: 1, tags: ['noun', 'place'], category: 'noun', example: '学校在前面。', examplePinyin: 'Xuéxiào zài qiánmiàn.', exampleRu: 'Школа находится впереди.' },
  { id: 'h1_063', hanzi: '书', pinyin: 'shū', tones: [1], translation: 'книга', hsk: 1, tags: ['noun'], category: 'noun', example: '这是一本汉语书。', examplePinyin: 'Zhè shì yī běn Hànyǔ shū.', exampleRu: 'Это книга по китайскому языку.' },
  { id: 'h1_064', hanzi: '水', pinyin: 'shuǐ', tones: [3], translation: 'вода', hsk: 1, tags: ['noun', 'food'], category: 'noun', example: '请给我一杯水。', examplePinyin: 'Qǐng gěi wǒ yī bēi shuǐ.', exampleRu: 'Дайте мне, пожалуйста, стакан воды.', radical: '水', mnemonic: 'Поток реки с брызгами = вода' },
  { id: 'h1_065', hanzi: '茶', pinyin: 'chá', tones: [2], translation: 'чай', hsk: 1, tags: ['noun', 'food'], category: 'noun', example: '中国人喜欢喝茶。', examplePinyin: 'Zhōngguórén xǐhuān hē chá.', exampleRu: 'Китайцы любят пить чай.', radical: '艹', mnemonic: 'Трава (艹), человек (人) и дерево (木) = чай' },
  { id: 'h1_066', hanzi: '米饭', pinyin: 'mǐfàn', tones: [3, 4], translation: 'варёный рис', hsk: 1, tags: ['noun', 'food'], category: 'noun', example: '我吃米饭。', examplePinyin: 'Wǒ chī mǐfàn.', exampleRu: 'Я ем рис.' },
  { id: 'h1_067', hanzi: '钱', pinyin: 'qián', tones: [2], translation: 'деньги', hsk: 1, tags: ['noun'], category: 'noun', example: '这个多少钱？', examplePinyin: 'Zhège duōshao qián?', exampleRu: 'Сколько это стоит?', radical: '钅' },
  { id: 'h1_068', hanzi: '名字', pinyin: 'míngzi', tones: [2, 0], translation: 'имя', hsk: 1, tags: ['noun'], category: 'noun', example: '你的名字很好听。', examplePinyin: 'Nǐ de míngzi hěn hǎotīng.', exampleRu: 'Твоё имя очень красиво звучит.' },

  // ── 7. Прилагательные, частицы и вопросы (12 слов) ──
  { id: 'h1_069', hanzi: '好', pinyin: 'hǎo', tones: [3], translation: 'хороший; хорошо', hsk: 1, tags: ['adj'], category: 'adj', example: '今天天气很好。', examplePinyin: 'Jīntiān tiānqì hěn hǎo.', exampleRu: 'Сегодня погода очень хорошая.', radical: '女', mnemonic: 'Женщина (女) с ребёнком (子) = счастье, хорошо' },
  { id: 'h1_070', hanzi: '大', pinyin: 'dà', tones: [4], translation: 'большой', hsk: 1, tags: ['adj'], category: 'adj', example: '这个苹果很大。', examplePinyin: 'Zhège píngguǒ hěn dà.', exampleRu: 'Это яблоко очень большое.', radical: '大', mnemonic: 'Человек широко раскинул руки = большой' },
  { id: 'h1_071', hanzi: '小', pinyin: 'xiǎo', tones: [3], translation: 'маленький', hsk: 1, tags: ['adj'], category: 'adj', example: '我有一只小猫。', examplePinyin: 'Wǒ yǒu yī zhī xiǎo māo.', exampleRu: 'У меня есть маленький котёнок.', radical: '小' },
  { id: 'h1_072', hanzi: '多', pinyin: 'duō', tones: [1], translation: 'много', hsk: 1, tags: ['adj'], category: 'adj', example: '这里有很多人。', examplePinyin: 'Zhèlǐ yǒu hěn duō rén.', exampleRu: 'Здесь очень много людей.' },
  { id: 'h1_073', hanzi: '不', pinyin: 'bù', tones: [4], translation: 'не; нет (отрицание)', hsk: 1, tags: ['particle'], category: 'adj', example: '我不是老师。', examplePinyin: 'Wǒ bù shì lǎoshī.', exampleRu: 'Я не учитель.' },
  { id: 'h1_074', hanzi: '很', pinyin: 'hěn', tones: [3], translation: 'очень', hsk: 1, tags: ['adv'], category: 'adj', example: '我很高兴。', examplePinyin: 'Wǒ hěn gāoxìng.', exampleRu: 'Я очень рад.' },
  { id: 'h1_075', hanzi: '的', pinyin: 'de', tones: [0], translation: 'частица принадлежности (мой, чей)', hsk: 1, tags: ['particle'], category: 'adj', example: '我的书', examplePinyin: 'Wǒ de shū', exampleRu: 'Моя книга' },
  { id: 'h1_076', hanzi: '吗', pinyin: 'ma', tones: [0], translation: 'вопросительная частица (ли?)', hsk: 1, tags: ['particle'], category: 'adj', example: '你好吗？', examplePinyin: 'Nǐ hǎo ma?', exampleRu: 'Как твои дела?' },
  { id: 'h1_077', hanzi: '什么', pinyin: 'shénme', tones: [2, 0], translation: 'что; какой', hsk: 1, tags: ['question'], category: 'adj', example: '这是什么？', examplePinyin: 'Zhè shì shénme?', exampleRu: 'Что это?' },
  { id: 'h1_078', hanzi: '哪', pinyin: 'nǎ', tones: [3], translation: 'какой; который; где', hsk: 1, tags: ['question'], category: 'adj', example: '你去哪儿？', examplePinyin: 'Nǐ qù nǎr?', exampleRu: 'Куда ты идёшь?' },
  { id: 'h1_079', hanzi: '怎么', pinyin: 'zěnme', tones: [3, 0], translation: 'как; каким образом', hsk: 1, tags: ['question'], category: 'adj', example: '这个字怎么读？', examplePinyin: 'Zhège zì zěnme dú?', exampleRu: 'Как читается этот иероглиф?' },
  { id: 'h1_080', hanzi: '多少', pinyin: 'duōshao', tones: [1, 0], translation: 'сколько', hsk: 1, tags: ['question'], category: 'adj', example: '这里有多少个学生？', examplePinyin: 'Zhèlǐ yǒu duōshao gè xuésheng?', exampleRu: 'Сколько здесь студентов?' },
];

/** Нормализует пиньинь без диакритических знаков для удобного поиска (например "ni hao" -> "nihao") */
export function normalizePinyin(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ü/g, 'v')
    .replace(/[^a-z0-9]/g, '');
}

