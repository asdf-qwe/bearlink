"use client";

import { useEffect, useRef, useState } from "react";
import { IoPlaySkipBackSharp, IoPlaySkipForwardSharp, IoPlay, IoPause } from "react-icons/io5";

interface YouTubePlayerProps {
  videoIds: string[];
}

export default function YouTubePlayer({ videoIds }: YouTubePlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstance = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [currentVideoTitle, setCurrentVideoTitle] = useState<string>("");
  const [videoTitles, setVideoTitles] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  // videoIds가 변경될 때 인덱스 리셋
  useEffect(() => {
    setCurrentIndex(0);
    currentIndexRef.current = 0;
    // 비디오 제목 배열도 초기화
    setVideoTitles(videoIds.map((_, index) => `비디오 ${index + 1}`));
  }, [videoIds]);

  // currentIndex가 변경될 때 ref도 업데이트
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // YouTube API 로드 및 플레이어 초기화
  useEffect(() => {
    if (typeof window === "undefined" || !videoIds.length) return;

    const initializePlayer = () => {
      if (!playerRef.current) return;

      // 기존 플레이어가 있다면 제거
      if (playerInstance.current) {
        try {
          playerInstance.current.destroy();
        } catch (e) {
          console.warn("YouTube player destroy error:", e);
        }
        playerInstance.current = null;
      }

      // 새 플레이어 생성
      loadPlayer(videoIds[0]);
    };

    // 이미 YouTube API가 로드되어 있는지 확인
    if ((window as any).YT && (window as any).YT.Player) {
      initializePlayer();
      return;
    }

    // YouTube API 스크립트가 이미 있는지 확인
    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]'
    );
    if (!existingScript) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // API 준비 시 실행될 전역 함수
    (window as any).onYouTubeIframeAPIReady = () => {
      initializePlayer();
    };

    return () => {
      // 컴포넌트 언마운트 시 정리
      if (playerInstance.current) {
        try {
          playerInstance.current.destroy();
        } catch (e) {
          console.warn("YouTube player cleanup error:", e);
        }
        playerInstance.current = null;
      }
    };
  }, [videoIds]);

  // 키보드 단축키 이벤트 처리
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // 입력 필드나 다른 상호작용 요소에 포커스가 있을 때는 단축키 비활성화
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          playPreviousVideo();
          break;
        case "ArrowRight":
          event.preventDefault();
          playNextVideo();
          break;
        case " ":
          event.preventDefault();
          // 스페이스바로 재생/일시정지
          togglePlayPause();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [isPlayerReady]);

  // 비디오 제목 업데이트 헬퍼 함수
  const updateVideoTitle = (index: number, fallbackTitle?: string) => {
    try {
      const title =
        playerInstance.current?.getVideoData()?.title ||
        fallbackTitle ||
        `비디오 ${index + 1}`;
      setCurrentVideoTitle(title);

      // 비디오 제목 배열도 업데이트
      setVideoTitles((prev) => {
        const newTitles = [...prev];
        newTitles[index] = title;
        return newTitles;
      });
    } catch (e) {
      const fallback = fallbackTitle || `비디오 ${index + 1}`;
      setCurrentVideoTitle(fallback);
      setVideoTitles((prev) => {
        const newTitles = [...prev];
        newTitles[index] = fallback;
        return newTitles;
      });
    }
  };

  // YouTube 비디오 제목을 미리 가져오는 함수 (선택적)
  const preloadVideoTitles = async () => {
    if (!videoIds.length) return;

    try {
      // YouTube Data API v3를 사용하여 제목들을 한 번에 가져오기
      // API 키가 필요하므로 여기서는 간단한 방법으로 구현
      const titles = await Promise.all(
        videoIds.map(async (videoId, index) => {
          try {
            // 간단한 방법: oEmbed API 사용 (API 키 불필요)
            const response = await fetch(
              `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
            );
            if (response.ok) {
              const data = await response.json();
              return data.title || `비디오 ${index + 1}`;
            }
          } catch (e) {
            console.warn(`비디오 ${videoId} 제목 가져오기 실패:`, e);
          }
          return `비디오 ${index + 1}`;
        })
      );

      setVideoTitles(titles);
    } catch (error) {
      console.warn("비디오 제목 미리 로드 실패:", error);
    }
  };

  // 컴포넌트 마운트 시 제목들을 미리 로드
  useEffect(() => {
    if (videoIds.length > 0) {
      preloadVideoTitles();
    }
  }, [videoIds]);

  // 다음 비디오로 넘어가기
  const playNextVideo = () => {
    if (!videoIds.length) return;

    const nextIndex = (currentIndexRef.current + 1) % videoIds.length;
    console.log(
      `다음 비디오로 이동: ${currentIndexRef.current} -> ${nextIndex}`
    );

    setCurrentIndex(nextIndex);
    currentIndexRef.current = nextIndex;

    if (playerInstance.current && playerInstance.current.loadVideoById) {
      try {
        playerInstance.current.loadVideoById(videoIds[nextIndex]);
        // 제목 업데이트를 위해 약간의 지연 후 시도
        setTimeout(() => {
          updateVideoTitle(nextIndex);
        }, 1000);
      } catch (e) {
        console.error("비디오 로드 실패:", e);
        // 플레이어를 다시 초기화
        loadPlayer(videoIds[nextIndex]);
      }
    }
  };

  // 이전 비디오로 넘어가기
  const playPreviousVideo = () => {
    if (!videoIds.length) return;

    const prevIndex =
      currentIndexRef.current === 0
        ? videoIds.length - 1
        : currentIndexRef.current - 1;

    console.log(
      `이전 비디오로 이동: ${currentIndexRef.current} -> ${prevIndex}`
    );

    setCurrentIndex(prevIndex);
    currentIndexRef.current = prevIndex;

    if (playerInstance.current && playerInstance.current.loadVideoById) {
      try {
        playerInstance.current.loadVideoById(videoIds[prevIndex]);
        // 제목 업데이트를 위해 약간의 지연 후 시도
        setTimeout(() => {
          updateVideoTitle(prevIndex);
        }, 1000);
      } catch (e) {
        console.error("비디오 로드 실패:", e);
        // 플레이어를 다시 초기화
        loadPlayer(videoIds[prevIndex]);
      }
    }
  };

  // 특정 인덱스의 비디오로 이동
  const playVideoAtIndex = (index: number) => {
    if (!videoIds.length || index < 0 || index >= videoIds.length) return;

    console.log(`특정 비디오로 이동: ${currentIndexRef.current} -> ${index}`);

    setCurrentIndex(index);
    currentIndexRef.current = index;

    if (playerInstance.current && playerInstance.current.loadVideoById) {
      try {
        playerInstance.current.loadVideoById(videoIds[index]);
        // 제목 업데이트를 위해 약간의 지연 후 시도
        setTimeout(() => {
          updateVideoTitle(index);
        }, 1000);
      } catch (e) {
        console.error("비디오 로드 실패:", e);
        // 플레이어를 다시 초기화
        loadPlayer(videoIds[index]);
      }
    }
  };

  // 재생/일시정지 토글
  const togglePlayPause = () => {
    if (!playerInstance.current) return;

    try {
      const state = playerInstance.current.getPlayerState();
      if (state === (window as any).YT?.PlayerState?.PLAYING) {
        playerInstance.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerInstance.current.playVideo();
        setIsPlaying(true);
      }
    } catch (e) {
      console.error("재생/일시정지 토글 실패:", e);
    }
  };

  // 영상 재생 로직
  const loadPlayer = (videoId: string) => {
    if (!playerRef.current || !videoId) return;

    console.log(`새 플레이어 생성 - 비디오 ID: ${videoId}`);

    // 플레이어 컨테이너 초기화
    playerRef.current.innerHTML = "";

    playerInstance.current = new (window as any).YT.Player(playerRef.current, {
      height: "480",
      width: "854",
      videoId,
      playerVars: {
        autoplay: 1,
        mute: 1,
        controls: 1,
        rel: 0,
        showinfo: 0,
        modestbranding: 1,
      },
      events: {
        onReady: (event: any) => {
          console.log("YouTube 플레이어 준비 완료");
          setIsPlayerReady(true);
          setIsPlaying(true);
          // 비디오 제목 가져오기
          updateVideoTitle(currentIndexRef.current);
          event.target.playVideo();
        },
        onStateChange: (event: any) => {
          console.log("플레이어 상태 변경:", event.data);
          
          // 재생 상태 업데이트
          if (event.data === (window as any).YT.PlayerState.PLAYING) {
            setIsPlaying(true);
          } else if (event.data === (window as any).YT.PlayerState.PAUSED) {
            setIsPlaying(false);
          }

          if (event.data === (window as any).YT.PlayerState.ENDED) {
            console.log("비디오 종료됨, 다음 비디오로 이동");
            setIsPlaying(false);
            playNextVideo();
          }
        },
        onError: (event: any) => {
          console.error("YouTube 플레이어 오류:", event.data);
          // 오류 발생 시 다음 비디오로 넘어가기
          setTimeout(() => {
            playNextVideo();
          }, 2000);
        },
      },
    });
  };

  if (!videoIds.length) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-500">재생할 비디오가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="youtube-player-container">
      {/* 메인 레이아웃: 왼쪽 플레이어, 오른쪽 플레이리스트 */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 왼쪽: 플레이어 섹션 */}
        <div className="flex-1 min-w-0">
          {/* 현재 비디오 제목 */}
          {currentVideoTitle && (
            <div className="mb-3">
              <h3
                className="text-lg font-semibold text-amber-900 truncate"
                title={currentVideoTitle}
              >
                🎵 {currentVideoTitle}
              </h3>
            </div>
          )}

          {/* 현재 재생 정보 및 키보드 단축키 */}
          <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-sm text-gray-600">
              현재 재생 중: {currentIndex + 1} / {videoIds.length}
            </div>
            {isPlayerReady && (
              <div className="text-xs text-gray-500">
                ← 이전 영상 / SpaceBar 재생, 일시정지 / → 다음 영상
              </div>
            )}
          </div>

          {/* YouTube 플레이어 */}
          <div className="relative">
            <div
              ref={playerRef}
              className="w-full h-[320px] sm:h-[400px] lg:h-[480px] bg-black rounded-lg overflow-hidden flex items-center justify-center"
              style={{
                minHeight: "320px",
                maxWidth: "100%",
              }}
            ></div>

            {/* 로딩 상태 */}
            {!isPlayerReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500">플레이어 로딩 중...</p>
              </div>
            )}
          </div>

          {/* 플레이어 컨트롤 버튼들 */}
          <div className="mt-4 flex items-center justify-center space-x-8">
            <button
              onClick={playPreviousVideo}
              disabled={!isPlayerReady}
              className="flex items-center justify-center p-2 text-black hover:text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              title="이전 동영상 (←)"
            >
              <IoPlaySkipBackSharp size={20} />
            </button>

            <button
              onClick={togglePlayPause}
              disabled={!isPlayerReady}
              className="flex items-center justify-center p-2 text-black hover:text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              title={isPlaying ? "일시정지 (스페이스바)" : "재생 (스페이스바)"}
            >
              {isPlaying ? <IoPause size={24} /> : <IoPlay size={24} />}
            </button>

            <button
              onClick={playNextVideo}
              disabled={!isPlayerReady}
              className="flex items-center justify-center p-2 text-black hover:text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              title="다음 동영상 (→)"
            >
              <IoPlaySkipForwardSharp size={20} />
            </button>
          </div>
        </div>

        {/* 오른쪽: 플레이리스트 */}
        <div className="w-full lg:w-80 xl:w-96">
          <div className="bg-white rounded-lg shadow-md p-4 h-fit">
            <h4 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
              📃 플레이리스트 ({videoIds.length}개)
            </h4>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {videoIds.map((videoId, index) => (
                <button
                  key={index}
                  onClick={() => playVideoAtIndex(index)}
                  disabled={!isPlayerReady}
                  className={`w-full p-3 text-left rounded-lg transition-all ${
                    index === currentIndex
                      ? "bg-amber-100 border-2 border-amber-500 shadow-md"
                      : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                  title={`${index + 1}번째 동영상으로 이동`}
                >
                  <div className="flex items-center space-x-3">
                    {/* 재생 인디케이터 */}
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        index === currentIndex
                          ? "bg-amber-600 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {index === currentIndex ? (
                        <IoPlay size={16} />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>

                    {/* 비디오 정보 */}
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-medium text-gray-900 truncate"
                        title={videoTitles[index]}
                      >
                        {videoTitles[index]}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {index + 1}번째 비디오
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* 진행 표시 바 */}
            {videoIds.length > 1 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>진행률</span>
                  <span>
                    {Math.round(((currentIndex + 1) / videoIds.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentIndex + 1) / videoIds.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
