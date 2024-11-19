interface EffectSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const EffectSelector: React.FC<EffectSelectorProps> = ({ value, onChange }) => (
  <>
    {/* エフェクト選択のラベル */}
    <label className="block text-lg font-semibold mb-2">Effect</label>
    <div className="space-y-2">
      {/* エフェクトの選択肢 */}
      {["none", "grayscale", "sepia"].map((effect) => (
        <label key={effect} className="flex items-center">
          <input
            type="radio"
            name="effect"
            value={effect}
            checked={value === effect} // 現在選択されているエフェクトをチェック
            onChange={(e) => onChange(e.target.value)} // エフェクト変更時に親に通知
            className="mr-2"
          />
          {/* エフェクト名の表示 */}
          {effect.charAt(0).toUpperCase() + effect.slice(1)}
        </label>
      ))}
    </div>
  </>
);

export default EffectSelector;
