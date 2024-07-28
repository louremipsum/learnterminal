type ResizablePanelProps = {
  terminal: React.ReactNode;
  chat: React.ReactNode;
};

export function MainframeLayout({ terminal, chat }: ResizablePanelProps) {
  return (
    <div className="w-full flex">
      <div className="w-1/2">{terminal}</div>
      <div className="w-1/2">{chat}</div>
    </div>
  );
}
