import { useState } from 'react';
import History from './History';

interface Props {
  onStartAssessment: () => void;
}

const assessments = [
  { id: 'current', title: 'TEST 2024 협력사 ESG 평가 (TEST)', period: '2024-09-23 ~ 2026-11-30', status: '진행중', progress: 37, client: 'SAMSUNG BIOLOGICS' },
  { id: 'samsung-2024', title: '2024 Samsung Biologics Supplier ESG Self-Assessment', period: '2024-10-02 ~ 2024-11-22', status: '종료', progress: 100, client: 'SAMSUNG BIOLOGICS' },
  { id: 'lg-2023', title: 'LG생활건강 2023 협력회사 ESG 평가', period: '2023-11-13 ~ 2024-01-19', status: '종료', progress: 100, client: 'LG생활건강' },
];

export default function AssessmentList({ onStartAssessment }: Props) {
  const [status, setStatus] = useState<'진행중' | '종료'>('진행중');
  const visible = assessments.filter(assessment => assessment.status === status);

  return (
    <div className="service-page">
      <div className="mb-6 flex gap-2">
        {(['진행중', '종료'] as const).map(item => (
          <button key={item} type="button" onClick={() => setStatus(item)} className={`rounded px-6 py-2 text-sm font-medium ${status === item ? 'text-white' : 'border border-gray-300 bg-white text-gray-600'}`} style={status === item ? { background: '#3d4d5c' } : undefined}>{item}</button>
        ))}
      </div>
      <div className="space-y-3">
        {status === '종료' && <History />}
        {status === '진행중' && visible.map(assessment => (
          <article key={assessment.id} className="flex items-center gap-5 rounded border border-gray-200 bg-white px-5 py-4">
            <div className="flex h-[60px] w-20 shrink-0 items-center justify-center rounded border border-gray-200 text-center text-[9px] font-bold text-[#1428A0]">{assessment.client}</div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-gray-900">{assessment.title}</div>
              <div className="mt-1 text-xs text-gray-500">{assessment.period}</div>
              <div className="mt-3 flex max-w-md items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-[#e63946]" style={{ width: `${assessment.progress}%` }} /></div>
                <span className="w-9 text-right text-xs font-bold text-[#e63946]">{assessment.progress}%</span>
              </div>
            </div>
            {status === '진행중' ? <button type="button" onClick={onStartAssessment} className="rounded bg-[#e63946] px-6 py-2 text-sm font-medium text-white">작성하기</button> : <span className="rounded-full bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-500">종료</span>}
          </article>
        ))}
      </div>
    </div>
  );
}
