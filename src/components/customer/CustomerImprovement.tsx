import { useMemo, useState } from 'react';

type RiskLevel = '위험' | '보통' | '우수';

type Partner = {
  name: string;
  risk: RiskLevel;
  manager: string;
  email: string;
  taskCount: number;
  completedCount: number;
};

type TaskTemplate = {
  area: string;
  subArea: string;
  question: string;
  fieldCheck: string;
  improvement: string;
  plan: string;
  schedule: string;
  dueDate: string;
  progress: string;
  fileName: string;
};

const partners: Partner[] = [
  { name: '한국정밀', risk: '위험', manager: '박지현', email: 'jihyun.park@hankookjm.co.kr', taskCount: 17, completedCount: 6 },
  { name: '그린테크', risk: '보통', manager: '김민준', email: 'minjun.kim@greentech.co.kr', taskCount: 12, completedCount: 8 },
  { name: '미래부품', risk: '우수', manager: '이서연', email: 'seoyeon.lee@miraeparts.co.kr', taskCount: 13, completedCount: 12 },
  { name: '대상산업', risk: '위험', manager: '최현우', email: 'hyunwoo.choi@daesang-ind.co.kr', taskCount: 17, completedCount: 4 },
  { name: '한빛테크', risk: '보통', manager: '정수빈', email: 'subin.jeong@hanbittech.co.kr', taskCount: 13, completedCount: 7 },
  { name: '신성에너지', risk: '위험', manager: '오지훈', email: 'jihoon.oh@shinsung-energy.co.kr', taskCount: 11, completedCount: 0 },
  { name: '세영테크', risk: '우수', manager: '윤하늘', email: 'haneul.yoon@seyoungtech.co.kr', taskCount: 9, completedCount: 9 },
];

