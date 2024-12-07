interface InputFieldProps {
	label: string; // 入力フィールドのラベル
	value: string; // 入力されている値
	onChange: (value: string) => void; // 値が変更されたときのハンドラ
	placeholder: string; // プレースホルダー
  }
  
  const weatherOptions = [
	{label: "晴れ", value: "sunny"},
	{label: "曇り", value: "cloudy"},
	{label: "雨", value: "rainy"},
  ];
  
  const WeatherSelector: React.FC<InputFieldProps> = ({
	label,
	value,
	onChange,
  }) => (
	<div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      >
        <option value="" disabled>{"天気を選択"}</option>
        {weatherOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
  
  export default WeatherSelector;
  