import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Maximize2, RotateCcw } from "lucide-react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ContextLossGuard } from "@/components/canvas/runtime";
import { useSceneVisibility, useWebGLSupport } from "@/components/canvas/runtime-hooks";
import { WebGLBoundary } from "@/components/canvas/webgl-boundary";
import { StaticFoodTruck } from "@/drive/world/FoodTruckBody";
import { useLocale } from "@/lib/copy";

const copy = {
  en: {
    title: "A closer look at your truck.",
    description:
      "Reconstructed from your six exterior and interior reference images. Proportions are estimated; this is a navigable model, not a measured engineering drawing.",
    exterior: "Exterior",
    kitchen: "Kitchen & sleeping space",
    rear: "Kitchen & rear door",
    open: "Open serving hatches",
    close: "Close serving hatches",
    reset: "Reset view",
    hint: "Drag to orbit · scroll or pinch to zoom",
    insideHint: "Choose a view to inspect the interior",
    fallback: "Interactive 3D is unavailable on this device. The Blender render remains available.",
    loading: "Loading the reference model…",
    render: "Blender render",
    ready: "Reference model",
    geometry: "Geometry preview",
    badge: "SIX VIEWS / ONE TRUCK",
  },
  th: {
    title: "สำรวจรถของคุณอย่างใกล้ชิด",
    description:
      "สร้างโมเดลจากภาพภายนอกและภายในทั้งหกภาพที่คุณให้ สัดส่วนเป็นค่าประมาณ ใช้สำรวจในโลกเสมือน ไม่ใช่แบบวิศวกรรมที่วัดขนาดจริง",
    exterior: "ภายนอก",
    kitchen: "ครัวและที่นอน",
    rear: "ครัวและประตูท้าย",
    open: "เปิดช่องบริการ",
    close: "ปิดช่องบริการ",
    reset: "คืนมุมเริ่มต้น",
    hint: "ลากเพื่อหมุน · เลื่อนหรือจีบเพื่อซูม",
    insideHint: "เลือกมุมเพื่อสำรวจภายในรถ",
    fallback: "อุปกรณ์นี้แสดงสามมิติแบบโต้ตอบไม่ได้ ยังดูภาพเรนเดอร์จาก Blender ได้",
    loading: "กำลังโหลดโมเดลจากภาพอ้างอิง…",
    render: "ภาพเรนเดอร์จาก Blender",
    ready: "โมเดลจากภาพอ้างอิง",
    geometry: "โมเดลสำรอง",
    badge: "หกมุมมอง / รถหนึ่งคัน",
  },
  zh: {
    title: "近距离探索你的餐车。",
    description:
      "依据你提供的六张外观及内饰参考图重建。比例为估算值，这是可浏览的三维模型，并非实测工程图。",
    exterior: "外观",
    kitchen: "厨房与休息区",
    rear: "厨房与后门",
    open: "打开售餐窗口",
    close: "关闭售餐窗口",
    reset: "重置视角",
    hint: "拖动旋转 · 滚动或双指缩放",
    insideHint: "选择视角查看车内空间",
    fallback: "此设备无法显示交互式三维场景，仍可查看 Blender 渲染图。",
    loading: "正在加载参考模型…",
    render: "Blender 渲染图",
    ready: "参考图重建模型",
    geometry: "备用几何模型",
    badge: "六个视角 / 一辆餐车",
  },
};
type View = "exterior" | "kitchen" | "rear";
const views: Record<
  View,
  { position: [number, number, number]; target: [number, number, number] }
> = {
  exterior: { position: [8, 5.5, -9], target: [0, 1.6, 0] },
  kitchen: { position: [0, 2.24, 2.28], target: [0, 2.19, -0.65] },
  rear: { position: [0, 2.24, -0.08], target: [0, 1.89, 1.85] },
};

function ViewCamera({ view, revision }: { view: View; revision: number }) {
  const controls = useRef<OrbitControlsImpl>(null);
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  useLayoutEffect(() => {
    const selected = views[view];
    if ("fov" in camera) camera.fov = view === "exterior" ? 48 : 72;
    camera.position.set(...selected.position);
    camera.lookAt(...selected.target);
    controls.current?.target.set(...selected.target);
    controls.current?.update();
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate, view, revision]);
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enabled={view === "exterior"}
      enableDamping={false}
      enablePan={false}
      minDistance={view === "exterior" ? 5 : 0.05}
      maxDistance={18}
      maxPolarAngle={view === "exterior" ? Math.PI / 2.05 : Math.PI}
    />
  );
}

