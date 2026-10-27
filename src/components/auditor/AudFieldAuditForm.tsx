import { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { calculateAuditScores } from './auditResultStore';

type QuestionType = 'checkbox' | 'radio' | 'metrics' | 'text';
type TopFolderKey = 'BASIC' | 'L' | 'S' | 'ENV' | 'ETH' | 'M';
type ActiveFolderKey = TopFolderKey | 'SUMMARY';

type AuditQuestion = {
  id: string;
  folder: string;
  folderLabel: string;
  title: string;
  type: QuestionType;
  options?: string[];
  answer: string | string[];
  files: string[];
};

type SavedValue = {
  answer: string | string[];
  improvement: string;
  reviewed: boolean;
  auditorFiles: string[];
  fieldCheck: string;
};

interface Props {
  companyName: string;
  onBack: () => void;
}

const questions: AuditQuestion[] = [
  { id: 'B-1-1', folder: 'BASIC', folderLabel: '기본정보 / 사업장 일반', title: '귀사의 사업자등록번호와 본사 및 주요 사업장 소재지를 확인하여 주십시오.', type: 'text', answer: '사업자등록번호 123-45-67890 / 본사: 경기도 화성시 산업로 120', files: ['사업자등록증.pdf'] },
  { id: 'B-1-2', folder: 'BASIC', folderLabel: '기본정보 / 임직원 현황', title: '최근 연도 기준 전체 임직원 수와 정규직 인원을 기재하여 주십시오.', type: 'text', answer: '전체 임직원 131명 / 정규직 118명 / 비정규직 13명', files: ['임직원현황_2025.xlsx'] },
  { id: 'L-1-1', folder: 'L01', folderLabel: 'L. 노동 및 인권 / 다양성 인정', title: '귀사의 내부 규정 및 정책에 차별을 금지하는 내용을 포함하고 있다면 모두 체크하여 주시기 바랍니다.', type: 'checkbox', options: ['모집/채용', '임금', '복리후생', '교육, 배치 및 승진', '정년, 퇴직 및 해고', '차별 금지 내용 없음'], answer: ['복리후생', '교육, 배치 및 승진', '정년, 퇴직 및 해고'], files: ['남여차별(승진).png', '남여차별(퇴직,해고,정년).png', '남녀차별(복리후생,육아휴직).png'] },
  { id: 'L-1-2', folder: 'L01', folderLabel: 'L. 노동 및 인권 / 다양성 인정', title: '귀사는 노동조합 및 노사협의체(또는 이에 준하는 협의체)를 운영하고 있습니까?', type: 'radio', options: ['예', '아니오', '해당없음(30인 미만 사업장)'], answer: '예', files: ['노사협의회_위촉품의(24,25).pdf'] },
  { id: 'L-1-3', folder: 'L01', folderLabel: 'L. 노동 및 인권 / 다양성 인정', title: '귀사는 임직원을 대상으로 인권 관련 교육을 정기적으로 실시하고 있습니까?', type: 'radio', options: ['예', '아니오'], answer: '예', files: ['2026년_인권교육_결과.pdf'] },
  { id: 'L-2-1', folder: 'L02', folderLabel: 'L. 노동 및 인권 / 근로시간', title: '귀사는 법정 근로시간과 휴게시간을 준수하고 관련 기록을 관리하고 있습니까?', type: 'checkbox', options: ['근태 시스템 운영', '연장근로 사전 승인', '휴게시간 보장', '주 52시간 모니터링', '해당 내용 없음'], answer: ['근태 시스템 운영', '휴게시간 보장', '주 52시간 모니터링'], files: ['근태관리시스템_화면.pdf'] },
  { id: 'L-2-2', folder: 'L02', folderLabel: 'L. 노동 및 인권 / 근로시간', title: '최근 1년간 근로시간 위반으로 인한 행정처분 또는 시정명령이 있었습니까?', type: 'radio', options: ['없음', '있음'], answer: '없음', files: [] },
  { id: 'S-1-1', folder: 'S01', folderLabel: 'S. 안전 및 보건 / 안전경영', title: '귀사는 안전보건 관리 규정 및 비상대응 매뉴얼을 보유하고 있습니까?', type: 'checkbox', options: ['안전보건 관리 규정', '비상대응 매뉴얼', '사고 보고 절차', '정기 개정 이력', '보유 내용 없음'], answer: ['안전보건 관리 규정', '비상대응 매뉴얼', '사고 보고 절차'], files: ['안전보건관리규정.pdf', '비상대응매뉴얼.pdf'] },
  { id: 'S-1-2', folder: 'S01', folderLabel: 'S. 안전 및 보건 / 안전경영', title: '귀사의 직접고용 인원에 대한 산업재해도수율(LTIFR)을 기재하여 주십시오.', type: 'metrics', answer: ['11.9', '5.9', '5.9'], files: ['산업재해_발생현황(23~25년).png'] },
  { id: 'S-1-3', folder: 'S01', folderLabel: 'S. 안전 및 보건 / 안전경영', title: '정기적인 위험성 평가를 실시하고 개선조치를 추적하고 있습니까?', type: 'radio', options: ['예', '아니오'], answer: '예', files: ['2026년_위험성평가.pdf'] },
  { id: 'E-1-1', folder: 'E01', folderLabel: 'E. 환경 / 환경경영 일반', title: '귀사는 문서화된 환경정책과 정량적인 환경 목표를 보유하고 있습니까?', type: 'radio', options: ['예', '아니오'], answer: '예', files: ['환경방침_2026.pdf'] },
  { id: 'E-1-2', folder: 'E01', folderLabel: 'E. 환경 / 환경경영 일반', title: '귀사가 관리하고 있는 주요 환경성과 지표를 작성하여 주십시오.', type: 'text', answer: '에너지 사용량, 온실가스 배출량, 용수 사용량, 폐기물 재활용률을 월별 관리하고 있습니다.', files: ['환경성과_KPI.xlsx'] },
  { id: 'G-1-1', folder: 'G01', folderLabel: 'G. 윤리 및 경영시스템 / 윤리경영', title: '귀사는 윤리규범과 익명 신고채널을 운영하고 있습니까?', type: 'checkbox', options: ['윤리규범 보유', '임직원 정기교육', '익명 신고채널', '신고자 보호 규정', '해당 내용 없음'], answer: ['윤리규범 보유', '임직원 정기교육', '익명 신고채널'], files: ['윤리규범.pdf'] },
  { id: 'G-1-2', folder: 'G01', folderLabel: 'G. 윤리 및 경영시스템 / 윤리경영', title: '최근 3년간 부패 또는 윤리규범 위반으로 확정된 사건이 있었습니까?', type: 'radio', options: ['없음', '있음'], answer: '없음', files: [] },
  { id: 'M-1-1', folder: 'M01', folderLabel: 'M. 경영 / ESG 관리체계', title: '귀사는 ESG 목표와 성과를 정기적으로 검토하는 경영진 보고체계를 운영하고 있습니까?', type: 'radio', options: ['예', '아니오'], answer: '예', files: ['ESG경영회의_운영규정.pdf'] },
  { id: 'M-1-2', folder: 'M01', folderLabel: 'M. 경영 / ESG 관리체계', title: 'ESG 영역별 담당부서와 책임자를 지정하고 역할을 문서화하고 있습니까?', type: 'checkbox', options: ['담당부서 지정', '책임자 지정', '업무분장 문서화', '성과평가 반영', '해당 내용 없음'], answer: ['담당부서 지정', '책임자 지정', '업무분장 문서화'], files: ['ESG_업무분장표.pdf'] },
  { id: 'M-2-1', folder: 'M02', folderLabel: 'M. 경영 / 공급망 관리', title: '귀사는 주요 협력사의 ESG 리스크를 정기적으로 평가하고 개선을 지원하고 있습니까?', type: 'radio', options: ['예', '아니오'], answer: '아니오', files: [] },
];

const defaultTopFolders: Array<{ key: TopFolderKey; label: string }> = [
  { key: 'BASIC', label: '기본정보' },
  { key: 'L', label: 'L. 노동' },
  { key: 'S', label: 'S. 인권' },
  { key: 'ENV', label: 'E. 환경' },
  { key: 'ETH', label: 'E. 윤리' },
  { key: 'M', label: 'M. 경영' },
];

function getCampaignTopFolders(companyName: string) {
  if (companyName === '대상산업' || companyName === '세영테크') {
    return defaultTopFolders.map((folder) => folder.key === 'ENV' ? { ...folder, label: 'E. 기후환경' } : folder);
  }
  return defaultTopFolders;
}

function getTopFolderKey(question: AuditQuestion): TopFolderKey {
  if (question.folder === 'BASIC') return 'BASIC';
  if (question.folder.startsWith('L')) return 'L';
  if (question.folder.startsWith('S')) return 'S';
  if (question.folder.startsWith('E')) return 'ENV';
  if (question.folder.startsWith('G')) return 'ETH';
  return 'M';
}

function getSubFolderName(question: AuditQuestion) {
  return question.folderLabel.split('/').at(-1)?.trim() ?? question.folderLabel;
}

function createInitialValues(companyName: string): Record<string, SavedValue> {
  let persisted: Record<string, SavedValue> = {};
  try {
    persisted = JSON.parse(localStorage.getItem(`aud-final-answers-${companyName}`) ?? '{}');
  } catch {
    persisted = {};
  }
  return Object.fromEntries(questions.map((question) => [
    question.id,
    persisted[question.id]
      ? { ...persisted[question.id], reviewed: !!persisted[question.id].reviewed, auditorFiles: persisted[question.id].auditorFiles ?? [], fieldCheck: persisted[question.id].fieldCheck ?? '' }
      : { answer: question.answer, improvement: '', reviewed: false, auditorFiles: [], fieldCheck: '' },
  ]));
}

function AnswerPreview({ question, answer }: { question: AuditQuestion; answer: string | string[] }) {
  if (question.type === 'checkbox') {
    const selected = Array.isArray(answer) ? answer : [];
    return (
      <div className="mt-3 space-y-1.5">
        {question.options?.map((option) => (
          <div key={option} className="flex items-center gap-2 text-xs text-gray-600">
            <span className={`flex h-3.5 w-3.5 items-center justify-center border ${selected.includes(option) ? 'border-service-primary bg-service-primary text-white' : 'border-gray-300 bg-white'}`}>{selected.includes(option) ? '✓' : ''}</span>
            {option}
          </div>
        ))}
      </div>
    );
  }
  if (question.type === 'radio') {
    return (
      <div className="mt-3 space-y-1.5">
        {question.options?.map((option) => (
          <div key={option} className="flex items-center gap-2 text-xs text-gray-600">
            <span className={`h-3.5 w-3.5 rounded-full border-4 ${answer === option ? 'border-service-primary bg-white' : 'border-gray-300 bg-white'}`} />
            {option}
          </div>
        ))}
      </div>
    );
  }
  if (question.type === 'metrics') {
    const metrics = Array.isArray(answer) ? answer : [];
    return <div className="mt-3 grid grid-cols-3 gap-2">{metrics.map((value, index) => <div key={index} className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-800">{value}</div>)}</div>;
  }
  return <div className="mt-3 rounded-md bg-white p-3 text-xs leading-5 text-gray-600">{answer}</div>;
}

function AnswerEditor({ question, answer, onChange }: { question: AuditQuestion; answer: string | string[]; onChange: (answer: string | string[]) => void }) {
  if (question.type === 'checkbox') {
    const selected = Array.isArray(answer) ? answer : [];
    return (
      <div className="space-y-2">
        {question.options?.map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
            <input type="checkbox" checked={selected.includes(option)} onChange={() => onChange(selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option])} className="h-4 w-4 accent-service-primary" />
            {option}
          </label>
        ))}
      </div>
    );
  }
  if (question.type === 'radio') {
    return (
      <div className="space-y-2">
        {question.options?.map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
            <input type="radio" name={question.id} checked={answer === option} onChange={() => onChange(option)} className="h-4 w-4 accent-service-primary" />
            {option}
          </label>
        ))}
      </div>
    );
  }
  if (question.type === 'metrics') {
    const metrics = Array.isArray(answer) ? answer : ['', '', ''];
    return (
      <div>
        <div className="mb-2 grid grid-cols-3 gap-3 text-center text-xs font-semibold text-gray-500"><span>2023년</span><span>2024년</span><span>2025년</span></div>
        <div className="grid grid-cols-3 gap-3">
          {metrics.map((value, index) => <input key={index} value={value} onChange={(event) => onChange(metrics.map((item, metricIndex) => metricIndex === index ? event.target.value : item))} className="service-control w-full text-right font-bold" />)}
        </div>
        <div className="mt-2 text-right text-xs text-gray-400">백만근로시간당 건수</div>
      </div>
    );
  }
  return <textarea value={typeof answer === 'string' ? answer : ''} onChange={(event) => onChange(event.target.value)} className="min-h-36 w-full resize-y rounded-md border border-gray-300 p-3 text-sm leading-6 text-gray-700 outline-none focus:border-service-primary" />;
}

