import type { Data } from "@/types";
import { generatePages } from "@/utils/generatePages";
import { atom } from "jotai";

// ダミーデータ(一括取得した時のデータ構造例)
const Data: Data = [
  {
    id: "1",
    title: "Title 1",
    date: "2024-01-01",
    img_server_pass: "/textures/DSC00680.jpg",
    text: "Sample text for DSC00680",
  },
];

// データ配列
export const dataAtom = atom<Data>(Data);

// 現在のページ
export const currentPageAtom = atom<number>(0);

// ページの配列
export const pagesAtom = atom((get) => {
  const data = get(dataAtom); // dataAtom の状態を取得
  return generatePages(data.map((item) => item.img_server_pass));
});

// 画像配列 (カバーあり)
export const imgFilesAtom = atom<string[]>((get) => {
  const pages = get(pagesAtom);
  return pages.flatMap(({ front, back }) => [front, back]);
});

// 現在の画像 (DataのIndexとしても利用している)
export const currentImgFileAtom = atom<number>(0);
