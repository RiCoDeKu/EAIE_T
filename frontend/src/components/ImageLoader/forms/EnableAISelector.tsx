interface EnableAISelectorProps {
  value: "true" | "false"; // 現在の値 (true または false)
  onChange: (newValue: string) => void; // 値が変更されたときのコールバック
}

const EnableAISelector: React.FC<EnableAISelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <>
      {/* トグルのラベル */}
      <label className="block text-lg font-semibold mb-2">Enable AI</label>
      <div className="space-y-2">
        {/* TrueとFalseの選択肢 */}
        {["true", "false"].map((option) => (
          <label key={option} className="flex items-center">
            <input
              type="radio"
              name="enable_ai"
              value={option} // true または false の文字列
              checked={value === option} // 現在の値と一致するか
              onChange={(e) => onChange(e.target.value)} // 値変更時に親に通知
              className="mr-2"
            />
            {option.charAt(0).toUpperCase() + option.slice(1)}{" "}
            {/* 表示用に大文字に */}
          </label>
        ))}
      </div>
    </>
  );
};

export default EnableAISelector;
