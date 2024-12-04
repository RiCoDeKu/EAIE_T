import { SetStateAction, useRef, useState } from "react";
import { UploadImage } from "@/api/uploadImage";
import { UploadImageParams, DataItem, Data } from "@/types";
import DrawerContainer from "@/components/layouts/DrawerContainer";
import FileInput from "@/components/ImageUploader/forms/FileInput";
import EffectSelector from "@/components/ImageUploader/forms/EffectSelector";
import { useAtom } from "jotai";
import { dataAtom } from "@/state/atom";
import EnableAISelector from "./forms/EnableAISelector";
import { updateData } from "@/api/updateData";

interface UpdatePageData {
  id: string;
  title: string;
  text: string;
  date: string;
  image_filter: string;
}
interface Props {
  setLoading: (loading: boolean) => void; // ローディング状態
  setError: (error: string | null) => void; // エラーメッセージ
  setPageData: (pageData: DataItem | null) => void;
  onConfirm: () => void;
}

const ImageLoader: React.FC<Props> = ({
  setLoading,
  setError,
  setPageData,
  onConfirm,
}) => {
  // グローバル
  const [, setData] = useAtom(dataAtom); // データを追加する

  // ローカル
  // 右ページの内容
  const [formData, setFormData] = useState<UploadImageParams>({
    enable_ai: "false",
    imageFile: null as File | null,
    image_filter: "original",
  });
  // 左ページの内容
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const dataIDRef = useRef(""); // useRef で変数を保持

  // 右ページの入力変更ハンドラー
  const handleChange = (
    name: keyof UploadImageParams,
    value: string | File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };
  // フィールド単体のバリデーション
  const validateField = (
    name: keyof UploadImageParams,
    value: string | File | null
  ) => {
    let error = "";
    if (name === "imageFile") {
      if (!(value instanceof File)) {
        error = "画像ファイルを選択してください";
      }
    }
    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };
  // フォーム全体のバリデーション
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.imageFile) {
      newErrors.imageFile = "画像ファイルを選択してください";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0; // エラーがなければtrue
  };

  // フォーム送信ハンドラー
  const handleCreateText = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      // 画像をアップロードし、サーバーから結果を受け取る
      const result = await UploadImage(formData);
      const pageData = {
        id: result.id, //サーバからのid
        title: result.title, //サーバーからの生成タイトル
        text: result.text, // サーバーからの生成テキスト
        img_server_pass: result.img_server_pass, // サーバーからの画像URL
        date: result.date,
      };

      setData((prevData) => [...prevData, pageData]); //データ配列に追加
      setData((prevData) => prevData.filter((item) => item.id !== "1")); //最初のデータアップロードの時のみ発火
      dataIDRef.current = pageData.id;
      console.log("createText", dataIDRef.current);
      setPageData(pageData); // アップロードデータを状態にセット
      // 右ページの内容
      if (formData.enable_ai == "true") {
        setTitle(pageData.title);
        setText(pageData.text);
        setDate(pageData.date);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("予期しないエラーが発生しました");
      }
    } finally {
      setLoading(false);
    }
  };

  // 左ページの入力欄の変更ハンドラー
  const handleTitleChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setTitle(e.target.value);
  };
  const handleDateChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setDate(e.target.value);
  };
  const handleTextChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setText(e.target.value);
  };

  const handleUpdate = async (id: string) => {
    const newItem: UpdatePageData = {
      id: id,
      title: title, // 編集したタイトル
      text: text, // 編集したテキスト
      date: date + "T10:35:49.716241+09:00", // 編集した日付
      image_filter: formData.image_filter, //適用するfilter
    };
    const updatedItem = await updateData(newItem);
    setData(
      (prevData) =>
        prevData.map((item) => (item.id === id ? updatedItem : item)) as Data
    );
  };

  // 投稿ハンドラー
  const handleSubmit = async () => {
    if (formData.enable_ai == "true") {
      // AI有効化ver
      console.log("AI", dataIDRef.current);
      await handleUpdate(dataIDRef.current);
    } else {
      // AI無効化ver
      await handleCreateText();
      await handleUpdate(dataIDRef.current);
    }
    onConfirm(); // 確定後にDrawerを閉じる
  };

  return (
    <DrawerContainer title="日記を追加する">
      <div className="p-12 grid grid-cols-2 gap-4 h-[600px] w-[900px] bg-opening-book">
        {/* 本の右ページ */}
        <div className="h-[100px]">
          {/* 画像を追加 */}
          <FileInput onChange={(value) => handleChange("imageFile", value)} />
          {formErrors.imageFile && (
            <p className="text-red-500">{formErrors.imageFile}</p>
          )}

          {/* AIの有効か */}
          <EnableAISelector
            value={formData.enable_ai}
            onChange={(value) => handleChange("enable_ai", value)}
          />

          {/* エフェクトを追加 */}
          <EffectSelector
            value={formData.image_filter}
            onChange={(value) => handleChange("image_filter", value)}
          />

          {/* 文章生成ボタン */}
          <div className="text-right">
            <button
              onClick={handleCreateText}
              className={`mt-4 px-4 py-2 rounded ${
                formData.enable_ai === "true"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-500 text-gray-300"
              }`}
              disabled={formData.enable_ai !== "true"}
            >
              文章生成
            </button>
          </div>
        </div>

        {/* 本の左ページ */}
        <div className="h-[100px]">
          {/* 日記のタイトル入力欄 */}
          <input
            type="text"
            placeholder="タイトル"
            className="w-full p-2 border border-gray-300 rounded mt-4"
            value={title}
            onChange={handleTitleChange}
          />
          {/* 日記の作成日入力欄 */}
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded mt-4"
            value={date}
            onChange={handleDateChange}
          />
          {/* 日記の内容入力欄 */}
          <textarea
            placeholder="日記の内容"
            className="w-full h-[250px] p-2 border border-gray-300 rounded mt-4"
            value={text}
            onChange={handleTextChange}
          />
          {/* 確認ボタン */}
          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            投稿
          </button>
        </div>
      </div>
    </DrawerContainer>
  );
};

export default ImageLoader;
