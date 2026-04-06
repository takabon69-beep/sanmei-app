import { Solar } from 'lunar-javascript';

// 五行・陰陽の対応表（簡易版）
const GAN_ELEMENTS = {
  '甲': { elem: '木', polar: '+' }, '乙': { elem: '木', polar: '-' },
  '丙': { elem: '火', polar: '+' }, '丁': { elem: '火', polar: '-' },
  '戊': { elem: '土', polar: '+' }, '己': { elem: '土', polar: '-' },
  '庚': { elem: '金', polar: '+' }, '辛': { elem: '金', polar: '-' },
  '壬': { elem: '水', polar: '+' }, '癸': { elem: '水', polar: '-' }
};

const ZHI_ELEMENTS = {
  '子': { elem: '水', polar: '+' }, '丑': { elem: '土', polar: '-' },
  '寅': { elem: '木', polar: '+' }, '卯': { elem: '木', polar: '-' },
  '辰': { elem: '土', polar: '+' }, '巳': { elem: '火', polar: '-' },
  '午': { elem: '火', polar: '+' }, '未': { elem: '土', polar: '-' },
  '申': { elem: '金', polar: '+' }, '酉': { elem: '金', polar: '-' },
  '戌': { elem: '土', polar: '+' }, '亥': { elem: '水', polar: '-' }
};

// 十大主星の簡易算出ロジック（日干から見た関係）
function getTenStar(dayGan, targetGan) {
  if (!dayGan || !targetGan) return '';
  const d = GAN_ELEMENTS[dayGan];
  const t = GAN_ELEMENTS[targetGan];
  if (!d || !t) return '';

  const relation = [d.elem, t.elem].join('');
  let type = '';
  // 比和: 同じ、相生: 生じる、相剋: 剋する
  if (d.elem === t.elem) type = '同';
  else if (relation === '木火' || relation === '火土' || relation === '土金' || relation === '金水' || relation === '水木') type = '生'; // 日主が生じる
  else if (relation === '木水' || relation === '火木' || relation === '土火' || relation === '金土' || relation === '水金') type = '印'; // 日主を生じる
  else if (relation === '木土' || relation === '火金' || relation === '土水' || relation === '金木' || relation === '水火') type = '剋'; // 日主が剋する
  else if (relation === '土木' || relation === '金火' || relation === '水土' || relation === '木金' || relation === '火水') type = '官'; // 日主を剋する

  const polarSame = d.polar === t.polar;
  
  if (type === '同') return polarSame ? '貫索星' : '石門星';
  if (type === '生') return polarSame ? '鳳閣星' : '調舒星';
  if (type === '剋') return polarSame ? '禄存星' : '司禄星';
  if (type === '官') return polarSame ? '車騎星' : '牽牛星';
  if (type === '印') return polarSame ? '龍高星' : '玉堂星';

  return '';
}

const TWELVE_STAR_MATRIX = {
  // 十二支の順（子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥）に対応する十二従星
  '甲': ['天恍星', '天南星', '天禄星', '天将星', '天堂星', '天胡星', '天極星', '天庫星', '天馳星', '天報星', '天印星', '天貴星'],
  '乙': ['天胡星', '天堂星', '天将星', '天禄星', '天南星', '天恍星', '天貴星', '天印星', '天報星', '天馳星', '天庫星', '天極星'],
  '丙': ['天報星', '天印星', '天貴星', '天恍星', '天南星', '天禄星', '天将星', '天堂星', '天胡星', '天極星', '天庫星', '天馳星'],
  '丁': ['天馳星', '天庫星', '天極星', '天胡星', '天堂星', '天将星', '天禄星', '天南星', '天恍星', '天貴星', '天印星', '天報星'],
  '戊': ['天報星', '天印星', '天貴星', '天恍星', '天南星', '天禄星', '天将星', '天堂星', '天胡星', '天極星', '天庫星', '天馳星'],
  '己': ['天馳星', '天庫星', '天極星', '天胡星', '天堂星', '天将星', '天禄星', '天南星', '天恍星', '天貴星', '天印星', '天報星'],
  '庚': ['天極星', '天庫星', '天馳星', '天報星', '天印星', '天貴星', '天恍星', '天南星', '天禄星', '天将星', '天堂星', '天胡星'],
  '辛': ['天貴星', '天印星', '天報星', '天馳星', '天庫星', '天極星', '天胡星', '天堂星', '天将星', '天禄星', '天南星', '天恍星'],
  '壬': ['天将星', '天堂星', '天胡星', '天極星', '天庫星', '天馳星', '天報星', '天印星', '天貴星', '天恍星', '天南星', '天禄星'],
  '癸': ['天禄星', '天南星', '天恍星', '天貴星', '天印星', '天報星', '天馳星', '天庫星', '天極星', '天胡星', '天堂星', '天将星']
};

function getTwelveStar(dayGan, zhi) {
  if (!dayGan || !zhi) return '';
  const zhiNames = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const zhiIndex = zhiNames.indexOf(zhi);
  if (zhiIndex === -1) return '';
  
  const starsArray = TWELVE_STAR_MATRIX[dayGan];
  if (!starsArray) return '';
  return starsArray[zhiIndex];
}

