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
    name: { en: "Ball Anekprasong", th: "บอล อเนกประสงค์", zh: "Ball Anekprasong" },
    label: { en: "Music & live sessions", th: "ดนตรีและการแสดงสด", zh: "音乐与现场演出" },
    introduction: {
      en: "A personal portfolio centred on live folk music, shared songs and open-mic sessions.",
      th: "พอร์ตโฟลิโอส่วนตัวของพี่บอล ถ่ายทอดดนตรีโฟล์ค การร้องเพลงร่วมกัน และเวทีเปิดไมค์",
      zh: "以现场民谣、共同歌唱与开放麦活动为主题的个人作品集。",
    },
    focus: [
      { en: "Live folk sessions", th: "การแสดงดนตรีโฟล์คสด", zh: "现场民谣演出" },
      {
        en: "Open mic & shared singing",
        th: "เวทีเปิดไมค์และการร้องเพลงร่วมกัน",
        zh: "开放麦与共同歌唱",
      },
      {
        en: "Music-led community gatherings",
        th: "กิจกรรมชุมชนผ่านเสียงดนตรี",
        zh: "以音乐连接社区的活动",
      },
    ],
    project: {
      title: { en: "AGM music initiative", th: "แนวทางโครงการดนตรี AGM", zh: "AGM 音乐项目构想" },
      description: {
        en: "A proposed music initiative shared by the owner. Released music, event records and individual credits will be added when supporting material is available.",
        th: "แนวทางโครงการดนตรีที่เจ้าของนำเสนอ จะเพิ่มผลงานเพลง บันทึกกิจกรรม และเครดิตรายบุคคลเมื่อมีข้อมูลประกอบ",
        zh: "由本人提出的音乐项目构想。待有相关资料佐证后，将补充已发布音乐、活动记录与个人创作署名。",
      },
      status: { en: "Proposed initiative", th: "โครงการที่เสนอ", zh: "拟议项目" },
    },
  },
  {
    id: "ton",
    monogram: "S",
    name: {
      en: "Ton · Sirawat Sheemuang",
      th: "ต้น · ศิรวัฒน์ ชีม่วง",
      zh: "Ton · Sirawat Sheemuang",
    },
    label: {
      en: "AI, websites & solar",
      th: "AI เว็บไซต์ และพลังงานแสงอาทิตย์",
      zh: "人工智能、网站与太阳能",
    },
    introduction: {
      en: "A personal portfolio bringing together Ton's work interests in AI, website development and solar energy.",
      th: "พอร์ตโฟลิโอส่วนตัวของต้น รวมแนวทางงานด้าน AI การพัฒนาเว็บไซต์ และพลังงานแสงอาทิตย์",
      zh: "汇集 Ton 在人工智能、网站开发与太阳能领域工作兴趣的个人作品集。",
    },
    focus: [
      {
        en: "AI-assisted creative workflows",
        th: "กระบวนการสร้างสรรค์งานด้วย AI",
        zh: "人工智能辅助创作流程",
      },
      {
        en: "Websites & interactive experiences",
        th: "เว็บไซต์และประสบการณ์แบบโต้ตอบ",
        zh: "网站与交互体验",
      },
      { en: "Solar energy projects", th: "โครงการพลังงานแสงอาทิตย์", zh: "太阳能项目" },
    ],
    project: {
      title: { en: "Personal project collection", th: "ชุดโครงการส่วนตัว", zh: "个人项目集" },
      description: {
        en: "AI, website and solar project records are being organised with project-specific roles and supporting links. Confirmed case studies can be added here individually.",
        th: "กำลังจัดข้อมูลโครงการ AI เว็บไซต์ และพลังงานแสงอาทิตย์ พร้อมบทบาทและลิงก์อ้างอิงของแต่ละงาน เพื่อเพิ่มกรณีศึกษาที่ตรวจสอบได้เป็นรายโครงการ",
        zh: "正在整理人工智能、网站与太阳能项目记录，并为各项目标注具体职责与参考链接。经核实的案例将逐项补充。",
      },
      status: {
        en: "Project records in preparation",
        th: "อยู่ระหว่างจัดข้อมูลโครงการ",
        zh: "项目资料整理中",
      },
    },
  },
  {
    id: "studio",
    monogram: "S×B",
    name: { en: "Sirawat × Ball", th: "ศิรวัฒน์ × บอล", zh: "Sirawat × Ball" },
    label: { en: "Shared projects", th: "โครงการร่วมกัน", zh: "合作项目" },
    introduction: {
      en: "A shared space for collaboration across music, websites and creative technology. Each person's own portfolio remains available through the profiles above.",
      th: "พื้นที่สำหรับโครงการร่วมด้านดนตรี เว็บไซต์ และเทคโนโลยีสร้างสรรค์ พร้อมพอร์ตโฟลิโอส่วนตัวของแต่ละคนที่เลือกดูได้ด้านบน",
      zh: "展示音乐、网站与创意技术领域合作项目的共享空间。也可通过上方的个人资料分别查看两位创作者的作品集。",
    },
    focus: [
      {
        en: "Music & digital storytelling",
        th: "ดนตรีและการเล่าเรื่องผ่านสื่อดิจิทัล",
        zh: "音乐与数字叙事",
      },
      {
        en: "Interactive portfolio experiences",
        th: "ประสบการณ์พอร์ตโฟลิโอแบบโต้ตอบ",
        zh: "交互式作品集体验",
      },
      { en: "Community event concepts", th: "แนวคิดกิจกรรมสำหรับชุมชน", zh: "社区活动构想" },
    ],
    project: {
      title: {
        en: "A shared creative portfolio",
        th: "พอร์ตโฟลิโอสร้างสรรค์ร่วมกัน",
        zh: "合作创意作品集",
      },
      description: {
        en: "This collection is being developed to show shared projects with clear individual credits. The gallery currently contains concept studies whose client delivery and authorship have not been verified.",
        th: "กำลังพัฒนาชุดข้อมูลเพื่อแสดงโครงการร่วมและเครดิตของแต่ละคนอย่างชัดเจน แกลเลอรีปัจจุบันเป็นงานศึกษาแนวคิดที่ยังไม่ได้ยืนยันผู้สร้างและการส่งมอบให้ลูกค้า",
        zh: "本作品集正在建设中，旨在清晰展示合作项目及各人的贡献。当前画廊收录的是概念研究，尚未核实其作者身份及客户交付情况。",
      },
      status: { en: "In development", th: "อยู่ระหว่างพัฒนา", zh: "开发中" },
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
    zh: "概念研究 · 尚未核实",
  },
  description: {
    en: "Presented as a visual concept. Client involvement, authorship and completed delivery have not been verified.",
    th: "นำเสนอเป็นแนวคิดทางภาพ ยังไม่ได้ยืนยันการว่าจ้าง ผู้สร้าง และการส่งมอบผลงานจริง",
    zh: "以视觉概念形式呈现。客户参与情况、作者身份及实际交付均尚未核实。",
  },
  imageCaption: {
    en: "Concept imagery. Image provenance and usage rights are awaiting verification.",
    th: "ภาพประกอบแนวคิด อยู่ระหว่างตรวจสอบที่มาและสิทธิ์การใช้งานภาพ",
    zh: "概念示意图。图像来源及使用权尚待核实。",
  },
} as const;
