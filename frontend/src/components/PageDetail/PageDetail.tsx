import { dataAtom, currentImgFileAtom } from "@/state/atom";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useAtom } from "jotai";

const PageDetail = () => {
  const [currentImgeFile] = useAtom(currentImgFileAtom);
  const [data] = useAtom(dataAtom);

  // データの表示 (DEBUG)
  const indexData = currentImgeFile ? currentImgeFile - 1 : -1;
  if (indexData < 0 || indexData >= data.length) {
    return;
  }

  return (
    <>
      <DrawerContent className="fixed top-8 flex flex-col items-center p-6  z-50">
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-5xl font-bold text-slate-300">
            {data[indexData].title}
          </DrawerTitle>
          <DrawerDescription className="text-sm text-slate-300">
            {data[indexData].date}
          </DrawerDescription>

          {/* 画像の表示部分 */}

          <div className="mt-4">
            <h3>Image Preview:</h3>
            <img
              src={data[indexData].img_server_pass}
              alt="Preview"
              className="mt-2 max-w-full h-auto rounded"
            />
          </div>

          {/* 閉じるボタンを右上端に配置 */}
          <DrawerClose asChild>
            <button
              aria-label="Close"
              className="absolute top-4 right-4 text-5xl bg-none border-none cursor-pointer"
            >
              &times;
            </button>
          </DrawerClose>
        </DrawerHeader>

        <DrawerDescription className="text-center text-slate-300">
          {data[indexData].text}
        </DrawerDescription>
        <DrawerFooter className="mt-4"></DrawerFooter>
      </DrawerContent>
    </>
  );
};

export default PageDetail;
