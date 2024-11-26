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
          <DrawerTitle className="text-5xl font-bold">
            {data[indexData].title}
          </DrawerTitle>
          <DrawerDescription className="text-sm text-gray-500">
            {data[indexData].date}
          </DrawerDescription>

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

        <DrawerDescription className="text-center text-gray-700">
          {data[indexData].text}
        </DrawerDescription>
        <DrawerFooter className="mt-4"></DrawerFooter>
      </DrawerContent>
    </>
  );
};

export default PageDetail;
