// components/FormUpload.tsx

interface Props {
  label: string;
  files: File[];
  onChange: (files: File[]) => void;
  error?: string;
}

export default function FormUpload({
  label,
  files,
  onChange,
  error,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files) as File[]; // ✅ FIX

    onChange([...files, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>

      <input
        type="file"
        multiple
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}

      <div className="mt-2 space-y-1">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex justify-between border p-2 rounded"
          >
            <span className="text-sm">{file.name}</span>

            <button
              type="button"
              onClick={() => removeFile(index)}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}