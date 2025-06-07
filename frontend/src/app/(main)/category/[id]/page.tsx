"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, X, LinkIcon, ArrowLeft, Edit, Trash2 } from "lucide-react";

interface LinkItem {
  id: string;
  title: string;
  url: string;
}

interface Category {
  id: string;
  name: string;
  links: LinkItem[];
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [newLinkData, setNewLinkData] = useState({ title: "", url: "" });
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  // 로컬 스토리지에서 카테고리 데이터 불러오기
  useEffect(() => {
    const loadCategories = () => {
      const savedCategories = localStorage.getItem("categoryLinks");
      if (savedCategories) {
        const categories = JSON.parse(savedCategories);
        setAllCategories(categories);

        const currentCategory = categories.find(
          (cat: Category) => cat.id === categoryId
        );
        if (currentCategory) {
          setCategory(currentCategory);
          setCategoryName(currentCategory.name);
        } else {
          // 카테고리가 없으면 사이드바에서 카테고리 정보 가져오기
          const sidebarCategories = localStorage.getItem("sidebarCategories");
          if (sidebarCategories) {
            const sidebarCats = JSON.parse(sidebarCategories);
            const sidebarCategory = sidebarCats.find(
              (cat: any) => cat.id === categoryId
            );
            if (sidebarCategory) {
              const newCategory: Category = {
                id: sidebarCategory.id,
                name: sidebarCategory.name,
                links: [],
              };
              setCategory(newCategory);
              setCategoryName(newCategory.name);
              // 새 카테고리를 categoryLinks에 추가
              const updatedCategories = [...categories, newCategory];
              setAllCategories(updatedCategories);
              localStorage.setItem(
                "categoryLinks",
                JSON.stringify(updatedCategories)
              );
            }
          }
        }
      } else {
        // categoryLinks가 없으면 사이드바에서 카테고리 정보 가져오기
        const sidebarCategories = localStorage.getItem("sidebarCategories");
        if (sidebarCategories) {
          const sidebarCats = JSON.parse(sidebarCategories);
          const sidebarCategory = sidebarCats.find(
            (cat: any) => cat.id === categoryId
          );
          if (sidebarCategory) {
            const newCategory: Category = {
              id: sidebarCategory.id,
              name: sidebarCategory.name,
              links: [],
            };
            setCategory(newCategory);
            setCategoryName(newCategory.name);
            setAllCategories([newCategory]);
            localStorage.setItem(
              "categoryLinks",
              JSON.stringify([newCategory])
            );
          }
        }
      }
    };

    loadCategories();
  }, [categoryId]);

  // 카테고리 데이터가 변경될 때 로컬 스토리지에 저장
  useEffect(() => {
    if (category && allCategories.length > 0) {
      const updatedCategories = allCategories.map((cat) =>
        cat.id === category.id ? category : cat
      );
      setAllCategories(updatedCategories);
      localStorage.setItem("categoryLinks", JSON.stringify(updatedCategories));
    }
  }, [category]);

  const addLink = () => {
    if (
      !category ||
      newLinkData.title.trim() === "" ||
      newLinkData.url.trim() === ""
    )
      return;

    // URL이 http://나 https://로 시작하지 않으면 자동으로 추가
    let url = newLinkData.url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: newLinkData.title,
      url: url,
    };

    setCategory({
      ...category,
      links: [...category.links, newLink],
    });
    setNewLinkData({ title: "", url: "" });
    setShowAddLinkForm(false);
  };

  const removeLink = (linkId: string) => {
    if (!category) return;

    setCategory({
      ...category,
      links: category.links.filter((link) => link.id !== linkId),
    });
  };

  const updateCategoryName = () => {
    if (!category || categoryName.trim() === "") return;

    const updatedCategory = {
      ...category,
      name: categoryName,
    };

    setCategory(updatedCategory);
    setEditingCategory(false);

    // 사이드바 카테고리 이름도 업데이트
    const sidebarCategories = localStorage.getItem("sidebarCategories");
    if (sidebarCategories) {
      const sidebarCats = JSON.parse(sidebarCategories);
      const updatedSidebarCats = sidebarCats.map((cat: any) =>
        cat.id === category.id ? { ...cat, name: categoryName } : cat
      );
      localStorage.setItem(
        "sidebarCategories",
        JSON.stringify(updatedSidebarCats)
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addLink();
    } else if (e.key === "Escape") {
      setShowAddLinkForm(false);
    }
  };

  const handleCategoryNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      updateCategoryName();
    } else if (e.key === "Escape") {
      setEditingCategory(false);
      setCategoryName(category?.name || "");
    }
  };

  if (!category) {
    return (
      <div className="flex items-center justify-center h-screen bg-amber-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-amber-900">
            카테고리를 찾을 수 없습니다
          </h1>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-amber-50 min-h-screen">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-amber-700 hover:text-amber-900 mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          뒤로 가기
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {editingCategory ? (
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                onKeyDown={handleCategoryNameKeyPress}
                onBlur={updateCategoryName}
                className="text-3xl font-bold bg-transparent border-b-2 border-amber-500 focus:outline-none text-amber-900"
                autoFocus
              />
            ) : (
              <h1 className="text-3xl font-bold flex items-center text-amber-900">
                {category.name}
                <button
                  onClick={() => setEditingCategory(true)}
                  className="ml-3 p-1 text-amber-600 hover:text-amber-800"
                >
                  <Edit size={20} />
                </button>
              </h1>
            )}
          </div>{" "}
          <button
            onClick={() => setShowAddLinkForm(!showAddLinkForm)}
            className="flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
          >
            <Plus size={20} className="mr-2" />
            링크 추가
          </button>
        </div>

        <p className="text-amber-700 mt-2">
          총 {category.links.length}개의 링크
        </p>
      </div>

      {showAddLinkForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-amber-200">
          <h3 className="text-lg font-medium mb-4 text-amber-900">
            새 링크 추가
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              value={newLinkData.title}
              onChange={(e) =>
                setNewLinkData({ ...newLinkData, title: e.target.value })
              }
              placeholder="링크 제목"
              className="w-full p-3 bg-amber-50 rounded border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900"
              autoFocus
            />
            <div className="flex">
              <input
                type="text"
                value={newLinkData.url}
                onChange={(e) =>
                  setNewLinkData({ ...newLinkData, url: e.target.value })
                }
                onKeyDown={handleKeyPress}
                placeholder="URL (예: google.com)"
                className="flex-grow p-3 bg-amber-50 rounded-l border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900"
              />
              <button
                onClick={addLink}
                className="px-6 bg-amber-600 hover:bg-amber-700 text-white rounded-r transition-colors"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {category.links.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <LinkIcon size={48} className="mx-auto text-amber-400 mb-4" />
            <h3 className="text-lg font-medium text-amber-700 mb-2">
              링크가 없습니다
            </h3>
            <p className="text-amber-600">첫 번째 링크를 추가해보세요!</p>
          </div>
        ) : (
          category.links.map((link) => (
            <div
              key={link.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow group border border-amber-200"
            >
              <div className="flex justify-between items-start mb-3">
                <LinkIcon size={20} className="text-amber-700 flex-shrink-0" />
                <button
                  onClick={() => removeLink(link.id)}
                  className="p-1 text-amber-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`${link.title} 링크 삭제`}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {" "}
                <h3 className="font-medium text-amber-900 mb-2 hover:text-amber-700 transition-colors">
                  {link.title}
                </h3>
                <p className="text-sm text-amber-600 truncate">{link.url}</p>
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
