import { useMemo, useState } from 'react';
import type { Question } from './QuestionLibraryBasicSet';
import { normalizeQuestionType } from './QuestionLibraryBasicSet';

export type QuestionManagementCategory = '기본 SET' | '산업특화' | '기타 지표';

interface RevisionRecord {
  no: number;
  id: string;
  revisedTitle: string;
  originalTitle: string;
  type: string;
  attachment: string;
  updated: string;
  version: string;
  campaigns: number;
  folder: string;
  campaignList?: NonNullable<Question['campaignList']>;
  industry?: boolean;
}

interface Props {
  customQuestions: Question[];
  revisionQuestions: Question[];
  onNavigateAdd: () => void;
  onOpenQuestion: (question: Question, editable: boolean, category: QuestionManagementCategory) => void;
}

const campaignExamples = [
  { name: '2026 LG 협력사 ESG 평가', client: 'LG', period: '2026-03 ~ 2026-06', status: '진행중' },
  { name: '2026 삼성 공급망 ESG 평가', client: '삼성', period: '2026-04 ~ 2026-08', status: '진행중' },
  { name: '2026 SK 협력사 ESG 평가', client: 'SK', period: '2026-05 ~ 2026-09', status: '준비중' },
  { name: '2026 한화 공급망 ESG 평가', client: '한화', period: '2026-06 ~ 2026-10', status: '준비중' },
];

const BASIC_REVISIONS: RevisionRecord[] = [
  ['L-3-2-101', '윤리 강령의 적용 범위와 최근 개정 내용을 입력해 주세요.', '귀사는 윤리 강령을 수립하고 있습니까?', '라디오', 'C.윤리 > 윤리 경영'],
  ['M-5-3-086', '이해관계자별 소통 채널과 운영 주기를 선택해 주세요.', '이해관계자 식별 및 소통 방침이 수립되어 있습니까?', '체크박스', 'M.경영 > 이해관계자 소통'],
  ['E-1-1-074', '환경 정책의 승인 주체와 최근 개정일을 입력해 주세요.', '귀사는 공식 환경 정책을 수립하고 있습니까?', '텍스트박스', 'E.환경 > 환경 정책'],
  ['M-1-2-043', '이사회 내 ESG 안건 검토 절차를 선택해 주세요.', '이사회가 구성되어 있습니까?', '라디오', 'M.경영 > 지배구조'],
  ['L-5-4-062', '비정규직 근로자의 처우 개선 실적을 입력해 주세요.', '비정규직 근로자 현황을 정기적으로 관리하고 있습니까?', '정량데이터', 'L.노동 > 비정규직 관리'],
].map((item, index) => ({
  no: 105 - index, id: item[0], revisedTitle: item[1], originalTitle: item[2], type: item[3],
  attachment: index % 2 ? 'N' : 'Y', updated: `26.10.${17 - index}`, version: index < 2 ? 'v3.3' : 'v3.2',
  campaigns: 3 - (index % 2), folder: item[4], campaignList: campaignExamples.slice(0, 3 - (index % 2)),
}));

const INDUSTRY_REVISIONS: RevisionRecord[] = [
  ['E-5-3-041', '제조 공정별 에너지 원단위와 감축 실적을 입력해 주세요.', '사업장별 에너지 사용량을 정기적으로 관리하고 있습니까?', '정량데이터', 'E.환경 > 에너지 관리'],
  ['S-3-2-029', '원자재 채굴 지역의 강제노동 위험 대응 현황을 선택해 주세요.', '강제노동 고위험 협력사를 평가하고 있습니까?', '체크박스', 'S.인권 > 강제노동 금지'],
  ['E-3-3-055', '유통 물류 차량의 탄소배출 감축 계획을 입력해 주세요.', '물류·배송 탄소발자국 관리 여부를 선택해 주세요.', '텍스트박스', 'E.환경 > 온실가스 관리'],
  ['M-2-4-033', '서비스 운영 과정의 전력 사용량과 개선 목표를 입력해 주세요.', '서비스 제공 과정의 에너지 사용량을 관리하고 있습니까?', '정량데이터', 'M.경영 > 공급망 관리'],
].map((item, index) => ({
  no: 204 - index, id: item[0], revisedTitle: item[1], originalTitle: item[2], type: item[3],
  attachment: index < 2 ? 'Y' : 'N', updated: `26.10.${18 - index * 2}`, version: `산업특화 v${2}.${1 - (index % 2)}`,
  campaigns: 4 - index, folder: item[4], campaignList: campaignExamples.slice(0, 4 - index), industry: true,
}));

