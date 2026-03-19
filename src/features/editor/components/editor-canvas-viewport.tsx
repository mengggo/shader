"use client"

import { useEditorRenderer } from "@/features/editor/hooks/use-editor-renderer"
import { useEditorStore } from "@/store/editorStore"

export function EditorCanvasViewport() {
  const { canvasRef, fallbackMessage, isReady, viewportRef } = useEditorRenderer()
  const webgpuStatus = useEditorStore((state) => state.webgpuStatus)

  return (
    <>
      <div ref={viewportRef} className="absolute inset-0">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>

      {!isReady ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
          <div className="max-w-sm rounded-xl border border-white/10 bg-[rgba(18,18,22,0.55)] px-5 py-4 text-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-[24px]">
            <p className="font-mono text-[10px] text-white/35 uppercase tracking-[0.06em]">
              Renderer {webgpuStatus}
            </p>
            <p className="mt-2 text-sm text-white/75">
              {fallbackMessage ?? "Initializing the editor canvas."}
            </p>
          </div>
        </div>
      ) : null}
    </>
  )
}
