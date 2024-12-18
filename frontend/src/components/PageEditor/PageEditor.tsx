import { useState } from "react";
import { useAtom } from "jotai";
import { Data, DataItem } from "@/types";
import DrawerContainer from "../layouts/DrawerContainer";
import TitleField from "./forms/TitleField";
import TextareaField from "./forms/TextareaField";
import DateField from "./forms/DateField";
import WeatherSelector from "./forms/WeatherSelector";
import { dataAtom } from "@/state/atom";
import EffectSelector from "../ImageUploader/forms/EffectSelector";
import { updateData } from "@/api/updateData";

interface PageEditorProps {
  pageData: DataItem;
  onConfirm: () => void;
}

interface UpdatePageData {
  id: string;
  title: string;
  text: string;
  date: string;
  image_filter: string;
  weather_prediction: string;
}

const PageEditor: React.FC<PageEditorProps> = ({ pageData, onConfirm }) => {
  // 初期データを設定
  const initialData = pageData;

  // DEBUG
  // console.log(initialData);

  // 編集可能なデータの状態を管理
  const [editedTitle, setEditedTitle] = useState(initialData?.title);
  const [editedText, setEditedText] = useState(initialData?.text);
  const [editedDate, setEditedDate] = useState(initialData?.date);
  const [editedWeather, setEditedWeather] = useState(initialData?.weather_prediction);
  const [editedFilter, setEditedFilter] = useState("original"); //フィルターはデフォルトで"blur"としとく
  const imageURL = initialData?.img_server_pass;
  const dataID = initialData?.id;

  // `dataAtom`の状態を管理するために`useAtom`を使用
  const [, setData] = useAtom(dataAtom);

  // データの更新
  const handleUpdate = async (id: string) => {
    // アップデートする情報
	console.log("DATE", editedDate);
    const newItem: UpdatePageData = {
      id: id,
      title: editedTitle, // 編集したタイトル
      text: editedText, // 編集したテキスト
      date: editedDate + "T10:35:49.716241+09:00", // 編集した日付
      image_filter: editedFilter, //適用するfilter
	  weather_prediction: editedWeather, //編集した天気
    };
    const updatedItem = await updateData(newItem);
    console.log(updatedItem);
    setData(
      (prevData) =>
        prevData.map((item) => (item.id === id ? updatedItem : item)) as Data
    );
  };

  // 編集内容を保存する関数
  const handleSave = async () => {
    // DEBUG
    console.log("Edited Title:", editedTitle);
    console.log("Edited Text:", editedText);
    console.log("Edited Date:", editedDate);
    console.log("Edited filter", editedFilter);
    console.log("wather", editedWeather);
    console.log("Image URL:", imageURL); // 画像URLは変更しない
	console.log("Data ID:", dataID);

    await handleUpdate(dataID);
    onConfirm(); // 確定後にDrawerを閉じる
  };

  return (
    <DrawerContainer title="日記の編集">
      <div className="p-12 grid grid-cols-2 gap-4 h-[600px] w-[900px] bg-opening-book">
        <div className="h-[100px]">
          {/* タイトル入力フォーム */}
          <TitleField
            label="日記のタイトル"
            value={editedTitle}
            onChange={setEditedTitle}
            placeholder="Enter title"
          />

          {/* 日記の作成日入力 */}
          <DateField
            label="更新日"
            value={editedDate}
            onChange={setEditedDate}
          />

          {/* 日記の内容入力 */}
          <TextareaField
            label="日記の内容"
            value={editedText}
            onChange={setEditedText}
            placeholder="Enter text"
          />

		  {/* 天気の変更 */}
		  <WeatherSelector
			label="天気"
			value={editedWeather}
			onChange={setEditedWeather}
			placeholder="天気なし"
		  />

          {/* イメージフィルター入力フォーム */}
          <EffectSelector value={editedFilter} onChange={setEditedFilter} />

          {/* 確認ボタン */}
		  <button
			onClick={handleSave}
			className="mt-[-25pt] bg-blue-500 text-white px-4 py-2 rounded float-right"
		  >
			更新
		  </button>
        </div>
      </div>
    </DrawerContainer>
  );
};

export default PageEditor;
