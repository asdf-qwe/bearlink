import React, { useState, useEffect } from "react";
import { getFavicon, findBestFavicon } from "@/utils/faviconUtils";

interface FaviconProps {
  url: string;
  fallbackIcon?: string;
  size?: number;
  className?: string;
  alt?: string;
  useAdvancedSearch?: boolean; // 고급 검색 사용 여부
}

export const Favicon: React.FC<FaviconProps> = ({
  url,
  fallbackIcon,
  size = 32,
  className = "",
  alt = "사이트 아이콘",
  useAdvancedSearch = false,
}) => {
  const [faviconUrl, setFaviconUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadFavicon = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        if (useAdvancedSearch) {
          // 고급 검색: 여러 소스를 시도해서 가장 좋은 파비콘 찾기
          const bestFavicon = await findBestFavicon(url);
          if (bestFavicon) {
            setFaviconUrl(bestFavicon);
          } else {
            setHasError(true);
          }
        } else {
          // 간단한 방법: Google Favicon API 사용 (권장)
          const googleFavicon = getFavicon(url, size);
          setFaviconUrl(googleFavicon);
        }
      } catch (error) {
        console.error("파비콘 로드 실패:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (url) {
      loadFavicon();
    } else {
      setIsLoading(false);
      setHasError(true);
    }
  }, [url, size, useAdvancedSearch]);

  const handleImageError = () => {
    setHasError(true);
  };

  if (isLoading) {
    return (
      <div
        className={`animate-pulse bg-gray-200 rounded ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (hasError || !faviconUrl) {
    return fallbackIcon ? (
      <img
        src={fallbackIcon}
        alt={alt}
        className={className}
        style={{ width: size, height: size }}
      />
    ) : (
      <div
        className={`bg-gray-300 rounded flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-gray-500 text-xs">🌐</span>
      </div>
    );
  }

  return (
    <img
      src={faviconUrl}
      alt={alt}
      className={className}
      style={{ width: size, height: size }}
      onError={handleImageError}
    />
  );
};
