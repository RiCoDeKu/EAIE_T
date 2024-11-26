import { useState } from "react";
import { Data, DataItem } from "@/types";
import DrawerContainer from "../layouts/DrawerContainer";
import TitleField from "./forms/TitleField";
import TextareaField from "./forms/TextareaField";
import DateField from "./forms/DateField";
import { useAtom } from "jotai";
import { dataAtom } from "@/state/atom";
import EffectSelector from "../ImageLoader/forms/EffectSelector";

interface PageEditorProps {
  pageData: DataItem;
  onConfirm: () => void;
}

const PageEditor: React.FC<PageEditorProps> = ({ pageData, onConfirm }) => {
  // 初期データを設定
  const initialData = pageData;

  // 編集可能なデータの状態を管理
  const [editedTitle, setEditedTitle] = useState(initialData?.title);
  const [editedText, setEditedText] = useState(initialData?.text);
  const [editedDate, setEditedDate] = useState(initialData?.date);
  const [editedFilter, setEditedFilter] = useState("blur"); //フィルターはデフォルトで"blur"としとく
  const imageURL = initialData?.img_server_pass;
  const dataID = initialData?.id;

  // `dataAtom`の状態を管理するために`useAtom`を使用
  const [, setData] = useAtom(dataAtom);

  // データの更新
  const handleUpdate = (id: string) => {
    // 更新する新しいデータを作成
    const newItem = {
      id: id,
      title: editedTitle, // 編集したタイトル
      text: editedText, // 編集したテキスト
      date: editedDate, // 編集した日付
      img_server_pass: imageURL, // 画像のURLは変更なし
    };
    const updatedItem = { ...newItem, id }; // 更新内容を仮に newItem に合わせてセット
    setData(
      (prevData) =>
        prevData.map((item) => (item.id === id ? updatedItem : item)) as Data
    );
  };

  // 編集内容を保存する関数
  const handleSave = async () => {
    console.log("Edited Title:", editedTitle);
    console.log("Edited Text:", editedText);
    console.log("Edited Date:", editedDate);
    console.log("Edited filter", editedFilter);
    console.log("Image URL:", imageURL); // 画像URLは変更しない
    console.log("Data ID:", dataID);

    handleUpdate(dataID);
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

      {/* 画像の表示部分 */}
      {imageURL ? (
        <div className="mt-4">
          <img
            src={imageURL}
            alt="Preview"
            className="mt-2 max-w-full h-auto rounded"
          />
        </div>
      ) : (
        <p className="mt-4">No image available</p>
      )}
	</div>
	<div className="h-[100px]">
	  {/* 日記の作成日入力 */}
	  <DateField label="更新日" value={editedDate} onChange={setEditedDate} />

      {/* 日記の内容入力 */}
      <TextareaField
        label="日記の内容"
        value={editedText}
        onChange={setEditedText}
        placeholder="Enter text"
      />

      {/* イメージフィルター入力フォーム */}
      <EffectSelector value={editedFilter} onChange={setEditedFilter} />

      {/* 確認ボタン */}
      <button
        onClick={handleSave}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        投稿
      </button>
	  </div>
	  </div>
	</DrawerContainer>
  );
};

export default PageEditor;