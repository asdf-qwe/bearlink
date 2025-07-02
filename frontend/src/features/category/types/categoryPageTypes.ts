export interface LinkItem {
  id: number;
  title: string;
  url: string;
  thumbnailImageUrl?: string;
}

export interface CategoryWithLinks {
  id: number;
  name: string;
  links: LinkItem[];
}

export interface NewLinkData {
  title: string;
  url: string;
}

export interface CategoryPageState {
  category: CategoryWithLinks | null;
  newLinkData: NewLinkData;
  showAddLinkForm: boolean;
  editingCategory: boolean;
  categoryName: string;
  loading: boolean;
  addingLink: boolean;
  deletingLinkId: number | null;
  error: string | null;
  categoryIndex: number;
  editingLinkId: number | null;
  editingLinkTitle: string;
  videoIds: string[];
}
