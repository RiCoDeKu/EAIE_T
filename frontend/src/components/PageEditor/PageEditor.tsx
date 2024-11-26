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
    <DrawerContainer title="Edit Page">
      {/* タイトル入力フォーム */}
      <TitleField
        label="Title"
        value={editedTitle}
        onChange={setEditedTitle}
        placeholder="Enter title"
      />

      {/* 画像の表示部分 */}
      {imageURL ? (
        <div className="mt-4">
          <h3>Image Preview:</h3>
          <img
            src={imageURL}
            alt="Preview"
            className="mt-2 max-w-full h-auto rounded"
          />
        </div>
      ) : (
        <p className="mt-4">No image available</p>
      )}

      {/* テキスト入力フォーム */}
      <TextareaField
        label="Text"
        value={editedText}
        onChange={setEditedText}
        placeholder="Enter text"
      />

      {/* 日付入力フォーム */}
      <DateField label="Date" value={editedDate} onChange={setEditedDate} />

      {/* イメージフィルター入力フォーム */}
      <EffectSelector value={editedFilter} onChange={setEditedFilter} />

      {/* 確認ボタン */}
      <button
        onClick={handleSave}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </DrawerContainer>
  );
};

export default PageEditor;
