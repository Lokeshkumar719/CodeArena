import { useState, useRef } from "react";

const useRateLimit = () => {
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef(null);

  const startCooldown = (seconds) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    setCooldown(seconds);

    intervalRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return { cooldown, startCooldown };
};

export default useRateLimit;