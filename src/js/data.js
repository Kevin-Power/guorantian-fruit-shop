// ===== 當季設定：換季只要改這裡 =====
// SEASON.key：'pear'（秋季・梨山甘露梨）或 'peach'（夏季・梨山上海蜜水蜜桃）
// 明年夏天換回水蜜桃：key 改 'peach'、把下方水蜜桃各規格 inStock 改回 true
const SEASON = {
  key: 'pear',
  fruit: '甘露梨',
  fullName: '梨山甘露梨',
  emoji: '🍐'
};

// 本季是否完售：true = 停收新訂單（匯款回報與對帳照常運作）
const SOLD_OUT = false;

// ===== 運費（同一配送地址單筆訂單，依產季設定）=====
// freeFrom：滿幾盒免運；freeEvery：幾的倍數免運（餘數盒數依 tiers 計費）
const SHIPPING_RULES = {
  // 甘露梨：1～2盒 150 元、同一地址 3 盒以上免運
  pear: {
    label: '運費',
    freeFrom: 3,
    tiers: [
      { upTo: 2, fee: 150 }
    ]
  },
  // 水蜜桃：全程冷鏈，1～2盒 300、3～5盒 380、6 的倍數免運
  peach: {
    label: '冷鏈運費',
    freeEvery: 6,
    tiers: [
      { upTo: 2, fee: 300 },
      { upTo: 5, fee: 380 }
    ]
  }
};

const SHIPPING = SHIPPING_RULES[SEASON.key];

