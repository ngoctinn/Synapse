import { useEffect, useState, useRef } from "react";
import { differenceInSeconds } from "date-fns";

interface UseHoldTimerProps {
  expiresAt: Date | null;
  onExpire?: () => void;
}

export function useHoldTimer({ expiresAt, onExpire }: UseHoldTimerProps) {
  // Initialize state based on props to avoid initial useEffect update
  const [timeLeft, setTimeLeft] = useState(() => {
    if (!expiresAt) return 0;
    const diff = differenceInSeconds(expiresAt, new Date());
    return Math.max(0, diff);
  });

  const [isExpired, setIsExpired] = useState(() => {
    if (!expiresAt) return false;
    return differenceInSeconds(expiresAt, new Date()) <= 0;
  });

  const expireCallbackCalled = useRef(false);

  useEffect(() => {
    if (!expiresAt) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimeLeft(0);
      setIsExpired(false);
      expireCallbackCalled.current = false;
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = differenceInSeconds(expiresAt, now);

      if (diff <= 0) {
        setTimeLeft(0);
        setIsExpired(true);
        if (onExpire && !expireCallbackCalled.current) {
          onExpire();
          expireCallbackCalled.current = true;
        }
        return 0;
      }

      setTimeLeft(diff);
      setIsExpired(false);
      expireCallbackCalled.current = false;
      return diff;
    };

    // Calculate immediately to handle prop updates
    calculateTimeLeft();

    const timer = setInterval(() => {
      const diff = calculateTimeLeft();
      if (diff <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return {
    minutes,
    seconds,
    isExpired,
    timeLeft, // Total seconds
  };
}
