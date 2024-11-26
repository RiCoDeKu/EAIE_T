interface EffectSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const EffectSelector: React.FC<EffectSelectorProps> = ({ value, onChange }) => (
  <>
		{/* エフェクト選択のラベル */}
		<label className="block text-lg font-semibold mb-2">エフェクトを追加</label>
		<div className="space-y-2">
		{/* エフェクトの選択肢 */}
		{[
			{value: "original", label: "なし"}, 
			{value: "blur", label: "ぼかし"}, 
			{value: "illustration_style", label: "イラスト風"}, 
			{value: "hue_inversion", label: "色相反転"},
		].map(
			(effect) => (
			<label key={effect.value} className="flex items-center">
				<input
				type="radio"
				name="effect"
				value={effect.value}
				checked={value === effect.value} // 現在選択されているエフェクトをチェック
				onChange={(e) => onChange(e.target.value)} // エフェクト変更時に親に通知
				className="mr-2"
				/>
				{/* エフェクト名の表示 */}
				{effect.label}
			</label>
			)
		)}
		</div>
  </>
);

export default EffectSelector;
