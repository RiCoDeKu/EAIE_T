interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ value, onChange }) => (
  <>
    {/* 日付入力のラベル */}
    <label htmlFor="date" className="block text-lg font-semibold mb-2">
      Date
    </label>
    {/* 日付入力フィールド */}
    <input
      id="date"
      name="date"
      type="date"
      value={value} // 入力値を親から受け取る
      onChange={(e) => onChange(e.target.value)} // 入力変更時に親に通知
      className="w-full p-2 border border-gray-300 rounded"
    />
  </>
);

export default DateInput;
