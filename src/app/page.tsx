import { EditorCanvasViewport } from "@/features/editor/components/editor-canvas-viewport"
import { LayerSidebar } from "@/features/editor/components/layer-sidebar"

export default function HomePage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[var(--ds-color-canvas)]">
      <EditorCanvasViewport />
      <LayerSidebar />
    </main>
  )
}
