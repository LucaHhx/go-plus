const widths = [
  ['80%', '50%'],
  ['70%', '40%'],
  ['90%', '60%'],
  ['65%', '45%'],
  ['85%', '55%'],
  ['75%', '50%'],
  ['80%', '40%'],
  ['60%', '50%'],
  ['70%', '55%'],
];

export default function GameGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-x-2 gap-y-3 mt-4">
      {widths.map(([nameW, providerW], i) => (
        <div key={i}>
          <div className="skeleton" style={{ aspectRatio: '1' }} />
          <div className="skeleton mt-1" style={{ height: '12px', width: nameW }} />
          <div className="skeleton mt-1" style={{ height: '10px', width: providerW }} />
        </div>
      ))}
    </div>
  );
}
