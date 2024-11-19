interface TextareaFieldProps {
  label: string; // テキストエリアのラベル
  value: string; // テキストエリアに入力されている値
  onChange: (value: string) => void; // 値が変更されたときのハンドラ
  placeholder: string; // プレースホルダー
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
}) => (
  <div className="mb-4">
    <label htmlFor="textarea" className="block text-sm font-semibold">
      {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded"
      placeholder={placeholder}
      rows={4}
    />
  </div>
);

export default TextareaField;
