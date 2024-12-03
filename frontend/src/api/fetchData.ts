import { Data } from "@/types";
import axios from "axios";

interface ResponseData {
  id: string;
  title: string;
  created_at: string; // ISO形式の日時を保持
  image_url: string;
  text: string;
}

// Data配列を一括取得する
export const fetchData = async (): Promise<Data> => {
  try {
    const response = await axios.get<ResponseData[]>(
      "http://localhost:8000/api/diary/" // エンドポイント
    );
    console.log("Fetched Data:", response.data);
    const responseDataArray = response.data;

    const transformedData: Data = responseDataArray.map((responseData) => ({
      id: responseData.id,
      title: responseData.title,
      date: responseData.created_at.split("T")[0], // 日付部分だけ取得
      img_server_pass: responseData.image_url, // URLはそのまま取得
      text: responseData.text,
    }));

    return transformedData;
  } catch (error) {
    console.error("Error fetching pages:", error);
    throw new Error("ページデータの取得に失敗しました。");
  }
};
