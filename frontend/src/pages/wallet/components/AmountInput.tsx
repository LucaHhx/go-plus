interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function AmountInput({ value, onChange, placeholder = '0' }: AmountInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow only digits and one decimal point
    if (/^\d*\.?\d{0,2}$/.test(raw) || raw === '') {
      onChange(raw);
    }
  };

  return (
    <div className="flex items-center bg-bg-card border border-divider focus-within:border-brand rounded-lg h-14 px-4 transition-colors">
      <span className="text-txt-secondary text-2xl font-bold mr-2">Rp</span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-txt text-2xl font-extrabold text-center border-none focus:outline-none"
      />
    </div>
  );
}
