import { RefObject, useEffect, useRef } from "react";

const useInfiniteScroll = (
  observerRef: RefObject<HTMLDivElement | null>,
  containerRef: RefObject<HTMLDivElement | null>,
  onIntersect: () => void
) => {
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!observerRef.current) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          onIntersect();
        }
      },
      {
        root: containerRef.current,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    observer.current.observe(observerRef.current);

    return () => observer.current?.disconnect();
  }, [observerRef.current]);

  return null;
};

export default useInfiniteScroll;
