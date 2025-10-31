/**
 * 웹사이트의 파비콘을 가져오는 유틸리티 함수들
 */

/**
 * URL에서 도메인 추출
 */
export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return "";
  }
};

/**
 * Google Favicon API를 사용하여 파비콘 URL 생성
 * 가장 안정적이고 빠른 방법
 */
export const getGoogleFaviconUrl = (url: string, size: number = 32): string => {
  const domain = extractDomain(url);
  if (!domain) return "";

  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
};

/**
 * 여러 파비콘 소스를 시도하는 함수
 */
export const getFaviconUrls = (url: string): string[] => {
  const domain = extractDomain(url);
  if (!domain) return [];

  return [
    // Google Favicon API (여러 사이즈)
    `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,

    // 사이트 직접 파비콘 경로들
    `https://${domain}/favicon.ico`,
    `https://${domain}/favicon.png`,
    `https://${domain}/apple-touch-icon.png`,
    `https://${domain}/apple-touch-icon-180x180.png`,

    // 다른 파비콘 서비스들
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://www.google.com/s2/favicons?domain=${domain}`,
  ];
};

/**
 * 파비콘이 로드되는지 확인하는 함수
 */
export const checkFaviconExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;

    // 타임아웃 설정 (3초)
    setTimeout(() => resolve(false), 3000);
  });
};

/**
 * 가장 좋은 파비콘을 찾는 함수
 */
export const findBestFavicon = async (url: string): Promise<string | null> => {
  const faviconUrls = getFaviconUrls(url);

  for (const faviconUrl of faviconUrls) {
    const exists = await checkFaviconExists(faviconUrl);
    if (exists) {
      return faviconUrl;
    }
  }

  return null;
};

/**
 * 간단하게 Google Favicon API만 사용하는 함수 (권장)
 */
export const getFavicon = (url: string, size: number = 32): string => {
  return getGoogleFaviconUrl(url, size);
};