// ===== 商品資料（依產季分組）=====
// spec/size/badge/flag/limited/note 給首頁卡片與價目表使用；price 為 null 代表價格確認中
const PRODUCT_LINES = {
  // 秋季：梨山甘露梨
  pear: [
    // 2026 梨山甘露梨禮盒：售價 = 通勝果園報價 + 100；10 月上旬起陸續採收，採預購
    {
      id: 31,
      spec: "10粒裝",
      size: "每顆約10～12兩",
      badge: "🏠 自家吃首選",
      img: "src/img/pear-box.svg",
      photo: "src/img/photo-pear-hand.jpg",
      name: "梨山甘露梨 10粒裝",
      emoji: "🍐",
      price: 800,
      unit: "盒（10粒，每顆約10～12兩）",
      category: "甘露梨",
      origin: "台中梨山",
      description: "每顆約10～12兩（約375～450公克），一盒10顆分量十足，全家天天都有得吃。梨山高山甘露梨，果肉細緻、清甜多汁，冰過更爽口。",
      tags: ["自家吃", "梨山產地", "預購中"],
      inStock: true
    },
    {
      id: 32,
      spec: "8粒裝",
      size: "每顆約12～14兩",
      badge: "🍐 分量剛好",
      img: "src/img/pear-pair.svg",
      photo: "src/img/photo-pear-8box.jpg",
      name: "梨山甘露梨 8粒裝",
      emoji: "🍐",
      price: 900,
      unit: "盒（8粒，每顆約12～14兩）",
      category: "甘露梨",
      origin: "台中梨山",
      description: "每顆約12～14兩，比10粒裝大一號，自家吃、分送親友都剛剛好。咬下清脆多汁、甜而不膩。",
      tags: ["分量剛好", "梨山產地", "預購中"],
      inStock: true
    },
    {
      id: 33,
      spec: "8大裝",
      size: "每顆約14～16兩",
      badge: "✨ 將近1台斤",
      img: "src/img/pear-pair.svg",
      photo: "src/img/photo-pear-8box.jpg",
      name: "梨山甘露梨 8大裝",
      emoji: "🍐",
      price: 1000,
      unit: "盒（8粒，每顆約14～16兩）",
      category: "甘露梨",
      origin: "台中梨山",
      description: "每顆約14～16兩，將近1台斤，顆顆飽滿，一刀切下汁水直流。",
      tags: ["大果", "梨山產地", "預購中"],
      inStock: true
    },
    {
      id: 34,
      spec: "8特裝",
      size: "每顆約16～18兩",
      badge: "✨ 1台斤以上",
      img: "src/img/pear-pair.svg",
      photo: "src/img/photo-pear-8box.jpg",
      name: "梨山甘露梨 8特裝",
      emoji: "🍐",
      price: 1100,
      unit: "盒（8粒，每顆約16～18兩）",
      category: "甘露梨",
      origin: "台中梨山",
      description: "每顆約16～18兩，超過1台斤的大果，8顆排滿一盒，打開就是滿滿的份量感。",
      tags: ["大果", "梨山產地", "預購中"],
      inStock: true
    },
    {
      id: 35,
      spec: "6粒裝",
      size: "每顆約18～20兩",
      badge: "🎁 送禮首選",
      img: "src/img/pear-sparkle.svg",
      photo: "src/img/photo-pear-6box.jpg",
      name: "梨山甘露梨 6粒裝",
      emoji: "🍐",
      price: 1100,
      unit: "盒（6粒，每顆約18～20兩）",
      category: "甘露梨",
      origin: "台中梨山",
      description: "每顆約18～20兩，大果禮盒的入門款，6顆整齊排好，送禮大方又實在。",
      tags: ["送禮首選", "梨山產地", "預購中"],
      inStock: true
    },
    {
      id: 36,
      spec: "6大裝",
      size: "每顆約20～22兩",
      badge: "🎁 大果禮盒",
      img: "src/img/pear-sparkle.svg",
      photo: "src/img/photo-pear-6box.jpg",
      name: "梨山甘露梨 6大裝",
      emoji: "🍐",
      price: 1300,
      unit: "盒（6粒，每顆約20～22兩）",
      category: "甘露梨",
      origin: "台中梨山",
      description: "每顆約20～22兩，果形端正飽滿，禮盒打開就是滿滿的誠意。",
      tags: ["送禮", "梨山產地", "預購中"],
      inStock: true
    },
    {
      id: 37,
      spec: "5粒裝",
      size: "每顆約22～24兩",
      badge: "👑 一手握不住",
      img: "src/img/pear-crown.svg",
      photo: "src/img/photo-pear-hand.jpg",
      name: "梨山甘露梨 5粒裝",
      emoji: "🍐",
      price: 1400,
      unit: "盒（5粒，每顆約22～24兩）",
      category: "甘露梨",
      origin: "台中梨山",
      description: "每顆約22～24兩，一手快要握不住的大果，秋天送禮最有面子。",
      tags: ["特大果", "梨山產地", "預購中"],
      inStock: true
    },
    {
      id: 38,
      spec: "5大裝",
      size: "每顆約24～26兩",
      badge: "👑 將近1公斤",
      img: "src/img/pear-crown.svg",
      photo: "src/img/photo-pear-hand.jpg",
      name: "梨山甘露梨 5大裝",
      emoji: "🍐",
      price: 1500,
      unit: "盒（5粒，每顆約24～26兩）",
      category: "甘露梨",
      origin: "台中梨山",
      description: "每顆約24～26兩，將近1公斤的特大果，放在掌心沉甸甸。",
      tags: ["特大果", "梨山產地", "預購中"],
      inStock: true
    },
    {
      id: 39,
      spec: "5特裝",
      size: "每顆約26～28兩",
      badge: "👑 頂級特大果",
      img: "src/img/pear-crown.svg",
      photo: "src/img/photo-pear-hand.jpg",
      name: "梨山甘露梨 5特裝",
      emoji: "🍐",
      price: 1600,
      unit: "盒（5粒，每顆約26～28兩）",
      category: "甘露梨",
      origin: "台中梨山",
      description: "每顆約26～28兩（約1公斤），全系列最大的頂級規格，是甘露梨裡的天花板。",
      tags: ["頂級", "約1公斤", "預購中"],
      inStock: true
    }
  ],

  // 夏季：梨山上海蜜水蜜桃（2026 已完售，明年夏天沿用）
  peach:   [
    {
      id: 13,
      spec: "8粒裝",
      size: "約5～6兩",
      badge: "🏠 自家吃首選",
      photo: "src/img/photo-8box.jpg",
      img: "src/img/sticker-box.png",
      name: "梨山上海蜜水蜜桃 8粒裝",
      emoji: "🍑",
      price: 750,
      unit: "盒（8粒，每顆約5～6兩）",
      category: "水蜜桃",
      season: "7月上旬-8月上旬",
      origin: "台中梨山",
      sugar: "14-18°Brix",
      description: "品種「上海蜜」。生長於海拔2000公尺的梨山果園，草生栽培、山泉水灌溉，每一顆都親手套袋呵護。果皮薄如紙、咬下甜汁溢出、果肉柔嫩入口即化，8粒裝自家吃剛剛好。一年只有短短三週，錯過再等一年。",
      tags: ["當季", "高山限定", "全程冷鏈"],
      rating: 5.0,
      reviews: 312,
      inStock: false
    },
    {
      id: 21,
      spec: "6粒裝",
      size: "約6～7兩",
      badge: "🔥 回購 No.1",
      flag: "最多人買",
      photo: "src/img/photo-6box.jpg",
      img: "src/img/sticker-pair.png",
      name: "梨山上海蜜水蜜桃 6粒裝",
      emoji: "🍑",
      price: 850,
      unit: "盒（6粒，每顆約6～7兩）",
      category: "水蜜桃",
      season: "7月上旬-8月上旬",
      origin: "台中梨山",
      sugar: "14-18°Brix",
      description: "每顆約6～7兩，比8粒裝更大更飽滿。天還沒亮就上山巡園，只挑熟度剛剛好的那幾顆採下山。一手快握不住的份量，咬下去蜜汁順著指縫流，是老客人回購率最高的規格。",
      tags: ["熱銷", "高山限定", "全程冷鏈"],
      rating: 5.0,
      reviews: 286,
      inStock: false
    },
    {
      id: 22,
      spec: "5粒裝",
      size: "約7～8兩",
      badge: "🎁 送禮首選",
      photo: "src/img/photo-5box.jpg",
      img: "src/img/sticker-sparkle.png",
      name: "梨山上海蜜水蜜桃 5粒裝",
      emoji: "🍑",
      price: 950,
      unit: "盒（5粒，每顆約7～8兩）",
      category: "水蜜桃",
      season: "7月上旬-8月上旬",
      origin: "台中梨山",
      sugar: "14-18°Brix",
      description: "每顆約7～8兩的大果，全園裡長得最好的那一批。果形圓潤、香氣濃郁，打開盒蓋整個房間都是水蜜桃香，送禮大方有面子。好桃子，自己會說話。",
      tags: ["送禮首選", "高山限定", "全程冷鏈"],
      rating: 5.0,
      reviews: 194,
      inStock: false
    },
    {
      id: 23,
      spec: "5大裝",
      size: "8兩以上・限量",
      badge: "👑 頂級限量",
      limited: true,
      note: "限量預訂・依採收供貨",
      photo: "src/img/photo-5big.jpg",
      img: "src/img/sticker-crown.png",
      name: "梨山上海蜜水蜜桃 5大裝",
      emoji: "🍑",
      price: 1100,
      unit: "盒（5粒，每顆8兩以上）",
      category: "水蜜桃",
      season: "7月上旬-8月上旬",
      origin: "台中梨山",
      sugar: "14-18°Brix",
      description: "每顆8兩以上的頂級大果，數量稀少，一棵樹採不出幾顆，是全園一顆一顆親手挑選出來的驕傲。放在掌心沉甸甸，是水蜜桃裡的天花板。※ 8兩以上為限量規格，可接受預訂，依採收狀況供貨，不保證一定有貨，敬請見諒。",
      tags: ["限量", "可預訂", "頂級"],
      rating: 5.0,
      reviews: 87,
      inStock: false
    }
  ]
};

