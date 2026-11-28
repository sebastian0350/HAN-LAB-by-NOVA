// Полный словарь HSK 1–4 с примерами и контекстом (база HSK 1 — 80 слов из hsk1.ts)
import { HSK1_WORDS, HSK1_CATEGORIES, normalizePinyin, type HskWord } from './hsk1';

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

export const DICTIONARY: DictWord[] = [
  // ═══════════════ HSK 1 (80 слов из src/data/hsk1.ts) ═══════════════
  ...HSK1_WORDS,

  // ═══════════════ HSK 2 ═══════════════
  // Семья
  { id: 'h2_001', hanzi: '爸爸', pinyin: 'bàba', tones: [4,0], translation: 'папа', hsk: 2, tags: ['family'] },
  { id: 'h2_002', hanzi: '妈妈', pinyin: 'māma', tones: [1,0], translation: 'мама', hsk: 2, tags: ['family'], mnemonic: 'ма-ма — самое первое слово' },
  { id: 'h2_003', hanzi: '哥哥', pinyin: 'gēgē', tones: [1,0], translation: 'старший брат', hsk: 2, tags: ['family'] },
  { id: 'h2_004', hanzi: '姐姐', pinyin: 'jiějie', tones: [3,0], translation: 'старшая сестра', hsk: 2, tags: ['family'] },
  { id: 'h2_005', hanzi: '弟弟', pinyin: 'dìdi', tones: [4,0], translation: 'младший брат', hsk: 2, tags: ['family'] },
  { id: 'h2_006', hanzi: '妹妹', pinyin: 'mèimei', tones: [4,0], translation: 'младшая сестра', hsk: 2, tags: ['family'] },
  { id: 'h2_007', hanzi: '儿子', pinyin: 'érzi', tones: [2,0], translation: 'сын', hsk: 2, tags: ['family'] },
  { id: 'h2_008', hanzi: '女儿', pinyin: 'nǚér', tones: [3,2], translation: 'дочь', hsk: 2, tags: ['family'] },
  { id: 'h2_009', hanzi: '丈夫', pinyin: 'zhàngfu', tones: [4,0], translation: 'муж', hsk: 2, tags: ['family'] },
  { id: 'h2_010', hanzi: '妻子', pinyin: 'qīzi', tones: [1,0], translation: 'жена', hsk: 2, tags: ['family'] },
  // Тело
  { id: 'h2_011', hanzi: '眼睛', pinyin: 'yǎnjing', tones: [3,0], translation: 'глаза', hsk: 2, tags: ['body'] },
  { id: 'h2_012', hanzi: '耳朵', pinyin: 'ěrduo', tones: [3,0], translation: 'уши', hsk: 2, tags: ['body'] },
  { id: 'h2_013', hanzi: '嘴', pinyin: 'zuǐ', tones: [3], translation: 'рот', hsk: 2, tags: ['body'] },
  { id: 'h2_014', hanzi: '手', pinyin: 'shǒu', tones: [3], translation: 'рука (кисть)', hsk: 2, tags: ['body'], radical: '手' },
  { id: 'h2_015', hanzi: '脚', pinyin: 'jiǎo', tones: [3], translation: 'нога (ступня)', hsk: 2, tags: ['body'] },
  // Прилагательные
  { id: 'h2_016', hanzi: '漂亮', pinyin: 'piàoliang', tones: [4,0], translation: 'красивый', hsk: 2, tags: ['adj'], example: '她很漂亮。', examplePinyin: 'Tā hěn piàoliang.', exampleRu: 'Она очень красивая.' },
  { id: 'h2_017', hanzi: '可爱', pinyin: 'kě\'ài', tones: [3,4], translation: 'милый, симпатичный', hsk: 2, tags: ['adj'] },
  { id: 'h2_018', hanzi: '聪明', pinyin: 'cōngmíng', tones: [1,2], translation: 'умный', hsk: 2, tags: ['adj'] },
  { id: 'h2_019', hanzi: '快', pinyin: 'kuài', tones: [4], translation: 'быстрый', hsk: 2, tags: ['adj'] },
  { id: 'h2_020', hanzi: '慢', pinyin: 'màn', tones: [4], translation: 'медленный', hsk: 2, tags: ['adj'] },
  { id: 'h2_021', hanzi: '贵', pinyin: 'guì', tones: [4], translation: 'дорогой (по цене)', hsk: 2, tags: ['adj'] },
  { id: 'h2_022', hanzi: '便宜', pinyin: 'piányi', tones: [2,0], translation: 'дешёвый', hsk: 2, tags: ['adj'] },
  { id: 'h2_023', hanzi: '忙', pinyin: 'máng', tones: [2], translation: 'занятой', hsk: 2, tags: ['adj'] },
  { id: 'h2_024', hanzi: '累', pinyin: 'lèi', tones: [4], translation: 'усталый', hsk: 2, tags: ['adj'] },
  { id: 'h2_025', hanzi: '热', pinyin: 'rè', tones: [4], translation: 'горячий, жаркий', hsk: 2, tags: ['adj'] },
  { id: 'h2_026', hanzi: '冷', pinyin: 'lěng', tones: [3], translation: 'холодный', hsk: 2, tags: ['adj'] },
  { id: 'h2_027', hanzi: '近', pinyin: 'jìn', tones: [4], translation: 'близкий', hsk: 2, tags: ['adj'] },
  { id: 'h2_028', hanzi: '远', pinyin: 'yuǎn', tones: [3], translation: 'далёкий', hsk: 2, tags: ['adj'] },
  // Место и направление
  { id: 'h2_029', hanzi: '上', pinyin: 'shàng', tones: [4], translation: 'вверх, сверху', hsk: 2, tags: ['direction'] },
  { id: 'h2_030', hanzi: '下', pinyin: 'xià', tones: [4], translation: 'вниз, снизу', hsk: 2, tags: ['direction'] },
  { id: 'h2_031', hanzi: '左', pinyin: 'zuǒ', tones: [3], translation: 'левый', hsk: 2, tags: ['direction'] },
  { id: 'h2_032', hanzi: '右', pinyin: 'yòu', tones: [4], translation: 'правый', hsk: 2, tags: ['direction'] },
  { id: 'h2_033', hanzi: '前面', pinyin: 'qiánmiàn', tones: [2,4], translation: 'спереди', hsk: 2, tags: ['direction'] },
  { id: 'h2_034', hanzi: '后面', pinyin: 'hòumiàn', tones: [4,4], translation: 'сзади', hsk: 2, tags: ['direction'] },
  { id: 'h2_035', hanzi: '里面', pinyin: 'lǐmiàn', tones: [3,4], translation: 'внутри', hsk: 2, tags: ['direction'] },
  { id: 'h2_036', hanzi: '外面', pinyin: 'wàimiàn', tones: [4,4], translation: 'снаружи', hsk: 2, tags: ['direction'] },
  // Еда
  { id: 'h2_037', hanzi: '面条', pinyin: 'miàntiáo', tones: [4,2], translation: 'лапша', hsk: 2, tags: ['food'] },
  { id: 'h2_038', hanzi: '饺子', pinyin: 'jiǎozi', tones: [3,0], translation: 'пельмени (цзяоцзы)', hsk: 2, tags: ['food'] },
  { id: 'h2_039', hanzi: '包子', pinyin: 'bāozi', tones: [1,0], translation: 'паровые булочки с начинкой', hsk: 2, tags: ['food'] },
  { id: 'h2_040', hanzi: '米饭', pinyin: 'mǐfàn', tones: [3,4], translation: 'варёный рис', hsk: 2, tags: ['food'] },
  { id: 'h2_041', hanzi: '牛奶', pinyin: 'niúnǎi', tones: [2,3], translation: 'молоко', hsk: 2, tags: ['food'] },
  { id: 'h2_042', hanzi: '鸡蛋', pinyin: 'jīdàn', tones: [1,4], translation: 'яйцо', hsk: 2, tags: ['food'] },
  { id: 'h2_043', hanzi: '鱼', pinyin: 'yú', tones: [2], translation: 'рыба', hsk: 2, tags: ['food'] },
  { id: 'h2_044', hanzi: '肉', pinyin: 'ròu', tones: [4], translation: 'мясо', hsk: 2, tags: ['food'] },
  { id: 'h2_045', hanzi: '蔬菜', pinyin: 'shūcài', tones: [1,4], translation: 'овощи', hsk: 2, tags: ['food'] },
  { id: 'h2_046', hanzi: '水果', pinyin: 'shuǐguǒ', tones: [3,3], translation: 'фрукты', hsk: 2, tags: ['food'] },
  // Глаголы
  { id: 'h2_047', hanzi: '开始', pinyin: 'kāishǐ', tones: [1,3], translation: 'начинать', hsk: 2, tags: ['verb'] },
  { id: 'h2_048', hanzi: '结束', pinyin: 'jiéshù', tones: [2,4], translation: 'заканчивать', hsk: 2, tags: ['verb'] },
  { id: 'h2_049', hanzi: '等', pinyin: 'děng', tones: [3], translation: 'ждать', hsk: 2, tags: ['verb'] },
  { id: 'h2_050', hanzi: '找', pinyin: 'zhǎo', tones: [3], translation: 'искать', hsk: 2, tags: ['verb'] },
  { id: 'h2_051', hanzi: '打', pinyin: 'dǎ', tones: [3], translation: 'бить; играть (в игры)', hsk: 2, tags: ['verb'] },
  { id: 'h2_052', hanzi: '开', pinyin: 'kāi', tones: [1], translation: 'открывать; ехать', hsk: 2, tags: ['verb'] },
  { id: 'h2_053', hanzi: '关', pinyin: 'guān', tones: [1], translation: 'закрывать', hsk: 2, tags: ['verb'] },
  { id: 'h2_054', hanzi: '进', pinyin: 'jìn', tones: [4], translation: 'входить', hsk: 2, tags: ['verb'] },
  { id: 'h2_055', hanzi: '出', pinyin: 'chū', tones: [1], translation: 'выходить', hsk: 2, tags: ['verb'] },
  { id: 'h2_056', hanzi: '回', pinyin: 'huí', tones: [2], translation: 'возвращаться', hsk: 2, tags: ['verb'] },
  { id: 'h2_057', hanzi: '帮', pinyin: 'bāng', tones: [1], translation: 'помогать', hsk: 2, tags: ['verb'] },
  { id: 'h2_058', hanzi: '告诉', pinyin: 'gàosu', tones: [4,0], translation: 'говорить (кому-то)', hsk: 2, tags: ['verb'] },
  { id: 'h2_059', hanzi: '借', pinyin: 'jiè', tones: [4], translation: 'занимать; одалживать', hsk: 2, tags: ['verb'] },
  { id: 'h2_060', hanzi: '送', pinyin: 'sòng', tones: [4], translation: 'дарить; провожать', hsk: 2, tags: ['verb'] },
  // Транспорт
  { id: 'h2_061', hanzi: '飞机', pinyin: 'fēijī', tones: [1,1], translation: 'самолёт', hsk: 2, tags: ['transport'] },
  { id: 'h2_062', hanzi: '火车', pinyin: 'huǒchē', tones: [3,1], translation: 'поезд', hsk: 2, tags: ['transport'] },
  { id: 'h2_063', hanzi: '公共汽车', pinyin: 'gōnggòng qìchē', tones: [1,4,4,1], translation: 'автобус', hsk: 2, tags: ['transport'] },
  { id: 'h2_064', hanzi: '地铁', pinyin: 'dìtiě', tones: [4,3], translation: 'метро', hsk: 2, tags: ['transport'] },
  { id: 'h2_065', hanzi: '自行车', pinyin: 'zìxíngchē', tones: [4,2,1], translation: 'велосипед', hsk: 2, tags: ['transport'] },
  // Спорт и активности
  { id: 'h2_066', hanzi: '运动', pinyin: 'yùndòng', tones: [4,4], translation: 'спорт; заниматься спортом', hsk: 2, tags: ['activity'] },
  { id: 'h2_067', hanzi: '跑步', pinyin: 'pǎobù', tones: [3,4], translation: 'бегать', hsk: 2, tags: ['activity'] },
  { id: 'h2_068', hanzi: '游泳', pinyin: 'yóuyǒng', tones: [2,3], translation: 'плавать', hsk: 2, tags: ['activity'] },
  { id: 'h2_069', hanzi: '打球', pinyin: 'dǎqiú', tones: [3,2], translation: 'играть в мяч', hsk: 2, tags: ['activity'] },
  { id: 'h2_070', hanzi: '唱歌', pinyin: 'chànggē', tones: [4,1], translation: 'петь', hsk: 2, tags: ['activity'] },
  { id: 'h2_071', hanzi: '跳舞', pinyin: 'tiàowǔ', tones: [4,3], translation: 'танцевать', hsk: 2, tags: ['activity'] },
  { id: 'h2_072', hanzi: '旅游', pinyin: 'lǚyóu', tones: [3,2], translation: 'путешествовать', hsk: 2, tags: ['activity'] },
  // Погода
  { id: 'h2_073', hanzi: '天气', pinyin: 'tiānqì', tones: [1,4], translation: 'погода', hsk: 2, tags: ['weather'] },
  { id: 'h2_074', hanzi: '下雨', pinyin: 'xià yǔ', tones: [4,3], translation: 'идёт дождь', hsk: 2, tags: ['weather'] },
  { id: 'h2_075', hanzi: '下雪', pinyin: 'xià xuě', tones: [4,3], translation: 'идёт снег', hsk: 2, tags: ['weather'] },
  { id: 'h2_076', hanzi: '风', pinyin: 'fēng', tones: [1], translation: 'ветер', hsk: 2, tags: ['weather'] },
  { id: 'h2_077', hanzi: '晴', pinyin: 'qíng', tones: [2], translation: 'ясно (о погоде)', hsk: 2, tags: ['weather'] },
  // Места
  { id: 'h2_078', hanzi: '超市', pinyin: 'chāoshì', tones: [1,4], translation: 'супермаркет', hsk: 2, tags: ['place'] },
  { id: 'h2_079', hanzi: '公园', pinyin: 'gōngyuán', tones: [1,2], translation: 'парк', hsk: 2, tags: ['place'] },
  { id: 'h2_080', hanzi: '图书馆', pinyin: 'túshūguǎn', tones: [2,1,3], translation: 'библиотека', hsk: 2, tags: ['place'] },
  { id: 'h2_081', hanzi: '邮局', pinyin: 'yóujú', tones: [2,2], translation: 'почта', hsk: 2, tags: ['place'] },
  { id: 'h2_082', hanzi: '银行', pinyin: 'yínháng', tones: [2,2], translation: 'банк', hsk: 2, tags: ['place'] },
  // Одежда
  { id: 'h2_083', hanzi: '衣服', pinyin: 'yīfu', tones: [1,0], translation: 'одежда', hsk: 2, tags: ['clothes'] },
  { id: 'h2_084', hanzi: '裤子', pinyin: 'kùzi', tones: [4,0], translation: 'брюки', hsk: 2, tags: ['clothes'] },
  { id: 'h2_085', hanzi: '鞋', pinyin: 'xié', tones: [2], translation: 'обувь', hsk: 2, tags: ['clothes'] },
  // Прочее HSK 2
  { id: 'h2_086', hanzi: '已经', pinyin: 'yǐjīng', tones: [3,1], translation: 'уже', hsk: 2, tags: ['adv'] },
  { id: 'h2_087', hanzi: '还', pinyin: 'hái', tones: [2], translation: 'ещё; тоже', hsk: 2, tags: ['adv'] },
  { id: 'h2_088', hanzi: '就', pinyin: 'jiù', tones: [4], translation: 'как раз; тогда', hsk: 2, tags: ['adv'] },
  { id: 'h2_089', hanzi: '可能', pinyin: 'kěnéng', tones: [3,2], translation: 'возможно', hsk: 2, tags: ['adv'] },
  { id: 'h2_090', hanzi: '应该', pinyin: 'yīnggāi', tones: [1,1], translation: 'должен, следует', hsk: 2, tags: ['modal'] },
  { id: 'h2_091', hanzi: '能', pinyin: 'néng', tones: [2], translation: 'мочь (физически)', hsk: 2, tags: ['modal'] },
  { id: 'h2_092', hanzi: '可以', pinyin: 'kěyǐ', tones: [3,3], translation: 'можно', hsk: 2, tags: ['modal'] },
  { id: 'h2_093', hanzi: '要', pinyin: 'yào', tones: [4], translation: 'хотеть; нужно', hsk: 2, tags: ['modal'] },
  { id: 'h2_094', hanzi: '会', pinyin: 'huì', tones: [4], translation: 'уметь; будет', hsk: 2, tags: ['modal'] },
  { id: 'h2_095', hanzi: '觉得', pinyin: 'juéde', tones: [2,0], translation: 'чувствовать; думать', hsk: 2, tags: ['verb'] },
  { id: 'h2_096', hanzi: '希望', pinyin: 'xīwàng', tones: [1,4], translation: 'надеяться; надежда', hsk: 2, tags: ['verb'] },
  { id: 'h2_097', hanzi: '以为', pinyin: 'yǐwéi', tones: [3,2], translation: 'считать (ошибочно)', hsk: 2, tags: ['verb'] },
  { id: 'h2_098', hanzi: '问', pinyin: 'wèn', tones: [4], translation: 'спрашивать', hsk: 2, tags: ['verb'] },
  { id: 'h2_099', hanzi: '回答', pinyin: 'huídá', tones: [2,2], translation: 'отвечать', hsk: 2, tags: ['verb'] },
  { id: 'h2_100', hanzi: '笑', pinyin: 'xiào', tones: [4], translation: 'смеяться', hsk: 2, tags: ['verb'] },

  // ═══════════════ HSK 3 ═══════════════
  { id: 'h3_001', hanzi: '感谢', pinyin: 'gǎnxiè', tones: [3,4], translation: 'благодарить', hsk: 3, tags: ['verb'] },
  { id: 'h3_002', hanzi: '感觉', pinyin: 'gǎnjué', tones: [3,2], translation: 'чувство; ощущение', hsk: 3, tags: ['noun'] },
  { id: 'h3_003', hanzi: '感情', pinyin: 'gǎnqíng', tones: [3,2], translation: 'чувства; отношения', hsk: 3, tags: ['noun'] },
  { id: 'h3_004', hanzi: '担心', pinyin: 'dānxīn', tones: [1,1], translation: 'беспокоиться', hsk: 3, tags: ['verb'] },
  { id: 'h3_005', hanzi: '麻烦', pinyin: 'máfan', tones: [2,0], translation: 'беспокоить; проблема', hsk: 3, tags: ['verb'] },
  { id: 'h3_006', hanzi: '认真', pinyin: 'rènzhēn', tones: [4,1], translation: 'серьёзный, старательный', hsk: 3, tags: ['adj'] },
  { id: 'h3_007', hanzi: '努力', pinyin: 'nǔlì', tones: [3,4], translation: 'усердно трудиться', hsk: 3, tags: ['adj'] },
  { id: 'h3_008', hanzi: '成功', pinyin: 'chénggōng', tones: [2,1], translation: 'успех; добиться успеха', hsk: 3, tags: ['noun'] },
  { id: 'h3_009', hanzi: '失败', pinyin: 'shībài', tones: [1,4], translation: 'потерпеть неудачу', hsk: 3, tags: ['verb'] },
  { id: 'h3_010', hanzi: '决定', pinyin: 'juédìng', tones: [2,4], translation: 'решать; решение', hsk: 3, tags: ['verb'] },
  { id: 'h3_011', hanzi: '相信', pinyin: 'xiāngxìn', tones: [1,4], translation: 'верить', hsk: 3, tags: ['verb'] },
  { id: 'h3_012', hanzi: '理解', pinyin: 'lǐjiě', tones: [3,3], translation: 'понимать', hsk: 3, tags: ['verb'] },
  { id: 'h3_013', hanzi: '解释', pinyin: 'jiěshì', tones: [3,4], translation: 'объяснять', hsk: 3, tags: ['verb'] },
  { id: 'h3_014', hanzi: '表示', pinyin: 'biǎoshì', tones: [3,4], translation: 'выражать; означать', hsk: 3, tags: ['verb'] },
  { id: 'h3_015', hanzi: '表达', pinyin: 'biǎodá', tones: [3,2], translation: 'выражать (мысли)', hsk: 3, tags: ['verb'] },
  { id: 'h3_016', hanzi: '提高', pinyin: 'tígāo', tones: [2,1], translation: 'повышать; улучшать', hsk: 3, tags: ['verb'] },
  { id: 'h3_017', hanzi: '提供', pinyin: 'tígōng', tones: [2,1], translation: 'предоставлять', hsk: 3, tags: ['verb'] },
  { id: 'h3_018', hanzi: '完成', pinyin: 'wánchéng', tones: [2,2], translation: 'завершать', hsk: 3, tags: ['verb'] },
  { id: 'h3_019', hanzi: '开心', pinyin: 'kāixīn', tones: [1,1], translation: 'радостный, счастливый', hsk: 3, tags: ['adj'] },
  { id: 'h3_020', hanzi: '痛苦', pinyin: 'tòngkǔ', tones: [4,3], translation: 'страдание; мучительный', hsk: 3, tags: ['adj'] },
  { id: 'h3_021', hanzi: '有意思', pinyin: 'yǒu yìsi', tones: [3,4,0], translation: 'интересный', hsk: 3, tags: ['adj'] },
  { id: 'h3_022', hanzi: '无聊', pinyin: 'wúliáo', tones: [2,2], translation: 'скучный', hsk: 3, tags: ['adj'] },
  { id: 'h3_023', hanzi: '重要', pinyin: 'zhòngyào', tones: [4,4], translation: 'важный', hsk: 3, tags: ['adj'] },
  { id: 'h3_024', hanzi: '特别', pinyin: 'tèbié', tones: [4,2], translation: 'особенный; особенно', hsk: 3, tags: ['adj'] },
  { id: 'h3_025', hanzi: '普通', pinyin: 'pǔtōng', tones: [3,1], translation: 'обычный', hsk: 3, tags: ['adj'] },
  { id: 'h3_026', hanzi: '方便', pinyin: 'fāngbiàn', tones: [1,4], translation: 'удобный', hsk: 3, tags: ['adj'] },
  { id: 'h3_027', hanzi: '困难', pinyin: 'kùnnán', tones: [4,2], translation: 'трудный; трудность', hsk: 3, tags: ['adj'] },
  { id: 'h3_028', hanzi: '简单', pinyin: 'jiǎndān', tones: [3,1], translation: 'простой', hsk: 3, tags: ['adj'] },
  { id: 'h3_029', hanzi: '复杂', pinyin: 'fùzá', tones: [4,2], translation: 'сложный', hsk: 3, tags: ['adj'] },
  { id: 'h3_030', hanzi: '清楚', pinyin: 'qīngchǔ', tones: [1,3], translation: 'ясный; понятный', hsk: 3, tags: ['adj'] },
  { id: 'h3_031', hanzi: '热情', pinyin: 'rèqíng', tones: [4,2], translation: 'горячий; энтузиазм', hsk: 3, tags: ['adj'] },
  { id: 'h3_032', hanzi: '安静', pinyin: 'ānjìng', tones: [1,4], translation: 'тихий, спокойный', hsk: 3, tags: ['adj'] },
  { id: 'h3_033', hanzi: '安全', pinyin: 'ānquán', tones: [1,2], translation: 'безопасный', hsk: 3, tags: ['adj'] },
  { id: 'h3_034', hanzi: '健康', pinyin: 'jiànkāng', tones: [4,1], translation: 'здоровый; здоровье', hsk: 3, tags: ['adj'] },
  { id: 'h3_035', hanzi: '整齐', pinyin: 'zhěngqí', tones: [3,2], translation: 'аккуратный, ровный', hsk: 3, tags: ['adj'] },
  { id: 'h3_036', hanzi: '文化', pinyin: 'wénhuà', tones: [2,4], translation: 'культура', hsk: 3, tags: ['noun'] },
  { id: 'h3_037', hanzi: '历史', pinyin: 'lìshǐ', tones: [4,3], translation: 'история', hsk: 3, tags: ['noun'] },
  { id: 'h3_038', hanzi: '社会', pinyin: 'shèhuì', tones: [4,4], translation: 'общество', hsk: 3, tags: ['noun'] },
  { id: 'h3_039', hanzi: '经济', pinyin: 'jīngjì', tones: [1,4], translation: 'экономика', hsk: 3, tags: ['noun'] },
  { id: 'h3_040', hanzi: '政府', pinyin: 'zhèngfǔ', tones: [4,3], translation: 'правительство', hsk: 3, tags: ['noun'] },
  { id: 'h3_041', hanzi: '环境', pinyin: 'huánjìng', tones: [2,4], translation: 'окружающая среда', hsk: 3, tags: ['noun'] },
  { id: 'h3_042', hanzi: '自然', pinyin: 'zìrán', tones: [4,2], translation: 'природа; естественный', hsk: 3, tags: ['noun'] },
  { id: 'h3_043', hanzi: '科学', pinyin: 'kēxué', tones: [1,2], translation: 'наука', hsk: 3, tags: ['noun'] },
  { id: 'h3_044', hanzi: '技术', pinyin: 'jìshù', tones: [4,4], translation: 'технология', hsk: 3, tags: ['noun'] },
  { id: 'h3_045', hanzi: '网络', pinyin: 'wǎngluò', tones: [3,4], translation: 'интернет; сеть', hsk: 3, tags: ['noun'] },
  { id: 'h3_046', hanzi: '手机', pinyin: 'shǒujī', tones: [3,1], translation: 'мобильный телефон', hsk: 3, tags: ['tech'] },
  { id: 'h3_047', hanzi: '电脑', pinyin: 'diànnǎo', tones: [4,3], translation: 'компьютер', hsk: 3, tags: ['tech'] },
  { id: 'h3_048', hanzi: '电视', pinyin: 'diànshì', tones: [4,4], translation: 'телевизор', hsk: 3, tags: ['tech'] },
  { id: 'h3_049', hanzi: '音乐', pinyin: 'yīnyuè', tones: [1,4], translation: 'музыка', hsk: 3, tags: ['art'] },
  { id: 'h3_050', hanzi: '电影', pinyin: 'diànyǐng', tones: [4,3], translation: 'фильм', hsk: 3, tags: ['art'] },
  { id: 'h3_051', hanzi: '照片', pinyin: 'zhàopiàn', tones: [4,4], translation: 'фотография', hsk: 3, tags: ['noun'] },
  { id: 'h3_052', hanzi: '故事', pinyin: 'gùshi', tones: [4,0], translation: 'история; рассказ', hsk: 3, tags: ['noun'] },
  { id: 'h3_053', hanzi: '消息', pinyin: 'xiāoxi', tones: [1,0], translation: 'новость; известие', hsk: 3, tags: ['noun'] },
  { id: 'h3_054', hanzi: '原因', pinyin: 'yuányīn', tones: [2,1], translation: 'причина', hsk: 3, tags: ['noun'] },
  { id: 'h3_055', hanzi: '结果', pinyin: 'jiéguǒ', tones: [2,3], translation: 'результат', hsk: 3, tags: ['noun'] },
  { id: 'h3_056', hanzi: '方法', pinyin: 'fāngfǎ', tones: [1,3], translation: 'метод, способ', hsk: 3, tags: ['noun'] },
  { id: 'h3_057', hanzi: '问题', pinyin: 'wèntí', tones: [4,2], translation: 'вопрос; проблема', hsk: 3, tags: ['noun'] },
  { id: 'h3_058', hanzi: '解决', pinyin: 'jiějué', tones: [3,2], translation: 'решать (проблему)', hsk: 3, tags: ['verb'] },
  { id: 'h3_059', hanzi: '影响', pinyin: 'yǐngxiǎng', tones: [3,3], translation: 'влияние; влиять', hsk: 3, tags: ['verb'] },
  { id: 'h3_060', hanzi: '发展', pinyin: 'fāzhǎn', tones: [1,3], translation: 'развиваться; развитие', hsk: 3, tags: ['verb'] },
  { id: 'h3_061', hanzi: '改变', pinyin: 'gǎibiàn', tones: [3,4], translation: 'изменять(ся)', hsk: 3, tags: ['verb'] },
  { id: 'h3_062', hanzi: '保护', pinyin: 'bǎohù', tones: [3,4], translation: 'защищать', hsk: 3, tags: ['verb'] },
  { id: 'h3_063', hanzi: '注意', pinyin: 'zhùyì', tones: [4,4], translation: 'обращать внимание', hsk: 3, tags: ['verb'] },
  { id: 'h3_064', hanzi: '参加', pinyin: 'cānjiā', tones: [1,1], translation: 'участвовать', hsk: 3, tags: ['verb'] },
  { id: 'h3_065', hanzi: '选择', pinyin: 'xuǎnzé', tones: [3,2], translation: 'выбирать; выбор', hsk: 3, tags: ['verb'] },
  { id: 'h3_066', hanzi: '需要', pinyin: 'xūyào', tones: [1,4], translation: 'нуждаться; нужно', hsk: 3, tags: ['verb'] },
  { id: 'h3_067', hanzi: '使用', pinyin: 'shǐyòng', tones: [3,4], translation: 'использовать', hsk: 3, tags: ['verb'] },
  { id: 'h3_068', hanzi: '准备', pinyin: 'zhǔnbèi', tones: [3,4], translation: 'готовить(ся)', hsk: 3, tags: ['verb'] },
  { id: 'h3_069', hanzi: '接受', pinyin: 'jiēshòu', tones: [1,4], translation: 'принимать', hsk: 3, tags: ['verb'] },
  { id: 'h3_070', hanzi: '拒绝', pinyin: 'jùjué', tones: [4,2], translation: 'отказывать', hsk: 3, tags: ['verb'] },
  { id: 'h3_071', hanzi: '联系', pinyin: 'liánxì', tones: [2,4], translation: 'связываться; связь', hsk: 3, tags: ['verb'] },
  { id: 'h3_072', hanzi: '比较', pinyin: 'bǐjiào', tones: [3,4], translation: 'сравнивать; относительно', hsk: 3, tags: ['verb'] },
  { id: 'h3_073', hanzi: '相同', pinyin: 'xiāngtóng', tones: [1,2], translation: 'одинаковый', hsk: 3, tags: ['adj'] },
  { id: 'h3_074', hanzi: '不同', pinyin: 'bùtóng', tones: [4,2], translation: 'разный, отличающийся', hsk: 3, tags: ['adj'] },
  { id: 'h3_075', hanzi: '专业', pinyin: 'zhuānyè', tones: [1,4], translation: 'специальность; профессиональный', hsk: 3, tags: ['noun'] },
  { id: 'h3_076', hanzi: '经验', pinyin: 'jīngyàn', tones: [1,4], translation: 'опыт', hsk: 3, tags: ['noun'] },
  { id: 'h3_077', hanzi: '机会', pinyin: 'jīhuì', tones: [1,4], translation: 'возможность', hsk: 3, tags: ['noun'] },
  { id: 'h3_078', hanzi: '时间', pinyin: 'shíjiān', tones: [2,1], translation: 'время', hsk: 3, tags: ['noun'] },
  { id: 'h3_079', hanzi: '地方', pinyin: 'dìfāng', tones: [4,1], translation: 'место', hsk: 3, tags: ['noun'] },
  { id: 'h3_080', hanzi: '情况', pinyin: 'qíngkuàng', tones: [2,4], translation: 'ситуация', hsk: 3, tags: ['noun'] },

  // ═══════════════ HSK 4 ═══════════════
  { id: 'h4_001', hanzi: '实际', pinyin: 'shíjì', tones: [2,4], translation: 'практический; в действительности', hsk: 4, tags: ['adj'] },
  { id: 'h4_002', hanzi: '具体', pinyin: 'jùtǐ', tones: [4,3], translation: 'конкретный', hsk: 4, tags: ['adj'] },
  { id: 'h4_003', hanzi: '积极', pinyin: 'jījí', tones: [1,2], translation: 'активный; позитивный', hsk: 4, tags: ['adj'] },
  { id: 'h4_004', hanzi: '消极', pinyin: 'xiāojí', tones: [1,2], translation: 'пассивный; негативный', hsk: 4, tags: ['adj'] },
  { id: 'h4_005', hanzi: '客观', pinyin: 'kèguān', tones: [4,1], translation: 'объективный', hsk: 4, tags: ['adj'] },
  { id: 'h4_006', hanzi: '主观', pinyin: 'zhǔguān', tones: [3,1], translation: 'субъективный', hsk: 4, tags: ['adj'] },
  { id: 'h4_007', hanzi: '逐渐', pinyin: 'zhújiàn', tones: [2,4], translation: 'постепенно', hsk: 4, tags: ['adv'] },
  { id: 'h4_008', hanzi: '突然', pinyin: 'tūrán', tones: [1,2], translation: 'внезапно', hsk: 4, tags: ['adv'] },
  { id: 'h4_009', hanzi: '非常', pinyin: 'fēicháng', tones: [1,2], translation: 'чрезвычайно', hsk: 4, tags: ['adv'] },
  { id: 'h4_010', hanzi: '格外', pinyin: 'géwài', tones: [2,4], translation: 'особенно', hsk: 4, tags: ['adv'] },
  { id: 'h4_011', hanzi: '至今', pinyin: 'zhìjīn', tones: [4,1], translation: 'до сих пор', hsk: 4, tags: ['adv'] },
  { id: 'h4_012', hanzi: '彼此', pinyin: 'bǐcǐ', tones: [3,3], translation: 'друг друга', hsk: 4, tags: ['pronoun'] },
  { id: 'h4_013', hanzi: '互相', pinyin: 'hùxiāng', tones: [4,1], translation: 'взаимно', hsk: 4, tags: ['adv'] },
  { id: 'h4_014', hanzi: '竟然', pinyin: 'jìngrán', tones: [4,2], translation: 'оказывается; неожиданно', hsk: 4, tags: ['adv'] },
  { id: 'h4_015', hanzi: '即使', pinyin: 'jíshǐ', tones: [2,3], translation: 'даже если', hsk: 4, tags: ['conj'] },
  { id: 'h4_016', hanzi: '尽管', pinyin: 'jǐnguǎn', tones: [3,3], translation: 'хотя; несмотря на', hsk: 4, tags: ['conj'] },
  { id: 'h4_017', hanzi: '况且', pinyin: 'kuàngqiě', tones: [4,3], translation: 'кроме того', hsk: 4, tags: ['conj'] },
  { id: 'h4_018', hanzi: '宁可', pinyin: 'nìngkě', tones: [4,3], translation: 'лучше; предпочтительнее', hsk: 4, tags: ['conj'] },
  { id: 'h4_019', hanzi: '仿佛', pinyin: 'fǎngfú', tones: [3,2], translation: 'как будто', hsk: 4, tags: ['adv'] },
  { id: 'h4_020', hanzi: '显然', pinyin: 'xiǎnrán', tones: [3,2], translation: 'очевидно', hsk: 4, tags: ['adv'] },
  { id: 'h4_021', hanzi: '自信', pinyin: 'zìxìn', tones: [4,4], translation: 'уверенность в себе', hsk: 4, tags: ['noun'] },
  { id: 'h4_022', hanzi: '勇气', pinyin: 'yǒngqì', tones: [3,4], translation: 'смелость', hsk: 4, tags: ['noun'] },
  { id: 'h4_023', hanzi: '耐心', pinyin: 'nàixīn', tones: [4,1], translation: 'терпение', hsk: 4, tags: ['noun'] },
  { id: 'h4_024', hanzi: '智慧', pinyin: 'zhìhuì', tones: [4,4], translation: 'мудрость', hsk: 4, tags: ['noun'] },
  { id: 'h4_025', hanzi: '责任', pinyin: 'zérèn', tones: [2,4], translation: 'ответственность', hsk: 4, tags: ['noun'] },
  { id: 'h4_026', hanzi: '矛盾', pinyin: 'máodùn', tones: [2,4], translation: 'противоречие', hsk: 4, tags: ['noun'] },
  { id: 'h4_027', hanzi: '联想', pinyin: 'liánxiǎng', tones: [2,3], translation: 'ассоциация; воображать', hsk: 4, tags: ['verb'] },
  { id: 'h4_028', hanzi: '印象', pinyin: 'yìnxiàng', tones: [4,4], translation: 'впечатление', hsk: 4, tags: ['noun'] },
  { id: 'h4_029', hanzi: '态度', pinyin: 'tàidu', tones: [4,0], translation: 'отношение; позиция', hsk: 4, tags: ['noun'] },
  { id: 'h4_030', hanzi: '立场', pinyin: 'lìchǎng', tones: [4,3], translation: 'позиция; точка зрения', hsk: 4, tags: ['noun'] },
  { id: 'h4_031', hanzi: '观点', pinyin: 'guāndiǎn', tones: [1,3], translation: 'точка зрения', hsk: 4, tags: ['noun'] },
  { id: 'h4_032', hanzi: '意见', pinyin: 'yìjiàn', tones: [4,4], translation: 'мнение; возражение', hsk: 4, tags: ['noun'] },
  { id: 'h4_033', hanzi: '建议', pinyin: 'jiànyì', tones: [4,4], translation: 'предложение; советовать', hsk: 4, tags: ['noun'] },
  { id: 'h4_034', hanzi: '批评', pinyin: 'pīpíng', tones: [1,2], translation: 'критиковать', hsk: 4, tags: ['verb'] },
  { id: 'h4_035', hanzi: '表扬', pinyin: 'biǎoyáng', tones: [3,2], translation: 'хвалить', hsk: 4, tags: ['verb'] },
  { id: 'h4_036', hanzi: '鼓励', pinyin: 'gǔlì', tones: [3,4], translation: 'поощрять', hsk: 4, tags: ['verb'] },
  { id: 'h4_037', hanzi: '支持', pinyin: 'zhīchí', tones: [1,2], translation: 'поддерживать', hsk: 4, tags: ['verb'] },
  { id: 'h4_038', hanzi: '反对', pinyin: 'fǎnduì', tones: [3,4], translation: 'возражать', hsk: 4, tags: ['verb'] },
  { id: 'h4_039', hanzi: '赞成', pinyin: 'zànchéng', tones: [4,2], translation: 'соглашаться', hsk: 4, tags: ['verb'] },
  { id: 'h4_040', hanzi: '承认', pinyin: 'chéngrèn', tones: [2,4], translation: 'признавать', hsk: 4, tags: ['verb'] },
  { id: 'h4_041', hanzi: '怀疑', pinyin: 'huáiyí', tones: [2,2], translation: 'сомневаться', hsk: 4, tags: ['verb'] },
  { id: 'h4_042', hanzi: '证明', pinyin: 'zhèngmíng', tones: [4,2], translation: 'доказывать', hsk: 4, tags: ['verb'] },
  { id: 'h4_043', hanzi: '调查', pinyin: 'diàochá', tones: [4,2], translation: 'расследовать; исследование', hsk: 4, tags: ['verb'] },
  { id: 'h4_044', hanzi: '分析', pinyin: 'fēnxī', tones: [1,1], translation: 'анализировать', hsk: 4, tags: ['verb'] },
  { id: 'h4_045', hanzi: '研究', pinyin: 'yánjiū', tones: [2,1], translation: 'исследовать; исследование', hsk: 4, tags: ['verb'] },
  { id: 'h4_046', hanzi: '探索', pinyin: 'tànsuǒ', tones: [4,3], translation: 'исследовать; изучать', hsk: 4, tags: ['verb'] },
  { id: 'h4_047', hanzi: '实现', pinyin: 'shíxiàn', tones: [2,4], translation: 'осуществлять', hsk: 4, tags: ['verb'] },
  { id: 'h4_048', hanzi: '追求', pinyin: 'zhuīqiú', tones: [1,2], translation: 'стремиться', hsk: 4, tags: ['verb'] },
  { id: 'h4_049', hanzi: '放弃', pinyin: 'fàngqì', tones: [4,4], translation: 'отказываться', hsk: 4, tags: ['verb'] },
  { id: 'h4_050', hanzi: '坚持', pinyin: 'jiānchí', tones: [1,2], translation: 'настаивать; упорствовать', hsk: 4, tags: ['verb'] },
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
