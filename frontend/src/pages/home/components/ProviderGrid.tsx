import type { Provider } from '@/types';

interface Props {
  providers: Provider[];
}

export default function ProviderGrid({ providers }: Props) {
  if (providers.length === 0) return null;

  return (
    <div className="px-4 mt-6">
      <div className="grid grid-cols-4 gap-2">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="flex items-center justify-center relative cursor-pointer"
            style={{
              background: '#323738',
              borderRadius: '8px',
              height: '44px',
              padding: '8px 12px',
            }}
          >
            {provider.is_new && (
              <span
                className="absolute font-extrabold"
                style={{
                  top: '-4px',
                  left: '-4px',
                  background: '#24EE89',
                  color: '#000',
                  fontSize: '8px',
                  padding: '1px 4px',
                  borderRadius: '4px',
                  lineHeight: '1.2',
                }}
              >
                NEW
              </span>
            )}
            <span className="text-white text-xs font-semibold text-center truncate">
              {provider.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
