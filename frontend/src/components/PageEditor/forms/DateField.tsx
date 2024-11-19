interface DateFieldProps {
  label: string; // 日付入力のラベル
  value: string; // 入力された日付
  onChange: (value: string) => void; // 値が変更されたときのハンドラ
}

const DateField: React.FC<DateFieldProps> = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label htmlFor="date" className="block text-sm font-semibold">
      {label}
    </label>
    <input
      id="date"
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded"
    />
  </div>
);

export default DateField;
