export function isAndroid(): boolean {
  return (
    typeof navigator !== "undefined" && /android/i.test(navigator.userAgent)
  );
}

export function isIphone(): boolean {
  return typeof navigator !== "undefined" && /iPhone/.test(navigator.userAgent);
}

export function isIPad(): boolean {
  return typeof navigator !== "undefined" && /iPad/.test(navigator.userAgent);
}

export function isIOS(): boolean {
  return isIphone() || isIPad();
}

export function isMobile(): boolean {
  return isAndroid() || isIphone();
}

export function isDesktop(): boolean {
  return (
    typeof navigator !== "undefined" &&
    !/android|webOS|iPhone|iPad|iPod|blackberry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
}
