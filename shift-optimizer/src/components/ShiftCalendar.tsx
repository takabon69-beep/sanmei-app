import React, { useMemo } from 'react';
import {
  format,
  eachDayOfInterval,
  getDay,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  max,
  min,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import type { ShiftPlan } from '../ShiftEngine';
import type { WorkerAvailability } from './AvailabilityImporter';
import { AlertTriangle, Download, BarChart2 } from 'lucide-react';

const WORKER_COLORS = [
  '#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
  '#8b5cf6', '#d946ef', '#fb923c', '#84cc16', '#0ea5e9',
];

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

interface Props {
  startDate: Date;
  endDate: Date;
  shiftPlan: ShiftPlan;
  workers: WorkerAvailability[];
}

const ShiftCalendar: React.FC<Props> = ({ startDate, endDate, shiftPlan, workers }) => {
  // スタッフ名→カラーのマップ
  const workerColorMap = useMemo(() => {
    const map: { [name: string]: string } = {};
    workers.forEach((w, i) => {
      map[w.name] = WORKER_COLORS[i % WORKER_COLORS.length];
    });
    return map;
  }, [workers]);

  // 対象期間の月リスト
  const months = useMemo(
    () => eachMonthOfInterval({ start: startDate, end: endDate }),
    [startDate, endDate]
  );

  const getAssignments = (dateStr: string) =>
    shiftPlan.assignments.filter(a => a.date === dateStr);

  const getShortage = (dateStr: string) =>
    shiftPlan.shortages.find(s => s.date === dateStr);

  const downloadCSV = () => {
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const header = ['日付', '曜日', '出勤メンバー'];
    const rows = days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayName = format(day, 'EEEE', { locale: ja });
      const assigns = getAssignments(dateStr);
      const members = assigns.map(a => `${a.workerName}(${a.timeSlot})`).join(' / ');
      return [dateStr, dayName, members].map(v => `"${v}"`).join(',');
    });
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csv], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shift_${format(startDate, 'yyyyMMdd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      {/* 書き出しボタン */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button className="btn-primary" onClick={downloadCSV} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={18} /> CSVで書き出し
        </button>
      </div>

      {/* 月ごとのカレンダー */}
      {months.map(month => {
        const monthStart = max([startDate, startOfMonth(month)]);
        const monthEnd = min([endDate, endOfMonth(month)]);
        const daysInRange = eachDayOfInterval({ start: monthStart, end: monthEnd });

        // 最初の日の曜日（0=日）でグリッドの開始位置を決める
        const firstDayOfWeek = getDay(monthStart);

        // 全セル = 空パッド + 実日
        const cells: (Date | null)[] = [
          ...Array.from({ length: firstDayOfWeek }, () => null),
          ...daysInRange,
        ];

        // 7列ずつ週行に分割
        const weeks: (Date | null)[][] = [];
        for (let i = 0; i < cells.length; i += 7) {
          weeks.push(cells.slice(i, i + 7));
        }

        return (
          <div key={format(month, 'yyyy-MM')} className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
            {/* 月ヘッダー */}
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>
              {format(month, 'yyyy年M月', { locale: ja })}
            </h3>

            {/* 曜日ヘッダー */}
            <div className="cal-grid">
              {DAY_LABELS.map((d, i) => (
                <div
                  key={d}
                  className="cal-day-label"
                  style={{
                    color: i === 0 ? '#f87171' : i === 6 ? '#60a5fa' : 'var(--text-muted)',
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* 週行 */}
            {weeks.map((week, wi) => (
              <div key={wi} className="cal-grid">
                {week.map((day, di) => {
                  if (!day) {
                    return <div key={`empty-${di}`} className="cal-cell cal-cell--empty" />;
                  }
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const assigns = getAssignments(dateStr);
                  const shortage = getShortage(dateStr);
                  const dow = getDay(day);
                  const isSun = dow === 0;
                  const isSat = dow === 6;

                  return (
                    <div
                      key={dateStr}
                      className="cal-cell"
                      style={{
                        background: isSun
                          ? 'rgba(248,113,113,0.07)'
                          : isSat
                          ? 'rgba(96,165,250,0.07)'
                          : undefined,
                        borderColor: shortage ? 'rgba(248,113,113,0.5)' : undefined,
                      }}
                    >
                      {/* 日付番号 */}
                      <span
                        className="cal-date-num"
                        style={{
                          color: isSun ? '#f87171' : isSat ? '#60a5fa' : 'var(--text-main)',
                        }}
                      >
                        {format(day, 'd')}
                      </span>

                      {/* 担当者チップ */}
                      <div className="cal-chips">
                        {assigns.map((a, idx) => {
                          const color = workerColorMap[a.workerName] ?? '#6366f1';
                          return (
                            <div
                              key={idx}
                              className="cal-chip"
                              title={`${a.workerName} ${a.timeSlot}`}
                              style={{
                                background: `${color}33`,
                                border: `1px solid ${color}88`,
                                color,
                              }}
                            >
                              <span className="cal-chip-name">{a.workerName}</span>
                            </div>
                          );
                        })}
                        {shortage && (
                          <div className="cal-chip cal-chip--shortage" title={`人不足: あと${shortage.count}名`}>
                            <AlertTriangle size={10} />
                            <span>-{shortage.count}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {/* 週末の空きセルを補完 */}
                {week.length < 7 &&
                  Array.from({ length: 7 - week.length }, (_, k) => (
                    <div key={`tail-${k}`} className="cal-cell cal-cell--empty" />
                  ))}
              </div>
            ))}
          </div>
        );
      })}

      {/* スタッフ別勤務時間サマリー */}
      {workers.length > 0 && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem', color: 'var(--primary)' }}>
            <BarChart2 size={20} /> スタッフ別 月間勤務時間
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {workers.map(w => {
              const assigned = shiftPlan.workerHours[w.name] ?? 0;
              const minH = w.minHours;
              const maxH = w.maxHours;
              const color = workerColorMap[w.name] ?? '#6366f1';
              const barMax = maxH ?? Math.max(assigned, 80);
              const barPct = barMax > 0 ? Math.min((assigned / barMax) * 100, 100) : 0;
              const underMin = minH != null && assigned < minH;
              const overMax = maxH != null && assigned > maxH;

              return (
                <div key={w.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{w.name}</span>
                    <span style={{ fontSize: '0.85rem', color: underMin ? '#f87171' : overMax ? '#fb923c' : 'var(--text-muted)' }}>
                      {assigned.toFixed(1)}h
                      {minH != null && <span style={{ color: 'var(--text-muted)' }}> / 最少{minH}h</span>}
                      {maxH != null && <span style={{ color: 'var(--text-muted)' }}> 最大{maxH}h</span>}
                      {underMin && <span style={{ color: '#f87171', marginLeft: '0.4rem' }}>⚠ 下限未達</span>}
                    </span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${barPct}%`,
                        background: overMax ? '#fb923c' : underMin ? '#f87171' : color,
                        borderRadius: '99px',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftCalendar;
