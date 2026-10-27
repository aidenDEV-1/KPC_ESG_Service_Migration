import { useMemo, useState } from 'react';

type Consultant = {
  id: string;
  name: string;
  rank: string;
  email: string;
  specialties: string[];
  capacity: number;
};

type Assignment = {
  id: number;
  client: string;
  partner: string;
  campaign: string;
  industry: string;
  stage: string;
  consultantId: string;
};

const consultants: Consultant[] = [
  { id: 'c01', name: '김민수', rank: '수석컨설턴트', email: 'minsu.kim@kpc.or.kr', specialties: ['제조', '공급망'], capacity: 8 },
  { id: 'c02', name: '이서현', rank: '책임컨설턴트', email: 'seohyun.lee@kpc.or.kr', specialties: ['환경', '에너지'], capacity: 7 },
  { id: 'c03', name: '박지훈', rank: '책임컨설턴트', email: 'jihoon.park@kpc.or.kr', specialties: ['안전보건', '인권'], capacity: 7 },
  { id: 'c04', name: '최유진', rank: '선임컨설턴트', email: 'yujin.choi@kpc.or.kr', specialties: ['윤리', '경영시스템'], capacity: 6 },
  { id: 'c05', name: '정하늘', rank: '선임컨설턴트', email: 'haneul.jung@kpc.or.kr', specialties: ['전자', '자동차'], capacity: 6 },
  { id: 'c06', name: '오세진', rank: '컨설턴트', email: 'sejin.oh@kpc.or.kr', specialties: ['데이터', '온실가스'], capacity: 5 },
];

const initialAssignments: Assignment[] = [
  { id: 1, client: '고객사 A', partner: '한국정밀', campaign: '2026 공급망 ESG 정기평가', industry: '정밀기계', stage: '컨설턴트 검토중', consultantId: 'c01' },
  { id: 2, client: '고객사 A', partner: '그린테크', campaign: '2026 공급망 ESG 정기평가', industry: '환경설비', stage: '설문중', consultantId: 'c01' },
  { id: 3, client: '고객사 A', partner: '미래부품', campaign: '2026 핵심 협력사 ESG 평가', industry: '자동차부품', stage: '실사중', consultantId: 'c01' },
  { id: 4, client: '고객사 A', partner: '대상산업', campaign: '2026 핵심 협력사 ESG 평가', industry: '산업재', stage: '실사중', consultantId: 'c01' },
  { id: 5, client: '고객사 A', partner: '한빛테크', campaign: '글로벌 파트너 ESG 진단', industry: '전자부품', stage: '완료', consultantId: 'c01' },
  { id: 6, client: '고객사 B', partner: '신성에너지', campaign: '2026 에너지 공급망 평가', industry: '신재생에너지', stage: '설문중', consultantId: 'c02' },
  { id: 7, client: '고객사 B', partner: '세영테크', campaign: '2026 에너지 공급망 평가', industry: '전자부품', stage: '컨설턴트 검토중', consultantId: 'c02' },
  { id: 8, client: '고객사 C', partner: '한국부품', campaign: '2026 상생협력 ESG 평가', industry: '자동차부품', stage: '설문중', consultantId: 'c05' },
  { id: 9, client: '고객사 C', partner: '동아정공', campaign: '2026 상생협력 ESG 평가', industry: '정밀기계', stage: '컨설턴트 검토중', consultantId: 'c03' },
  { id: 10, client: '고객사 D', partner: '태성산업', campaign: '2026 협력사 정기평가', industry: '화학', stage: '실사중', consultantId: 'c04' },
  { id: 11, client: '고객사 D', partner: '에코솔루션', campaign: '2026 협력사 정기평가', industry: '환경설비', stage: '설문중', consultantId: 'c02' },
  { id: 12, client: '고객사 E', partner: '대영전자', campaign: '2026 글로벌 공급망 진단', industry: '전자부품', stage: '컨설턴트 검토중', consultantId: 'c05' },
  { id: 13, client: '고객사 E', partner: '우진모터스', campaign: '2026 글로벌 공급망 진단', industry: '자동차부품', stage: '설문중', consultantId: '' },
  { id: 14, client: '고객사 E', partner: '성광화학', campaign: '2026 글로벌 공급망 진단', industry: '화학', stage: '설문중', consultantId: '' },
];

