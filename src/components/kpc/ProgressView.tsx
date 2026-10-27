import { useState } from 'react';
import * as XLSX from 'xlsx';
import PartnerDetail from './PartnerDetail';

interface Props {
  onBack: () => void;
  campaignName?: string;
  campaignPeriod?: string;
  initialPartner?: string;
}

const stages = [
  { label: '설문중', count: 2, color: '#4f67ff' },
  { label: '컨설턴트 검토중', count: 3, color: '#8b36f4' },
  { label: '실사중', count: 1, color: '#f2a000' },
  { label: '종료', count: 2, color: '#20b777' },
];

const partners = [
  { name: '한국정밀', campaign: '2026 공급망 ESG 정기평가', manager: '박준석 팀장', phone: '010-3456-7890', progress: 100, submitted: 'Y', stage: 4, date: '10/15', alert: '새 증빙자료' },
  { name: '그린테크', campaign: '2026 공급망 ESG 정기평가', manager: '이민호 부장', phone: '010-4567-8901', progress: 100, submitted: 'Y', stage: 4, date: '10/12', alert: '정합성 미검증' },
  { name: '미래부품', campaign: '2026 핵심 협력사 ESG 평가', manager: '김수영 차장', phone: '010-5678-9012', progress: 92, submitted: 'N', stage: 3, date: '10/08' },
  { name: '대상산업', campaign: '2026 핵심 협력사 ESG 평가', manager: '정동환 과장', phone: '010-6789-0123', progress: 86, submitted: 'N', stage: 3, date: '10/03' },
  { name: '한빛테크', campaign: '글로벌 파트너 ESG 진단', manager: '강태진 대리', phone: '010-7890-1234', progress: 78, submitted: 'N', stage: 2, date: '10/09' },
  { name: '신성에너지', campaign: '글로벌 파트너 ESG 진단', manager: '오지수 사원', phone: '010-8901-2345', progress: 64, submitted: 'N', stage: 2, date: '10/07' },
  { name: '세영테크', campaign: '2026 상생협력 ESG 평가', manager: '윤서진 과장', phone: '010-9012-3456', progress: 52, submitted: 'N', stage: 2, date: '10/11' },
  { name: '한국부품', campaign: '2026 상생협력 ESG 평가', manager: '최민석 대리', phone: '010-0123-4567', progress: 35, submitted: 'N', stage: 1, date: '10/09' },
];

