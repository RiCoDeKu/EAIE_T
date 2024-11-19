import { DataItem } from "@/types";
import axios from "axios";

interface UpdatePageData {
  id: string;
  title: string;
  text: string;
  date: string;
  image_filter: string;
}

export const updateData = async (data: UpdatePageData): Promise<DataItem> => {
  try {
    // サーバーにPUTリクエストを送信
    const response = await axios.put(
      data.id, // エンドポイント
      {
        title: data.title,
        text: data.text,
        date: data.date,
        image_filter: data.image_filter,
      }
    );
    console.log("Update Success:", response.data);

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
    console.error("Update Error:", error);
    throw new Error("データの更新に失敗しました。");
  }
};
