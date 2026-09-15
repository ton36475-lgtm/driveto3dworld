import { i as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, v as require_react } from "../_libs/@react-three/fiber+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D2ZcpozG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Boot() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "drive-root flex items-end p-5 sm:items-center sm:justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overlay-panel w-full max-w-lg px-6 py-7 sm:px-9 sm:py-9",
			style: { borderRadius: "var(--radius-sheet)" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted mb-3 text-[11px] font-medium tracking-[0.28em] uppercase",
					children: "Godzfath3r · Phitsanulok"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-fg mb-2 text-5xl leading-[0.95] tracking-tight sm:text-6xl",
					style: { fontFamily: "var(--font-display)" },
					children: "Atelier Drive"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted mb-6 max-w-sm text-sm leading-relaxed",
					children: "A 3D design grounds you can drive. Four zones, twelve hidden crystals. Collect a piece to open it."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-faint text-xs tracking-wide",
					children: "Loading the grounds…"
				})
			]
		})
	});
}
function Home() {
	const [App, setApp] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let alive = true;
		import("./DriveApp-CU7mcOh4.mjs").then((mod) => {
			if (alive) setApp(() => mod.default);
		});
		return () => {
			alive = false;
		};
	}, []);
	if (!App) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boot, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {});
}
//#endregion
export { Home as component };
