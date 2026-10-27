import { useState } from 'react';
import CustomerHistory from './CustomerHistory';

type RiskLevel = '우수' | '보통' | '위험';
type DashboardYear = 2023 | 2024 | 2025 | 2026;
type CampaignOption = { id: string; name: string };

const dashboardYears: DashboardYear[] = [2026, 2025, 2024, 2023];
const campaignsByYear: Record<DashboardYear, CampaignOption[]> = {
  2023: [
    { id: '2023-self', name: '협력사 ESG 자가진단' },
    { id: '2023-carbon', name: '탄소중립 공급망 평가' },
  ],
  2024: [
    { id: '2024-basic', name: '공급망 ESG 기초진단' },
    { id: '2024-core', name: '2024 핵심 협력사 정기평가' },
    { id: '2024-global', name: '해외 파트너 지속가능성 평가' },
  ],
  2025: [
    { id: '2025-korta', name: '2025 KORTA 해외 공급망 ESG 대응 자가평가' },
    { id: '2025-core', name: '2025 핵심 협력사 ESG 정기평가' },
    { id: '2025-global', name: '2025 글로벌 파트너 ESG 진단' },
    { id: '2025-coexist', name: '2025 상생협력 ESG 평가' },
  ],
  2026: [
    { id: '2026-korta', name: 'KORTA ESG 공급망 평가 [제조]' },
    { id: '2026-core', name: '2026 핵심 협력사 정기평가' },
    { id: '2026-global', name: '글로벌 파트너 ESG 진단' },
  ],
};

const riskColors: Record<RiskLevel, string> = {
  우수: 'var(--color-risk-good)',
  보통: 'var(--color-risk-normal)',
  위험: 'var(--color-risk-danger)',
};

const salesRisks = [
  { label: '500억 이상', total: 12, values: [7, 4, 1] },
  { label: '400–500억', total: 16, values: [9, 5, 2] },
  { label: '300–400억', total: 22, values: [11, 8, 3] },
  { label: '200–300억', total: 28, values: [13, 10, 5] },
  { label: '100–200억', total: 34, values: [15, 13, 6] },
  { label: '100억 미만', total: 32, values: [6, 15, 11] },
] as const;

const campaigns = [
  {
    name: 'KORTA ESG 공급망 평가 [제조]',
    score: 82,
    areas: [
      { label: 'E-1. 환경경영 일반', score: 32 },
      { label: 'E-2. 에너지 및 온실가스', score: 35 },
      { label: 'S-1. 인권 및 노동', score: 28 },
    ],
  },
  {
    name: '2026 핵심 협력사 정기평가',
    score: 74,
    areas: [
      { label: 'E-4. 폐기물 및 오염물질', score: 37 },
      { label: 'S-3. 산업안전 관리', score: 31 },
      { label: 'M-1. 윤리경영', score: 34 },
    ],
  },
  {
    name: '글로벌 파트너 ESG 진단',
    score: 88,
    areas: [
      { label: 'E-3. 자원순환 및 재활용', score: 39 },
      { label: 'S-2. 다양성 및 포용', score: 38 },
      { label: 'M-3. 지속가능경영 체계', score: 36 },
    ],
  },
];

const progressByYear: Record<DashboardYear, { rate: number; participated: number; notParticipated: number }> = {
  2023: { rate: 69, participated: 138, notParticipated: 62 },
  2024: { rate: 78, participated: 156, notParticipated: 44 },
  2025: { rate: 86, participated: 172, notParticipated: 28 },
  2026: { rate: 72, participated: 144, notParticipated: 56 },
};

const areaScoresByYear: Record<DashboardYear, number[]> = {
  2023: [69, 77, 72, 68, 66, 71],
  2024: [73, 81, 76, 70, 69, 76],
  2025: [76, 85, 79, 73, 71, 78],
  2026: [80, 88, 82, 76, 73, 81],
};

const riskRangesByYear: Record<DashboardYear, number[]> = {
  2023: [17, 10, 24, 21, 14, 25, 15, 10, 8],
  2024: [14, 8, 25, 18, 13, 27, 16, 13, 10],
  2025: [12, 8, 24, 17, 12, 26, 18, 15, 12],
  2026: [9, 4, 15, 16, 11, 28, 19, 17, 25],
};

