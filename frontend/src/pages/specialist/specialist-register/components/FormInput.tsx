// components/FormInput.tsx

interface Props {
  label: string;
  type?: string;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  placeholder?: string;
}

export default function FormInput({
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
}: Props) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border p-2 rounded ${
          error ? "border-red-500" : ""
        }`}
      />

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}