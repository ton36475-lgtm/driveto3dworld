import { Component, Suspense, useMemo, type ReactNode } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

class FrameBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function ImportedFrame({ metal }: { metal: THREE.MeshStandardMaterial }) {
  const { scene } = useGLTF("/models/work-frame.glb");
  const frame = useMemo(() => {
    const instance = scene.clone(true);
    if (!instance.getObjectByName("Frame_Work")) throw new Error("Frame asset contract mismatch");
    // The app owns each artwork texture; never share or overwrite its image plane.
    instance.getObjectByName("Artwork")?.removeFromParent();
    for (const name of ["Frame_Top", "Frame_Bottom", "Frame_Left", "Frame_Right"]) {
      const mesh = instance.getObjectByName(name);
      if (!(mesh instanceof THREE.Mesh)) throw new Error(`Missing frame rim: ${name}`);
      mesh.material = metal;
      mesh.castShadow = true;
    }
    return instance;
  }, [scene, metal]);
  // Cached GLTF geometry remains shared, while the caller owns its per-frame metal.
  return <primitive object={frame} dispose={null} />;
}

export function FrameAsset({ metal, fallback }: { metal: THREE.MeshStandardMaterial; fallback: ReactNode }) {
  return (
    <FrameBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <ImportedFrame metal={metal} />
      </Suspense>
    </FrameBoundary>
  );
}
