import React, { useState } from 'react';
import { Calendar, Clock, User } from 'lucide-react';

export default function InputForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    year: '1990',
    month: '1',
    day: '1',
    hour: '',
    minute: '',
    gender: 'female',
    isTimeUnknown: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <div className="grid-2">
          {/* 性別 */}
          <div className="form-group">
            <label className="form-label"><User size={16} style={{display:'inline', marginRight:'8px'}}/>性別</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="form-control">
              <option value="female">女性</option>
              <option value="male">男性</option>
            </select>
          </div>
        </div>

        {/* 生年月日 */}
        <div className="form-group">
          <label className="form-label"><Calendar size={16} style={{display:'inline', marginRight:'8px'}}/>生年月日</label>
          <div className="grid-3">
            <div>
              <input type="number" name="year" value={formData.year} onChange={handleChange} className="form-control" placeholder="年" required min="1900" max="2100" />
            </div>
            <div>
              <input type="number" name="month" value={formData.month} onChange={handleChange} className="form-control" placeholder="月" required min="1" max="12" />
            </div>
            <div>
              <input type="number" name="day" value={formData.day} onChange={handleChange} className="form-control" placeholder="日" required min="1" max="31" />
            </div>
          </div>
        </div>

        {/* 出生時間 */}
        <div className="form-group">
          <label className="form-label">
            <Clock size={16} style={{display:'inline', marginRight:'8px'}}/>出生時間
          </label>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-light)' }}>
              <input 
                type="checkbox" 
                name="isTimeUnknown" 
                checked={formData.isTimeUnknown} 
                onChange={handleChange} 
              />
              出生時間が不明
            </label>
          </div>
          
          {!formData.isTimeUnknown && (
            <div className="grid-2">
              <div>
                <input type="number" name="hour" value={formData.hour} onChange={handleChange} className="form-control" placeholder="時 (0-23)" min="0" max="23" required={!formData.isTimeUnknown}/>
              </div>
              <div>
                <input type="number" name="minute" value={formData.minute} onChange={handleChange} className="form-control" placeholder="分 (0-59)" min="0" max="59" required={!formData.isTimeUnknown}/>
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="primary-btn" style={{ marginTop: '1.5rem' }}>
          命式を作成する
        </button>
      </form>
    </div>
  );
}
