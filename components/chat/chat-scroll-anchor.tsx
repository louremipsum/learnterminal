"use client";

import { useInView } from "react-intersection-observer";
import { useAtBottom } from "@/lib/hooks/use-at-bottom";
import { useEffect } from "react";

interface ChatScrollAnchorProps {
  trackVisibility?: boolean;
  refValue: React.RefObject<HTMLElement>;
}

export function ChatScrollAnchor({
  trackVisibility,
  refValue,
}: ChatScrollAnchorProps) {
  const isAtBottom = useAtBottom(refValue);
  const { ref, entry, inView } = useInView({
    trackVisibility,
    delay: 100,
    root: refValue.current,
  });

  useEffect(() => {
    if (isAtBottom && trackVisibility && !inView) {
      entry?.target.scrollIntoView({
        block: "start",
      });
    }
  }, [inView, entry, isAtBottom, trackVisibility]);

  return <div ref={ref} className="h-px w-full" />;
}
