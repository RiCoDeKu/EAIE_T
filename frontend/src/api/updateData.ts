import { DataItem } from "@/types";
import axios from "axios";

// interface UpdatePageData {
//   id: string;
//   title: string;
//   text: string;
//   date: string;
// }

export const updateData = async (data: DataItem): Promise<void> => {
  try {
    // サーバーにPUTリクエストを送信
    const response = await axios.put(
      `http://localhost:8000/api/pages/${data.id}/`, // エンドポイント
      {
        title: data.title,
        text: data.text,
        date: data.date,
      }
    );
    console.log("Update Success:", response.data);
  } catch (error) {
    console.error("Update Error:", error);
    throw new Error("データの更新に失敗しました。");
  }
};
