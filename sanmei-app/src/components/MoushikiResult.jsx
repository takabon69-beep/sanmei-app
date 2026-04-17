import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function MoushikiResult({ result }) {
  if (!result) return null;

  const { inSen, youSen, tenchuusatsu, daYun, niuNian, monthlyEnergy } = result;

  return (
    <div className="result-section">
      {/* 陰占 */}
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h3 className="result-title">陰占（干支）</h3>
        <p style={{marginBottom: '1rem', color: 'var(--text-light)'}}>
          天中殺: <strong style={{color: 'var(--accent-red)'}}>{tenchuusatsu}</strong>
        </p>
        <div className="grid-4" style={{ gap: '1rem' }}>
          {[
            { label: '時柱', char: inSen.time || '不明', gogyo: inSen.timeGogyo, zoukan: inSen.timeZoukan },
            { label: '日柱', char: inSen.day, gogyo: inSen.dayGogyo, zoukan: inSen.dayZoukan },
            { label: '月柱', char: inSen.month, gogyo: inSen.monthGogyo, zoukan: inSen.monthZoukan },
            { label: '年柱', char: inSen.year, gogyo: inSen.yearGogyo, zoukan: inSen.yearZoukan }
          ].map((col, idx) => (
            <div key={idx} className="card kanshi-box">
              <span className="kanshi-label">{col.label}</span>
              <span className="kanshi-char">{col.char}</span>
              {col.char !== '不明' && (
                <div className="kanshi-details" style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-light)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span>五行:</span>
                    <span style={{color: 'var(--accent-blue)'}}>{col.gogyo?.gan} / {col.gogyo?.zhi}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>蔵干:</span>
                    <span style={{color: 'var(--accent-gold)'}}>{col.zoukan}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 陽占（人体星図） */}
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h3 className="result-title">陽占（人体星図）</h3>
        <div className="yousen-grid">
          <div className="yousen-cell empty"></div>
          <div className="yousen-cell">
            <span className="yousen-label">頭の星</span>
            <span className="yousen-star">{youSen.head}</span>
          </div>
          <div className="yousen-cell">
            <span className="yousen-label">左肩 (初年)</span>
            <span className="yousen-star">{youSen.leftShoulder}</span>
          </div>

          <div className="yousen-cell">
            <span className="yousen-label">右手の星</span>
            <span className="yousen-star">{youSen.rightHand}</span>
          </div>
          <div className="yousen-cell" style={{ background: 'rgba(203, 168, 96, 0.1)' }}>
            <span className="yousen-label">胸の星 (本質)</span>
            <span className="yousen-star">{youSen.chest}</span>
          </div>
          <div className="yousen-cell">
            <span className="yousen-label">左手の星</span>
            <span className="yousen-star">{youSen.leftHand}</span>
          </div>

          <div className="yousen-cell">
            <span className="yousen-label">右足 (中年)</span>
            <span className="yousen-star">{youSen.rightFoot}</span>
          </div>
          <div className="yousen-cell">
            <span className="yousen-label">腹の星</span>
            <span className="yousen-star">{youSen.belly}</span>
          </div>
          <div className="yousen-cell">
            <span className="yousen-label">左足 (晩年)</span>
            <span className="yousen-star">{youSen.leftFoot}</span>
          </div>
        </div>
      </div>
      
      {/* グラフエリア */}
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h3 className="result-title">今年の月別エネルギー推移</h3>
        <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
          <ResponsiveContainer>
            <LineChart
              data={monthlyEnergy}
              margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="month" stroke="var(--text-light)" />
              <YAxis domain={[0, 12]} stroke="var(--text-light)" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid var(--accent-gold)' }}
                labelStyle={{ fontWeight: 'bold', color: 'var(--accent-blue)' }}
                formatter={(value, name, props) => [`エネルギー: ${value}`, props.payload.ganzhi]}
              />
              <Line 
                type="monotone" 
                dataKey="energy" 
                stroke="var(--accent-gold)" 
                strokeWidth={3}
                dot={{ fill: 'var(--accent-blue)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 大運・年運 */}
      <div className="grid-2">
        <div className="glass-panel" style={{ overflow: 'auto' }}>
          <h3 className="result-title">大運（10年運）</h3>
          <table className="luck-table" style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                <th style={{ padding: '8px' }}>年齢</th>
                <th style={{ padding: '8px' }}>年</th>
                <th style={{ padding: '8px' }}>干支</th>
                <th style={{ padding: '8px' }}>主星</th>
                <th style={{ padding: '8px' }}>従星</th>
              </tr>
            </thead>
            <tbody>
              {daYun.map((yun, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <td style={{ padding: '8px' }}>{yun.startAge}〜{yun.endAge}歳</td>
                  <td style={{ padding: '8px' }}>{yun.year}〜</td>
                  <td style={{ padding: '8px' }}>{yun.ganzhi}</td>
                  <td style={{ padding: '8px', color: 'var(--accent-gold)' }}>{yun.tenStar}</td>
                  <td style={{ padding: '8px', color: 'var(--accent-blue)' }}>{yun.twelveStar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass-panel" style={{ overflow: 'auto' }}>
          <h3 className="result-title">年運（流年）</h3>
          <table className="luck-table" style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                <th style={{ padding: '8px' }}>年</th>
                <th style={{ padding: '8px' }}>干支</th>
                <th style={{ padding: '8px' }}>主星</th>
                <th style={{ padding: '8px' }}>従星</th>
              </tr>
            </thead>
            <tbody>
              {niuNian.map((nian, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <td style={{ padding: '8px' }}>{nian.year}年</td>
                  <td style={{ padding: '8px' }}>{nian.ganzhi}</td>
                  <td style={{ padding: '8px', color: 'var(--accent-gold)' }}>{nian.tenStar}</td>
                  <td style={{ padding: '8px', color: 'var(--accent-blue)' }}>{nian.twelveStar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