const fruitsData = PRODUCT_LINES[SEASON.key];

// ===== 水果知識庫（依產季分組）=====
const KNOWLEDGE = {
  pear: [
    {
      id: 101,
      fruit: "甘露梨",
      emoji: "🍐",
      title: "怎麼挑最好吃的甘露梨",
      category: "挑選技巧",
      content: "好梨看三件事：果形飽滿端正、果皮光滑沒有碰傷、同樣大小拿起來越沉的越多汁。水梨不需要追熟，在樹上熟成的甜度就是它最好吃的樣子——所以「熟了才採」比什麼都重要。",
      tips: ["同樣大小，拿起來越沉的越多汁", "果皮光滑完整、沒有碰傷凹陷", "果梗新鮮，代表採收不久"]
    },
    {
      id: 102,
      fruit: "甘露梨",
      emoji: "❄️",
      title: "甘露梨怎麼保存",
      category: "保存方法",
      content: "水梨收到就能吃，不用追熟。吃不完的用報紙或保鮮袋一顆一顆包好，放進冰箱冷藏，可以減少水分流失、保持清脆口感。越新鮮越好吃，建議收到後盡早享用。",
      tips: ["包好再冷藏，避免果皮失水變皺", "冰過再吃，清脆又爽口", "切開後盡快吃完，避免氧化變色"]
    },
    {
      id: 103,
      fruit: "甘露梨",
      emoji: "🔪",
      title: "甘露梨怎麼吃最對味",
      category: "吃法推薦",
      content: "最經典的吃法就是冰過削皮切塊，一口咬下清脆爆汁。秋冬天氣轉涼，也可以加冰糖燉成梨湯，暖暖的甜湯全家都愛。",
      tips: ["冰過削皮切塊，最能吃出清甜", "削好的梨泡一下淡鹽水，比較不會變色", "冰糖燉梨，秋冬的暖心甜湯"]
    },
    {
      id: 104,
      fruit: "甘露梨",
      emoji: "⚖️",
      title: "「斤」和「兩」怎麼換算",
      category: "常見疑問",
      content: "台灣賣水果常用台斤：1台斤 = 16兩 = 600公克。梨山的慣例是連套袋一起秤重，因為拆袋容易傷到果皮；水果從採收到送達也會自然流失一點水分，重量可能有些微誤差。如果誤差超出你能接受的範圍，直接告訴我們，一定給你滿意的處理方式。",
      tips: ["1台斤 = 16兩 = 600公克", "1兩 = 37.5公克", "有疑問直接 LINE 我們，一定給你滿意的答覆"]
    },
    {
      id: 105,
      fruit: "甘露梨",
      emoji: "🏔️",
      title: "梨山，因梨得名",
      category: "產地故事",
      content: "梨山海拔約2000公尺，高山冷涼、日夜溫差大，特別適合溫帶水梨生長，「梨山」這個名字就是因為這裡盛產梨子而來。白天曬飽陽光、夜裡低溫把甜分鎖進果肉，這是高山梨細緻多汁的秘密。",
      tips: ["海拔越高、溫差越大，果肉越細緻", "秋季限定，一年只收一次", "賣完就要再等一年"]
    },
    {
      id: 106,
      fruit: "甘露梨",
      emoji: "💧",
      title: "水梨的營養",
      category: "營養知識",
      content: "水梨水分飽滿、富含膳食纖維，熱量不高，秋天天氣乾燥時來一顆最解渴。冰涼爽脆的口感，是大人小孩都喜歡的飯後水果。",
      tips: ["水分飽滿，秋天解渴首選", "富含膳食纖維", "飯後來一片，清爽不膩口"]
    }
  ],

  peach:   [
    {
      id: 1,
      fruit: "水蜜桃",
      emoji: "🍑",
      title: "怎麼挑最好吃的水蜜桃",
      category: "挑選技巧",
      content: "好的水蜜桃看三個地方：果皮帶著自然的紅暈與細絨毛、湊近有濃郁香氣、輕壓果頂有一點點彈性。梨山上海蜜果皮薄如紙，成熟時香氣會自己飄出來——果園裡的老經驗：用鼻子挑桃子，比用眼睛準。",
      tips: ["輕壓果頂有微微彈性代表熟成剛好", "香氣越濃表示越接近最佳賞味期", "絨毛完整代表沒有過度碰撞搬運"]
    },
    {
      id: 2,
      fruit: "水蜜桃",
      emoji: "🌡️",
      title: "水蜜桃的追熟與保存",
      category: "保存方法",
      content: "收到水蜜桃如果還偏硬，放室溫陰涼處 1-2 天追熟，香氣會越來越濃；摸起來微軟就是最好吃的時候。要冰的話等熟了再冰，冷藏後風味更清甜，但不要超過 3 天——水蜜桃不等人。",
      tips: ["偏硬先常溫追熟，變軟再冷藏", "冷藏前用紙巾包好，避免吸走水分", "食用前 30 分鐘從冰箱取出，甜度香氣最佳"]
    },
    {
      id: 3,
      fruit: "水蜜桃",
      emoji: "⚖️",
      title: "「兩數」是怎麼算的",
      category: "常見疑問",
      content: "梨山的慣例是連套袋一起過選果機秤重，因為拆袋容易傷到嬌嫩的果皮。水蜜桃從採收到送達會自然流失一點水分，重量可能有些微誤差。如果誤差超出你能接受的範圍，直接告訴我們，一定給你滿意的處理方式。",
      tips: ["1兩 = 37.5公克，8兩約300公克", "連袋秤重是保護果實的必要做法", "有疑問直接 LINE 我們，一定給你滿意的答覆"]
    },
    {
      id: 4,
      fruit: "水蜜桃",
      emoji: "❄️",
      title: "全程冷鏈，為什麼重要",
      category: "配送知識",
      content: "水蜜桃是最嬌貴的水果，夏季高溫最容易造成悶熱、軟化與碰傷。我們從採收、包裝到宅配全程冷鏈冷藏，就是要讓桃子離開梨山時是什麼樣子，到你手上還是什麼樣子。",
      tips: ["收到請第一時間開箱檢查", "有任何問題儘速拍照聯繫我們", "配送高峰期請留意簡訊與電話通知"]
    },
    {
      id: 5,
      fruit: "水蜜桃",
      emoji: "💪",
      title: "水蜜桃的營養價值",
      category: "營養知識",
      content: "水蜜桃富含維生素C、鉀離子與膳食纖維，果肉柔軟好消化，是老人小孩都適合的水果。梨山日夜溫差大，果實把糖分慢慢存進去，甜度高卻不膩口，飯後一顆剛剛好。",
      tips: ["果皮營養豐富，洗淨後可連皮吃", "腸胃較弱者建議去皮食用", "冰過的水蜜桃打成冰沙是夏天的享受"]
    },
    {
      id: 6,
      fruit: "水蜜桃",
      emoji: "🏔️",
      title: "梨山上海蜜的產地故事",
      category: "產地故事",
      content: "梨山海拔約2000公尺，日夜溫差15°C以上，白天曬飽太陽、夜裡冷得把糖鎖進果肉——這是上海蜜甜的秘密。我們在這裡用心耕耘，只做一件事：把水蜜桃種好。每一顆套袋、每一次巡園，都是我們的堅持。",
      tips: ["產季只有7月上旬到8月上旬短短三週", "海拔越高、溫差越大，甜度越高", "草生栽培不用除草劑，果園裡蟲鳴鳥叫"]
    }
  ]
};

const fruitKnowledge = KNOWLEDGE[SEASON.key];
