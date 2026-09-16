import type { Text } from "./projects";

/** Public presentation until source assets and production evidence are available. */
export const CONCEPT_COPY = {
  "en": {
    "label": "Concept study · unverified",
    "notice": "These are exploratory design concepts. Client commissions and production outcomes have not been verified.",
    "direction": "Design direction",
    "metrics": "Dimensions and mesh metrics",
    "pending": "N/A · pending measurement",
    "production": "Production status",
    "unverified": "Not verified"
  },
  "th": {
    "label": "งานศึกษาแนวคิด · ยังไม่ยืนยัน",
    "notice": "รายการนี้เป็นแนวคิดเพื่อการศึกษา ยังไม่มีการยืนยันงานว่าจ้างหรือผลการผลิตจริง",
    "direction": "แนวทางการออกแบบ",
    "metrics": "ขนาดและข้อมูลเมช",
    "pending": "N/A · รอการวัด",
    "production": "สถานะการผลิต",
    "unverified": "ยังไม่ยืนยัน"
  },
  "zh": {
    "label": "概念研究 · 尚未核实",
    "notice": "这些是探索性设计概念，客户委托与实际生产成果尚未核实。",
    "direction": "设计方向",
    "metrics": "尺寸与网格数据",
    "pending": "N/A · 待测量",
    "production": "生产状态",
    "unverified": "尚未核实"
  }
} as const;

export const CONCEPT_DIRECTIONS: Record<string, Text> = {
  "arch-01": {
    "en": "Explore transparency, slender framing and a folded roof through a pavilion concept.",
    "th": "ศึกษาแนวคิดศาลาผ่านความโปร่งใส โครงเส้นบาง และหลังคาพับ",
    "zh": "通过亭子概念探索透明感、纤细框架与折叠屋顶。"
  },
  "arch-02": {
    "en": "Explore an elevated house with timber screening and spaces shaped around airflow.",
    "th": "ศึกษาแนวคิดบ้านยกพื้น แผงกรองแสงลายไม้ และพื้นที่ที่คำนึงถึงการไหลเวียนอากาศ",
    "zh": "探索架空住宅、木质遮阳格栅与顺应空气流动的空间。"
  },
  "arch-03": {
    "en": "Explore a long studio volume, dark timber tones and a narrow band of evening light.",
    "th": "ศึกษาแนวคิดสตูดิโอทรงยาว โทนไม้สีเข้ม และแถบแสงยามค่ำ",
    "zh": "探索长条工作室体量、深色木材与窄幅夜间光带。"
  },
  "char-01": {
    "en": "Explore a compact robot silhouette with simple volumes and a single luminous eye.",
    "th": "ศึกษาเงาร่างหุ่นยนต์ขนาดกะทัดรัดด้วยรูปทรงเรียบง่ายและตาเรืองแสงดวงเดียว",
    "zh": "用简单体块和一只发光眼睛，探索紧凑的机器人轮廓。"
  },
  "char-02": {
    "en": "Explore a guardian character through temple-inspired forms and clay-like surface treatments.",
    "th": "ศึกษาตัวละครผู้พิทักษ์ผ่านรูปทรงที่ได้แรงบันดาลใจจากวัดและพื้นผิวคล้ายดินเผา",
    "zh": "通过寺庙启发的形态和陶土质感，探索守护者角色。"
  },
  "char-03": {
    "en": "Explore an arcade rider character, compact proportions and the silhouette of a flowing scarf.",
    "th": "ศึกษาแนวคิดตัวละครนักแข่งอาร์เคด สัดส่วนกระชับ และเงาร่างของผ้าพันคอที่พลิ้วไหว",
    "zh": "探索街机赛车骑手、紧凑比例与飘动围巾的轮廓。"
  },
  "veh-01": {
    "en": "Explore a single-rider hover vehicle with visible framing and ducted-fan motifs.",
    "th": "ศึกษาแนวคิดยานลอยตัวสำหรับผู้ขับหนึ่งคน โดยใช้โครงที่มองเห็นได้และรูปทรงพัดลมท่อ",
    "zh": "探索单人悬浮载具、可见框架与涵道风扇造型。"
  },
  "veh-02": {
    "en": "Explore a long-nose coupe through body proportions, metallic surfaces and dark glazing.",
    "th": "ศึกษาแนวคิดรถคูเป้จมูกยาวผ่านสัดส่วนตัวถัง ผิวโลหะ และกระจกโทนเข้ม",
    "zh": "通过车身比例、金属表面和深色玻璃，探索长车头轿跑。"
  },
  "veh-03": {
    "en": "Explore a utility drone with modular cargo spaces and an emphasis on accessible maintenance.",
    "th": "ศึกษาแนวคิดโดรนใช้งานที่มีพื้นที่บรรทุกแบบโมดูลาร์และคำนึงถึงการเข้าถึงเพื่อบำรุงรักษา",
    "zh": "探索模块化货舱与便于维护的实用无人机概念。"
  },
  "prod-01": {
    "en": "Explore a lamp made from repeated ring forms and interchangeable shade concepts.",
    "th": "ศึกษาแนวคิดโคมไฟจากรูปวงแหวนซ้ำและแนวทางฝาครอบที่เปลี่ยนได้",
    "zh": "探索重复圆环造型与可更换灯罩的灯具概念。"
  },
  "prod-02": {
    "en": "Explore a cushion-shaped watch case, a floating dial ring and contrasting material finishes.",
    "th": "ศึกษาแนวคิดนาฬิกาเคสคุชชั่น วงหน้าปัดลอย และการจับคู่พื้นผิววัสดุ",
    "zh": "探索枕形表壳、悬浮刻度环与对比材质的腕表概念。"
  },
  "prod-03": {
    "en": "Explore a quiet desktop audio object through a hemispherical form and fabric-like surfaces.",
    "th": "ศึกษาแนวคิดอุปกรณ์เสียงบนโต๊ะที่เรียบสงบผ่านรูปครึ่งทรงกลมและพื้นผิวคล้ายผ้า",
    "zh": "通过半球造型和织物质感，探索安静的桌面音响物件。"
  }
};
