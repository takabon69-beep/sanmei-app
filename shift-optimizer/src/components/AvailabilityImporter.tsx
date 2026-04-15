import React, { useState } from 'react';
import { Upload, Check, AlertCircle, Clock } from 'lucide-react';

export interface WorkerAvailability {
  name: string;
  /** Key: YYYY-MM-DD, Value: 時間帯文字列 (例: "9:00-14:00") */
  availability: { [date: string]: string };
  minHours?: number;
  maxHours?: number;
}

interface Props {
  onImport: (workers: WorkerAvailability[]) => void;
}

const AvailabilityImporter: React.FC<Props> = ({ onImport }) => {
  const [csvText, setCsvText] = useState('');
  const [workers, setWorkers] = useState<WorkerAvailability[]>([]);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'idle'; message: string }>({
    type: 'idle',
    message: '',
  });

  const handleParse = () => {
    try {
      if (!csvText.trim()) {
        setStatus({ type: 'error', message: 'CSVデータが空です。' });
        return;
      }

      const delimiter = csvText.includes('\t') ? '\t' : ',';
      const rows = csvText.split('\n').map(r =>
        r.split(delimiter).map(c => c.trim().replace(/^"|"$/g, ''))
      );

      if (rows.length < 2) {
        setStatus({ type: 'error', message: '有効なデータ（ヘッダーと1行以上）を入力してください。' });
        return;
      }

      const header = rows[0];
      const dataRows = rows.slice(1);

      const dateColumns: { index: number; date: string }[] = [];
      let nameColumnIndex = -1;

      header.forEach((col, i) => {
        const dateMatch = col.match(/(\d{4}[/-])?(\d{1,2})[/-](\d{1,2})/);
        if (dateMatch) {
          const year = dateMatch[1] ? dateMatch[1].replace(/[/-]/, '') : new Date().getFullYear();
          const month = dateMatch[2].padStart(2, '0');
          const day = dateMatch[3].padStart(2, '0');
          dateColumns.push({ index: i, date: `${year}-${month}-${day}` });
        } else if (col.includes('名前') || col.includes('氏名') || col.toLowerCase().includes('name')) {
          if (nameColumnIndex === -1) nameColumnIndex = i;
        }
      });

      if (nameColumnIndex === -1) nameColumnIndex = 0;

      const parsed: WorkerAvailability[] = dataRows
        .filter(row => row.length > nameColumnIndex && row[nameColumnIndex])
        .map(row => {
          const name = row[nameColumnIndex];
          const availability: { [date: string]: string } = {};
          dateColumns.forEach(dc => {
            const val = row[dc.index];
            if (val && !['x', '-', '×', 'なし', '不可', ''].includes(val)) {
              availability[dc.date] = val;
            }
          });
          return { name, availability };
        });

      if (parsed.length === 0) {
        setStatus({ type: 'error', message: '有効なスタッフデータが見つかりませんでした。' });
        return;
      }

      setWorkers(parsed);
      onImport(parsed);
      setStatus({ type: 'success', message: `${parsed.length}名分のデータを読み込みました。時間設定を確認してください。` });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'データの読み込み中にエラーが発生しました。' });
    }
  };

  const updateWorkerHours = (index: number, field: 'minHours' | 'maxHours', value: string) => {
    const updated = workers.map((w, i) => {
      if (i !== index) return w;
      const num = value === '' ? undefined : parseFloat(value);
      return { ...w, [field]: num };
    });
    setWorkers(updated);
    onImport(updated);
  };

  return (
    <div>
      {/* ペーストエリア */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600 }}>
          スプレッドシートの範囲をコピーして貼り付けてください
        </label>
        <textarea
          rows={8}
          value={csvText}
          onChange={e => setCsvText(e.target.value)}
          placeholder={`名前\t4/1\t4/2\t4/3\n田中\t9:00-14:00\t\t10:00-16:00\n佐藤\t13:00-18:00\t10:00-15:00\t`}
          style={{
            width: '100%',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            color: 'white',
            padding: '1rem',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            resize: 'vertical',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
            {status.type === 'success' && <Check style={{ color: '#4ade80' }} size={18} />}
            {status.type === 'error' && <AlertCircle style={{ color: '#f87171' }} size={18} />}
            <span style={{ color: status.type === 'error' ? '#f87171' : status.type === 'success' ? '#4ade80' : 'var(--text-muted)' }}>
              {status.message}
            </span>
          </div>
          <button className="btn-primary" onClick={handleParse} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload size={18} /> 読み込む
          </button>
        </div>
      </div>

      {/* 貼り付けのコツ */}
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem', borderStyle: 'dashed' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>💡 貼り付けのコツ</p>
        <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '1.2rem', lineHeight: 1.8 }}>
          <li>GoogleスプレッドシートやExcelをコピー（Ctrl+C）してそのまま貼り付け（Ctrl+V）</li>
          <li>時間帯は「9:00-14:00」や「9-17」形式で入力すると勤務時間が自動計算されます</li>
          <li>空白・「×」・「-」は「休み」として扱われます</li>
        </ul>
      </div>

      {/* スタッフごとの時間設定 */}
      {workers.length > 0 && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem', color: 'var(--primary)' }}>
            <Clock size={20} /> スタッフごとの月間勤務時間設定
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--primary)' }}>
                  <th style={{ textAlign: 'left', padding: '0.6rem 1rem', fontSize: '0.9rem' }}>名前</th>
                  <th style={{ textAlign: 'center', padding: '0.6rem', fontSize: '0.9rem' }}>最少時間（h）</th>
                  <th style={{ textAlign: 'center', padding: '0.6rem', fontSize: '0.9rem' }}>最大時間（h）</th>
                  <th style={{ textAlign: 'center', padding: '0.6rem', fontSize: '0.9rem' }}>出勤可能日数</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((w, i) => {
                  const availDays = Object.keys(w.availability).length;
                  return (
                    <tr key={w.name} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 600 }}>{w.name}</td>
                      <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          placeholder="なし"
                          value={w.minHours ?? ''}
                          onChange={e => updateWorkerHours(i, 'minHours', e.target.value)}
                          style={{
                            width: '80px',
                            padding: '0.4rem',
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid var(--border)',
                            color: 'white',
                            borderRadius: '4px',
                            textAlign: 'center',
                          }}
                        />
                      </td>
                      <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          placeholder="なし"
                          value={w.maxHours ?? ''}
                          onChange={e => updateWorkerHours(i, 'maxHours', e.target.value)}
                          style={{
                            width: '80px',
                            padding: '0.4rem',
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid var(--border)',
                            color: 'white',
                            borderRadius: '4px',
                            textAlign: 'center',
                          }}
                        />
                      </td>
                      <td style={{ padding: '0.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {availDays}日
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.8rem' }}>
            ※ 空欄の場合は制限なしとして扱います
          </p>
        </div>
      )}
    </div>
  );
};

export default AvailabilityImporter;
