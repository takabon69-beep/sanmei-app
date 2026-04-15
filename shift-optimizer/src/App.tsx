import React, { useState } from 'react'
import { Calendar, Settings, Users, Sparkles, Play, Info } from 'lucide-react'
import RequirementsEditor, { type DayRequirement, type SpecialRequirement } from './components/RequirementsEditor'
import AvailabilityImporter, { type WorkerAvailability } from './components/AvailabilityImporter'
import ShiftCalendar from './components/ShiftCalendar'
import { generateShift, type ShiftPlan } from './ShiftEngine'
import { startOfMonth, endOfMonth, format } from 'date-fns'

// ===== ボトムナビゲーション（スマホ用） =====
const BottomNav: React.FC<{ activeTab: string; setActiveTab: (t: string) => void }> = ({ activeTab, setActiveTab }) => (
  <nav className="bottom-nav">
    <button className={`bottom-nav-btn${activeTab === 'requirements' ? ' active' : ''}`} onClick={() => setActiveTab('requirements')}>
      <Settings size={22} />
      必要人数
    </button>
    <button className={`bottom-nav-btn${activeTab === 'availability' ? ' active' : ''}`} onClick={() => setActiveTab('availability')}>
      <Users size={22} />
      出勤希望
    </button>
    <button className={`bottom-nav-btn${activeTab === 'calendar' ? ' active' : ''}`} onClick={() => setActiveTab('calendar')}>
      <Calendar size={22} />
      シフト表
    </button>
  </nav>
)

// ===== デスクトップ用タブボタン =====
const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.7rem 1.4rem',
      borderRadius: '0.6rem',
      border: 'none',
      background: active ? 'var(--primary)' : 'transparent',
      color: active ? 'white' : 'var(--text-muted)',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontWeight: 600,
      fontSize: '0.95rem',
    }}
  >
    {icon}
    {label}
  </button>
)

// ===== メインアプリ =====
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('requirements')

  const [dayRequirements, setDayRequirements] = useState<DayRequirement[]>(
    Array.from({ length: 7 }, (_, i) => ({ dayOfWeek: i, count: 2 }))
  )
  const [specialRequirements, setSpecialRequirements] = useState<SpecialRequirement[]>([])
  const [workers, setWorkers] = useState<WorkerAvailability[]>([])
  const [shiftPlan, setShiftPlan] = useState<ShiftPlan | null>(null)

  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()))
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()))

  const handleGenerate = (currentWorkers?: WorkerAvailability[]) => {
    const w = currentWorkers ?? workers
    if (w.length === 0) {
      alert('出勤希望データを先に取り込んでください。')
      setActiveTab('availability')
      return
    }
    const plan = generateShift(startDate, endDate, dayRequirements, specialRequirements, w)
    setShiftPlan(plan)
    setActiveTab('calendar')
  }

  return (
    <div className="container animate-fade-in">
      {/* ===== ヘッダー ===== */}
      <header className="app-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1
            className="app-title"
            style={{
              fontSize: '2.8rem',
              fontWeight: 800,
              background: 'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1,
            }}
          >
            ShiftOptimizer
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', fontSize: '0.9rem' }}>
            小売パートスタッフ シフト管理
          </p>
        </div>

        {/* デスクトップタブ */}
        <div className="tab-desktop glass-card" style={{ padding: '0.5rem', display: 'flex', gap: '0.3rem' }}>
          <TabButton active={activeTab === 'requirements'} onClick={() => setActiveTab('requirements')} icon={<Settings size={18} />} label="必要人数設定" />
          <TabButton active={activeTab === 'availability'} onClick={() => setActiveTab('availability')} icon={<Users size={18} />} label="出勤希望データ" />
          <TabButton active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} icon={<Calendar size={18} />} label="シフト表生成" />
        </div>
      </header>

      {/* ===== メインコンテンツ ===== */}
      <main>
        <div className="animate-fade-in" key={activeTab}>

          {/* 必要人数設定 */}
          {activeTab === 'requirements' && (
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.3rem' }}>
                  <Settings style={{ color: 'var(--primary)' }} size={22} /> 必要人数の設定
                </h2>
                {/* 対象期間 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>対象期間:</span>
                  <input
                    type="date"
                    value={format(startDate, 'yyyy-MM-dd')}
                    onChange={e => setStartDate(new Date(e.target.value))}
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'white', padding: '0.4rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                  <span>〜</span>
                  <input
                    type="date"
                    value={format(endDate, 'yyyy-MM-dd')}
                    onChange={e => setEndDate(new Date(e.target.value))}
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'white', padding: '0.4rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
              <RequirementsEditor
                dayRequirements={dayRequirements}
                specialRequirements={specialRequirements}
                setDayRequirements={setDayRequirements}
                setSpecialRequirements={setSpecialRequirements}
              />
            </div>
          )}

          {/* 出勤希望データ */}
          {activeTab === 'availability' && (
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.3rem' }}>
                <Users style={{ color: 'var(--primary)' }} size={22} /> 出勤希望データの取り込み
              </h2>
              <AvailabilityImporter
                onImport={data => {
                  setWorkers(data)
                }}
              />
              {workers.length > 0 && (
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                  <button
                    className="btn-primary"
                    onClick={() => handleGenerate(workers)}
                    style={{ padding: '0.9rem 2.5rem', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.7rem' }}
                  >
                    <Play size={20} /> シフト案を生成する
                  </button>
                </div>
              )}
            </div>
          )}

          {/* シフト表カレンダー */}
          {activeTab === 'calendar' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.3rem' }}>
                  <Sparkles size={24} style={{ color: '#fbbf24' }} /> 生成されたシフトプラン
                </h2>
                {shiftPlan && (
                  <button
                    className="btn-primary"
                    onClick={() => handleGenerate(workers)}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Play size={16} /> 再生成
                  </button>
                )}
              </div>

              {shiftPlan ? (
                <ShiftCalendar
                  startDate={startDate}
                  endDate={endDate}
                  shiftPlan={shiftPlan}
                  workers={workers}
                />
              ) : (
                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                  <Info size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                  <h3>シフト案が作成されていません</h3>
                  <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    「必要人数設定」と「出勤希望データ」を完了させてください。
                  </p>
                  <button className="btn-primary" onClick={() => setActiveTab('requirements')} style={{ marginTop: '1.5rem' }}>
                    設定を確認する
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* スマホ用ボトムナビゲーション */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}

export default App
