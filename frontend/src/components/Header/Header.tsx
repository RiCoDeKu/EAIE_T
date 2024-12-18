import { DataItem } from "@/types";
import ImageLoader from "../ImageUploader/ImageUploader";
import PageDetail from "../PageDetail/PageDetail";
import PageEditor from "../PageEditor/PageEditor";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "../ui/drawer";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { currentImgFileAtom, dataAtom } from "@/state/atom";

const Header = () => {
  /////////////// Update and Edit Drawer ////////////////
  const [isOpen, setIsOpen] = useState(false); // Drawerの開閉
  const [loading, setLoading] = useState(false); // ローディング状態
  const [error, setError] = useState<string | null>(null); // エラーメッセージ
  const [pageData, setPageData] = useState<DataItem | null>(null); // 現在のページのData
  const [activeContent, setActiveContent] = useState<
    "edit" | "upload" | "notSelected"
  >("notSelected"); //表示コンテンツの制御

  // グローバル状態からデータを取得
  const currentImgFile = useAtomValue(currentImgFileAtom); // 現在選択されている画像ファイルのIndex
  const data = useAtomValue(dataAtom); // データ配列

  // currentImgFileが指定されていない場合は-1、それ以外はそのIDに基づくページインデックス
  const currentPage = currentImgFile ? currentImgFile - 1 : -1;

  // currentPageが変更されたときにpageDataを更新
  useEffect(() => {
    if (currentPage >= 0 && currentPage < data.length) {
      setPageData(data[currentPage]);
    }
  }, [currentPage, data]);

  // ImageUploaderを押したときの処理
  const handleUploadBtn = () => {
    setActiveContent("upload"); // Uploadコンテンツの表示
    setError(null); // エラーメッセージをリセット
    setIsOpen(true); // Drawerを開く
  };
  // PageEditorを押したときの処理
  const handleEditorBtn = () => {
    setActiveContent("edit"); // Editorコンテンツの表示
    setError(null);
    setIsOpen(true); // Drawerをオープン
  };

  // ErrorのTryボタンを押したときの処理
  const handleErrorBtn = () => {
    setError(null);
    setActiveContent("upload");
  };

  // 確定した時のリセット処理
  const handleDrawerClose = () => {
    setIsOpen(false);
    setError(null);
    setActiveContent("notSelected");
  };

  // currentPageが無効な場合、何も表示しない (Headerをそもそもを表示しないということ)
  if (currentPage < 0 || currentPage >= data.length) {
    return null;
  }

  return (
    <div className="flex justify-center text-2xl gap-10 text-white">
      <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
        {/* Upload用のDrawerTrigger */}
		<DrawerTrigger 
		  onClick={handleUploadBtn} 
		  className="border border-white p-2 rounded-full hover:bg-white hover:text-black transition-colors duration-200 w-40 text-center"
		>
		  新規投稿
		</DrawerTrigger>
        {/* Edit用のDrawerTrigger */}
        <DrawerTrigger 
		onClick={handleEditorBtn}
		className="border border-white p-2 rounded-full hover:bg-white hover:text-black transition-colors duration-200 w-40 text-center"
		>
			編集</DrawerTrigger>

        <DrawerContent className="fixed top-8 flex flex-col items-center">
          <DrawerClose />

          {/* ローディング状態 */}
          {loading && (
            <div>
              <h2>Loading...</h2>
              <p>Please wait while we process your request.</p>
            </div>
          )}

          {/* エラー状態 */}
          {error && (
            <div>
              <h2>Error!</h2>
              <p>{error}</p>
              <button onClick={handleErrorBtn}>Try Again</button>
            </div>
          )}

          {/* アップロード用のコンテンツ */}
          {activeContent === "upload" && !loading && (
            <ImageLoader
              setLoading={setLoading}
              setError={setError}
              setPageData={setPageData}
              onConfirm={handleDrawerClose}
            />
          )}

          {/* Edit用のコンテンツ */}
          {activeContent === "edit" && !loading && pageData && (
            <PageEditor pageData={pageData} onConfirm={handleDrawerClose} />
          )}
        </DrawerContent>
      </Drawer>
      <Drawer>
        <DrawerTrigger
				  className="border border-white p-2 rounded-full hover:bg-white hover:text-black transition-colors duration-200 w-40 text-center"
				  >
					詳細</DrawerTrigger>
        <PageDetail />
      </Drawer>
    </div>
  );
};

export default Header;
