import { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import AudCampaignList from '../auditor/AudCampaignList';
import SurveyResultView from '../kpc/SurveyResultView';

type CampaignStatus = 'active' | 'closed';
type DetailView = 'progress' | 'participation' | 'evaluation' | 'audit';

type Campaign = {
  id: string;
  logo: string;
  name: string;
  period: string;
  remaining?: string;
  status: CampaignStatus;
};

const activeCampaigns: Campaign[] = [
  { id: 'ACTIVE-01', logo: 'KORTA', name: 'KORTA ESG 공급망 평가 [제조]', period: '2026.03.01 ~ 2026.06.30', remaining: '81일 후 종료', status: 'active' },
  { id: 'ACTIVE-02', logo: 'DEX', name: '2026 핵심 협력사 ESG 정기평가', period: '2026.04.01 ~ 2026.07.31', remaining: '112일 후 종료', status: 'active' },
  { id: 'ACTIVE-03', logo: 'GLOBAL', name: '글로벌 파트너 ESG 진단', period: '2026.05.01 ~ 2026.08.31', remaining: '143일 후 종료', status: 'active' },
  { id: 'ACTIVE-04', logo: 'DEX', name: '2026 상생협력 ESG 평가', period: '2026.06.02 ~ 2026.09.30', remaining: '173일 후 종료', status: 'active' },
];

const closedCampaigns: Campaign[] = [
  { id: 'CLOSED-01', logo: 'KORTA', name: '2025 KORTA 해외 공급망 ESG 대응 자가평가', period: '2025.09.16 ~ 2025.10.07', status: 'closed' },
  { id: 'CLOSED-02', logo: 'DEX', name: '2025 핵심 협력사 ESG 정기평가', period: '2025.06.01 ~ 2025.08.31', status: 'closed' },
  { id: 'CLOSED-03', logo: 'GLOBAL', name: '2025 글로벌 파트너 ESG 진단', period: '2025.04.01 ~ 2025.07.31', status: 'closed' },
  { id: 'CLOSED-04', logo: 'DEX', name: '2025 상생협력 ESG 평가', period: '2025.03.01 ~ 2025.06.30', status: 'closed' },
];

const stages = [
  { label: '배포 완료', count: 10, color: 'bg-slate-500' },
  { label: '설문중', count: 5, color: 'bg-blue-500' },
  { label: '컨설턴트 평가중', count: 17, color: 'bg-amber-500' },
  { label: '실사중', count: 7, color: 'bg-violet-600' },
  { label: '평가완료', count: 22, color: 'bg-emerald-500' },
  { label: '완료', count: 10, color: 'bg-slate-800' },
];

const partners = [
  { name: '한국정밀', progress: 100, submitted: 'Y', agreed: 'Y', areas: [100, 100, 100, 100, 100], stage: 6, date: '10/15' },
  { name: '그린테크', progress: 100, submitted: 'Y', agreed: 'Y', areas: [100, 100, 100, 100, 100], stage: 5, date: '10/12' },
  { name: '미래부품', progress: 92, submitted: 'N', agreed: 'Y', areas: [100, 92, 88, 91, 90], stage: 4, date: '10/08' },
  { name: '대상산업', progress: 86, submitted: 'N', agreed: 'Y', areas: [100, 83, 74, 91, 82], stage: 3, date: '10/03' },
  { name: '한빛테크', progress: 78, submitted: 'N', agreed: 'Y', areas: [92, 75, 68, 81, 74], stage: 3, date: '10/09' },
  { name: '신성에너지', progress: 64, submitted: 'N', agreed: 'Y', areas: [75, 61, 56, 70, 58], stage: 2, date: '10/07' },
  { name: '세영테크', progress: 52, submitted: 'N', agreed: 'Y', areas: [68, 49, 42, 57, 45], stage: 2, date: '10/11' },
  { name: '한국부품', progress: 35, submitted: 'N', agreed: 'Y', areas: [42, 38, 30, 35, 29], stage: 1, date: '10/09' },
];

const resultRows = partners.map((partner, index) => ({
  no: index + 1,
  company: partner.name,
  total: [80.3, 72.1, 68.9, 61.4, 58.7, 54.2, 47.8, 39.6][index],
  scores: [
    [89.3, 86.8, 73.2, 77.0, 74.8],
    [78.1, 81.0, 65.5, 69.2, 66.7],
    [74.6, 76.5, 62.1, 68.8, 61.9],
    [69.2, 70.1, 55.8, 59.4, 52.7],
    [65.0, 68.4, 54.1, 55.7, 50.3],
    [61.4, 63.8, 48.6, 51.9, 45.3],
    [55.3, 58.7, 40.2, 45.1, 39.7],
    [48.1, 46.5, 34.8, 37.2, 31.4],
  ][index],
}));

const scoreSummary = [
  { label: '총점', min: 39.6, average: 60.4, max: 80.3 },
  { label: 'L. 노동 및 인권', min: 46.5, average: 68.0, max: 89.3 },
  { label: 'S. 안전 및 보건', min: 46.5, average: 69.0, max: 86.8 },
  { label: 'E. 환경', min: 34.8, average: 54.3, max: 73.2 },
  { label: 'E. 윤리', min: 37.2, average: 58.1, max: 77.0 },
  { label: 'M. 경영시스템', min: 31.4, average: 52.9, max: 74.8 },
];

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-service-primary">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
        <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      캠페인 목록으로
    </button>
  );
}