const taskTemplates: TaskTemplate[] = [
  {
    area: '인권',
    subArea: '인권경영체계',
    question: '귀사는 임직원의 인권 증진 및 인권침해 구제를 목적으로 하는 인권정책을 보유하고 있습니까?',
    fieldCheck: '인권정책 및 피해 구제 절차가 문서화되어 있지 않음',
    improvement: '인권헌장 및 피해 구제 절차 수립 필요',
    plan: '인권헌장 초안을 작성하고 노사협의회 검토 후 전사에 공표',
    schedule: '단기',
    dueDate: '2026.10.31',
    progress: '인권헌장 초안 작성 및 내부 법무 검토 완료',
    fileName: '인권헌장_제정안.pdf',
  },
  {
    area: '인권',
    subArea: '교육 및 소통',
    question: '귀사는 임직원을 대상으로 인권 관련 교육을 정기적으로 실시하고 있습니까?',
    fieldCheck: '신규 입사자 외 정기 인권교육 실적이 확인되지 않음',
    improvement: '전 임직원 대상 연 1회 인권교육 시행 필요',
    plan: '온라인 교육과정을 개설하고 교육 이수 여부를 인사시스템에서 관리',
    schedule: '단기',
    dueDate: '2026.11.15',
    progress: '교육업체 선정 완료, 교육 콘텐츠 검수 진행 중',
    fileName: '인권교육_운영계획.pdf',
  },
  {
    area: '안전',
    subArea: '안전경영 일반',
    question: '귀사는 안전보건 관리 규정과 관련 매뉴얼을 수립하여 운영하고 있습니까?',
    fieldCheck: '안전보건 매뉴얼의 최근 개정 이력이 확인되지 않음',
    improvement: '법규 개정사항을 반영한 안전보건 매뉴얼 최신화',
    plan: '외부 전문가 검토를 거쳐 안전보건 매뉴얼을 개정',
    schedule: '단기',
    dueDate: '2026.12.10',
    progress: '현행 규정과 관련 법규 간 차이 분석 완료',
    fileName: '안전보건매뉴얼_개정본.pdf',
  },
  {
    area: '안전',
    subArea: '비상사태 대비',
    question: '비상상황 대응 조직을 구성하고 정기적인 대피훈련을 실시하고 있습니까?',
    fieldCheck: '야간 근무조를 포함한 비상대응 훈련 실적이 없음',
    improvement: '전 근무조 대상 비상대응 훈련 확대 필요',
    plan: '반기별 합동 대피훈련 계획을 수립하고 결과보고서를 관리',
    schedule: '중기',
    dueDate: '2027.03.31',
    progress: '소방서 합동훈련 일정 협의 중',
    fileName: '비상대응훈련_계획서.pdf',
  },
  {
    area: '환경',
    subArea: '환경경영 일반',
    question: '귀사는 문서화된 환경정책 또는 환경방침을 보유하고 있습니까?',
    fieldCheck: '환경방침은 있으나 정량 목표와 담당 조직이 명확하지 않음',
    improvement: '환경 목표와 책임 조직을 포함한 환경방침 보완',
    plan: '에너지·폐기물 감축 목표를 반영하여 환경방침 개정',
    schedule: '중기',
    dueDate: '2027.04.30',
    progress: '최근 3개년 환경 데이터 취합 중',
    fileName: '환경방침_개정계획.xlsx',
  },
  {
    area: '환경',
    subArea: '폐기물 관리',
    question: '귀사는 일반·지정 폐기물 배출량을 측정하고 지속적으로 관리하고 있습니까?',
    fieldCheck: '폐기물 유형별 월간 배출량 집계 체계가 미흡함',
    improvement: '폐기물 유형별 배출량 관리대장 운영 필요',
    plan: '사업장별 폐기물 관리대장을 표준화하고 월별 실적을 취합',
    schedule: '단기',
    dueDate: '2026.11.30',
    progress: '표준 관리대장 배포 및 담당자 교육 완료',
    fileName: '폐기물관리대장.xlsx',
  },
  {
    area: '윤리',
    subArea: '윤리경영 체계',
    question: '귀사는 임직원이 준수해야 할 윤리규범을 보유하고 관련 교육을 실시하고 있습니까?',
    fieldCheck: '윤리규범 교육 이수 대상과 주기가 정해져 있지 않음',
    improvement: '윤리교육 대상 및 정기 교육 주기 수립',
    plan: '전 임직원 연 1회 윤리교육 및 준수서약 절차 도입',
    schedule: '중기',
    dueDate: '2027.02.28',
    progress: '윤리교육 커리큘럼 검토 중',
    fileName: '윤리교육_커리큘럼.pdf',
  },
  {
    area: '윤리',
    subArea: '신고제도',
    question: '귀사는 인권·윤리·법규 위반사항을 신고할 수 있는 채널을 운영하고 있습니까?',
    fieldCheck: '익명 신고 채널 및 신고자 보호 절차가 마련되지 않음',
    improvement: '익명 신고 채널과 신고자 보호 규정 마련',
    plan: '외부 익명 제보 시스템을 도입하고 처리 절차를 사규에 반영',
    schedule: '장기',
    dueDate: '2027.08.31',
    progress: '시스템 공급업체 견적 검토 중',
    fileName: '신고채널_도입검토.pdf',
  },
];

const riskStyles: Record<RiskLevel, string> = {
  위험: 'bg-red-50 text-red-600 ring-red-100',
  보통: 'bg-amber-50 text-amber-700 ring-amber-100',
  우수: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
};

function CompletionBar({ completed, total }: { completed: number; total: number }) {
  const rate = Math.round((completed / total) * 100);
  return (
    <div className="flex min-w-40 items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-service-primary" style={{ width: `${rate}%` }} />
      </div>
      <strong className="w-10 text-right text-sm text-service-primary">{rate}%</strong>
    </div>
  );
}