export default function AudFieldAuditForm({ companyName, onBack }: Props) {
  const topFolders = getCampaignTopFolders(companyName);
  const [values, setValues] = useState<Record<string, SavedValue>>(() => createInitialValues(companyName));
  const [activeFolder, setActiveFolder] = useState<ActiveFolderKey>('BASIC');
  const initialQuestion = questions.find((question) => getTopFolderKey(question) === 'BASIC') ?? questions[0];
  const [selectedId, setSelectedId] = useState(initialQuestion.id);
  const [draftAnswer, setDraftAnswer] = useState<string | string[]>(values[initialQuestion.id].answer);
  const [draftImprovement, setDraftImprovement] = useState(values[initialQuestion.id].improvement);
  const [draftFieldCheck, setDraftFieldCheck] = useState(values[initialQuestion.id].fieldCheck);
  const [savedMessage, setSavedMessage] = useState('');
  const [areaOpinions, setAreaOpinions] = useState<Record<TopFolderKey, string>>(() => {
    try {
      return { BASIC: '', L: '', S: '', ENV: '', ETH: '', M: '', ...JSON.parse(localStorage.getItem(`aud-area-opinions-${companyName}`) ?? '{}') };
    } catch {
      return { BASIC: '', L: '', S: '', ENV: '', ETH: '', M: '' };
    }
  });
  const [overallOpinion, setOverallOpinion] = useState(() => localStorage.getItem(`aud-overall-opinion-${companyName}`) ?? '');

  const selectedQuestion = questions.find((question) => question.id === selectedId) ?? initialQuestion;
  const visibleQuestions = useMemo(() => activeFolder === 'SUMMARY' ? [] : questions.filter((question) => getTopFolderKey(question) === activeFolder), [activeFolder]);
  const visibleSubFolders = useMemo(() => Array.from(new Set(visibleQuestions.map(getSubFolderName))), [visibleQuestions]);
  const completedCount = Object.values(values).filter((value) => value.reviewed).length;

  const selectQuestion = (question: AuditQuestion) => {
    setSelectedId(question.id);
    setDraftAnswer(values[question.id].answer);
    setDraftImprovement(values[question.id].improvement);
    setDraftFieldCheck(values[question.id].fieldCheck);
    setSavedMessage('');
  };

  const selectFolder = (folder: TopFolderKey) => {
    setActiveFolder(folder);
    const firstQuestion = questions.find((question) => getTopFolderKey(question) === folder);
    if (firstQuestion) selectQuestion(firstQuestion);
  };

  const saveQuestion = () => {
    const nextValues = { ...values, [selectedQuestion.id]: { ...values[selectedQuestion.id], answer: draftAnswer, improvement: draftImprovement, fieldCheck: draftFieldCheck, reviewed: true } };
    setValues(nextValues);
    localStorage.setItem(`aud-final-answers-${companyName}`, JSON.stringify(nextValues));
    setSavedMessage('수정 답변과 개선과제가 최종 답변으로 저장되었습니다.');
  };

  const updateAreaOpinion = (folder: TopFolderKey, value: string) => {
    const next = { ...areaOpinions, [folder]: value };
    setAreaOpinions(next);
    localStorage.setItem(`aud-area-opinions-${companyName}`, JSON.stringify(next));
  };

  const saveOverallOpinion = () => {
    localStorage.setItem(`aud-overall-opinion-${companyName}`, overallOpinion);
    setSavedMessage('영역별 의견과 종합 의견이 저장되었습니다.');
  };

  const completeAudit = () => {
    const scores = calculateAuditScores(values);
    localStorage.setItem(`aud-final-result-${companyName}`, JSON.stringify({ completedAt: new Date().toISOString(), scores, answers: values, areaOpinions, overallOpinion }));
    setSavedMessage(`실사가 완료되었습니다. 최종 실사 결과 ${scores.total}점이 별도 저장되었습니다.`);
  };

  const addAuditorFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const nextValues = {
      ...values,
      [selectedQuestion.id]: {
        ...values[selectedQuestion.id],
        auditorFiles: [...values[selectedQuestion.id].auditorFiles, ...Array.from(files).map(file => file.name)],
      },
    };
    setValues(nextValues);
    localStorage.setItem(`aud-final-answers-${companyName}`, JSON.stringify(nextValues));
  };

  const downloadAuditResult = () => {
    const rows = questions.map(question => ({ 문항ID: question.id, 문항: question.title, 최종답변: Array.isArray(values[question.id].answer) ? values[question.id].answer.join(', ') : values[question.id].answer, 현장점검내용: values[question.id].fieldCheck, 개선과제: values[question.id].improvement, 영역별의견: areaOpinions[getTopFolderKey(question)], 종합의견: overallOpinion, 검토완료: values[question.id].reviewed ? 'Y' : 'N' }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), '현장실사 결과');
    XLSX.writeFile(workbook, `${companyName}_현장실사_최종결과.xlsx`);
  };

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-service-page">
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-6 py-4">
        <button type="button" onClick={onBack} className="flex h-9 items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-600 hover:border-service-primary hover:text-service-primary">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8"><path d="m14 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          실사 관리
        </button>
        <div className="h-5 w-px bg-gray-300" />
        <div><div className="text-lg font-bold text-gray-900">실사평가 — {companyName}</div><div className="mt-0.5 text-xs text-gray-500">2026 공급망 ESG 정기평가 · 협력사 최종 답변 검토 및 수정</div></div>
        <div className="ml-auto flex items-center gap-3"><button type="button" onClick={downloadAuditResult} className="rounded-lg bg-[#167d8d] px-4 py-2.5 text-xs font-bold text-white">최종 결과 DATA 다운로드</button><button type="button" onClick={completeAudit} className="rounded-lg bg-[#1a3055] px-4 py-2.5 text-xs font-bold text-white">실사 완료</button><div className="text-right"><div className="text-xs font-semibold text-gray-500">검토 진행률</div><div className="mt-1 text-sm font-black text-service-primary">{completedCount}/{questions.length}</div></div></div>
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(30rem,1.05fr)_minmax(28rem,0.95fr)]">
        <section className="min-h-0 overflow-y-auto border-r border-gray-200 p-5">
          <div className="mb-5 grid grid-cols-2 gap-2 xl:grid-cols-3">
            {topFolders.map((folder) => <button type="button" key={folder.key} onClick={() => selectFolder(folder.key)} className={`min-h-11 rounded-full border px-4 py-2 text-sm font-semibold ${activeFolder === folder.key ? 'border-service-primary bg-service-primary text-white' : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'}`}>{folder.label}</button>)}
            <button type="button" onClick={() => { setActiveFolder('SUMMARY'); setSavedMessage(''); }} className={`min-h-11 rounded-full border px-4 py-2 text-sm font-semibold ${activeFolder === 'SUMMARY' ? 'border-service-primary bg-service-primary text-white' : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'}`}>종합 의견</button>
          </div>
          {activeFolder === 'SUMMARY' ? <div className="space-y-3">{topFolders.map(folder => <div key={folder.key} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"><div className="text-xs font-bold text-gray-500">{folder.label} 영역별 의견</div><div className={`mt-2 min-h-14 whitespace-pre-wrap rounded-md p-3 text-sm leading-6 ${areaOpinions[folder.key] ? 'bg-gray-50 text-gray-700' : 'bg-gray-50 text-center text-gray-400'}`}>{areaOpinions[folder.key] || '작성된 영역별 의견이 없습니다.'}</div></div>)}</div> : <div className="space-y-7">
            {visibleSubFolders.map((subFolder) => (
              <div key={subFolder}>
                <div className="mb-3 flex items-center gap-2"><div className="h-4 w-1 rounded-full bg-service-primary" /><div className="text-base font-black text-gray-900">{subFolder}</div></div>
                <div className="space-y-3">
                  {visibleQuestions.filter((question) => getSubFolderName(question) === subFolder).map((question) => {
                    const selected = selectedId === question.id;
                    const value = values[question.id];
                    return (
                      <button type="button" key={question.id} onClick={() => selectQuestion(question)} className={`block w-full rounded-xl border p-5 text-left shadow-sm transition-all ${selected ? 'border-service-primary bg-red-50/30 ring-1 ring-service-primary' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                        <div className="flex items-start gap-3">
                          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${selected ? 'bg-service-primary text-white' : 'bg-gray-100 text-gray-500'}`}>{visibleQuestions.indexOf(question) + 1}</span>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold leading-6 text-gray-900">{question.title}</div>
                            <AnswerPreview question={question} answer={value.answer} />
                            {question.files.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{question.files.map((file) => <span key={file} className="rounded bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700">{file}</span>)}</div>}
                            {value.improvement && <div className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">개선과제: {value.improvement}</div>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><div className="mb-3 text-sm font-black text-gray-900">영역별 의견</div><textarea value={areaOpinions[activeFolder]} onChange={event => updateAreaOpinion(activeFolder, event.target.value)} placeholder="영역별 의견을 적어주세요" className="min-h-36 w-full resize-y rounded-lg border border-gray-300 p-4 text-center text-sm leading-6 outline-none placeholder:text-center placeholder:text-gray-400 focus:border-service-primary" /></div>
          </div>
          }
        </section>

        <section className="min-h-0 overflow-y-auto bg-white p-6">
          <div className="mx-auto max-w-3xl">
            {activeFolder === 'SUMMARY' ? <div><div className="text-lg font-black text-gray-900">종합 의견</div><div className="mt-2 text-xs text-gray-500">각 영역에서 작성한 의견을 검토한 후 현장실사 종합 의견을 작성합니다.</div><textarea value={overallOpinion} onChange={event => setOverallOpinion(event.target.value)} placeholder="현장실사 종합 의견을 작성해 주세요." className="mt-6 min-h-80 w-full resize-y rounded-xl border border-gray-300 p-5 text-sm leading-7 outline-none focus:border-service-primary" /><div className="mt-6 flex items-center justify-end gap-4 border-t border-gray-100 pt-5">{savedMessage && <span className="text-xs font-semibold text-emerald-700">{savedMessage}</span>}<button type="button" onClick={saveOverallOpinion} className="rounded-md bg-service-primary px-6 py-3 text-sm font-bold text-white">종합 의견 저장</button></div></div> : <>
            <div className="flex items-center gap-2"><span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">{selectedQuestion.id}</span><span className="text-xs font-semibold text-gray-400">{topFolders.find((folder) => folder.key === getTopFolderKey(selectedQuestion))?.label} / {getSubFolderName(selectedQuestion)}</span></div>
            <div className="mt-4 text-lg font-black leading-8 text-gray-900">{selectedQuestion.title}</div>
            <div className="mt-6"><div className="mb-3 text-sm font-bold text-gray-800">최종 답변 수정</div><AnswerEditor question={selectedQuestion} answer={draftAnswer} onChange={setDraftAnswer} /></div>
            <div className="mt-6"><div className="mb-2 flex items-center justify-between"><div><span className="text-sm font-bold text-gray-800">제출 증빙자료</span><span className="ml-2 text-xs text-gray-400">협력사 제출본과 실사자 추가 자료를 함께 확인합니다.</span></div><label className="cursor-pointer rounded-md bg-[#1a3055] px-3 py-2 text-xs font-bold text-white">+ 실사 증빙자료 업로드<input type="file" multiple className="hidden" onChange={event => { addAuditorFiles(event.target.files); event.target.value = ''; }} /></label></div><div className="flex flex-wrap gap-2">{selectedQuestion.files.map((file) => <button type="button" key={file} className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-blue-700 hover:bg-gray-50">{file}<span className="text-[9px] text-gray-400">협력사</span></button>)}{values[selectedQuestion.id].auditorFiles.map(file => <span key={file} className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">{file}<span className="text-[9px]">실사자</span></span>)}</div>{selectedQuestion.files.length === 0 && values[selectedQuestion.id].auditorFiles.length === 0 && <div className="rounded-md border border-dashed border-gray-300 py-5 text-center text-xs text-gray-400">등록된 증빙자료가 없습니다.</div>}</div>
            <div className="mt-7 border-t border-gray-100 pt-6">
              <label className="mb-6 block"><span className="text-sm font-bold text-gray-800">현장 점검 내용</span><span className="ml-2 text-xs text-gray-400">현장에서 확인한 사실과 점검 결과를 작성합니다.</span><textarea value={draftFieldCheck} onChange={(event) => setDraftFieldCheck(event.target.value)} placeholder="현장 점검 내용을 입력해주세요." className="mt-3 min-h-28 w-full resize-y rounded-md border border-gray-300 p-3 text-sm leading-6 text-gray-700 outline-none placeholder:text-gray-400 focus:border-service-primary" /></label>
              <label className="block"><span className="text-sm font-bold text-gray-800">개선과제</span><span className="ml-2 text-xs text-gray-400">현장 확인 결과 필요한 개선사항을 작성합니다.</span><textarea value={draftImprovement} onChange={(event) => setDraftImprovement(event.target.value)} placeholder="개선이 필요한 내용과 권고 조치를 입력해주세요." className="mt-3 min-h-36 w-full resize-y rounded-md border border-gray-300 p-3 text-sm leading-6 text-gray-700 outline-none placeholder:text-gray-400 focus:border-service-primary" /></label>
            </div>
            <div className="mt-6 flex items-center justify-end gap-4 border-t border-gray-100 pt-5">
              {savedMessage && <span className="text-xs font-semibold text-emerald-700">{savedMessage}</span>}
              <button type="button" onClick={saveQuestion} className="rounded-md bg-service-primary px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-service-primary-hover">답변 및 개선과제 저장</button>
            </div>
            </>}
          </div>
        </section>
      </div>
    </main>
  );
}
