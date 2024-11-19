interface TitleInputProps {
  value: string; // 現在のタイトル値
  onChange: (value: string) => void; // 値が変更された時に呼ばれる関数
}

const TitleInput: React.FC<TitleInputProps> = ({ value, onChange }) => (
  <>
    {/* タイトルのラベル */}
    <label htmlFor="title" className="block text-lg font-semibold mb-2">
      Title
    </label>
    {/* タイトル入力フィールド */}
    <input
      id="title"
      name="title"
      type="text"
      value={value} // 入力値を親から受け取る
      onChange={(e) => onChange(e.target.value)} // 入力変更時に親に通知
      className="w-full p-2 border border-gray-300 rounded"
      placeholder="Enter title"
    />
  </>
);

export default TitleInput;
