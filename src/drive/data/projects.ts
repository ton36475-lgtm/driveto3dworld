import type { Lang } from "./i18n";

export type ZoneId = "architecture" | "characters" | "vehicles" | "products";

export type Text = { en: string; th: string; zh: string };

export type Project = {
  id: string;
  zone: ZoneId;
  title: Text;
  description: Text;
  detail: Text;
  year: string;
  medium: Text;
  tags: Text[];
  x: number;
  z: number;
  color: string;
};

export type Zone = {
  id: ZoneId;
  name: Text;
  x: number;
  z: number;
  color: string;
  pad: string;
  size: number;
};

export const ZONES: Zone[] = [
  {
    "id": "architecture",
    "name": {
      "en": "Architecture",
      "th": "สถาปัตย์",
      "zh": "建筑"
    },
    "x": -42,
    "z": -42,
    "color": "#6ea0c8",
    "pad": "#1d3348",
    "size": 38
  },
  {
    "id": "characters",
    "name": {
      "en": "Characters",
      "th": "ตัวละคร",
      "zh": "角色"
    },
    "x": 42,
    "z": -42,
    "color": "#c47a9a",
    "pad": "#3a2230",
    "size": 38
  },
  {
    "id": "vehicles",
    "name": {
      "en": "Vehicles",
      "th": "ยานยนต์",
      "zh": "载具"
    },
    "x": 42,
    "z": 42,
    "color": "#7eae6e",
    "pad": "#24341f",
    "size": 38
  },
  {
    "id": "products",
    "name": {
      "en": "Products",
      "th": "ผลิตภัณฑ์",
      "zh": "产品"
    },
    "x": -42,
    "z": 42,
    "color": "#c4a06a",
    "pad": "#3a2e1c",
    "size": 38
  }
];

