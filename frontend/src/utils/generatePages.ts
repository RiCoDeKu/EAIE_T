import { Pages } from "@/types";

// 本の裏表を考慮したページ(グローバルに読み取り可)
export const generatePages = (pictures: string[]): Pages => {
  const pages = pictures.reduce((acc, _, i, arr) => {
    if (i === 0) {
      acc.push({ front: "book-cover", back: arr[0] });
    } else if (i % 2 === 1 && i < arr.length - 1) {
      acc.push({ front: arr[i], back: arr[i + 1] });
    }
    return acc;
  }, [] as Pages);

  if (pictures.length % 2 == 0) {
    // 偶数枚の画像の時は，ちょうど
    pages.push({ front: pictures[pictures.length - 1], back: "book-back" });
  } else {
    // 奇数枚の画像の時は，1ページ分余る．
    pages.push({ front: "book-back", back: "book-back" });
  }

  return pages;
};
