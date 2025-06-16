"use client";

interface BackgroundCardProps {
  imageUrl: string;
  title?: string;
  description?: string;
  className?: string;
}

export default function BackgroundCard({
  imageUrl,
  title,
  description,
  className = "",
}: BackgroundCardProps) {
  console.log("Rendering BackgroundCard with imageUrl:", imageUrl);

  return (
    <div
      className={`relative rounded-lg overflow-hidden shadow-lg min-h-[16rem] ${className}`}
      style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url("${imageUrl}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#8B5A3C", // 폴백 색상
      }}
    >
      {/* 텍스트 콘텐츠 */}
      {(title || description) && (
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
          {title && (
            <h3 className="text-2xl font-bold mb-2 text-center drop-shadow-lg">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-center drop-shadow-md opacity-90">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