export default function ProgressView({ onBack, campaignName = 'TEST 2026 협력사 ESG 자가평가', campaignPeriod = '2026-08-06 ~ 2026-11-30', initialPartner }: Props) {
  const [selectedPartner, setSelectedPartner] = useState<string | null>(initialPartner ?? null);
  const [reviewedPartners, setReviewedPartners] = useState<Set<string>>(new Set());
  const selectPartner = (name: string) => {
    const partner = partners.find(item => item.name === name);
    if (!partner || partner.progress !== 100) {
      window.alert('아직 완료 되지 않은 자가진단입니다.');
      return;
    }
    setSelectedPartner(name);
  };

  if (selectedPartner) {
    return (
      <div className="min-h-[calc(100vh-56px)] w-full">
        <PartnerDetail
          partnerName={selectedPartner}
          stage={partners.find(partner => partner.name === selectedPartner)?.stage ?? 3}
          reuploads={[]}
          onToggleReupload={() => undefined}
          onOpenMail={() => undefined}
          reuploadedQuestionIds={[]}
          onAcknowledgeReupload={() => undefined}
          hideWorkflowActions
          onBack={() => setSelectedPartner(null)}
          onConsistencyComplete={() => setReviewedPartners(current => new Set(current).add(selectedPartner))}
        />
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <div className="sticky top-0 z-20 flex min-h-14 flex-wrap items-center gap-2 border-b border-gray-200 bg-white px-6 py-2 shadow-sm">
        <button type="button" onClick={onBack} className="mr-2 inline-flex items-center gap-2 rounded-lg bg-[#1a3055] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#243f6d]">← 캠페인 목록</button>
        <div className="mr-auto min-w-0"><div className="truncate text-sm font-bold text-gray-900">{campaignName}</div><div className="text-[11px] text-gray-400">{campaignPeriod}</div></div>
      </div>

      <div className="service-page-wide mx-auto max-w-[100rem] space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-700">설문 완료</span>
          {partners.filter(partner => partner.submitted === 'Y').sort((a, b) => b.date.localeCompare(a.date)).map(partner => {
            const needsAttention = partner.alert === '새 증빙자료' || !reviewedPartners.has(partner.name);
            const alertLabel = partner.alert === '새 증빙자료' ? partner.alert : reviewedPartners.has(partner.name) ? '' : '정합성 미검증';
            return <button key={partner.name} type="button" onClick={() => selectPartner(partner.name)} className={`relative rounded-md border px-3 py-2 text-xs font-bold shadow-sm ${needsAttention ? 'border-amber-300 bg-amber-50 text-gray-800 hover:bg-amber-100' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}>{needsAttention && <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-amber-500" />}{partner.name}{alertLabel && <span className="ml-2 text-[10px] font-medium text-amber-700">{alertLabel}</span>}</button>;
          })}
        </div>

        <ResponsePanel onSelectPartner={selectPartner} />
        <PartnerStageTable onSelectPartner={selectPartner} />
      </div>
    </div>
  );
}

function ResponsePanel({ onSelectPartner }: { onSelectPartner: (name: string) => void }) {
  const downloadProgress = () => {
    const rows = partners.map((partner, index) => ({ NO: index + 1, 기업명: partner.name, 작성률: `${partner.progress}%`, 제출완료: partner.submitted, 정보동의: 'Y', '증빙자료 첨부': `${Math.round(partner.progress / 10)}/10 (${partner.progress}%)` }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), '진행 현황');
    XLSX.writeFile(workbook, '진행_현황_DATA.xlsx');
  };
  return (
    <section className="h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3"><div className="text-sm font-black">협력사별 답변율</div><button type="button" onClick={downloadProgress} className="rounded bg-[#167d8d] px-3 py-2 text-xs font-bold text-white">진행 현황 DATA ↓</button></div>
      <div className="grid gap-5 border-b border-gray-100 p-5 md:grid-cols-2">
        {[['답변 작성률', 90.9], ['답변 완료율', 90.9]].map(([label, value]) => <div key={String(label)} className="flex items-center gap-3"><span className="text-sm font-bold">{label}</span><strong className="text-xl text-[#e63946]">{value}%</strong><div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-[#e63946]" style={{ width: `${value}%` }} /></div></div>)}
      </div>
      <div className="grid grid-cols-3 border-b border-gray-200 bg-gray-50 text-center text-xs text-gray-500"><div className="p-3">참여 업체수 <strong className="ml-2 text-gray-900">8개</strong></div><div className="border-x border-gray-200 p-3">진행 업체수 <strong className="ml-2 text-gray-900">8개</strong></div><div className="p-3">제출 완료업체 수 <strong className="ml-2 text-gray-900">2개</strong></div></div>
      <table className="w-full border-collapse text-xs">
        <thead className="bg-gray-50 text-gray-600"><tr>{['NO.', '기업명', '작성률', '제출완료', '정보동의', '인권', '안전', '환경', '윤리', '증빙자료 첨부'].map(value => <th key={value} className="border-b border-gray-200 px-2 py-3">{value}</th>)}</tr></thead>
        <tbody className="divide-y divide-gray-100">{partners.map((partner, index) => <tr key={partner.name} onClick={() => onSelectPartner(partner.name)} className="cursor-pointer hover:bg-red-50/40"><td className="px-2 py-2.5 text-center">{index + 1}</td><td className="px-2 py-2.5 text-center font-bold text-blue-700">{partner.name}</td><td className="px-2 py-2.5"><div className="flex items-center gap-2"><span>{partner.progress}%</span><div className="h-2 flex-1 rounded-full bg-gray-100"><div className="h-full rounded-full bg-blue-500" style={{ width: `${partner.progress}%` }} /></div></div></td><td className="text-center">{partner.submitted}</td><td className="text-center">Y</td>{[0, 1, 2, 3].map(area => <td key={area} className="text-center">{partner.progress}%</td>)}<td className="whitespace-nowrap text-center">{Math.round(partner.progress / 10)}/10 ({partner.progress}%)</td></tr>)}</tbody>
      </table>
    </section>
  );
}

function PartnerStageTable({ onSelectPartner }: { onSelectPartner: (name: string) => void }) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4 text-base font-bold">협력사별 진행 현황</div>
      <table className="w-full table-fixed border-collapse text-[10px]">
        <thead className="bg-gray-50 text-gray-600"><tr><th className="w-[9%] py-3">협력사</th><th className="w-[16%]">캠페인명</th><th className="w-[12%]">담당자</th>{stages.map(stage => <th key={stage.label}>{stage.label}</th>)}<th className="w-[8%]">마감일</th><th className="w-[9%]">현재 상태</th></tr></thead>
        <tbody className="divide-y divide-gray-100">{partners.map(partner => <tr key={partner.name} onClick={() => onSelectPartner(partner.name)} className="cursor-pointer hover:bg-gray-50"><td className="py-3 text-center font-bold text-blue-700">{partner.name}</td><td className="px-2 text-center">{partner.campaign}</td><td className="text-center"><strong>{partner.manager}</strong><div className="text-[9px] text-gray-400">{partner.phone}</div></td>{stages.map((stage, index) => <td key={stage.label} className="relative h-14"><div className={`absolute left-0 top-1/2 h-0.5 w-full ${index < partner.stage ? 'bg-blue-500' : 'bg-gray-200'}`} />{index === partner.stage - 1 && <><span className="absolute left-1/2 top-1 text-[9px] font-bold">{partner.date}</span><span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-blue-500 ring-2 ring-blue-100" /></>}</td>)}<td className="text-center">10.31<strong className="block text-red-500">D-34</strong></td><td className="text-center"><span className="rounded-full px-2 py-1 font-bold text-white" style={{ background: stages[partner.stage - 1].color }}>{stages[partner.stage - 1].label}</span></td></tr>)}</tbody>
      </table>
    </section>
  );
}
