interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function FullScreenLayout({ children, className }: Props) {
  return (
    <div className="min-h-dvh flex justify-center" style={{ background: '#1A1D1D' }}>
      <div className={`w-full max-w-[430px] min-h-dvh bg-bg flex flex-col ${className ?? ''}`}>
        {children}
      </div>
    </div>
  );
}
