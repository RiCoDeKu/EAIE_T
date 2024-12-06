import {
  DrawerClose,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface DrawerContainerProps {
  title: string;
  children: React.ReactNode;
}

const DrawerContainer: React.FC<DrawerContainerProps> = ({
  title,
  children,
}) => (
  <DrawerHeader className="text-center ml-[-450px]">
    {/* タイトル・ヘッダー */}
    <DrawerTitle className="text-4xl font-bold text-slate-200">
      {title}
    </DrawerTitle>

    {/* 入力フィールド*/}
    <DrawerDescription
      asChild
      className="outerBox w-full max-w-md space-y-4 text-black"
    >
      <div>{children}</div>
    </DrawerDescription>

    {/* 閉じるボタン */}
    <DrawerClose asChild>
      <button
        aria-label="Close"
        className="absolute top-4 right-4 text-5xl bg-none border-none cursor-pointer"
      >
        &times;
      </button>
    </DrawerClose>
  </DrawerHeader>
);

export default DrawerContainer;
