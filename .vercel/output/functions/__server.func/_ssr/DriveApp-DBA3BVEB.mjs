import { i as __toESM } from "../_runtime.mjs";
import { _ as Vector3, c as CanvasTexture, d as Euler, f as Fog, g as SRGBColorSpace, h as Quaternion, l as ClampToEdgeWrapping, m as Matrix4, n as useFrame, o as BufferAttribute, p as MathUtils, r as useThree, s as BufferGeometry, t as Canvas, u as Color, v as require_jsx_runtime, y as require_react } from "../_libs/@react-three/fiber+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
import { a as Pause, c as CloudRain, i as Settings2, n as Volume2, o as LayoutGrid, s as Gem, t as VolumeX } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DriveApp-DBA3BVEB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ZONES = [
	{
		id: "architecture",
		name: {
			en: "Architecture",
			th: "สถาปัตย์"
		},
		x: -42,
		z: -42,
		color: "#6ea0c8",
		pad: "#1d3348",
		size: 38
	},
	{
		id: "characters",
		name: {
			en: "Characters",
			th: "ตัวละคร"
		},
		x: 42,
		z: -42,
		color: "#c47a9a",
		pad: "#3a2230",
		size: 38
	},
	{
		id: "vehicles",
		name: {
			en: "Vehicles",
			th: "ยานยนต์"
		},
		x: 42,
		z: 42,
		color: "#7eae6e",
		pad: "#24341f",
		size: 38
	},
	{
		id: "products",
		name: {
			en: "Products",
			th: "ผลิตภัณฑ์"
		},
		x: -42,
		z: 42,
		color: "#c4a06a",
		pad: "#3a2e1c",
		size: 38
	}
];
var PROJECTS = [
	{
		id: "arch-01",
		zone: "architecture",
		title: {
			en: "Glass Pavilion",
			th: "ศาลาแก้ว"
		},
		description: {
			en: "A minimal pavilion of structural glass and slim steel, with a parametric facade that reads as one folded plane.",
			th: "ศาลาแก้วโครงสร้างเหล็กเส้นบาง ผิวพาราเมตริกที่อ่านเป็นระนาบพับผืนเดียว"
		},
		detail: {
			en: "Commissioned as a monsoon-season folly. The roof is a single cold-bent laminate; columns sit outside the thermal envelope so the glass can run to the floor. Night lighting is a 2700K wash from the soffit, never from the facade.",
			th: "ออกแบบเป็นศาลาฤดูมรสุม หลังคาเป็นกระจกลามิเนตโค้งเย็นต้นเดียว เสานอกซองความร้อนเพื่อให้กระจกจรดพื้น แสงกลางคืนเป็นวอช 2700K จากท้องหลังคา"
		},
		year: "2025",
		medium: {
			en: "Archviz / form study",
			th: "อาร์ควิซ / รูปทรง"
		},
		tags: [
			{
				en: "glass",
				th: "กระจก"
			},
			{
				en: "steel",
				th: "เหล็ก"
			},
			{
				en: "pavilion",
				th: "ศาลา"
			}
		],
		x: -28,
		z: -42,
		color: "#7ec8ff"
	},
	{
		id: "arch-02",
		zone: "architecture",
		title: {
			en: "Mekong House",
			th: "เรือนโขง"
		},
		description: {
			en: "Stilt dwelling reimagined as a cool-climate studio: teak lattice, lifted floor, monsoon-aware roof.",
			th: "เรือนยกใต้ถุนคิดใหม่เป็นสตูดิโออากาศเย็น ลายฉลุสัก พื้นยก หลังคารู้จักมรสุม"
		},
		detail: {
			en: "A live-work house on the Nan river terrace. Cross ventilation is the HVAC. The lattice is CNC-cut teak, repeating a lozenge taken from local weaving. The studio bay faces north-east, away from the afternoon glare.",
			th: "บ้านอยู่-ทำงานบนระเบียงแม่น้ำน่าน ลมขวางคือระบบปรับอากาศ ลายฉลุสักซีเอ็นซีจากลวดลายทอท้องถิ่น ช่องสตูดิโอหันตะวันออกเฉียงเหนือ"
		},
		year: "2024",
		medium: {
			en: "Residence concept",
			th: "บ้านพัก"
		},
		tags: [
			{
				en: "teak",
				th: "สัก"
			},
			{
				en: "stilt",
				th: "ใต้ถุน"
			},
			{
				en: "climate",
				th: "ภูมิอากาศ"
			}
		],
		x: -52,
		z: -34,
		color: "#9ad4ff"
	},
	{
		id: "arch-03",
		zone: "architecture",
		title: {
			en: "Night Atelier",
			th: "โรงงานราตรี"
		},
		description: {
			en: "The studio itself — a long shed of blackened timber and a single clerestory, designed to disappear at dusk.",
			th: "ตัวสตูดิโอเอง — โรงยาวไม้เผาดำ ช่องแสงเดียว ออกแบบให้หายไปตอนโพล้เพล้"
		},
		detail: {
			en: "Plan is a 6 × 28 m bar. Work on the north, archive on the south, a kiln and dust room in a concrete pocket. The clerestory is the only aperture after 18:00; interior light is tuned so the building reads as a single ember from the road.",
			th: "ผังแท่ง 6 × 28 ม. งานด้านเหนือ คลังด้านใต้ เตาและห้องฝุ่นในกระเป๋าคอนกรีต ช่องแสงคือช่องเดียวหลังหกโมง แสงในอาคารตั้งให้มองจากถนนเป็นไตลุกก้อนเดียว"
		},
		year: "2026",
		medium: {
			en: "Workplace",
			th: "ที่ทำงาน"
		},
		tags: [
			{
				en: "timber",
				th: "ไม้"
			},
			{
				en: "night",
				th: "กลางคืน"
			},
			{
				en: "shed",
				th: "โรง"
			}
		],
		x: -32,
		z: -52,
		color: "#5aa7e0"
	},
	{
		id: "char-01",
		zone: "characters",
		title: {
			en: "Robot Scout",
			th: "หุ่นสอดแนม"
		},
		description: {
			en: "Low-poly reconnaissance unit with a readable silhouette, game-ready UVs, and a single emissive eye.",
			th: "หุ่นลาดตระเวนโลว์โพลี เงาอ่านง่าย ยูวีพร้อมเกม และตาเรืองแสงดวงเดียว"
		},
		detail: {
			en: "8.4k tris, one 2k atlas, three LODs. The eye is a separate emissive so night shots hold. Idle cycle is a 4-second gyro sway; run cycle shares the same root motion as the hover-bike rider.",
			th: "8.4 พันไตร แอตลาส 2k หนึ่งแผ่น สาม LOD ตาเป็นอิมิสซีฟแยกเพื่อให้ช็อตกลางคืนอยู่ ไอดิลเป็นไกโรสี่วินาที รันใช้รูทโมชันเดียวกับคนขับโฮเวอร์ไบค์"
		},
		year: "2025",
		medium: {
			en: "Character / game",
			th: "ตัวละคร / เกม"
		},
		tags: [
			{
				en: "low-poly",
				th: "โลว์โพลี"
			},
			{
				en: "rig",
				th: "ริก"
			},
			{
				en: "emissive",
				th: "เรืองแสง"
			}
		],
		x: 28,
		z: -42,
		color: "#f0a0c8"
	},
	{
		id: "char-02",
		zone: "characters",
		title: {
			en: "Clay Guardian",
			th: "ยักษ์ดินเผา"
		},
		description: {
			en: "Stylized yaksha in fired clay — temple massing, cracked glaze, and a quiet stance.",
			th: "ยักษ์สไตล์ดินเผา มวลแบบวัด เคลือบแตก และท่ายืนเงียบ"
		},
		detail: {
			en: "Sculpted in clay, 3D-scanned, then retopologized for real-time. The glaze crack is a baked cavity map, not a texture overlay. Pose is taken from a Sukhothai dvarapala, reduced to five masses.",
			th: "ปั้นดิน สแกน แล้วรีโทโปสำหรับเรียลไทม์ รอยเคลือบเป็นคาวิตี้แมป ไม่ใช่ทับเท็กซ์เจอร์ ท่ายืนจากทวารบาลสุโขทัย ย่อเหลือห้ามวล"
		},
		year: "2024",
		medium: {
			en: "Sculpture",
			th: "ประติมากรรม"
		},
		tags: [
			{
				en: "scan",
				th: "สแกน"
			},
			{
				en: "temple",
				th: "วัด"
			},
			{
				en: "clay",
				th: "ดิน"
			}
		],
		x: 52,
		z: -34,
		color: "#e889b4"
	},
	{
		id: "char-03",
		zone: "characters",
		title: {
			en: "Drift Rider",
			th: "ไรเดอร์ดริฟต์"
		},
		description: {
			en: "Hero mesh for an arcade racer. Compact proportions, cloth sim on the scarf, PBR skin.",
			th: "ฮีโร่เมชสำหรับเกมแข่งอาร์เคด สัดส่วนกระชับ ผ้าคลุมซิมอผ้า ผิวพีบีอาร์"
		},
		detail: {
			en: "Built to sit on the hover-bike without clipping. Scarf is a 64-vert strip with two bones. Skin uses a calibrated albedo — no cavity in the color map. Face blendshapes cover blink, grin, and a wind squint.",
			th: "สร้างให้นั่งโฮเวอร์ไบค์โดยไม่คลิป ผ้าพันคอ 64 จุด สองโบน ผิวอัลเบโดสอบเทียบ ไม่มีคาวิตี้ในสี หน้ามีเบลนด์เชปกระพริบ ยิ้ม และหยีลม"
		},
		year: "2026",
		medium: {
			en: "Hero mesh",
			th: "ฮีโร่เมช"
		},
		tags: [
			{
				en: "hero",
				th: "ฮีโร่"
			},
			{
				en: "cloth",
				th: "ผ้า"
			},
			{
				en: "racer",
				th: "นักแข่ง"
			}
		],
		x: 32,
		z: -52,
		color: "#d46a9c"
	},
	{
		id: "veh-01",
		zone: "vehicles",
		title: {
			en: "Hover Bike",
			th: "โฮเวอร์ไบค์"
		},
		description: {
			en: "A one-person hover craft with ducted fans and a visible chassis. Built to be driven, not just rendered.",
			th: "ยานลอยคนเดียว พัดลมท่อ และแชสซีที่เห็นได้ สร้างมาให้ขับ ไม่ใช่แค่เรนเดอร์"
		},
		detail: {
			en: "Wheelbase analogue is 1.8 m. Two counter-rotating ducts, battery spine, and a steering bar that maps 1:1 to the atelier car’s yaw. The underside glow is the same coral as the driveable car — a family mark.",
			th: "ฐานล้อเทียบ 1.8 ม. ท่อหมุนสวนทางสองชุด กระดูกสันหลังแบต และคันบังคับที่แมป 1:1 กับมุมหันของรถในลาน แสงใต้ท้องเป็นปะการังเดียวกับรถที่ขับได้"
		},
		year: "2025",
		medium: {
			en: "Vehicle concept",
			th: "ยานแนวคิด"
		},
		tags: [
			{
				en: "hover",
				th: "ลอย"
			},
			{
				en: "chassis",
				th: "แชสซี"
			},
			{
				en: "fan",
				th: "พัดลม"
			}
		],
		x: 28,
		z: 42,
		color: "#b6e07a"
	},
	{
		id: "veh-02",
		zone: "vehicles",
		title: {
			en: "Concept Coupe",
			th: "คูเป้แนวคิด"
		},
		description: {
			en: "Long-nose coupe, three volumes, brushed aluminum and smoked glass. Studio lighting study included.",
			th: "คูเป้จมูกยาว สามก้อน อลูมิเนียมแปรงและกระจกควัน รวมการศึกษาแสงสตูดิโอ"
		},
		detail: {
			en: "A three-box proportion with a 0.62 cabin-to-body ratio. Materials are a measured brushed aluminium (roughness 0.22, anisotropy 0.7) and a 70% smoked glass. The lighting rig is a 3-point HDRI plus a 2×1 m area for the shoulder line.",
			th: "สัดส่วนสามกล่อง อัตรากะบะต่อตัวถัง 0.62 วัสดุอลูมิเนียมแปรงวัดค่า และกระจกควัน 70% ไฟเป็นเอชดีอาร์ไอสามจุดบวกไฟพื้นที่ 2×1 ม. ที่เส้นบ่า"
		},
		year: "2024",
		medium: {
			en: "Hard-surface",
			th: "ฮาร์ดเซอร์เฟส"
		},
		tags: [
			{
				en: "coupe",
				th: "คูเป้"
			},
			{
				en: "aluminum",
				th: "อลูมิเนียม"
			},
			{
				en: "studio",
				th: "สตูดิโอ"
			}
		],
		x: 52,
		z: 34,
		color: "#96d45c"
	},
	{
		id: "veh-03",
		zone: "vehicles",
		title: {
			en: "Cargo Drone",
			th: "โดรนบรรทุก"
		},
		description: {
			en: "Utility hex-rotor with modular bays. Designed around service, not spectacle.",
			th: "เฮกซ์โรเตอร์ใช้งาน ช่องโมดูลาร์ ออกแบบรอบการซ่อม ไม่ใช่การโชว์"
		},
		detail: {
			en: "Six rotors, two hot-swap bays, landing skids that double as cable runs. The body is a single rotationally-moulded shell. Service hatch is four screws, same driver as the lamp product — a studio rule.",
			th: "หกโรเตอร์ สองช่องถอดร้อน ขาลงที่เดินสายได้ ตัวถังเปลือกหมุนขึ้นรูปฝาเดียว ฝาซ่อมสี่สกรู ไขควงเดียวกับโคม — กติกาสตูดิโอ"
		},
		year: "2026",
		medium: {
			en: "Industrial",
			th: "อุตสาหกรรม"
		},
		tags: [
			{
				en: "drone",
				th: "โดรน"
			},
			{
				en: "utility",
				th: "ยูทิลิตี้"
			},
			{
				en: "modular",
				th: "โมดูลาร์"
			}
		],
		x: 32,
		z: 52,
		color: "#7cbe4a"
	},
	{
		id: "prod-01",
		zone: "products",
		title: {
			en: "Modular Lamp",
			th: "โคมโมดูลาร์"
		},
		description: {
			en: "3D-printable lamp of stacked rings. Warm 2700K source, interchangeable shades.",
			th: "โคมพิมพ์ 3 มิติจากวงซ้อน แหล่งอุ่น 2700K ฝาครอบสลับได้"
		},
		detail: {
			en: "Printed in PETG, 0.2 mm layers, no supports. Rings stack on a 12 mm steel rod. Shade is a cloth drum or a turned teak cup. The LED board is a standard 50 mm COB — replaceable without opening the stem.",
			th: "พิมพ์ PETG ชั้น 0.2 มม. ไม่ต้องซัพพอร์ต วงซ้อนบนแกนเหล็ก 12 มม. ฝาเป็นผ้าหรือถ้วยสักกลึง บอร์ดแอลอีดี COB 50 มม. มาตรฐาน เปลี่ยนได้โดยไม่ต้องเปิดลำ"
		},
		year: "2025",
		medium: {
			en: "Product viz",
			th: "งานผลิตภัณฑ์"
		},
		tags: [
			{
				en: "print",
				th: "พิมพ์"
			},
			{
				en: "lamp",
				th: "โคม"
			},
			{
				en: "modular",
				th: "โมดูลาร์"
			}
		],
		x: -28,
		z: 42,
		color: "#e8c078"
	},
	{
		id: "prod-02",
		zone: "products",
		title: {
			en: "Halo Watch",
			th: "นาฬิกาเฮโล"
		},
		description: {
			en: "Cushion-case timepiece with a floating chapter ring. Materials: brushed steel, sapphire, calf.",
			th: "นาฬิกาเคสคุชชั่น วงชั่วโมงลอย วัสดุ: เหล็กแปรง แซปไฟร์ หนังลูกวัว"
		},
		detail: {
			en: "38.5 mm cushion, 10.2 mm thick, 20 mm lug. Chapter ring is a separate turned part, sat 0.4 mm above the dial. Hands are heat-blued steel. The strap is unlined calf, reverse-stitched, cut in Phitsanulok.",
			th: "คุชชั่น 38.5 มม. หนา 10.2 หู 20 วงชั่วโมงเป็นชิ้นกลึงแยก ลอยเหนือหน้าปัด 0.4 มม. เข็มเหล็กบลูด้วยความร้อน สายหนังลูกวัวไม่บุ เย็บกลับ ตัดที่พิษณุโลก"
		},
		year: "2024",
		medium: {
			en: "Wearable",
			th: "สวมใส่"
		},
		tags: [
			{
				en: "watch",
				th: "นาฬิกา"
			},
			{
				en: "steel",
				th: "เหล็ก"
			},
			{
				en: "dial",
				th: "หน้าปัด"
			}
		],
		x: -52,
		z: 34,
		color: "#d4a85a"
	},
	{
		id: "prod-03",
		zone: "products",
		title: {
			en: "Audio Sphere",
			th: "ทรงเสียง"
		},
		description: {
			en: "Omnidirectional speaker as a single machined hemisphere. Cloth, aluminum, and a hidden port.",
			th: "ลำโพงรอบทิศเป็นครึ่งทรงกลึงชิ้นเดียว ผ้า อลูมิเนียม และพอร์ตซ่อน"
		},
		detail: {
			en: "A 180 mm hemisphere in 6061, cloth-wrapped upper, rear bass-reflex under the ring. Driver is a 3-inch full range. The object is meant to sit on a desk like a stone — no badge, no LED, a single tactile dimple for power.",
			th: "ครึ่งทรง 180 มม. อลูมิเนียม 6061 หุ้มผ้าด้านบน รีเฟล็กซ์หลังใต้ห่วง ไดรเวอร์ฟูลเรนจ์ 3 นิ้ว วางบนโต๊ะเหมือนก้อนหิน ไม่มีตราสินค้า ไม่มีไฟ หลุมสัมผัสหนึ่งจุดสำหรับเปิด"
		},
		year: "2026",
		medium: {
			en: "Object",
			th: "วัตถุ"
		},
		tags: [
			{
				en: "audio",
				th: "เสียง"
			},
			{
				en: "machine",
				th: "กลึง"
			},
			{
				en: "object",
				th: "วัตถุ"
			}
		],
		x: -32,
		z: 52,
		color: "#c49248"
	}
];
var ZONE_BY_ID = Object.fromEntries(ZONES.map((z) => [z.id, z]));
function t(text, lang) {
	return text[lang];
}
function nearestProject(x, z, exclude = []) {
	let best = null;
	let bestD = Infinity;
	for (const p of PROJECTS) {
		if (exclude.includes(p.id)) continue;
		const d = Math.hypot(p.x - x, p.z - z);
		if (d < bestD) {
			bestD = d;
			best = p;
		}
	}
	return best ? {
		project: best,
		dist: bestD
	} : null;
}
var dayState = {
	time: .32,
	speed: .012,
	paused: false,
	night: 0,
	sunI: 1.2,
	ambI: .45,
	sunX: 40,
	sunY: 55,
	sunZ: 18,
	sky: new Color("#87a0b4"),
	fog: new Color("#8fa6b4")
};
var skyDay = new Color("#9bb4c4");
var skyDusk = new Color("#c48462");
var skyNight = new Color("#07080c");
var fogDay = new Color("#a8bcc8");
var fogDusk = new Color("#b88870");
var fogNight = new Color("#0b0d12");
function setDayTime(t) {
	dayState.time = (t % 1 + 1) % 1;
	stepDayNight(0);
}
function setDayPaused(v) {
	dayState.paused = v;
}
function stepDayNight(dt) {
	if (!dayState.paused) dayState.time = (dayState.time + dt * dayState.speed) % 1;
	const angle = dayState.time * Math.PI * 2;
	const elev = -Math.cos(angle);
	dayState.sunX = Math.sin(angle) * 90;
	dayState.sunZ = Math.cos(angle) * 40;
	dayState.sunY = elev * 70;
	const dayAmt = MathUtils.clamp(elev * .5 + .5, 0, 1);
	dayState.night = 1 - dayAmt;
	dayState.sunI = .08 + dayAmt * 1.35;
	dayState.ambI = .12 + dayAmt * .38;
	if (elev > .15) {
		dayState.sky.copy(skyDay);
		dayState.fog.copy(fogDay);
	} else if (elev > -.15) {
		const k = MathUtils.smoothstep(-.15, .15, elev);
		dayState.sky.copy(skyDusk).lerp(skyDay, k);
		dayState.fog.copy(fogDusk).lerp(fogDay, k);
	} else {
		const k = MathUtils.smoothstep(-.5, -.15, elev);
		dayState.sky.copy(skyNight).lerp(skyDusk, k);
		dayState.fog.copy(fogNight).lerp(fogDusk, k);
	}
	return dayState;
}
var sim = {
	x: 0,
	y: .42,
	z: 10,
	yaw: 0,
	speed: 0,
	steer: 0,
	roll: 0,
	wheel: 0,
	lateral: 0,
	vx: 0,
	vz: 0
};
var perfState = {
	fps: 60,
	frames: 0,
	last: 0,
	dpr: 1.5,
	shadows: true
};
var COLLIDERS = [
	{
		x: 0,
		z: 0,
		r: 2.05
	},
	{
		x: -42,
		z: -42,
		r: 4.4
	},
	{
		x: 42,
		z: -42,
		r: 2.15
	},
	{
		x: 42,
		z: 42,
		r: 2.5
	},
	{
		x: -42,
		z: 42,
		r: 1.7
	}
];
function zoneAt(x, z) {
	if (x < -22 && z < -22) return "architecture";
	if (x > 22 && z < -22) return "characters";
	if (x > 22 && z > 22) return "vehicles";
	if (x < -22 && z > 22) return "products";
	return null;
}
function onPavement(x, z) {
	if (Math.abs(x) < 8.6 || Math.abs(z) < 8.6) return true;
	if (Math.hypot(x, z) < 16.5) return true;
	for (const z0 of ZONES) if (Math.abs(x - z0.x) < z0.size / 2 && Math.abs(z - z0.z) < z0.size / 2) return true;
	return false;
}
function resolveColliders() {
	for (const c of COLLIDERS) {
		const dx = sim.x - c.x;
		const dz = sim.z - c.z;
		const d = Math.hypot(dx, dz);
		if (d >= c.r) continue;
		const nx = d < 1e-4 ? 1 : dx / d;
		const nz = d < 1e-4 ? 0 : dz / d;
		const push = c.r - d;
		sim.x += nx * push;
		sim.z += nz * push;
		sim.speed *= .35;
		sim.lateral *= .2;
	}
}
function teleport(x, z, yaw) {
	sim.x = x;
	sim.z = z;
	sim.speed = 0;
	sim.lateral = 0;
	sim.steer = 0;
	if (yaw != null) sim.yaw = yaw;
	resolveColliders();
}
if (typeof window !== "undefined") window.__sim = sim;
var FILES = {
	engine: "/audio/engine.wav",
	wind: "/audio/wind.wav",
	collect: "/audio/collect.wav",
	architecture: "/audio/zone-arch.wav",
	characters: "/audio/zone-char.wav",
	vehicles: "/audio/zone-veh.wav",
	products: "/audio/zone-prod.wav"
};
var bus = null;
var buffers = /* @__PURE__ */ new Map();
var loops = /* @__PURE__ */ new Map();
var currentZone = null;
var muted = false;
var unlocked = false;
var visHooked = false;
function ensure() {
	if (typeof window === "undefined") return null;
	if (bus) return bus;
	const AC = window.AudioContext || window.webkitAudioContext;
	if (!AC) return null;
	const ctx = new AC({ latencyHint: "interactive" });
	const master = ctx.createGain();
	const music = ctx.createGain();
	const sfx = ctx.createGain();
	music.gain.value = .9;
	sfx.gain.value = 1;
	master.gain.value = muted ? 0 : .85;
	music.connect(master);
	sfx.connect(master);
	master.connect(ctx.destination);
	bus = {
		ctx,
		master,
		music,
		sfx
	};
	return bus;
}
function unlockAudio() {
	const b = ensure();
	if (!b) return;
	if (b.ctx.state === "suspended") b.ctx.resume();
	unlocked = true;
	if (!visHooked) {
		visHooked = true;
		document.addEventListener("visibilitychange", () => {
			if (document.visibilityState === "visible" && b.ctx.state === "suspended") b.ctx.resume();
		});
	}
}
async function loadBuffer(key, url) {
	const b = ensure();
	if (!b || buffers.has(key)) return;
	try {
		const raw = await (await fetch(url)).arrayBuffer();
		const decoded = await b.ctx.decodeAudioData(raw.slice(0));
		buffers.set(key, decoded);
	} catch {}
}
function startLoop(key, dest, volume) {
	const b = bus;
	if (!b) return;
	stopLoop(key);
	const buf = buffers.get(key);
	const gain = b.ctx.createGain();
	gain.gain.value = volume;
	gain.connect(dest);
	if (buf) {
		const src = b.ctx.createBufferSource();
		src.buffer = buf;
		src.loop = true;
		src.connect(gain);
		src.start();
		loops.set(key, {
			src,
			gain
		});
		return;
	}
	const osc = b.ctx.createOscillator();
	osc.type = "sine";
	osc.frequency.value = key === "engine" ? 55 : 110;
	osc.connect(gain);
	osc.start();
	loops.set(key, {
		src: osc,
		gain
	});
}
function stopLoop(key) {
	const n = loops.get(key);
	if (!n || !bus) return;
	try {
		n.src.stop();
	} catch {}
	n.gain.disconnect();
	loops.delete(key);
}
async function startAudio() {
	unlockAudio();
	const b = ensure();
	if (!b) return;
	await Promise.all(Object.entries(FILES).map(([k, u]) => loadBuffer(k, u)));
	if (!loops.has("engine")) startLoop("engine", b.music, .12);
	if (!loops.has("wind")) startLoop("wind", b.music, .08);
	setMuted(muted);
}
function setEngine(speed) {
	const n = loops.get("engine");
	const w = loops.get("wind");
	if (!bus || !n) return;
	const t = bus.ctx.currentTime;
	const abs = Math.min(1, Math.abs(speed) / 16);
	n.gain.gain.setTargetAtTime(.08 + abs * .28, t, .05);
	const src = n.src;
	if ("playbackRate" in src) src.playbackRate.setTargetAtTime(.72 + abs * .7, t, .05);
	if (w) w.gain.gain.setTargetAtTime(.05 + abs * .18, t, .08);
}
function setZoneBed(zone) {
	if (!bus || !unlocked) return;
	if (zone === currentZone) return;
	const t = bus.ctx.currentTime;
	const prevZone = currentZone;
	if (prevZone) {
		const prev = loops.get(prevZone);
		if (prev) prev.gain.gain.setTargetAtTime(0, t, .25);
		window.setTimeout(() => {
			if (currentZone !== prevZone) stopLoop(prevZone);
		}, 600);
	}
	currentZone = zone;
	if (zone && FILES[zone]) {
		startLoop(zone, bus.music, 0);
		loops.get(zone)?.gain.gain.setTargetAtTime(.16, t, .35);
	}
}
function playCollect() {
	const b = bus;
	if (!b || muted) return;
	const buf = buffers.get("collect");
	const gain = b.ctx.createGain();
	const t = b.ctx.currentTime;
	gain.gain.setValueAtTime(.001, t);
	gain.gain.exponentialRampToValueAtTime(.55, t + .012);
	gain.gain.exponentialRampToValueAtTime(.001, t + .35);
	gain.connect(b.sfx);
	if (buf) {
		const src = b.ctx.createBufferSource();
		src.buffer = buf;
		src.playbackRate.value = .94 + Math.random() * .14;
		src.connect(gain);
		src.start();
		src.onended = () => {
			try {
				gain.disconnect();
			} catch {}
		};
		return;
	}
	const osc = b.ctx.createOscillator();
	osc.frequency.value = 760 + Math.random() * 180;
	osc.connect(gain);
	osc.start();
	osc.stop(t + .22);
}
function setMuted(next) {
	muted = next;
	if (!bus) return;
	bus.master.gain.setTargetAtTime(next ? 0 : .85, bus.ctx.currentTime, .04);
}
function getAudioDebug() {
	return {
		unlocked,
		muted,
		hasBus: Boolean(bus),
		state: bus?.ctx.state ?? "none",
		zone: currentZone,
		loops: [...loops.keys()]
	};
}
var SAVE_KEY = "atelier-drive-v2";
var LEGACY_KEY = "atelier-drive-v1";
function migrate(raw) {
	const collected = (raw.collected ?? []).filter((id) => PROJECTS.some((p) => p.id === id));
	const lang = raw.lang === "th" ? "th" : "en";
	const weather = raw.weather === "clear" || raw.weather === "rain" || raw.weather === "snow" || raw.weather === "auto" ? raw.weather : "auto";
	const quality = raw.quality === "medium" || raw.quality === "low" ? raw.quality : "high";
	return {
		version: 2,
		collected,
		muted: Boolean(raw.muted),
		weather,
		lang,
		quality,
		dayPaused: Boolean(raw.dayPaused),
		dayTime: typeof raw.dayTime === "number" ? raw.dayTime : .32
	};
}
function loadSave() {
	if (typeof window === "undefined") return migrate({ version: 2 });
	try {
		const raw = localStorage.getItem(SAVE_KEY) ?? localStorage.getItem(LEGACY_KEY);
		if (!raw) return migrate({ version: 2 });
		return migrate(JSON.parse(raw));
	} catch {
		return migrate({ version: 2 });
	}
}
function persist(partial) {
	if (typeof window === "undefined") return;
	try {
		const next = {
			...loadSave(),
			...partial,
			version: 2
		};
		localStorage.setItem(SAVE_KEY, JSON.stringify(next));
	} catch {}
}
var initial = loadSave();
if (initial.dayPaused) dayState.paused = true;
if (typeof initial.dayTime === "number") dayState.time = initial.dayTime;
var useDrive = create((set, get) => ({
	started: false,
	muted: initial.muted,
	collected: initial.collected,
	activeId: null,
	zoneId: null,
	fps: 60,
	weather: initial.weather,
	lang: initial.lang,
	quality: initial.quality,
	overlay: "none",
	waypoint: null,
	speedKmh: 0,
	completeSeen: false,
	start: () => set({ started: true }),
	toggleMute: () => get().setMuted(!get().muted),
	setMuted: (muted) => {
		setMuted(muted);
		persist({ muted });
		set({ muted });
	},
	collect: (id) => {
		const { collected } = get();
		const next = collected.includes(id) ? collected : [...collected, id];
		persist({ collected: next });
		set({
			collected: next,
			activeId: id,
			overlay: "none",
			completeSeen: next.length >= PROJECTS.length ? get().completeSeen : false
		});
	},
	openProject: (id) => set({
		activeId: id,
		overlay: "none"
	}),
	closeModal: () => {
		const { collected, completeSeen } = get();
		set({
			activeId: null,
			overlay: collected.length >= PROJECTS.length && !completeSeen ? "complete" : "none"
		});
	},
	setFps: (fps) => set({ fps }),
	setZone: (zoneId) => {
		if (get().zoneId !== zoneId) set({ zoneId });
	},
	cycleWeather: () => {
		const order = [
			"auto",
			"clear",
			"rain",
			"snow"
		];
		const i = order.indexOf(get().weather);
		get().setWeather(order[(i + 1) % order.length]);
	},
	setWeather: (weather) => {
		persist({ weather });
		set({ weather });
	},
	setLang: (lang) => {
		persist({ lang });
		set({ lang });
	},
	setQuality: (quality) => {
		persist({ quality });
		set({ quality });
	},
	setOverlay: (overlay) => set({
		overlay,
		activeId: overlay === "none" ? get().activeId : null
	}),
	toggleOverlay: (o) => {
		const cur = get().overlay;
		set({
			overlay: cur === o ? "none" : o,
			activeId: null
		});
	},
	setWaypoint: (waypoint) => set({ waypoint }),
	setSpeedKmh: (speedKmh) => {
		if (Math.abs(speedKmh - get().speedKmh) >= 1) set({ speedKmh });
	},
	resetProgress: () => {
		persist({ collected: [] });
		set({
			collected: [],
			activeId: null,
			completeSeen: false,
			waypoint: null,
			overlay: "none"
		});
	},
	markCompleteSeen: () => set({
		completeSeen: true,
		overlay: "none"
	}),
	blocked: () => {
		const s = get();
		return Boolean(s.activeId) || s.overlay !== "none";
	}
}));
function isDriveBlocked() {
	const s = useDrive.getState();
	return Boolean(s.activeId) || s.overlay !== "none" || !s.started;
}
function mulberry32(a) {
	return function() {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function scatter(count, seed, avoid) {
	const rnd = mulberry32(seed);
	const out = [];
	let guard = 0;
	while (out.length < count && guard < count * 20) {
		guard++;
		const x = (rnd() * 2 - 1) * 92;
		const z = (rnd() * 2 - 1) * 92;
		if (Math.abs(x) < 9 || Math.abs(z) < 9) continue;
		if (Math.hypot(x, z) < 16) continue;
		if (avoid.some((a) => Math.hypot(x - a.x, z - a.z) < a.r)) continue;
		out.push({
			x,
			y: 0,
			z,
			s: .75 + rnd() * .7,
			r: rnd() * Math.PI * 2
		});
	}
	return out;
}
function makeGroundTexture() {
	const c = document.createElement("canvas");
	c.width = 1024;
	c.height = 1024;
	const ctx = c.getContext("2d");
	ctx.fillStyle = "#1a211c";
	ctx.fillRect(0, 0, 1024, 1024);
	ctx.fillStyle = "#161c18";
	for (let i = 0; i < 1400; i++) {
		ctx.globalAlpha = .15;
		ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 4 + Math.random() * 10, 3);
	}
	ctx.globalAlpha = 1;
	const to = (n) => (n + 100) / 200 * 1024;
	ctx.fillStyle = "#2a2e34";
	ctx.fillRect(to(-8), 0, to(8) - to(-8), 1024);
	ctx.fillRect(0, to(-8), 1024, to(8) - to(-8));
	ctx.beginPath();
	ctx.arc(512, 512, 81.92, 0, Math.PI * 2);
	ctx.fillStyle = "#32363d";
	ctx.fill();
	ctx.beginPath();
	ctx.arc(512, 512, 56.32, 0, Math.PI * 2);
	ctx.fillStyle = "#1e2420";
	ctx.fill();
	for (const z of ZONES) {
		const s = z.size / 2 / 100 * 512;
		ctx.fillStyle = z.pad;
		ctx.globalAlpha = .85;
		ctx.fillRect(to(z.x) - s, to(z.z) - s, s * 2, s * 2);
	}
	ctx.globalAlpha = .18;
	ctx.strokeStyle = "#f3eee6";
	ctx.lineWidth = 1;
	for (let i = 0; i <= 20; i++) {
		const p = i / 20 * 1024;
		ctx.beginPath();
		ctx.moveTo(p, 0);
		ctx.lineTo(p, 1024);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, p);
		ctx.lineTo(1024, p);
		ctx.stroke();
	}
	ctx.globalAlpha = 1;
	const tex = new CanvasTexture(c);
	tex.anisotropy = 4;
	tex.colorSpace = SRGBColorSpace;
	tex.needsUpdate = true;
	tex.wrapS = ClampToEdgeWrapping;
	tex.wrapT = ClampToEdgeWrapping;
	return tex;
}
function Lighting() {
	const sun = (0, import_react.useRef)(null);
	const hemi = (0, import_react.useRef)(null);
	const { scene, gl } = useThree();
	const setFps = useDrive((s) => s.setFps);
	const quality = useDrive((s) => s.quality);
	useFrame((_, delta) => {
		const dt = Math.min(delta, .1);
		if (!isDriveBlocked()) stepDayNight(dt);
		const d = dayState;
		scene.background = d.sky;
		scene.fog = scene.fog ?? new Fog(d.fog, 40, 150);
		scene.fog.color.copy(d.fog);
		scene.fog.near = 28 + d.night * 10;
		scene.fog.far = 140 - d.night * 20;
		if (sun.current) {
			sun.current.position.set(d.sunX, Math.max(6, d.sunY), d.sunZ);
			sun.current.intensity = d.sunI;
		}
		if (hemi.current) hemi.current.intensity = d.ambI;
		const now = performance.now();
		if (!perfState.last) perfState.last = now;
		perfState.frames++;
		if (now - perfState.last >= 1e3) {
			perfState.fps = perfState.frames;
			perfState.frames = 0;
			perfState.last = now;
			setFps(perfState.fps);
			const cap = quality === "low" ? 1 : quality === "medium" ? 1.25 : 1.6;
			const next = perfState.fps < 32 ? 1 : Math.min(window.devicePixelRatio || 1, cap);
			if (Math.abs(next - perfState.dpr) > .05) {
				perfState.dpr = next;
				gl.setPixelRatio(next);
			}
			perfState.shadows = quality !== "low" && perfState.fps >= 28;
			if (sun.current) sun.current.castShadow = perfState.shadows;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", {
			ref: hemi,
			args: [
				"#d8e4ee",
				"#2a241c",
				.4
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			ref: sun,
			castShadow: true,
			intensity: 1.2,
			position: [
				40,
				55,
				18
			],
			"shadow-mapSize": quality === "high" ? [1024, 1024] : [512, 512],
			"shadow-camera-near": 1,
			"shadow-camera-far": 180,
			"shadow-camera-left": -50,
			"shadow-camera-right": 50,
			"shadow-camera-top": 50,
			"shadow-camera-bottom": -50
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .08 })
	] });
}
function Ground() {
	const tex = (0, import_react.useMemo)(() => makeGroundTexture(), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		rotation: [
			-Math.PI / 2,
			0,
			0
		],
		receiveShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [
			200,
			200,
			1,
			1
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			map: tex,
			roughness: .92,
			metalness: .04
		})]
	});
}
function Trees() {
	const quality = useDrive((s) => s.quality);
	const count = quality === "low" ? 36 : quality === "medium" ? 52 : 70;
	const pts = (0, import_react.useMemo)(() => scatter(count, 42, ZONES.map((z) => ({
		x: z.x,
		z: z.z,
		r: 22
	}))), [count]);
	const canopy = (0, import_react.useRef)(null);
	const trunk = (0, import_react.useRef)(null);
	(0, import_react.useLayoutEffect)(() => {
		const m = new Matrix4();
		const q = new Quaternion();
		const s = new Vector3();
		const p = new Vector3();
		pts.forEach((t, i) => {
			q.setFromEuler(new Euler(0, t.r, 0));
			p.set(t.x, 1.7 * t.s, t.z);
			s.set(t.s, t.s, t.s);
			m.compose(p, q, s);
			canopy.current?.setMatrixAt(i, m);
			p.set(t.x, .55 * t.s, t.z);
			s.set(t.s * .28, t.s, t.s * .28);
			m.compose(p, q, s);
			trunk.current?.setMatrixAt(i, m);
		});
		if (canopy.current) canopy.current.instanceMatrix.needsUpdate = true;
		if (trunk.current) trunk.current.instanceMatrix.needsUpdate = true;
	}, [pts]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("instancedMesh", {
		ref: trunk,
		args: [
			void 0,
			void 0,
			pts.length
		],
		castShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
			.18,
			.26,
			1.2,
			5
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#3a2a1c",
			roughness: .9
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("instancedMesh", {
		ref: canopy,
		args: [
			void 0,
			void 0,
			pts.length
		],
		castShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
			1.35,
			2.6,
			6
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#24382c",
			roughness: .85
		})]
	})] });
}
function lampSpots() {
	const list = [];
	for (let i = -70; i <= 70; i += 20) {
		if (Math.abs(i) < 14) continue;
		list.push([8.5, i], [-8.5, i], [i, 8.5], [i, -8.5]);
	}
	return list;
}
function Lamps() {
	const spots = (0, import_react.useMemo)(lampSpots, []);
	const pole = (0, import_react.useRef)(null);
	const glow = (0, import_react.useRef)(null);
	const mat = (0, import_react.useRef)(null);
	(0, import_react.useLayoutEffect)(() => {
		const m = new Matrix4();
		const q = new Quaternion();
		spots.forEach((s, i) => {
			m.compose(new Vector3(s[0], 1.4, s[1]), q, new Vector3(1, 1, 1));
			pole.current?.setMatrixAt(i, m);
			m.compose(new Vector3(s[0], 2.9, s[1]), q, new Vector3(1, 1, 1));
			glow.current?.setMatrixAt(i, m);
		});
		if (pole.current) pole.current.instanceMatrix.needsUpdate = true;
		if (glow.current) glow.current.instanceMatrix.needsUpdate = true;
	}, [spots]);
	useFrame(() => {
		if (mat.current) mat.current.emissiveIntensity = .15 + dayState.night * 2.4;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("instancedMesh", {
		ref: pole,
		args: [
			void 0,
			void 0,
			spots.length
		],
		castShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
			.07,
			.09,
			2.8,
			6
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#2a2d33",
			metalness: .5,
			roughness: .4
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("instancedMesh", {
		ref: glow,
		args: [
			void 0,
			void 0,
			spots.length
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			.16,
			8,
			8
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			ref: mat,
			color: "#f3eee6",
			emissive: "#f3eee6",
			emissiveIntensity: .4
		})]
	})] });
}
function Stars() {
	const ref = (0, import_react.useRef)(null);
	const geo = (0, import_react.useMemo)(() => {
		const g = new BufferGeometry();
		const n = 220;
		const a = /* @__PURE__ */ new Float32Array(660);
		const rnd = mulberry32(9);
		for (let i = 0; i < n; i++) {
			const u = rnd() * Math.PI * 2;
			const v = rnd() * .45 + .12;
			a[i * 3] = Math.cos(u) * Math.cos(v) * 120;
			a[i * 3 + 1] = Math.sin(v) * 80 + 18;
			a[i * 3 + 2] = Math.sin(u) * Math.cos(v) * 120;
		}
		g.setAttribute("position", new BufferAttribute(a, 3));
		return g;
	}, []);
	useFrame(() => {
		if (ref.current) {
			const mat = ref.current.material;
			mat.opacity = MathUtils.clamp(dayState.night * 1.2 - .15, 0, .9);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("points", {
		ref,
		geometry: geo,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointsMaterial", {
			color: "#f3eee6",
			size: .35,
			transparent: true,
			opacity: 0,
			depthWrite: false
		})
	});
}
function Label({ text, color }) {
	const tex = (0, import_react.useMemo)(() => {
		const c = document.createElement("canvas");
		c.width = 512;
		c.height = 128;
		const ctx = c.getContext("2d");
		ctx.clearRect(0, 0, 512, 128);
		ctx.fillStyle = color;
		ctx.font = "600 44px Outfit, Segoe UI, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(text.toUpperCase(), 256, 64);
		const t = new CanvasTexture(c);
		t.colorSpace = SRGBColorSpace;
		return t;
	}, [text, color]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: [
			0,
			4.2,
			0
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [10, 2.4] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			map: tex,
			transparent: true,
			depthWrite: false
		})]
	});
}
function Pavilion() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.15,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				8,
				.3,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#d8d2c8",
				roughness: .6
			})]
		}),
		[
			[
				-3.2,
				1.6,
				-3.2
			],
			[
				3.2,
				1.6,
				-3.2
			],
			[
				-3.2,
				1.6,
				3.2
			],
			[
				3.2,
				1.6,
				3.2
			]
		].map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: p,
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.22,
				3.2,
				.22
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#cfc8be",
				metalness: .7,
				roughness: .25
			})]
		}, i)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				3.3,
				0
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				8.4,
				.12,
				8.4
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#e8e2d6",
				metalness: .15,
				roughness: .4
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				1.7,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				7.4,
				2.8,
				7.4
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#9ec4d8",
				transparent: true,
				opacity: .22,
				metalness: .6,
				roughness: .08
			})]
		})
	] });
}
function Robot() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.2,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				1.4,
				1.6,
				.4,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#2a2428" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				1.3,
				0
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1.1,
				1.4,
				.8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#c9c4be",
				metalness: .5,
				roughness: .35
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				2.25,
				0
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.7,
				.55,
				.6
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#d8d4ce",
				metalness: .4,
				roughness: .3
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				2.3,
				.32
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.12,
				8,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#e25b4c",
				emissive: "#e25b4c",
				emissiveIntensity: 1.4
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				2.7,
				0
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.05,
				.05,
				.5,
				6
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#8b93a1",
				metalness: .8
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-.8,
				1.4,
				0
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.28,
				1.1,
				.28
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#b8b3ad" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				.8,
				1.4,
				0
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.28,
				1.1,
				.28
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#b8b3ad" })]
		})
	] });
}
function HoverBike() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.08,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				2.2,
				2.4,
				.16,
				16
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#2a3128" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				1.15,
				0
			],
			rotation: [
				.15,
				0,
				0
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.7,
				.28,
				2.4
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#7eae6e",
				metalness: .45,
				roughness: .3
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				1.45,
				.2
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.5,
				.22,
				.8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#1a1c20" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.85,
				-.9
			],
			rotation: [
				Math.PI / 2,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
				.38,
				.08,
				8,
				16
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#8b93a1",
				metalness: .7,
				emissive: "#7eae6e",
				emissiveIntensity: .4
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.85,
				.9
			],
			rotation: [
				Math.PI / 2,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
				.38,
				.08,
				8,
				16
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#8b93a1",
				metalness: .7,
				emissive: "#7eae6e",
				emissiveIntensity: .4
			})]
		})
	] });
}
function LampProduct() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.15,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				2.2,
				.3,
				2.2
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#3a2e1c" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				1.1,
				0
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.12,
				.16,
				1.6,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#cfc8be",
				metalness: .6,
				roughness: .3
			})]
		}),
		[
			0,
			1,
			2
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				1.7 + i * .28,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
				.55 - i * .08,
				.07,
				8,
				20
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#e8c078",
				metalness: .4,
				roughness: .35
			})]
		}, i)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				1.85,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.18,
				10,
				10
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#f3eee6",
				emissive: "#f3eee6",
				emissiveIntensity: 1.1
			})]
		})
	] });
}
function MiniHouse({ color }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: [
			0,
			.45,
			0
		],
		castShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			1.4,
			.9,
			1.1
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#d8d2c8",
			roughness: .55
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: [
			0,
			1.05,
			0
		],
		rotation: [
			0,
			Math.PI / 4,
			0
		],
		castShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
			1.05,
			.7,
			4
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color,
			metalness: .2,
			roughness: .4
		})]
	})] });
}
function MiniBust({ color }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: [
			0,
			.25,
			0
		],
		castShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
			.35,
			.45,
			.5,
			8
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#c9c4be" })]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: [
			0,
			.85,
			0
		],
		castShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			.32,
			10,
			10
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color,
			metalness: .2,
			roughness: .4
		})]
	})] });
}
function MiniWheel({ color }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		rotation: [
			0,
			0,
			Math.PI / 2
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
				.55,
				.12,
				8,
				18
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#1a1c20",
				metalness: .4
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
			.18,
			.18,
			.16,
			8
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color,
			metalness: .6,
			roughness: .3
		})] })]
	});
}
function MiniObject({ color }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: [
			0,
			.45,
			0
		],
		castShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
			.28,
			.34,
			.9,
			10
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#cfc8be",
			metalness: .5,
			roughness: .3
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: [
			0,
			.95,
			0
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			.22,
			10,
			10
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color,
			emissive: color,
			emissiveIntensity: .45
		})]
	})] });
}
var SHOW = {
	architecture: Pavilion,
	characters: Robot,
	vehicles: HoverBike,
	products: LampProduct
};
var MINI = {
	architecture: (c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniHouse, { color: c }),
	characters: (c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniBust, { color: c }),
	vehicles: (c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniWheel, { color: c }),
	products: (c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniObject, { color: c })
};
function Landmarks() {
	const lang = useDrive((s) => s.lang);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		ZONES.map((z) => {
			const Piece = SHOW[z.id];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				position: [
					z.x,
					0,
					z.z
				],
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						rotation: [
							-Math.PI / 2,
							0,
							0
						],
						position: [
							0,
							.04,
							0
						],
						receiveShadow: true,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [7.5, 24] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
							color: z.pad,
							roughness: .8
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Piece, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						text: z.name[lang],
						color: z.color
					})
				]
			}, z.id);
		}),
		PROJECTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
			position: [
				p.x + 2.4,
				0,
				p.z - 1.6
			],
			children: MINI[p.zone](p.color)
		}, p.id)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.06,
				0
			],
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
				11,
				15.5,
				48
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#3a3e46",
				roughness: .85
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.4,
				0
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				2.2,
				.8,
				2.2
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#e25b4c",
				metalness: .3,
				roughness: .4
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				1.05,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("octahedronGeometry", { args: [.55, 0] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#f3eee6",
				emissive: "#e25b4c",
				emissiveIntensity: .35,
				metalness: .4
			})]
		})
	] });
}
function Sparkle({ color, active }) {
	const ref = (0, import_react.useRef)(null);
	const geo = (0, import_react.useMemo)(() => {
		const g = new BufferGeometry();
		const n = 18;
		const a = /* @__PURE__ */ new Float32Array(54);
		for (let i = 0; i < n; i++) {
			const u = i / n * Math.PI * 2;
			a[i * 3] = Math.cos(u) * .9;
			a[i * 3 + 1] = i % 5 * .15;
			a[i * 3 + 2] = Math.sin(u) * .9;
		}
		g.setAttribute("position", new BufferAttribute(a, 3));
		return g;
	}, []);
	useFrame((state) => {
		if (!ref.current || !active) return;
		ref.current.rotation.y = state.clock.elapsedTime * .8;
		const t = state.clock.elapsedTime;
		const arr = ref.current.geometry.getAttribute("position").array;
		for (let i = 0; i < arr.length; i += 3) arr[i + 1] = .4 + Math.sin(t * 2 + i) * .35;
		ref.current.geometry.attributes.position.needsUpdate = true;
	});
	if (!active) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("points", {
		ref,
		geometry: geo,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointsMaterial", {
			color,
			size: .12,
			transparent: true,
			opacity: .85,
			depthWrite: false
		})
	});
}
function Crystal({ id, x, z, color }) {
	const mesh = (0, import_react.useRef)(null);
	const collected = useDrive((s) => s.collected.includes(id));
	const collect = useDrive((s) => s.collect);
	const started = useDrive((s) => s.started);
	const taken = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!collected) taken.current = false;
	}, [collected]);
	useFrame((state) => {
		if (taken.current || collected) return;
		const m = mesh.current;
		if (!m) return;
		const t = state.clock.elapsedTime;
		m.rotation.y = t * 1.4;
		m.position.y = 1.35 + Math.sin(t * 2.2 + x) * .22;
		const pulse = .85 + Math.sin(t * 4) * .4;
		m.material.emissiveIntensity = pulse;
		if (!started || isDriveBlocked()) return;
		const dx = sim.x - x;
		const dz = sim.z - z;
		if (dx * dx + dz * dz < 3.2 * 3.2) {
			taken.current = true;
			playCollect();
			collect(id);
		}
	});
	if (collected) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			x,
			0,
			z
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.15,
					0
				],
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.55,
					.7,
					.3,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#2a2d33",
					roughness: .7
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				ref: mesh,
				position: [
					0,
					1.35,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("octahedronGeometry", { args: [.62, 0] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color,
					emissive: color,
					emissiveIntensity: 1,
					metalness: .25,
					roughness: .2,
					transparent: true,
					opacity: .95
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkle, {
				color,
				active: !collected
			})
		]
	});
}
function Collectibles() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: PROJECTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crystal, {
		id: p.id,
		x: p.x,
		z: p.z,
		color: p.color
	}, p.id)) });
}
function Weather() {
	const rainRef = (0, import_react.useRef)(null);
	const snowRef = (0, import_react.useRef)(null);
	const mode = useDrive((s) => s.weather);
	const rain = (0, import_react.useMemo)(() => {
		const g = new BufferGeometry();
		const n = 280;
		const a = new Float32Array(n * 3);
		for (let i = 0; i < n; i++) {
			a[i * 3] = (Math.random() - .5) * 40;
			a[i * 3 + 1] = Math.random() * 14;
			a[i * 3 + 2] = (Math.random() - .5) * 40;
		}
		g.setAttribute("position", new BufferAttribute(a, 3));
		return g;
	}, []);
	const snow = (0, import_react.useMemo)(() => {
		const g = new BufferGeometry();
		const n = 180;
		const a = /* @__PURE__ */ new Float32Array(540);
		for (let i = 0; i < n; i++) {
			a[i * 3] = (Math.random() - .5) * 40;
			a[i * 3 + 1] = Math.random() * 12;
			a[i * 3 + 2] = (Math.random() - .5) * 40;
		}
		g.setAttribute("position", new BufferAttribute(a, 3));
		return g;
	}, []);
	useFrame((_, delta) => {
		const dt = Math.min(delta, .1);
		const zone = zoneAt(sim.x, sim.z);
		let rainOn = mode === "rain";
		let snowOn = mode === "snow";
		if (mode === "auto") {
			rainOn = zone === "vehicles" && dayState.night > .35;
			snowOn = zone === "characters" && dayState.night > .2;
		}
		if (rainRef.current) {
			rainRef.current.visible = rainOn;
			rainRef.current.position.set(sim.x, 0, sim.z);
			if (rainOn) {
				const arr = rainRef.current.geometry.getAttribute("position").array;
				for (let i = 0; i < arr.length; i += 3) {
					arr[i + 1] -= dt * 14;
					if (arr[i + 1] < 0) arr[i + 1] = 12;
				}
				rainRef.current.geometry.attributes.position.needsUpdate = true;
			}
		}
		if (snowRef.current) {
			snowRef.current.visible = snowOn;
			snowRef.current.position.set(sim.x, 0, sim.z);
			if (snowOn) {
				const arr = snowRef.current.geometry.getAttribute("position").array;
				for (let i = 0; i < arr.length; i += 3) {
					arr[i + 1] -= dt * 2.2;
					arr[i] += Math.sin(arr[i + 1]) * dt * .4;
					if (arr[i + 1] < 0) arr[i + 1] = 11;
				}
				snowRef.current.geometry.attributes.position.needsUpdate = true;
			}
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("points", {
		ref: rainRef,
		geometry: rain,
		visible: false,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointsMaterial", {
			color: "#c8d4de",
			size: .08,
			transparent: true,
			opacity: .55,
			depthWrite: false
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("points", {
		ref: snowRef,
		geometry: snow,
		visible: false,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointsMaterial", {
			color: "#f3eee6",
			size: .14,
			transparent: true,
			opacity: .8,
			depthWrite: false
		})
	})] });
}
var held = /* @__PURE__ */ new Set();
var injected = null;
var steerOverride = null;
var touchX = 0;
var touchY = 0;
var touchOn = false;
var touchBrake = 0;
var gamepadSteer = 0;
var gamepadThrottle = 0;
var gamepadBrake = 0;
var attached = false;
var locked = false;
function clamp(v, a, b) {
	return Math.max(a, Math.min(b, v));
}
function onKey(e, down) {
	if (down && [
		"ArrowUp",
		"ArrowDown",
		"ArrowLeft",
		"ArrowRight",
		"Space"
	].includes(e.code)) e.preventDefault();
	if (down) held.add(e.code);
	else held.delete(e.code);
}
function onBlur() {
	held.clear();
	touchBrake = 0;
}
function attachInput() {
	if (attached || typeof window === "undefined") return () => {};
	attached = true;
	const kd = (e) => onKey(e, true);
	const ku = (e) => onKey(e, false);
	window.addEventListener("keydown", kd, { passive: false });
	window.addEventListener("keyup", ku);
	window.addEventListener("blur", onBlur);
	document.addEventListener("visibilitychange", onBlur);
	return () => {
		attached = false;
		window.removeEventListener("keydown", kd);
		window.removeEventListener("keyup", ku);
		window.removeEventListener("blur", onBlur);
		document.removeEventListener("visibilitychange", onBlur);
		held.clear();
	};
}
function setInputLocked(v) {
	locked = v;
	if (v) {
		held.clear();
		touchOn = false;
		touchBrake = 0;
	}
}
function setTouch(x, y, active) {
	touchOn = active;
	touchX = active ? clamp(x, -1, 1) : 0;
	touchY = active ? clamp(y, -1, 1) : 0;
}
function setTouchBrake(v) {
	touchBrake = v ? 1 : 0;
}
function radial(x, y, dz = .18) {
	const m = Math.hypot(x, y);
	if (m < dz) return {
		x: 0,
		y: 0
	};
	const scale = (m - dz) / (1 - dz) / m;
	return {
		x: x * scale,
		y: y * scale
	};
}
function pollGamepad() {
	const pad = (typeof navigator !== "undefined" ? navigator.getGamepads?.() : null)?.[0];
	if (!pad) {
		gamepadSteer = 0;
		gamepadThrottle = 0;
		gamepadBrake = 0;
		return;
	}
	const stick = radial(pad.axes[0] ?? 0, pad.axes[1] ?? 0);
	gamepadSteer = -stick.x;
	gamepadThrottle = 0;
	if (stick.y < 0) gamepadThrottle += -stick.y;
	if (stick.y > 0) gamepadThrottle -= stick.y;
	const rt = pad.buttons[7]?.value ?? 0;
	const lt = pad.buttons[6]?.value ?? 0;
	if (rt > .1) gamepadThrottle = Math.max(gamepadThrottle, rt);
	if (lt > .1) gamepadThrottle = Math.min(gamepadThrottle, -lt);
	if (pad.buttons[0]?.pressed) gamepadThrottle = Math.max(gamepadThrottle, 1);
	gamepadBrake = pad.buttons[1]?.pressed ? 1 : 0;
	if (pad.buttons[9]?.pressed) gamepadBrake = 1;
}
function fromSet(set) {
	let steer = 0;
	if (set.has("KeyA") || set.has("ArrowLeft")) steer += 1;
	if (set.has("KeyD") || set.has("ArrowRight")) steer -= 1;
	let throttle = 0;
	if (set.has("KeyW") || set.has("ArrowUp")) throttle += 1;
	if (set.has("KeyS") || set.has("ArrowDown")) throttle -= 1;
	const brake = set.has("Space") || set.has("ShiftLeft") || set.has("ShiftRight") ? 1 : 0;
	return {
		steer: clamp(steer, -1, 1),
		throttle: clamp(throttle, -1, 1),
		brake
	};
}
function readAxes() {
	if (locked) return {
		steer: 0,
		throttle: 0,
		brake: 0
	};
	if (injected) {
		const a = fromSet(injected);
		if (steerOverride != null) a.steer = clamp(steerOverride, -1, 1);
		return a;
	}
	const keys = fromSet(held);
	let steer = keys.steer;
	let throttle = keys.throttle;
	let brake = Math.max(keys.brake, touchBrake, gamepadBrake);
	if (touchOn) {
		steer += -touchX;
		throttle += touchY;
	}
	steer += gamepadSteer;
	throttle += gamepadThrottle;
	if (steerOverride != null) steer = steerOverride;
	return {
		steer: clamp(steer, -1, 1),
		throttle: clamp(throttle, -1, 1),
		brake
	};
}
function installControlsTest(getYaw, getSpeed) {
	if (typeof window === "undefined") return;
	window.__controlsTest = {
		getYaw,
		getSpeed,
		setSteer: (v) => {
			steerOverride = v;
		},
		setKeys: (codes) => {
			injected = codes.length ? new Set(codes) : null;
			if (!codes.length) steerOverride = null;
		}
	};
}
function installQA() {
	if (typeof window === "undefined") return;
	window.__driveQA = {
		getSim: () => ({
			x: sim.x,
			z: sim.z,
			yaw: sim.yaw,
			speed: sim.speed,
			steer: sim.steer
		}),
		getStore: () => {
			const s = useDrive.getState();
			return {
				started: s.started,
				muted: s.muted,
				collected: s.collected,
				activeId: s.activeId,
				zoneId: s.zoneId,
				weather: s.weather,
				lang: s.lang,
				quality: s.quality,
				overlay: s.overlay,
				waypoint: s.waypoint,
				fps: s.fps
			};
		},
		getAudio: getAudioDebug,
		getDay: () => ({
			time: dayState.time,
			night: dayState.night,
			paused: dayState.paused
		}),
		teleport: (x, z, yaw) => teleport(x, z, yaw),
		start: () => {
			unlockAudio();
			startAudio();
			useDrive.getState().start();
			window.__driveReady = true;
		},
		collect: (id) => useDrive.getState().collect(id),
		collectAll: () => {
			for (const p of PROJECTS) {
				const s = useDrive.getState();
				if (!s.collected.includes(p.id)) s.collect(p.id);
			}
			useDrive.getState().closeModal();
		},
		openProject: (id) => useDrive.getState().openProject(id),
		closeAll: () => {
			useDrive.getState().closeModal();
			useDrive.getState().setOverlay("none");
		},
		setWeather: (w) => useDrive.getState().setWeather(w),
		setLang: (lang) => useDrive.getState().setLang(lang),
		setQuality: (q) => useDrive.getState().setQuality(q),
		setMuted: (v) => {
			setMuted(v);
			useDrive.getState().setMuted(v);
		},
		setDayTime: (t) => setDayTime(t),
		setDayPaused: (v) => setDayPaused(v),
		setOverlay: (o) => useDrive.getState().setOverlay(o),
		setWaypoint: (id) => {
			const p = PROJECTS.find((x) => x.id === id);
			if (p) useDrive.getState().setWaypoint({
				x: p.x,
				z: p.z,
				id: p.id
			});
		},
		reset: () => useDrive.getState().resetProgress(),
		zoneAt: (x, z) => zoneAt(x, z),
		projects: PROJECTS.map((p) => ({
			id: p.id,
			x: p.x,
			z: p.z,
			zone: p.zone
		}))
	};
}
var MAX_SPEED = 16;
var ACCEL = 22;
var REVERSE = 12;
var DRAG = 2.4;
var TURN = 2.55;
function Car() {
	const group = (0, import_react.useRef)(null);
	const wheels = (0, import_react.useRef)([]);
	const lightL = (0, import_react.useRef)(null);
	const lightR = (0, import_react.useRef)(null);
	const targetL = (0, import_react.useRef)(null);
	const targetR = (0, import_react.useRef)(null);
	const started = useDrive((s) => s.started);
	const setSpeedKmh = useDrive((s) => s.setSpeedKmh);
	const tmp = (0, import_react.useRef)({
		cam: new Vector3(),
		look: new Vector3(),
		desired: new Vector3()
	});
	(0, import_react.useEffect)(() => {
		const detach = attachInput();
		installControlsTest(() => sim.yaw, () => sim.speed);
		installQA();
		return detach;
	}, []);
	(0, import_react.useLayoutEffect)(() => {
		if (lightL.current && targetL.current) lightL.current.target = targetL.current;
		if (lightR.current && targetR.current) lightR.current.target = targetR.current;
	}, []);
	useFrame((state, delta) => {
		const dt = Math.min(delta, .1);
		const g = group.current;
		if (!g) return;
		const blocked = isDriveBlocked();
		if (!started) {
			g.position.set(sim.x, sim.y, sim.z);
			g.rotation.y = sim.yaw;
			const t = state.clock.elapsedTime * .12;
			state.camera.position.lerp(tmp.current.desired.set(Math.sin(t) * 16, 7.5, Math.cos(t) * 16), 1 - Math.exp(-2.2 * dt));
			state.camera.lookAt(0, .6, 0);
			return;
		}
		if (!blocked) {
			pollGamepad();
			const { steer, throttle, brake } = readAxes();
			sim.steer = MathUtils.damp(sim.steer, steer, 10, dt);
			if (brake) sim.speed *= Math.pow(.18, dt);
			else if (throttle > 0) sim.speed += ACCEL * throttle * dt;
			else if (throttle < 0) sim.speed += REVERSE * throttle * dt;
			else sim.speed *= Math.pow(.22, dt);
			const road = onPavement(sim.x, sim.z);
			const drag = DRAG * (road ? 1 : 2.6) * dt * Math.sign(sim.speed) * Math.min(1, Math.abs(sim.speed));
			sim.speed -= drag;
			sim.speed = MathUtils.clamp(sim.speed, -8.8, MAX_SPEED * (road ? 1 : .62));
			const speedFactor = MathUtils.clamp(Math.abs(sim.speed) / 5, .28, 1);
			const reverse = sim.speed >= 0 ? 1 : -1;
			sim.yaw += sim.steer * TURN * speedFactor * reverse * dt;
			sim.lateral += sim.steer * sim.speed * .35 * dt;
			sim.lateral *= Math.exp(-7.5 * (road ? 1 : .55) * dt);
			const fx = -Math.sin(sim.yaw);
			const fz = -Math.cos(sim.yaw);
			const rx = Math.cos(sim.yaw);
			const rz = -Math.sin(sim.yaw);
			sim.x += (fx * sim.speed + rx * sim.lateral) * dt;
			sim.z += (fz * sim.speed + rz * sim.lateral) * dt;
			sim.x = MathUtils.clamp(sim.x, -94, 94);
			sim.z = MathUtils.clamp(sim.z, -94, 94);
			resolveColliders();
			sim.roll = MathUtils.damp(sim.roll, sim.steer * .14 * speedFactor, 8, dt);
			sim.wheel += sim.speed * dt * 2.4;
			setEngine(sim.speed);
			setSpeedKmh(Math.abs(sim.speed) * 7.2);
		} else {
			sim.speed *= Math.pow(.02, dt);
			setEngine(0);
		}
		g.position.set(sim.x, sim.y, sim.z);
		g.rotation.order = "YZX";
		g.rotation.y = sim.yaw;
		g.rotation.z = sim.roll;
		for (let i = 0; i < wheels.current.length; i++) {
			const w = wheels.current[i];
			if (!w) continue;
			w.rotation.x = sim.wheel;
			if (i < 2) w.parent.rotation.y = sim.steer * .42;
		}
		const fx = -Math.sin(sim.yaw);
		const fz = -Math.cos(sim.yaw);
		const follow = 8.6;
		const height = 4.4;
		const { desired, look, cam } = tmp.current;
		desired.set(sim.x - fx * follow, sim.y + height, sim.z - fz * follow);
		look.set(sim.x + fx * 5.5, sim.y + .85, sim.z + fz * 5.5);
		cam.copy(state.camera.position);
		cam.lerp(desired, 1 - Math.exp(-3.4 * dt));
		state.camera.position.copy(cam);
		state.camera.lookAt(look);
		const cam3 = state.camera;
		const targetFov = 50 + Math.min(9, Math.abs(sim.speed) * .5);
		cam3.fov = MathUtils.damp(cam3.fov, targetFov, 4, dt);
		cam3.updateProjectionMatrix();
		const hi = dayState.night * 6.5;
		if (lightL.current) lightL.current.intensity = hi;
		if (lightR.current) lightR.current.intensity = hi;
	});
	const night = dayState.night;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: group,
		position: [
			sim.x,
			sim.y,
			sim.z
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				castShadow: true,
				position: [
					0,
					.28,
					-.12
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1.28,
					.36,
					2.28
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#e25b4c",
					metalness: .35,
					roughness: .38
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				castShadow: true,
				position: [
					0,
					.52,
					.18
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1.08,
					.34,
					1.12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#1a1c20",
					metalness: .2,
					roughness: .25
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.58,
					.16
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.98,
					.22,
					.92
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#8fb4c8",
					metalness: .7,
					roughness: .12,
					transparent: true,
					opacity: .45
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.22,
					-1.22
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1.18,
					.12,
					.12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#cfc8be",
					metalness: .8,
					roughness: .2
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.42,
					.28,
					-1.18
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.18,
					.1,
					.08
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#f4efe6",
					emissive: "#f4efe6",
					emissiveIntensity: .4 + night * 2.2
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.42,
					.28,
					-1.18
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.18,
					.1,
					.08
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#f4efe6",
					emissive: "#f4efe6",
					emissiveIntensity: .4 + night * 2.2
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.4,
					.3,
					1.08
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.22,
					.08,
					.06
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#e25b4c",
					emissive: "#e25b4c",
					emissiveIntensity: .3 + night * 1.6
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.4,
					.3,
					1.08
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.22,
					.08,
					.06
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#e25b4c",
					emissive: "#e25b4c",
					emissiveIntensity: .3 + night * 1.6
				})]
			}),
			[
				[
					-.58,
					.18,
					-.72
				],
				[
					.58,
					.18,
					-.72
				],
				[
					-.58,
					.18,
					.78
				],
				[
					.58,
					.18,
					.78
				]
			].map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
				position: [
					p[0],
					p[1],
					p[2]
				],
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
					ref: (el) => {
						if (el) wheels.current[i] = el;
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						rotation: [
							0,
							0,
							Math.PI / 2
						],
						castShadow: true,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
							.22,
							.22,
							.16,
							10
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
							color: "#141416",
							roughness: .7
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						rotation: [
							0,
							0,
							Math.PI / 2
						],
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
							.1,
							.1,
							.17,
							8
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
							color: "#cfc8be",
							metalness: .7,
							roughness: .25
						})]
					})]
				})
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				rotation: [
					-Math.PI / 2,
					0,
					0
				],
				position: [
					0,
					.02,
					0
				],
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [1.3, 12] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					color: "#000000",
					transparent: true,
					opacity: .28
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("object3D", {
				ref: targetL,
				position: [
					-.42,
					.1,
					-10
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("object3D", {
				ref: targetR,
				position: [
					.42,
					.1,
					-10
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("spotLight", {
				ref: lightL,
				position: [
					-.42,
					.42,
					-1.15
				],
				angle: .42,
				penumbra: .55,
				distance: 26,
				color: "#fff4e4",
				intensity: 0,
				castShadow: false
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("spotLight", {
				ref: lightR,
				position: [
					.42,
					.42,
					-1.15
				],
				angle: .42,
				penumbra: .55,
				distance: 26,
				color: "#fff4e4",
				intensity: 0,
				castShadow: false
			})
		]
	});
}
function Waypoint() {
	const ref = (0, import_react.useRef)(null);
	const beam = (0, import_react.useRef)(null);
	const waypoint = useDrive((s) => s.waypoint);
	const clear = useDrive((s) => s.setWaypoint);
	useFrame((state) => {
		const g = ref.current;
		if (!g || !waypoint) return;
		const t = state.clock.elapsedTime;
		g.position.set(waypoint.x, 0, waypoint.z);
		if (beam.current) beam.current.position.y = 4 + Math.sin(t * 2) * .35;
		const dx = sim.x - waypoint.x;
		const dz = sim.z - waypoint.z;
		if (dx * dx + dz * dz < 16) clear(null);
	});
	if (!waypoint) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref,
		position: [
			waypoint.x,
			0,
			waypoint.z
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				0,
				.08,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
				1.1,
				1.45,
				24
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "#e25b4c",
				transparent: true,
				opacity: .85
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			ref: beam,
			position: [
				0,
				4,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.06,
				.18,
				8,
				6
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "#e25b4c",
				transparent: true,
				opacity: .35
			})]
		})]
	});
}
function Systems() {
	const setZone = useDrive((s) => s.setZone);
	const started = useDrive((s) => s.started);
	const blocked = useDrive((s) => Boolean(s.activeId) || s.overlay !== "none");
	useFrame(() => {
		setInputLocked(blocked || !started);
		if (!started || isDriveBlocked()) return;
		const z = zoneAt(sim.x, sim.z);
		setZone(z);
		setZoneBed(z);
	});
	return null;
}
function Experience() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lighting, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ground, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trees, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lamps, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmarks, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collectibles, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Weather, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Waypoint, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Car, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Systems, {})
	] });
}
var COPY = {
	en: {
		kicker: "Godzfath3r · Phitsanulok",
		title: "Atelier Drive",
		tagline: "A 3D design grounds you can drive. Four zones, twelve hidden crystals. Collect a piece to open it — or browse the archive.",
		loading: "Loading the grounds…",
		start: "Start driving",
		browse: "Browse works",
		audioHint: "Audio unlocks on start",
		w: "W / ↑ accelerate",
		s: "S / ↓ reverse",
		a: "A / ← turn left",
		d: "D / → turn right",
		space: "Space brake",
		stick: "Stick · gamepad",
		plaza: "Plaza",
		mute: "Mute",
		unmute: "Unmute",
		works: "Works",
		settings: "Settings",
		pause: "Pause",
		resume: "Resume",
		fps: "fps",
		collected: "Crystal collected",
		close: "Close",
		driveThere: "Drive there",
		allZones: "All",
		language: "Language",
		weather: "Weather",
		quality: "Quality",
		dayNight: "Day / night",
		playCycle: "Play cycle",
		freezeCycle: "Freeze",
		reset: "Reset collection",
		resetHint: "Clears found crystals on this device.",
		qualityHigh: "High",
		qualityMedium: "Medium",
		qualityLow: "Low",
		weatherAuto: "auto",
		weatherClear: "clear",
		weatherRain: "rain",
		weatherSnow: "snow",
		completeTitle: "The grounds are yours",
		completeBody: "Twelve crystals. Four rooms. The archive is complete — keep driving, or open any work from the catalog.",
		completeCta: "Keep driving",
		pausedTitle: "Paused",
		pausedBody: "Esc resume · C works · M mute",
		nearest: "Nearest",
		hint: "WASD · arrows · space · C works · Esc pause",
		year: "Year",
		medium: "Medium",
		related: "In this zone",
		found: "Found",
		hidden: "Hidden"
	},
	th: {
		kicker: "Godzfath3r · พิษณุโลก",
		title: "Atelier Drive",
		tagline: "ลานออกแบบสามมิติที่ขับได้จริง สี่โซน สิบสองคริสตัล เก็บชิ้นงานเพื่อเปิดรายละเอียด — หรือเปิดคลังจากรายการ",
		loading: "กำลังจัดลาน…",
		start: "เริ่มขับ",
		browse: "ดูผลงาน",
		audioHint: "เสียงปลดล็อกเมื่อเริ่ม",
		w: "W / ↑ เร่ง",
		s: "S / ↓ ถอย",
		a: "A / ← เลี้ยวซ้าย",
		d: "D / → เลี้ยวขวา",
		space: "Space เบรก",
		stick: "สติ๊ก · เกมแพด",
		plaza: "ลานกลาง",
		mute: "ปิดเสียง",
		unmute: "เปิดเสียง",
		works: "ผลงาน",
		settings: "ตั้งค่า",
		pause: "หยุด",
		resume: "ขับต่อ",
		fps: "เฟรม",
		collected: "เก็บคริสตัลแล้ว",
		close: "ปิด",
		driveThere: "ขับไปที่นั่น",
		allZones: "ทั้งหมด",
		language: "ภาษา",
		weather: "อากาศ",
		quality: "คุณภาพ",
		dayNight: "กลางวัน / คืน",
		playCycle: "หมุนเวลา",
		freezeCycle: "หยุดเวลา",
		reset: "รีเซ็ตของที่เก็บ",
		resetHint: "ลบคริสตัลที่เก็บในเครื่องนี้",
		qualityHigh: "สูง",
		qualityMedium: "กลาง",
		qualityLow: "ต่ำ",
		weatherAuto: "อัตโนมัติ",
		weatherClear: "แจ่ม",
		weatherRain: "ฝน",
		weatherSnow: "หิมะ",
		completeTitle: "ครบทั้งลานแล้ว",
		completeBody: "สิบสองคริสตัล สี่ห้อง คลังครบ — ขับต่อได้ หรือเปิดงานจากรายการ",
		completeCta: "ขับต่อ",
		pausedTitle: "หยุดชั่วคราว",
		pausedBody: "Esc ขับต่อ · C ผลงาน · M เสียง",
		nearest: "ใกล้สุด",
		hint: "WASD · ลูกศร · สเปซ · C ผลงาน · Esc หยุด",
		year: "ปี",
		medium: "สื่อ",
		related: "ในโซนนี้",
		found: "พบแล้ว",
		hidden: "ยังไม่พบ"
	}
};
function StartScreen() {
	const start = useDrive((s) => s.start);
	const setOverlay = useDrive((s) => s.setOverlay);
	const lang = useDrive((s) => s.lang);
	const setLang = useDrive((s) => s.setLang);
	const c = COPY[lang];
	const onStart = () => {
		unlockAudio();
		startAudio();
		start();
		if (typeof window !== "undefined") window.__driveReady = true;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-0 z-20 flex items-end justify-center p-5 sm:items-center sm:p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overlay-panel pointer-events-auto w-full max-w-lg px-6 py-7 sm:px-9 sm:py-9",
			style: { borderRadius: "var(--radius-sheet)" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted text-[11px] font-medium tracking-[0.28em] uppercase",
						children: c.kicker
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "ghost-btn !min-h-8 !px-3 text-[11px] tracking-[0.14em] uppercase",
						onClick: () => setLang(lang === "en" ? "th" : "en"),
						"aria-label": c.language,
						children: lang === "en" ? "TH" : "EN"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-fg font-display mb-2 text-5xl leading-[0.95] tracking-tight sm:text-6xl",
					children: c.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted mb-6 max-w-sm text-sm leading-relaxed",
					children: c.tagline
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "text-muted mb-7 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: c.w }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: c.s }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: c.a }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: c.d }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: c.space }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: c.stick })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "primary-btn",
						onClick: onStart,
						children: c.start
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "ghost-btn",
						onClick: () => {
							unlockAudio();
							startAudio();
							setOverlay("catalog");
						},
						children: c.browse
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-faint mt-4 flex items-center gap-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
						className: "size-3.5 shrink-0",
						strokeWidth: 1.75
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.audioHint })]
				})
			]
		})
	});
}
function Minimap({ interactive = false }) {
	const ref = (0, import_react.useRef)(null);
	const collected = useDrive((s) => s.collected);
	const waypoint = useDrive((s) => s.waypoint);
	const setWaypoint = useDrive((s) => s.setWaypoint);
	(0, import_react.useEffect)(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		let raf = 0;
		const size = 128;
		canvas.width = 256;
		canvas.height = 256;
		const map = (n) => (n + 100) / 200 * size * 2;
		const tick = () => {
			ctx.clearRect(0, 0, 256, 256);
			ctx.fillStyle = "#0b0d10";
			ctx.fillRect(0, 0, 256, 256);
			for (const z of ZONES) {
				ctx.fillStyle = z.pad;
				const s = z.size / 200 * size * 2;
				ctx.fillRect(map(z.x) - s / 2, map(z.z) - s / 2, s, s);
			}
			ctx.strokeStyle = "rgba(243,238,230,0.16)";
			ctx.strokeRect(map(-8), 0, map(8) - map(-8), 256);
			ctx.strokeRect(0, map(-8), 256, map(8) - map(-8));
			for (const p of PROJECTS) {
				if (collected.includes(p.id)) continue;
				ctx.fillStyle = p.color;
				ctx.beginPath();
				ctx.arc(map(p.x), map(p.z), 3.5, 0, Math.PI * 2);
				ctx.fill();
			}
			if (waypoint) {
				ctx.strokeStyle = "#e25b4c";
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.arc(map(waypoint.x), map(waypoint.z), 7, 0, Math.PI * 2);
				ctx.stroke();
			}
			const x = map(sim.x);
			const z = map(sim.z);
			ctx.save();
			ctx.translate(x, z);
			ctx.rotate(-sim.yaw);
			ctx.fillStyle = "#e25b4c";
			ctx.beginPath();
			ctx.moveTo(0, -7);
			ctx.lineTo(5, 6);
			ctx.lineTo(-5, 6);
			ctx.closePath();
			ctx.fill();
			ctx.restore();
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [collected, waypoint]);
	const onClick = (e) => {
		if (!interactive) return;
		const canvas = ref.current;
		if (!canvas) return;
		const r = canvas.getBoundingClientRect();
		const nx = (e.clientX - r.left) / r.width * 200 - 100;
		const nz = (e.clientY - r.top) / r.height * 200 - 100;
		let best = PROJECTS[0];
		let bestD = Infinity;
		for (const p of PROJECTS) {
			const d = Math.hypot(p.x - nx, p.z - nz);
			if (d < bestD) {
				bestD = d;
				best = p;
			}
		}
		setWaypoint({
			x: best.x,
			z: best.z,
			id: best.id
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		width: 256,
		height: 256,
		onClick,
		className: interactive ? "cursor-pointer" : "pointer-events-none",
		style: {
			width: 112,
			height: 112,
			borderRadius: 12,
			border: "1px solid color-mix(in oklab, var(--color-fg) 14%, transparent)",
			background: "var(--color-bg)"
		},
		"aria-hidden": true
	});
}
function HUD() {
	const collected = useDrive((s) => s.collected);
	const fps = useDrive((s) => s.fps);
	const muted = useDrive((s) => s.muted);
	const setMuted = useDrive((s) => s.setMuted);
	const zoneId = useDrive((s) => s.zoneId);
	const weather = useDrive((s) => s.weather);
	const cycleWeather = useDrive((s) => s.cycleWeather);
	const lang = useDrive((s) => s.lang);
	const toggleOverlay = useDrive((s) => s.toggleOverlay);
	const speedKmh = useDrive((s) => s.speedKmh);
	const zone = zoneId ? ZONE_BY_ID[zoneId] : null;
	const c = COPY[lang];
	const [hint, setHint] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const tick = () => {
			const n = nearestProject(sim.x, sim.z, collected);
			if (!n) {
				setHint("");
				return;
			}
			setHint(`${c.nearest} · ${t(n.project.title, lang)} · ${n.dist.toFixed(0)}m`);
		};
		tick();
		const id = window.setInterval(tick, 250);
		return () => window.clearInterval(id);
	}, [
		collected,
		lang,
		c.nearest
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-10 p-3 sm:p-4",
		style: { paddingBottom: "max(12px, env(safe-area-inset-bottom))" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-fg font-display text-xl leading-none sm:text-2xl",
					children: c.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted mt-1 text-[11px] tracking-[0.18em] uppercase",
					children: zone ? t(zone.name, lang) : c.plaza
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-end gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hud-chip",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gem, {
								className: "size-3.5",
								strokeWidth: 1.75
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								collected.length,
								"/",
								PROJECTS.length
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hud-chip hidden sm:inline-flex",
							children: [Math.round(speedKmh), " km/h"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hud-chip hidden sm:inline-flex",
							children: [
								fps,
								" ",
								c.fps
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "hud-chip",
							onClick: () => toggleOverlay("catalog"),
							"aria-label": c.works,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, {
								className: "size-3.5",
								strokeWidth: 1.75
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: c.works
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "hud-chip",
							onClick: () => setMuted(!muted),
							"aria-label": muted ? c.unmute : c.mute,
							children: [muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, {
								className: "size-3.5",
								strokeWidth: 1.75
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
								className: "size-3.5",
								strokeWidth: 1.75
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: muted ? c.unmute : c.mute
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "hud-chip",
							onClick: cycleWeather,
							"aria-label": c.weather,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudRain, {
								className: "size-3.5",
								strokeWidth: 1.75
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: weather
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "hud-chip",
							onClick: () => toggleOverlay("settings"),
							"aria-label": c.settings,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, {
								className: "size-3.5",
								strokeWidth: 1.75
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "hud-chip",
							onClick: () => toggleOverlay("pause"),
							"aria-label": c.pause,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {
								className: "size-3.5",
								strokeWidth: 1.75
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-auto absolute right-3 top-[4.5rem] hidden sm:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimap, { interactive: true })
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted pointer-events-none absolute bottom-16 left-1/2 hidden max-w-xs -translate-x-1/2 text-center text-[11px] tracking-wide sm:block",
				children: hint
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-faint pointer-events-none absolute bottom-4 left-4 hidden text-[11px] tracking-wide sm:block",
				children: c.hint
			})
		]
	});
}
function ProjectModal() {
	const activeId = useDrive((s) => s.activeId);
	const close = useDrive((s) => s.closeModal);
	const lang = useDrive((s) => s.lang);
	const collected = useDrive((s) => s.collected);
	const setWaypoint = useDrive((s) => s.setWaypoint);
	const start = useDrive((s) => s.start);
	const openProject = useDrive((s) => s.openProject);
	const project = PROJECTS.find((p) => p.id === activeId);
	const c = COPY[lang];
	(0, import_react.useEffect)(() => {
		if (!project) return;
		const onKey = (e) => {
			if (e.code === "Escape") close();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [project, close]);
	if (!project) return null;
	const zone = ZONE_BY_ID[project.zone];
	const related = PROJECTS.filter((p) => p.zone === project.zone && p.id !== project.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-30 flex items-end justify-center p-3 sm:items-center sm:p-6",
		style: { background: "color-mix(in oklab, var(--color-bg) 55%, transparent)" },
		onClick: close,
		role: "presentation",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overlay-panel max-h-[88vh] w-full max-w-md overflow-y-auto px-5 py-5 sm:px-7 sm:py-7",
			style: {
				borderRadius: "var(--radius-sheet)",
				borderTop: `2px solid ${project.color}`
			},
			onClick: (e) => e.stopPropagation(),
			role: "dialog",
			"aria-labelledby": "project-title",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 h-24 w-full",
					style: {
						borderRadius: "var(--radius-md)",
						background: `linear-gradient(135deg, ${project.color}55, color-mix(in oklab, var(--color-surface) 80%, transparent))`,
						border: "1px solid var(--color-border)"
					},
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted mb-2 text-[11px] tracking-[0.22em] uppercase",
					children: [
						t(zone.name, lang),
						" · ",
						project.year,
						" · ",
						t(project.medium, lang)
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "project-title",
					className: "text-fg font-display mb-3 text-3xl leading-tight",
					children: t(project.title, lang)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted mb-3 text-sm leading-relaxed",
					children: t(project.description, lang)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-faint mb-5 text-sm leading-relaxed",
					children: t(project.detail, lang)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-6 flex flex-wrap gap-1.5",
					children: project.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted rounded-full px-2.5 py-1 text-[11px] tracking-wide",
						style: { border: "1px solid var(--color-border)" },
						children: t(tag, lang)
					}, tag.en))
				}),
				related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-faint mb-2 text-[11px] tracking-[0.18em] uppercase",
						children: c.related
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-1",
						children: related.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "text-fg flex items-center justify-between gap-3 rounded-md px-2 py-2 text-left text-sm",
							style: { background: "transparent" },
							onClick: () => openProject(p.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t(p.title, lang) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-faint text-[11px]",
								children: collected.includes(p.id) ? c.found : c.hidden
							})]
						}, p.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-faint text-xs tracking-wide",
						children: c.collected
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "ghost-btn",
							onClick: () => {
								setWaypoint({
									x: project.x,
									z: project.z,
									id: project.id
								});
								unlockAudio();
								startAudio();
								start();
								close();
								if (typeof window !== "undefined") window.__driveReady = true;
							},
							children: c.driveThere
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "primary-btn !min-h-11 !px-5",
							onClick: close,
							children: c.close
						})]
					})]
				})
			]
		})
	});
}
function TouchControls() {
	const base = (0, import_react.useRef)(null);
	const knob = (0, import_react.useRef)(null);
	const idRef = (0, import_react.useRef)(null);
	const lang = useDrive((s) => s.lang);
	const c = COPY[lang];
	const moveTo = (clientX, clientY) => {
		const el = base.current;
		const k = knob.current;
		if (!el || !k) return;
		const r = el.getBoundingClientRect();
		const cx = r.left + r.width / 2;
		const cy = r.top + r.height / 2;
		let dx = clientX - cx;
		let dy = clientY - cy;
		const max = r.width * .38;
		const len = Math.hypot(dx, dy) || 1;
		if (len > max) {
			dx = dx / len * max;
			dy = dy / len * max;
		}
		k.style.transform = `translate(${dx}px, ${dy}px)`;
		setTouch(dx / max, -dy / max, true);
	};
	const end = () => {
		idRef.current = null;
		if (knob.current) knob.current.style.transform = "translate(0px, 0px)";
		setTouch(0, 0, false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between px-5 pb-5 sm:hidden",
		style: { paddingBottom: "max(20px, env(safe-area-inset-bottom))" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: base,
			className: "pointer-events-auto relative",
			style: {
				width: 112,
				height: 112,
				borderRadius: "50%",
				border: "1px solid color-mix(in oklab, var(--color-fg) 16%, transparent)",
				background: "color-mix(in oklab, var(--color-surface) 70%, transparent)"
			},
			onPointerDown: (e) => {
				idRef.current = e.pointerId;
				e.currentTarget.setPointerCapture(e.pointerId);
				moveTo(e.clientX, e.clientY);
			},
			onPointerMove: (e) => {
				if (idRef.current !== e.pointerId) return;
				moveTo(e.clientX, e.clientY);
			},
			onPointerUp: end,
			onPointerCancel: end,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: knob,
				className: "absolute",
				style: {
					width: 48,
					height: 48,
					left: 32,
					top: 32,
					borderRadius: "50%",
					background: "var(--color-accent)"
				}
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "pointer-events-auto ghost-btn",
			style: {
				minWidth: 88,
				minHeight: 52
			},
			onPointerDown: (e) => {
				e.preventDefault();
				setTouchBrake(true);
			},
			onPointerUp: () => setTouchBrake(false),
			onPointerCancel: () => setTouchBrake(false),
			children: c.space.split(" ").slice(-1)[0] === "brake" || lang === "en" ? "Brake" : "เบรก"
		})]
	});
}
function Catalog() {
	const overlay = useDrive((s) => s.overlay);
	const setOverlay = useDrive((s) => s.setOverlay);
	const lang = useDrive((s) => s.lang);
	const collected = useDrive((s) => s.collected);
	const openProject = useDrive((s) => s.openProject);
	const setWaypoint = useDrive((s) => s.setWaypoint);
	const start = useDrive((s) => s.start);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const c = COPY[lang];
	const list = (0, import_react.useMemo)(() => PROJECTS.filter((p) => filter === "all" ? true : p.zone === filter), [filter]);
	if (overlay !== "catalog") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-30 flex items-end justify-center p-3 sm:items-center sm:p-6",
		style: { background: "color-mix(in oklab, var(--color-bg) 55%, transparent)" },
		onClick: () => setOverlay("none"),
		role: "presentation",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overlay-panel flex max-h-[88vh] w-full max-w-lg flex-col px-5 py-5 sm:px-7 sm:py-7",
			style: { borderRadius: "var(--radius-sheet)" },
			onClick: (e) => e.stopPropagation(),
			role: "dialog",
			"aria-labelledby": "catalog-title",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted text-[11px] tracking-[0.22em] uppercase",
						children: [
							collected.length,
							"/",
							PROJECTS.length
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "catalog-title",
						className: "text-fg font-display text-3xl leading-tight",
						children: c.works
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "ghost-btn",
						onClick: () => setOverlay("none"),
						children: c.close
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex flex-wrap gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: filter === "all" ? "primary-btn !min-h-9 !px-3 text-xs" : "ghost-btn !min-h-9 !px-3 text-xs",
						onClick: () => setFilter("all"),
						children: c.allZones
					}), ZONES.map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: filter === z.id ? "primary-btn !min-h-9 !px-3 text-xs" : "ghost-btn !min-h-9 !px-3 text-xs",
						onClick: () => setFilter(z.id),
						children: t(z.name, lang)
					}, z.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "min-h-0 flex-1 space-y-1 overflow-y-auto pr-1",
					children: list.map((p) => {
						const found = collected.includes(p.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-lg px-3 py-2.5",
							style: {
								background: "color-mix(in oklab, var(--color-surface-2) 70%, transparent)",
								border: "1px solid var(--color-border)"
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "size-2.5 shrink-0 rounded-full",
									style: {
										background: p.color,
										opacity: found ? 1 : .35
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "min-w-0 flex-1 text-left",
									onClick: () => openProject(p.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-fg truncate text-sm",
										children: t(p.title, lang)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-faint truncate text-[11px] tracking-wide",
										children: [
											t(ZONES.find((z) => z.id === p.zone).name, lang),
											" · ",
											p.year,
											" · ",
											found ? c.found : c.hidden
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "ghost-btn !min-h-9 !px-3 text-[11px]",
									onClick: () => {
										setWaypoint({
											x: p.x,
											z: p.z,
											id: p.id
										});
										unlockAudio();
										startAudio();
										start();
										setOverlay("none");
										if (typeof window !== "undefined") window.__driveReady = true;
									},
									children: c.driveThere
								})
							]
						}) }, p.id);
					})
				})
			]
		})
	});
}
function Settings() {
	const overlay = useDrive((s) => s.overlay);
	const setOverlay = useDrive((s) => s.setOverlay);
	const lang = useDrive((s) => s.lang);
	const setLang = useDrive((s) => s.setLang);
	const muted = useDrive((s) => s.muted);
	const setMuted = useDrive((s) => s.setMuted);
	const weather = useDrive((s) => s.weather);
	const setWeather = useDrive((s) => s.setWeather);
	const quality = useDrive((s) => s.quality);
	const setQuality = useDrive((s) => s.setQuality);
	const resetProgress = useDrive((s) => s.resetProgress);
	const [day, setDay] = (0, import_react.useState)(dayState.time);
	const [frozen, setFrozen] = (0, import_react.useState)(dayState.paused);
	const c = COPY[lang];
	if (overlay !== "settings") return null;
	const weathers = [
		"auto",
		"clear",
		"rain",
		"snow"
	];
	const qualities = [
		"high",
		"medium",
		"low"
	];
	const weatherLabel = {
		auto: c.weatherAuto,
		clear: c.weatherClear,
		rain: c.weatherRain,
		snow: c.weatherSnow
	};
	const qualityLabel = {
		high: c.qualityHigh,
		medium: c.qualityMedium,
		low: c.qualityLow
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-30 flex items-end justify-center p-3 sm:items-center sm:p-6",
		style: { background: "color-mix(in oklab, var(--color-bg) 55%, transparent)" },
		onClick: () => setOverlay("none"),
		role: "presentation",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overlay-panel w-full max-w-md px-5 py-5 sm:px-7 sm:py-7",
			style: { borderRadius: "var(--radius-sheet)" },
			onClick: (e) => e.stopPropagation(),
			role: "dialog",
			"aria-labelledby": "settings-title",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "settings-title",
						className: "text-fg font-display text-3xl leading-tight",
						children: c.settings
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "ghost-btn",
						onClick: () => setOverlay("none"),
						children: c.close
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: c.language,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: ["en", "th"].map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: lang === l ? "primary-btn !min-h-10 !px-4" : "ghost-btn !min-h-10 !px-4",
							onClick: () => setLang(l),
							children: l.toUpperCase()
						}, l))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: muted ? c.unmute : c.mute,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "ghost-btn",
						onClick: () => setMuted(!muted),
						children: muted ? c.unmute : c.mute
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: c.weather,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5",
						children: weathers.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: weather === w ? "primary-btn !min-h-9 !px-3 text-xs" : "ghost-btn !min-h-9 !px-3 text-xs",
							onClick: () => setWeather(w),
							children: weatherLabel[w]
						}, w))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: c.quality,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5",
						children: qualities.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: quality === q ? "primary-btn !min-h-9 !px-3 text-xs" : "ghost-btn !min-h-9 !px-3 text-xs",
							onClick: () => setQuality(q),
							children: qualityLabel[q]
						}, q))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: c.dayNight,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 0,
							max: 100,
							value: Math.round(day * 100),
							onChange: (e) => {
								const v = Number(e.target.value) / 100;
								setDay(v);
								setDayTime(v);
							},
							className: "h-2 flex-1",
							"aria-label": c.dayNight
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "ghost-btn !min-h-9 !px-3 text-xs",
							onClick: () => {
								const next = !frozen;
								setFrozen(next);
								setDayPaused(next);
							},
							children: frozen ? c.playCycle : c.freezeCycle
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 border-t pt-4",
					style: { borderColor: "var(--color-border)" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-faint mb-2 text-xs",
						children: c.resetHint
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "ghost-btn",
						onClick: () => {
							resetProgress();
							setOverlay("none");
						},
						children: c.reset
					})]
				})
			]
		})
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted mb-2 text-[11px] tracking-[0.18em] uppercase",
			children: label
		}), children]
	});
}
function PauseOverlay() {
	const overlay = useDrive((s) => s.overlay);
	const setOverlay = useDrive((s) => s.setOverlay);
	const c = COPY[useDrive((s) => s.lang)];
	if (overlay !== "pause") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-30 flex items-center justify-center p-5",
		style: { background: "color-mix(in oklab, var(--color-bg) 55%, transparent)" },
		onClick: () => setOverlay("none"),
		role: "presentation",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overlay-panel w-full max-w-sm px-7 py-8 text-center",
			style: { borderRadius: "var(--radius-sheet)" },
			onClick: (e) => e.stopPropagation(),
			role: "dialog",
			"aria-labelledby": "pause-title",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "pause-title",
					className: "text-fg font-display mb-2 text-4xl",
					children: c.pausedTitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted mb-6 text-sm",
					children: c.pausedBody
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "primary-btn",
					onClick: () => setOverlay("none"),
					children: c.resume
				})
			]
		})
	});
}
function CompleteOverlay() {
	const overlay = useDrive((s) => s.overlay);
	const mark = useDrive((s) => s.markCompleteSeen);
	const setOverlay = useDrive((s) => s.setOverlay);
	const c = COPY[useDrive((s) => s.lang)];
	if (overlay !== "complete") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-30 flex items-center justify-center p-5",
		style: { background: "color-mix(in oklab, var(--color-bg) 55%, transparent)" },
		role: "presentation",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overlay-panel w-full max-w-md px-7 py-8 text-center",
			style: { borderRadius: "var(--radius-sheet)" },
			role: "dialog",
			"aria-labelledby": "done-title",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "done-title",
					className: "text-fg font-display mb-3 text-4xl",
					children: c.completeTitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted mb-7 text-sm leading-relaxed",
					children: c.completeBody
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "primary-btn",
						onClick: mark,
						children: c.completeCta
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "ghost-btn",
						onClick: () => setOverlay("catalog"),
						children: c.works
					})]
				})
			]
		})
	});
}
function DriveApp() {
	const started = useDrive((s) => s.started);
	const muted = useDrive((s) => s.muted);
	const overlay = useDrive((s) => s.overlay);
	const activeId = useDrive((s) => s.activeId);
	const toggleOverlay = useDrive((s) => s.toggleOverlay);
	const setOverlay = useDrive((s) => s.setOverlay);
	const closeModal = useDrive((s) => s.closeModal);
	const setMutedStore = useDrive((s) => s.setMuted);
	(0, import_react.useEffect)(() => {
		installQA();
		setMuted(muted);
	}, [muted]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.repeat) return;
			if (e.code === "Escape") {
				if (activeId) {
					closeModal();
					return;
				}
				if (overlay !== "none") {
					setOverlay("none");
					return;
				}
				if (started) toggleOverlay("pause");
				return;
			}
			if (e.code === "KeyM") setMutedStore(!useDrive.getState().muted);
			if (!started) return;
			if (e.code === "KeyC") toggleOverlay("catalog");
			if (e.code === "KeyP" && overlay === "none" && !activeId) toggleOverlay("pause");
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		started,
		overlay,
		activeId,
		closeModal,
		setOverlay,
		toggleOverlay,
		setMutedStore
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "drive-root",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
				shadows: true,
				dpr: [1, 1.6],
				gl: {
					antialias: true,
					powerPreference: "high-performance",
					alpha: false
				},
				camera: {
					position: [
						14,
						8,
						14
					],
					fov: 50,
					near: .1,
					far: 220
				},
				onCreated: ({ gl }) => {
					gl.setClearColor("#0b0d10");
					gl.shadowMap.enabled = true;
					gl.shadowMap.type = 1;
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Experience, {})
			}),
			!started && overlay === "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartScreen, {}),
			started && overlay !== "pause" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HUD, {}),
			started && overlay === "none" && !activeId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TouchControls, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectModal, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Catalog, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PauseOverlay, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompleteOverlay, {})
		]
	});
}
//#endregion
export { DriveApp as default };