const customTitles = [
  '여성 이사 비율과 최근 3년간 변화 추이를 입력해 주세요.', '사외이사 선임 및 독립성 검토 절차를 입력해 주세요.',
  '경영방침 실행을 위한 위원회를 운영하고 있습니까?', '환경경영 목표 달성계획 수립 및 실행 내용을 입력해 주세요.',
  '협력사 ESG 교육 지원 실적을 입력해 주세요.', '지역사회 사회공헌 프로그램 운영 현황을 입력해 주세요.',
  '재생에너지 구매 실적과 향후 계획을 입력해 주세요.', '공급망 인권 실사 대상 범위를 입력해 주세요.',
  '윤리 제보 채널의 익명성 보장 여부를 선택해 주세요.', '폐기물 재활용 실적을 유형별로 입력해 주세요.',
  '정보보호 사고 대응훈련을 실시하고 있습니까?', '친환경 제품 매출 비중을 입력해 주세요.',
  '고객 불만의 평균 처리기간을 입력해 주세요.', '임직원 다양성 목표를 수립하고 있습니까?',
  '안전보건 개선 투자 금액을 입력해 주세요.', '협력사 탄소배출량 수집 범위를 입력해 주세요.',
  '이사회 ESG 안건 상정 횟수를 입력해 주세요.', '기후변화 시나리오 분석 결과를 입력해 주세요.',
  '인권 고충처리 결과의 공개 여부를 선택해 주세요.', '수자원 고위험 사업장 관리 현황을 입력해 주세요.',
];

export const CUSTOM_QUESTION_SEED: Question[] = customTitles.map((title, index) => ({
  no: String(5675 - index),
  questionId: `${['L-3-2', 'M-1-1', 'E-1-1', 'S-2-1'][index % 4]}-${Math.floor(index / 4) + 1}`,
  title,
  type: index % 4 === 2 ? '라디오' : index % 4 === 3 ? '정량데이터' : '텍스트박스',
  attachment: index % 3 === 0 ? 'Y' : 'N',
  updated: `26.10.${String(18 - (index % 9)).padStart(2, '0')}`,
  campaigns: (index % 3) + 1,
  campaignList: campaignExamples.slice(0, (index % 3) + 1),
  customerName: ['LG', '삼성', 'SK', '한화'][index % 4],
}));

const titleByCategory: Record<QuestionManagementCategory, string> = {
  '기본 SET': '기본 SET 수정 이력',
  산업특화: '산업특화 수정 이력',
  '기타 지표': '기타 지표 관리',
};