export default function TruckShowroom() {
  const lang = useLocale();
  const c = copy[lang];
  const root = useRef<HTMLDivElement>(null);
  const live = useSceneVisibility(root);
  const support = useWebGLSupport();
  const [failed, setFailed] = useState(false);
  const [asset, setAsset] = useState<"glb" | "fallback" | "loading">("loading");
  const [view, setView] = useState<View>("exterior");
  const [hatchesOpen, setHatchesOpen] = useState(false);
  const [revision, setRevision] = useState(0);
  const onLost = useCallback(() => setFailed(true), []);
  const onAssetReady = useCallback((value: "glb" | "fallback") => setAsset(value), []);
  const unavailable = failed || support === "unsupported";
  const fallback = (
    <div className="truck-showroom-fallback">
      <img
        src={
          view === "exterior"
            ? "/images/foodtruck-preview.webp"
            : view === "rear"
              ? "/images/foodtruck-rear-interior.webp"
              : "/images/foodtruck-interior.webp"
        }
        width="1280"
        height="960"
        alt={c[view]}
      />
      <p role="status">{unavailable ? c.fallback : c.loading}</p>
    </div>
  );
  return (
    <section className="truck-showroom-section" aria-labelledby="truck-showroom-title">
      <header>
        <div>
          <p className="editorial-kicker">{c.badge}</p>
          <h2 id="truck-showroom-title">{c.title}</h2>
        </div>
        <p>{c.description}</p>
      </header>
      <div
        className="truck-showroom"
        ref={root}
        data-testid="truck-showroom"
        data-scene-state={unavailable ? "fallback" : asset === "loading" ? "loading" : "ready"}
        data-asset-state={asset}
        data-view={view}
      >
        {support !== "supported" || failed ? (
          fallback
        ) : (
          <WebGLBoundary fallback={fallback} onFailure={onLost}>
            <Canvas
              frameloop={live ? "demand" : "never"}
              dpr={[1, 1.5]}
              camera={{ position: views.exterior.position, near: 0.02, far: 80, fov: 48 }}
              gl={{ antialias: true, alpha: false, powerPreference: "default" }}
              onCreated={({ gl }) => gl.setClearColor("#111316")}
            >
              <ContextLossGuard onLost={onLost} />
              <ambientLight intensity={1.35} />
              <hemisphereLight args={["#e8efff", "#55514d", 1.7]} />
              <directionalLight position={[5, 8, -5]} intensity={3} />
              <directionalLight position={[-4, 4, 3]} intensity={1.4} color="#dce4ef" />
              <pointLight
                position={[0, 2.7, 0.8]}
                intensity={7}
                distance={4}
                decay={2}
                color="#ffe0b2"
              />
              <StaticFoodTruck hatchesOpen={hatchesOpen} onAssetReady={onAssetReady} />
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]}>
                <planeGeometry args={[200, 200]} />
                <meshStandardMaterial color="#111316" roughness={0.95} />
              </mesh>
              <gridHelper args={[24, 24, "#30343c", "#20242b"]} position={[0, -0.01, 0]} />
              <ViewCamera view={view} revision={revision} />
            </Canvas>
          </WebGLBoundary>
        )}
        <div className="truck-showroom-meta">
          <span>
            <Maximize2 size={14} />
            {unavailable
              ? c.render
              : asset === "glb"
                ? c.ready
                : asset === "fallback"
                  ? c.geometry
                  : c.loading}
          </span>
          <span>{view === "exterior" && !unavailable ? c.hint : c.insideHint}</span>
        </div>
      </div>
      <div className="truck-showroom-controls">
        <div role="group" aria-label={c.title}>
          {(["exterior", "kitchen", "rear"] as const).map((value) => (
            <button
              type="button"
              key={value}
              data-testid={`truck-view-${value}`}
              aria-pressed={view === value}
              onClick={() => {
                setView(value);
                if (value !== "exterior") setHatchesOpen(true);
              }}
            >
              {c[value]}
            </button>
          ))}
        </div>
        <div>
          <button
            type="button"
            data-testid="truck-hatch"
            aria-pressed={hatchesOpen}
            disabled={unavailable || asset === "loading"}
            onClick={() => setHatchesOpen((value) => !value)}
          >
            {hatchesOpen ? c.close : c.open}
          </button>
          <button
            type="button"
            data-testid="truck-view-reset"
            onClick={() => {
              setView("exterior");
              setRevision((value) => value + 1);
            }}
          >
            <RotateCcw size={14} />
            {c.reset}
          </button>
        </div>
      </div>
    </section>
  );
}
