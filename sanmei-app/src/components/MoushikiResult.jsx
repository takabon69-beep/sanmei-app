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
          <div className="card kanshi-box">
            <span className="kanshi-label">時柱</span>
            <span className="kanshi-char">{inSen.time || '不明'}</span>
          </div>
          <div className="card kanshi-box">
            <span className="kanshi-label">日柱</span>
            <span className="kanshi-char">{inSen.day}</span>
          </div>
          <div className="card kanshi-box">
            <span className="kanshi-label">月柱</span>
            <span className="kanshi-char">{inSen.month}</span>
          </div>
          <div className="card kanshi-box">
            <span className="kanshi-label">年柱</span>
            <span className="kanshi-char">{inSen.year}</span>
          </div>
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
          <table className="luck-table">
            <thead>
              <tr>
                <th>年齢</th>
                <th>年</th>
                <th>干支</th>
              </tr>
            </thead>
            <tbody>
              {daYun.map((yun, i) => (
                <tr key={i}>
                  <td>{yun.startAge}〜{yun.endAge}歳</td>
                  <td>{yun.year}〜</td>
                  <td>{yun.ganzhi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass-panel" style={{ overflow: 'auto' }}>
          <h3 className="result-title">年運（流年）</h3>
          <table className="luck-table">
            <thead>
              <tr>
                <th>年</th>
                <th>干支</th>
              </tr>
            </thead>
            <tbody>
              {niuNian.map((nian, i) => (
                <tr key={i}>
                  <td>{nian.year}年</td>
                  <td>{nian.ganzhi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
