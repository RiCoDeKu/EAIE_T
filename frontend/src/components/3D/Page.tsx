import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bone,
  BoxGeometry,
  BufferGeometry,
  Color,
  Euler,
  Float32BufferAttribute,
  MathUtils,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  SRGBColorSpace,
  Uint16BufferAttribute,
  Vector3,
} from "three";
import { useCursor, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils.js";
import { useAtom, useAtomValue } from "jotai";
import { easing } from "maath";
import { currentImgFileAtom, currentPageAtom, pagesAtom } from "@/state/atom";

const easingFactor = 0.5; // イジングの速さ
const easingFactorFold = 0.3; // イジングの速さ
const insideCurveStrength = 0.18; //ページのカーブの強さ
const outsideCurveStrength = 0.05; //ページのカーブの強さ
const turningCurveStrength = 0.09; //ページのカーブの強さ

////////////////////////////// ページジオメトリの作成////////////////////////////////
const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71;
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS = 30;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS; //ページのカーブを描くために設定

const pageGeometry = new BoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS, // 幅方向の分割数
  2 // 高さ方向の分割数
);
pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);

// スキニング
const position = pageGeometry.attributes.position; // 頂点の配列 [x1, y1, z1, x2, y2, z2, ....]
const vertex = new Vector3();
const skinIndexes = [];
const skinWeights = [];
for (let i = 0; i < position.count; i++) {
  vertex.fromBufferAttribute(position, i); // 頂点情報を取得
  const x = vertex.x;
  const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH)); // スキンインデックスの計算
  const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH; // スキンウェイトの計算

  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
}
pageGeometry.setAttribute(
  "skinIndex",
  new Uint16BufferAttribute(skinIndexes, 4)
);
pageGeometry.setAttribute(
  "skinWeight",
  new Float32BufferAttribute(skinWeights, 4)
);

/////////////////////////// ページマテリアルの作成 ///////////////////////////////
const whiteColor = new Color("white");
const emissiveColor = new Color("orange");

const pageMaterials = [
  // 右側面(+X方向)
  new MeshStandardMaterial({
    color: whiteColor,
  }),
  // 左側面(-X方向)
  new MeshStandardMaterial({
    color: "#111",
  }),
  // 上面(+Y方向)
  new MeshStandardMaterial({
    color: whiteColor,
  }),
  // 下面(-Y方向)
  new MeshStandardMaterial({
    color: whiteColor,
  }),
];

////////////////////// ページコンポーネント(ページ : 1 枚) //////////////////////////
interface PageProps {
  number: number;
  front: string;
  back: string;
  page: number;
  opened: boolean;
  bookClosed: boolean;
}

