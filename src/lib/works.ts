export const DISCIPLINES = ["brand", "space", "motion", "culture"] as const;
export type Discipline = (typeof DISCIPLINES)[number];

export type Localized = { en: string; th: string };

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
  body: { en: string[]; th: string[] };
  roles: Localized;
  outcome: Localized;
};

export const WORKS: Work[] = [
  {
    slug: "noir-salon",
    year: "2025",
    client: { en: "Noir Salon", th: "นัวร์ ซาลอน" },
    location: { en: "Bangkok", th: "กรุงเทพฯ" },
    disciplines: ["brand", "space"],
    image: "/works/noir-salon.jpg",
    featured: true,
    title: { en: "Noir Salon", th: "นัวร์ ซาลอน" },
    subtitle: {
      en: "A night room for hair — identity and interior as one material.",
      th: "ห้องกลางคืนสำหรับผม — อัตลักษณ์และภายในเป็นวัสดุเดียวกัน",
    },
    excerpt: {
      en: "Black lacquer, bronze glass, and a circular mirror that does the talking. The mark is almost absent; the room is the mark.",
      th: "แล็กเกอร์ดำ กระจกสีบรอนซ์ และกระจกวงกลมที่พูดแทน โลโก้เกือบไม่ปรากฏ ห้องคือเครื่องหมาย",
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
    },
    roles: {
      en: "Identity, interior concept, materials",
      th: "อัตลักษณ์ แนวคิดภายใน วัสดุ",
    },
    outcome: {
      en: "A 90-square-metre salon opened in Thonglor with a paper system and a room that holds at night.",
      th: "ซาลอน 90 ตารางเมตรในทองหล่อ เปิดพร้อมระบบกระดาษและห้องที่อยู่ได้ในกลางคืน",
    },
  },
  {
    slug: "rice-archive",
    year: "2024",
    client: { en: "Rice Archive", th: "คลังข้าว" },
    location: { en: "Phitsanulok", th: "พิษณุโลก" },
    disciplines: ["culture", "space"],
    image: "/works/rice-archive.jpg",
    featured: true,
    title: { en: "Rice Archive", th: "คลังข้าว" },
    subtitle: {
      en: "An exhibition hall that treats grain as a document.",
      th: "หอแสดงที่มองเมล็ดข้าวเป็นเอกสาร",
    },
    excerpt: {
      en: "Vitrines of grain, paper banners, teak floors. A museum that refuses spectacle and still fills with light.",
      th: "ตู้เมล็ดข้าว แบนเนอร์กระดาษ พื้นไม้สัก พิพิธภัณฑ์ที่ไม่ใช้ความอลังการ แต่ยังเต็มด้วยแสง",
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
    },
    roles: {
      en: "Exhibition design, identity, wayfinding",
      th: "ออกแบบนิทรรศการ อัตลักษณ์ ระบบนำทาง",
    },
    outcome: {
      en: "A permanent hall for the provincial collection, with a bilingual paper guide.",
      th: "หอถาวรสำหรับคลังจังหวัด พร้อมคู่มือกระดาษสองภาษา",
    },
  },
  {
    slug: "lunar-market",
    year: "2025",
    client: { en: "Lunar Market", th: "ตลาดจันทร์" },
    location: { en: "Chiang Mai", th: "เชียงใหม่" },
    disciplines: ["brand", "space"],
    image: "/works/lunar-market.jpg",
    featured: true,
    title: { en: "Lunar Market", th: "ตลาดจันทร์" },
    subtitle: {
      en: "Night-market wayfinding as stacked light.",
      th: "ระบบนำทางตลาดกลางคืนในฐานะแสงซ้อน",
    },
    excerpt: {
      en: "Lanterns, wet stone, and a totem of glowing boxes. Identity that has to work in steam and rain.",
      th: "โคม หินเปียก และเสาแสงกล่องซ้อน อัตลักษณ์ที่ต้องทำงานในไอน้ำและฝน",
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
    },
    roles: {
      en: "Identity, wayfinding, lighting objects",
      th: "อัตลักษณ์ ระบบนำทาง วัตถุแสง",
    },
    outcome: {
      en: "A 120-stall market reopened with a wayfinding kit that vendors can maintain.",
      th: "ตลาด 120 แผงเปิดใหม่พร้อมชุดนำทางที่แม่ค้าดูแลเองได้",
    },
  },
  {
    slug: "teak-house",
    year: "2024",
    client: { en: "Private house", th: "บ้านส่วนตัว" },
    location: { en: "Lower north", th: "ภาคเหนือตอนล่าง" },
    disciplines: ["space", "motion"],
    image: "/works/teak-house.jpg",
    featured: true,
    title: { en: "Teak House", th: "บ้านไม้สัก" },
    subtitle: {
      en: "A raised teak house, a pool, and a film of the light.",
      th: "บ้านไม้สักยกพื้น สระน้ำ และภาพยนตร์ของแสง",
    },
    excerpt: {
      en: "Deep eaves, screens, late sun. We designed the house with the architect, then filmed how the day moves through it.",
      th: "ชายคายาว ฉากบัง แดดเย็น เราออกแบบบ้านร่วมกับสถาปนิก แล้วถ่ายว่าวันเคลื่อนผ่านอย่างไร",
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
    },
    roles: {
      en: "Spatial concept, interiors, film",
      th: "แนวคิดพื้นที่ ภายใน ภาพยนตร์",
    },
    outcome: {
      en: "A completed house and a short film used for the archive and for future commissions.",
      th: "บ้านสร้างเสร็จและภาพยนตร์สั้นสำหรับคลังงานและงานจ้างต่อไป",
    },
  },
  {
    slug: "monsoon-records",
    year: "2023",
    client: { en: "Monsoon Records", th: "มรสุม เรเคิดส์" },
    location: { en: "Bangkok", th: "กรุงเทพฯ" },
    disciplines: ["brand", "motion"],
    image: "/works/monsoon-records.jpg",
    featured: false,
    title: { en: "Monsoon Records", th: "มรสุม เรเคิดส์" },
    subtitle: {
      en: "A label identity that can survive rain on the window.",
      th: "อัตลักษณ์ค่ายเพลงที่ทนฝนบนกระจกได้",
    },
    excerpt: {
      en: "Bone sleeves, black ink, a pressed flower. Packaging as a still life, motion as weather.",
      th: "ซองสีกระดูก หมึกดำ ดอกไม้อัด บรรจุภัณฑ์เป็นภาพนิ่ง โมชันเป็นอากาศ",
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
    },
    roles: {
      en: "Identity, packaging, motion ident",
      th: "อัตลักษณ์ บรรจุภัณฑ์ ไอเดนต์โมชัน",
    },
    outcome: {
      en: "A six-release system in use, with print and a title sequence for live sessions.",
      th: "ระบบหกอัลบั้มที่ใช้อยู่ พร้อมงานพิมพ์และไตเติลสำหรับเซสชันสด",
    },
  },
  {
    slug: "river-night",
    year: "2025",
    client: { en: "River Night", th: "คืนแม่น้ำ" },
    location: { en: "Ayutthaya", th: "อยุธยา" },
    disciplines: ["motion", "culture"],
    image: "/works/river-night.jpg",
    featured: false,
    title: { en: "River Night", th: "คืนแม่น้ำ" },
    subtitle: {
      en: "A river cruise told as long exposure, not as a brochure.",
      th: "ล่องเรือที่เล่าด้วยแสงยาว ไม่ใช่โบรชัวร์",
    },
    excerpt: {
      en: "Dark water, temple roofs, a wooden pier. Experience design for a night on the river without lantern cliché.",
      th: "น้ำดำ หลังคาโบสถ์ ท่าไม้ ออกแบบประสบการณ์คืนแม่น้ำโดยไม่ใช้โคมซ้ำซาก",
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
    },
    roles: {
      en: "Experience, film, print",
      th: "ประสบการณ์ ภาพยนตร์ สิ่งพิมพ์",
    },
    outcome: {
      en: "A seasonal night route with a film and a paper timetable in two languages.",
      th: "เส้นทางกลางคืนตามฤดูกาล พร้อมภาพยนตร์และตารางกระดาษสองภาษา",
    },
  },
  {
    slug: "khao-yai",
    year: "2024",
    client: { en: "Khao Yai Pavilion", th: "ศาลาเขาใหญ่" },
    location: { en: "Khao Yai", th: "เขาใหญ่" },
    disciplines: ["space", "culture"],
    image: "/works/khao-yai.jpg",
    featured: false,
    title: { en: "Khao Yai Pavilion", th: "ศาลาเขาใหญ่" },
    subtitle: {
      en: "A fog-line pavilion for a hillside retreat.",
      th: "ศาลาแนวหมอกสำหรับที่พักเชิงเขา",
    },
    excerpt: {
      en: "Rammed earth, a circular skylight, forest as the fourth wall. A room that is mostly weather.",
      th: "ดินอัด ช่องแสงวงกลม ป่าเป็นผนังที่สี่ ห้องที่เป็นอากาศเสียส่วนใหญ่",
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
    },
    roles: {
      en: "Spatial concept, interiors, photography direction",
      th: "แนวคิดพื้นที่ ภายใน กำกับภาพ",
    },
    outcome: {
      en: "A completed pavilion used as the heart of the retreat and as its only public image.",
      th: "ศาลาสร้างเสร็จ ใช้เป็นหัวใจของที่พักและเป็นภาพสาธารณะเพียงชุด",
    },
  },
  {
    slug: "ink-atelier",
    year: "2023",
    client: { en: "Ink Atelier", th: "ห้องหมึก" },
    location: { en: "Phitsanulok", th: "พิษณุโลก" },
    disciplines: ["brand", "culture"],
    image: "/works/ink-atelier.jpg",
    featured: false,
    title: { en: "Ink Atelier", th: "ห้องหมึก" },
    subtitle: {
      en: "A print workshop identity made of paper, brass, and sumi.",
      th: "อัตลักษณ์ห้องพิมพ์จากกระดาษ ทองเหลือง และหมึกสุมี",
    },
    excerpt: {
      en: "Sheets the colour of bone, rollers, a palm frond. A mark that is allowed to smudge.",
      th: "แผ่นกระดาษสีกระดูก ลูกกลิ้ง ใบปาล์มแห้ง เครื่องหมายที่ให้เปื้อนได้",
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
    },
    roles: {
      en: "Identity, print system, site",
      th: "อัตลักษณ์ ระบบพิมพ์ ไซต์",
    },
    outcome: {
      en: "A working print identity, stationery, and a one-page site that is just an index of sheets.",
      th: "อัตลักษณ์พิมพ์ที่ใช้งาน เครื่องเขียน และไซต์หน้าเดียวที่เป็นสารบัญแผ่นกระดาษ",
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

export function loc(value: Localized, lang: "en" | "th"): string {
  return value[lang];
}