function ImprovementList({ onOpen }: { onOpen: (partner: Partner) => void }) {
  const totalTasks = partners.reduce((sum, partner) => sum + partner.taskCount, 0);
  const completedTasks = partners.reduce((sum, partner) => sum + partner.completedCount, 0);

  return (
    <div className="service-page-wide mx-auto max-w-[90rem]">
      <div className="mb-6">
        <div className="service-page-title">이행관리</div>
        <div className="service-page-description">현장실사를 완료한 협력사의 개선과제 이행 현황을 확인합니다.</div>
      </div>

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        {[
          { label: '관리 협력사', value: `${partners.length}개사` },
          { label: '전체 개선과제', value: `${totalTasks}건` },
          { label: '이행 완료', value: `${completedTasks}건` },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
            <div className="text-xs font-semibold text-gray-500">{item.label}</div>
            <div className="mt-2 text-2xl font-black text-gray-900">{item.value}</div>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <div className="text-base font-bold text-gray-900">실사 협력사 개선 현황</div>
            <div className="mt-1 text-xs text-gray-400">최근 현장실사를 진행한 협력사 기준</div>
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600">총 {partners.length}개사</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[78rem] border-collapse text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500">
              <tr>
                <th className="px-6 py-3.5">협력사명</th>
                <th className="px-5 py-3.5">리스크등급</th>
                <th className="px-5 py-3.5">담당자명</th>
                <th className="px-5 py-3.5">담당자 이메일</th>
                <th className="px-5 py-3.5">개선 이행률</th>
                <th className="px-5 py-3.5 text-center">개선과제 수</th>
                <th className="px-5 py-3.5 text-center">이행 수</th>
                <th className="px-6 py-3.5 text-right">이행 관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {partners.map((partner) => (
                <tr key={partner.name} className="transition-colors hover:bg-gray-50/70">
                  <td className="px-6 py-4 font-bold text-gray-900">{partner.name}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex min-w-14 justify-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${riskStyles[partner.risk]}`}>
                      {partner.risk}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-medium text-gray-700">{partner.manager}</td>
                  <td className="px-5 py-4 text-gray-500">{partner.email}</td>
                  <td className="px-5 py-4"><CompletionBar completed={partner.completedCount} total={partner.taskCount} /></td>
                  <td className="px-5 py-4 text-center font-semibold text-gray-700">{partner.taskCount}건</td>
                  <td className="px-5 py-4 text-center font-semibold text-service-primary">{partner.completedCount}건</td>
                  <td className="px-6 py-4 text-right">
                    <button type="button" onClick={() => onOpen(partner)} className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-service-primary hover:text-service-primary">
                      관리하기 →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ReadOnlyDetail({ partner, onBack }: { partner: Partner; onBack: () => void }) {
  const tasks = useMemo(() => Array.from({ length: partner.taskCount }, (_, index) => ({
    ...taskTemplates[index % taskTemplates.length],
    no: index + 1,
    completed: index < partner.completedCount,
  })), [partner]);
  const rate = Math.round((partner.completedCount / partner.taskCount) * 100);

  return (
    <div className="service-page-wide mx-auto max-w-[96rem]">
      <div className="mb-5 flex items-center gap-3">
        <button type="button" onClick={onBack} className="flex h-9 items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-600 hover:border-service-primary hover:text-service-primary">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
            <path d="m14 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          이행관리 목록
        </button>
        <div className="h-5 w-px bg-gray-300" />
        <div>
          <div className="text-lg font-bold text-gray-900">개선 이행 현황</div>
          <div className="mt-0.5 text-xs text-gray-500">{partner.name} · {partner.manager} 담당자</div>
        </div>
        <span className={`ml-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${riskStyles[partner.risk]}`}>{partner.risk}</span>
      </div>

      <section className="mb-5 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-5 py-3">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-service-primary text-[11px] font-bold text-white">i</span>
          <div className="text-sm font-bold text-gray-800">조회 안내</div>
        </div>
        <div className="px-5 py-4 text-xs leading-6 text-gray-600">
          협력사가 작성한 개선과제 이행계획과 추진현황을 확인하는 읽기 전용 화면입니다.
          이 화면에서는 내용을 편집하거나 파일을 추가할 수 없습니다.
        </div>
      </section>

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex flex-wrap items-center gap-6">
          <div className="min-w-60 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-800">전체 이행률</span>
              <span className="text-base font-black text-service-primary">{rate}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-service-primary" style={{ width: `${rate}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-8 border-l border-gray-200 pl-6">
            <div>
              <div className="text-[11px] text-gray-400">전체 과제</div>
              <div className="mt-0.5 text-xl font-black text-gray-800">{partner.taskCount}<span className="ml-0.5 text-xs font-normal text-gray-500">건</span></div>
            </div>
            <div>
              <div className="text-[11px] text-gray-400">이행 완료</div>
              <div className="mt-0.5 text-xl font-black text-service-primary">{partner.completedCount}<span className="ml-0.5 text-xs font-normal text-gray-500">건</span></div>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-7">
        {Array.from(new Set(tasks.map((task) => task.area))).map((area) => {
          const areaTasks = tasks.filter((task) => task.area === area);
          const areaCompleted = areaTasks.filter((task) => task.completed).length;
          return (
            <section key={area}>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-4 w-1 rounded-full bg-service-primary" />
                <div className="text-base font-bold text-gray-900">{area}</div>
                <div className="text-xs text-gray-400">{areaCompleted}/{areaTasks.length} 완료</div>
              </div>
              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="w-full min-w-[88rem] table-fixed border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <GridHeading className="w-[4%]">NO.</GridHeading>
                      <GridHeading className="w-[17%]">질문</GridHeading>
                      <GridHeading className="w-[12%]">현장확인</GridHeading>
                      <GridHeading className="w-[12%]">개선과제</GridHeading>
                      <GridHeading className="w-[16%]">이행계획</GridHeading>
                      <GridHeading className="w-[11%]">이행일정</GridHeading>
                      <GridHeading className="w-[14%]">추진현황</GridHeading>
                      <GridHeading className="w-[6%]">이행여부</GridHeading>
                      <GridHeading className="w-[8%] border-r-0">증빙파일</GridHeading>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {areaTasks.map((task) => (
                      <tr key={task.no} className={task.completed ? 'bg-emerald-50/30' : 'bg-white'}>
                        <GridData className="text-center font-semibold text-gray-400">{String(task.no).padStart(2, '0')}</GridData>
                        <GridData>
                          <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-600">{task.subArea}</span>
                          <div className="mt-2 text-xs font-medium leading-5 text-gray-700">{task.question}</div>
                        </GridData>
                        <GridData><div className="text-xs leading-5 text-gray-600">{task.fieldCheck}</div></GridData>
                        <GridData><div className="rounded bg-red-50/70 p-2.5 text-xs font-medium leading-5 text-gray-700">{task.improvement}</div></GridData>
                        <GridData><ReadOnlyValue>{task.completed ? task.plan : '-'}</ReadOnlyValue></GridData>
                        <GridData>
                          <div className="space-y-2">
                            <ReadOnlyField label="이행일정" value={task.completed ? task.schedule : '-'} />
                            <ReadOnlyField label="완료예정일" value={task.completed ? task.dueDate : '-'} />
                          </div>
                        </GridData>
                        <GridData><ReadOnlyValue>{task.completed ? task.progress : '-'}</ReadOnlyValue></GridData>
                        <GridData className="text-center">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${task.completed ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                            {task.completed ? '완료' : '미완료'}
                          </span>
                        </GridData>
                        <GridData className="border-r-0">
                          {task.completed ? <button type="button" onClick={() => { const blob = new Blob([`${partner.name} 개선과제 증빙자료: ${task.fileName}`], { type: 'text/plain;charset=utf-8' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = task.fileName; link.click(); URL.revokeObjectURL(link.href); }} className="break-all text-left text-[11px] font-bold leading-5 text-blue-700 hover:underline">{task.fileName} ↓</button> : <div className="text-[11px] text-gray-400">첨부된 파일 없음</div>}
                        </GridData>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function GridHeading({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <th className={`border-r border-gray-100 px-3 py-3 text-center text-[11px] font-semibold text-gray-500 ${className}`}>{children}</th>;
}

function GridData({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`border-r border-gray-100 px-3 py-4 align-top ${className}`}>{children}</td>;
}

function ReadOnlyValue({ children }: { children: React.ReactNode }) {
  return <div className="min-h-20 rounded-md border border-gray-200 bg-gray-50 p-2.5 text-xs leading-5 text-gray-600">{children}</div>;
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 text-[10px] font-medium text-gray-400">{label}</div>
      <div className="rounded-md border border-gray-200 bg-gray-50 px-2 py-2 text-[11px] text-gray-600">{value}</div>
    </div>
  );
}

export default function CustomerImprovement() {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  if (selectedPartner) {
    return <ReadOnlyDetail partner={selectedPartner} onBack={() => setSelectedPartner(null)} />;
  }

  return <ImprovementList onOpen={setSelectedPartner} />;
}

export function CustomerImprovementDetail({ companyName, onBack }: { companyName: string; onBack: () => void }) {
  const partner = partners.find(item => item.name === companyName) ?? { ...partners[0], name: companyName };
  return <ReadOnlyDetail partner={partner} onBack={onBack} />;
}
