import { useState } from 'react';

const clients = [
  { name: '고객사 A', industry: '제조', total: 10, active: 3, done: 7, started: true, color: '#3b82f6' },
  { name: '고객사 B', industry: '유통', total: 10, active: 4, done: 6, started: true, color: '#22c55e' },
  { name: '고객사 C', industry: 'IT', total: 10, active: 2, done: 8, started: true, color: '#f97316' },
  { name: '고객사 D', industry: '건설', total: 10, active: 0, done: 0, started: false, color: '#8b5cf6' },
  { name: '고객사 E', industry: '식품', total: 10, active: 0, done: 0, started: false, color: '#06b6d4' },
  { name: '고객사 F', industry: '서비스', total: 10, active: 0, done: 0, started: false, color: '#ec4899' },
];

const campaigns = [
  { id: 'c1', year: '2026', name: 'TEST 2026년 파트너사 ESG 자가진단(건설)', status: '진행중', auditEnabled: false },
  { id: 'c2', year: '2026', name: '2026 공급망 ESG 정기평가', status: '진행중', auditEnabled: true },
  { id: 'c3', year: '2026', name: '2026 핵심 협력사 ESG 평가', status: '종료', auditEnabled: true },
  { id: 'c4', year: '2025', name: '2025 파트너 ESG 종합평가', status: '종료', auditEnabled: true },
  { id: 'c5', year: '2024', name: '2024 협력사 지속가능성 평가', status: '종료', auditEnabled: false },
  { id: 'c6', year: '2023', name: '2023 공급망 ESG 진단', status: '종료', auditEnabled: false },
];

export default function AccessStats({ onOpenProgress, onOpenEvaluation, onOpenAudit }: { onOpenProgress?: (id: string, name: string, dateRange: string) => void; onOpenEvaluation?: (id: string, name: string, dateRange: string) => void; onOpenAudit?: () => void }) {
  const [client, setClient] = useState<string | null>(null);
  if (client) return <ClientOverview clientName={client} onBack={() => setClient(null)} onOpenProgress={onOpenProgress} onOpenEvaluation={onOpenEvaluation} onOpenAudit={onOpenAudit} />;
  return <HomeOverview onSelectClient={setClient} />;
}

