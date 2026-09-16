import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode; fallback: ReactNode };

export class WebGLBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("WebGL scene failed", error, info);
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}
