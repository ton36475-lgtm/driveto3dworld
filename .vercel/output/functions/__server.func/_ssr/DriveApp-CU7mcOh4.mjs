import { i as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, c as CanvasTexture, d as Fog, f as MathUtils, g as Vector3, h as SRGBColorSpace, l as Color, m as Quaternion, n as useFrame, o as BufferAttribute, p as Matrix4, r as useThree, s as BufferGeometry, t as Canvas, u as Euler, v as require_react } from "../_libs/@react-three/fiber+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
import { a as CloudRain, i as Gem, n as Volume2, t as VolumeX } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DriveApp-CU7mcOh4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ZONES = [
	{
		id: "architecture",
		name: "Architecture",
		x: -42,
		z: -42,
		color: "#6ea0c8",
		pad: "#1d3348",
		size: 38
	},
	{
		id: "characters",
		name: "Characters",
		x: 42,
		z: -42,
		color: "#c47a9a",
		pad: "#3a2230",
		size: 38
	},
	{
		id: "vehicles",
		name: "Vehicles",
		x: 42,
		z: 42,
		color: "#7eae6e",
		pad: "#24341f",
		size: 38
	},
	{
		id: "products",
		name: "Products",
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
		title: "Glass Pavilion",
		description: "A minimal pavilion of structural glass and slim steel, with a parametric facade that reads as one folded plane.",
		year: "2025",
		medium: "Archviz / form study",
		x: -42,
		z: -42,
		color: "#7ec8ff",
		model: "/models/arch.glb"
	},
	{
		id: "arch-02",
		zone: "architecture",
		title: "Mekong House",
		description: "Stilt dwelling reimagined as a cool-climate studio: teak lattice, lifted floor, monsoon-aware roof.",
		year: "2024",
		medium: "Residence concept",
		x: -52,
		z: -34,
		color: "#9ad4ff",
		model: "/models/arch.glb"
	},
	{
		id: "arch-03",
		zone: "architecture",
		title: "Night Atelier",
		description: "The studio itself — a long shed of blackened timber and a single clerestory, designed to disappear at dusk.",
		year: "2026",
		medium: "Workplace",
		x: -32,
		z: -52,
		color: "#5aa7e0",
		model: "/models/arch.glb"
	},
	{
		id: "char-01",
		zone: "characters",
		title: "Robot Scout",
		description: "Low-poly reconnaissance unit with a readable silhouette, game-ready UVs, and a single emissive eye.",
		year: "2025",
		medium: "Character / game",
		x: 42,
		z: -42,
		color: "#f0a0c8",
		model: "/models/char.glb"
	},
	{
		id: "char-02",
		zone: "characters",
		title: "Clay Guardian",
		description: "Stylized yaksha in fired clay — temple massing, cracked glaze, and a quiet stance.",
		year: "2024",
		medium: "Sculpture",
		x: 52,
		z: -34,
		color: "#e889b4",
		model: "/models/char.glb"
	},
	{
		id: "char-03",
		zone: "characters",
		title: "Drift Rider",
		description: "Hero mesh for an arcade racer. Compact proportions, cloth sim on the scarf, PBR skin.",
		year: "2026",
		medium: "Hero mesh",
		x: 32,
		z: -52,
		color: "#d46a9c",
		model: "/models/char.glb"
	},
	{
		id: "veh-01",
		zone: "vehicles",
		title: "Hover Bike",
		description: "A one-person hover craft with ducted fans and a visible chassis. Built to be driven, not just rendered.",
		year: "2025",
		medium: "Vehicle concept",
		x: 42,
		z: 42,
		color: "#b6e07a",
		model: "/models/veh.glb"
	},
	{
		id: "veh-02",
		zone: "vehicles",
		title: "Concept Coupe",
		description: "Long-nose coupe, three volumes, brushed aluminum and smoked glass. Studio lighting study included.",
		year: "2024",
		medium: "Hard-surface",
		x: 52,
		z: 34,
		color: "#96d45c",
		model: "/models/veh.glb"
	},
	{
		id: "veh-03",
		zone: "vehicles",
		title: "Cargo Drone",
		description: "Utility hex-rotor with modular bays. Designed around service, not spectacle.",
		year: "2026",
		medium: "Industrial",
		x: 32,
		z: 52,
		color: "#7cbe4a",
		model: "/models/veh.glb"
	},
	{
		id: "prod-01",
		zone: "products",
		title: "Modular Lamp",
		description: "3D-printable lamp of stacked rings. Warm 2700K source, interchangeable shades.",
		year: "2025",
		medium: "Product viz",
		x: -42,
		z: 42,
		color: "#e8c078",
		model: "/models/prod.glb"
	},
	{
		id: "prod-02",
		zone: "products",
		title: "Halo Watch",
		description: "Cushion-case timepiece with a floating chapter ring. Materials: brushed steel, sapphire, calf.",
		year: "2024",
		medium: "Wearable",
		x: -52,
		z: 34,
		color: "#d4a85a",
		model: "/models/prod.glb"
	},
	{
		id: "prod-03",
		zone: "products",
		title: "Audio Sphere",
		description: "Omnidirectional speaker as a single machined hemisphere. Cloth, aluminum, and a hidden port.",
		year: "2026",
		medium: "Object",
		x: -32,
		z: 52,
		color: "#c49248",
		model: "/models/prod.glb"
	}
];
var ZONE_BY_ID = Object.fromEntries(ZONES.map((z) => [z.id, z]));
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
	wheel: 0
};
var perfState = {
	fps: 60,
	frames: 0,
	last: 0,
	dpr: 1.5,
	shadows: true
};
function zoneAt(x, z) {
	if (x < -22 && z < -22) return "architecture";
	if (x > 22 && z < -22) return "characters";
	if (x > 22 && z > 22) return "vehicles";
	if (x < -22 && z > 22) return "products";
	return null;
}
if (typeof window !== "undefined") window.__sim = sim;
var SAVE_KEY = "atelier-drive-v1";
function loadCollected() {
	try {
		const raw = localStorage.getItem(SAVE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (parsed.version !== 1 || !Array.isArray(parsed.collected)) return [];
		return parsed.collected.filter((id) => PROJECTS.some((p) => p.id === id));
	} catch {
		return [];
	}
}
function persist(collected) {
	try {
		localStorage.setItem(SAVE_KEY, JSON.stringify({
			version: 1,
			collected
		}));
	} catch {}
}
var useDrive = create((set, get) => ({
	started: false,
	muted: false,
	collected: typeof window === "undefined" ? [] : loadCollected(),
	activeId: null,
	zoneId: null,
	fps: 60,
	weather: "auto",
	start: () => set({ started: true }),
	toggleMute: () => set({ muted: !get().muted }),
	collect: (id) => {
		const { collected } = get();
		const next = collected.includes(id) ? collected : [...collected, id];
		persist(next);
		set({
			collected: next,
			activeId: id
		});
	},
	closeModal: () => set({ activeId: null }),
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
		set({ weather: order[(order.indexOf(get().weather) + 1) % order.length] });
	}
}));
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
	return tex;
}
function Lighting() {
	const sun = (0, import_react.useRef)(null);
	const hemi = (0, import_react.useRef)(null);
	const { scene, gl } = useThree();
	const setFps = useDrive((s) => s.setFps);
	useFrame((_, delta) => {
		stepDayNight(Math.min(delta, .1));
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
			const next = perfState.fps < 32 ? 1 : Math.min(window.devicePixelRatio || 1, 1.6);
			if (Math.abs(next - perfState.dpr) > .05) {
				perfState.dpr = next;
				gl.setPixelRatio(next);
			}
			perfState.shadows = perfState.fps >= 28;
			sun.current.castShadow = perfState.shadows;
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
			"shadow-mapSize": [1024, 1024],
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
	const pts = (0, import_react.useMemo)(() => scatter(70, 42, ZONES.map((z) => ({
		x: z.x,
		z: z.z,
		r: 22
	}))), []);
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
function Lamps() {
	const spots = (0, import_react.useMemo)(() => {
		const list = [];
		for (let i = -70; i <= 70; i += 20) {
			if (Math.abs(i) < 14) continue;
			list.push([8.5, i], [-8.5, i], [i, 8.5], [i, -8.5]);
		}
		return list;
	}, []);
	const glow = (0, import_react.useRef)([]);
	useFrame(() => {
		const n = .15 + dayState.night * 2.4;
		for (const m of glow.current) {
			const mat = m.material;
			mat.emissiveIntensity = n;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: spots.map(([x, z], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			x,
			0,
			z
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				1.4,
				0
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
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				2.9,
				0
			],
			ref: (el) => {
				if (el) glow.current[i] = el;
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.16,
				8,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#f3eee6",
				emissive: "#f3eee6",
				emissiveIntensity: .4
			})]
		})]
	}, i)) });
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
var SHOW = {
	architecture: Pavilion,
	characters: Robot,
	vehicles: HoverBike,
	products: LampProduct
};
function Landmarks() {
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
						text: z.name,
						color: z.color
					})
				]
			}, z.id);
		}),
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
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "visible" && b.ctx.state === "suspended") b.ctx.resume();
	});
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
	if (currentZone) {
		const prev = loops.get(currentZone);
		if (prev) prev.gain.gain.setTargetAtTime(0, t, .25);
		window.setTimeout(() => {
			if (currentZone !== zone) stopLoop(currentZone);
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
	gain.gain.value = .55;
	gain.connect(b.sfx);
	if (buf) {
		const src = b.ctx.createBufferSource();
		src.buffer = buf;
		src.connect(gain);
		src.start();
		src.onended = () => gain.disconnect();
		return;
	}
	const osc = b.ctx.createOscillator();
	osc.frequency.value = 880;
	osc.connect(gain);
	osc.start();
	osc.stop(b.ctx.currentTime + .2);
}
function setMuted(next) {
	muted = next;
	if (!bus) return;
	bus.master.gain.setTargetAtTime(next ? 0 : .85, bus.ctx.currentTime, .04);
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
	useFrame((state) => {
		if (taken.current || collected) return;
		const m = mesh.current;
		if (!m) return;
		const t = state.clock.elapsedTime;
		m.rotation.y = t * 1.4;
		m.position.y = 1.35 + Math.sin(t * 2.2 + x) * .22;
		const pulse = .85 + Math.sin(t * 4) * .4;
		m.material.emissiveIntensity = pulse;
		if (!started) return;
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
var gamepadSteer = 0;
var gamepadThrottle = 0;
var gamepadBrake = 0;
var attached = false;
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
function setTouch(x, y, active) {
	touchOn = active;
	touchX = active ? clamp(x, -1, 1) : 0;
	touchY = active ? clamp(y, -1, 1) : 0;
}
function pollGamepad() {
	const pad = (typeof navigator !== "undefined" ? navigator.getGamepads?.() : null)?.[0];
	if (!pad) {
		gamepadSteer = 0;
		gamepadThrottle = 0;
		gamepadBrake = 0;
		return;
	}
	const ax = pad.axes[0] ?? 0;
	const ay = pad.axes[1] ?? 0;
	gamepadSteer = Math.abs(ax) > .18 ? -ax : 0;
	gamepadThrottle = 0;
	if (ay < -.18) gamepadThrottle += -ay;
	if (ay > .18) gamepadThrottle -= ay;
	if (pad.buttons[7]?.pressed || pad.buttons[0]?.pressed) gamepadThrottle = Math.max(gamepadThrottle, 1);
	if (pad.buttons[6]?.pressed) gamepadThrottle = Math.min(gamepadThrottle, -1);
	gamepadBrake = pad.buttons[1]?.pressed ? 1 : 0;
}
function fromSet(set) {
	let steer = 0;
	if (set.has("KeyA") || set.has("ArrowLeft")) steer += 1;
	if (set.has("KeyD") || set.has("ArrowRight")) steer -= 1;
	let throttle = 0;
	if (set.has("KeyW") || set.has("ArrowUp")) throttle += 1;
	if (set.has("KeyS") || set.has("ArrowDown")) throttle -= 1;
	const brake = set.has("Space") ? 1 : 0;
	return {
		steer: clamp(steer, -1, 1),
		throttle: clamp(throttle, -1, 1),
		brake
	};
}
function readAxes() {
	if (injected) {
		const a = fromSet(injected);
		if (steerOverride != null) a.steer = clamp(steerOverride, -1, 1);
		return a;
	}
	const keys = fromSet(held);
	let steer = keys.steer;
	let throttle = keys.throttle;
	let brake = keys.brake;
	if (touchOn) {
		steer += -touchX;
		throttle += touchY;
	}
	steer += gamepadSteer;
	throttle += gamepadThrottle;
	brake = Math.max(brake, gamepadBrake);
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
var MAX_SPEED = 16;
var ACCEL = 22;
var REVERSE = 12;
var DRAG = 2.4;
var TURN = 2.55;
function Car() {
	const group = (0, import_react.useRef)(null);
	const wheels = (0, import_react.useRef)([]);
	const started = useDrive((s) => s.started);
	const tmp = (0, import_react.useRef)({
		cam: new Vector3(),
		look: new Vector3(),
		desired: new Vector3()
	});
	(0, import_react.useEffect)(() => {
		const detach = attachInput();
		installControlsTest(() => sim.yaw, () => sim.speed);
		return detach;
	}, []);
	useFrame((state, delta) => {
		const dt = Math.min(delta, .1);
		const g = group.current;
		if (!g) return;
		if (!started) {
			g.position.set(sim.x, sim.y, sim.z);
			g.rotation.y = sim.yaw;
			const t = state.clock.elapsedTime * .12;
			state.camera.position.lerp(tmp.current.desired.set(Math.sin(t) * 16, 7.5, Math.cos(t) * 16), 1 - Math.exp(-2.2 * dt));
			state.camera.lookAt(0, .6, 0);
			return;
		}
		pollGamepad();
		const { steer, throttle, brake } = readAxes();
		sim.steer = MathUtils.damp(sim.steer, steer, 10, dt);
		if (brake) sim.speed *= Math.pow(.18, dt);
		else if (throttle > 0) sim.speed += ACCEL * throttle * dt;
		else if (throttle < 0) sim.speed += REVERSE * throttle * dt;
		else sim.speed *= Math.pow(.22, dt);
		const drag = DRAG * dt * Math.sign(sim.speed) * Math.min(1, Math.abs(sim.speed));
		sim.speed -= drag;
		sim.speed = MathUtils.clamp(sim.speed, -8.8, MAX_SPEED);
		const speedFactor = MathUtils.clamp(Math.abs(sim.speed) / 5, .28, 1);
		const reverse = sim.speed >= 0 ? 1 : -1;
		sim.yaw += sim.steer * TURN * speedFactor * reverse * dt;
		const fx = -Math.sin(sim.yaw);
		const fz = -Math.cos(sim.yaw);
		sim.x += fx * sim.speed * dt;
		sim.z += fz * sim.speed * dt;
		sim.x = MathUtils.clamp(sim.x, -94, 94);
		sim.z = MathUtils.clamp(sim.z, -94, 94);
		sim.roll = MathUtils.damp(sim.roll, sim.steer * .14 * speedFactor, 8, dt);
		sim.wheel += sim.speed * dt * 2.4;
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
		setEngine(sim.speed);
		const follow = 8.6;
		const height = 4.4;
		const { desired, look, cam } = tmp.current;
		desired.set(sim.x - fx * follow, sim.y + height, sim.z - fz * follow);
		look.set(sim.x + fx * 5.5, sim.y + .85, sim.z + fz * 5.5);
		cam.copy(state.camera.position);
		cam.lerp(desired, 1 - Math.exp(-3.4 * dt));
		state.camera.position.copy(cam);
		state.camera.lookAt(look);
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
			})
		]
	});
}
function Systems() {
	const setZone = useDrive((s) => s.setZone);
	const started = useDrive((s) => s.started);
	useFrame(() => {
		if (!started) return;
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
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Car, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Systems, {})
	] });
}
function StartScreen() {
	const start = useDrive((s) => s.start);
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted mb-3 text-[11px] font-medium tracking-[0.28em] uppercase",
					children: "Godzfath3r · Phitsanulok"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-fg mb-2 font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl",
					style: { fontFamily: "var(--font-display)" },
					children: "Atelier Drive"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted mb-6 max-w-sm text-sm leading-relaxed",
					children: "A 3D design grounds you can drive. Four zones, twelve hidden crystals. Collect a piece to open it."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "text-muted mb-7 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "W / ↑ accelerate" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "S / ↓ reverse" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "A / ← turn left" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "D / → turn right" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Space brake" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Stick · gamepad" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "primary-btn",
						onClick: onStart,
						children: "Start driving"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-faint inline-flex items-center gap-1.5 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
							className: "size-3.5",
							strokeWidth: 1.75
						}), "Audio unlocks on start"]
					})]
				})
			]
		})
	});
}
function Minimap() {
	const ref = (0, import_react.useRef)(null);
	const collected = useDrive((s) => s.collected);
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
	}, [collected]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		width: 256,
		height: 256,
		className: "pointer-events-none hidden sm:block",
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
	const toggleMute = useDrive((s) => s.toggleMute);
	const zoneId = useDrive((s) => s.zoneId);
	const weather = useDrive((s) => s.weather);
	const cycleWeather = useDrive((s) => s.cycleWeather);
	const zone = zoneId ? ZONE_BY_ID[zoneId] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-10 p-3 sm:p-4",
		style: { paddingBottom: "max(12px, env(safe-area-inset-bottom))" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-fg text-xl leading-none sm:text-2xl",
					style: { fontFamily: "var(--font-display)" },
					children: "Atelier Drive"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted mt-1 text-[11px] tracking-[0.18em] uppercase",
					children: zone ? zone.name : "Plaza"
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
							children: [fps, " fps"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "hud-chip",
							onClick: () => {
								toggleMute();
								setMuted(!muted);
							},
							"aria-label": muted ? "Unmute" : "Mute",
							children: [muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, {
								className: "size-3.5",
								strokeWidth: 1.75
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
								className: "size-3.5",
								strokeWidth: 1.75
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: muted ? "Unmute" : "Mute"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "hud-chip",
							onClick: cycleWeather,
							"aria-label": "Cycle weather",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudRain, {
								className: "size-3.5",
								strokeWidth: 1.75
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: weather
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute right-3 top-[4.5rem] hidden sm:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimap, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-faint pointer-events-none absolute bottom-4 left-4 hidden text-[11px] tracking-wide sm:block",
				children: "WASD · arrows · space · touch · gamepad"
			})
		]
	});
}
function ProjectModal() {
	const activeId = useDrive((s) => s.activeId);
	const close = useDrive((s) => s.closeModal);
	const project = PROJECTS.find((p) => p.id === activeId);
	if (!project) return null;
	const zone = ZONE_BY_ID[project.zone];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-30 flex items-end justify-center p-3 sm:items-center sm:p-6",
		style: { background: "color-mix(in oklab, var(--color-bg) 55%, transparent)" },
		onClick: close,
		role: "presentation",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overlay-panel w-full max-w-md px-5 py-5 sm:px-7 sm:py-7",
			style: {
				borderRadius: "var(--radius-sheet)",
				borderTop: `2px solid ${project.color}`
			},
			onClick: (e) => e.stopPropagation(),
			role: "dialog",
			"aria-labelledby": "project-title",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted mb-2 text-[11px] tracking-[0.22em] uppercase",
					children: [
						zone.name,
						" · ",
						project.year,
						" · ",
						project.medium
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "project-title",
					className: "text-fg mb-3 text-3xl leading-tight",
					style: { fontFamily: "var(--font-display)" },
					children: project.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted mb-6 text-sm leading-relaxed",
					children: project.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-faint text-xs tracking-wide",
						children: "Crystal collected"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "ghost-btn",
						onClick: close,
						children: "Close"
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
				window.dispatchEvent(new KeyboardEvent("keydown", {
					code: "Space",
					bubbles: true
				}));
			},
			onPointerUp: () => {
				window.dispatchEvent(new KeyboardEvent("keyup", {
					code: "Space",
					bubbles: true
				}));
			},
			children: "Brake"
		})]
	});
}
function DriveApp() {
	const started = useDrive((s) => s.started);
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
			!started && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartScreen, {}),
			started && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HUD, {}),
			started && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TouchControls, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectModal, {})
		]
	});
}
//#endregion
export { DriveApp as default };
