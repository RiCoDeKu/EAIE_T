import { useState } from "react";
import { UploadImage } from "@/api/uploadImage";
import { UploadImageParams, DataItem } from "@/types";
import DrawerContainer from "@/components/layouts/DrawerContainer";
import FileInput from "@/components/ImageLoader/forms/FileInput";
import EffectSelector from "@/components/ImageLoader/forms/EffectSelector";
import { useAtom } from "jotai";
import { dataAtom } from "@/state/atom";
import EnableAISelector from "./forms/EnableAISelector";

interface Props {
  setLoading: (loading: boolean) => void; // ローディング状態
  setError: (error: string | null) => void; // エラーメッセージ
  setActiveContent: (activeContent: "edit" | "upload" | "notSelected") => void; // Drawerの表示状態の管理
  setPageData: (pageData: DataItem | null) => void;
}

const ImageLoader: React.FC<Props> = ({
  setLoading,
  setError,
  setPageData,
  setActiveContent,
}) => {
  // POSTする情報
  const [formData, setFormData] = useState<UploadImageParams>({
    enable_ai: "false",
    imageFile: null as File | null,
    image_filter: "original",
  });
  // formのエラーメッセージ
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // データを追加する
  const [, setData] = useAtom(dataAtom);

  // 入力変更ハンドラー
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

    // 画像ファイルが選択されていない場合
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
  const handleSubmit = async () => {
    // バリデーションエラーがある場合は処理を中断
    if (!validateForm()) {
      return;
    }

    // Drawerの状態設定
    setLoading(true);
    setError(null);
    setActiveContent("notSelected");

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
      setPageData(pageData); // アップロードデータを状態にセット
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

  return (
    <DrawerContainer title="Add Diary">
      {/* 画像 */}
      <FileInput onChange={(value) => handleChange("imageFile", value)} />
      {formErrors.imageFile && (
        <p className="text-red-500">{formErrors.imageFile}</p>
      )}

      {/* AI化するかいなか */}
      <EnableAISelector
        value={formData.enable_ai}
        onChange={(value) => handleChange("enable_ai", value)}
      />

      {/* エフェクト */}
      <EffectSelector
        value={formData.image_filter}
        onChange={(value) => handleChange("image_filter", value)}
      />

      {/* 確認ボタン */}
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Confirm
      </button>
    </DrawerContainer>
  );
};

export default ImageLoader;
