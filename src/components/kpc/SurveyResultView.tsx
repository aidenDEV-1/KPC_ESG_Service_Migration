import { useState } from 'react';

interface Props {
  onClose: () => void;
  initialTab?: ResultTab;
}

type ResultTab = '설문결과보기' | '실사결과보기';

/* ─── Survey data ─── */
interface Question {
  id: string;
  text: string;
  type: 'radio' | 'checkbox' | 'textarea' | 'text';
  options?: string[];
  checkedOptions?: number[];
  selectedIndex?: number;
  answerText?: string;
  score?: number[];      // per-option score for 실사
  fieldNote?: string;
}

interface SubSection {
  title: string;
  questions: Question[];
}

interface Section {
  title: string;
  subs: SubSection[];
}

const SECTIONS: Section[] = [
  {
    title: '기본정보',
    subs: [
      {
        title: '1. 일반',
        questions: [
          { id: 'D1', text: '1. 귀사는 연소근로자(18세 미만)를 고용하고 있습니까?', type: 'radio', options: ['예', '아니오'], selectedIndex: 1 },
        ],
      },
    ],
  },
  {
    title: '설문정보 - 1. 인권',
    subs: [
      {
        title: '1. 인권경영체계',
        questions: [
          {
            id: 'L1-1', text: '1. 귀사는 임직원의 인권 증진 및 인권침해 구제를 목적으로 하는 인권헌장을 보유하고 있습니까?',
            type: 'radio', options: ['예', '아니오'], selectedIndex: 0,
            score: [1.80, 0.00],
          },
          {
            id: 'L1-2', text: '2. 귀사가 임직원을 대상으로 수행하고 있는 인권관련 교육을 체크하여 주십시오.',
            type: 'checkbox',
            options: ['법정 교육(성희롱 및 장애인 인식개선 교육 등)', '인권 일반 교육(차별, 검사의 자유, 아동/강제노동 등)', '임직원 복리후생(근로시간, 임금, 복리후생 등)', '없음'],
            checkedOptions: [0, 1],
            score: [1.80, 1.80, 1.80, 0.00],
          },
        ],
      },
      {
        title: '2. 자발적 근로',
        questions: [
          {
            id: 'L2-1', text: '1. 귀사는 모든 고용 형태의 임직원(정규직, 비정규직, 인턴 포함)과 근로계약을 체결하였으며, 문서로된 근로계약서를 교부하였습니까?',
            type: 'radio', options: ['예', '아니오'], selectedIndex: 0,
            score: [1.80, 0.00],
          },
          {
            id: 'L2-2', text: '2. 인국의 근로자를 사용하는 경우, 근로자의 모국어 혹은 이해가능한 언어로 근로계약서를 작성 및 교부하고 인식 시켜 (고용서가 외근로자에게도 적용)',
            type: 'radio', options: ['예', '아니오', '해당없음'], selectedIndex: 0,
            score: [1.80, 0.00, 1.80],
          },
          {
            id: 'L2-3', text: '3. 귀사는 임직원의 퇴직, 사직, 해고, 파견 종료 등 고용관계 종료에 대해 관련법(근로기준법 등)에 따른 절차를 준수하고 있습니까?',
            type: 'radio', options: ['예', '아니오'], selectedIndex: 0,
            score: [1.80, 0.00],
          },
        ],
      },
      {
        title: '3. 아동노동 및 연소근로',
        questions: [
          {
            id: 'L3-1', text: '1. 귀사는 근로기준법상 연소자 취업금지 직종에 연소근로자를 고용하지 않고, 18세 미만 취업자에 대한 증빙서류 확인 및 관리를 수행하고 있습니까?',
            type: 'radio', options: ['예', '아니오', '해당없음'], selectedIndex: 2,
            score: [1.80, 0.00, 1.80],
          },
        ],
      },
      {
        title: '4. 근로시간',
        questions: [
          {
            id: 'L4-1', text: '1. 귀사는 관련 법규에 따라 근로시간과 초과 근무 수당을 지급하고 있습니까?',
            type: 'radio', options: ['예', '아니오'], selectedIndex: 0,
            score: [1.80, 0.00],
          },
          {
            id: 'L4-2', text: '2. 귀사는 연간 최대 근로 가능 시간 내에서 운영하고 있습니까?',
            type: 'radio', options: ['예', '아니오'], selectedIndex: 0,
            score: [1.80, 0.00],
          },
        ],
      },
    ],
  },
  {
    title: '설문정보 - 2. 안전',
    subs: [
      {
        title: '1. OHS 체계 및 교육',
        questions: [
          {
            id: 'S1-1', text: '1. 귀사는 직원들의 안전·보건에 관한 정책/규정을 보유하고 있으며, 전 직원을 대상으로 교육하고 있습니까?',
            type: 'radio', options: ['예', '아니오'], selectedIndex: 0,
            score: [1.80, 0.00],
          },
          {
            id: 'S1-2', text: '2. 귀사가 임직원을 대상으로 수행하고 있는 안전·보건 교육을 체크하여 주십시오.',
            type: 'checkbox',
            options: ['법정안전보건교육(관리감독자 교육 등)', '화학물질 취급 및 관리 교육', '직무 스트레스 예방 및 관리 교육', '작업환경 관련 교육', '없음'],
            checkedOptions: [0, 1, 3],
            score: [1.80, 1.80, 1.80, 1.80, 0.00],
          },
        ],
      },
      {
        title: '2. 산업안전',
        questions: [
          {
            id: 'S2-1', text: '1. 귀사는 중대 재해처벌법에 따른 안전보건관리체계를 갖추었습니까?',
            type: 'radio', options: ['예', '아니오'], selectedIndex: 0,
            score: [1.80, 0.00],
          },
        ],
      },
    ],
  },
  {
    title: '설문정보 - 3. 환경',
    subs: [
      {
        title: '1. 환경 일반',
        questions: [
          {
            id: 'E1-1', text: '1. 귀사는 환경에 관한 정책 및 실행 프로그램을 보유하고 있습니까?',
            type: 'radio', options: ['예', '아니오'], selectedIndex: 0,
            score: [1.80, 0.00],
          },
          {
            id: 'E1-2', text: '2. 귀사가 이행하고 있는 환경 활동을 체크하여 주십시오.',
            type: 'checkbox',
            options: ['ISO 14001 등 환경경영시스템 인증 취득', '환경 목표 수립 및 성과 모니터링', '환경 법규 준수 체계 운영', '없음'],
            checkedOptions: [1, 2],
            score: [1.80, 1.80, 1.80, 0.00],
          },
        ],
      },
    ],
  },
  {
    title: '설문정보 - 4. 윤리',
    subs: [
      {
        title: '1. 윤리 일반',
        questions: [
          {
            id: 'C1-1', text: '1. 귀사는 반부패·윤리경영에 관한 정책/규정을 보유하고 있습니까?',
            type: 'radio', options: ['예', '아니오'], selectedIndex: 0,
            score: [1.80, 0.00],
          },
        ],
      },
      {
        title: '2. 반부패',
        questions: [
          {
            id: 'C2-1', text: '1. 귀사는 임직원을 대상으로 반부패·윤리 교육을 정기적으로 실시하고 있습니까?',
            type: 'radio', options: ['예', '아니오'], selectedIndex: 0,
            score: [1.80, 0.00],
          },
        ],
      },
    ],
  },
  {
    title: '설문정보 - 5. 경영시스템',
    subs: [
      {
        title: '1. 경영진 참여',
        questions: [
          {
            id: 'M1-1', text: '1. 귀사의 경영진(CEO 또는 C-레벨 임원)은 ESG/CSR 경영 추진에 적극적으로 참여하고 있습니까?',
            type: 'radio', options: ['예', '아니오'], selectedIndex: 0,
            score: [1.80, 0.00],
          },
        ],
      },
    ],
  },
];

