import { useState } from 'react';
import AudCampaignList from '../auditor/AudCampaignList';
import AudFieldAuditForm from '../auditor/AudFieldAuditForm';

const auditors = [
  { name: '김민수 수석실사자', company: 'KPC ESG 지원단', assigned: 7, complete: 4 },
  { name: '이서연 책임실사자', company: '한국지속가능경영원', assigned: 6, complete: 3 },
  { name: '박정우 전문실사자', company: '그린컨설팅', assigned: 5, complete: 4 },
  { name: '최유진 실사자', company: 'ESG 검증센터', assigned: 4, complete: 2 },
];

export default function ConsultantAuditManagement() {
  const [auditor, setAuditor] = useState<string | null>(null);
  const [company, setCompany] = useState<string | null>(null);
  if (company) return <AudFieldAuditForm companyName={company} onBack={() => setCompany(null)} />;
  if (auditor) return <div><button type="button" onClick={() => setAuditor(null)} className="mb-4 rounded-lg bg-[#1a3055] px-4 py-2 text-xs font-bold text-white">← 실사자 목록</button><div className="mb-4 text-xl font-black">{auditor} 실사 현황</div><AudCampaignList onOpenMail={() => undefined} onStartAudit={setCompany} /></div>;
  return <div><div className="mb-6"><div className="text-2xl font-black text-[#1a3055]">실사관리</div><p className="mt-1 text-sm text-gray-500">실사자를 선택해 일정, 진행 현황과 최종 실사 결과를 확인합니다.</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{auditors.map(item => <button type="button" key={item.name} onClick={() => setAuditor(item.name)} className="rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm hover:border-blue-300 hover:shadow-md"><div className="text-lg font-black text-gray-900">{item.name}</div><div className="mt-1 text-xs text-gray-500">{item.company}</div><div className="mt-5 grid grid-cols-2 gap-3 text-center"><div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700">배정 <strong className="ml-1 text-lg">{item.assigned}</strong>건</div><div className="rounded-lg bg-green-50 p-3 text-xs text-green-700">완료 <strong className="ml-1 text-lg">{item.complete}</strong>건</div></div></button>)}</div></div>;
}
