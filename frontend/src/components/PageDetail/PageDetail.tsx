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

const convertWeatherToJapanese = (weather_prediction: string) => {
	switch (weather_prediction) {
	  case "sunny":
		return "晴れ";
	  case "cloudy":
		return "曇り";
	  case "rainy":
		return "雨";
	  default:
		return weather_prediction;
	}
};

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
        </DrawerHeader>
          {/* 画像の表示部分 */}

		  <div className="p-12 grid grid-cols-2 gap-4 h-[1000px] w-[900px] bg-opening-book scale-[1.25] mt-[10pt]">
			<div className="h-[100px] ">
				<img
				src={data[indexData].img_server_pass}
				alt="Preview"
				className="mt-[-15pt] mx-auto ml-[54pt] w-[290px] h-[180px] rounded border border-black"
				style={{ maxHeight: "300px", borderWidth: "3px" }}
				/>
				<DrawerTitle className="mt-[10pt] ml-[45pt] text-[15pt] font-bold text-black">
					{data[indexData].title}
				</DrawerTitle>
				<div className="mt-[-2pt] mb-[4pt] ml-[27pt] w-[732px] border-t-2 border-slate-500"></div>
				<DrawerDescription className="ml-[45pt] text-[15pt] text-black">
					{data[indexData].date.split("-")[0]+" 年 "+data[indexData].date.split("-")[1]+" 月 "+data[indexData].date.split("-")[2]+" 日"}
				</DrawerDescription>
				<div className="mt-[-2pt] mb-[4pt] ml-[27pt] w-[732px] border-t-2 border-slate-500"></div>
				<p className="ml-[45pt] text-[15pt] text-black">予測天気: {convertWeatherToJapanese(data[indexData].weather_prediction)}</p>
				<div className="mt-[-2pt] mb-[26pt] ml-[27pt] w-[732px] border-t-2 border-slate-500"></div>
				<div className="mt-[-2pt] mb-[26pt] ml-[27pt] w-[732px] border-t-2 border-slate-500"></div>
				<div className="mt-[-2pt] mb-[26pt] ml-[27pt] w-[732px] border-t-2 border-slate-500"></div>
				<div className="mt-[-2pt] mb-[26pt] ml-[27pt] w-[732px] border-t-2 border-slate-500"></div>
				<div className="mt-[-2pt] mb-[26pt] ml-[27pt] w-[732px] border-t-2 border-slate-500"></div>
				<div className="mt-[-2pt] mb-[26pt] ml-[27pt] w-[732px] border-t-2 border-slate-500"></div>
			</div>
			<div className="h-[100px] ">
				{/* 日記の内容 */}
				<div className="ml-[-4pt]">
					<p className="mt-[126pt] mb-[4pt] text-[15pt] text-black">{data[indexData].text.slice(0, 18)}</p>
					<p className="mb-[3pt] text-[15pt] text-black">{data[indexData].text.slice(18, 36)}</p>
					<p className="mb-[3pt] text-[15pt] text-black">{data[indexData].text.slice(36, 54)}</p>
					<p className="mb-[3pt] text-[15pt] text-black">{data[indexData].text.slice(54, 72)}</p>
					<p className="mb-[3pt] text-[15pt] text-black">{data[indexData].text.slice(72, 90)}</p>
					<p className="mb-[3pt] text-[15pt] text-black">{data[indexData].text.slice(90, 108)}</p>
					<p className="mb-[3pt] text-[15pt] text-black">{data[indexData].text.slice(108, 126)}</p>
					<p className="mb-[3pt] text-[15pt] text-black">{data[indexData].text.slice(126, 144)}</p>
					<p className="mb-[3pt] text-[15pt] text-black">{data[indexData].text.slice(144, 162)}</p>
				</div>
			</div>

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


		

		
		{/* テキストの表示部分 */}
        <DrawerFooter className="mt-4"></DrawerFooter>
      </DrawerContent>
    </>
  );
};

export default PageDetail;