const Page: React.FC<PageProps> = ({
  number, // ページのIndex
  front, //表面
  back, // 裏面
  page, // 遅延状態のページ
  opened, // 現在のページの状態
  bookClosed,
  ...props
}) => {
  // ページのプリロード
  const pages = useAtomValue(pagesAtom);
  useEffect(() => {
    // サーバー
    pages.forEach((page) => {
      useTexture.preload(page.front);
      useTexture.preload(page.back);
    });

    // ダミーデータ用
    // pages.forEach((page) => {
    //   useTexture.preload(`textures/${page.front}.jpg`);
    //   useTexture.preload(`textures/${page.back}.jpg`);
    // });
  }, [pages]);
  // 表裏(+-Z方向)の画像の設定
  const [picture, picture2] = useTexture([
    // サーバー
    front, // 画像のパス
    back, // 画像のパス

    // ダミーデータ用
    // `/textures/${front}.jpg`, // 画像のパス
    // `/textures/${back}.jpg`, // 画像のパス
  ]);
  picture.colorSpace = picture2.colorSpace = SRGBColorSpace; // 色空間の統一

  /////////////// 3Dページをアニメーション可能にするスキンメッシュを作成 //////////

  const manualSkinnedMesh = useMemo(() => {
    // ボーンの作成 (PAGE_SEGMENTS + 1 本)
    const bones = [];
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      const bone = new Bone();
      bones.push(bone);
      if (i == 0) {
        bone.position.x = 0;
      } else {
        bone.position.x = SEGMENT_WIDTH;
      }
      if (i > 0) {
        bones[i - 1].add(bone);
      }
    }
    // スケルトンの作成
    const skelton = new Skeleton(bones);

    // ページ(直方体)の表裏(+-Z方向)の設定
    const materials = [
      ...pageMaterials,
      new MeshStandardMaterial({
        color: whiteColor, // マテリアルの基本色 (白)
        map: picture, // テクスチャ
        roughness: 0.1, // 表面の粗さ
        emissive: emissiveColor, // 自己発光の色 (ここではオレンジ色)
        emissiveIntensity: 0, // 自己発光の強さ（0に設定されているので発光しない）
      }),
      new MeshStandardMaterial({
        color: whiteColor,
        map: picture2,
        roughness: 0.1,
        emissive: emissiveColor,
        emissiveIntensity: 0,
      }),
    ];
    // スキンメッシュの作成 (ボーンとメッシュを結びつける)
    const mesh = new SkinnedMesh(pageGeometry, materials); // (geometry,texture) => mesh
    mesh.castShadow = true; // メッシュが影を投影する
    mesh.receiveShadow = true; // メッシュが影を受け取る
    mesh.frustumCulled = false; // カメラの視野範囲に関係なくメッシュを描画する(常に描画)
    mesh.add(skelton.bones[0]); // ページ変形の起点
    mesh.bind(skelton);
    return mesh;
  }, [picture, picture2]);

  /////////////////////// ページ(1枚)の歪みとアニメーション ////////////////////////
  const turnedAt = useRef(0); //最後に開かれたページの時刻
  const lastOpened = useRef(opened); //最後に開かれたページかどうか
  const group = useRef(null);
  const skinnedMeshRef =
    useRef<SkinnedMesh<BufferGeometry, MeshStandardMaterial[]>>(null); //スキンメッシュの参照 (表裏の画像にアクセスに仕様)

  useFrame((_, delta) => {
    // skinnedMeshが存在しない場合
    if (!skinnedMeshRef.current) {
      return;
    }

    // 本の画像のハイライト状態に応じて光の強さを設定 (0 -> 0.22 へ 0.1の割合で変更)
    const emissiveIntensity = highlighted ? 0.22 : 0;
    skinnedMeshRef.current.material[4].emissiveIntensity =
      skinnedMeshRef.current.material[5].emissiveIntensity = MathUtils.lerp(
        skinnedMeshRef.current.material[4].emissiveIntensity,
        emissiveIntensity,
        0.1
      );

    // 最後に開かれたページの記録
    if (lastOpened.current != opened) {
      turnedAt.current = +new Date(); //開かれた時刻の記録
      lastOpened.current = opened; //最後に開かれたページ <- 現在のページ
    }

    // ページのターン時間を計算
    let turningTime = Math.min(400, +new Date() - turnedAt.current) / 400; //ターンの進行度(0:初期, 1:完了)
    turningTime = Math.sin(turningTime * Math.PI);

    // ページの回転角(初期位置)を設定
    let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2; // 初期位置: 閉じている
    if (!bookClosed) {
      targetRotation += degToRad(number * 0.8); // ページの重なりを減らす
    }

    // ページの各「骨」（ボーン）にアクセス
    const bones = skinnedMeshRef.current.skeleton.bones;
    for (let i = 0; i < bones.length; i++) {
      const target = i === 0 ? group.current : bones[i];

      // ページの内側と外側の曲がり具合を計算
      const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0; // 内側の曲がり具合
      const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0; // 外側の曲がり具合
      const turningIntensity =
        Math.sin(i * Math.PI * (1 / bones.length)) * turningTime; // ページがめくれる際の強さ

      // ページがめくられる際の各ボーンの回転角度を計算
      let rotationAngle =
        insideCurveStrength * insideCurveIntensity * targetRotation -
        outsideCurveStrength * outsideCurveIntensity * targetRotation +
        turningCurveStrength * turningIntensity * targetRotation;

      // 本が閉じている場合のページの折りたたまれる角度
      let foldRotationAngle = degToRad(Math.sign(targetRotation) * 2); // 折りたたみの回転角度（±2度）

      // 本が閉じている場合の特別な処理
      if (bookClosed) {
        if (i === 0) {
          rotationAngle = targetRotation; // 最初のページのみ回転
          foldRotationAngle = 0; // 折りたたみの角度をリセット
        } else {
          rotationAngle = 0; // 他のページは回転させない
        }
      }

      // ページの回転アニメーション実行
      easing.dampAngle(
        target?.rotation as Euler,
        "y", // 開始位置
        rotationAngle, //終了位置
        easingFactor, //移動速度
        delta
      );

      // ページをめくる際の回転角度を計算
      const foldIntensity =
        i > 8
          ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime
          : 0;

      // ページが折りたたまれるアニメーション
      easing.dampAngle(
        target?.rotation as Euler,
        "x",
        foldRotationAngle * foldIntensity,
        easingFactorFold,
        delta
      );
    }
  });
  ////////////////////////////////////////////////////////////////////////////////////////////

  const [, setPage] = useAtom(currentPageAtom);
  const [, setCurrentImgFile] = useAtom(currentImgFileAtom);
  const [highlighted, setHighlighted] = useState(false); // ホバーされているか

  // カーソルの状態をハイライト状態に応じて更新
  useCursor(highlighted);

  return (
    <group
      {...props}
      ref={group}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHighlighted(true); // マウスホバー時にハイライトを有効に
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setHighlighted(false); // マウスが外れたときにハイライトを無効に
      }}
      onClick={(e) => {
        e.stopPropagation();
        setCurrentImgFile(opened ? 2 * number : 2 * number + 1); // ページの設定
        setPage(opened ? number : number + 1); // ページの設定
        setHighlighted(false); // クリック時にはハイライトを無効化
      }}
    >
      {/* カスタム要素の宣言 */}
      <primitive
        object={manualSkinnedMesh}
        ref={skinnedMeshRef}
        position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH} // 各ページの奥行きに応じてZ座標を設定
      />
    </group>
  );
};

export default Page;
