import { useState } from 'react';

const campaignData = {
  '2026 협력사 ESG 평가': {
    years: ['2024', '2025', '2026'],
    rows: {
      매출액: ['318', '352', '401'], 영업이익: ['24', '31', '38'], '총 임직원수': ['112', '119', '126'],
      에너지소비량: ['1,420', '1,385', '1,312'], 온실가스배출량: ['820', '794', '741'], 용수사용량: ['4,210', '4,085', '3,920'],
      지정폐기물: ['18', '16', '14'], 일반폐기물: ['95', '91', '86'], 사망자수: ['0', '0', '0'], 산업재해율: ['0.31', '0.24', '0.18'], 과태료: ['0', '0', '0'], 벌금: ['0', '0', '0'],
    },
  },
  '2025 ESG 공급망 지원사업': {
    years: ['2023', '2024', '2025'],
    rows: {
      매출액: ['280', '318', '352'], 영업이익: ['19', '24', '31'], '총 임직원수': ['106', '112', '119'],
      에너지소비량: ['1,480', '1,420', '1,385'], 온실가스배출량: ['856', '820', '794'], 용수사용량: ['4,330', '4,210', '4,085'],
      지정폐기물: ['21', '18', '16'], 일반폐기물: ['101', '95', '91'], 사망자수: ['0', '0', '0'], 산업재해율: ['0.36', '0.31', '0.24'], 과태료: ['0', '0', '0'], 벌금: ['0', '0', '0'],
    },
  },
} as const;

const sections = [
  { title: '경제', rows: [['매출액', '억원'], ['영업이익', '억원']] },
  { title: '임직원 현황', rows: [['총 임직원수', '명']] },
  { title: '환경', rows: [['에너지소비량', 'MWh'], ['온실가스배출량', 'tCO₂e'], ['용수사용량', 'ton'], ['지정폐기물', 'ton'], ['일반폐기물', 'ton']] },
  { title: '안전 및 보건', rows: [['사망자수', '명'], ['산업재해율', '%']] },
  { title: '규범준수', rows: [['과태료', '건'], ['벌금', '건']] },
];

export default function DataPage() {
  const [campaign, setCampaign] = useState<keyof typeof campaignData>('2026 협력사 ESG 평가');
  const data = campaignData[campaign];

  return (
    <div className="service-page flex flex-col gap-6">
      <div className="flex items-center justify-between rounded border border-gray-200 bg-white px-5 py-4">
        <div><div className="text-base font-bold text-gray-900">정량 데이터</div><div className="mt-1 text-xs text-gray-500">가장 최근 종료된 자가진단의 데이터가 기본으로 표시됩니다.</div></div>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">자가진단 캠페인
          <select value={campaign} onChange={event => setCampaign(event.target.value as keyof typeof campaignData)} className="h-9 rounded border border-gray-300 bg-white px-3 text-xs">
            {Object.keys(campaignData).map(name => <option key={name}>{name}</option>)}
          </select>
        </label>
      </div>
      {sections.map(section => (
        <section key={section.title} className="flex items-start gap-6">
          <div className="w-24 shrink-0 pt-2 text-base font-bold">{section.title}</div>
          <div className="flex-1 overflow-hidden rounded border border-gray-200 bg-white">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50"><tr><th className="border-b border-r border-gray-200 px-4 py-2 text-xs">정량 데이터 항목</th><th className="border-b border-r border-gray-200 px-4 py-2 text-xs">단위</th>{data.years.map(year => <th key={year} className="border-b border-r border-gray-200 px-4 py-2 text-xs"><span className="block text-[10px] font-normal text-gray-400">기준연도</span>{year}</th>)}</tr></thead>
              <tbody>{section.rows.map(([label, unit]) => <tr key={label} className="border-b border-gray-100 last:border-0"><td className="border-r border-gray-100 px-4 py-3 text-xs font-medium">{label}</td><td className="border-r border-gray-100 px-4 py-3 text-center text-xs text-gray-500">{unit}</td>{data.rows[label as keyof typeof data.rows].map((value, index) => <td key={`${label}-${data.years[index]}`} className="border-r border-gray-100 px-4 py-3 text-center text-xs">{value}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
