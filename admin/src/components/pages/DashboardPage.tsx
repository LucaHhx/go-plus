import { useEffect, useState } from 'react';
import { useNavigate } from '../../context/AppContext';
import { dashboardApi } from '../../api/client';
import StatCard from '../data-display/StatCard';
import Icon from '../ui/Icon';

interface DashboardStats {
  newUsers: number;
  activeUsers: number;
  depositsToday: number;
  withdrawalsToday: number;
  pendingWithdrawals: number;
  newUsersChange: number;
  activeUsersChange: number;
  depositsChange: number;
  withdrawalsChange: number;
  weeklyChart: { date: string; deposits: number; withdrawals: number }[];
}

const mockStats: DashboardStats = {
  newUsers: 142,
  activeUsers: 1847,
  depositsToday: 452300,
  withdrawalsToday: 123400,
  pendingWithdrawals: 3,
  newUsersChange: 12.5,
  activeUsersChange: 5.2,
  depositsChange: 18.3,
  withdrawalsChange: -3.1,
  weeklyChart: [
    { date: 'Feb 26', deposits: 380000, withdrawals: 95000 },
    { date: 'Feb 27', deposits: 420000, withdrawals: 88000 },
    { date: 'Feb 28', deposits: 310000, withdrawals: 105000 },
    { date: 'Mar 1', deposits: 490000, withdrawals: 72000 },
    { date: 'Mar 2', deposits: 360000, withdrawals: 115000 },
    { date: 'Mar 3', deposits: 410000, withdrawals: 92000 },
    { date: 'Today', deposits: 452300, withdrawals: 123400 },
  ],
};

function formatIDR(amount: number): string {
  return 'Rp' + amount.toLocaleString('id-ID');
}

/** Map backend nested response to frontend flat structure.
 *  After camelizeKeys in interceptor, field names are already camelCase. */
function mapApiResponse(raw: Record<string, unknown>): DashboardStats {
  const today = (raw.today ?? {}) as Record<string, number>;
  const week = (raw.week ?? {}) as Record<string, number>;

  const todayDeposits = today.totalDeposits ?? 0;
  const todayWithdrawals = today.totalWithdrawals ?? 0;
  const weekDeposits = week.totalDeposits ?? 0;
  const weekWithdrawals = week.totalWithdrawals ?? 0;

  // Estimate daily average from week to compute change percentage
  const avgDailyDeposits = weekDeposits / 7 || 1;
  const avgDailyWithdrawals = weekWithdrawals / 7 || 1;
  const avgDailyNewUsers = (week.newUsers ?? 0) / 7 || 1;
  const avgDailyActiveUsers = (week.activeUsers ?? 0) / 7 || 1;

  return {
    newUsers: today.newUsers ?? 0,
    activeUsers: today.activeUsers ?? 0,
    depositsToday: todayDeposits,
    withdrawalsToday: todayWithdrawals,
    pendingWithdrawals: today.pendingWithdrawals ?? 0,
    newUsersChange: Math.round(((today.newUsers ?? 0) / avgDailyNewUsers - 1) * 1000) / 10,
    activeUsersChange: Math.round(((today.activeUsers ?? 0) / avgDailyActiveUsers - 1) * 1000) / 10,
    depositsChange: Math.round((todayDeposits / avgDailyDeposits - 1) * 1000) / 10,
    withdrawalsChange: Math.round((todayWithdrawals / avgDailyWithdrawals - 1) * 1000) / 10,
    // Backend doesn't provide daily breakdown; keep mock chart data
    weeklyChart: mockStats.weeklyChart,
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const navigate = useNavigate();

  useEffect(() => {
    dashboardApi.stats()
      .then(data => setStats(mapApiResponse(data as Record<string, unknown>)))
      .catch(() => { /* use mock data */ });
  }, []);

  const maxChart = Math.max(...stats.weeklyChart.flatMap(d => [d.deposits, d.withdrawals]), 1);

  return (
    <div>
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatCard
          icon="user"
          label="New Users Today"
          value={String(stats.newUsers)}
          change={`${stats.newUsersChange > 0 ? '+' : ''}${stats.newUsersChange}% from yesterday`}
          changeType={stats.newUsersChange >= 0 ? 'up' : 'down'}
          iconColor="#24EE89"
        />
        <StatCard
          icon="user"
          label="Active Users"
          value={stats.activeUsers.toLocaleString()}
          change={`${stats.activeUsersChange > 0 ? '+' : ''}${stats.activeUsersChange}% from yesterday`}
          changeType={stats.activeUsersChange >= 0 ? 'up' : 'down'}
          iconColor="#60a5fa"
        />
        <StatCard
          icon="trendUp"
          label="Deposits Today"
          value={formatIDR(stats.depositsToday)}
          change={`${stats.depositsChange > 0 ? '+' : ''}${stats.depositsChange}% from yesterday`}
          changeType={stats.depositsChange >= 0 ? 'up' : 'down'}
          iconColor="#24EE89"
        />
        <div className="stat-card" onClick={() => navigate('withdrawals')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-top">
            <div className="stat-card-icon" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
              <Icon name="trendDown" size={18} />
            </div>
          </div>
          <div className="stat-card-label">Withdrawals Today</div>
          <div className="stat-card-value">{formatIDR(stats.withdrawalsToday)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className={`stat-change ${stats.withdrawalsChange >= 0 ? 'up' : 'down'}`}>
              {stats.withdrawalsChange > 0 ? '+' : ''}{stats.withdrawalsChange}%
            </span>
            {stats.pendingWithdrawals > 0 && (
              <span style={{
                background: '#ef4444', color: '#fff',
                fontSize: 10, fontWeight: 700,
                padding: '2px 6px', borderRadius: 10,
              }}>
                {stats.pendingWithdrawals} pending
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">7-Day Deposits vs Withdrawals</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 180, padding: '0 4px' }}>
          {stats.weeklyChart.map((day, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ width: '100%', display: 'flex', gap: 3, alignItems: 'flex-end', justifyContent: 'center', height: 160 }}>
                <div style={{
                  width: 16, borderRadius: '4px 4px 0 0',
                  height: `${(day.deposits / maxChart) * 100}%`,
                  background: i === stats.weeklyChart.length - 1 ? '#24EE89' : 'rgba(36,238,137,0.5)',
                  transition: 'height 0.6s ease',
                }} />
                <div style={{
                  width: 16, borderRadius: '4px 4px 0 0',
                  height: `${(day.withdrawals / maxChart) * 100}%`,
                  background: i === stats.weeklyChart.length - 1 ? '#ef4444' : 'rgba(239,68,68,0.5)',
                  transition: 'height 0.6s ease',
                }} />
              </div>
              <span style={{
                fontSize: 10, color: i === stats.weeklyChart.length - 1 ? '#e2e8f0' : '#64748b',
                fontWeight: i === stats.weeklyChart.length - 1 ? 600 : 400,
              }}>{day.date}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: '#24EE89' }} />
            <span style={{ fontSize: 12, color: '#64748b' }}>Deposits</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: '#ef4444' }} />
            <span style={{ fontSize: 12, color: '#64748b' }}>Withdrawals</span>
          </div>
        </div>
      </div>
    </div>
  );
}