export default function QuestionLibraryMgmt({ customQuestions, revisionQuestions, onNavigateAdd, onOpenQuestion }: Props) {
  const [category, setCategory] = useState<QuestionManagementCategory>('기본 SET');
  const [qType, setQType] = useState('');
  const [keyword, setKeyword] = useState('');
  const [campaignModal, setCampaignModal] = useState<{ title: string; list: NonNullable<Question['campaignList']> } | null>(null);

  const dynamicRevisions: RevisionRecord[] = revisionQuestions
    .filter(question => category === '산업특화' ? (question.industries?.length ?? 0) > 0 : !(question.industries?.length ?? 0))
    .map((question, index) => ({
      no: 300 + revisionQuestions.length - index,
      id: question.questionId ?? '--',
      revisedTitle: question.title,
      originalTitle: question.form?.summary || '수정 전 기본 SET 질의',
      type: normalizeQuestionType(question.type),
      attachment: question.attachment,
      updated: question.updated,
      version: '현재 버전',
      campaigns: question.campaigns,
      folder: question.folderId ?? '',
      campaignList: question.campaignList,
      industry: (question.industries?.length ?? 0) > 0,
    }));
  const seededRevisions = category === '기본 SET' ? BASIC_REVISIONS : INDUSTRY_REVISIONS;
  const revisions = [...dynamicRevisions, ...seededRevisions];
  const filteredRevisions = revisions.filter(record =>
    (!qType || record.type === qType)
    && (!keyword.trim() || `${record.revisedTitle} ${record.originalTitle} ${record.id}`.toLowerCase().includes(keyword.trim().toLowerCase())),
  );

  const allCustom = useMemo(() => [...customQuestions, ...CUSTOM_QUESTION_SEED], [customQuestions]);
  const filteredCustom = allCustom.filter(question =>
    (!qType || normalizeQuestionType(question.type) === qType)
    && (!keyword.trim() || `${question.title} ${question.questionId ?? ''}`.toLowerCase().includes(keyword.trim().toLowerCase())),
  );

  const openCampaigns = (event: React.MouseEvent, title: string, list?: Question['campaignList']) => {
    event.stopPropagation();
    setCampaignModal({ title, list: list ?? [] });
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a3055' }}>질의 관리</h2>
        <label className="flex items-center gap-2 text-sm font-semibold">질의 분류
          <select value={category} onChange={event => { setCategory(event.target.value as QuestionManagementCategory); setQType(''); setKeyword(''); }} className="rounded border bg-white px-3 py-2 text-sm" style={{ borderColor: '#cfd5df', minWidth: 150 }}>
            <option>기본 SET</option><option>산업특화</option><option>기타 지표</option>
          </select>
        </label>
      </div>
      <div className="mb-3 flex items-center gap-3">
        <div className="flex-1" style={{ fontSize: 19, fontWeight: 700 }}>{titleByCategory[category]}</div>
        <select value={qType} onChange={event => setQType(event.target.value)} className="rounded border px-3 text-sm" style={{ borderColor: '#ccc', height: 38 }}>
          <option value="">질의 유형 전체</option><option>라디오</option><option>체크박스</option><option>텍스트박스</option><option>정량데이터</option>
        </select>
        <input value={keyword} onChange={event => setKeyword(event.target.value)} placeholder="질의 제목 또는 ID 검색" className="rounded border px-3 text-sm" style={{ borderColor: '#ccc', height: 38, width: 280 }} />
        <button className="rounded px-4 text-sm font-semibold text-white" style={{ background: '#1a3055', height: 38 }}>검색</button>
        {category === '기타 지표' && <button onClick={onNavigateAdd} className="rounded px-4 text-sm font-semibold text-white" style={{ background: '#e63946', height: 38 }}>+ 질의 추가</button>}
      </div>
      <div className="mb-2 text-sm" style={{ color: '#666' }}>총 <strong style={{ color: '#e63946' }}>{category === '기타 지표' ? filteredCustom.length : filteredRevisions.length}</strong>건</div>

      <div className="overflow-hidden rounded border bg-white" style={{ borderColor: '#e0e0e0' }}>
        {category === '기타 지표' ? (
          <table className="w-full border-collapse text-sm">
            <thead><tr style={{ background: '#f7f8fa', borderBottom: '1px solid #dfe3e8' }}>
              {['NO', '질의 ID', '질의 제목', '질의 유형', '첨부파일', '업데이트', '반영된 캠페인'].map(header => <th key={header} className="px-3 py-3 text-center text-xs font-semibold">{header}</th>)}
            </tr></thead>
            <tbody>{filteredCustom.map((question, index) => (
              <tr key={`${question.no}-${index}`} onClick={() => onOpenQuestion(question, true, '기타 지표')} className="cursor-pointer hover:bg-blue-50" style={{ borderBottom: '1px solid #edf0f3' }}>
                <td className="px-3 py-3 text-center text-xs">{index + 1}</td>
                <td className="px-3 py-3 text-center text-xs font-semibold" style={{ color: '#1a3055' }}><span className="mr-1 rounded px-1.5 py-0.5 text-[10px]" style={{ background: '#fff0f1', color: '#d92f3c' }}>[C]</span>{question.questionId}</td>
                <td className="px-3 py-3 text-xs text-blue-600" title={question.title}>{question.title}</td>
                <td className="px-3 py-3 text-center text-xs">{normalizeQuestionType(question.type)}</td>
                <td className="px-3 py-3 text-center text-xs">{question.attachment}</td>
                <td className="px-3 py-3 text-center text-xs">{question.updated}</td>
                <td className="px-3 py-3 text-center text-xs"><button onClick={event => openCampaigns(event, question.title, question.campaignList)} className="font-bold text-blue-600">{question.campaigns}</button></td>
              </tr>
            ))}</tbody>
          </table>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead><tr style={{ background: '#f7f8fa', borderBottom: '1px solid #dfe3e8' }}>
              {['NO', '질의 ID', '질의 제목', '질의 유형', '첨부파일', '업데이트', '버전', '반영 캠페인', '폴더'].map(header => <th key={header} className="px-3 py-3 text-center text-xs font-semibold">{header}</th>)}
            </tr></thead>
            <tbody>{filteredRevisions.map(record => (
              <RevisionRows
                key={`${record.no}-${record.id}`}
                record={record}
                onOpen={() => onOpenQuestion({ no: String(record.no), questionId: record.id, title: record.revisedTitle, type: record.type, attachment: record.attachment, updated: record.updated, campaigns: record.campaigns, campaignList: record.campaignList }, false, category)}
                onCampaigns={event => openCampaigns(event, record.revisedTitle, record.campaignList)}
              />
            ))}</tbody>
          </table>
        )}
      </div>

      {campaignModal && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.42)' }}>
          <div className="w-[560px] rounded-lg bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between"><div><div className="text-base font-bold">반영된 캠페인</div><div className="mt-1 text-xs" style={{ color: '#777' }}>{campaignModal.title}</div></div><button onClick={() => setCampaignModal(null)} className="text-xl" style={{ color: '#777' }}>×</button></div>
            <div className="overflow-hidden rounded border" style={{ borderColor: '#e0e0e0' }}>
              {campaignModal.list.length ? campaignModal.list.map((campaign, index) => <div key={`${campaign.name}-${index}`} className="flex items-center justify-between border-b px-4 py-3 text-sm last:border-b-0"><span>{campaign.name}</span><span className="text-xs" style={{ color: '#777' }}>{campaign.client} · {campaign.status}</span></div>) : <div className="p-8 text-center text-sm" style={{ color: '#999' }}>반영된 캠페인이 없습니다.</div>}
            </div>
            <div className="mt-4 flex justify-end"><button onClick={() => setCampaignModal(null)} className="rounded border px-5 py-2 text-sm">닫기</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function RevisionRows({ record, onOpen, onCampaigns }: { record: RevisionRecord; onOpen: () => void; onCampaigns: (event: React.MouseEvent) => void }) {
  return (
    <>
      <tr onClick={onOpen} className="cursor-pointer hover:bg-blue-50" style={{ borderTop: '2px solid #dfe4eb' }}>
        <td className="px-3 py-3 text-center text-xs">{record.no}</td>
        <td className="px-3 py-3 text-center text-xs font-semibold" style={{ color: '#1a3055' }}><span className="mr-1 rounded bg-blue-50 px-1 text-[9px]">[B]</span>{record.industry && <span className="mr-1 rounded bg-orange-100 px-1 text-[9px] text-orange-700">[I]</span>}{record.id}</td>
        <td className="px-3 py-3 text-xs font-medium text-blue-600">{record.revisedTitle}</td>
        <td className="px-3 py-3 text-center text-xs">{record.type}</td>
        <td className="px-3 py-3 text-center text-xs">{record.attachment}</td>
        <td className="px-3 py-3 text-center text-xs">{record.updated}</td>
        <td className="px-3 py-3 text-center text-xs font-semibold">{record.version}</td>
        <td className="px-3 py-3 text-center text-xs"><button onClick={onCampaigns} className="font-bold text-blue-600">{record.campaigns}</button></td>
        <td className="px-3 py-3 text-xs">{record.folder}</td>
      </tr>
      <tr onClick={onOpen} className="cursor-pointer" style={{ background: '#f8fafc', borderBottom: '1px solid #e3e7ec' }}>
        <td />
        <td />
        <td className="px-3 py-3 text-xs" style={{ color: '#6f7782' }}><span className="mr-2 rounded px-2 py-0.5 text-[10px] font-semibold" style={{ background: '#e9edf2' }}>기존 질의</span>{record.originalTitle}</td>
        <td className="px-3 py-3 text-center text-xs" style={{ color: '#888' }}>{record.type}</td>
        <td className="px-3 py-3 text-center text-xs" style={{ color: '#888' }}>{record.attachment}</td>
        <td colSpan={4} />
      </tr>
    </>
  );
}
