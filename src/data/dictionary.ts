// Полный словарь HSK 1–4 (HSK 1: 80 слов, HSK 2: 183 слова, HSK 3: 80 слов, HSK 4: 50 слов)
import { HSK1_WORDS, HSK1_CATEGORIES, normalizePinyin, type HskWord } from './hsk1';
import { HSK2_WORDS } from './hsk2';

export { HSK1_WORDS, HSK1_CATEGORIES, normalizePinyin, type HskWord };

export interface DictWord {
  id: string;
  hanzi: string;
  pinyin: string;
  tones: number[]; // тон каждого слога
  translation: string;
  hsk: 1 | 2 | 3 | 4;
  tags: string[];
  category?: string;
  example?: string;        // пример на китайском
  examplePinyin?: string;  // пример с пиньинь
  exampleRu?: string;      // перевод примера
  radical?: string;        // ключ иероглифа
  mnemonic?: string;       // мнемоника
}

// HSK 3 — 80 слов
const HSK3_WORDS: DictWord[] = [
  // ── Эмоции и внутренний мир ──
  { id: 'h3_001', hanzi: '感谢', pinyin: 'gǎnxiè', tones: [3,4], translation: 'благодарить', hsk: 3, tags: ['verb'], category: 'verb', example: '非常感谢你的帮助！', examplePinyin: 'Fēicháng gǎnxiè nǐ de bāngzhù!', exampleRu: 'Большое спасибо за помощь!' },
  { id: 'h3_002', hanzi: '感觉', pinyin: 'gǎnjué', tones: [3,2], translation: 'чувство; ощущение', hsk: 3, tags: ['noun'], category: 'noun' },
  { id: 'h3_003', hanzi: '感情', pinyin: 'gǎnqíng', tones: [3,2], translation: 'чувства; отношения', hsk: 3, tags: ['noun'], category: 'noun' },
  { id: 'h3_004', hanzi: '担心', pinyin: 'dānxīn', tones: [1,1], translation: 'беспокоиться', hsk: 3, tags: ['verb'], category: 'verb', example: '不要担心！', examplePinyin: 'Bùyào dānxīn!', exampleRu: 'Не беспокойся!' },
  { id: 'h3_005', hanzi: '麻烦', pinyin: 'máfan', tones: [2,0], translation: 'беспокоить; проблема', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_006', hanzi: '开心', pinyin: 'kāixīn', tones: [1,1], translation: 'радостный, счастливый', hsk: 3, tags: ['adj'], category: 'adj' },
  { id: 'h3_007', hanzi: '痛苦', pinyin: 'tòngkǔ', tones: [4,3], translation: 'страдание; мучительный', hsk: 3, tags: ['adj'], category: 'adj' },
  { id: 'h3_008', hanzi: '有意思', pinyin: 'yǒu yìsi', tones: [3,4,0], translation: 'интересный', hsk: 3, tags: ['adj'], category: 'adj' },
  { id: 'h3_009', hanzi: '无聊', pinyin: 'wúliáo', tones: [2,2], translation: 'скучный', hsk: 3, tags: ['adj'], category: 'adj' },
  { id: 'h3_010', hanzi: '满意', pinyin: 'mǎnyì', tones: [3,4], translation: 'удовлетворённый', hsk: 3, tags: ['adj'], category: 'adj' },

  // ── Характер и качества ──
  { id: 'h3_011', hanzi: '认真', pinyin: 'rènzhēn', tones: [4,1], translation: 'серьёзный, старательный', hsk: 3, tags: ['adj'], category: 'adj', example: '她工作很认真。', examplePinyin: 'Tā gōngzuò hěn rènzhēn.', exampleRu: 'Она очень старательно работает.' },
  { id: 'h3_012', hanzi: '努力', pinyin: 'nǔlì', tones: [3,4], translation: 'усердно трудиться', hsk: 3, tags: ['adj'], category: 'adj' },
  { id: 'h3_013', hanzi: '成功', pinyin: 'chénggōng', tones: [2,1], translation: 'успех; добиться успеха', hsk: 3, tags: ['noun'], category: 'noun' },
  { id: 'h3_014', hanzi: '失败', pinyin: 'shībài', tones: [1,4], translation: 'потерпеть неудачу', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_015', hanzi: '决定', pinyin: 'juédìng', tones: [2,4], translation: 'решать; решение', hsk: 3, tags: ['verb'], category: 'verb' },

  // ── Мышление и знание ──
  { id: 'h3_016', hanzi: '相信', pinyin: 'xiāngxìn', tones: [1,4], translation: 'верить', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_017', hanzi: '理解', pinyin: 'lǐjiě', tones: [3,3], translation: 'понимать', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_018', hanzi: '解释', pinyin: 'jiěshì', tones: [3,4], translation: 'объяснять', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_019', hanzi: '表示', pinyin: 'biǎoshì', tones: [3,4], translation: 'выражать; означать', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_020', hanzi: '表达', pinyin: 'biǎodá', tones: [3,2], translation: 'выражать (мысли)', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_021', hanzi: '记得', pinyin: 'jìde', tones: [4,0], translation: 'помнить', hsk: 3, tags: ['verb'], category: 'verb', example: '你记得我吗？', examplePinyin: 'Nǐ jìde wǒ ma?', exampleRu: 'Ты меня помнишь?' },
  { id: 'h3_022', hanzi: '忘记', pinyin: 'wàngjì', tones: [4,4], translation: 'забывать', hsk: 3, tags: ['verb'], category: 'verb' },

  // ── Прилагательные ──
  { id: 'h3_023', hanzi: '重要', pinyin: 'zhòngyào', tones: [4,4], translation: 'важный', hsk: 3, tags: ['adj'], category: 'adj', example: '这很重要。', examplePinyin: 'Zhè hěn zhòngyào.', exampleRu: 'Это очень важно.' },
  { id: 'h3_024', hanzi: '特别', pinyin: 'tèbié', tones: [4,2], translation: 'особенный; особенно', hsk: 3, tags: ['adj'], category: 'adj' },
  { id: 'h3_025', hanzi: '普通', pinyin: 'pǔtōng', tones: [3,1], translation: 'обычный', hsk: 3, tags: ['adj'], category: 'adj' },
  { id: 'h3_026', hanzi: '方便', pinyin: 'fāngbiàn', tones: [1,4], translation: 'удобный', hsk: 3, tags: ['adj'], category: 'adj' },
  { id: 'h3_027', hanzi: '困难', pinyin: 'kùnnán', tones: [4,2], translation: 'трудный; трудность', hsk: 3, tags: ['adj'], category: 'adj' },
  { id: 'h3_028', hanzi: '简单', pinyin: 'jiǎndān', tones: [3,1], translation: 'простой', hsk: 3, tags: ['adj'], category: 'adj' },
  { id: 'h3_029', hanzi: '复杂', pinyin: 'fùzá', tones: [4,2], translation: 'сложный', hsk: 3, tags: ['adj'], category: 'adj' },
  { id: 'h3_030', hanzi: '清楚', pinyin: 'qīngchǔ', tones: [1,3], translation: 'ясный; понятный', hsk: 3, tags: ['adj'], category: 'adj' },
  { id: 'h3_031', hanzi: '热情', pinyin: 'rèqíng', tones: [4,2], translation: 'горячий; энтузиазм', hsk: 3, tags: ['adj'], category: 'adj' },
  { id: 'h3_032', hanzi: '安静', pinyin: 'ānjìng', tones: [1,4], translation: 'тихий, спокойный', hsk: 3, tags: ['adj'], category: 'adj' },
  { id: 'h3_033', hanzi: '安全', pinyin: 'ānquán', tones: [1,2], translation: 'безопасный', hsk: 3, tags: ['adj'], category: 'adj' },
  { id: 'h3_034', hanzi: '健康', pinyin: 'jiànkāng', tones: [4,1], translation: 'здоровый; здоровье', hsk: 3, tags: ['adj'], category: 'adj', example: '身体健康是最重要的。', examplePinyin: 'Shēntǐ jiànkāng shì zuì zhòngyào de.', exampleRu: 'Здоровье — самое важное.' },
  { id: 'h3_035', hanzi: '整齐', pinyin: 'zhěngqí', tones: [3,2], translation: 'аккуратный, ровный', hsk: 3, tags: ['adj'], category: 'adj' },
  { id: 'h3_036', hanzi: '相同', pinyin: 'xiāngtóng', tones: [1,2], translation: 'одинаковый', hsk: 3, tags: ['adj'], category: 'adj' },
  { id: 'h3_037', hanzi: '不同', pinyin: 'bùtóng', tones: [4,2], translation: 'разный, отличающийся', hsk: 3, tags: ['adj'], category: 'adj' },

  // ── Общество и культура ──
  { id: 'h3_038', hanzi: '文化', pinyin: 'wénhuà', tones: [2,4], translation: 'культура', hsk: 3, tags: ['noun'], category: 'noun' },
  { id: 'h3_039', hanzi: '历史', pinyin: 'lìshǐ', tones: [4,3], translation: 'история', hsk: 3, tags: ['noun'], category: 'noun' },
  { id: 'h3_040', hanzi: '社会', pinyin: 'shèhuì', tones: [4,4], translation: 'общество', hsk: 3, tags: ['noun'], category: 'noun' },
  { id: 'h3_041', hanzi: '环境', pinyin: 'huánjìng', tones: [2,4], translation: 'окружающая среда', hsk: 3, tags: ['noun'], category: 'noun' },
  { id: 'h3_042', hanzi: '自然', pinyin: 'zìrán', tones: [4,2], translation: 'природа; естественный', hsk: 3, tags: ['noun'], category: 'noun' },
  { id: 'h3_043', hanzi: '科学', pinyin: 'kēxué', tones: [1,2], translation: 'наука', hsk: 3, tags: ['noun'], category: 'noun' },
  { id: 'h3_044', hanzi: '技术', pinyin: 'jìshù', tones: [4,4], translation: 'технология', hsk: 3, tags: ['noun'], category: 'noun' },
  { id: 'h3_045', hanzi: '网络', pinyin: 'wǎngluò', tones: [3,4], translation: 'интернет; сеть', hsk: 3, tags: ['noun'], category: 'noun' },
  { id: 'h3_046', hanzi: '手机', pinyin: 'shǒujī', tones: [3,1], translation: 'мобильный телефон', hsk: 3, tags: ['tech'], category: 'noun', example: '你有手机吗？', examplePinyin: 'Nǐ yǒu shǒujī ma?', exampleRu: 'У тебя есть телефон?' },
  { id: 'h3_047', hanzi: '电脑', pinyin: 'diànnǎo', tones: [4,3], translation: 'компьютер', hsk: 3, tags: ['tech'], category: 'noun' },
  { id: 'h3_048', hanzi: '电视', pinyin: 'diànshì', tones: [4,4], translation: 'телевизор', hsk: 3, tags: ['tech'], category: 'noun' },
  { id: 'h3_049', hanzi: '音乐', pinyin: 'yīnyuè', tones: [1,4], translation: 'музыка', hsk: 3, tags: ['art'], category: 'noun' },
  { id: 'h3_050', hanzi: '电影', pinyin: 'diànyǐng', tones: [4,3], translation: 'фильм', hsk: 3, tags: ['art'], category: 'noun' },

  // ── Работа и образование ──
  { id: 'h3_051', hanzi: '专业', pinyin: 'zhuānyè', tones: [1,4], translation: 'специальность; профессиональный', hsk: 3, tags: ['noun'], category: 'noun' },
  { id: 'h3_052', hanzi: '经验', pinyin: 'jīngyàn', tones: [1,4], translation: 'опыт', hsk: 3, tags: ['noun'], category: 'noun' },
  { id: 'h3_053', hanzi: '机会', pinyin: 'jīhuì', tones: [1,4], translation: 'возможность', hsk: 3, tags: ['noun'], category: 'noun' },
  { id: 'h3_054', hanzi: '时间', pinyin: 'shíjiān', tones: [2,1], translation: 'время', hsk: 3, tags: ['noun'], category: 'time' },
  { id: 'h3_055', hanzi: '情况', pinyin: 'qíngkuàng', tones: [2,4], translation: 'ситуация', hsk: 3, tags: ['noun'], category: 'noun' },
  { id: 'h3_056', hanzi: '原因', pinyin: 'yuányīn', tones: [2,1], translation: 'причина', hsk: 3, tags: ['noun'], category: 'noun' },
  { id: 'h3_057', hanzi: '结果', pinyin: 'jiéguǒ', tones: [2,3], translation: 'результат', hsk: 3, tags: ['noun'], category: 'noun' },
  { id: 'h3_058', hanzi: '方法', pinyin: 'fāngfǎ', tones: [1,3], translation: 'метод, способ', hsk: 3, tags: ['noun'], category: 'noun' },
  { id: 'h3_059', hanzi: '问题', pinyin: 'wèntí', tones: [4,2], translation: 'вопрос; проблема', hsk: 3, tags: ['noun'], category: 'noun' },

  // ── Действия ──
  { id: 'h3_060', hanzi: '提高', pinyin: 'tígāo', tones: [2,1], translation: 'повышать; улучшать', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_061', hanzi: '完成', pinyin: 'wánchéng', tones: [2,2], translation: 'завершать', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_062', hanzi: '解决', pinyin: 'jiějué', tones: [3,2], translation: 'решать (проблему)', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_063', hanzi: '影响', pinyin: 'yǐngxiǎng', tones: [3,3], translation: 'влияние; влиять', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_064', hanzi: '发展', pinyin: 'fāzhǎn', tones: [1,3], translation: 'развиваться; развитие', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_065', hanzi: '改变', pinyin: 'gǎibiàn', tones: [3,4], translation: 'изменять(ся)', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_066', hanzi: '保护', pinyin: 'bǎohù', tones: [3,4], translation: 'защищать', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_067', hanzi: '注意', pinyin: 'zhùyì', tones: [4,4], translation: 'обращать внимание', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_068', hanzi: '参加', pinyin: 'cānjiā', tones: [1,1], translation: 'участвовать', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_069', hanzi: '选择', pinyin: 'xuǎnzé', tones: [3,2], translation: 'выбирать; выбор', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_070', hanzi: '需要', pinyin: 'xūyào', tones: [1,4], translation: 'нуждаться; нужно', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_071', hanzi: '使用', pinyin: 'shǐyòng', tones: [3,4], translation: 'использовать', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_072', hanzi: '准备', pinyin: 'zhǔnbèi', tones: [3,4], translation: 'готовить(ся)', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_073', hanzi: '接受', pinyin: 'jiēshòu', tones: [1,4], translation: 'принимать', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_074', hanzi: '拒绝', pinyin: 'jùjué', tones: [4,2], translation: 'отказывать', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_075', hanzi: '联系', pinyin: 'liánxì', tones: [2,4], translation: 'связываться; связь', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_076', hanzi: '比较', pinyin: 'bǐjiào', tones: [3,4], translation: 'сравнивать; относительно', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_077', hanzi: '照顾', pinyin: 'zhàogù', tones: [4,4], translation: 'заботиться, ухаживать', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_078', hanzi: '教', pinyin: 'jiāo', tones: [1], translation: 'учить, преподавать', hsk: 3, tags: ['verb'], category: 'verb' },
  { id: 'h3_079', hanzi: '练习', pinyin: 'liànxí', tones: [4,2], translation: 'практиковаться; упражнение', hsk: 3, tags: ['verb'], category: 'verb', example: '我在练习汉语。', examplePinyin: 'Wǒ zài liànxí Hànyǔ.', exampleRu: 'Я практикую китайский язык.' },
  { id: 'h3_080', hanzi: '检查', pinyin: 'jiǎnchá', tones: [3,2], translation: 'проверять', hsk: 3, tags: ['verb'], category: 'verb' },
];

// HSK 4 — 50 слов
const HSK4_WORDS: DictWord[] = [
  { id: 'h4_001', hanzi: '实际', pinyin: 'shíjì', tones: [2,4], translation: 'практический; в действительности', hsk: 4, tags: ['adj'], category: 'adj' },
  { id: 'h4_002', hanzi: '具体', pinyin: 'jùtǐ', tones: [4,3], translation: 'конкретный', hsk: 4, tags: ['adj'], category: 'adj' },
  { id: 'h4_003', hanzi: '积极', pinyin: 'jījí', tones: [1,2], translation: 'активный; позитивный', hsk: 4, tags: ['adj'], category: 'adj' },
  { id: 'h4_004', hanzi: '消极', pinyin: 'xiāojí', tones: [1,2], translation: 'пассивный; негативный', hsk: 4, tags: ['adj'], category: 'adj' },
  { id: 'h4_005', hanzi: '逐渐', pinyin: 'zhújiàn', tones: [2,4], translation: 'постепенно', hsk: 4, tags: ['adv'], category: 'adj' },
  { id: 'h4_006', hanzi: '突然', pinyin: 'tūrán', tones: [1,2], translation: 'внезапно', hsk: 4, tags: ['adv'], category: 'adj', example: '他突然消失了。', examplePinyin: 'Tā tūrán xiāoshī le.', exampleRu: 'Он вдруг исчез.' },
  { id: 'h4_007', hanzi: '竟然', pinyin: 'jìngrán', tones: [4,2], translation: 'оказывается; неожиданно', hsk: 4, tags: ['adv'], category: 'adj' },
  { id: 'h4_008', hanzi: '即使', pinyin: 'jíshǐ', tones: [2,3], translation: 'даже если', hsk: 4, tags: ['conj'], category: 'adj' },
  { id: 'h4_009', hanzi: '尽管', pinyin: 'jǐnguǎn', tones: [3,3], translation: 'хотя; несмотря на', hsk: 4, tags: ['conj'], category: 'adj' },
  { id: 'h4_010', hanzi: '仿佛', pinyin: 'fǎngfú', tones: [3,2], translation: 'как будто', hsk: 4, tags: ['adv'], category: 'adj' },
  { id: 'h4_011', hanzi: '显然', pinyin: 'xiǎnrán', tones: [3,2], translation: 'очевидно', hsk: 4, tags: ['adv'], category: 'adj' },
  { id: 'h4_012', hanzi: '自信', pinyin: 'zìxìn', tones: [4,4], translation: 'уверенность в себе', hsk: 4, tags: ['noun'], category: 'noun' },
  { id: 'h4_013', hanzi: '勇气', pinyin: 'yǒngqì', tones: [3,4], translation: 'смелость', hsk: 4, tags: ['noun'], category: 'noun' },
  { id: 'h4_014', hanzi: '耐心', pinyin: 'nàixīn', tones: [4,1], translation: 'терпение', hsk: 4, tags: ['noun'], category: 'noun' },
  { id: 'h4_015', hanzi: '智慧', pinyin: 'zhìhuì', tones: [4,4], translation: 'мудрость', hsk: 4, tags: ['noun'], category: 'noun' },
  { id: 'h4_016', hanzi: '责任', pinyin: 'zérèn', tones: [2,4], translation: 'ответственность', hsk: 4, tags: ['noun'], category: 'noun' },
  { id: 'h4_017', hanzi: '态度', pinyin: 'tàidu', tones: [4,0], translation: 'отношение; позиция', hsk: 4, tags: ['noun'], category: 'noun' },
  { id: 'h4_018', hanzi: '观点', pinyin: 'guāndiǎn', tones: [1,3], translation: 'точка зрения', hsk: 4, tags: ['noun'], category: 'noun' },
  { id: 'h4_019', hanzi: '意见', pinyin: 'yìjiàn', tones: [4,4], translation: 'мнение; возражение', hsk: 4, tags: ['noun'], category: 'noun' },
  { id: 'h4_020', hanzi: '建议', pinyin: 'jiànyì', tones: [4,4], translation: 'предложение; советовать', hsk: 4, tags: ['noun'], category: 'noun' },
  { id: 'h4_021', hanzi: '批评', pinyin: 'pīpíng', tones: [1,2], translation: 'критиковать', hsk: 4, tags: ['verb'], category: 'verb' },
  { id: 'h4_022', hanzi: '表扬', pinyin: 'biǎoyáng', tones: [3,2], translation: 'хвалить', hsk: 4, tags: ['verb'], category: 'verb' },
  { id: 'h4_023', hanzi: '鼓励', pinyin: 'gǔlì', tones: [3,4], translation: 'поощрять', hsk: 4, tags: ['verb'], category: 'verb' },
  { id: 'h4_024', hanzi: '支持', pinyin: 'zhīchí', tones: [1,2], translation: 'поддерживать', hsk: 4, tags: ['verb'], category: 'verb' },
  { id: 'h4_025', hanzi: '反对', pinyin: 'fǎnduì', tones: [3,4], translation: 'возражать', hsk: 4, tags: ['verb'], category: 'verb' },
  { id: 'h4_026', hanzi: '赞成', pinyin: 'zànchéng', tones: [4,2], translation: 'соглашаться', hsk: 4, tags: ['verb'], category: 'verb' },
  { id: 'h4_027', hanzi: '承认', pinyin: 'chéngrèn', tones: [2,4], translation: 'признавать', hsk: 4, tags: ['verb'], category: 'verb' },
  { id: 'h4_028', hanzi: '怀疑', pinyin: 'huáiyí', tones: [2,2], translation: 'сомневаться', hsk: 4, tags: ['verb'], category: 'verb' },
  { id: 'h4_029', hanzi: '证明', pinyin: 'zhèngmíng', tones: [4,2], translation: 'доказывать', hsk: 4, tags: ['verb'], category: 'verb' },
  { id: 'h4_030', hanzi: '分析', pinyin: 'fēnxī', tones: [1,1], translation: 'анализировать', hsk: 4, tags: ['verb'], category: 'verb' },
  { id: 'h4_031', hanzi: '研究', pinyin: 'yánjiū', tones: [2,1], translation: 'исследовать; исследование', hsk: 4, tags: ['verb'], category: 'verb' },
  { id: 'h4_032', hanzi: '实现', pinyin: 'shíxiàn', tones: [2,4], translation: 'осуществлять', hsk: 4, tags: ['verb'], category: 'verb' },
  { id: 'h4_033', hanzi: '追求', pinyin: 'zhuīqiú', tones: [1,2], translation: 'стремиться', hsk: 4, tags: ['verb'], category: 'verb' },
  { id: 'h4_034', hanzi: '放弃', pinyin: 'fàngqì', tones: [4,4], translation: 'отказываться', hsk: 4, tags: ['verb'], category: 'verb' },
  { id: 'h4_035', hanzi: '坚持', pinyin: 'jiānchí', tones: [1,2], translation: 'настаивать; упорствовать', hsk: 4, tags: ['verb'], category: 'verb', example: '坚持就是胜利！', examplePinyin: 'Jiānchí jiùshì shènglì!', exampleRu: 'Упорство — это победа!' },
  { id: 'h4_036', hanzi: '培养', pinyin: 'péiyǎng', tones: [2,3], translation: 'воспитывать; развивать', hsk: 4, tags: ['verb'], category: 'verb' },
  { id: 'h4_037', hanzi: '提供', pinyin: 'tígōng', tones: [2,1], translation: 'предоставлять', hsk: 4, tags: ['verb'], category: 'verb' },
  { id: 'h4_038', hanzi: '强调', pinyin: 'qiángdiào', tones: [2,4], translation: 'подчёркивать', hsk: 4, tags: ['verb'], category: 'verb' },
  { id: 'h4_039', hanzi: '提出', pinyin: 'tíchū', tones: [2,1], translation: 'выдвигать (предложение)', hsk: 4, tags: ['verb'], category: 'verb' },
  { id: 'h4_040', hanzi: '解决', pinyin: 'jiějué', tones: [3,2], translation: 'решать (проблему)', hsk: 4, tags: ['verb'], category: 'verb' },
  { id: 'h4_041', hanzi: '沟通', pinyin: 'gōutōng', tones: [1,1], translation: 'общаться; коммуникация', hsk: 4, tags: ['verb'], category: 'verb' },
  { id: 'h4_042', hanzi: '合作', pinyin: 'hézuò', tones: [2,4], translation: 'сотрудничать', hsk: 4, tags: ['verb'], category: 'verb' },
  { id: 'h4_043', hanzi: '竞争', pinyin: 'jìngzhēng', tones: [4,1], translation: 'конкурировать', hsk: 4, tags: ['verb'], category: 'verb' },
  { id: 'h4_044', hanzi: '保证', pinyin: 'bǎozhèng', tones: [3,4], translation: 'гарантировать', hsk: 4, tags: ['verb'], category: 'verb' },
  { id: 'h4_045', hanzi: '印象', pinyin: 'yìnxiàng', tones: [4,4], translation: 'впечатление', hsk: 4, tags: ['noun'], category: 'noun' },
  { id: 'h4_046', hanzi: '矛盾', pinyin: 'máodùn', tones: [2,4], translation: 'противоречие', hsk: 4, tags: ['noun'], category: 'noun' },
  { id: 'h4_047', hanzi: '现象', pinyin: 'xiànxiàng', tones: [4,4], translation: 'явление; феномен', hsk: 4, tags: ['noun'], category: 'noun' },
  { id: 'h4_048', hanzi: '条件', pinyin: 'tiáojiàn', tones: [2,4], translation: 'условие', hsk: 4, tags: ['noun'], category: 'noun' },
  { id: 'h4_049', hanzi: '经济', pinyin: 'jīngjì', tones: [1,4], translation: 'экономика', hsk: 4, tags: ['noun'], category: 'noun' },
  { id: 'h4_050', hanzi: '政府', pinyin: 'zhèngfǔ', tones: [4,3], translation: 'правительство', hsk: 4, tags: ['noun'], category: 'noun' },
];

export const DICTIONARY: DictWord[] = [
  // HSK 1 (80 слов)
  ...HSK1_WORDS,
  // HSK 2 (183 слова — расширенный)
  ...HSK2_WORDS,
  // HSK 3 (80 слов)
  ...HSK3_WORDS,
  // HSK 4 (50 слов)
  ...HSK4_WORDS,
];

// Вспомогательные функции
export function getWordsByHsk(level: 1 | 2 | 3 | 4): DictWord[] {
  return DICTIONARY.filter(w => w.hsk === level);
}

export function getWordsByTag(tag: string): DictWord[] {
  return DICTIONARY.filter(w => w.tags.includes(tag));
}

export function getWordById(id: string): DictWord | undefined {
  return DICTIONARY.find(w => w.id === id);
}

export function getTotalCount(): number {
  return DICTIONARY.length;
}

export const HSK_COUNTS = {
  1: DICTIONARY.filter(w => w.hsk === 1).length,
  2: DICTIONARY.filter(w => w.hsk === 2).length,
  3: DICTIONARY.filter(w => w.hsk === 3).length,
  4: DICTIONARY.filter(w => w.hsk === 4).length,
};