function HomeOverview({ onSelectClient }: { onSelectClient: (name: string) => void }) {
  const [campaignYear, setCampaignYear] = useState('2026');
  const [industryYear, setIndustryYear] = useState('2026');
  const [showInactive, setShowInactive] = useState(false);
  const campaignSummary: Record<string, { total: number; ready: number; active: number; done: number }> = {
    '2026': { total: 12, ready: 2, active: 6, done: 4 },
    '2025': { total: 9, ready: 0, active: 0, done: 9 },
    '2024': { total: 7, ready: 0, active: 0, done: 7 },
  };
  const summary = campaignSummary[campaignYear];
  return (
    <div className="mx-auto max-w-[96rem]">
      <div className="mb-6"><div className="text-2xl font-black text-[#1a3055]">HOME</div><p className="mt-1 text-sm text-gray-500">연도별 고객사 캠페인과 업종별 ESG 평가점수를 확인합니다.</p></div>
      <div className="grid gap-3 xl:grid-cols-[20rem_1fr]">
        <section className="rounded border border-gray-300 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div className="text-base font-black">전체 캠페인 현황</div><select value={campaignYear} onChange={event => setCampaignYear(event.target.value)} className="h-9 rounded border-2 border-red-600 bg-white px-2 text-xs font-bold">{['2026', '2025', '2024'].map(year => <option key={year} value={year}>{year}년</option>)}</select></div><div className="mt-8 text-sm text-gray-700">전체 캠페인 수 <strong className="ml-2 text-3xl text-[#1a3055]">{summary.total}</strong>건 <span className="text-xs text-gray-400">(고객사 수 {clients.filter(item => item.started).length}개사)</span></div><div className="mt-7 grid grid-cols-3 gap-2 text-center"><Stat label="준비 중" value={String(summary.ready)} /><Stat label="진행 중" value={String(summary.active)} /><Stat label="종료" value={String(summary.done)} /></div></section>
        <section className="rounded border border-gray-300 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div className="text-base font-black">업종별 현황</div><select value={industryYear} onChange={event => setIndustryYear(event.target.value)} className="h-9 rounded border-2 border-red-600 bg-white px-2 text-xs font-bold">{['2026', '2025', '2024'].map(year => <option key={year} value={year}>{year}년</option>)}</select></div><IndustryScoreChart year={industryYear} /></section>
      </div>
      <ClientCards title="전체 고객사 현황" list={clients.filter(item => item.started)} onSelectClient={onSelectClient} />
      <section className="mt-5 rounded-xl border border-gray-200 bg-white shadow-sm"><button type="button" onClick={() => setShowInactive(value => !value)} className="flex w-full items-center justify-between px-6 py-5 text-left"><span className="text-base font-black">캠페인 미진행 <span className="ml-2 text-xs font-normal text-gray-400">{clients.filter(item => !item.started).length}개사</span></span><span className="text-xs font-bold text-blue-700">{showInactive ? '접기 ▲' : '펼치기 ▼'}</span></button>{showInactive && <div className="border-t border-gray-100 p-6"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{clients.filter(item => !item.started).map(item => <ClientCard key={item.name} item={item} onSelect={() => onSelectClient(item.name)} />)}</div></div>}</section>
    </div>
  );
}

function ClientOverview({ clientName, onBack, onOpenProgress, onOpenEvaluation, onOpenAudit }: { clientName: string; onBack: () => void; onOpenProgress?: (id: string, name: string, dateRange: string) => void; onOpenEvaluation?: (id: string, name: string, dateRange: string) => void; onOpenAudit?: () => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set(campaigns.map(item => item.id)));
  const [filter, setFilter] = useState<'전체' | '진행중' | '종료'>('전체');
  const [campaignPickerYear, setCampaignPickerYear] = useState('2026');
  const [search, setSearch] = useState('');
  const years = ['2023', '2024', '2025', '2026'];
  const totalTrend = years.map((year, index) => 70 + index * 3 + campaigns.filter(item => item.year === year && selected.has(item.id)).length * 1.2);
  const selectedCount = selected.size;
  const visible = campaigns.filter(item => (filter === '전체' || item.status === filter) && item.name.toLowerCase().includes(search.trim().toLowerCase()));
  const pickerCampaigns = campaigns.filter(item => item.year === campaignPickerYear);
  return (
    <div className="mx-auto max-w-[96rem]">
      <button type="button" onClick={onBack} className="mb-4 rounded-lg bg-[#1a3055] px-4 py-2 text-xs font-bold text-white">← HOME</button>
      <div className="mb-5"><div className="text-2xl font-black text-[#1a3055]">{clientName} ESG 평가 현황</div><p className="mt-1 text-sm text-gray-500">연도별 평가 결과와 캠페인별 진행 상황을 확인합니다.</p></div>
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 xl:grid-cols-2"><Trend title="총점 추이" years={years} values={totalTrend} color="#1a3055" /><MultiTrend years={years} adjustment={selectedCount * 0.4} /></div>
        <div className="mt-4 border-t border-gray-100 pt-4"><div className="mb-2 text-xs font-bold text-gray-600">반영 캠페인</div><div className="flex flex-wrap items-start gap-3"><select value={campaignPickerYear} onChange={event => setCampaignPickerYear(event.target.value)} className="h-9 rounded border border-gray-300 px-3 text-xs">{years.map(year => <option key={year}>{year}</option>)}</select><div className="flex flex-wrap gap-2">{pickerCampaigns.map(item => <label key={item.id} className="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs"><input type="checkbox" checked={selected.has(item.id)} onChange={() => setSelected(current => { const next = new Set(current); next.has(item.id) ? next.delete(item.id) : next.add(item.id); return next; })} />{item.name}</label>)}</div></div></div>
      </section>
      <section className="mt-5"><div className="mb-4 flex items-center justify-between"><div className="flex gap-2">{(['전체', '진행중', '종료'] as const).map(item => <button type="button" key={item} onClick={() => setFilter(item)} className={`rounded px-4 py-2 text-xs font-bold ${filter === item ? 'bg-[#1a3055] text-white' : 'border border-gray-300 bg-white text-gray-600'}`}>{item}</button>)}</div><input value={search} onChange={event => setSearch(event.target.value)} className="h-9 rounded border border-gray-300 px-3 text-xs" placeholder="캠페인명 검색" /></div><div className="space-y-3">{visible.map(item => <article key={item.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><div className="flex h-14 w-20 items-center justify-center rounded border border-gray-200 text-xs font-black text-green-600">NAVER</div><div className="min-w-0 flex-1"><div className="font-black">{item.name}</div><div className="mt-1 text-xs text-gray-400">{item.year}-01-01 ~ {item.year}-12-31</div></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${item.status === '종료' ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-700'}`}>{item.status}</span><button type="button" onClick={() => onOpenProgress?.(item.id, item.name, `${item.year}-01-01 ~ ${item.year}-12-31`)} className="rounded bg-[#3d4d5c] px-4 py-2 text-xs font-bold text-white">진행 현황</button><button type="button" onClick={() => onOpenEvaluation?.(item.id, item.name, `${item.year}-01-01 ~ ${item.year}-12-31`)} className="rounded bg-[#e63946] px-4 py-2 text-xs font-bold text-white">자가진단 결과</button><button type="button" disabled={!item.auditEnabled} onClick={onOpenAudit} className={`rounded border px-4 py-2 text-xs font-bold ${item.auditEnabled ? 'border-violet-300 text-violet-700' : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'}`}>현장실사 관리</button></article>)}</div></section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) { return <div className="rounded-lg bg-gray-50 p-3"><div className="text-xs text-gray-500">{label}</div><strong className="mt-1 block text-xl">{value}건</strong></div>; }
function MiniBar({ label, value, color }: { label: string; value: number; color: string }) { return <div className="grid grid-cols-[2.5rem_1fr_1.5rem] items-center gap-2 text-[10px] text-gray-500"><span>{label}</span><span className="h-1.5 rounded-full bg-gray-100"><span className="block h-full rounded-full" style={{ width: `${value * 10}%`, background: color }} /></span><strong>{value}</strong></div>; }
function Trend({ title, years, values, color }: { title: string; years: string[]; values: number[]; color: string }) { const points = values.map((value, index) => `${55 + index * 130},${160 - value}`).join(' '); return <div><div className="text-sm font-black">{title}</div><svg viewBox="0 0 480 190" className="mt-3 w-full"><polyline points={points} fill="none" stroke={color} strokeWidth="3" />{values.map((value, index) => <g key={years[index]}><circle cx={55 + index * 130} cy={160 - value} r="5" fill="white" stroke={color} strokeWidth="3" /><text x={55 + index * 130} y={145 - value} textAnchor="middle" fontSize="10">{value.toFixed(1)}</text><text x={55 + index * 130} y="180" textAnchor="middle" fontSize="10" fill="#777">{years[index]}년</text></g>)}</svg></div>; }
function IndustryScoreChart({ year }: { year: string }) {
  const areas = ['총점', '노동 및 인권', '안전 및 보건', '환경', '윤리', '경영시스템'];
  const sectors = [{ name: '식품', color: '#244b7c' }, { name: '화학', color: '#5b87c5' }, { name: '자동차', color: '#b8c8df' }, { name: '건설', color: '#efd9d9' }, { name: '금융', color: '#c94c54' }];
  const offset = year === '2026' ? 2 : year === '2025' ? 0 : -3;
  return <div><div className="mt-2 flex justify-center gap-4 text-[10px]">{sectors.map(item => <span key={item.name} className="flex items-center gap-1"><span className="h-2 w-2" style={{ background: item.color }} />{item.name}</span>)}</div><svg viewBox="0 0 720 190" className="mt-1 w-full">{[50, 60, 70, 80, 90, 100].map(score => { const y = 150 - (score - 50) * 2.4; return <g key={score}><line x1="42" x2="700" y1={y} y2={y} stroke="#edf0f3" /><text x="35" y={y + 3} textAnchor="end" fontSize="9" fill="#8b929c">{score}</text></g>; })}{areas.map((area, areaIndex) => { const groupX = 68 + areaIndex * 105; return <g key={area}>{sectors.map((sector, sectorIndex) => { const score = 72 + offset + areaIndex * 2 + sectorIndex; const height = (score - 50) * 2.4; return <rect key={sector.name} x={groupX + sectorIndex * 10} y={150 - height} width="8" height={height} rx="1" fill={sector.color}><title>{sector.name} {score}점</title></rect>; })}<text x={groupX + 20} y="170" textAnchor="middle" fontSize="9" fill="#59616b">{area}</text></g>; })}</svg></div>;
}
function MultiTrend({ years, adjustment }: { years: string[]; adjustment: number }) {
  const lines = [{ name: '노동 및 인권', color: '#234d7d', values: [74, 81, 85, 80] }, { name: '안전 및 보건', color: '#5d88c5', values: [68, 73, 79, 83] }, { name: '환경', color: '#b9c9df', values: [78, 71, 69, 77] }, { name: '윤리', color: '#e9c9c5', values: [86, 82, 88, 85] }, { name: '경영시스템', color: '#c64c4e', values: [62, 68, 75, 79] }];
  const scoreAt = (value: number) => Math.min(100, value + adjustment);
  const yAt = (value: number) => 170 - (scoreAt(value) - 50) * 2.6;
  return <div><div className="text-sm font-black">영역별 추이 그래프</div><div className="mt-2 flex flex-wrap gap-3 text-[9px]">{lines.map(line => <span key={line.name} className="flex items-center gap-1"><span className="h-0.5 w-4" style={{ background: line.color }} />{line.name}</span>)}</div><svg viewBox="0 0 480 210" className="w-full">{[50, 60, 70, 80, 90, 100].map(score => { const y = 170 - (score - 50) * 2.6; return <g key={score}><line x1="45" x2="460" y1={y} y2={y} stroke="#edf0f3" /><text x="38" y={y + 3} textAnchor="end" fontSize="9" fill="#8b929c">{score}</text></g>; })}{lines.map(line => <g key={line.name}><polyline points={line.values.map((value, index) => `${55 + index * 130},${yAt(value)}`).join(' ')} fill="none" stroke={line.color} strokeWidth="2.5" />{line.values.map((value, index) => <g key={index}><circle cx={55 + index * 130} cy={yAt(value)} r="3.5" fill="white" stroke={line.color} strokeWidth="2" /><text x={55 + index * 130} y={yAt(value) - 6} textAnchor="middle" fontSize="7" fill={line.color}>{scoreAt(value).toFixed(1)}</text></g>)}</g>)}{years.map((year, index) => <text key={year} x={55 + index * 130} y="195" textAnchor="middle" fontSize="10" fill="#777">{year}년</text>)}</svg></div>;
}
function ClientCards({ title, list, onSelectClient }: { title: string; list: typeof clients; onSelectClient: (name: string) => void }) { return <section className="mt-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"><div className="mb-4 flex items-center justify-between"><div className="text-base font-black">{title}</div><span className="text-xs text-gray-400">{list.length}개사</span></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{list.map(item => <ClientCard key={item.name} item={item} onSelect={() => onSelectClient(item.name)} />)}</div></section>; }
function ClientCard({ item, onSelect }: { item: (typeof clients)[number]; onSelect: () => void }) { return <button type="button" onClick={onSelect} className="rounded-xl border border-gray-200 p-4 text-left hover:border-blue-300 hover:shadow-md"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-black text-white" style={{ background: item.color }}>{item.name.at(-1)}</span><div><div className="font-black">{item.name}</div><div className="text-[11px] text-gray-400">{item.industry}</div></div></div><div className="mt-4 text-2xl font-black">{item.total}개사</div><div className="mt-3 space-y-2"><MiniBar label="진행" value={item.active} color="#3b82f6" /><MiniBar label="종료" value={item.done} color="#22c55e" /></div></button>; }
