export {};

declare global {
  interface Window {
    electronAPI?: {
      openExternal: (url: string) => void;
    };
  }
}
