import type { Localized } from "@/lib/works";

export type PortfolioPerson = "ball" | "ton" | "studio";

export type PortfolioProfile = {
  id: PortfolioPerson;
  monogram: string;
  name: Localized;
  label: Localized;
  introduction: Localized;
  focus: Localized[];
  project: { title: Localized; description: Localized; status: Localized };
};

// Public profile copy is limited to information supplied by the owner.
// Private AGM plans are not profile, customer, financial or delivery evidence.
export const PORTFOLIO_PROFILES: readonly PortfolioProfile[] = [
  {
    id: "ball",
    monogram: "B",
    name: { en: "Ball Anekprasong", th: "บอล อเนกประสงค์" },
    label: { en: "Music & live sessions", th: "ดนตรีและการแสดงสด" },
    introduction: {
      en: "A personal portfolio centred on live folk music, shared songs and open-mic sessions.",
      th: "พอร์ตโฟลิโอส่วนตัวของพี่บอล ถ่ายทอดดนตรีโฟล์ค การร้องเพลงร่วมกัน และเวทีเปิดไมค์",
    },
    focus: [
      { en: "Live folk sessions", th: "การแสดงดนตรีโฟล์คสด" },
      { en: "Open mic & shared singing", th: "เวทีเปิดไมค์และการร้องเพลงร่วมกัน" },
      { en: "Music-led community gatherings", th: "กิจกรรมชุมชนผ่านเสียงดนตรี" },
    ],
    project: {
      title: { en: "AGM music initiative", th: "แนวทางโครงการดนตรี AGM" },
      description: {
        en: "A proposed music initiative shared by the owner. Released music, event records and individual credits will be added when supporting material is available.",
        th: "แนวทางโครงการดนตรีที่เจ้าของนำเสนอ จะเพิ่มผลงานเพลง บันทึกกิจกรรม และเครดิตรายบุคคลเมื่อมีข้อมูลประกอบ",
      },
      status: { en: "Proposed initiative", th: "โครงการที่เสนอ" },
    },
  },
  {
    id: "ton",
    monogram: "S",
    name: { en: "Ton · Sirawat Sheemuang", th: "ต้น · ศิรวัฒน์ ชีม่วง" },
    label: { en: "AI, websites & solar", th: "AI เว็บไซต์ และพลังงานแสงอาทิตย์" },
    introduction: {
      en: "A personal portfolio bringing together Ton's work interests in AI, website development and solar energy.",
      th: "พอร์ตโฟลิโอส่วนตัวของต้น รวมแนวทางงานด้าน AI การพัฒนาเว็บไซต์ และพลังงานแสงอาทิตย์",
    },
    focus: [
      { en: "AI-assisted creative workflows", th: "กระบวนการสร้างสรรค์งานด้วย AI" },
      { en: "Websites & interactive experiences", th: "เว็บไซต์และประสบการณ์แบบโต้ตอบ" },
      { en: "Solar energy projects", th: "โครงการพลังงานแสงอาทิตย์" },
    ],
    project: {
      title: { en: "Personal project collection", th: "ชุดโครงการส่วนตัว" },
      description: {
        en: "AI, website and solar project records are being organised with project-specific roles and supporting links. Confirmed case studies can be added here individually.",
        th: "กำลังจัดข้อมูลโครงการ AI เว็บไซต์ และพลังงานแสงอาทิตย์ พร้อมบทบาทและลิงก์อ้างอิงของแต่ละงาน เพื่อเพิ่มกรณีศึกษาที่ตรวจสอบได้เป็นรายโครงการ",
      },
      status: { en: "Project records in preparation", th: "อยู่ระหว่างจัดข้อมูลโครงการ" },
    },
  },
  {
    id: "studio",
    monogram: "S×B",
    name: { en: "Sirawat × Ball", th: "ศิรวัฒน์ × บอล" },
    label: { en: "Shared projects", th: "โครงการร่วมกัน" },
    introduction: {
      en: "A shared space for collaboration across music, websites and creative technology. Each person's own portfolio remains available through the profiles above.",
      th: "พื้นที่สำหรับโครงการร่วมด้านดนตรี เว็บไซต์ และเทคโนโลยีสร้างสรรค์ พร้อมพอร์ตโฟลิโอส่วนตัวของแต่ละคนที่เลือกดูได้ด้านบน",
    },
    focus: [
      { en: "Music & digital storytelling", th: "ดนตรีและการเล่าเรื่องผ่านสื่อดิจิทัล" },
      { en: "Interactive portfolio experiences", th: "ประสบการณ์พอร์ตโฟลิโอแบบโต้ตอบ" },
      { en: "Community event concepts", th: "แนวคิดกิจกรรมสำหรับชุมชน" },
    ],
    project: {
      title: { en: "A shared creative portfolio", th: "พอร์ตโฟลิโอสร้างสรรค์ร่วมกัน" },
      description: {
        en: "This collection is being developed to show shared projects with clear individual credits. The gallery currently contains concept studies whose client delivery and authorship have not been verified.",
        th: "กำลังพัฒนาชุดข้อมูลเพื่อแสดงโครงการร่วมและเครดิตของแต่ละคนอย่างชัดเจน แกลเลอรีปัจจุบันเป็นงานศึกษาแนวคิดที่ยังไม่ได้ยืนยันผู้สร้างและการส่งมอบให้ลูกค้า",
      },
      status: { en: "In development", th: "อยู่ระหว่างพัฒนา" },
    },
  },
];

export function getPortfolioProfile(person: string) {
  return PORTFOLIO_PROFILES.find((profile) => profile.id === person);
}

export const CONCEPT_EVIDENCE = {
  status: "unverified_concept",
  label: {
    en: "Concept study · unverified",
    th: "งานศึกษาแนวคิด · ยังไม่ยืนยัน",
  },
  description: {
    en: "Presented as a visual concept. Client involvement, authorship and completed delivery have not been verified.",
    th: "นำเสนอเป็นแนวคิดทางภาพ ยังไม่ได้ยืนยันการว่าจ้าง ผู้สร้าง และการส่งมอบผลงานจริง",
  },
  imageCaption: {
    en: "Concept imagery. Image provenance and usage rights are awaiting verification.",
    th: "ภาพประกอบแนวคิด อยู่ระหว่างตรวจสอบที่มาและสิทธิ์การใช้งานภาพ",
  },
} as const;
