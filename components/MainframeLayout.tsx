import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

type ResizablePanelProps = {
  terminal: React.ReactNode;
  chat: React.ReactNode;
};

export function MainframeLayout({ terminal, chat }: ResizablePanelProps) {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="rounded-lg border h-screen"
      autoSaveId="persistence"
    >
      <ResizablePanel defaultSize={70} minSize={40} order={1}>
        {terminal}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={30} minSize={30} order={2}>
        {chat}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