function CampaignList({
  onOpen,
}: {
  onOpen: (campaign: Campaign, view: DetailView) => void;
}) {
  const [search, setSearch] = useState('');
  const query = search.trim().toLowerCase();
  const groups = [
    { status: 'active' as const, title: '진행중 캠페인', campaigns: activeCampaigns.filter((campaign) => campaign.name.toLowerCase().includes(query)) },
    { status: 'closed' as const, title: '마감 캠페인', campaigns: closedCampaigns.filter((campaign) => campaign.name.toLowerCase().includes(query)) },
  ];

  return (
    <div className="service-page-wide mx-auto max-w-[90rem]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="service-page-title">캠페인 분석</div>
          <div className="service-page-description">진행중 및 마감 캠페인의 현황과 평가 결과를 확인합니다.</div>
        </div>
        <label className="relative block">
          <span className="sr-only">캠페인 검색</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-none stroke-gray-400" strokeWidth="1.8">
            <circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 4 4" strokeLinecap="round" />
          </svg>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="캠페인 검색" className="service-control w-64 pl-9" />
        </label>
      </div>

      <div className="space-y-8">
        {groups.map((group) => (
          <section key={group.status}>
            <div className="mb-3 flex items-center gap-2">
              <div className="text-base font-bold text-gray-900">{group.title}</div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${group.status === 'active' ? 'bg-blue-50 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>{group.campaigns.length}건</span>
            </div>
            <div className="space-y-4">
              {group.campaigns.map((campaign, index) => (
                <article key={campaign.id} className="flex flex-wrap items-center gap-5 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
                  <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-xs font-black text-slate-700">{campaign.logo}</div>
                  <div className="min-w-64 flex-1">
                    <div className="text-base font-bold text-gray-900">{group.status === 'closed' ? `${index + 1}. ` : ''}{campaign.name}</div>
                    <div className="mt-1 text-xs text-gray-500">{campaign.period}{campaign.remaining && <span className="ml-2 font-semibold text-service-primary">({campaign.remaining})</span>}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button type="button" onClick={() => onOpen(campaign, group.status === 'active' ? 'progress' : 'participation')} className="min-w-28 rounded-lg bg-slate-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700">
                      {group.status === 'active' ? '진행현황' : '참여율'}
                    </button>
                    <button type="button" onClick={() => onOpen(campaign, 'evaluation')} className="min-w-28 rounded-lg bg-service-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-service-primary-hover">자가진단 결과</button>
                    <button type="button" onClick={() => onOpen(campaign, 'audit')} className="min-w-28 rounded-lg border border-violet-300 bg-white px-5 py-2.5 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-50">현장실사 관리</button>
                    <span className={`inline-flex min-h-10 min-w-20 items-center justify-center rounded-lg px-4 py-2.5 text-sm font-bold text-white ${group.status === 'active' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                      {group.status === 'active' ? '진행중' : '마감'}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function CampaignSidePanel({
  campaign,
  view,
  onBack,
}: {
  campaign: Campaign;
  view: DetailView;
  onBack: () => void;
}) {
  const closed = campaign.status === 'closed';
  const panelTitle = view === 'evaluation' ? '평가결과' : view === 'participation' ? '참여율' : '진행 현황';
  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-white p-5">
      <BackButton onClick={onBack} />
      <div className="rounded-lg bg-service-primary px-4 py-2.5 text-center text-sm font-bold text-white">{panelTitle}</div>
      <div className="mt-7 text-xs font-bold text-service-primary">{closed ? '마감' : '진행중'}</div>
      <div className="mt-2 text-sm font-bold leading-relaxed text-gray-900">{campaign.name}</div>
      <div className="mt-2 text-xs leading-relaxed text-gray-500">{campaign.period}</div>
    </aside>
  );
}

function RateSummary({ participation = false }: { participation?: boolean }) {
  const rate = participation ? 86 : 72;
  const segments = participation
    ? [
        { label: '참여', value: 172, width: '86%', color: 'bg-service-primary' },
        { label: '미참여', value: 28, width: '14%', color: 'bg-gray-400' },
      ]
    : [
        { label: '제출 완료', value: 144, width: '72%', color: 'bg-service-primary' },
        { label: '작성 중', value: 38, width: '19%', color: 'bg-amber-400' },
        { label: '미접속', value: 18, width: '9%', color: 'bg-gray-400' },
      ];
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="grid items-center gap-10 lg:grid-cols-[18rem_1fr]">
        <div className="flex justify-center">
          <div className="relative flex h-44 w-44 items-center justify-center rounded-full" style={{ background: `conic-gradient(var(--color-primary) 0 ${rate}%, var(--color-border-light) ${rate}% 100%)` }}>
            <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
              <strong className="text-4xl font-black text-gray-900">{rate}%</strong>
              <span className="mt-1 text-sm text-gray-400">{participation ? '참여율' : '완료율'}</span>
            </div>
          </div>
        </div>
        <div>
          <div className="mb-4 text-lg font-bold text-gray-900">{participation ? '캠페인 참여율' : '평가 진행률'}</div>
          <div className="flex h-14 overflow-hidden rounded-xl bg-gray-100 text-sm font-bold text-white">
            {segments.map((segment) => <div key={segment.label} className={`flex items-center justify-center ${segment.color}`} style={{ width: segment.width }}>{segment.value}</div>)}
          </div>
          <div className={`mt-5 grid gap-4 ${participation ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {segments.map((segment) => (
              <div key={segment.label}>
                <span className="flex items-center gap-2 text-xs text-gray-500"><i className={`h-2.5 w-2.5 rounded-full ${segment.color}`} />{segment.label}</span>
                <strong className="mt-1 block text-base text-gray-800">{segment.value}개사</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StageProgressView() {
  return (
    <div className="space-y-5">
      <RateSummary />
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-base font-bold text-gray-900">단계별 진행 현황</div>
        <div className="mt-7 grid min-w-[700px] grid-cols-6 items-end gap-6 border-b border-gray-200 px-6">
          {stages.map((stage) => (
            <div key={stage.label} className="flex flex-col items-center">
              <strong className="mb-2 text-sm text-gray-700">{stage.count}</strong>
              <div className={`w-14 rounded-t-md ${stage.color}`} style={{ height: `${stage.count * 5}px` }} />
              <span className="my-3 text-center text-xs font-semibold text-gray-600">{stage.label}</span>
            </div>
          ))}
        </div>
      </section>
      <StageTable />
      <ResponseRateView />
    </div>
  );
}

function StageTable() {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-5 text-base font-bold text-gray-900">협력사별 진행 현황</div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1450px] table-fixed border-collapse text-xs">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="w-28 px-3 py-3.5">협력사</th>
              <th className="w-24 px-3 py-3.5">제출완료</th>
              <th className="w-24 px-3 py-3.5">정보동의</th>
              <th className="w-52 px-3 py-3.5">DEX전자 캠페인</th>
              {stages.map((stage) => <th key={stage.label} className="w-28 px-2 py-3.5">{stage.label}</th>)}
              <th className="w-28 px-2 py-3.5">마감일</th>
              <th className="w-28 px-2 py-3.5">현재 상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {partners.map((partner) => (
              <tr key={partner.name} className="hover:bg-gray-50">
                <td className="px-3 py-4 text-center font-bold text-gray-800">{partner.name}</td>
                <td className="px-3 py-4 text-center font-medium text-gray-700">{partner.submitted}</td>
                <td className="px-3 py-4 text-center font-medium text-gray-700">{partner.agreed}</td>
                <td className="px-3 py-4 text-center font-medium text-gray-600">2026 공급망 ESG 정기평가</td>
                {stages.map((stage, index) => (
                  <TimelineCell key={stage.label} index={index} currentIndex={partner.stage - 1} date={partner.date} />
                ))}
                <td className="px-2 py-4 text-center"><div className="text-gray-600">2026.10.31</div><strong className="mt-1 block text-service-primary">D-34</strong></td>
                <td className="px-2 py-4 text-center"><span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 font-bold text-white ${stages[partner.stage - 1].color}`}>{stages[partner.stage - 1].label}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TimelineCell({ index, currentIndex, date }: { index: number; currentIndex: number; date: string }) {
  const reached = index <= currentIndex;
  const current = index === currentIndex;
  return (
    <td className="relative h-20 px-0 text-center">
      <span className={`absolute left-0 top-1/2 h-0.5 -translate-y-1/2 ${reached ? 'bg-blue-500' : 'bg-gray-200'}`} style={{ width: current ? '50%' : '100%' }} />
      {index === 0 && <span className={`absolute left-0 top-1/2 h-0.5 w-1/2 -translate-y-1/2 ${reached ? 'bg-blue-500' : 'bg-gray-200'}`} />}
      {!current && reached && index < currentIndex && <span className="absolute right-1 top-1/2 z-10 h-2 w-2 -translate-y-1/2 rotate-45 border-r-2 border-t-2 border-blue-500" />}
      {current && (
        <>
          <span className="absolute left-1/2 top-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-blue-500 ring-2 ring-blue-100" />
          <span className="absolute left-1/2 top-2 z-10 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-slate-700">{date}</span>
        </>
      )}
    </td>
  );
}

function ResponseRateView({ participation = false }: { participation?: boolean }) {
  const completed = partners.filter((partner) => partner.submitted === 'Y').length;
  return (
    <div className="space-y-5">
      {participation && <RateSummary participation />}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {!participation && (
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { label: '답변 작성률', value: 78.4 },
              { label: '답변 완료율', value: 72.0 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
                <span className="text-sm font-bold text-gray-700">{item.label}</span>
                <strong className="text-xl text-service-primary">{item.value}%</strong>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-200"><div className="h-full rounded-full bg-service-primary" style={{ width: `${item.value}%` }} /></div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-lg border border-gray-200 text-center text-xs">
          <div className="bg-gray-50 p-3 text-gray-500">참여 업체 수 <strong className="ml-2 text-gray-900">{partners.length}개사</strong></div>
          <div className="border-x border-gray-200 bg-gray-50 p-3 text-gray-500">진행 업체 수 <strong className="ml-2 text-gray-900">{partners.length}개사</strong></div>
          <div className="bg-gray-50 p-3 text-gray-500">제출 완료업체 수 <strong className="ml-2 text-gray-900">{completed}개사</strong></div>
        </div>
      </section>
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5 text-base font-bold text-gray-900">{participation ? '협력사별 참여 현황' : '협력사별 답변율'}</div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-xs">
            <thead className="bg-gray-50 text-gray-600">
              <tr><th className="px-3 py-3">NO.</th><th className="px-3 py-3">기업명</th><th className="px-3 py-3">작성률</th><th className="px-3 py-3">제출완료</th><th className="px-3 py-3">정보동의</th><th className="px-3 py-3">L.노동 및 인권</th><th className="px-3 py-3">S.안전 및 보건</th><th className="px-3 py-3">E.환경</th><th className="px-3 py-3">E.윤리</th><th className="px-3 py-3">M.경영시스템</th><th className="px-3 py-3">현재 상태</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {partners.map((partner, index) => (
                <tr key={partner.name} className="hover:bg-gray-50">
                  <td className="px-3 py-3 text-center">{index + 1}</td><td className="px-3 py-3 text-center font-semibold">{partner.name}</td>
                  <td className="px-3 py-3"><div className="flex items-center gap-2"><span className="w-9">{partner.progress}%</span><div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100"><div className="h-full bg-blue-500" style={{ width: `${partner.progress}%` }} /></div></div></td>
                  <td className="px-3 py-3 text-center">{partner.submitted}</td><td className="px-3 py-3 text-center">{partner.agreed}</td>
                  {partner.areas.map((score, areaIndex) => <td key={areaIndex} className="px-3 py-3 text-center">{score}%</td>)}
                  <td className="px-3 py-3 text-center font-bold">{partner.stage >= 6 ? '정합성 검토완료' : partner.submitted === 'Y' ? '제출 완료' : '미제출'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2">
      <path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ScoreRangeChart() {
  return (
    <div className="mt-6 space-y-4">
      <div className="grid grid-cols-[10rem_1fr] gap-4">
        <div />
        <div className="flex justify-between text-[10px] text-gray-400"><span>0점</span><span>20점</span><span>40점</span><span>60점</span><span>80점</span><span>100점</span></div>
      </div>
      {scoreSummary.map((item) => (
        <div key={item.label} className="grid grid-cols-[10rem_1fr] items-center gap-4">
          <span className="text-right text-xs font-semibold text-gray-600">{item.label}</span>
          <div className="relative h-8 rounded bg-gray-50">
            {[20, 40, 60, 80].map((tick) => <i key={tick} className="absolute inset-y-0 border-l border-gray-200" style={{ left: `${tick}%` }} />)}
            <div title={`최저점 ${item.min}점`} className="absolute top-1/2 h-3 -translate-y-1/2 rounded-full bg-red-200" style={{ left: `${item.min}%`, width: `${item.max - item.min}%` }} />
            <i title={`최저점 ${item.min}점`} className="absolute top-1/2 h-5 -translate-y-1/2 border-l-2 border-red-400" style={{ left: `${item.min}%` }} />
            <i title={`최고점 ${item.max}점`} className="absolute top-1/2 h-5 -translate-y-1/2 border-r-2 border-red-700" style={{ left: `${item.max}%` }} />
            <div className="absolute top-1/2 z-10 flex -translate-y-1/2 items-center" style={{ left: `${item.average}%` }}>
              <i className="h-4 w-4 -translate-x-1/2 rotate-45 rounded-sm border-2 border-white bg-service-primary shadow" />
              <strong className="ml-1 whitespace-nowrap text-xs text-service-primary">{item.average}점</strong>
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-end gap-5 text-[11px] text-gray-500">
        <span className="flex items-center gap-2"><i className="h-2.5 w-8 rounded-full bg-red-200" />최저–최고 범위</span>
        <span className="flex items-center gap-2"><i className="h-3 w-3 rotate-45 bg-service-primary" />평균</span>
      </div>
    </div>
  );
}

function ScoreDistributionChart() {
  const bins = [['20점 미만', 9], ['20~30점', 4], ['30~40점', 15], ['40~50점', 16], ['50~60점', 11], ['60~70점', 28], ['70~80점', 19], ['80~90점', 17], ['90점 이상', 25]] as const;
  return <div className="mt-8 border-t border-gray-100 pt-6"><div className="mb-4 text-base font-bold">협력사 점수 분포</div><div className="flex h-52 items-end gap-3 border-b border-gray-300 px-4">{bins.map(([label, count], index) => <div key={label} className="flex h-full flex-1 flex-col items-center justify-end"><strong className="mb-1 text-xs">{count}</strong><div className={`w-3/5 min-w-6 rounded-t ${index <= 2 ? 'bg-red-500' : index <= 5 ? 'bg-amber-400' : 'bg-emerald-500'}`} style={{ height: `${count * 5}px` }} /><span className="my-2 whitespace-nowrap text-[9px] text-gray-500">{label}</span></div>)}</div></div>;
}

function EvaluationView() {
  const [reviewCompany, setReviewCompany] = useState<{ company: string; tab: '설문결과보기' | '실사결과보기' } | null>(null);
  const highRisk = resultRows.filter(row => row.total < 60);
  const downloadHighRisk = () => {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(highRisk.map(row => ({ 기업명: row.company, 총점: row.total, 인권: row.scores[0], 안전: row.scores[1], 환경: row.scores[2], 윤리: row.scores[3], 경영시스템: row.scores[4], 현장실사대상: row.total < 50 ? 'Y' : 'N' }))), '고위험 협력사');
    XLSX.writeFile(workbook, '고위험_협력사_DATA.xlsx');
  };
  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div><div className="text-base font-bold text-gray-900">전체 점수 요약</div><div className="mt-1 text-xs text-gray-400">완료 협력사의 평균과 최고·최저 점수 범위</div></div>
        <ScoreRangeChart />
        <ScoreDistributionChart />
      </section>
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5 text-base font-bold text-gray-900">협력사별 평가 결과</div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1450px] border-collapse text-xs">
            <thead className="bg-gray-50 text-gray-600">
              <tr><th rowSpan={2} className="px-3 py-3">NO.</th><th rowSpan={2} className="px-3 py-3">기업명</th><th colSpan={6} className="border-b border-gray-200 px-3 py-2">자가진단 결과</th><th colSpan={6} className="border-b border-gray-200 px-3 py-2 text-red-600">정합성 검토 후</th><th rowSpan={2} className="px-3 py-3">점수 GAP</th><th rowSpan={2} className="px-3 py-3">현장실사 대상 여부</th><th rowSpan={2} className="px-3 py-3">개선과제 작성 상태</th><th rowSpan={2} className="px-3 py-3">상세정보</th></tr>
              <tr>{['총점', '인권', '안전', '환경', '윤리', '경영', '총점', '인권', '안전', '환경', '윤리', '경영'].map((value, index) => <th key={`${value}-${index}`} className="border-r border-gray-100 px-2 py-2">{value}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {resultRows.map((row) => { const reviewed = row.no % 2 === 1 ? [Number((row.total - 3).toFixed(1)), ...row.scores.map(value => Number((value - 2).toFixed(1)))] : null; return <tr key={row.no} className="hover:bg-gray-50"><td className="px-3 py-3 text-center">{row.no}</td><td className="px-3 py-3 text-center font-semibold">{row.company}</td>{[row.total, ...row.scores].map((score, index) => <td key={`self-${index}`} className="px-2 py-3 text-center">{score}</td>)}{(reviewed ?? ['-', '-', '-', '-', '-', '-']).map((score, index) => <td key={`review-${index}`} className="px-2 py-3 text-center font-bold">{score}</td>)}<td className="px-3 py-3 text-center font-bold text-red-600">{reviewed ? '-3.0' : '-'}</td><td className="px-3 py-3 text-center">{row.total < 50 ? 'Y' : 'N'}</td><td className="px-3 py-3 text-center font-bold">{row.no === 1 ? '작성 완료' : row.no < 4 ? '작성 중' : '미작성'}</td><td className="px-3 py-3"><div className="flex justify-center gap-1"><button type="button" onClick={() => setReviewCompany({ company: row.company, tab: '설문결과보기' })} className="rounded bg-slate-700 px-2 py-1.5 text-white">설문결과</button><button type="button" onClick={() => setReviewCompany({ company: row.company, tab: '실사결과보기' })} className="rounded bg-slate-700 px-2 py-1.5 text-white">정합성 검토</button><button type="button" className="rounded bg-slate-700 px-2 py-1.5 text-white">개선과제</button><button type="button" className="rounded bg-[#167d8d] px-2 py-1.5 text-white">결과보고서</button></div></td></tr>; })}
            </tbody>
          </table>
        </div>
      </section>
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b px-6 py-4"><div className="text-base font-bold">고위험 협력사</div><button type="button" onClick={downloadHighRisk} className="inline-flex items-center gap-2 rounded bg-[#167d8d] px-4 py-2 text-xs font-bold text-white">고위험 협력사 DATA <DownloadIcon /></button></div><div className="overflow-x-auto"><table className="w-full text-xs"><thead className="bg-gray-50"><tr>{['No.', '기업명', '매출액', '거래금액', '임직원 수', '총점', '인권', '안전', '환경', '윤리', '현장실사 대상 여부'].map(value => <th key={value} className="px-3 py-3">{value}</th>)}</tr></thead><tbody className="divide-y">{highRisk.map((row, index) => <tr key={row.company}><td className="px-3 py-3 text-center">{index + 1}</td><td className="px-3 py-3 text-center font-bold">{row.company}</td><td className="text-center">120억 원</td><td className="text-center">35억 원</td><td className="text-center">{80 + index * 12}명</td><td className="text-center font-bold">{row.total}</td>{row.scores.slice(0, 4).map((score, scoreIndex) => <td key={scoreIndex} className="text-center">{score}</td>)}<td className="text-center">{row.total < 50 ? 'Y' : 'N'}</td></tr>)}</tbody></table></div></section>
      {reviewCompany && <div className="fixed inset-0 z-[200] bg-white"><SurveyResultView initialTab={reviewCompany.tab} onClose={() => setReviewCompany(null)} /></div>}
    </div>
  );
}

export default function CustomerProgress() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [detailView, setDetailView] = useState<DetailView>('progress');

  const openDetail = (campaign: Campaign, view: DetailView) => {
    setSelectedCampaign(campaign);
    setDetailView(view);
  };
  const detailContent = useMemo(() => {
    if (detailView === 'progress') return <StageProgressView />;
    if (detailView === 'participation') return <ResponseRateView participation />;
    return <EvaluationView />;
  }, [detailView]);

  if (!selectedCampaign) return <CampaignList onOpen={openDetail} />;
  if (detailView === 'audit') return <div className="p-6"><BackButton onClick={() => setSelectedCampaign(null)} /><AudCampaignList onOpenMail={() => window.alert('고객사 계정에서는 메일 내용을 조회만 할 수 있습니다.')} onStartAudit={() => window.alert('실사평가는 배정된 실사자만 진행할 수 있습니다.')} onOpenImprovement={() => window.alert('개선과제 이행 현황은 이행관리 메뉴에서 확인해 주세요.')} /></div>;

  return (
    <div className="flex min-h-full">
      <CampaignSidePanel campaign={selectedCampaign} view={detailView} onBack={() => setSelectedCampaign(null)} />
      <div className="min-w-0 flex-1 p-6 xl:p-8">{detailContent}</div>
    </div>
  );
}
