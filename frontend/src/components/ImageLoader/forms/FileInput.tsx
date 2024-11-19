interface FileInputProps {
  onChange: (file: File | null) => void; // 画像が選択された時に呼ばれる関数
}

const FileInput: React.FC<FileInputProps> = ({ onChange }) => (
  <>
    {/* 画像アップロードのラベル */}
    <label htmlFor="imageFile" className="block text-lg font-semibold mb-2">
      Upload Image
    </label>
    {/* 画像ファイル選択フィールド */}
    <input
      id="imageFile"
      name="imageFile"
      type="file"
      accept=".png, .jpeg, .jpg"
      onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
      className="w-full p-2 border border-gray-300 rounded"
    />
  </>
);

export default FileInput;
