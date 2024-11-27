import type { Data } from "@/types";
import { generatePages } from "@/utils/generatePages";
import { atom } from "jotai";
// import { getAllData } from "@/api/getAllData";

// ダミーデータ(一括取得した時のデータ構造例)
const Data: Data = [
  {
    id: "1",
    title: "Title 1",
    date: "2024-01-01",
    img_server_pass: "DSC00680",
    text: "Sample text for DSC00680",
  },
  // {
  //   id: "2",
  //   title: "Title 2",
  //   date: "2024-01-02",
  //   img_server_pass: "DSC00933",
  //   text: "Sample text for DSC00933",
  // },
  // {
  //   id: "3",
  //   title: "Title 3",
  //   date: "2024-01-03",
  //   img_server_pass: "DSC00966",
  //   text: "Sample text for DSC00966",
  // },
  // {
  //   id: "4",
  //   title: "Title 4",
  //   date: "2024-01-04",
  //   img_server_pass: "DSC00983",
  //   text: "Sample text for DSC00983",
  // },
  // {
  //   id: "5",
  //   title: "Title 5",
  //   date: "2024-01-05",
  //   img_server_pass: "DSC01011",
  //   text: "Sample text for DSC01011",
  // },
  // {
  //   id: "6",
  //   title: "Title 6",
  //   date: "2024-01-06",
  //   img_server_pass: "DSC01040",
  //   text: "Sample text for DSC01040",
  // },
  // {
  //   id: "7",
  //   title: "Title 7",
  //   date: "2024-01-07",
  //   img_server_pass: "DSC01064",
  //   text: "Sample text for DSC01064",
  // },
  // {
  //   id: "8",
  //   title: "Title 8",
  //   date: "2024-01-08",
  //   img_server_pass: "DSC01071",
  //   text: "Sample text for DSC01071",
  // },
  // {
  //   id: "9",
  //   title: "Title 9",
  //   date: "2024-01-09",
  //   img_server_pass: "DSC01103",
  //   text: "Sample text for DSC01103",
  // },
  // {
  //   id: "10",
  //   title: "Title 10",
  //   date: "2024-01-10",
  //   img_server_pass: "DSC01145",
  //   text: "Sample text for DSC01145",
  // },
  // {
  //   id: "11",
  //   title: "Title 11",
  //   date: "2024-01-11",
  //   img_server_pass: "DSC01420",
  //   text: "Sample text for DSC01420",
  // },
  // {
  //   id: "12",
  //   title: "Title 12",
  //   date: "2024-01-12",
  //   img_server_pass: "DSC01461",
  //   text: "Sample text for DSC01461",
  // },
  // {
  //   id: "13",
  //   title: "Title 13",
  //   date: "2024-01-13",
  //   img_server_pass: "DSC01489",
  //   text: "Sample text for DSC01489",
  // },
  // {
  //   id: "14",
  //   title: "Title 14",
  //   date: "2024-01-14",
  //   img_server_pass: "DSC02031",
  //   text: "Sample text for DSC02031",
  // },
  // {
  //   id: "15",
  //   title: "Title 15",
  //   date: "2024-01-15",
  //   img_server_pass: "DSC02064",
  //   text: "Sample text for DSC02064",
  // },
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
