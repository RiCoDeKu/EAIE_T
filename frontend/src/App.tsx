import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useEffect } from "react";
import { Experience } from "./components/3D/Experience";
import { Loader } from "@react-three/drei";
import Header from "./components/Header/Header";
import Pagination from "./components/Pagination/Pagination";
import { dataAtom } from "./state/atom";
import { useAtom } from "jotai";
import { fetchData } from "./api/fetchData";

function App() {
  // // データの一括取得
  // データについては，ダミーデータを挿入しておく
  const [, setData] = useAtom(dataAtom);
  const loadData = useCallback(async () => {
    const result = await fetchData();
    if (result.length !== 0) {
      setData(result);
    }
  }, [setData]); // setData は変更されないため、依存配列に追加

  // 空の依存関係配列で useEffect を設定
  useEffect(() => {
    loadData(); // 初回レンダリング時のみ実行される
  }, [loadData]); // loadData を依存関係に追加

  return (
    <div className="relative w-screen h-screen bg-custom-image">
      {/* ヘッダー */}
      <div className="w-full absolute top-5 z-10">
        <Header />
      </div>

      {/* 3Dの画面 */}
      <Loader />
      <div className="absolute top-0 left-0 right-0 bottom-0">
        <Canvas shadows camera={{ position: [-0.5, 1, 4], fov: 45 }}>
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </Canvas>
      </div>

      {/* ページネーションボタン */}
      <div className="w-full absolute bottom-5  z-10 flex justify-center">
        <Pagination />
      </div>
    </div>
  );
}

export default App;
