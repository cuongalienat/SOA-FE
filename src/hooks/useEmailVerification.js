import { useState } from "react";

export const useEmailVerification = () => {
  const [isSent, setIsSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendCode = async (email) => {
    setIsLoading(true);
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsSent(true);
        setIsLoading(false);
        resolve();
      }, 1500);
    });
  };

  const verifyCode = async (code) => {
    setIsLoading(true);
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        if (code === "123456") {
          setIsVerified(true);
          resolve(true);
        } else {
          resolve(false);
        }
        setIsLoading(false);
      }, 1500);
    });
  };

  return { isSent, isVerified, isLoading, sendCode, verifyCode };
};
