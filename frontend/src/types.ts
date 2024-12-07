/////////////// グローバルステート ////////////////
// Dataオブジェクト
export interface DataItem {
  id: string;
  title: string;
  date: string;
  img_server_pass: string;
  text: string;
  weather_prediction: string;
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
  enable_ai: "true" | "false";
  imageFile: File | null; // アップロードする画像ファイル
  image_filter: string; // 適用するイメージフィルター
}

// アップロードされたデータの型定義 (Edit や Uploaderで使用)
export interface UploadedData {
  title: string;
  text: string;
  img_server_pass: string;
  date: string;
}
