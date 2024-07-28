import * as React from "react";

export function useAtBottom(ref: React.RefObject<HTMLElement>, offset = 0) {
  const [isAtBottom, setIsAtBottom] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const atBottom =
          ref.current.scrollHeight - ref.current.scrollTop <=
          ref.current.clientHeight + offset;
        console.log(
          "Scroll Position:",
          ref.current.scrollTop,
          "At Bottom:",
          atBottom
        );
        setIsAtBottom(atBottom);
      }
    };

    const element = ref.current;
    element?.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      element?.removeEventListener("scroll", handleScroll);
    };
  }, [ref, offset]);

  return isAtBottom;
}
