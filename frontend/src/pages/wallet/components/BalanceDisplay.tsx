interface BalanceDisplayProps {
  balance: number;
  bonusBalance?: number;
  showBonus?: boolean;
}

export default function BalanceDisplay({ balance, bonusBalance, showBonus }: BalanceDisplayProps) {
  return (
    <div className="py-6">
      <div className="text-center">
        <p className="text-txt-secondary text-sm mb-1">Available Balance</p>
        <p className="text-txt text-3xl font-extrabold">
          Rp{balance.toLocaleString('id-ID', { minimumFractionDigits: 0 })}
        </p>
      </div>
      {showBonus && bonusBalance !== undefined && (
        <div className="flex justify-center mt-2">
          <div className="bg-bg-card rounded-full px-3 py-1">
            <span className="text-txt-muted text-xs">
              Bonus: Rp{bonusBalance.toLocaleString('id-ID', { minimumFractionDigits: 0 })}
            </span>
            <span className="text-txt-muted text-[10px] ml-1">(not withdrawable)</span>
          </div>
        </div>
      )}
    </div>
  );
}