/* ─── Section header component ─── */
function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{
      background: '#f5f5f5',
      borderTop: '1px solid #e0e0e0',
      borderBottom: '1px solid #e0e0e0',
      padding: '8px 20px',
      fontSize: 13,
      fontWeight: 700,
      color: '#333',
      marginTop: 16,
    }}>
      {title}
    </div>
  );
}

function SubSectionHeader({ title }: { title: string }) {
  return (
    <div style={{ padding: '10px 20px 4px', fontSize: 13, fontWeight: 600, color: '#222' }}>
      {title}
    </div>
  );
}

/* ─── 설문결과 question block ─── */
function SurveyQuestionBlock({ q }: { q: Question }) {
  return (
    <div style={{
      margin: '8px 20px',
      background: '#f8f8f8',
      border: '1px solid #eee',
      borderRadius: 3,
      padding: '12px 16px',
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#333', marginBottom: 10 }}>{q.text}</div>
      {q.type === 'radio' && q.options && (
        <div className="flex flex-col gap-2">
          {q.options.map((opt, i) => (
            <label key={i} className="flex items-center gap-2" style={{ fontSize: 12, color: '#333', cursor: 'default' }}>
              <span style={{
                display: 'inline-block', width: 14, height: 14, borderRadius: '50%',
                border: `2px solid ${i === q.selectedIndex ? '#e63946' : '#bbb'}`,
                background: i === q.selectedIndex ? '#e63946' : 'transparent',
                flexShrink: 0,
              }} />
              {opt}
            </label>
          ))}
        </div>
      )}
      {q.type === 'checkbox' && q.options && (
        <div className="flex flex-col gap-2">
          {q.options.map((opt, i) => (
            <label key={i} className="flex items-center gap-2" style={{ fontSize: 12, color: '#333', cursor: 'default' }}>
              <span style={{
                display: 'inline-block', width: 13, height: 13,
                border: `2px solid ${q.checkedOptions?.includes(i) ? '#e63946' : '#bbb'}`,
                background: q.checkedOptions?.includes(i) ? '#e63946' : 'transparent',
                borderRadius: 2,
                flexShrink: 0,
              }} />
              {opt}
            </label>
          ))}
        </div>
      )}
      {(q.type === 'textarea' || q.type === 'text') && (
        <div style={{ fontSize: 12, color: '#555', paddingLeft: 4 }}>
          {q.answerText || '(응답 없음)'}
        </div>
      )}
    </div>
  );
}

/* ─── 실사결과 question row: left question + right audit panel ─── */
function AuditQuestionRow({ q }: { q: Question }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', minHeight: 80 }}>
      {/* Left: survey question + partner answer */}
      <div style={{
        flex: '1 1 68%', padding: '14px 20px',
        background: '#f8f8f8', borderRight: '1px solid #e0e0e0',
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#1a3a8f', marginBottom: 10 }}>{q.text}</div>
        {q.type === 'radio' && q.options && (
          <div className="flex flex-col gap-2">
            {q.options.map((opt, i) => (
              <label key={i} className="flex items-center gap-2" style={{ fontSize: 12, color: '#333', cursor: 'default' }}>
                <span style={{
                  display: 'inline-block', width: 14, height: 14, borderRadius: '50%',
                  border: `2px solid ${i === q.selectedIndex ? '#e63946' : '#bbb'}`,
                  background: i === q.selectedIndex ? '#e63946' : 'transparent',
                  flexShrink: 0,
                }} />
                {opt}
              </label>
            ))}
          </div>
        )}
        {q.type === 'checkbox' && q.options && (
          <div className="flex flex-col gap-2">
            {q.options.map((opt, i) => (
              <label key={i} className="flex items-center gap-2" style={{ fontSize: 12, color: '#333', cursor: 'default' }}>
                <span style={{
                  display: 'inline-block', width: 13, height: 13,
                  border: `2px solid ${q.checkedOptions?.includes(i) ? '#e63946' : '#bbb'}`,
                  background: q.checkedOptions?.includes(i) ? '#e63946' : 'transparent',
                  borderRadius: 2, flexShrink: 0,
                }} />
                {opt}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Right: audit result panel */}
      <div style={{ flex: '0 0 32%', padding: '14px 16px', background: '#fff' }}>
        {q.type === 'radio' && q.options && q.score && (
          <div className="flex flex-col gap-2 mb-3">
            {q.options.map((opt, i) => (
              <div key={i} className="flex items-center justify-between" style={{ fontSize: 12 }}>
                <label className="flex items-center gap-2" style={{ cursor: 'default' }}>
                  <span style={{
                    display: 'inline-block', width: 14, height: 14, borderRadius: '50%',
                    border: `2px solid ${i === q.selectedIndex ? '#bbb' : '#ddd'}`,
                    flexShrink: 0,
                  }} />
                  {opt}
                </label>
                <span style={{ color: '#e63946', fontWeight: 600, fontSize: 11 }}>
                  {q.score![i].toFixed(2)}점
                </span>
              </div>
            ))}
          </div>
        )}
        {q.type === 'checkbox' && q.options && q.score && (
          <div className="flex flex-col gap-1 mb-3">
            {q.options.map((opt, i) => (
              <div key={i} className="flex items-center justify-between" style={{ fontSize: 11 }}>
                <span style={{ color: '#555', flex: 1, marginRight: 4 }}>{opt}</span>
                <span style={{ color: '#e63946', fontWeight: 600, flexShrink: 0 }}>
                  {q.score![i].toFixed(2)}점
                </span>
              </div>
            ))}
          </div>
        )}
        <div style={{
          border: '1px solid #e0e0e0', borderRadius: 3,
          padding: '8px 10px', fontSize: 11, color: '#aaa',
          minHeight: 40, background: '#fafafa',
        }}>
          현장확인 사항을 작성해주세요.
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ─── */
export default function SurveyResultView({ onClose, initialTab = '설문결과보기' }: Props) {
  const [tab, setTab] = useState<ResultTab>(initialTab);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#fff', overflow: 'hidden' }}>

      {/* Top tab bar */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e0e0e0', flexShrink: 0 }}>
        {(['설문결과보기', '실사결과보기'] as ResultTab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: '13px 0',
              fontSize: 14,
              fontWeight: 600,
              border: 'none',
              borderBottom: tab === t ? '3px solid #3d5a9e' : '3px solid transparent',
              background: tab === t ? '#fff' : '#f8f8f8',
              color: tab === t ? '#3d5a9e' : '#888',
              cursor: 'pointer',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Sub-header: title + buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid #e8e8e8', flexShrink: 0 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#222' }}>
          {tab === '설문결과보기' ? '설문결과 보고서' : '실사결과 보고서'}
        </span>
        <div className="flex items-center gap-2">
          {tab === '설문결과보기' && (
            <button style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', border: '1px solid #3d5a9e', borderRadius: 3, background: '#fff', color: '#3d5a9e', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              📄 PDF
            </button>
          )}
          <button style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', border: 'none', borderRadius: 3, background: '#3d5a9e', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            🖨 인쇄하기
          </button>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: 20, color: '#555', cursor: 'pointer', lineHeight: 1, padding: '0 4px' }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* Campaign info block — both tabs */}
        <div style={{ padding: '20px 24px 12px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#222', marginBottom: 8 }}>
            TEST ESG CAMPAIGN 01
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: '#888' }}>2026-08-06 ~ 2026-11-30</span>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: 12, color: '#555' }}>주최사</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#333' }}>TEST COMPANY 01</span>
              <span style={{ fontSize: 12, color: '#555' }}>참여기업</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#333' }}>TEST PARTNER 01</span>
            </div>
          </div>
        </div>

        {/* ── SADM_240: 설문결과보기 ── */}
        {tab === '설문결과보기' && (
          <div>
            {SECTIONS.map(section => (
              <div key={section.title}>
                <SectionHeader title={section.title} />
                {section.subs.map(sub => (
                  <div key={sub.title}>
                    <SubSectionHeader title={sub.title} />
                    {sub.questions.map(q => (
                      <SurveyQuestionBlock key={q.id} q={q} />
                    ))}
                  </div>
                ))}
              </div>
            ))}
            <div style={{ height: 40 }} />
          </div>
        )}

        {/* ── SADM_241: 실사결과보기 ── */}
        {tab === '실사결과보기' && (
          <div>
            {/* 실사자 종합의견 + 개선과제 — sticky top right panel structure */}
            {/* Rendered inline above the questions per the screenshot layout */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e0e0e0' }}>
              {/* Left spacer */}
              <div style={{ flex: '1 1 68%', padding: '14px 20px', borderRight: '1px solid #e0e0e0' }}>
                {/* blank left area */}
              </div>
              {/* Right: 실사자 종합의견 + 개선과제 */}
              <div style={{ flex: '0 0 32%', padding: '14px 16px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 8 }}>실사자 종합의견</div>
                <textarea
                  readOnly
                  style={{
                    width: '100%', height: 80, border: '1px solid #e0e0e0', borderRadius: 3,
                    padding: '6px 8px', fontSize: 12, resize: 'none', background: '#fafafa',
                    boxSizing: 'border-box', color: '#333',
                  }}
                  defaultValue=""
                />
                <div style={{ marginTop: 10 }}>
                  <div style={{ background: '#fdecea', padding: '5px 10px', fontSize: 12, fontWeight: 600, color: '#e63946', marginBottom: 6 }}>
                    개선과제1.
                  </div>
                  <div style={{ border: '1px solid #e0e0e0', borderRadius: 3, padding: '8px 10px', background: '#fafafa' }}>
                    <div style={{ fontSize: 12, color: '#aaa', marginBottom: 6 }}>제목을 입력해주세요.</div>
                    <div style={{ fontSize: 12, color: '#aaa' }}>내용을 입력해주세요.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section-level content */}
            {SECTIONS.map(section => (
              <div key={section.title}>
                {/* Section header spans full width */}
                <div style={{
                  background: '#f5f5f5',
                  borderTop: '1px solid #e0e0e0',
                  borderBottom: '1px solid #e0e0e0',
                  padding: '8px 20px',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#333',
                  marginTop: 0,
                }}>
                  {section.title}
                </div>
                {section.subs.map(sub => (
                  <div key={sub.title}>
                    {/* Sub-section header */}
                    <div style={{
                      display: 'flex',
                      borderBottom: '1px solid #e8e8e8',
                    }}>
                      <div style={{
                        flex: '1 1 68%',
                        padding: '8px 20px',
                        fontSize: 13, fontWeight: 600, color: '#222',
                        borderRight: '1px solid #e0e0e0',
                      }}>
                        {sub.title}
                      </div>
                      <div style={{ flex: '0 0 32%' }} />
                    </div>
                    {sub.questions.map(q => (
                      <AuditQuestionRow key={q.id} q={q} />
                    ))}
                  </div>
                ))}
              </div>
            ))}
            <div style={{ height: 40 }} />
          </div>
        )}
      </div>
    </div>
  );
}
