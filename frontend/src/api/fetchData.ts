import { Data } from "@/types";
import axios from "axios";

// Data配列を一括取得する
export const fetchData = async (): Promise<Data> => {
  try {
    const response = await axios.get<Data>(
      "http://localhost:8000/api/pages/" // エンドポイント
    );
    console.log("Fetched Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching pages:", error);
    throw new Error("ページデータの取得に失敗しました。");
  }
};
