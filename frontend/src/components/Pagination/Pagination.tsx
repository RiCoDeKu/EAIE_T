import {
  currentPageAtom,
  dataAtom,
  currentImgFileAtom,
  imgFilesAtom,
} from "@/state/atom";
import { useAtom } from "jotai";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

/////////////////////////// Pagenation コンポーネント /////////////////////////////
const Pagination = () => {
  const [, setCurrentPage] = useAtom(currentPageAtom);
  const [flattenedPages] = useAtom(imgFilesAtom);
  const [currentImgFile, setCurrentImgFile] = useAtom(currentImgFileAtom);
  const [data] = useAtom(dataAtom);

  // ページをクリックした際の処理
  const handlePageClick = (index: number) => {
    setCurrentImgFile(index); // 押されたインデックスを保存
    if (data.length % 2 !== 0 && index === flattenedPages.length - 2) {
      // dataが奇数の場合で、indexがflattenedPages.length - 2の時
      setCurrentPage(Math.floor((index + 1) / 2) + 1); // 1を足す
    } else {
      // 偶数の場合、またはそれ以外の奇数の場合
      setCurrentPage(Math.floor((index + 1) / 2)); // 通常の計算
    }
  };

  // ページボタンのラベルを張る処理
  const handlePageLabel = (index: number): string => {
    if (index === 0) {
      return "Cover";
    } else if (
      // 偶奇で場合分け (最後のページの場合分け)
      data.length % 2 === 0
        ? index === flattenedPages.length - 1
        : index === flattenedPages.length - 2
    ) {
      return "Back Cover";
    }

    const formattedDate = new Date(data[index - 1].date);
    const month = formattedDate.getMonth() + 1; // getMonth()は0から始まるので、+1して月を調整
    const day = formattedDate.getDate();

    const dateString = `${month}月${day}日`;
    return `${dateString}`;
  };

  return (
    <ScrollArea className="w-2/5 whitespace-nowrap overflow-x-auto">
      <div className="flex w-max space-x-4 p-4">
        {/* 奇数のときは，最後の要素を除く (最後のページの場合分け)*/}
        {(data.length % 2 === 0
          ? flattenedPages
          : flattenedPages.slice(0, -1)
        ).map((_, index) => (
          <div className="shrink-0" key={index}>
            <div className="overflow-hidden rounded-md">
              <button
                key={index}
                className={`border-transparent hover:border-white transition-all duration-300 px-4 py-3 rounded-full text-lg uppercase border ${
                  index === currentImgFile
                    ? "bg-white/90 text-black"
                    : "bg-black/30 text-white"
                }`}
                onClick={() => handlePageClick(index)}
              >
                {handlePageLabel(index)}
              </button>
            </div>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default Pagination;
