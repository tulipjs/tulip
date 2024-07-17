import { OS } from "../enums";
import { DESKTOP_OS_LIST, MOBILE_OS_LIST } from "../consts";

export const getOS = () => {
  const { userAgent, platform } = navigator;

  // Check for iOS
  if (
    /iPad|iPhone|iPod/.test(platform) ||
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  )
    return OS.IOS;

  // Check for macOS
  if (platform.startsWith("Mac") || /Mac/.test(userAgent)) return OS.DARWIN;

  // Check for Windows
  if (platform.startsWith("Win") || /Win/.test(userAgent)) return OS.WINDOWS;

  // Check for Android
  if (/Android/.test(userAgent)) return OS.ANDROID;

  // Check for Linux
  if (/Linux/.test(platform)) return OS.LINUX;

  return OS.UNKNOWN;
};

export const isDesktop = () => DESKTOP_OS_LIST.includes(getOS());
export const isMobile = () => MOBILE_OS_LIST.includes(getOS());