export const PROJECTS: Project[] = [
  {
    "id": "arch-01",
    "zone": "architecture",
    "title": {
      "en": "Glass Pavilion",
      "th": "ศาลาแก้ว",
      "zh": "玻璃亭"
    },
    "description": {
      "en": "A minimal pavilion of structural glass and slim steel, with a parametric facade that reads as one folded plane.",
      "th": "ศาลาแก้วโครงสร้างเหล็กเส้นบาง ผิวพาราเมตริกที่อ่านเป็นระนาบพับผืนเดียว",
      "zh": "以纤细钢架和结构玻璃构成的极简亭子，参数化立面呈现为一整片折叠平面。"
    },
    "detail": {
      "en": "Commissioned as a monsoon-season folly. The roof is a single cold-bent laminate; columns sit outside the thermal envelope so the glass can run to the floor. Night lighting is a 2700K wash from the soffit, never from the facade.",
      "th": "ออกแบบเป็นศาลาฤดูมรสุม หลังคาเป็นกระจกลามิเนตโค้งเย็นต้นเดียว เสานอกซองความร้อนเพื่อให้กระจกจรดพื้น แสงกลางคืนเป็นวอช 2700K จากท้องหลังคา",
      "zh": "作为雨季观景亭的委托设计。屋顶采用单片冷弯夹层玻璃；立柱位于围护结构外侧，使玻璃延伸至地面。夜间照明由檐底提供 2700K 洗墙光，避免从立面直接发光。"
    },
    "year": "2025",
    "medium": {
      "en": "Archviz / form study",
      "th": "อาร์ควิซ / รูปทรง",
      "zh": "建筑可视化／形态研究"
    },
    "tags": [
      {
        "en": "glass",
        "th": "กระจก",
        "zh": "玻璃"
      },
      {
        "en": "steel",
        "th": "เหล็ก",
        "zh": "钢"
      },
      {
        "en": "pavilion",
        "th": "ศาลา",
        "zh": "亭子"
      }
    ],
    "x": -28,
    "z": -42,
    "color": "#7ec8ff"
  },
  {
    "id": "arch-02",
    "zone": "architecture",
    "title": {
      "en": "Mekong House",
      "th": "เรือนโขง",
      "zh": "湄公河住宅"
    },
    "description": {
      "en": "Stilt dwelling reimagined as a cool-climate studio: teak lattice, lifted floor, monsoon-aware roof.",
      "th": "เรือนยกใต้ถุนคิดใหม่เป็นสตูดิโออากาศเย็น ลายฉลุสัก พื้นยก หลังคารู้จักมรสุม",
      "zh": "将高脚屋重新构想为气候舒适的工作室：柚木格栅、架空地板和适应季风的屋顶。"
    },
    "detail": {
      "en": "A live-work house on the Nan river terrace. Cross ventilation is the HVAC. The lattice is CNC-cut teak, repeating a lozenge taken from local weaving. The studio bay faces north-east, away from the afternoon glare.",
      "th": "บ้านอยู่-ทำงานบนระเบียงแม่น้ำน่าน ลมขวางคือระบบปรับอากาศ ลายฉลุสักซีเอ็นซีจากลวดลายทอท้องถิ่น ช่องสตูดิโอหันตะวันออกเฉียงเหนือ",
      "zh": "南河沿岸台地上的居住与工作空间。对流通风承担环境调节；柚木格栅采用数控加工，重复当地编织中的菱形图案。工作室朝向东北，避开午后强光。"
    },
    "year": "2024",
    "medium": {
      "en": "Residence concept",
      "th": "บ้านพัก",
      "zh": "住宅概念"
    },
    "tags": [
      {
        "en": "teak",
        "th": "สัก",
        "zh": "柚木"
      },
      {
        "en": "stilt",
        "th": "ใต้ถุน",
        "zh": "架空"
      },
      {
        "en": "climate",
        "th": "ภูมิอากาศ",
        "zh": "气候"
      }
    ],
    "x": -52,
    "z": -34,
    "color": "#9ad4ff"
  },
  {
    "id": "arch-03",
    "zone": "architecture",
    "title": {
      "en": "Night Atelier",
      "th": "โรงงานราตรี",
      "zh": "夜间工作室"
    },
    "description": {
      "en": "The studio itself — a long shed of blackened timber and a single clerestory, designed to disappear at dusk.",
      "th": "ตัวสตูดิโอเอง — โรงยาวไม้เผาดำ ช่องแสงเดียว ออกแบบให้หายไปตอนโพล้เพล้",
      "zh": "工作室本身是一座黑化木材长屋，配以一道高侧窗，希望在黄昏时融入环境。"
    },
    "detail": {
      "en": "Plan is a 6 × 28 m bar. Work on the north, archive on the south, a kiln and dust room in a concrete pocket. The clerestory is the only aperture after 18:00; interior light is tuned so the building reads as a single ember from the road.",
      "th": "ผังแท่ง 6 × 28 ม. งานด้านเหนือ คลังด้านใต้ เตาและห้องฝุ่นในกระเป๋าคอนกรีต ช่องแสงคือช่องเดียวหลังหกโมง แสงในอาคารตั้งให้มองจากถนนเป็นไตลุกก้อนเดียว",
      "zh": "平面为 6 × 28 米的长条体。北侧工作、南侧归档，窑炉与除尘间置于混凝土空间内。18:00 后仅保留高侧窗透光；室内灯光使建筑从道路看去像一颗余烬。"
    },
    "year": "2026",
    "medium": {
      "en": "Workplace",
      "th": "ที่ทำงาน",
      "zh": "工作空间"
    },
    "tags": [
      {
        "en": "timber",
        "th": "ไม้",
        "zh": "木材"
      },
      {
        "en": "night",
        "th": "กลางคืน",
        "zh": "夜间"
      },
      {
        "en": "shed",
        "th": "โรง",
        "zh": "长屋"
      }
    ],
    "x": -32,
    "z": -52,
    "color": "#5aa7e0"
  },
  {
    "id": "char-01",
    "zone": "characters",
    "title": {
      "en": "Robot Scout",
      "th": "หุ่นสอดแนม",
      "zh": "侦察机器人"
    },
    "description": {
      "en": "Low-poly reconnaissance unit with a readable silhouette, game-ready UVs, and a single emissive eye.",
      "th": "หุ่นลาดตระเวนโลว์โพลี เงาอ่านง่าย ยูวีพร้อมเกม และตาเรืองแสงดวงเดียว",
      "zh": "低多边形侦察单元，轮廓清晰，采用面向游戏的 UV 和一只发光眼睛。"
    },
    "detail": {
      "en": "8.4k tris, one 2k atlas, three LODs. The eye is a separate emissive so night shots hold. Idle cycle is a 4-second gyro sway; run cycle shares the same root motion as the hover-bike rider.",
      "th": "8.4 พันไตร แอตลาส 2k หนึ่งแผ่น สาม LOD ตาเป็นอิมิสซีฟแยกเพื่อให้ช็อตกลางคืนอยู่ ไอดิลเป็นไกโรสี่วินาที รันใช้รูทโมชันเดียวกับคนขับโฮเวอร์ไบค์",
      "zh": "8.4 千个三角面、单张 2K 图集、三个细节层级。眼睛使用独立自发光材质，以保留夜景辨识度。待机动作是四秒的陀螺式摆动；奔跑循环与悬浮车骑手共享根运动。"
    },
    "year": "2025",
    "medium": {
      "en": "Character / game",
      "th": "ตัวละคร / เกม",
      "zh": "角色／游戏"
    },
    "tags": [
      {
        "en": "low-poly",
        "th": "โลว์โพลี",
        "zh": "低多边形"
      },
      {
        "en": "rig",
        "th": "ริก",
        "zh": "骨骼绑定"
      },
      {
        "en": "emissive",
        "th": "เรืองแสง",
        "zh": "自发光"
      }
    ],
    "x": 28,
    "z": -42,
    "color": "#f0a0c8"
  },
  {
    "id": "char-02",
    "zone": "characters",
    "title": {
      "en": "Clay Guardian",
      "th": "ยักษ์ดินเผา",
      "zh": "陶土守护者"
    },
    "description": {
      "en": "Stylized yaksha in fired clay — temple massing, cracked glaze, and a quiet stance.",
      "th": "ยักษ์สไตล์ดินเผา มวลแบบวัด เคลือบแตก และท่ายืนเงียบ",
      "zh": "以烧制陶土表现的风格化夜叉：寺庙式体块、开片釉面与沉静站姿。"
    },
    "detail": {
      "en": "Sculpted in clay, 3D-scanned, then retopologized for real-time. The glaze crack is a baked cavity map, not a texture overlay. Pose is taken from a Sukhothai dvarapala, reduced to five masses.",
      "th": "ปั้นดิน สแกน แล้วรีโทโปสำหรับเรียลไทม์ รอยเคลือบเป็นคาวิตี้แมป ไม่ใช่ทับเท็กซ์เจอร์ ท่ายืนจากทวารบาลสุโขทัย ย่อเหลือห้ามวล",
      "zh": "先用陶土塑形，再进行三维扫描和实时拓扑重建。釉面裂纹来自烘焙凹陷贴图，而非叠加纹理。姿态参考素可泰门神，并简化为五个主要体块。"
    },
    "year": "2024",
    "medium": {
      "en": "Sculpture",
      "th": "ประติมากรรม",
      "zh": "雕塑"
    },
    "tags": [
      {
        "en": "scan",
        "th": "สแกน",
        "zh": "扫描"
      },
      {
        "en": "temple",
        "th": "วัด",
        "zh": "寺庙"
      },
      {
        "en": "clay",
        "th": "ดิน",
        "zh": "陶土"
      }
    ],
    "x": 52,
    "z": -34,
    "color": "#e889b4"
  },
  {
    "id": "char-03",
    "zone": "characters",
    "title": {
      "en": "Drift Rider",
      "th": "ไรเดอร์ดริฟต์",
      "zh": "漂移骑手"
    },
    "description": {
      "en": "Hero mesh for an arcade racer. Compact proportions, cloth sim on the scarf, PBR skin.",
      "th": "ฮีโร่เมชสำหรับเกมแข่งอาร์เคด สัดส่วนกระชับ ผ้าคลุมซิมอผ้า ผิวพีบีอาร์",
      "zh": "街机赛车主角模型，比例紧凑，围巾使用布料模拟，皮肤采用 PBR 材质。"
    },
    "detail": {
      "en": "Built to sit on the hover-bike without clipping. Scarf is a 64-vert strip with two bones. Skin uses a calibrated albedo — no cavity in the color map. Face blendshapes cover blink, grin, and a wind squint.",
      "th": "สร้างให้นั่งโฮเวอร์ไบค์โดยไม่คลิป ผ้าพันคอ 64 จุด สองโบน ผิวอัลเบโดสอบเทียบ ไม่มีคาวิตี้ในสี หน้ามีเบลนด์เชปกระพริบ ยิ้ม และหยีลม",
      "zh": "设计为坐在悬浮车上且避免穿插。围巾为 64 顶点带状网格，由两根骨骼控制。皮肤使用校准后的反照率，颜色贴图不包含凹陷阴影。面部形态键包括眨眼、微笑和迎风眯眼。"
    },
    "year": "2026",
    "medium": {
      "en": "Hero mesh",
      "th": "ฮีโร่เมช",
      "zh": "主角模型"
    },
    "tags": [
      {
        "en": "hero",
        "th": "ฮีโร่",
        "zh": "主角"
      },
      {
        "en": "cloth",
        "th": "ผ้า",
        "zh": "布料"
      },
      {
        "en": "racer",
        "th": "นักแข่ง",
        "zh": "赛车手"
      }
    ],
    "x": 32,
    "z": -52,
    "color": "#d46a9c"
  },
  {
    "id": "veh-01",
    "zone": "vehicles",
    "title": {
      "en": "Hover Bike",
      "th": "โฮเวอร์ไบค์",
      "zh": "悬浮摩托"
    },
    "description": {
      "en": "A one-person hover craft with ducted fans and a visible chassis. Built to be driven, not just rendered.",
      "th": "ยานลอยคนเดียว พัดลมท่อ และแชสซีที่เห็นได้ สร้างมาให้ขับ ไม่ใช่แค่เรนเดอร์",
      "zh": "单人悬浮载具，采用涵道风扇和外露底盘。设计目标是可驾驶，而不只是用于渲染。"
    },
    "detail": {
      "en": "Wheelbase analogue is 1.8 m. Two counter-rotating ducts, battery spine, and a steering bar that maps 1:1 to the atelier car’s yaw. The underside glow is the same coral as the driveable car — a family mark.",
      "th": "ฐานล้อเทียบ 1.8 ม. ท่อหมุนสวนทางสองชุด กระดูกสันหลังแบต และคันบังคับที่แมป 1:1 กับมุมหันของรถในลาน แสงใต้ท้องเป็นปะการังเดียวกับรถที่ขับได้",
      "zh": "等效轴距为 1.8 米。两组反向旋转涵道、纵向电池结构，以及与园区车辆偏航角一比一映射的转向把。底部辉光采用与可驾驶车辆一致的珊瑚色，形成系列标识。"
    },
    "year": "2025",
    "medium": {
      "en": "Vehicle concept",
      "th": "ยานแนวคิด",
      "zh": "载具概念"
    },
    "tags": [
      {
        "en": "hover",
        "th": "ลอย",
        "zh": "悬浮"
      },
      {
        "en": "chassis",
        "th": "แชสซี",
        "zh": "底盘"
      },
      {
        "en": "fan",
        "th": "พัดลม",
        "zh": "风扇"
      }
    ],
    "x": 28,
    "z": 42,
    "color": "#b6e07a"
  },
  {
    "id": "veh-02",
    "zone": "vehicles",
    "title": {
      "en": "Concept Coupe",
      "th": "คูเป้แนวคิด",
      "zh": "概念双门轿跑"
    },
    "description": {
      "en": "Long-nose coupe, three volumes, brushed aluminum and smoked glass. Studio lighting study included.",
      "th": "คูเป้จมูกยาว สามก้อน อลูมิเนียมแปรงและกระจกควัน รวมการศึกษาแสงสตูดิโอ",
      "zh": "长车头轿跑，三个主要体块，结合拉丝铝材与烟色玻璃，包含棚拍照明研究。"
    },
    "detail": {
      "en": "A three-box proportion with a 0.62 cabin-to-body ratio. Materials are a measured brushed aluminium (roughness 0.22, anisotropy 0.7) and a 70% smoked glass. The lighting rig is a 3-point HDRI plus a 2×1 m area for the shoulder line.",
      "th": "สัดส่วนสามกล่อง อัตรากะบะต่อตัวถัง 0.62 วัสดุอลูมิเนียมแปรงวัดค่า และกระจกควัน 70% ไฟเป็นเอชดีอาร์ไอสามจุดบวกไฟพื้นที่ 2×1 ม. ที่เส้นบ่า",
      "zh": "三厢式比例，乘员舱与车身比例为 0.62。材质采用测量的拉丝铝参数：粗糙度 0.22、各向异性 0.7，以及 70% 烟色玻璃。照明包括三点 HDRI 与用于肩线的 2 × 1 米面光源。"
    },
    "year": "2024",
    "medium": {
      "en": "Hard-surface",
      "th": "ฮาร์ดเซอร์เฟส",
      "zh": "硬表面"
    },
    "tags": [
      {
        "en": "coupe",
        "th": "คูเป้",
        "zh": "双门轿跑"
      },
      {
        "en": "aluminum",
        "th": "อลูมิเนียม",
        "zh": "铝"
      },
      {
        "en": "studio",
        "th": "สตูดิโอ",
        "zh": "摄影棚"
      }
    ],
    "x": 52,
    "z": 34,
    "color": "#96d45c"
  },
  {
    "id": "veh-03",
    "zone": "vehicles",
    "title": {
      "en": "Cargo Drone",
      "th": "โดรนบรรทุก",
      "zh": "货运无人机"
    },
    "description": {
      "en": "Utility hex-rotor with modular bays. Designed around service, not spectacle.",
      "th": "เฮกซ์โรเตอร์ใช้งาน ช่องโมดูลาร์ ออกแบบรอบการซ่อม ไม่ใช่การโชว์",
      "zh": "带模块化货舱的六旋翼实用无人机，重点关注维护便利性。"
    },
    "detail": {
      "en": "Six rotors, two hot-swap bays, landing skids that double as cable runs. The body is a single rotationally-moulded shell. Service hatch is four screws, same driver as the lamp product — a studio rule.",
      "th": "หกโรเตอร์ สองช่องถอดร้อน ขาลงที่เดินสายได้ ตัวถังเปลือกหมุนขึ้นรูปฝาเดียว ฝาซ่อมสี่สกรู ไขควงเดียวกับโคม — กติกาสตูดิโอ",
      "zh": "六个旋翼、两个热插拔货舱，起落架同时作为走线通道。机身为一体滚塑外壳。维护舱盖使用四颗螺钉，并与灯具采用相同螺丝刀规格，作为工作室统一规则。"
    },
    "year": "2026",
    "medium": {
      "en": "Industrial",
      "th": "อุตสาหกรรม",
      "zh": "工业设计"
    },
    "tags": [
      {
        "en": "drone",
        "th": "โดรน",
        "zh": "无人机"
      },
      {
        "en": "utility",
        "th": "ยูทิลิตี้",
        "zh": "实用"
      },
      {
        "en": "modular",
        "th": "โมดูลาร์",
        "zh": "模块化"
      }
    ],
    "x": 32,
    "z": 52,
    "color": "#7cbe4a"
  },
  {
    "id": "prod-01",
    "zone": "products",
    "title": {
      "en": "Modular Lamp",
      "th": "โคมโมดูลาร์",
      "zh": "模块化灯具"
    },
    "description": {
      "en": "3D-printable lamp of stacked rings. Warm 2700K source, interchangeable shades.",
      "th": "โคมพิมพ์ 3 มิติจากวงซ้อน แหล่งอุ่น 2700K ฝาครอบสลับได้",
      "zh": "由叠置圆环构成的可三维打印灯具，采用 2700K 暖光和可更换灯罩。"
    },
    "detail": {
      "en": "Printed in PETG, 0.2 mm layers, no supports. Rings stack on a 12 mm steel rod. Shade is a cloth drum or a turned teak cup. The LED board is a standard 50 mm COB — replaceable without opening the stem.",
      "th": "พิมพ์ PETG ชั้น 0.2 มม. ไม่ต้องซัพพอร์ต วงซ้อนบนแกนเหล็ก 12 มม. ฝาเป็นผ้าหรือถ้วยสักกลึง บอร์ดแอลอีดี COB 50 มม. มาตรฐาน เปลี่ยนได้โดยไม่ต้องเปิดลำ",
      "zh": "使用 PETG 打印，层高 0.2 毫米，无需支撑。圆环叠置在 12 毫米钢杆上。灯罩可采用布质筒形或车削柚木杯形。LED 板为标准 50 毫米 COB，不拆开灯柱即可更换。"
    },
    "year": "2025",
    "medium": {
      "en": "Product viz",
      "th": "งานผลิตภัณฑ์",
      "zh": "产品可视化"
    },
    "tags": [
      {
        "en": "print",
        "th": "พิมพ์",
        "zh": "打印"
      },
      {
        "en": "lamp",
        "th": "โคม",
        "zh": "灯具"
      },
      {
        "en": "modular",
        "th": "โมดูลาร์",
        "zh": "模块化"
      }
    ],
    "x": -28,
    "z": 42,
    "color": "#e8c078"
  },
  {
    "id": "prod-02",
    "zone": "products",
    "title": {
      "en": "Halo Watch",
      "th": "นาฬิกาเฮโล",
      "zh": "Halo 腕表"
    },
    "description": {
      "en": "Cushion-case timepiece with a floating chapter ring. Materials: brushed steel, sapphire, calf.",
      "th": "นาฬิกาเคสคุชชั่น วงชั่วโมงลอย วัสดุ: เหล็กแปรง แซปไฟร์ หนังลูกวัว",
      "zh": "枕形表壳与悬浮刻度环，材质包括拉丝钢、蓝宝石和小牛皮。"
    },
    "detail": {
      "en": "38.5 mm cushion, 10.2 mm thick, 20 mm lug. Chapter ring is a separate turned part, sat 0.4 mm above the dial. Hands are heat-blued steel. The strap is unlined calf, reverse-stitched, cut in Phitsanulok.",
      "th": "คุชชั่น 38.5 มม. หนา 10.2 หู 20 วงชั่วโมงเป็นชิ้นกลึงแยก ลอยเหนือหน้าปัด 0.4 มม. เข็มเหล็กบลูด้วยความร้อน สายหนังลูกวัวไม่บุ เย็บกลับ ตัดที่พิษณุโลก",
      "zh": "枕形表壳宽 38.5 毫米、厚 10.2 毫米，表耳宽 20 毫米。刻度环为独立车削部件，位于表盘上方 0.4 毫米。指针采用热处理蓝钢。表带为无衬里小牛皮，反向缝制，在彭世洛裁切。"
    },
    "year": "2024",
    "medium": {
      "en": "Wearable",
      "th": "สวมใส่",
      "zh": "可穿戴产品"
    },
    "tags": [
      {
        "en": "watch",
        "th": "นาฬิกา",
        "zh": "腕表"
      },
      {
        "en": "steel",
        "th": "เหล็ก",
        "zh": "钢"
      },
      {
        "en": "dial",
        "th": "หน้าปัด",
        "zh": "表盘"
      }
    ],
    "x": -52,
    "z": 34,
    "color": "#d4a85a"
  },
  {
    "id": "prod-03",
    "zone": "products",
    "title": {
      "en": "Audio Sphere",
      "th": "ทรงเสียง",
      "zh": "声音球体"
    },
    "description": {
      "en": "Omnidirectional speaker as a single machined hemisphere. Cloth, aluminum, and a hidden port.",
      "th": "ลำโพงรอบทิศเป็นครึ่งทรงกลึงชิ้นเดียว ผ้า อลูมิเนียม และพอร์ตซ่อน",
      "zh": "以一体机加工半球呈现的全向扬声器，结合织物、铝材和隐藏式导向孔。"
    },
    "detail": {
      "en": "A 180 mm hemisphere in 6061, cloth-wrapped upper, rear bass-reflex under the ring. Driver is a 3-inch full range. The object is meant to sit on a desk like a stone — no badge, no LED, a single tactile dimple for power.",
      "th": "ครึ่งทรง 180 มม. อลูมิเนียม 6061 หุ้มผ้าด้านบน รีเฟล็กซ์หลังใต้ห่วง ไดรเวอร์ฟูลเรนจ์ 3 นิ้ว วางบนโต๊ะเหมือนก้อนหิน ไม่มีตราสินค้า ไม่มีไฟ หลุมสัมผัสหนึ่งจุดสำหรับเปิด",
      "zh": "直径 180 毫米的 6061 铝合金半球，上部包覆织物，后部环下设低音反射孔。扬声器单元为三英寸全频单元。物体以桌面石块般的姿态呈现：无标牌、无 LED，仅保留一个触感凹点作为电源控制。"
    },
    "year": "2026",
    "medium": {
      "en": "Object",
      "th": "วัตถุ",
      "zh": "物件"
    },
    "tags": [
      {
        "en": "audio",
        "th": "เสียง",
        "zh": "声音"
      },
      {
        "en": "machine",
        "th": "กลึง",
        "zh": "机加工"
      },
      {
        "en": "object",
        "th": "วัตถุ",
        "zh": "物件"
      }
    ],
    "x": -32,
    "z": 52,
    "color": "#c49248"
  }
];

export const ZONE_BY_ID = Object.fromEntries(ZONES.map((z) => [z.id, z])) as Record<ZoneId, Zone>;

export function t(text: Text, lang: Lang) {
  return text[lang];
}

export function nearestProject(x: number, z: number, exclude: string[] = []) {
  let best: Project | null = null;
  let bestD = Infinity;
  for (const p of PROJECTS) {
    if (exclude.includes(p.id)) continue;
    const d = Math.hypot(p.x - x, p.z - z);
    if (d < bestD) {
      bestD = d;
      best = p;
    }
  }
  return best ? { project: best, dist: bestD } : null;
}