const companyNames = [
  '세진모터스', '유진소재', '태성금속', '대상산업', '한빛테크', '미래부품', '대한정밀', '우림산업',
  '동아소재', '삼진테크', '대광금속', '제일산업', '성우전자', '신성에너지', '한솔기공', '경인테크',
  '대성화학', '유성정밀', '태광산업', '세명소재', '진영테크', '한일부품', '동우금속', '미래산업',
  '대원전자', '우진정공', '성진화학', '삼영테크', '신한소재', '태양기공', '에이스산업', '금강정밀',
  '대진테크', '동양부품', '한국소재', '세광산업', '유니온테크', '청우금속', '다온전자', '하나정공',
];
const factorPairs = [
  ['S-1 인권', 'E-2 환경'], ['E-1 환경', 'M-3 경영'], ['L-2 노동', 'S-3 안전'], ['E-4 환경', 'M-1 윤리'],
  ['L-1 노동', 'E-3 환경'], ['S-2 안전', 'M-2 경영'], ['L-3 노동', 'E-1 환경'], ['S-4 인권', 'E-4 환경'],
];
const highRiskCompanies = companyNames.map((name, index) => ({
  name,
  size: ['중견', '중소', '소기업'][index % 3],
  sales: `${74 + ((index * 47) % 481)}억`,
  employees: 42 + ((index * 29) % 297),
  score: 18 + ((index * 7) % 23),
  factors: factorPairs[index % factorPairs.length],
}));

function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}>{children}</section>;
}

function SectionTitle({
  title,
  description,
  right,
}: {
  title: string;
  description?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="text-base font-bold text-gray-900">{title}</div>
        {description && <div className="mt-1 text-xs text-gray-400">{description}</div>}
      </div>
      {right}
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
      {(Object.keys(riskColors) as RiskLevel[]).map((level) => (
        <span key={level} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: riskColors[level] }} />
          {level}
        </span>
      ))}
    </div>
  );
}

function YearSelect({
  value,
  onChange,
  label,
}: {
  value: DashboardYear;
  onChange: (year: DashboardYear) => void;
  label: string;
}) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value) as DashboardYear)}
        className="service-control min-w-24 appearance-none pr-8 font-semibold"
      >
        {dashboardYears.map((year) => <option key={year} value={year}>{year}년</option>)}
      </select>
      <span className="pointer-events-none absolute right-3 top-2.5 text-gray-400">⌄</span>
    </label>
  );
}

