import { DataItem, UploadImageParams } from "@/types";
import axios from "axios";

// 現在の API Response
interface UploadResponse {
  id: string;
  title: string;
  image_url: string;
  text: string;
  created_at: string;
}

//
export const UploadImage = async ({
  enable_ai,
  imageFile,
  image_filter,
}: UploadImageParams): Promise<DataItem> => {
  // 画像が選択されていない場合のチェック
  if (!imageFile) {
    throw new Error("画像ファイルが選択されていません");
  }

  // FormDataの作成
  const formData = new FormData();
  formData.append("enable_ai", enable_ai);
  formData.append("image", imageFile);
  formData.append("image_filter", image_filter);

  try {
    const response = await axios.post<UploadResponse>(
      "http://localhost:8000/api/diary/create/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // サーバからのレスポンスデータ
    const responseData = response.data;

    // 必要な構造に変換
    const transformedData: DataItem = {
      id: responseData.id,
      title: responseData.title,
      date: responseData.created_at.split("T")[0], // 日付部分だけ取得
      img_server_pass: responseData.image_url, // URLはすべて取得
      text: responseData.text,
    };

    return transformedData;
  } catch (error) {
    console.error("アップロードエラー:", error);
    throw new Error("サーバーへの送信に失敗しました");
  }
};
