interface AgreementCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
  hasError?: boolean;
}

export default function AgreementCheckbox({
  checked,
  onChange,
  children,
  hasError,
}: AgreementCheckboxProps) {
  return (
    <div
      className="flex items-start cursor-pointer"
      style={{ gap: '10px' }}
      onClick={() => onChange(!checked)}
    >
      <div
        className="flex-shrink-0 flex items-center justify-center"
        style={{
          width: '18px',
          height: '18px',
          borderRadius: '4px',
          marginTop: '1px',
          background: checked ? '#24EE89' : 'transparent',
          border: checked ? 'none' : '1.5px solid #3A4142',
          cursor: 'pointer',
        }}
      >
        {checked && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: '12px', height: '12px' }}
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
      </div>
      <p style={{
        color: hasError ? '#FF4757' : '#B0B3B3',
        fontSize: '12px',
        lineHeight: 1.5,
      }}>{children}</p>
    </div>
  );
}
