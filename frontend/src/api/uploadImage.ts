import { UploadImageParams } from "@/types";
import axios from "axios";

// 現在の API Response
interface UploadResponse {
  image_url: string;
  text: string;
}

//
export const UploadImage = async ({
  title,
  imageFile,
  date,
  effect,
}: UploadImageParams): Promise<UploadResponse> => {
  // 画像が選択されていません (Formでvalidationすること)
  if (!imageFile) {
    throw new Error("画像ファイルが選択されていません");
  }

  // FormDataの作成
  const formData = new FormData();
  formData.append("title", title);
  formData.append("date", date);
  formData.append("effect", effect);
  formData.append("image", imageFile);

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

    // サーバーから返された画像URLとテキスト (現在のAPI) <== 後でDataObjectに変更
    const { image_url, text } = response.data;
    const url = "http://localhost:8000" + image_url;
    console.log("Upload Success:", { url, text });
    return { image_url: url, text };
  } catch (error) {
    console.error("アップロードエラー:", error);
    throw new Error("サーバーへの送信に失敗しました");
  }
};
