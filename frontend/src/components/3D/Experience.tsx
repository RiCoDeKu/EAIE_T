import { Environment, Float, OrbitControls } from "@react-three/drei";
import Book from "./Book";

export const Experience = () => {
  return (
    <>
      <Float
        rotation-x={-Math.PI / 4}
        floatIntensity={1} //浮遊の強さ
        speed={2} //浮遊の速さ
        rotationIntensity={2}
      >
        <Book />
      </Float>
      <OrbitControls />
      {/* 環境光の設定 */}
      <Environment preset="studio"></Environment>
      {/* 方向光の設定 */}
      <directionalLight
        position={[2, 5, 2]} // 光の位置
        intensity={0.5} // 光の強さ
        color={0xffe0b3} // 温かみのある色 (ライトオレンジ)
        castShadow // シャドウを有効に
        shadow-mapSize-width={2048} // 高品質なシャドウ
        shadow-mapSize-height={2048} // 高品質なシャドウ
        shadow-bias={-0.0001} // シャドウの調整
        rotation={[-Math.PI / 4, Math.PI / 4, 0]} // 斜めからの光
      />
      {/* 地面の影の設定 */}
      <mesh position-y={-1.5} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
    </>
  );
};
