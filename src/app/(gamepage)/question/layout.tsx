"use client";

import RightSidebar from "@/components/RightSidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";


export default function GamePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-screen rounded-lg border"
      >
        <ResizablePanel defaultSize={75}>
          <div className="flex h-full p-6">{children}</div>
        </ResizablePanel>
        <ResizableHandle
          className="w-2 hover:w-3 bg-zinc-400 dark:bg-zinc-800 rounded-lg transition-all cursor-col-resize"
          withHandle
        />
        <ResizablePanel defaultSize={20} minSize={0} maxSize={100}>
          <div className="flex h-full items-center justify-center p-6">
            <RightSidebar />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
