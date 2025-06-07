import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";

export default function HomePage() {
  return (
    <>
      <Header />
      <div className="flex min-h-screen flex-col items-center justify-center p-4 pt-16">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-600 mb-6">
            BearLink에 오신 것을 환영합니다
          </h1>
          <p className="text-lg md:text-xl mb-8 text-stone-700">
            소중한 링크를 저장하고 관리하세요. 링크룸을 통해 여러분의 웹 경험을
            더욱 풍부하게 만들어보세요.
          </p>

          <div className="flex justify-center space-x-6 mb-12">
            <Link
              href="/main"
              className="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
            >
              시작하기
            </Link>
            <Link
              href="/auth/login"
              className="px-6 py-3 bg-stone-600 text-white rounded-lg font-medium hover:bg-stone-700 transition-colors"
            >
              로그인
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-amber-600 mb-4">
                링크 관리
              </h2>
              <p className="text-stone-700">
                중요한 웹사이트 링크를 한 곳에 저장하고 카테고리별로 관리하세요.
                필요할 때 언제든지 쉽게 찾을 수 있습니다.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-amber-600 mb-4">
                링크룸 공유
              </h2>
              <p className="text-stone-700">
                다른 사용자와 링크룸을 공유하고 협업하세요. 지식과 자료를 함께
                모으고 공유하는 새로운 방식을 경험해보세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
