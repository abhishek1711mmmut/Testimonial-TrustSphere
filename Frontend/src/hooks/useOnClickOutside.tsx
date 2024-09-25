import { useEffect } from "react";

function useOnClickOutside(
  ref1: React.RefObject<HTMLElement>,
  ref2: React.RefObject<HTMLElement> | null,
  handler: () => void,
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref1.current && !ref1.current.contains(event.target as Node)) {
        if (
          ref2 !== null &&
          ref2.current &&
          !ref2.current.contains(event.target as Node)
        ) {
          handler();
        } else if (ref2 === null) {
          handler();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref1, ref2, handler]);
}

export default useOnClickOutside;