const stageStyle: Record<string, string> = {
  설문중: 'bg-blue-50 text-blue-700',
  '컨설턴트 검토중': 'bg-violet-50 text-violet-700',
  실사중: 'bg-amber-50 text-amber-700',
  완료: 'bg-emerald-50 text-emerald-700',
};

export default function ConsultantAssignmentManagement() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [savedAssignments, setSavedAssignments] = useState(initialAssignments);
  const [selectedConsultant, setSelectedConsultant] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  const clients = Array.from(new Set(assignments.map((item) => item.client)));
  const changedCount = assignments.filter((item) => savedAssignments.find((saved) => saved.id === item.id)?.consultantId !== item.consultantId).length;
  const unassignedCount = assignments.filter((item) => !item.consultantId).length;

  const workload = (consultantId: string) => assignments.filter((item) => item.consultantId === consultantId).length;
  const filteredAssignments = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return assignments.filter((item) => {
      if (selectedConsultant === 'unassigned' && item.consultantId) return false;
      if (selectedConsultant !== 'all' && selectedConsultant !== 'unassigned' && item.consultantId !== selectedConsultant) return false;
      if (clientFilter !== 'all' && item.client !== clientFilter) return false;
      if (normalized && !`${item.client} ${item.partner} ${item.campaign} ${item.industry}`.toLowerCase().includes(normalized)) return false;
      return true;
    });
  }, [assignments, clientFilter, query, selectedConsultant]);

  const updateAssignment = (id: number, consultantId: string) => {
    setAssignments((current) => current.map((item) => item.id === id ? { ...item, consultantId } : item));
    setSavedMessage('');
  };

  const saveAssignments = () => {
    setSavedAssignments(assignments);
    setSavedMessage(`${changedCount}건의 배정 변경을 저장했습니다.`);
    window.setTimeout(() => setSavedMessage(''), 2200);
  };

  return (
    <div className="mx-auto max-w-[96rem]">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xl font-bold text-gray-900">컨설턴트 배정 관리</div>
          <div className="mt-1 text-xs text-gray-500">KPC 컨설턴트와 고객사별 협력사를 매핑하고 담당 업무량을 관리합니다.</div>
        </div>
        <div className="flex items-center gap-3">
          {savedMessage && <span className="text-xs font-bold text-emerald-700">{savedMessage}</span>}
          <button type="button" disabled={changedCount === 0} onClick={saveAssignments} className={`rounded-md px-5 py-2.5 text-xs font-bold text-white ${changedCount > 0 ? 'bg-service-primary hover:bg-service-primary-hover' : 'cursor-not-allowed bg-gray-300'}`}>
            변경사항 저장 {changedCount > 0 && `(${changedCount})`}
          </button>
        </div>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'KPC 컨설턴트', value: `${consultants.length}명`, detail: '현재 활동 계정', color: 'text-blue-700' },
          { label: '전체 협력사', value: `${assignments.length}개사`, detail: `${clients.length}개 고객사`, color: 'text-slate-900' },
          { label: '배정 완료', value: `${assignments.length - unassignedCount}개사`, detail: `${Math.round(((assignments.length - unassignedCount) / assignments.length) * 100)}% 배정`, color: 'text-emerald-700' },
          { label: '미배정 협력사', value: `${unassignedCount}개사`, detail: '담당자 지정 필요', color: 'text-service-primary' },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold text-gray-500">{item.label}</div>
            <div className={`mt-2 text-2xl font-black ${item.color}`}>{item.value}</div>
            <div className="mt-1 text-[11px] text-gray-400">{item.detail}</div>
          </div>
        ))}
      </div>

      <div className="grid min-h-[40rem] gap-5 xl:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="text-sm font-bold text-gray-900">컨설턴트 현황</div>
            <div className="mt-1 text-[11px] text-gray-400">담당자를 선택하면 배정 협력사만 표시됩니다.</div>
          </div>
          <div className="p-2">
            <button type="button" onClick={() => setSelectedConsultant('all')} className={`mb-1 flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-xs font-bold ${selectedConsultant === 'all' ? 'bg-slate-800 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
              전체 컨설턴트 <span>{assignments.length - unassignedCount}건</span>
            </button>
            {consultants.map((consultant) => {
              const count = workload(consultant.id);
              const ratio = Math.min(100, Math.round((count / consultant.capacity) * 100));
              return (
                <button type="button" key={consultant.id} onClick={() => setSelectedConsultant(consultant.id)} className={`mb-1 block w-full rounded-md p-3 text-left transition ${selectedConsultant === consultant.id ? 'bg-blue-50 ring-1 ring-blue-200' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div><strong className="text-sm text-gray-900">{consultant.name}</strong><span className="ml-1 text-[10px] text-gray-400">{consultant.rank}</span></div>
                    <span className={`text-xs font-black ${count >= consultant.capacity ? 'text-service-primary' : 'text-gray-700'}`}>{count}/{consultant.capacity}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100"><div className={`h-full rounded-full ${ratio >= 90 ? 'bg-service-primary' : ratio >= 70 ? 'bg-amber-400' : 'bg-blue-500'}`} style={{ width: `${ratio}%` }} /></div>
                  <div className="mt-2 flex flex-wrap gap-1">{consultant.specialties.map((tag) => <span key={tag} className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] text-gray-500">{tag}</span>)}</div>
                </button>
              );
            })}
            <button type="button" onClick={() => setSelectedConsultant('unassigned')} className={`mt-2 flex w-full items-center justify-between rounded-md border border-dashed px-3 py-2.5 text-left text-xs font-bold ${selectedConsultant === 'unassigned' ? 'border-service-primary bg-red-50 text-service-primary' : 'border-gray-300 text-gray-500'}`}>
              미배정 협력사 <span>{unassignedCount}건</span>
            </button>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white p-3">
            <label className="relative min-w-64 flex-1">
              <span className="sr-only">협력사 검색</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="고객사, 협력사, 캠페인명 검색" className="service-control w-full" />
            </label>
            <select value={clientFilter} onChange={(event) => setClientFilter(event.target.value)} className="service-control min-w-40">
              <option value="all">전체 고객사</option>
              {clients.map((client) => <option key={client} value={client}>{client}</option>)}
            </select>
            <span className="ml-auto text-xs text-gray-500">조회 <strong className="text-service-primary">{filteredAssignments.length}</strong>건</span>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="w-full table-fixed border-collapse text-xs">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="w-[11%] px-3 py-3 text-left">고객사</th>
                  <th className="w-[14%] px-3 py-3 text-left">협력사</th>
                  <th className="w-[24%] px-3 py-3 text-left">캠페인</th>
                  <th className="w-[11%] px-3 py-3 text-left">업종</th>
                  <th className="w-[14%] px-3 py-3 text-left">진행 단계</th>
                  <th className="w-[26%] px-3 py-3 text-left">담당 컨설턴트</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAssignments.map((item) => {
                  const original = savedAssignments.find((saved) => saved.id === item.id);
                  const changed = original?.consultantId !== item.consultantId;
                  return (
                    <tr key={item.id} className={changed ? 'bg-amber-50/60' : 'hover:bg-gray-50'}>
                      <td className="px-3 py-3 font-semibold text-gray-700">{item.client}</td>
                      <td className="px-3 py-3 font-bold text-gray-900">{item.partner}</td>
                      <td className="px-3 py-3 leading-5 text-gray-600">{item.campaign}</td>
                      <td className="px-3 py-3 text-gray-500">{item.industry}</td>
                      <td className="px-3 py-3"><span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold ${stageStyle[item.stage]}`}>{item.stage}</span></td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <select value={item.consultantId} onChange={(event) => updateAssignment(item.id, event.target.value)} className={`service-control min-w-0 flex-1 ${!item.consultantId ? 'border-service-primary text-service-primary' : ''}`}>
                            <option value="">미배정</option>
                            {consultants.map((consultant) => <option key={consultant.id} value={consultant.id}>{consultant.name} {consultant.rank}</option>)}
                          </select>
                          {changed && <span className="shrink-0 text-[10px] font-bold text-amber-700">변경됨</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredAssignments.length === 0 && <div className="py-16 text-center text-sm text-gray-400">조건에 맞는 배정 정보가 없습니다.</div>}
          </div>
        </section>
      </div>
    </div>
  );
}
