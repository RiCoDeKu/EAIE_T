interface FileInputProps {
  onChange: (file: File | null) => void; // 画像が選択された時に呼ばれる関数
}

const FileInput: React.FC<FileInputProps> = ({ onChange }) => (
<>
	{/* 画像アップロードのラベル */}
	<a className="mt-4 block text-lg font-semibold">画像を追加</a>
	{/* 画像ファイル選択フィールド */}
	<input
		id="imageFile"
		name="imageFile"
		type="file"
		accept="image/*"
		onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
		className="w-full p-2 border border-gray-300 rounded"
	/>
</>
);

export default FileInput;
