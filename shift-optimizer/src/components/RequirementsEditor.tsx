import React from 'react';
import { Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react';

export interface DayRequirement {
  dayOfWeek: number; // 0-6
  count: number;
}

export interface SpecialRequirement {
  date: string;
  count: number;
}

interface Props {
  dayRequirements: DayRequirement[];
  specialRequirements: SpecialRequirement[];
  setDayRequirements: (reqs: DayRequirement[]) => void;
  setSpecialRequirements: (reqs: SpecialRequirement[]) => void;
}

const DAYS = ['日', '月', '火', '水', '木', '金', '土'];

const RequirementsEditor: React.FC<Props> = ({ 
  dayRequirements, 
  specialRequirements, 
  setDayRequirements, 
  setSpecialRequirements 
}) => {

  const handleDayChange = (dayIndex: number, value: number) => {
    const newReqs = [...dayRequirements];
    newReqs[dayIndex].count = value;
    setDayRequirements(newReqs);
  };

  const addSpecial = () => {
    const today = new Date().toISOString().split('T')[0];
    setSpecialRequirements([...specialRequirements, { date: today, count: 1 }]);
  };

  const removeSpecial = (index: number) => {
    setSpecialRequirements(specialRequirements.filter((_, i) => i !== index));
  };

  const handleSpecialChange = (index: number, value: number) => {
    const newSpecial = [...specialRequirements];
    newSpecial[index].count = value;
    setSpecialRequirements(newSpecial);
  };

  return (
    <div className="grid">
      <section>
        <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>曜日ごとの必要人数（通常）</h3>
        <div className="glass-card" style={{ padding: '1rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>曜日</th>
                <th style={{ textAlign: 'center', padding: '0.5rem' }}>必要人数</th>
              </tr>
            </thead>
            <tbody>
              {dayRequirements.map((req, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{DAYS[i]}曜日</td>
                  <td style={{ textAlign: 'center', padding: '0.5rem' }}>
                    <input 
                      type="number" 
                      min="0"
                      value={req.count}
                      onChange={(e) => handleDayChange(i, parseInt(e.target.value) || 0)}
                      style={{ 
                        width: '80px', 
                        padding: '0.5rem', 
                        background: 'rgba(0,0,0,0.2)', 
                        border: '1px solid var(--border)',
                        color: 'white',
                        borderRadius: '4px',
                        textAlign: 'center'
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ color: 'var(--primary)' }}>特定の日付の例外設定</h3>
          <button className="btn-primary" onClick={addSpecial} style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={16} /> 追加
          </button>
        </div>
        <div className="grid">
          {specialRequirements.map((spec, i) => (
            <div key={i} className="glass-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CalendarIcon size={16} className="text-muted" />
                <input 
                  type="date" 
                  value={spec.date}
                  onChange={(e) => {
                    const newSpecial = [...specialRequirements];
                    newSpecial[i].date = e.target.value;
                    setSpecialRequirements(newSpecial);
                  }}
                  style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>必要人数:</span>
                <input 
                  type="number" 
                  min="0"
                  value={spec.count}
                  onChange={(e) => handleSpecialChange(i, parseInt(e.target.value) || 0)}
                  style={{ 
                    width: '60px', 
                    padding: '0.4rem', 
                    background: 'rgba(0,0,0,0.2)', 
                    border: '1px solid var(--border)',
                    color: 'white',
                    borderRadius: '4px',
                    textAlign: 'center'
                  }}
                />
              </div>
              <button 
                onClick={() => removeSpecial(i)}
                style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {specialRequirements.length === 0 && (
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', borderStyle: 'dashed', color: 'var(--text-muted)' }}>
              例外設定はありません。忙しい日を追加してください。
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default RequirementsEditor;
