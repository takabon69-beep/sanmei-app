import React, { useState } from 'react';
import InputForm from './components/InputForm';
import MoushikiResult from './components/MoushikiResult';
import { calculateMoushiki } from './utils/calculator';
import './index.css';

function App() {
  const [result, setResult] = useState(null);

  const handleCalculate = (formData) => {
    try {
      const calculatedData = calculateMoushiki(
        formData.year,
        formData.month,
        formData.day,
        formData.hour,
        formData.minute,
        formData.gender,
        formData.isTimeUnknown
      );
      setResult(calculatedData);
    } catch (error) {
      console.error("命式の計算中にエラーが発生しました", error);
      alert("入力された日付の計算ができませんでした。正しい生年月日を入力してください。");
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>命式作成</h1>
        <p>四柱推命・算命学の命式を自動で計算します</p>
      </header>
      
      <InputForm onSubmit={handleCalculate} />
      
      {result && <MoushikiResult result={result} />}
    </div>
  );
}

export default App;
