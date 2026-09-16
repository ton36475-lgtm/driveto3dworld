import type { Text } from "./projects";

/** Public presentation until source assets and production evidence are available. */
export const CONCEPT_COPY = {
  en: {
    label: "Concept study · unverified",
    notice: "These are exploratory design concepts. Client commissions and production outcomes have not been verified.",
    direction: "Design direction",
    metrics: "Dimensions and mesh metrics",
    pending: "N/A · pending measurement",
    production: "Production status",
    unverified: "Not verified",
  },
  th: {
    label: "งานศึกษาแนวคิด · ยังไม่ยืนยัน",
    notice: "รายการนี้เป็นแนวคิดเพื่อการศึกษา ยังไม่มีการยืนยันงานว่าจ้างหรือผลการผลิตจริง",
    direction: "แนวทางการออกแบบ",
    metrics: "ขนาดและข้อมูลเมช",
    pending: "N/A · รอการวัด",
    production: "สถานะการผลิต",
    unverified: "ยังไม่ยืนยัน",
  },
} as const;

export const CONCEPT_DIRECTIONS: Record<string, Text> = {
  "arch-01": { en: "Explore transparency, slender framing and a folded roof through a pavilion concept.", th: "ศึกษาแนวคิดศาลาผ่านความโปร่งใส โครงเส้นบาง และหลังคาพับ" },
  "arch-02": { en: "Explore an elevated house with timber screening and spaces shaped around airflow.", th: "ศึกษาแนวคิดบ้านยกพื้น แผงกรองแสงลายไม้ และพื้นที่ที่คำนึงถึงการไหลเวียนอากาศ" },
  "arch-03": { en: "Explore a long studio volume, dark timber tones and a narrow band of evening light.", th: "ศึกษาแนวคิดสตูดิโอทรงยาว โทนไม้สีเข้ม และแถบแสงยามค่ำ" },
  "char-01": { en: "Explore a compact robot silhouette with simple volumes and a single luminous eye.", th: "ศึกษาเงาร่างหุ่นยนต์ขนาดกะทัดรัดด้วยรูปทรงเรียบง่ายและตาเรืองแสงดวงเดียว" },
  "char-02": { en: "Explore a guardian character through temple-inspired forms and clay-like surface treatments.", th: "ศึกษาตัวละครผู้พิทักษ์ผ่านรูปทรงที่ได้แรงบันดาลใจจากวัดและพื้นผิวคล้ายดินเผา" },
  "char-03": { en: "Explore an arcade rider character, compact proportions and the silhouette of a flowing scarf.", th: "ศึกษาแนวคิดตัวละครนักแข่งอาร์เคด สัดส่วนกระชับ และเงาร่างของผ้าพันคอที่พลิ้วไหว" },
  "veh-01": { en: "Explore a single-rider hover vehicle with visible framing and ducted-fan motifs.", th: "ศึกษาแนวคิดยานลอยตัวสำหรับผู้ขับหนึ่งคน โดยใช้โครงที่มองเห็นได้และรูปทรงพัดลมท่อ" },
  "veh-02": { en: "Explore a long-nose coupe through body proportions, metallic surfaces and dark glazing.", th: "ศึกษาแนวคิดรถคูเป้จมูกยาวผ่านสัดส่วนตัวถัง ผิวโลหะ และกระจกโทนเข้ม" },
  "veh-03": { en: "Explore a utility drone with modular cargo spaces and an emphasis on accessible maintenance.", th: "ศึกษาแนวคิดโดรนใช้งานที่มีพื้นที่บรรทุกแบบโมดูลาร์และคำนึงถึงการเข้าถึงเพื่อบำรุงรักษา" },
  "prod-01": { en: "Explore a lamp made from repeated ring forms and interchangeable shade concepts.", th: "ศึกษาแนวคิดโคมไฟจากรูปวงแหวนซ้ำและแนวทางฝาครอบที่เปลี่ยนได้" },
  "prod-02": { en: "Explore a cushion-shaped watch case, a floating dial ring and contrasting material finishes.", th: "ศึกษาแนวคิดนาฬิกาเคสคุชชั่น วงหน้าปัดลอย และการจับคู่พื้นผิววัสดุ" },
  "prod-03": { en: "Explore a quiet desktop audio object through a hemispherical form and fabric-like surfaces.", th: "ศึกษาแนวคิดอุปกรณ์เสียงบนโต๊ะที่เรียบสงบผ่านรูปครึ่งทรงกลมและพื้นผิวคล้ายผ้า" },
};
