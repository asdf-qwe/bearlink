"use client";

import { useState, useEffect } from "react";
import { Plus, X, Folder, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSidebar } from "@/context/SidebarContext";

interface Category {
  id: string;
  name: string;
}

export default function Sidebar() {
  const { isOpen, setIsOpen } = useSidebar();
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "즐겨찾기" },
    { id: "2", name: "개발 관련" },
  ]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);

  // 로컬 스토리지에서 카테고리 항목들 불러오기
  useEffect(() => {
    const savedCategories = localStorage.getItem("sidebarCategories");
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  // 카테고리 항목이 변경될 때 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem("sidebarCategories", JSON.stringify(categories));
  }, [categories]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleAddCategoryForm = () => {
    setShowAddCategoryForm(!showAddCategoryForm);
    setNewCategoryName("");
  };

  const addCategory = () => {
    if (newCategoryName.trim() === "") return;

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName,
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    setShowAddCategoryForm(false);
  };

  const removeCategory = (categoryId: string) => {
    setCategories(categories.filter((category) => category.id !== categoryId));
  };

  const handleCategoryKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addCategory();
    } else if (e.key === "Escape") {
      setShowAddCategoryForm(false);
    }
  };
  return (
    <div
      className={`sidebar-container ${
        isOpen ? "w-52" : "w-16"
      } h-screen text-white transition-all duration-300 fixed left-0 top-16 border-r border-stone-300 z-40 overflow-y-auto`}
      style={{ backgroundColor: isOpen ? "#907761" : "#907761" }}
    >
      <div className="p-3">
        {" "}
        <button
          onClick={toggleSidebar}
          className={`mb-4 transition-all duration-200 ${
            isOpen
              ? "text-white hover:text-amber-200"
              : "text-stone-800 hover:text-stone-600"
          }`}
          aria-label={isOpen ? "접기" : "펼치기"}
        >
          {isOpen ? "◀" : "▶"}
        </button>
        {isOpen && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">카테고리</h2>{" "}
              <button
                onClick={toggleAddCategoryForm}
                className="p-1 bg-stone-600 hover:bg-stone-700 text-white rounded-full transition-colors"
                aria-label="카테고리 추가 폼 열기"
              >
                <Plus size={16} />
              </button>
            </div>

            {showAddCategoryForm && (
              <div className="mb-4">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={handleCategoryKeyPress}
                  placeholder="새 카테고리 이름 입력 후 Enter"
                  className="w-full p-2 bg-white rounded border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                  aria-label="새 카테고리 이름 입력"
                  autoFocus
                />
              </div>
            )}

            <div className="space-y-1">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex justify-between items-center p-2 border border-amber-200 rounded-md hover:bg-amber-900 hover:bg-opacity-30 transition-colors group"
                >
                  <Link
                    href={`/category/${category.id}`}
                    className="flex items-center space-x-2 flex-grow"
                  >
                    {" "}
                    <Folder size={18} className="text-amber-200" />
                    <span className="font-medium text-white">
                      {category.name}
                    </span>
                  </Link>
                  <button
                    onClick={() => removeCategory(category.id)}
                    className="p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`${category.name} 카테고리 삭제`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {categories.length === 0 && (
                <p className="text-center text-amber-200 p-4">
                  카테고리가 없습니다. 새 카테고리를 추가해보세요!
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
