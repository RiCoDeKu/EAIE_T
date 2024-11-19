/////////////// グローバルステート ////////////////
// Dataオブジェクト
export interface DataItem {
  id: number;
  title: string;
  date: string;
  img_server_pass: string;
  text: string;
}
// Data配列
export type Data = DataItem[];

// Pageオブジェクト
export interface Page {
  front: string; // 表面
  back: string; // 裏面
}
export type Pages = Page[];

////////////////////////////////

// API への入力Format (ImageLoader)
export interface UploadImageParams {
  title: string; // タイトル
  imageFile: File | null; // アップロードする画像ファイル
  date: string; // 日付
  effect: string; // 選択されたエフェクト
}

// アップロードされたデータの型定義 (Edit や Uploaderで使用)
export interface UploadedData {
  title: string;
  text: string;
  img_server_pass: string;
  date: string;
}
