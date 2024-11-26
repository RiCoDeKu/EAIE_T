環境構築(簡易メモ)

1. Vite で tailwindcss, shadcn_uiの環境構築 

shadcn/ui　(https://ui.shadcn.com/docs/installation/vite)より
npm create vite@latest
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

(Edit
-src/index.css
-tailwind.config.js
-tsconfig.app.json
-tsconfig.json )

npm i -D @types/node

(Edit
-vite.config.ts
)

npx shadcn@latest init
(New York, Slate, yes)

2. three.jsの構築
npm install three @react-three/fiber
npm install @react-three/drei
npm i -D @types/three

3. その他
npm install jotai
npm i maath
npm i axios

4. shadcn_uiの環境構築
npx shadcn@latest add drawer
npx shadcn@latest add scroll-area

