import { v4 as uuidv4 } from "uuid";
import { SESSION_ID_KEY } from "../constants";

export const getSessionId = (): string => {
  if (typeof window === "undefined") {
    return "";
  }

  let sessionId = localStorage.getItem(SESSION_ID_KEY);

  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }

  return sessionId;
};

export const clearSessionId = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_ID_KEY);
  }
};
