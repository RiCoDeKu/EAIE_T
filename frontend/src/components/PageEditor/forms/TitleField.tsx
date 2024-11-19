interface InputFieldProps {
  label: string; // 入力フィールドのラベル
  value: string; // 入力されている値
  onChange: (value: string) => void; // 値が変更されたときのハンドラ
  placeholder: string; // プレースホルダー
}

const TitleField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
}) => (
  <div className="mb-4">
    <label htmlFor="input" className="block text-sm font-semibold">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded"
      placeholder={placeholder}
    />
  </div>
);

export default TitleField;
