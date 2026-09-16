export const DISCIPLINES = ["brand", "space", "motion", "culture"] as const;
export type Discipline = (typeof DISCIPLINES)[number];

export type Localized = { en: string; th: string; zh: string };

export type Work = {
  slug: string;
  year: string;
  client: Localized;
  location: Localized;
  disciplines: Discipline[];
  image: string;
  featured: boolean;
  title: Localized;
  subtitle: Localized;
  excerpt: Localized;
  body: { en: string[]; th: string[]; zh: string[] };
  roles: Localized;
  outcome: Localized;
};

export const WORKS: Work[] = [
  {
    slug: "noir-salon",
    year: "2025",
    client: { en: "Noir Salon", th: "นัวร์ ซาลอน", zh: "Noir Salon" },
    location: { en: "Bangkok", th: "กรุงเทพฯ", zh: "曼谷" },
    disciplines: ["brand", "space"],
    image: "/works/noir-salon.jpg",
    featured: true,
    title: { en: "Noir Salon", th: "นัวร์ ซาลอน", zh: "Noir Salon" },
    subtitle: {
      en: "A night room for hair — identity and interior as one material.",
      th: "ห้องกลางคืนสำหรับผม — อัตลักษณ์และภายในเป็นวัสดุเดียวกัน",
      zh: "为美发打造的夜色空间——让品牌形象与室内设计融为一体。",
    },
    excerpt: {
      en: "Black lacquer, bronze glass, and a circular mirror that does the talking. The mark is almost absent; the room is the mark.",
      th: "แล็กเกอร์ดำ กระจกสีบรอนซ์ และกระจกวงกลมที่พูดแทน โลโก้เกือบไม่ปรากฏ ห้องคือเครื่องหมาย",
      zh: "黑色漆面、古铜色玻璃与一面圆镜，共同表达空间的个性。标志几乎隐于无形，空间本身就是品牌的印记。",
    },
    body: {
      en: [
        "Noir asked for a logo. They needed a night. We treated the salon as a single object: lacquer, bronze glass, teak, and a circular mirror large enough to organise the plan.",
        "The identity is a quiet wordmark and a set of papers the colour of the walls. Photography is withheld. Guests arrive to the room, not to a campaign.",
      ],
      th: [
        "นัวร์ขอโลโก้ สิ่งที่ต้องการคือกลางคืน เรามองซาลอนเป็นวัตถุชิ้นเดียว: แล็กเกอร์ กระจกบรอนซ์ ไม้สัก และกระจกวงกลมที่ใหญ่พอจะจัดผัง",
        "อัตลักษณ์คือเวิร์ดมาร์กที่เงียบและกระดาษสีเดียวกับผนัง ไม่ใช้ภาพโฆษณา คนมาถึงห้อง ไม่ใช่แคมเปญ",
      ],
      zh: [
        "这一概念以夜色为核心，将美发沙龙视作一个整体：漆面、古铜色玻璃、柚木，以及足以组织平面布局的大圆镜。客户需求与设计委托尚未核实。",
        "品牌形象设想采用安静克制的文字标志与墙面同色的纸品，让空间本身成为来访者首先感受到的内容。",
      ],
    },
    roles: {
      en: "Identity, interior concept, materials",
      th: "อัตลักษณ์ แนวคิดภายใน วัสดุ",
      zh: "品牌形象、室内概念、材料设计",
    },
    outcome: {
      en: "A 90-square-metre salon opened in Thonglor with a paper system and a room that holds at night.",
      th: "ซาลอน 90 ตารางเมตรในทองหล่อ เปิดพร้อมระบบกระดาษและห้องที่อยู่ได้ในกลางคืน",
      zh: "概念方案设想：在通罗打造一间 90 平方米的美发沙龙，配套纸品系统与夜间空间氛围；实际落地情况尚未核实。",
    },
  },
  {
    slug: "rice-archive",
    year: "2024",
    client: { en: "Rice Archive", th: "คลังข้าว", zh: "Rice Archive" },
    location: { en: "Phitsanulok", th: "พิษณุโลก", zh: "彭世洛" },
    disciplines: ["culture", "space"],
    image: "/works/rice-archive.jpg",
    featured: true,
    title: { en: "Rice Archive", th: "คลังข้าว", zh: "Rice Archive" },
    subtitle: {
      en: "An exhibition hall that treats grain as a document.",
      th: "หอแสดงที่มองเมล็ดข้าวเป็นเอกสาร",
      zh: "一座以稻米为文献的展厅。",
    },
    excerpt: {
      en: "Vitrines of grain, paper banners, teak floors. A museum that refuses spectacle and still fills with light.",
      th: "ตู้เมล็ดข้าว แบนเนอร์กระดาษ พื้นไม้สัก พิพิธภัณฑ์ที่ไม่ใช้ความอลังการ แต่ยังเต็มด้วยแสง",
      zh: "盛放稻米的展柜、纸质挂幅与柚木地板，让展馆在克制的表达中充满光线。",
    },
    body: {
      en: [
        "The archive holds cultivars from the lower north. We designed a hall that behaves like a reading room: long vitrines, hanging paper, morning light from clerestory windows.",
        "Wayfinding is set in a single weight of type. The photographs already existed in family albums; we mounted them on linen and left them unnamed until the caption rail.",
      ],
      th: [
        "คลังเก็บสายพันธุ์จากภาคเหนือตอนล่าง เราออกแบบหอให้เป็นห้องอ่าน: ตู้ยาว กระดาษแขวน แสงเช้าจากหน้าต่างสูง",
        "ระบบนำทางใช้ตัวพิมพ์น้ำหนักเดียว ภาพมีอยู่แล้วในอัลบั้มครอบครัว เรามงบนผ้าลินิน และไม่ระบุชื่อจนกว่าจะถึงแถบคำบรรยาย",
      ],
      zh: [
        "概念设想以泰国北部南段的稻米品种为主题，将展厅设计成阅览室：长展柜、悬挂纸张与从高侧窗洒入的晨光。藏品来源及实际委托尚未核实。",
        "导视设想使用单一字重；影像以家庭相册为叙事线索，装裱于亚麻布上，并在说明栏中呈现文字。实际图像来源与使用权尚待核实。",
      ],
    },
    roles: {
      en: "Exhibition design, identity, wayfinding",
      th: "ออกแบบนิทรรศการ อัตลักษณ์ ระบบนำทาง",
      zh: "展览设计、品牌形象、导视系统",
    },
    outcome: {
      en: "A permanent hall for the provincial collection, with a bilingual paper guide.",
      th: "หอถาวรสำหรับคลังจังหวัด พร้อมคู่มือกระดาษสองภาษา",
      zh: "概念方案设想：为府级藏品打造常设展厅，并配套双语纸质导览；实际落地情况尚未核实。",
    },
  },
  {
    slug: "lunar-market",
    year: "2025",
    client: { en: "Lunar Market", th: "ตลาดจันทร์", zh: "Lunar Market" },
    location: { en: "Chiang Mai", th: "เชียงใหม่", zh: "清迈" },
    disciplines: ["brand", "space"],
    image: "/works/lunar-market.jpg",
    featured: true,
    title: { en: "Lunar Market", th: "ตลาดจันทร์", zh: "Lunar Market" },
    subtitle: {
      en: "Night-market wayfinding as stacked light.",
      th: "ระบบนำทางตลาดกลางคืนในฐานะแสงซ้อน",
      zh: "以层叠的光构建夜市导视系统。",
    },
    excerpt: {
      en: "Lanterns, wet stone, and a totem of glowing boxes. Identity that has to work in steam and rain.",
      th: "โคม หินเปียก และเสาแสงกล่องซ้อน อัตลักษณ์ที่ต้องทำงานในไอน้ำและฝน",
      zh: "灯笼、湿润的石面与堆叠发光箱体组成的标识柱，构成在蒸汽与雨中依然清晰的品牌形象。",
    },
    body: {
      en: [
        "A night market is already a graphic system. We did not add posters. We designed a totem of stacked light boxes and a set of stall numbers that can be read through steam.",
        "The wordmark lives on enamel and on the underside of canopies. Colour is borrowed from the lanterns already on site.",
      ],
      th: [
        "ตลาดกลางคืนเป็นระบบกราฟิกอยู่แล้ว เราไม่เพิ่มโปสเตอร์ แต่เราออกแบบเสาแสงกล่องซ้อนและเลขแผงที่อ่านได้ผ่านไอน้ำ",
        "เวิร์ดมาร์กอยู่บนเคลือบและใต้หลังคาแผง สีหยิบจากโคมที่มีอยู่แล้ว",
      ],
      zh: [
        "概念从夜市既有的视觉秩序出发，以层叠灯箱组成的标识柱和穿透蒸汽也易于辨认的摊位编号，组织空间信息。",
        "文字标志设想用于搪瓷表面与摊棚底部，色彩取自灯笼意象。现场状况与实际应用尚未核实。",
      ],
    },
    roles: {
      en: "Identity, wayfinding, lighting objects",
      th: "อัตลักษณ์ ระบบนำทาง วัตถุแสง",
      zh: "品牌形象、导视系统、灯光装置",
    },
    outcome: {
      en: "A 120-stall market reopened with a wayfinding kit that vendors can maintain.",
      th: "ตลาด 120 แผงเปิดใหม่พร้อมชุดนำทางที่แม่ค้าดูแลเองได้",
      zh: "概念方案设想：为拥有 120 个摊位的市场配备可由商户自行维护的导视套件；重新开放及交付情况尚未核实。",
    },
  },
  {
    slug: "teak-house",
    year: "2024",
    client: { en: "Private house", th: "บ้านส่วนตัว", zh: "私人住宅" },
    location: { en: "Lower north", th: "ภาคเหนือตอนล่าง", zh: "泰国北部南段" },
    disciplines: ["space", "motion"],
    image: "/works/teak-house.jpg",
    featured: true,
    title: { en: "Teak House", th: "บ้านไม้สัก", zh: "Teak House" },
    subtitle: {
      en: "A raised teak house, a pool, and a film of the light.",
      th: "บ้านไม้สักยกพื้น สระน้ำ และภาพยนตร์ของแสง",
      zh: "一座架高的柚木住宅、一池水与一部记录光线的短片。",
    },
    excerpt: {
      en: "Deep eaves, screens, late sun. We designed the house with the architect, then filmed how the day moves through it.",
      th: "ชายคายาว ฉากบัง แดดเย็น เราออกแบบบ้านร่วมกับสถาปนิก แล้วถ่ายว่าวันเคลื่อนผ่านอย่างไร",
      zh: "深挑檐、屏风与暮光，构成住宅的空间构想；概念叙事通过影像呈现一天的光线如何穿行其间。设计协作与拍摄情况尚未核实。",
    },
    body: {
      en: [
        "The brief was a house that could be opened to weather. We worked on the sequence of rooms, the teak screens, and a long pool that holds the sky.",
        "The film is eight minutes, no voice. It is how the client now shows the house — and how we show space when a photograph is not enough.",
      ],
      th: [
        "โจทย์คือบ้านที่เปิดสู่ลมฟ้าได้ เราทำงานลำดับห้อง ฉากไม้สัก และสระยาวที่รับท้องฟ้า",
        "ภาพยนตร์แปดนาที ไม่มีเสียงบรรยาย เป็นวิธีที่เจ้าของบ้านใช้โชว์บ้าน — และวิธีที่เราโชว์พื้นที่เมื่อภาพนิ่งไม่พอ",
      ],
      zh: [
        "概念围绕一座向自然天气敞开的住宅展开，探索房间序列、柚木屏风与映照天空的长形水池。实际委托及设计归属尚未核实。",
        "影像概念设想为一部八分钟、无旁白的短片，用时间呈现静态照片难以表达的空间体验；影片制作及业主使用情况尚未核实。",
      ],
    },
    roles: {
      en: "Spatial concept, interiors, film",
      th: "แนวคิดพื้นที่ ภายใน ภาพยนตร์",
      zh: "空间概念、室内设计、影像",
    },
    outcome: {
      en: "A completed house and a short film used for the archive and for future commissions.",
      th: "บ้านสร้างเสร็จและภาพยนตร์สั้นสำหรับคลังงานและงานจ้างต่อไป",
      zh: "概念方案设想：以住宅与短片建立项目档案，并展示未来委托的可能性；建成及影像交付情况尚未核实。",
    },
  },
  {
    slug: "monsoon-records",
    year: "2023",
    client: { en: "Monsoon Records", th: "มรสุม เรเคิดส์", zh: "Monsoon Records" },
    location: { en: "Bangkok", th: "กรุงเทพฯ", zh: "曼谷" },
    disciplines: ["brand", "motion"],
    image: "/works/monsoon-records.jpg",
    featured: false,
    title: { en: "Monsoon Records", th: "มรสุม เรเคิดส์", zh: "Monsoon Records" },
    subtitle: {
      en: "A label identity that can survive rain on the window.",
      th: "อัตลักษณ์ค่ายเพลงที่ทนฝนบนกระจกได้",
      zh: "以窗上雨痕为灵感的唱片厂牌形象。",
    },
    excerpt: {
      en: "Bone sleeves, black ink, a pressed flower. Packaging as a still life, motion as weather.",
      th: "ซองสีกระดูก หมึกดำ ดอกไม้อัด บรรจุภัณฑ์เป็นภาพนิ่ง โมชันเป็นอากาศ",
      zh: "骨白色唱片封套、黑色油墨与一朵压花，让包装成为静物，让动态影像化作天气。",
    },
    body: {
      en: [
        "An independent label needed a system that would not look like a playlist cover. We designed sleeves, labels, and a moving ident that behaves like rain on glass.",
        "Type is set once and reused. Colour is withheld except for a single pressed specimen per release.",
      ],
      th: [
        "ค่ายอิสระต้องการระบบที่ไม่เหมือนปกเพลย์ลิสต์ เราออกแบบซอง ป้าย และไอเดนต์เคลื่อนไหวที่ทำงานเหมือนฝนบนกระจก",
        "ตัวพิมพ์ตั้งครั้งเดียวแล้วใช้ซ้ำ สีถูกจำกัด เหลือตัวอย่างพืชอัดหนึ่งชิ้นต่ออัลบั้ม",
      ],
      zh: [
        "概念为独立唱片厂牌构想不同于播放列表封面的视觉系统，包括唱片封套、标签与如雨水滑过玻璃般的动态标识。实际委托尚未核实。",
        "排版设想保持统一并重复使用，色彩则有所节制，每张唱片仅以一件压制植物标本作为点缀。",
      ],
    },
    roles: {
      en: "Identity, packaging, motion ident",
      th: "อัตลักษณ์ บรรจุภัณฑ์ ไอเดนต์โมชัน",
      zh: "品牌形象、包装设计、动态标识",
    },
    outcome: {
      en: "A six-release system in use, with print and a title sequence for live sessions.",
      th: "ระบบหกอัลบั้มที่ใช้อยู่ พร้อมงานพิมพ์และไตเติลสำหรับเซสชันสด",
      zh: "概念方案设想：为六张唱片建立视觉系统，配套印刷品与现场演出的片头；实际使用情况尚未核实。",
    },
  },
  {
    slug: "river-night",
    year: "2025",
    client: { en: "River Night", th: "คืนแม่น้ำ", zh: "River Night" },
    location: { en: "Ayutthaya", th: "อยุธยา", zh: "大城" },
    disciplines: ["motion", "culture"],
    image: "/works/river-night.jpg",
    featured: false,
    title: { en: "River Night", th: "คืนแม่น้ำ", zh: "River Night" },
    subtitle: {
      en: "A river cruise told as long exposure, not as a brochure.",
      th: "ล่องเรือที่เล่าด้วยแสงยาว ไม่ใช่โบรชัวร์",
      zh: "以长曝光影像讲述一段夜间游船体验。",
    },
    excerpt: {
      en: "Dark water, temple roofs, a wooden pier. Experience design for a night on the river without lantern cliché.",
      th: "น้ำดำ หลังคาโบสถ์ ท่าไม้ ออกแบบประสบการณ์คืนแม่น้ำโดยไม่ใช้โคมซ้ำซาก",
      zh: "幽暗的水面、寺庙屋顶与木质码头，共同构成河上夜游的体验设计，避开惯常的灯笼意象。",
    },
    body: {
      en: [
        "The operator wanted lanterns. We gave them time. Guests board at dusk; the lighting on the pier is a single warm line; the film of the route plays below deck as a slow long exposure.",
        "Print is a timetable, not a souvenir. The souvenir is the hour.",
      ],
      th: [
        "ผู้ประกอบการอยากได้โคม เราให้เวลา คนขึ้นเรือยามค่ำ แสงบนท่าเป็นเส้นอุ่นเส้นเดียว ภาพเส้นทางเล่นใต้ดาดฟ้าเป็นการเปิดหน้ากล้องยาว",
        "งานพิมพ์คือตารางเวลา ไม่ใช่ของที่ระลึก ของที่ระลึกคือชั่วโมงนั้น",
      ],
      zh: [
        "概念以暮色登船为起点：码头仅留一条暖色灯光，舱内以缓慢的长曝光影像呈现航线，将时间作为体验的核心。运营方需求与实际实施尚未核实。",
        "纸质材料设想采用时刻表的形式，让旅程中的那段时光本身成为纪念。",
      ],
    },
    roles: {
      en: "Experience, film, print",
      th: "ประสบการณ์ ภาพยนตร์ สิ่งพิมพ์",
      zh: "体验设计、影像、印刷品",
    },
    outcome: {
      en: "A seasonal night route with a film and a paper timetable in two languages.",
      th: "เส้นทางกลางคืนตามฤดูกาล พร้อมภาพยนตร์และตารางกระดาษสองภาษา",
      zh: "概念方案设想：以影像与双语纸质时刻表呈现季节性夜游航线；航线运营及交付情况尚未核实。",
    },
  },
  {
    slug: "khao-yai",
    year: "2024",
    client: { en: "Khao Yai Pavilion", th: "ศาลาเขาใหญ่", zh: "Khao Yai Pavilion" },
    location: { en: "Khao Yai", th: "เขาใหญ่", zh: "考艾" },
    disciplines: ["space", "culture"],
    image: "/works/khao-yai.jpg",
    featured: false,
    title: { en: "Khao Yai Pavilion", th: "ศาลาเขาใหญ่", zh: "Khao Yai Pavilion" },
    subtitle: {
      en: "A fog-line pavilion for a hillside retreat.",
      th: "ศาลาแนวหมอกสำหรับที่พักเชิงเขา",
      zh: "为山坡度假居所构想的一座雾中亭舍。",
    },
    excerpt: {
      en: "Rammed earth, a circular skylight, forest as the fourth wall. A room that is mostly weather.",
      th: "ดินอัด ช่องแสงวงกลม ป่าเป็นผนังที่สี่ ห้องที่เป็นอากาศเสียส่วนใหญ่",
      zh: "夯土、圆形天窗与作为第四面墙的森林，让空间向天气敞开。",
    },
    body: {
      en: [
        "A retreat needed a common room that would not compete with the canopy. We cut a circle in the roof and left one wall open to fog.",
        "Furniture is linen and teak, almost nothing else. The identity of the retreat is this room, photographed only in the morning.",
      ],
      th: [
        "ที่พักต้องการห้องรวมที่ไม่แข่งกับเรือนยอดไม้ เราเจาะวงกลมบนหลังคา และเปิดผนังหนึ่งสู่หมอก",
        "เฟอร์นิเจอร์คือลินินกับไม้สัก เกือบไม่มีอย่างอื่น อัตลักษณ์ของที่พักคือห้องนี้ ถ่ายเฉพาะเช้า",
      ],
      zh: [
        "概念为山林度假居所构想一间与树冠相协调的公共空间：屋顶设圆形开口，一侧墙面向雾气敞开。实际需求及委托尚未核实。",
        "家具材料设想以亚麻与柚木为主，并用晨间影像表达空间与度假居所的气质。实际建成与摄影情况尚未核实。",
      ],
    },
    roles: {
      en: "Spatial concept, interiors, photography direction",
      th: "แนวคิดพื้นที่ ภายใน กำกับภาพ",
      zh: "空间概念、室内设计、摄影指导",
    },
    outcome: {
      en: "A completed pavilion used as the heart of the retreat and as its only public image.",
      th: "ศาลาสร้างเสร็จ ใช้เป็นหัวใจของที่พักและเป็นภาพสาธารณะเพียงชุด",
      zh: "概念方案设想：以亭舍作为度假居所的核心空间与对外视觉形象；建成及使用情况尚未核实。",
    },
  },
  {
    slug: "ink-atelier",
    year: "2023",
    client: { en: "Ink Atelier", th: "ห้องหมึก", zh: "Ink Atelier" },
    location: { en: "Phitsanulok", th: "พิษณุโลก", zh: "彭世洛" },
    disciplines: ["brand", "culture"],
    image: "/works/ink-atelier.jpg",
    featured: false,
    title: { en: "Ink Atelier", th: "ห้องหมึก", zh: "Ink Atelier" },
    subtitle: {
      en: "A print workshop identity made of paper, brass, and sumi.",
      th: "อัตลักษณ์ห้องพิมพ์จากกระดาษ ทองเหลือง และหมึกสุมี",
      zh: "以纸张、黄铜与墨构成印刷工坊的品牌形象。",
    },
    excerpt: {
      en: "Sheets the colour of bone, rollers, a palm frond. A mark that is allowed to smudge.",
      th: "แผ่นกระดาษสีกระดูก ลูกกลิ้ง ใบปาล์มแห้ง เครื่องหมายที่ให้เปื้อนได้",
      zh: "骨白色纸张、滚筒与一片棕榈叶，构成允许留下墨迹的品牌印记。",
    },
    body: {
      en: [
        "A letterpress shop in the city asked for a clean mark. We gave them a system that includes the mess: ink, brass type, and a wordmark that is stamped, not drawn.",
        "The website is a table of sheets. The shop is the site.",
      ],
      th: [
        "ร้านเลตเตอร์เพรสในเมืองขอเครื่องหมายที่สะอาด เราให้ระบบที่รวมความเลอะ: หมึก ตัวเรียงทองเหลือง และเวิร์ดมาร์กที่ประทับ ไม่ได้วาด",
        "เว็บไซต์คือโต๊ะของแผ่นกระดาษ ร้านคือไซต์",
      ],
      zh: [
        "概念以城市中的活版印刷工坊为背景，将油墨、黄铜活字与盖印式文字标志纳入视觉系统，让印刷过程中的痕迹成为表达的一部分。实际委托尚未核实。",
        "网站概念像一张铺满纸张的工作台，以页面组织呈现工坊的材料与工作方式。",
      ],
    },
    roles: {
      en: "Identity, print system, site",
      th: "อัตลักษณ์ ระบบพิมพ์ ไซต์",
      zh: "品牌形象、印刷系统、网站",
    },
    outcome: {
      en: "A working print identity, stationery, and a one-page site that is just an index of sheets.",
      th: "อัตลักษณ์พิมพ์ที่ใช้งาน เครื่องเขียน และไซต์หน้าเดียวที่เป็นสารบัญแผ่นกระดาษ",
      zh: "概念方案设想：以印刷品牌形象、文具与纸张目录式单页网站组成完整系统；实际使用及交付情况尚未核实。",
    },
  },
];

export function getWork(slug: string): Work | undefined {
  return WORKS.find((work) => work.slug === slug);
}

export function adjacentWork(slug: string, dir: -1 | 1): Work | undefined {
  const index = WORKS.findIndex((work) => work.slug === slug);
  if (index < 0) return undefined;
  return WORKS[(index + dir + WORKS.length) % WORKS.length];
}

export function featuredWorks(): Work[] {
  return WORKS.filter((work) => work.featured);
}

export function loc(value: Localized, lang: "en" | "th" | "zh"): string {
  return value[lang];
}
