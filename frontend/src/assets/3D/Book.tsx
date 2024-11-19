import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { currentPageAtom, pagesAtom } from "@/state/atom";
import Page from "./Page";

////////////////////// 本コンポーネント(ページ: n 枚)//////////////////////////
function Book({ ...props }) {
  const [page] = useAtom(currentPageAtom);
  const [pages] = useAtom(pagesAtom);
  const [delayedPage, setDelayedPage] = useState(page); // 遅延更新用のページ状態

  // ページの遅延更新処理
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    // 目的のページに到達するまで遅延しながらページを移動する関数
    const goToPage = () => {
      setDelayedPage((delayedPage) => {
        if (page === delayedPage) {
          // 目的のページに到達した場合はそのまま
          return delayedPage;
        } else {
          // 目的のページに達するまで再帰的にgoToPageを実行
          timeout = setTimeout(
            () => {
              goToPage();
            },
            Math.abs(page - delayedPage) > 2 ? 50 : 150 // 差が大きい場合は早く、小さい場合は遅くめくる
          );
          if (page > delayedPage) {
            return delayedPage + 1; // ページを次に進める
          }
          if (page < delayedPage) {
            return delayedPage - 1; // ページを戻す
          }
        }
        return delayedPage; // どの条件にも該当しない場合、遅延ページをそのまま返す (typescript君のせいで追加)
      });
    };
    goToPage();

    // クリーンアップ処理: コンポーネントがアンマウントされるときにタイマーをクリア
    return () => {
      clearTimeout(timeout);
    };
  }, [page]); // pageが更新されるたびにこのeffectが再実行される

  return (
    <group {...props} rotation-y={-Math.PI / 2}>
      {[...pages].map((pageData, index) => (
        <Page
          key={index}
          page={delayedPage} // 遅延状態のページ番号
          number={index} // 各ページのインデックス
          opened={delayedPage > index} // ページが開かれているかどうか
          bookClosed={delayedPage === 0 || delayedPage == pages.length}
          {...pageData}
        />
      ))}
    </group>
  );
}

export default Book;