function CampaignSelect({
  year,
  value,
  onChange,
  label,
}: {
  year: DashboardYear;
  value: string;
  onChange: (campaignId: string) => void;
  label: string;
}) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="service-control max-w-56 min-w-44 appearance-none truncate pr-8 font-semibold"
      >
        <option value="all">전체 캠페인</option>
        {campaignsByYear[year].map((campaign) => (
          <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-2.5 text-gray-400">⌄</span>
    </label>
  );
}

function getCampaignIndex(year: DashboardYear, campaignId: string) {
  return campaignsByYear[year].findIndex((campaign) => campaign.id === campaignId);
}

function ProgressRing({ rate, label }: { rate: number; label: string }) {
  return (
    <div
      className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full"
      style={{ background: `conic-gradient(var(--color-primary) 0 ${rate}%, var(--color-border-light) ${rate}% 100%)` }}
    >
      <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
        <strong className="text-3xl font-bold tracking-tight text-gray-900">{rate}%</strong>
        <span className="mt-0.5 text-xs text-gray-400">{label}</span>
      </div>
    </div>
  );
}

function ScoreBars({ values }: { values: number[] }) {
  const scores = ['총점', '노동', '인권·안전', '환경', '윤리', '경영'].map((label, index) => ({
    label,
    score: values[index],
    code: ['T', 'L', 'S', 'E', 'E', 'M'][index],
  }));
  return (
    <div className="mt-5 flex h-48">
      <div className="flex w-8 shrink-0 flex-col justify-between pb-10 text-right text-[10px] text-gray-400">
        <span>100점</span><span>0</span>
      </div>
      <div className="relative ml-2 grid flex-1 grid-cols-6 items-end gap-2 border-b border-gray-200 px-2">
        <div className="pointer-events-none absolute inset-x-0 top-0 border-t border-dashed border-gray-200" />
        {scores.map((item) => (
          <div key={item.label} className="z-10 flex h-full flex-col justify-end text-center">
            <span className="mb-1 text-xs font-bold text-gray-700">{item.score}</span>
            <div
              className={`mx-auto w-full max-w-10 rounded-t-md ${item.code === 'T' ? 'bg-gray-700' : 'bg-gradient-to-t from-red-400 to-service-primary'}`}
              style={{ height: `${item.score * 1.05}px` }}
            />
            <div className="mt-1.5 text-xs font-semibold text-gray-700">{item.code}</div>
            <div className="mb-1.5 text-[10px] text-gray-400">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SegmentRiskChart({
  rows,
}: {
  rows: ReadonlyArray<{ label: string; total: number; values: readonly number[] }>;
}) {
  const max = Math.max(...rows.map((row) => row.total));
  return (
    <div className="mt-7 space-y-5">
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[6rem_1fr_2.5rem] items-center gap-4">
          <span className="text-right text-xs font-medium text-gray-600">{row.label}</span>
          <div className="flex h-8 overflow-hidden rounded-md bg-gray-100">
            {row.values.map((value, index) => {
              const levels: RiskLevel[] = ['우수', '보통', '위험'];
              return (
                <div
                  key={levels[index]}
                  title={`${levels[index]} ${value}개사`}
                  className="flex items-center justify-center text-[11px] font-semibold text-white transition-opacity hover:opacity-80"
                  style={{
                    width: `${(value / max) * 100}%`,
                    backgroundColor: riskColors[levels[index]],
                  }}
                >
                  {value}
                </div>
              );
            })}
          </div>
          <strong className="text-xs text-gray-700">{row.total}개사</strong>
        </div>
      ))}
    </div>
  );
}

function getCampaignsForYear(year: DashboardYear) {
  const gap = (2026 - year) * 3;
  return campaignsByYear[year].map((campaignOption, index) => {
    const template = campaigns[index % campaigns.length];
    return {
      ...template,
      name: campaignOption.name,
      score: Math.max(0, template.score - gap - Math.floor(index / campaigns.length) * 2),
      areas: template.areas.map((area) => ({ ...area, score: Math.max(20, area.score - (2026 - year) * 2) })),
    };
  });
}

function CampaignScoreChart({ year }: { year: DashboardYear }) {
  const yearCampaigns = getCampaignsForYear(year);
  return (
    <div className="mt-6 space-y-5">
      {yearCampaigns.map((campaign) => (
        <div key={campaign.name} className="grid grid-cols-[minmax(9rem,12rem)_1fr_3rem] items-center gap-4">
          <span className="text-right text-xs font-semibold leading-relaxed text-gray-600">{campaign.name}</span>
          <div className="h-8 overflow-hidden rounded-md bg-gray-100">
            <div className="flex h-full items-center justify-end rounded-md bg-gradient-to-r from-red-300 to-service-primary pr-3 text-xs font-bold text-white" style={{ width: `${campaign.score}%` }}>
              {campaign.score}
            </div>
          </div>
          <span className="text-xs font-semibold text-gray-500">100점</span>
        </div>
      ))}
    </div>
  );
}

function RiskRangeChart({ values }: { values: number[] }) {
  const labels = ['20점 미만', '20–30점', '30–40점', '40–50점', '50–60점', '60–70점', '70–80점', '80–90점', '90점 이상'];
  const ranges = labels.map((label, index) => ({
    label,
    value: values[index],
    level: (index < 3 ? '위험' : index < 6 ? '보통' : '우수') as RiskLevel,
  }));
  const summaries = (['위험', '보통', '우수'] as RiskLevel[]).map((level, groupIndex) => {
    const value = ranges.slice(groupIndex * 3, groupIndex * 3 + 3).reduce((total, range) => total + range.value, 0);
    const total = ranges.reduce((sum, range) => sum + range.value, 0);
    return { label: level, value: `${value}개사 · ${((value / total) * 100).toFixed(1)}%`, level };
  });
  return (
    <div className="mt-6">
      <div className="grid grid-cols-9 items-end gap-1 border-b border-gray-200 px-1">
        {ranges.map((range) => (
          <div key={range.label} className="flex h-48 flex-col justify-end text-center">
            <span className="mb-1 text-xs font-bold text-gray-700">{range.value}</span>
            <div className="mx-auto w-4/5 max-w-9 rounded-t-sm" style={{ height: `${range.value * 4.6}px`, backgroundColor: riskColors[range.level] }} />
            <span className="mt-2 min-h-8 text-[10px] leading-tight text-gray-500">{range.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {summaries.map((item) => (
          <div key={item.label} className="rounded-lg bg-gray-50 px-2 py-2">
            <span className="text-xs font-bold" style={{ color: riskColors[item.level] }}>{item.label}</span>
            <span className="ml-1 text-[10px] text-gray-500">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CampaignAreaChart({ year }: { year: DashboardYear }) {
  const yearCampaigns = getCampaignsForYear(year);
  return (
    <div className="mt-6 space-y-6">
      {yearCampaigns.map((campaign) => (
        <div key={campaign.name} className="grid gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0 lg:grid-cols-[11rem_1fr]">
          <div className="flex items-center rounded-lg bg-gray-50 px-4 py-3 text-sm font-bold leading-relaxed text-gray-800">{campaign.name}</div>
          <div className="space-y-3">
            {campaign.areas.filter((area) => area.score <= 40).map((area) => (
              <div key={area.label} className="grid grid-cols-[minmax(11rem,16rem)_1fr_2.5rem] items-center gap-3">
                <span className="text-right text-xs font-medium text-gray-600">{area.label}</span>
                <div className="relative h-6 rounded-l bg-red-50">
                  <div className="h-full rounded-l bg-red-500" style={{ width: `${(area.score / 40) * 100}%` }} />
                </div>
                <strong className="text-xs text-red-600">{area.score}점</strong>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function LineChart({
  series,
  colors,
  labels,
  max = 100,
}: {
  series: number[][];
  colors: string[];
  labels: string[];
  max?: number;
}) {
  const xs = [72, 286, 500, 714];
  const y = (value: number) => 250 - (value / max) * 190;
  return (
    <svg viewBox="0 0 780 300" className="mt-4 h-auto w-full" role="img" aria-label="연도별 변화 그래프">
      {[0, 25, 50, 75, 100].map((tick) => (
        <g key={tick}>
          <line x1="64" y1={250 - (tick / 100) * 190} x2="730" y2={250 - (tick / 100) * 190} stroke="var(--color-border-light)" />
          <text x="50" y={254 - (tick / 100) * 190} textAnchor="end" fontSize="10" fill="var(--color-text-muted)">
            {Math.round((tick / 100) * max)}
          </text>
        </g>
      ))}
      {series.map((values, seriesIndex) => {
        const points = values.map((value, index) => `${xs[index]},${y(value)}`).join(' ');
        return (
          <g key={colors[seriesIndex]}>
            <polyline points={points} fill="none" stroke={colors[seriesIndex]} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {values.map((value, index) => (
              <g key={`${value}-${index}`}>
                <circle cx={xs[index]} cy={y(value)} r="5" fill="white" stroke={colors[seriesIndex]} strokeWidth="3" />
                <text x={xs[index]} y={y(value) - 12} textAnchor="middle" fontSize="10" fontWeight="600" fill={colors[seriesIndex]}>
                  {value}
                </text>
              </g>
            ))}
          </g>
        );
      })}
      {labels.map((label, index) => (
        <text key={label} x={xs[index]} y="278" textAnchor="middle" fontSize="11" fill="var(--color-text-muted)">
          {label}
        </text>
      ))}
    </svg>
  );
}

function getProgressForCampaign(year: DashboardYear, campaignId: string) {
  const base = progressByYear[year];
  const campaignIndex = getCampaignIndex(year, campaignId);
  if (campaignIndex < 0) return { ...base, total: base.participated + base.notParticipated };

  const campaignCount = campaignsByYear[year].length;
  const total = Math.max(32, Math.round((base.participated + base.notParticipated) / campaignCount) + campaignIndex * 3);
  const rateAdjustments = [5, -4, 2, -7];
  const rate = Math.max(45, Math.min(96, base.rate + rateAdjustments[campaignIndex]));
  const participated = Math.round(total * rate / 100);
  return { rate, participated, notParticipated: total - participated, total };
}

function getAreaScores(year: DashboardYear, campaignId: string) {
  const campaignIndex = getCampaignIndex(year, campaignId);
  if (campaignIndex < 0) return areaScoresByYear[year];
  const adjustments = [3, -4, 1, -6];
  return areaScoresByYear[year].map((score, index) => Math.max(0, Math.min(100, score + adjustments[campaignIndex] + (index % 2))));
}

function getRiskRanges(year: DashboardYear, campaignId: string) {
  const campaignIndex = getCampaignIndex(year, campaignId);
  if (campaignIndex < 0) return riskRangesByYear[year];
  const scale = 0.2 + campaignIndex * 0.035;
  return riskRangesByYear[year].map((value, index) => Math.max(1, Math.round(value * scale) + (index === campaignIndex ? 1 : 0)));
}

function getSalesRisks(year: DashboardYear, campaignId: string) {
  const gap = 2026 - year;
  const campaignIndex = getCampaignIndex(year, campaignId);
  const yearRows = salesRisks.map((row) => ({
    ...row,
    values: [Math.max(0, row.values[0] - gap), row.values[1], row.values[2] + gap],
  }));
  if (campaignIndex < 0) return yearRows;

  const scale = 0.2 + campaignIndex * 0.035;
  return yearRows.map((row) => {
    const values = row.values.map((value) => Math.max(value > 0 ? 1 : 0, Math.round(value * scale)));
    return { ...row, values, total: values.reduce((total, value) => total + value, 0) };
  });
}

function YearView() {
  const [progressYear, setProgressYear] = useState<DashboardYear>(2026);
  const [progressCampaign, setProgressCampaign] = useState('all');
  const [campaignYear, setCampaignYear] = useState<DashboardYear>(2026);
  const [scoreYear, setScoreYear] = useState<DashboardYear>(2026);
  const [scoreCampaign, setScoreCampaign] = useState('all');
  const [riskYear, setRiskYear] = useState<DashboardYear>(2026);
  const [riskCampaign, setRiskCampaign] = useState('all');
  const [areaYear, setAreaYear] = useState<DashboardYear>(2026);
  const [salesYear, setSalesYear] = useState<DashboardYear>(2026);
  const [salesCampaign, setSalesCampaign] = useState('all');
  const progress = getProgressForCampaign(progressYear, progressCampaign);
  const currentYear = progressYear === 2026;
  const progressCampaignIndex = getCampaignIndex(progressYear, progressCampaign);
  const currentCompleted = progress.participated;
  const currentRemaining = progress.notParticipated;
  const currentInProgress = progressCampaignIndex < 0 ? 38 : Math.round(currentRemaining * 0.65);
  const currentNotStarted = progressCampaignIndex < 0 ? 18 : currentRemaining - currentInProgress;
  const progressSegments = currentYear
    ? [
        { label: '완료', value: currentCompleted, width: progress.rate, color: 'bg-service-primary' },
        { label: '진행 중', value: currentInProgress, width: (currentInProgress / progress.total) * 100, color: 'bg-amber-400' },
        { label: '미진행', value: currentNotStarted, width: (currentNotStarted / progress.total) * 100, color: 'bg-gray-400' },
      ]
    : [
        { label: '참여', value: progress.participated, width: progress.rate, color: 'bg-service-primary' },
        { label: '미참여', value: progress.notParticipated, width: 100 - progress.rate, color: 'bg-gray-400' },
      ];
  const selectedRiskRanges = getRiskRanges(riskYear, riskCampaign);
  const selectedRiskTotal = selectedRiskRanges.reduce((total, value) => total + value, 0);
  const selectedSalesRows = getSalesRisks(salesYear, salesCampaign);
  const selectedSalesTotal = selectedSalesRows.reduce((total, row) => total + row.total, 0);
  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.5fr]">
        <Card className="p-6">
          <SectionTitle
            title={`${progressYear} ESG 평가 ${currentYear ? '진행률' : '참여율'}`}
            description={currentYear ? '평가 기간 2026.03.01 – 2026.06.30' : `평가 대상 ${progress.total}개사`}
            right={
              <div className="flex flex-wrap items-center gap-2">
                <CampaignSelect year={progressYear} value={progressCampaign} onChange={setProgressCampaign} label="평가 진행률 캠페인 선택" />
                <YearSelect
                  value={progressYear}
                  onChange={(year) => {
                    setProgressYear(year);
                    setProgressCampaign('all');
                  }}
                  label="평가 진행률 연도 선택"
                />
              </div>
            }
          />
          <div className="mt-6 flex flex-col items-center">
            <ProgressRing rate={progress.rate} label={currentYear ? '완료율' : '참여율'} />
            <div className="mt-6 w-full max-w-md">
              <div className="flex h-8 overflow-hidden rounded-md bg-gray-100 text-[10px] font-bold text-white">
                {progressSegments.map((segment) => (
                  <div key={segment.label} className={`flex items-center justify-center ${segment.color}`} style={{ width: `${segment.width}%` }}>{segment.value}</div>
                ))}
              </div>
              <div className={`mt-3 grid gap-2 ${currentYear ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {progressSegments.map((item) => (
                  <div key={item.label} className="min-w-0">
                    <span className="flex items-center gap-1 text-[10px] text-gray-400"><i className={`h-2 w-2 shrink-0 rounded-full ${item.color}`} />{item.label}</span>
                    <strong className="mt-1 block truncate text-xs text-gray-800">{item.value}개사</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle
            title="캠페인별 ESG 평균 점수"
            description={`${campaignYear}년 캠페인 ${campaignsByYear[campaignYear].length}개 · 100점 만점`}
            right={<YearSelect value={campaignYear} onChange={setCampaignYear} label="캠페인 평균 점수 연도 선택" />}
          />
          <CampaignScoreChart year={campaignYear} />
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="p-6">
          <SectionTitle
            title="영역별 평균 점수"
            description="완료된 평가 기준 · 100점 만점"
            right={
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">전년 대비 +3.8</span>
                <CampaignSelect year={scoreYear} value={scoreCampaign} onChange={setScoreCampaign} label="영역별 평균 점수 캠페인 선택" />
                <YearSelect
                  value={scoreYear}
                  onChange={(year) => {
                    setScoreYear(year);
                    setScoreCampaign('all');
                  }}
                  label="영역별 평균 점수 연도 선택"
                />
              </div>
            }
          />
          <ScoreBars values={getAreaScores(scoreYear, scoreCampaign)} />
        </Card>
        <Card className="p-6">
          <SectionTitle
            title="완료 협력사 리스크 분포"
            description={`협력사 총점 구간별 분포 · 완료 ${selectedRiskTotal}개사`}
            right={
              <div className="flex flex-wrap items-center gap-2">
                <CampaignSelect year={riskYear} value={riskCampaign} onChange={setRiskCampaign} label="리스크 분포 캠페인 선택" />
                <YearSelect
                  value={riskYear}
                  onChange={(year) => {
                    setRiskYear(year);
                    setRiskCampaign('all');
                  }}
                  label="리스크 분포 연도 선택"
                />
              </div>
            }
          />
          <RiskRangeChart values={selectedRiskRanges} />
        </Card>
      </div>

      <Card className="p-6">
        <SectionTitle
          title="캠페인별 취약 세부영역"
          description="캠페인별 취약 세부영역"
          right={<YearSelect value={areaYear} onChange={setAreaYear} label="취약 세부영역 연도 선택" />}
        />
        <CampaignAreaChart year={areaYear} />
      </Card>

      <Card className="p-6">
        <SectionTitle
          title="매출액별 리스크 분포"
          description={`평가 완료 ${selectedSalesTotal}개사의 ${salesYear}년 매출액 구간별 리스크 분포`}
          right={
            <div className="flex flex-wrap items-center gap-4">
              <Legend />
              <CampaignSelect year={salesYear} value={salesCampaign} onChange={setSalesCampaign} label="매출액별 리스크 분포 캠페인 선택" />
              <YearSelect
                value={salesYear}
                onChange={(year) => {
                  setSalesYear(year);
                  setSalesCampaign('all');
                }}
                label="매출액별 리스크 분포 연도 선택"
              />
            </div>
          }
        />
        <SegmentRiskChart rows={selectedSalesRows} />
      </Card>
    </div>
  );
}

function RiskView() {
  const [openedCompany, setOpenedCompany] = useState<string | null>(null);
  const [riskMenuOpen, setRiskMenuOpen] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState<Set<RiskLevel>>(() => new Set(['위험']));
  const riskTrendData: Record<RiskLevel, number[]> = {
    위험: [51, 47, 44, 40],
    보통: [82, 79, 76, 72],
    우수: [41, 52, 67, 84],
  };
  const levels: RiskLevel[] = ['위험', '보통', '우수'];
  const visibleLevels = levels.filter((level) => selectedLevels.has(level));
  const toggleLevel = (level: RiskLevel) => {
    setSelectedLevels((current) => {
      if (current.has(level) && current.size === 1) return current;
      const next = new Set(current);
      next.has(level) ? next.delete(level) : next.add(level);
      return next;
    });
  };
  return (
    <div className="space-y-5">
      <Card className="p-6">
        <SectionTitle
          title="등급별 협력사 수 추이"
          description="연도별 등급별 협력사 수"
          right={
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-xl bg-green-50 px-5 py-3 text-lg font-bold text-green-700">3년 전 대비 11개사 감소</span>
              <div className="relative">
                <button
                  type="button"
                  aria-expanded={riskMenuOpen}
                  onClick={() => setRiskMenuOpen((open) => !open)}
                  className="service-control inline-flex min-w-40 items-center justify-between gap-3 bg-white font-semibold"
                >
                  {visibleLevels.length === levels.length ? '전체 위험 등급' : visibleLevels.join(', ')}
                  <span className="text-gray-400">⌄</span>
                </button>
                {riskMenuOpen && (
                  <div className="absolute right-0 top-11 z-20 w-44 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                    {levels.map((level) => (
                      <label key={level} className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <input type="checkbox" checked={selectedLevels.has(level)} onChange={() => toggleLevel(level)} className="accent-service-primary" />
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: riskColors[level] }} />
                        {level}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          }
        />
        <LineChart
          series={visibleLevels.map((level) => riskTrendData[level])}
          colors={visibleLevels.map((level) => riskColors[level])}
          labels={['2023', '2024', '2025', '2026']}
          max={100}
        />
      </Card>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-6">
          <SectionTitle title="고위험 협력사" description="위험 등급 또는 2개 이상 중대 위험 요소가 확인된 협력사" />
          <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600">총 40개사</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[58rem] border-collapse text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500">
              <tr>
                <th className="px-6 py-3.5">협력사명</th><th className="px-5 py-3.5">규모</th><th className="px-5 py-3.5">매출액</th><th className="px-5 py-3.5">직원 수</th><th className="px-5 py-3.5">점수</th><th className="px-5 py-3.5">위험 요소</th><th className="px-6 py-3.5 text-right">개선 관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {highRiskCompanies.map((company) => (
                <tr key={company.name} className="transition-colors hover:bg-gray-50/70">
                  <td className="px-6 py-4 font-semibold text-gray-900">{company.name}</td>
                  <td className="px-5 py-4 text-gray-600">{company.size}</td>
                  <td className="px-5 py-4 text-gray-600">{company.sales}</td>
                  <td className="px-5 py-4 text-gray-600">{company.employees}명</td>
                  <td className="px-5 py-4"><strong className="text-base text-red-600">{company.score}</strong><span className="ml-0.5 text-xs text-gray-400">점</span></td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">{company.factors.map((factor) => <span key={factor} className="rounded bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-600">{factor}</span>)}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button type="button" onClick={() => setOpenedCompany(company.name)} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-service-primary hover:text-service-primary">
                      관리하기 →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {openedCompany && (
          <div className="flex items-center justify-between border-t border-red-100 bg-red-50 px-6 py-3 text-xs text-red-700">
            <span><strong>{openedCompany}</strong> 개선관리 상세 화면을 선택했습니다.</span>
            <button type="button" onClick={() => setOpenedCompany(null)} className="font-semibold hover:underline">닫기</button>
          </div>
        )}
      </Card>
    </div>
  );
}

function GroupedBars({
  values,
  max,
}: {
  values: number[][];
  max: number;
}) {
  const colors: RiskLevel[] = ['우수', '보통', '위험'];
  const ticks = [max, Math.round(max * 0.67), Math.round(max * 0.33), 0];
  return (
    <div className="mt-8 grid grid-cols-[3.5rem_1fr] gap-2">
      <div className="relative h-60">
        <span className="absolute -left-5 top-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-xs font-semibold text-gray-500">협력사 수</span>
        <div className="flex h-[calc(100%-1.75rem)] flex-col justify-between text-right text-[10px] text-gray-400">
          {ticks.map((tick) => <span key={tick}>{tick}</span>)}
        </div>
      </div>
      <div className="relative flex h-60 items-end justify-around gap-5 border-b border-gray-300 px-4">
        <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[calc(100%-1.75rem)] flex-col justify-between">
          {ticks.map((tick) => <span key={tick} className="block border-t border-gray-100" />)}
        </div>
        {values.map((yearValues, yearIndex) => (
          <div key={yearIndex} className="z-10 flex h-full flex-1 flex-col justify-end">
            <div className="flex h-[85%] items-end justify-center gap-2">
              {yearValues.map((value, index) => (
                <div key={colors[index]} className="flex w-full max-w-10 flex-col items-center justify-end">
                  <span className="mb-1 text-[10px] font-semibold text-gray-500">{value}</span>
                  <div className="w-full rounded-t-sm" style={{ height: `${(value / max) * 170}px`, backgroundColor: riskColors[colors[index]] }} />
                </div>
              ))}
            </div>
            <span className="mt-3 text-center text-xs font-medium text-gray-500">{2023 + yearIndex}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const trendScores = {
  총점: [69, 73, 76, 80],
  노동: [72, 76, 81, 88],
  '인권·안전': [68, 72, 77, 82],
  환경: [64, 69, 72, 76],
  윤리: [71, 70, 72, 73],
  경영: [70, 76, 78, 81],
} as const;
type TrendMetric = keyof typeof trendScores;

function ScoreTrendBars() {
  const metrics = Object.keys(trendScores) as TrendMetric[];
  const years = ['2024년', '2025년', '2026년'];
  const colors = ['bg-red-200', 'bg-red-400', 'bg-red-700'];
  return (
    <div className="mt-7">
      <div className="grid grid-cols-[3rem_1fr] gap-3">
        <div className="flex h-72 flex-col justify-between pb-9 text-right text-[10px] text-gray-400">
          {[100, 80, 60, 40, 20, 0].map((tick) => <span key={tick}>{tick}점</span>)}
        </div>
        <div className="relative grid h-72 grid-cols-6 items-end gap-4 border-b border-gray-300 px-3">
          <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[calc(100%-2.25rem)] flex-col justify-between">
            {[100, 80, 60, 40, 20, 0].map((tick) => <span key={tick} className="block border-t border-gray-100" />)}
          </div>
          {metrics.map((metric) => (
            <div key={metric} className="z-10 flex h-full flex-col justify-end">
              <div className="flex h-[calc(100%-2.25rem)] items-end justify-center gap-1">
                {trendScores[metric].slice(1).map((value, index) => (
                  <div key={`${metric}-${years[index]}`} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end">
                    <span className="mb-1 text-[10px] font-semibold text-gray-600">{value}</span>
                    <div className={`w-full max-w-10 rounded-t-sm ${colors[index]}`} style={{ height: `${value}%` }} />
                  </div>
                ))}
              </div>
              <span className="mt-3 text-center text-xs font-semibold text-gray-600">{metric}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 flex justify-center gap-6">
        {years.map((year, index) => (
          <span key={year} className="flex items-center gap-2 text-xs text-gray-500"><i className={`h-3 w-3 rounded-sm ${colors[index]}`} />{year}</span>
        ))}
      </div>
    </div>
  );
}

function TrendView() {
  const [salesBand, setSalesBand] = useState('500억 이상');
  const salesValues: Record<string, number[][]> = {
    '500억 이상': [[7, 8, 3], [8, 8, 2], [9, 7, 2], [10, 6, 2]],
    '400–500억': [[8, 11, 5], [9, 10, 5], [11, 9, 4], [13, 8, 3]],
    '300–400억': [[10, 13, 8], [11, 13, 7], [13, 12, 6], [15, 11, 5]],
    '200–300억': [[11, 17, 11], [13, 16, 10], [15, 16, 8], [17, 15, 7]],
    '100–200억': [[12, 20, 14], [15, 19, 12], [17, 19, 10], [20, 17, 9]],
    '100억 미만': [[5, 20, 17], [6, 20, 16], [8, 19, 15], [9, 19, 14]],
  };
  return (
    <div className="space-y-5">
      <Card className="p-6">
        <SectionTitle
          title="평가 점수 추이"
          description="최근 3개년 영역별 평균 점수 · 100점 만점"
        />
        <ScoreTrendBars />
      </Card>

      <CustomerHistory embedded />

      <Card className="p-6">
        <SectionTitle title="리스크 분포 변화" description="연도별 우수·보통·위험 협력사 수" right={<Legend />} />
        <GroupedBars values={[[61, 88, 51], [68, 85, 47], [75, 81, 44], [84, 76, 40]]} max={90} />
      </Card>

      <Card className="p-6">
        <SectionTitle
          title="매출액별 리스크 분포 변화"
          description="선택한 매출 구간의 연도별 리스크 분포"
          right={
            <label className="relative">
              <span className="sr-only">매출액 구간 선택</span>
              <select value={salesBand} onChange={(event) => setSalesBand(event.target.value)} className="service-control min-w-36 appearance-none pr-8">
                {Object.keys(salesValues).map((band) => <option key={band}>{band}</option>)}
              </select>
              <span className="pointer-events-none absolute right-3 top-2.5 text-gray-400">⌄</span>
            </label>
          }
        />
        <GroupedBars values={salesValues[salesBand]} max={Math.max(...salesValues[salesBand].flat(), 20)} />
      </Card>
    </div>
  );
}

export default function CustomerHome({
  view,
}: {
  view: 'summary' | 'trend';
}) {
  return (
    <div className="service-page-wide mx-auto max-w-[90rem]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="service-page-title">{view === 'summary' ? 'ESG 통합 대시보드' : '추이 분석'}</div>
          <div className="service-page-description">
            {view === 'summary'
              ? '협력사 ESG 평가 현황과 핵심 리스크를 한눈에 확인하세요.'
              : '연도별 ESG 평가 점수와 협력사 위험 변화를 비교합니다.'}
          </div>
        </div>
      </div>
      {view === 'summary' ? (
        <YearView />
      ) : (
        <div className="space-y-5">
          <TrendView />
          <RiskView />
        </div>
      )}
    </div>
  );
}
