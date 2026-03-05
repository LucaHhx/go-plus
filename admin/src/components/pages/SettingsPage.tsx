import { useEffect, useState } from 'react';
import { useToast } from '../../context/AppContext';
import { configMgmtApi } from '../../api/client';
import FormInput from '../form/FormInput';
import ToggleSwitch from '../form/ToggleSwitch';

interface Config {
  minDeposit: string;
  minWithdrawal: string;
  maxWithdrawal: string;
  upiEnabled: boolean;
  paytmEnabled: boolean;
  gpayEnabled: boolean;
  amazonPayEnabled: boolean;
}

const defaultConfig: Config = {
  minDeposit: '100',
  minWithdrawal: '200',
  maxWithdrawal: '50000',
  upiEnabled: true,
  paytmEnabled: true,
  gpayEnabled: true,
  amazonPayEnabled: false,
};

export default function SettingsPage() {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    configMgmtApi.get()
      .then(data => {
        const d = data as Record<string, unknown>;
        setConfig({
          minDeposit: String(d.minDeposit ?? 100),
          minWithdrawal: String(d.minWithdrawal ?? 200),
          maxWithdrawal: String(d.maxWithdrawal ?? 50000),
          upiEnabled: d.upiEnabled !== false,
          paytmEnabled: d.paytmEnabled !== false,
          gpayEnabled: d.gpayEnabled !== false,
          amazonPayEnabled: Boolean(d.amazonPayEnabled),
        });
      })
      .catch(() => { /* use default */ });
  }, []);

  const handleSave = () => {
    setSaving(true);
    configMgmtApi.update({
      minDeposit: Number(config.minDeposit),
      minWithdrawal: Number(config.minWithdrawal),
      maxWithdrawal: Number(config.maxWithdrawal),
      upiEnabled: config.upiEnabled,
      paytmEnabled: config.paytmEnabled,
      gpayEnabled: config.gpayEnabled,
      amazonPayEnabled: config.amazonPayEnabled,
    })
      .then(() => toast('Settings saved', 'success'))
      .catch(() => toast('Save failed', 'error'))
      .finally(() => setSaving(false));
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">System Settings</h2>
      </div>
      <div className="card" style={{ maxWidth: 560 }}>
        <div className="card-header"><span className="card-title">Payment Limits (INR)</span></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormInput
            label="Minimum Deposit"
            value={config.minDeposit}
            onChange={v => setConfig(c => ({ ...c, minDeposit: v }))}
            type="number"
            placeholder="100"
          />
          <FormInput
            label="Minimum Withdrawal"
            value={config.minWithdrawal}
            onChange={v => setConfig(c => ({ ...c, minWithdrawal: v }))}
            type="number"
            placeholder="200"
          />
          <FormInput
            label="Maximum Withdrawal"
            value={config.maxWithdrawal}
            onChange={v => setConfig(c => ({ ...c, maxWithdrawal: v }))}
            type="number"
            placeholder="50000"
          />
        </div>
      </div>
      <div className="card" style={{ maxWidth: 560, marginTop: 16 }}>
        <div className="card-header"><span className="card-title">Payment Channels</span></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ToggleSwitch label="UPI" checked={config.upiEnabled} onChange={v => setConfig(c => ({ ...c, upiEnabled: v }))} />
          <ToggleSwitch label="Paytm" checked={config.paytmEnabled} onChange={v => setConfig(c => ({ ...c, paytmEnabled: v }))} />
          <ToggleSwitch label="GPay" checked={config.gpayEnabled} onChange={v => setConfig(c => ({ ...c, gpayEnabled: v }))} />
          <ToggleSwitch label="Amazon Pay" checked={config.amazonPayEnabled} onChange={v => setConfig(c => ({ ...c, amazonPayEnabled: v }))} />
        </div>
      </div>
      <div style={{ marginTop: 24 }}>
        <button
          className="btn-primary"
          style={{ maxWidth: 200 }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