export function calculateMoushiki(year, month, day, _hour, _minute, gender, isTimeUnknown) {
  let h = isTimeUnknown ? 12 : parseInt(_hour, 10) || 12;
  let m = isTimeUnknown ? 0 : parseInt(_minute, 10) || 0;
  
  const solar = Solar.fromYmdHms(parseInt(year, 10), parseInt(month, 10), parseInt(day, 10), h, m, 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();
  
  // 1=男, 0=女
  const genderInt = gender === 'male' ? 1 : 0;
  // 大運算出用
  const yun = eightChar.getYun(genderInt, 1); // 1 = 順行・逆行 自動判定

  const yearGan = eightChar.getYearGan();
  const yearZhi = eightChar.getYearZhi();
  const monthGan = eightChar.getMonthGan();
  const monthZhi = eightChar.getMonthZhi();
  const dayGan = eightChar.getDayGan();
  const dayZhi = eightChar.getDayZhi();
  const timeGan = isTimeUnknown ? '不明' : eightChar.getTimeGan();
  const timeZhi = isTimeUnknown ? '不明' : eightChar.getTimeZhi();
  
  // 天中殺（日柱から）
  const emptyZhi = lunar.getDayShengXiao(); // 簡易：空亡の取得ロジックが必要、lunar-jsにはdayXunKongなどがある
  const tenShenZhi = eightChar.getDayXunKong() || '不明'; // 戌亥天中殺など

  // 陽占（算命学）の星算出
  const leftShoulder = getTwelveStar(dayGan, yearZhi); // 初年期
  const leftHand = getTenStar(dayGan, yearGan);
  const head = getTenStar(dayGan, monthGan); // 月干
  const chest = getTenStar(dayGan, monthGan); // 本来は月支蔵干などですが簡易化
  const rightHand = getTenStar(dayGan, yearGan); // 本来は日支蔵干等
  const rightFoot = getTwelveStar(dayGan, monthZhi); // 中年期
  const belly = getTenStar(dayGan, dayGan); // 本来の計算が必要
  const leftFoot = getTwelveStar(dayGan, dayZhi); // 晩年期

  // 大運の取得
  const daYunList = yun.getDaYun();
  const daYunArray = daYunList.map(dy => ({
    startAge: dy.getStartAge(),
    endAge: dy.getEndAge(),
    year: dy.getStartYear(),
    ganzhi: dy.getGanZhi()
  })).slice(0, 10); // 10個取得

  // 年運の取得 (流年) 向こう10年
  const currentYear = new Date().getFullYear();
  let liuNianArray = [];
  for(let i=0; i<10; i++){
      const ySolar = Solar.fromYmdHms(currentYear + i, 1, 1, 12, 0, 0);
      const yLunar = ySolar.getLunar();
      liuNianArray.push({
          year: currentYear + i,
          ganzhi: yLunar.getYearInGanZhi()
      });
  }

  // 年間の月別エネルギー推移 (今年の12ヶ月)
  // 十二大従星の一般的なエネルギー点数
  const energyScoreMap = {
    '天報星': 3, '天印星': 6, '天貴星': 9, '天恍星': 7,
    '天南星': 10, '天禄星': 11, '天将星': 12, '天堂星': 8,
    '天胡星': 4, '天極星': 2, '天庫星': 5, '天馳星': 1
  };
  
  let monthlyEnergy = [];
  for(let m=1; m<=12; m++) {
      // 当年の各月15日付近で計算 (節入りをまたいだ安定した干支を取得するため簡易的に15日)
      const mSolar = Solar.fromYmdHms(currentYear, m, 15, 12, 0, 0);
      const mLunar = mSolar.getLunar();
      const mEightChar = mLunar.getEightChar();
      const mZhi = mEightChar.getMonthZhi();
      
      const star = getTwelveStar(dayGan, mZhi);
      const energy = energyScoreMap[star] || 6; // マップにない場合のデフォルト値
      
      monthlyEnergy.push({
          month: m + '月',
          energy: energy,
          ganzhi: mEightChar.getMonthGan() + mEightChar.getMonthZhi()
      });
  }

  const getGogyo = (text) => {
    if (text === '不明' || !text) return { gan: '不明', zhi: '不明' };
    const fg = text.charAt(0);
    const sg = text.charAt(1);
    const fEle = GAN_ELEMENTS[fg];
    const sEle = ZHI_ELEMENTS[sg];
    return {
      gan: fEle ? `${fEle.elem}(${fEle.polar})` : '',
      zhi: sEle ? `${sEle.elem}(sEle.polar === '+' ? '陽' : '陰')` : '' // will fix strings properly
    };
  };

  const getEleStr = (str, isGan) => {
    if (!str || str === '不明') return '-';
    // isGan = true is Heavenly Stem, else Earthly Branch
    const e = isGan ? GAN_ELEMENTS[str] : ZHI_ELEMENTS[str];
    if (!e) return '-';
    const polarStr = e.polar === '+' ? '+' : '-';
    return `${e.elem}(${polarStr})`;
  };

  return {
    inSen: {
      year: yearGan + yearZhi,
      month: monthGan + monthZhi,
      day: dayGan + dayZhi,
      time: isTimeUnknown ? '不明' : (timeGan + timeZhi),
      yearGogyo: { gan: getEleStr(yearGan, true), zhi: getEleStr(yearZhi, false) },
      monthGogyo: { gan: getEleStr(monthGan, true), zhi: getEleStr(monthZhi, false) },
      dayGogyo: { gan: getEleStr(dayGan, true), zhi: getEleStr(dayZhi, false) },
      timeGogyo: { gan: getEleStr(isTimeUnknown ? '' : timeGan, true), zhi: getEleStr(isTimeUnknown ? '' : timeZhi, false) },
      yearZoukan: eightChar.getYearHideGan().join('・'),
      monthZoukan: eightChar.getMonthHideGan().join('・'),
      dayZoukan: eightChar.getDayHideGan().join('・'),
      timeZoukan: isTimeUnknown ? '不明' : eightChar.getTimeHideGan().join('・')
    },
    tenchuusatsu: tenShenZhi,
    youSen: {
      leftShoulder, head, leftHand, chest, rightHand, leftFoot, belly, rightFoot
    },
    daYun: daYunArray,
    niuNian: liuNianArray,
    monthlyEnergy
  };
}
