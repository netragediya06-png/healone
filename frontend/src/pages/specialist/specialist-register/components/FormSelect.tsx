// components/FormSelect.tsx

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  error?: string;
}

export default function FormSelect({
  label,
  value,
  onChange,
  options,
  error,
}: Props) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border p-2 rounded ${
          error ? "border-red-500" : ""
        }`}
      >
        <option value="">Select</option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}