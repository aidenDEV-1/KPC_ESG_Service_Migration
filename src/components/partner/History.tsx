import { useEffect, useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import SurveyResultView from '../kpc/SurveyResultView';

type Campaign = {
  id: string;
  title: string;
  period: string;
  logo: 'they' | 'kpc' | 'samsung' | 'lg';
  reportLabel: string;
  reportDisabled?: boolean;
  tag?: string;
};

type ImprovementTask = {
  no: number;
  area: string;
  subArea: string;
  question: string;
  fieldCheck: string;
  improvement: string;
};

type ImplementationValue = {
  plan: string;
  schedule: string;
  dueDate: string;
  progress: string;
  completed: boolean;
  fileName: string;
};

const campaigns: Campaign[] = [
  { id: 'test-20231009', title: '테스트 20231009', period: '2023-10-09 ~ 2026-05-06', logo: 'they', reportLabel: '보고서 다운로드' },
  { id: 'e1-2025', title: 'E1 2025 지속가능경영보고서 발간 프로젝트', period: '2026-03-23 ~ 2026-04-03', logo: 'they', reportLabel: '보고서 준비 중', reportDisabled: true },
  { id: 'restore-test', title: '테스트 질의 복제 문제 확인', period: '2023-08-01 ~ 2025-09-12', logo: 'they', reportLabel: '보고서 보기(구)' },
  { id: 'esg-support', title: '[TEST] ESG 공급망 지원사업', period: '2023-07-31 ~ 2025-06-23', logo: 'they', reportLabel: '보고서 보기(구)' },
  { id: 'test-campaign', title: '테스트용 캠페인', period: '2025-03-03 ~ 2025-03-15', logo: 'kpc', reportLabel: '보고서 보기(구)', tag: '[제목 없음]' },
  { id: 'samsung-2024', title: '2024 Samsung Biologics Supplier ESG Self-Assessment', period: '2024-10-02 ~ 2024-11-22', logo: 'samsung', reportLabel: '보고서 보기(구)' },
  { id: 'lg-2023', title: 'LG생활건강 2023 협력회사 ESG 평가', period: '2023-11-13 ~ 2024-01-19', logo: 'lg', reportLabel: '보고서 보기(구)' },
];

const taskSeeds: Array<[string, string, string, string, string]> = [
  ['인권', '인권경영체계', '귀사는 임직원의 인권 증진 및 인권침해 구제를 목적으로 하는 인권정책을 보유하고 있습니까?', '임직원의 인권 증진 및 인권침해 구제를 목적으로 하는 인권정책을 보유하지 않음', '인권헌장 보유 필요'],
  ['인권', '인권경영체계', '귀사가 임직원을 대상으로 수행하고 있는 인권관련 교육을 체크하여 주십시오.', '', '인권 일반 교육, 임직원 복리후생 교육 시행 필요'],
  ['인권', '자발적 근로', '외국인 근로자를 사용하는 경우, 근로자의 모국어 혹은 이해 가능한 언어로 고용계약서를 작성 및 교부하고 있습니까?', '외국인 근로자에게 모국어 및 이해 가능한 언어로 고용계약서를 작성 및 교부하고 있지 않음', '모국어로 고용계약서 작성 및 교부 필요'],
  ['인권', '자발적 근로', '귀사는 외국인 및 이주민 임직원의 신분증이나 사용(여권) 등을 보관하고 있습니까?', '외국인 및 이주민 임직원의 신분증이나 사용(여권) 등을 보관하고 있지 않으나 규정 없음', '관련 규정 보유 필요'],
  ['인권', '아동 근로자', '귀사의 연소자 고용과 관련한 정책(취업 규칙 등)이 포함하고 있는 사항을 모두 체크해 주시기 바랍니다.', '', '연소자 고용 관련 세부조항 보완 필요'],
  ['인권', '인도적 대우', '귀사의 성희롱 예방 지침에 포함된 사항을 모두 체크해 주시기 바랍니다.', '', '직장 내 성희롱 관련 사항 보완 필요 (취업규칙 외 없음)'],
  ['인권', '인도적 대우', '귀사의 괴롭힘 예방 지침에 포함된 사항을 모두 체크해 주시기 바랍니다.', '', '직장 내 괴롭힘 관련 내용 보완 필요 (취업규칙 외 없음)'],
  ['인권', '다양성 인정', '귀사의 내부 규정 및 정책에 차별을 금지하는 내용을 포함하고 있다면 모두 체크하여 주시기 바랍니다.', '', '차별금지 관련 내용 보완 필요'],
  ['인권', '결사의 자유', '귀사의 인권헌장 또는 내부규정에 임직원의 결사 및 단체교섭의 자유를 보장하고 있습니까?', '인권헌장 또는 내부규정에 임직원의 결사 및 단체교섭의 자유를 보장하고 있지 않음', '결사의 자유 관련 내용 보완 필요(인권헌장도 없음)'],
  ['안전', '안전경영 일반', '귀사는 ISO45001 등 국제 또는 국가적 안전보건 경영표준 및 인증을 획득하였습니까?', '', 'ISO45001 등 안전 관련 인증 보유 필요'],
  ['안전', '안전경영 일반', '귀사는 안전/보건 관리 규정을 수립하거나, 관련 매뉴얼을 작성 및 비치하고 있습니까?', '안전/보건 관리 규정 또는 관련 매뉴얼을 수립함', '안전/보건 관리 규정 보유 필요'],
  ['안전', '안전경영 일반', '귀사의 안전보건 관리 규정에 포함하는 내용을 모두 체크하여 주십시오.', '', '안전/보건 관리 규정 보유 필요'],
  ['안전', '비상사태대비', '비상대응조직(ERT)을 위해 적절한 개인 안전 보호구를 지급하고, 비상대응에 대한 교육을 정기적으로 제공하고 있습니까?', '비상대응조직(ERT)을 위해 적절한 개인 안전 보호구를 지급하고, 비상대응에 대한 교육을 정기적으로 제공하고 있지 않음', '비상대응조직(ERT)을 위해 적절한 개인 안전 보호구를 지급하고, 비상대응에 대한 교육을 정기적으로 제공 필요'],
  ['안전', '산업 재해 및 질병 관리', '귀사는 산업재해와 업무상 질병을 관련하여 허가, 등록, 검사 보고에 대한 절차를 규정하고 있습니까?', '산업재해와 업무상 질병을 관련하여 허가, 등록, 검사 보고에 대한 절차를 규정하지 않음', '산업재해와 업무상 질병 관련하여 허가, 등록, 검사 보고에 대한 절차를 규정 필요'],
  ['안전', '위생 및 시설 제공', '귀사가 기숙 시설을 보유하고 있다면, 관리하고 있는 항목을 모두 체크해 주시기 바랍니다.', '위 사항 확인', '비상탈출시설 설치 필요'],
  ['환경', '환경경영 일반', '귀사는 문서화된 환경정책 또는 환경방침을 보유하고 있습니까?', '문서화된 환경정책 또는 환경방침을 보유하지 않음', '환경정책 및 방침 보유 필요'],
  ['환경', '환경경영 일반', '회사는 환경경영을 추진하기 위한 전담 조직(EHS팀 등)을 운영하고 있습니까?', '환경경영을 추진하기 위한 전담 조직을 운영하지 않음 / 환경담당자는 지정되어 있음', '환경 담당자는 지정되어 있으므로 이대로 운영(임명장 및 수료증 확인)'],
  ['환경', '환경경영 일반', '귀사는 ISO14001 등 국제적 환경경영시스템 표준 또는 이에 준하는 인증을 취득하였습니까?', '', 'ISO 14001 등 환경 관련 인증 없음'],
  ['환경', '유해 화학물질 관리', '귀사는 사용하는 화학물질에 대해 취급하고 있는 안전관리 조치를 모두 체크해 주시기 바랍니다.', '', '사용하는 화학물질 정보 및 리스트, 입출고 관리 등 필요'],
  ['환경', '유해 화학물질 관리', '귀사는 생산 또는 판매되는 제품에 유해화학물질이 포함되어 있는지 추적관리하고 있습니까?', '생산 또는 판매되는 제품에 유해화학물질이 포함되어 있는지 추적 관리하지 않음', '생산 또는 판매되는 제품에 유해화학물질이 포함되어 있는지 추적 관리 필요'],
  ['환경', '폐기물 관리', '귀사는 일반/지정 폐기물 배출량을 측정 및 관리하고 있습니까?', '일반/지정 폐기물 배출량을 측정 및 관리하지 않음', '일반폐기물 배출량 관리 필요'],
  ['환경', '에너지 소비와 온실가스 배출 관리', '귀사는 문서화된 에너지/온실가스 관리 규정, 또는 에너지/온실가스 관리 계획을 보유하고 있습니까?', '문서화된 에너지/온실가스 관리 규정 또는 에너지/온실가스 관리 계획을 보유하지 않음', '에너지/온실가스 관리 규정 및 계획 보유 필요'],
  ['환경', '에너지 소비와 온실가스 배출 관리', '귀사는 에너지 소비량과 온실가스 배출량을 측정 및 관리하고 있습니까?', '에너지 소비량과 온실가스 배출량을 측정 및 관리하지 않음', '온실가스 배출량 관리 필요 / 전기 사용량 관리 확인'],
  ['윤리', '윤리경영 체계', '귀사는 사업을 영위하는 과정에서 준수해야 할 기본적 원칙을 담은 윤리경영 관련 규범을 보유하고 있습니까?', '', '윤리헌장 보유 및 외부공개 필요(홈페이지 등)'],
  ['윤리', '윤리경영 체계', '귀사의 윤리경영윤리규범 내용은 임직원에게 전달하기 위한 별도 교육을 실시하고 있습니까?', '윤리규범 내용을 임직원에게 전달하기 위한 별도 교육을 실시하지 않음', '윤리관련 교육 실시 필요'],
  ['윤리', '윤리경영 체계', '귀사의 윤리규범에 포함하고 있는 사항을 체크해 주시기 바랍니다.', '', '윤리규범 보유 필요'],
  ['윤리', '윤리경영 체계', '귀사는 임직원으로부터 윤리규범 준수 서약(윤리서약서 등)을 받고 있습니까?', '임직원들이 윤리규범을 준수하겠다고 서약하지 않음', '윤리서약서 보유 및 서명 필요'],
  ['윤리', '정직 및 반부패', '귀사는 인권침해, 윤리, 법적 위반사항 등에 대한 신고 제도 및 채널을 운영하고 있습니까?', '', '윤리규정 위반행위 신고채널 운영 필요'],
  ['윤리', '정직 및 반부패', '귀사의 부패 및 이해상충 신고 채널에서 다루고 있는 사항을 모두 체크해 주시기 바랍니다.', '', '위 사항 모두 보완 필요'],
  ['윤리', '공정거래', '귀사가 공정거래 및 거래의 투명성을 확보하기 위해 수행하는 활동을 모두 체크해 주시기 바랍니다.', '', '공정거래 관련 모든 사항 보완 필요'],
  ['윤리', '지적재산 보호', '귀사는 사업 활동에서 획득한 영업비밀의 보안 및 비공개정보 보호 목적의 시스템을 운영하고 있습니까?', '사업 활동에서 획득한 영업비밀의 보안 및 비공개정보 보호 목적의 시스템을 운영하지 않음', '정보보호 목적 시스템 운영 필요'],
  ['윤리', '지속가능한 원재료 조달', '귀사는 조달받는 원부자재가 책임있는 방식으로 생산됐는지 확인하는 절차가 있다면 체크해 주시기 바랍니다.', '', '원부자재 조달정책 보유 필요'],
  ['윤리', '지속가능한 원재료 조달', '귀사는 환경/사회적으로 책임있는 원부자재 조달 정책을 보유하고 있습니까?', '회사는 환경/사회적으로 책임있는 원부자재 조달 정책을 보유하지 않음', '원부자재 조달정책 보유 필요'],
  ['윤리', '지속가능한 원재료 조달', '귀사가 분쟁광물(구리 및 3TG)을 통해 거래업체에게 요구하고 있는 사항을 모두 체크해 주시기 바랍니다.', '', '원부자재 조달정책 보유 필요'],
];

const tasks: ImprovementTask[] = taskSeeds.map(([area, subArea, question, fieldCheck, improvement], index) => ({
  no: index + 1,
  area,
  subArea,
  question,
  fieldCheck,
  improvement,
}));

function createInitialValues(campaignId: string): Record<number, ImplementationValue> {
  let saved: Record<number, Partial<ImplementationValue>> = {};
  try {
    saved = JSON.parse(localStorage.getItem(`implementation-${campaignId}`) ?? '{}');
  } catch {
    saved = {};
  }

  return Object.fromEntries(tasks.map((task) => [
    task.no,
    {
      plan: saved[task.no]?.plan ?? '',
      schedule: ['단기', '중기', '장기'].includes(saved[task.no]?.schedule ?? '') ? saved[task.no]?.schedule ?? '' : '',
      dueDate: saved[task.no]?.dueDate ?? '',
      progress: saved[task.no]?.progress ?? '',
      completed: saved[task.no]?.completed ?? false,
      fileName: saved[task.no]?.fileName ?? '',
    },
  ]));
}

export default function History() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [resultCampaign, setResultCampaign] = useState<Campaign | null>(null);
  const [notice, setNotice] = useState('');

  if (selectedCampaign) {
    return <ImplementationManagement campaign={selectedCampaign} onBack={() => setSelectedCampaign(null)} />;
  }

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2200);
  };

  const handleReport = (campaign: Campaign) => {
    if (campaign.reportDisabled) return;
    if (campaign.reportLabel.includes('다운로드')) {
      const blob = new Blob([`${campaign.title}\n평가 기간: ${campaign.period}\nESG 평가 보고서`], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${campaign.title}-보고서.txt`;
      link.click();
      URL.revokeObjectURL(url);
      showNotice('보고서 다운로드를 시작했습니다.');
      return;
    }
    showNotice(`${campaign.title} 보고서를 확인합니다.`);
  };

  return (
    <div className="service-page">
      <div className="space-y-3">
        {campaigns.map((campaign) => (
          <article key={campaign.id} className="flex min-h-[94px] flex-wrap items-center gap-5 rounded border border-[#e0e0e0] bg-white px-5 py-4">
            <CampaignLogo type={campaign.logo} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-[#222]">{campaign.title}</div>
              <div className="mt-1 text-xs text-[#888]">{campaign.period}</div>
            </div>
            {campaign.tag && <span className="whitespace-nowrap border border-gray-500 px-1 text-[10px] text-gray-600">{campaign.tag}</span>}
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <button
                type="button"
                disabled={campaign.reportDisabled}
                onClick={() => handleReport(campaign)}
                className={`min-w-[92px] rounded px-4 py-2 text-xs font-medium text-white ${
                  campaign.reportDisabled ? 'cursor-not-allowed bg-[#61728e]' : campaign.reportLabel.includes('다운로드') ? 'bg-[#ef2448] hover:bg-[#dc1f40]' : 'bg-[#61728e] hover:bg-[#52637e]'
                }`}
              >
                {campaign.reportLabel}
              </button>
              <button
                type="button"
                onClick={() => setResultCampaign(campaign)}
                className="min-w-[92px] rounded bg-[#ef2448] px-4 py-2 text-xs font-medium text-white hover:bg-[#dc1f40]"
              >
                설문결과
              </button>
              <button
                type="button"
                onClick={() => setSelectedCampaign(campaign)}
                className="min-w-[92px] rounded border border-[#ef2448] bg-white px-4 py-2 text-xs font-medium text-[#ef2448] hover:bg-red-50"
              >
                이행 관리
              </button>
            </div>
          </article>
        ))}
      </div>

      {resultCampaign && <div className="fixed inset-0 z-[100] bg-white"><SurveyResultView onClose={() => setResultCampaign(null)} /></div>}

      {notice && <div className="fixed bottom-8 left-1/2 z-[110] -translate-x-1/2 rounded-md bg-gray-800 px-4 py-2.5 text-xs text-white shadow-lg">{notice}</div>}
    </div>
  );
}

function CampaignLogo({ type }: { type: Campaign['logo'] }) {
  return (
    <div className="flex h-[60px] w-20 shrink-0 items-center justify-center rounded border border-[#ddd] bg-white text-center">
      {type === 'they' && <span className="text-xs font-black tracking-tight text-gray-900">THE Y</span>}
      {type === 'kpc' && (
        <span className="leading-none">
          <span className="block text-sm font-black italic text-[#e63946]">kpc</span>
          <span className="mt-1 block text-[7px] text-gray-500">한국생산성본부</span>
        </span>
      )}
      {type === 'samsung' && (
        <span className="text-[9px] font-bold leading-tight text-[#1428a0]">
          SAMSUNG
          <br />
          BIOLOGICS
        </span>
      )}
      {type === 'lg' && <span className="text-[9px] font-bold text-gray-600"><span className="text-[#a50034]">●</span> LG생활건강</span>}
    </div>
  );
}

function ImplementationManagement({ campaign, onBack }: { campaign: Campaign; onBack: () => void }) {
  const [values, setValues] = useState<Record<number, ImplementationValue>>(() => createInitialValues(campaign.id));
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [areaFilter, setAreaFilter] = useState('전체');
  const [isExporting, setIsExporting] = useState(false);
  const fileInputs = useRef<Record<number, HTMLInputElement | null>>({});
  const completedCount = useMemo(() => Object.values(values).filter((value) => value.completed).length, [values]);
  const completionRate = Math.round((completedCount / tasks.length) * 100);
  const areas = ['전체', ...Array.from(new Set(tasks.map((task) => task.area)))];
  const visibleTasks = areaFilter === '전체' ? tasks : tasks.filter((task) => task.area === areaFilter);
  const visibleAreas = areas.slice(1).filter((area) => areaFilter === '전체' || area === areaFilter);

  const updateValue = <K extends keyof ImplementationValue>(no: number, key: K, value: ImplementationValue[K]) => {
    setValues((current) => ({
      ...current,
      [no]: {
        ...current[no],
        [key]: value,
        ...(key === 'dueDate' ? { schedule: classifySchedule(String(value)) } : {}),
      },
    }));
    setSaved(false);
    setDirty(true);
    localStorage.setItem('part-implementation-dirty', 'true');
  };

  const handleSave = () => {
    localStorage.setItem(`implementation-${campaign.id}`, JSON.stringify(values));
    setSaved(true);
    setDirty(false);
    localStorage.removeItem('part-implementation-dirty');
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!dirty) return;
      localStorage.setItem(`implementation-${campaign.id}`, JSON.stringify(values));
      setSaved(true);
      setDirty(false);
      localStorage.removeItem('part-implementation-dirty');
    }, 60_000);
    return () => window.clearInterval(interval);
  }, [campaign.id, dirty, values]);

  useEffect(() => {
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warnBeforeUnload);
    return () => window.removeEventListener('beforeunload', warnBeforeUnload);
  }, [dirty]);

  const handleBack = () => {
    if (dirty && !window.confirm('저장하지 않은 변경사항이 있습니다. 이행 관리 페이지를 나가시겠습니까?')) return;
    onBack();
  };

  const handleExcelDownload = async () => {
    setIsExporting(true);
    try {
      const rows = [
        ['순번', '영역', '세부영역', '질문', '현장확인', '개선과제', '이행계획', '이행일정', '완료예정일', '추진현황', '첨부파일', '이행여부'],
        ...visibleTasks.map((task) => {
          const value = values[task.no];
          return [
            task.no,
            task.area,
            task.subArea,
            task.question,
            task.fieldCheck,
            task.improvement,
            value.plan,
            value.schedule,
            value.dueDate,
            value.progress,
            value.fileName,
            value.completed ? '완료' : '미완료',
          ];
        }),
      ];
      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      worksheet['!cols'] = [
        { wch: 7 },
        { wch: 10 },
        { wch: 22 },
        { wch: 56 },
        { wch: 48 },
        { wch: 48 },
        { wch: 42 },
        { wch: 14 },
        { wch: 14 },
        { wch: 36 },
        { wch: 12 },
        { wch: 28 },
      ];
      worksheet['!rows'] = [{ hpt: 24 }, ...visibleTasks.map(() => ({ hpt: 42 }))];
      worksheet['!autofilter'] = { ref: `A1:L${rows.length}` };

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '이행관리');
      const safeTitle = campaign.title.replace(/[\\/:*?"<>|]/g, '_');
      XLSX.writeFile(workbook, `${safeTitle}_이행관리.xlsx`, { compression: true });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="service-page-wide">
      <div className="mb-5 flex items-center gap-3">
        <button type="button" onClick={handleBack} className="flex h-9 items-center gap-1.5 rounded border border-gray-300 bg-white px-3 text-xs font-medium text-gray-600 hover:bg-gray-50">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
            <path d="m14 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          이력 목록
        </button>
        <div className="h-5 w-px bg-gray-300" />
        <div className="min-w-0">
          <div className="text-lg font-bold text-gray-900">이행 관리</div>
          <div className="mt-0.5 truncate text-xs text-gray-500">{campaign.title}</div>
        </div>
      </div>

      <section className="mb-5 overflow-hidden rounded border border-gray-200 bg-white">
        <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-5 py-3">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ef2448] text-[11px] font-bold text-white">i</span>
          <div className="text-sm font-bold text-gray-800">작성 가이드</div>
        </div>
        <div className="px-5 py-4">
          <div className="space-y-1.5 border-b border-gray-100 pb-4 text-xs leading-5 text-gray-600">
            <div>본 개선계획서는 현장진단 ESG 개선과제에 대한 개선이행계획 수립 및 관리를 위해 제공되며, 과제별 이행계획을 수립하여 관리하시기 바랍니다.</div>
            <div>작성된 개선계획은 원청사의 협력사 ESG 관리를 위해 활용될 수 있습니다.</div>
          </div>
          <div className="grid gap-x-8 gap-y-4 pt-4 md:grid-cols-2">
            <GuideItem
              number="1"
              title="이행계획"
              description="개선과제에 대한 실제 개선 적용이 가능한 방향을 입력해주세요."
              example="초과근무 동의를 받기 위한 사내 시스템 구축 예정"
            />
            <GuideItem
              number="2"
              title="이행일정"
              description="완료예정일 선택 시, 이행 일정은 자동 분류됩니다."
              example="단기(6개월 이내) · 중기(1년 이내) · 장기(1년 이후)"
            />
            <GuideItem
              number="3"
              title="완료예정일"
              description="개선 적용이 완료될 것으로 예상되는 날짜를 입력해주세요."
              example="2026-10-31"
            />
            <GuideItem
              number="4"
              title="추진현황"
              description="개선 활동이 진행된 현황을 지속적으로 업데이트해주세요."
              example="26년 4월 ERP 시스템에 초과근무 동의 기능 추가"
            />
          </div>
        </div>
      </section>

      <section className="mb-5 rounded border border-gray-200 bg-white p-5">
        <div className="flex flex-wrap items-center gap-5">
          <div className="min-w-[200px] flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">전체 이행률</span>
              <span className="text-sm font-bold text-[#ef2448]">{completionRate}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-[#ef2448] transition-[width]" style={{ width: `${completionRate}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-6 border-l border-gray-200 pl-6">
            <div>
              <div className="text-[11px] text-gray-400">전체 과제</div>
              <div className="mt-0.5 text-lg font-bold text-gray-800">{tasks.length}<span className="ml-0.5 text-xs font-normal text-gray-500">건</span></div>
            </div>
            <div>
              <div className="text-[11px] text-gray-400">이행 완료</div>
              <div className="mt-0.5 text-lg font-bold text-[#ef2448]">{completedCount}<span className="ml-0.5 text-xs font-normal text-gray-500">건</span></div>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {saved && <span className="text-xs font-medium text-green-700">저장되었습니다.</span>}
          </div>
        </div>
      </section>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold text-gray-500">영역</span>
        {areas.map((area) => (
          <button
            key={area}
            type="button"
            onClick={() => setAreaFilter(area)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              areaFilter === area
                ? 'border-[#ef2448] bg-[#ef2448] text-white'
                : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
            }`}
          >
            {area}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-gray-400">{visibleTasks.length}개 과제</span>
          <button
            type="button"
            onClick={handleExcelDownload}
            disabled={isExporting}
            className="flex h-9 items-center gap-2 rounded border border-gray-300 bg-white px-4 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-wait disabled:opacity-60"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-[#168248]" strokeWidth="1.7">
              <path d="M6 3.5h8l4 4V20H6z" strokeLinejoin="round" />
              <path d="M14 3.5V8h4M9 11l4 5m0-5-4 5" strokeLinecap="round" />
            </svg>
            {isExporting ? '파일 생성 중' : '엑셀 다운로드'}
          </button>
        </div>
      </div>

      <div className="space-y-7">
        {visibleAreas.map((area) => {
          const areaTasks = visibleTasks.filter((task) => task.area === area);
          const areaCompleted = areaTasks.filter((task) => values[task.no].completed).length;
          return (
            <section key={area}>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-4 w-1 rounded-full bg-[#ef2448]" />
                <div className="text-base font-bold text-gray-900">{area}</div>
                <div className="text-xs text-gray-400">{areaCompleted}/{areaTasks.length} 완료</div>
              </div>

              <div className="w-full min-w-0 overflow-hidden rounded border border-gray-200 bg-white">
                <div className="w-full min-w-0">
                  <table className="w-full table-fixed border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <GridHeading className="w-[4%]">NO.</GridHeading>
                        <GridHeading className="w-[17%]">질문</GridHeading>
                        <GridHeading className="w-[12%]">현장확인</GridHeading>
                        <GridHeading className="w-[12%]">개선과제</GridHeading>
                        <GridHeading className="w-[16%]">이행계획</GridHeading>
                        <GridHeading className="w-[11%]">이행일정</GridHeading>
                        <GridHeading className="w-[14%]">추진현황</GridHeading>
                        <GridHeading className="w-[8%]">증빙파일</GridHeading>
                        <GridHeading className="w-[6%] border-r-0">이행여부</GridHeading>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {areaTasks.map((task) => {
                        const value = values[task.no];
                        return (
                          <tr key={task.no} className={`align-top transition-colors hover:bg-gray-50/60 ${value.completed ? 'bg-green-50/30' : 'bg-white'}`}>
                            <GridData className="text-center font-semibold text-gray-400">
                              {String(task.no).padStart(2, '0')}
                            </GridData>
                            <GridData>
                              <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-600">
                                {task.subArea}
                              </span>
                              <div className="mt-2 text-xs font-medium leading-5 text-gray-700">{task.question}</div>
                            </GridData>
                            <GridData>
                              <div className="break-words text-xs leading-5 text-gray-600">{task.fieldCheck || '-'}</div>
                            </GridData>
                            <GridData>
                              <div className="rounded bg-red-50/70 p-2.5 text-xs font-medium leading-5 text-gray-700">{task.improvement}</div>
                            </GridData>
                            <GridData>
                              <textarea
                                value={value.plan}
                                onChange={(event) => updateValue(task.no, 'plan', event.target.value)}
                                aria-label={`${task.no}번 이행계획`}
                                className="min-h-24 w-full resize-y rounded border border-gray-300 bg-white p-2.5 text-xs leading-5 text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#ef2448]"
                                placeholder="이행계획을 입력해주세요."
                              />
                            </GridData>
                            <GridData>
                              <label className="block">
                                <span className="mb-1 block text-[10px] font-medium text-gray-400">이행일정</span>
                                <select
                                  value={value.schedule}
                                  disabled
                                  className="h-9 w-full min-w-0 rounded border border-gray-200 bg-gray-50 px-2 text-[11px] text-gray-600"
                                >
                                  <option value="">자동 분류</option>
                                  <option value="단기">단기</option>
                                  <option value="중기">중기</option>
                                  <option value="장기">장기</option>
                                </select>
                              </label>
                              <label className="mt-2 block">
                                <span className="mb-1 block text-[10px] font-medium text-gray-400">완료예정일</span>
                                <input
                                  type="date"
                                  value={value.dueDate}
                                  onChange={(event) => updateValue(task.no, 'dueDate', event.target.value)}
                                  className="h-9 w-full min-w-0 rounded border border-gray-300 bg-white px-1.5 text-[10px] text-gray-600 outline-none focus:border-[#ef2448]"
                                />
                              </label>
                            </GridData>
                            <GridData>
                              <textarea
                                value={value.progress}
                                onChange={(event) => updateValue(task.no, 'progress', event.target.value)}
                                aria-label={`${task.no}번 추진현황`}
                                className="min-h-24 w-full resize-y rounded border border-gray-300 bg-white p-2.5 text-xs leading-5 text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#ef2448]"
                                placeholder="추진현황을 입력해주세요."
                              />
                            </GridData>
                            <GridData>
                              <input
                                ref={(element) => { fileInputs.current[task.no] = element; }}
                                type="file"
                                className="hidden"
                                onChange={(event) => updateValue(task.no, 'fileName', event.target.files?.[0]?.name ?? '')}
                                aria-label={`${task.no}번 증빙 파일 첨부`}
                              />
                              <button
                                type="button"
                                onClick={() => fileInputs.current[task.no]?.click()}
                                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-[11px] font-medium text-gray-600 hover:bg-gray-50"
                              >
                                파일 선택
                              </button>
                              <div className="mt-2 break-all text-[10px] leading-4 text-gray-400">
                                {value.fileName || '첨부된 파일 없음'}
                              </div>
                            </GridData>
                            <GridData className="border-r-0 text-center">
                              <label className="inline-flex cursor-pointer flex-col items-center gap-2">
                                <input type="checkbox" checked={value.completed} onChange={(event) => updateValue(task.no, 'completed', event.target.checked)} className="h-4 w-4 accent-[#ef2448]" />
                                <span className={`text-[11px] font-semibold ${value.completed ? 'text-green-700' : 'text-gray-400'}`}>{value.completed ? '완료' : '미완료'}</span>
                              </label>
                            </GridData>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <div className="fixed bottom-8 right-8 z-40 flex items-center gap-3 rounded-full border border-gray-200 bg-white p-2 pl-4 shadow-xl">
        {saved && <span className="text-xs font-medium text-green-700">저장되었습니다.</span>}
        <button type="button" onClick={handleSave} className="h-11 rounded-full bg-[#ef2448] px-7 text-sm font-semibold text-white hover:bg-[#dc1f40]">
          저장
        </button>
      </div>
    </div>
  );
}

function classifySchedule(dueDate: string) {
  if (!dueDate) return '';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${dueDate}T00:00:00`);
  const months = (due.getFullYear() - today.getFullYear()) * 12 + due.getMonth() - today.getMonth();
  if (months <= 6) return '단기';
  if (months <= 12) return '중기';
  return '장기';
}

function GridHeading({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <th className={`border-r border-gray-100 px-3 py-3 text-center text-[11px] font-semibold text-gray-500 ${className}`}>{children}</th>;
}

function GridData({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`border-r border-gray-100 px-3 py-4 ${className}`}>{children}</td>;
}

function GuideItem({
  number,
  title,
  description,
  example,
}: {
  number: string;
  title: string;
  description: string;
  example: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-600">{number}</span>
      <div>
        <div className="text-xs font-bold text-gray-700">{title}</div>
        <div className="mt-1 text-xs leading-5 text-gray-500">{description}</div>
        <div className="mt-1 text-[11px] text-gray-400">예시: {example}</div>
      </div>
    </div>
  );
}
