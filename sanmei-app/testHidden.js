import { Solar } from 'lunar-javascript';
// 2024-10-15 is 戌 month
const s = Solar.fromYmdHms(2024, 10, 15, 12, 0, 0);
const b = s.getLunar().getEightChar();
console.log(b.getMonthZhi(), b.getMonthHideGan());
