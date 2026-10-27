import { useState, useEffect, useMemo } from 'react';

/* ── Types ────────────────────────────────────────────────────── */
export interface ReuploatRequest {
  questionId: string;
  catId: string;
  questionText: string;
  fileName: string;
  locationLabel: string;
}

interface SurveyQ {
  id: string;
  cat: string;
  catLabel: string;
  text: string;
  maxScore: number;
  answers?: { label: string; value: string }[];
  file?: { name: string; size: string; verified: boolean };
  aiStatus?: 'done' | 'needs-review' | null;
  aiCompliance?: number;
  aiScore?: number;
  aiVerdict?: string;
  aiSummary?: string;
  aiReco?: string;
}
interface EvalState { score: number; comment: string; saved: boolean; }

/* ── Mock document viewer ─────────────────────────────────────── */
function Stamp({ text, color }: { text: string; color: string }) {
  return (
    <span style={{ display: 'inline-block', border: `2px solid ${color}`, borderRadius: 3, padding: '3px 10px', color, fontWeight: 700, fontSize: 13, letterSpacing: 2, transform: 'rotate(-7deg)', opacity: 0.8, marginLeft: 12 }}>
      {text}
    </span>
  );
}

function HRCharterDoc({ partnerName }: { partnerName: string }) {
  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 10, color: '#999', marginBottom: 4 }}>문서번호: HR-2026-001-R3 &nbsp;|&nbsp; 시행일: 2026.04.01</div>
        <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 6 }}>{partnerName} 인권경영헌장</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#666' }}>개정일: 2026년 3월 15일</span>
          <Stamp text="KPC 검증완료" color="#15803d" />
        </div>
      </div>
      <hr style={{ border: 'none', borderTop: '2px solid #1a3055', margin: '0 0 18px' }} />
      <p style={{ marginBottom: 14, lineHeight: 1.9 }}>{partnerName}(이하 "당사")는 모든 임직원과 이해관계자의 인권을 존중·보호하기 위하여 다음과 같이 인권경영헌장을 제정·공표합니다.</p>
      <div style={{ fontWeight: 700, color: '#1a3055', marginBottom: 6 }}>제1조 (목적)</div>
      <p style={{ marginBottom: 14, lineHeight: 1.8 }}>본 헌장은 당사의 모든 사업 활동 및 공급망 전반에 걸쳐 국제인권기준(UN 기업과 인권 이행원칙, GRI 403, ISO 26000 등)을 준수하고 인권 리스크를 예방·관리함을 목적으로 합니다.</p>
      <div style={{ fontWeight: 700, color: '#1a3055', marginBottom: 6 }}>제2조 (적용 범위)</div>
      <p style={{ marginBottom: 14, lineHeight: 1.8 }}>본 헌장은 국내외 전 사업장 임직원(정규직·비정규직·파견직), 협력업체 및 공급망 종사자에게 적용됩니다.</p>
      <div style={{ fontWeight: 700, color: '#1a3055', marginBottom: 6 }}>제3조 (주요 원칙)</div>
      <div style={{ paddingLeft: 12, marginBottom: 16, lineHeight: 2 }}>
        {['강제노동 및 아동노동 금지', '결사의 자유 및 단체교섭권 보장', '차별 및 괴롭힘 금지', '안전하고 건강한 근무환경 제공', '개인정보 및 프라이버시 보호'].map((item, i) => (
          <div key={i}>✓ {item}</div>
        ))}
      </div>
      <div style={{ fontWeight: 700, color: '#1a3055', marginBottom: 8 }}>제4조 (전사 배포 현황)</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 20 }}>
        <thead><tr style={{ background: '#f0f4f8' }}>{['연도', '전체 임직원', '배포 완료', '배포율'].map(h => <th key={h} style={{ border: '1px solid #ccc', padding: '6px 10px', textAlign: 'center' }}>{h}</th>)}</tr></thead>
        <tbody>{[['2024', '387명', '387명', '100%'], ['2025', '395명', '395명', '100%'], ['2026', '402명', '402명', '100%']].map(r => (
          <tr key={r[0]}>{r.map((c, i) => <td key={i} style={{ border: '1px solid #ccc', padding: '6px 10px', textAlign: 'center', color: i === 3 ? '#15803d' : '#333', fontWeight: i === 3 ? 700 : 400 }}>{c}</td>)}</tr>
        ))}</tbody>
      </table>
      <div style={{ textAlign: 'right', fontSize: 12, color: '#555' }}>
        <div>2026년 3월 15일</div>
        <div style={{ fontWeight: 700, marginTop: 4 }}>{partnerName} 대표이사 &nbsp;[인]</div>
      </div>
    </>
  );
}

function AttendanceDoc({ answers }: { answers?: { label: string; value: string }[] }) {
  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 10, color: '#999', marginBottom: 4 }}>HR-ATT-2025-Q4 &nbsp;|&nbsp; 집계 기간: 2025.01~12</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>근태 관리 시스템 출퇴근 기록 집계표</div>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '0 0 14px' }} />
      {answers && answers.length > 0 && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, padding: '10px 14px', marginBottom: 16, fontSize: 12 }}>
          <div style={{ fontWeight: 700, color: '#15803d', marginBottom: 4 }}>협력사 제출 요약</div>
          {answers.map((a, i) => <div key={i}><strong>{a.label}:</strong> {a.value}</div>)}
        </div>
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
        <thead><tr style={{ background: '#1a3055', color: '#fff' }}>{['부서', '직급', '법정근무시간', '실근무시간', '연장근무', '초과여부'].map(h => <th key={h} style={{ border: '1px solid #2d4a7a', padding: '7px 8px', textAlign: 'center' }}>{h}</th>)}</tr></thead>
        <tbody>{[['생산부', '사원', '2,080h', '2,076h', '0h', '미초과'], ['품질부', '대리', '2,080h', '2,104h', '24h', '미초과'], ['관리부', '과장', '2,080h', '2,089h', '9h', '미초과'], ['영업부', '차장', '2,080h', '2,120h', '40h', '미초과'], ['개발부', '부장', '2,080h', '2,150h', '70h', '검토요']].map((r, ri) => (
          <tr key={ri} style={{ background: ri % 2 === 0 ? '#fff' : '#f8f9fa' }}>{r.map((c, ci) => <td key={ci} style={{ border: '1px solid #e0e0e0', padding: '6px 8px', textAlign: 'center', color: c === '검토요' ? '#d97706' : '#333', fontWeight: c === '검토요' ? 700 : 400 }}>{c}</td>)}</tr>
        ))}</tbody>
      </table>
      <div style={{ fontSize: 10, color: '#999', marginTop: 8 }}>※ 법정 주 52시간 기준 / 연장근무 한도: 주 12시간</div>
    </>
  );
}

function GHGDoc({ answers }: { answers?: { label: string; value: string }[] }) {
  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 10, color: '#999', marginBottom: 4 }}>제3자 검증보고서 &nbsp;|&nbsp; 검증기관: KPC환경연구원</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>온실가스 배출량 검증 보고서</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#555' }}>검증 기준연도: 2026 &nbsp;|&nbsp; GHG Protocol Corporate Standard</span>
          <Stamp text="검증완료" color="#16a34a" />
        </div>
      </div>
      <hr style={{ border: 'none', borderTop: '2px solid #16a34a', margin: '0 0 16px' }} />
      {answers && answers.length > 0 && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, padding: '10px 14px', marginBottom: 16, fontSize: 12 }}>
          <div style={{ fontWeight: 700, color: '#15803d', marginBottom: 4 }}>핵심 배출량 현황</div>
          {answers.map((a, i) => <div key={i}><strong>{a.label}:</strong> {a.value}</div>)}
        </div>
      )}
      <div style={{ fontWeight: 700, color: '#1a3055', marginBottom: 8 }}>배출량 집계 결과</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 16 }}>
        <thead><tr style={{ background: '#f0f4f8' }}>{['구분', '배출원', '배출량 (tCO₂eq)', '전년 대비'].map(h => <th key={h} style={{ border: '1px solid #ccc', padding: '7px 10px', textAlign: 'center' }}>{h}</th>)}</tr></thead>
        <tbody>{[['Scope 1', '고정연소 (LNG, 경유)', '820', '▼ 3.2%'], ['Scope 1', '이동연소 (차량)', '420', '▼ 1.8%'], ['Scope 2', '전력 구매', '3,820', '▼ 5.1%'], ['합계', '—', '5,060', '▼ 4.3%']].map((r, ri) => (
          <tr key={ri} style={{ background: ri === 3 ? '#f0f4f8' : ri % 2 === 0 ? '#fff' : '#f8f9fa', fontWeight: ri === 3 ? 700 : 400 }}>{r.map((c, ci) => <td key={ci} style={{ border: '1px solid #ccc', padding: '6px 10px', textAlign: 'center', color: c.startsWith('▼') ? '#16a34a' : '#333' }}>{c}</td>)}</tr>
        ))}</tbody>
      </table>
      <div style={{ fontWeight: 700, color: '#1a3055', marginBottom: 6 }}>검증 의견</div>
      <p style={{ fontSize: 12, lineHeight: 1.7 }}>제출된 온실가스 배출량 자료는 GHG Protocol 기준에 따라 작성되었으며, 중요한 오류 없이 적정하게 작성되었음을 확인합니다.</p>
    </>
  );
}

function SafetyDoc({ answers }: { answers?: { label: string; value: string }[] }) {
  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 10, color: '#999', marginBottom: 4 }}>SH-2026-RPT-001 &nbsp;|&nbsp; 기준일: 2026.12.31</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>안전보건 사망재해 현황 보고서</div>
        <Stamp text="ZERO ACCIDENT" color="#1a6fbf" />
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '12px 0 16px' }} />
      {answers && answers.length > 0 && (
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '10px 14px', marginBottom: 16, fontSize: 12 }}>
          <div style={{ fontWeight: 700, color: '#1d4ed8', marginBottom: 4 }}>주요 지표</div>
          {answers.map((a, i) => <div key={i}><strong>{a.label}:</strong> {a.value}</div>)}
        </div>
      )}
      <div style={{ fontWeight: 700, color: '#1a3055', marginBottom: 8 }}>직영 근로자 재해 현황</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 14 }}>
        <thead><tr style={{ background: '#f0f4f8' }}>{['연도', '근로자수', '사망', '중상', 'LTIFR', '도수율'].map(h => <th key={h} style={{ border: '1px solid #ccc', padding: '6px 8px', textAlign: 'center' }}>{h}</th>)}</tr></thead>
        <tbody>{[['2024', '387명', '0', '1', '0.51', '1.29'], ['2025', '395명', '0', '0', '0.0', '0.0'], ['2026', '402명', '0', '0', '0.0', '0.0']].map((r, ri) => (
          <tr key={ri} style={{ background: ri % 2 === 0 ? '#fff' : '#f8f9fa' }}>{r.map((c, ci) => <td key={ci} style={{ border: '1px solid #ccc', padding: '5px 8px', textAlign: 'center' }}>{c}</td>)}</tr>
        ))}</tbody>
      </table>
      <div style={{ fontWeight: 700, color: '#1a3055', marginBottom: 6 }}>하청·도급 근로자 현황</div>
      <p style={{ fontSize: 12, lineHeight: 1.7, marginBottom: 8 }}>2026년 기준 사내 하청 근로자 총 38명. 해당 기간 사망자 및 중대재해: <strong>0건</strong></p>
      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 4, padding: '8px 12px', fontSize: 11, color: '#7f1d1d' }}>
        ※ 하청 근로자 개인별 안전교육 이수 현황 별첨 (보완 요청됨)
      </div>
    </>
  );
}

function ESGMinutesDoc({ answers }: { answers?: { label: string; value: string }[] }) {
  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 10, color: '#999', marginBottom: 4 }}>ESG위원회 제4차 정기회의 회의록</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>ESG 경영위원회 회의록</div>
        <div style={{ fontSize: 12, color: '#555' }}>일시: 2026.11.20 14:00~16:30 &nbsp;|&nbsp; 본사 이사회실</div>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '0 0 16px' }} />
      {answers && answers.length > 0 && (
        <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 6, padding: '10px 14px', marginBottom: 16, fontSize: 12 }}>
          <div style={{ fontWeight: 700, color: '#7c3aed', marginBottom: 4 }}>위원회 운영 현황</div>
          {answers.map((a, i) => <div key={i}><strong>{a.label}:</strong> {a.value}</div>)}
        </div>
      )}
      <div style={{ fontWeight: 700, color: '#1a3055', marginBottom: 6 }}>1. 참석자</div>
      <p style={{ fontSize: 12, marginBottom: 14, lineHeight: 1.7 }}>위원장: 이○○(대표이사), 위원: 김○○(CFO), 박○○(CSO), 정○○(사외이사), 최○○(사외이사) — 전원 참석 (5/5)</p>
      <div style={{ fontWeight: 700, color: '#1a3055', marginBottom: 8 }}>2. 안건 및 결의사항</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead><tr style={{ background: '#f0f4f8' }}>{['번호', '안건', '결의결과'].map(h => <th key={h} style={{ border: '1px solid #ccc', padding: '6px 10px', textAlign: h === '번호' ? 'center' : 'left' }}>{h}</th>)}</tr></thead>
        <tbody>{[['1', '2026년도 ESG KPI 목표 설정 승인', '원안 가결'], ['2', '공급망 ESG 실사 계획 승인 및 예산 배정', '수정 가결'], ['3', '탄소중립 2040 로드맵 최종 승인', '원안 가결'], ['4', '임직원 인권실사 결과 보고 및 후속 조치', '보고 수령']].map((r, ri) => (
          <tr key={ri} style={{ background: ri % 2 === 0 ? '#fff' : '#f8f9fa' }}>
            <td style={{ border: '1px solid #ccc', padding: '6px 10px', textAlign: 'center', width: 40 }}>{r[0]}</td>
            <td style={{ border: '1px solid #ccc', padding: '6px 10px' }}>{r[1]}</td>
            <td style={{ border: '1px solid #ccc', padding: '6px 10px', color: r[2].includes('가결') ? '#15803d' : '#555', fontWeight: r[2].includes('가결') ? 600 : 400 }}>{r[2]}</td>
          </tr>
        ))}</tbody>
      </table>
    </>
  );
}

function GenericDoc({ file, answers }: { file: { name: string; size: string; verified: boolean }; answers?: { label: string; value: string }[] }) {
  const title = file.name.replace(/\.(pdf|xlsx|xls)$/i, '').replace(/_/g, ' ');
  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 12, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span>{file.size}</span>
          {file.verified && <Stamp text="검증완료" color="#15803d" />}
        </div>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '0 0 16px' }} />
      {answers && answers.length > 0 && (
        <div style={{ background: '#f0f4f8', border: '1px solid #d0d9e8', borderRadius: 6, padding: '12px 16px', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, color: '#1a3055', marginBottom: 8, fontSize: 13 }}>협력사 제출 내용 요약</div>
          {answers.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 4, fontSize: 13 }}>
              <span style={{ color: '#666', minWidth: 140 }}>{a.label}:</span>
              <span style={{ fontWeight: 600 }}>{a.value}</span>
            </div>
          ))}
        </div>
      )}
      <p style={{ fontSize: 13, lineHeight: 1.9, color: '#555' }}>본 문서는 협력사가 제출한 ESG 진단 증빙 자료입니다. 문서 내 기재된 수치 및 현황 데이터는 당사 자체 시스템에서 추출·집계된 자료로, 제출 담당자가 서명으로 확인하였습니다.</p>
    </>
  );
}

function MockDocViewer({ file, answers, partnerName, onClose }: {
  file: { name: string; size: string; verified: boolean };
  answers?: { label: string; value: string }[];
  partnerName: string;
  onClose: () => void;
}) {
  const n = file.name.toLowerCase();
  let doc: React.ReactNode;
  if (n.includes('인권경영헌장') || n.includes('인권헌장')) doc = <HRCharterDoc partnerName={partnerName} />;
  else if (n.includes('근태') || n.includes('출퇴근')) doc = <AttendanceDoc answers={answers} />;
  else if (n.includes('온실가스') || n.includes('배출량')) doc = <GHGDoc answers={answers} />;
  else if (n.includes('안전') || n.includes('재해')) doc = <SafetyDoc answers={answers} />;
  else if (n.includes('esg위원회') || n.includes('회의록')) doc = <ESGMinutesDoc answers={answers} />;
  else doc = <GenericDoc file={file} answers={answers} />;

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ background: '#2d3748', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <span style={{ fontSize: 14 }}>📄</span>
        <span style={{ color: '#e2e8f0', fontSize: 12, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
        <span style={{ color: '#a0aec0', fontSize: 11, flexShrink: 0 }}>{file.size}</span>
        {file.verified && <span style={{ color: '#68d391', fontSize: 11, flexShrink: 0 }}>✓ KPC 무결성 검증</span>}
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#e2e8f0', borderRadius: 4, padding: '3px 10px', fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>닫기 ✕</button>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', background: '#4a5568', padding: '20px 16px' }}>
        <div style={{ background: '#fff', maxWidth: 680, margin: '0 auto', padding: '48px 52px', boxSizing: 'border-box', boxShadow: '0 4px 24px rgba(0,0,0,0.5)', fontFamily: '"Malgun Gothic", sans-serif', fontSize: 13, lineHeight: 1.8, color: '#222' }}>
          {doc}
        </div>
      </div>
    </div>
  );
}

/* ── Survey data ──────────────────────────────────────────────── */
const PARTNER_SURVEYS: Record<string, SurveyQ[]> = {
  '한국정밀': [
    { id: 'S-1-1', cat: 'S-1', catLabel: '인권 및 근로조건', maxScore: 15, text: '귀사는 임직원의 인권 증진 및 인권침해 구제를 목적으로 하는 인권헌장과 가이드라인을 제정 및 보유하고 있습니까?', answers: [{ label: '인권헌장 제정', value: '예' }, { label: '전사 배포율', value: '100 / 100 / 100 %' }], file: { name: '2026_한국정밀_인권경영헌장_개정본.pdf', size: '1.8 MB', verified: true }, aiStatus: 'done', aiCompliance: 96, aiScore: 14, aiVerdict: '적합', aiSummary: '제출된 인권헌장 문서의 내용이 GRI 403 기준 및 국제인권 가이드라인(UN Guiding Principles)에 부합합니다. 전사 배포율 100% 증빙 자료가 명확히 제출되었습니다.', aiReco: '현장 내 공급망 하청업체 적용 조항 강화 및 3년간 인권침해 제로 달성 현황 추가 기재 권장.' },
    { id: 'S-1-2', cat: 'S-1', catLabel: '인권 및 근로조건', maxScore: 10, text: '귀사는 사업을 운영하는 국가별 법정근로시간(주 52시간 등) 및 초과근무 한도를 준수하고 관리 전산망을 운영합니까?', answers: [{ label: '법정 준수 여부', value: '준수' }, { label: '초과근무 관리 시스템', value: '도입완료' }], file: { name: '2025_근태관리시스템_출퇴근기록_집계표.xlsx', size: '0.3 MB', verified: true }, aiStatus: 'done', aiCompliance: 88, aiScore: 9, aiVerdict: '적합', aiSummary: '근태관리 시스템이 운영 중이며 법정 근로시간 준수 이력이 명확합니다.', aiReco: '야간 및 공휴일 초과근무 예외처리 기준 문서화 권장.' },
    { id: 'S-1-3', cat: 'S-1', catLabel: '인권 및 근로조건', maxScore: 10, text: '귀사는 임직원을 대상으로 수행하고 있는 인권/노동 관련 정기 교육 항목을 모두 선택해 주십시오.', answers: [{ label: '교육 실시 여부', value: '연 2회 이상' }, { label: '교육 대상', value: '전 임직원' }], file: { name: '2025_인권교육_수료자정부.pdf', size: '2.1 MB', verified: false }, aiStatus: 'done', aiCompliance: 82, aiScore: 8, aiVerdict: '적합', aiSummary: '정기 인권 교육 실시 내역이 확인됩니다.', aiReco: 'KPC 무결성 검증 미완료 파일 재업로드 권장.' },
    { id: 'S-2-1', cat: 'S-2', catLabel: '안전보건 및 기본인력', maxScore: 15, text: '하청 및 도급 근로자에대한 사망자수를 기재하여 주십시오. 하청 및 도급 근로자가 없거나, 사고가 존재하지 않는 경우 0을 입력하여 주십시오.', answers: [{ label: '사망자수', value: '0명' }, { label: '중대재해', value: '없음' }], file: { name: '2026_안전보건_사망재해_현황보고서.pdf', size: '1.1 MB', verified: true }, aiStatus: 'needs-review', aiCompliance: 71, aiScore: 10, aiVerdict: '검토필요', aiSummary: '제출된 자료에 하청 근로자 현황이 일부 누락되어 있습니다.', aiReco: '하청업체별 안전사고 대장 및 근로계약서 목록 추가 제출 권장.' },
    { id: 'S-2-2', cat: 'S-2', catLabel: '안전보건 및 기본인력', maxScore: 10, text: '귀사의 산업재해율(LTIFR: Lost Time Injury Frequency Rate)을 기재하여 주십시오.', answers: [{ label: 'LTIFR', value: '0.32' }], file: { name: '2025_산업재해율_집계현황.xlsx', size: '0.2 MB', verified: true }, aiStatus: 'done', aiCompliance: 90, aiScore: 9, aiVerdict: '적합', aiSummary: 'LTIFR 산출 방식이 기준과 일치합니다.' },
    { id: 'S-2-3', cat: 'S-2', catLabel: '안전보건 및 기본인력', maxScore: 10, text: '귀사의 전체 임직원 수(정규직/비정규직/파견직)를 연도별로 기재하여 주십시오.', answers: [{ label: '정규직', value: '342명' }, { label: '비정규직', value: '48명' }, { label: '파견직', value: '12명' }], file: { name: '2026_인력현황_집계표.xlsx', size: '0.4 MB', verified: true }, aiStatus: 'done', aiCompliance: 95, aiScore: 10, aiVerdict: '적합' },
    { id: 'S-2-4', cat: 'S-2', catLabel: '안전보건 및 기본인력', maxScore: 10, text: '귀사는 임직원 건강검진 실시 현황을 기재하여 주십시오.', answers: [{ label: '일반건강검진 실시율', value: '100%' }, { label: '특수건강검진 실시율', value: '100%' }], file: { name: '2026_건강검진_실시현황.pdf', size: '0.9 MB', verified: false }, aiStatus: 'done', aiCompliance: 93, aiScore: 9, aiVerdict: '적합' },
    { id: 'E-1-1', cat: 'E-1', catLabel: '온실가스 배출', maxScore: 15, text: '귀사의 온실가스 직접 배출량(Scope 1) 및 간접 배출량(Scope 2)을 기재하여 주십시오.', answers: [{ label: 'Scope 1', value: '1,240 tCO₂eq' }, { label: 'Scope 2', value: '3,820 tCO₂eq' }], file: { name: '2026_온실가스배출량_검증보고서.pdf', size: '2.3 MB', verified: true }, aiStatus: 'done', aiCompliance: 91, aiScore: 14, aiVerdict: '적합', aiSummary: '온실가스 배출량 산정 방법론이 GHG Protocol 기준에 적합합니다.' },
    { id: 'E-1-2', cat: 'E-1', catLabel: '온실가스 배출', maxScore: 10, text: '귀사의 에너지 소비량(전기, 열, 연료) 및 재생에너지 사용 비율을 기재하여 주십시오.', answers: [{ label: '총 에너지 소비', value: '28,400 GJ' }, { label: '재생에너지 비율', value: '12%' }], file: { name: '2026_에너지사용량_현황집계.xlsx', size: '0.5 MB', verified: true }, aiStatus: 'done', aiCompliance: 87, aiScore: 9, aiVerdict: '적합' },
    { id: 'E-2-1', cat: 'E-2', catLabel: '폐기물 및 용수', maxScore: 10, text: '귀사의 폐기물 발생량(지정/일반) 및 재활용률을 기재하여 주십시오.', answers: [{ label: '지정폐기물', value: '23.4톤' }, { label: '일반폐기물', value: '187톤' }, { label: '재활용률', value: '68%' }], file: { name: '2026_폐기물처리현황.xlsx', size: '0.3 MB', verified: true }, aiStatus: 'done', aiCompliance: 85, aiScore: 9, aiVerdict: '적합' },
    { id: 'G-1-1', cat: 'G-1', catLabel: '지배구조 및 윤리경영', maxScore: 15, text: '귀사는 이사회 또는 경영진 차원의 ESG 의사결정 체계를 보유하고 있습니까?', answers: [{ label: 'ESG 위원회 여부', value: '운영중' }, { label: '위원회 개최 횟수', value: '연 4회' }], file: { name: '2026_ESG위원회_회의록.pdf', size: '1.4 MB', verified: true }, aiStatus: 'done', aiCompliance: 92, aiScore: 14, aiVerdict: '적합', aiSummary: 'ESG 위원회 운영 실적 및 의사결정 체계가 명확합니다.' },
    { id: 'G-1-2', cat: 'G-1', catLabel: '지배구조 및 윤리경영', maxScore: 10, text: '귀사는 임직원 대상 반부패/윤리 교육을 실시하고 있습니까? 교육 이수율을 기재하여 주십시오.', answers: [{ label: '교육 실시 여부', value: '실시' }, { label: '이수율', value: '98%' }], file: { name: '2026_윤리교육_이수현황.xlsx', size: '0.2 MB', verified: true }, aiStatus: 'done', aiCompliance: 94, aiScore: 9, aiVerdict: '적합' },
  ],
  '그린테크': [
    { id: 'S-1-1', cat: 'S-1', catLabel: '인권 및 근로조건', maxScore: 15, text: '귀사는 임직원의 인권 증진 및 인권침해 구제를 목적으로 하는 인권헌장과 가이드라인을 제정 및 보유하고 있습니까?', answers: [{ label: '인권헌장 제정', value: '예' }], file: { name: '2026_그린테크_인권경영헌장.pdf', size: '1.2 MB', verified: true }, aiStatus: null },
    { id: 'S-1-2', cat: 'S-1', catLabel: '인권 및 근로조건', maxScore: 10, text: '귀사는 법정근로시간 및 초과근무 한도를 준수하고 관리 전산망을 운영합니까?', answers: [{ label: '준수 여부', value: '준수' }], file: { name: '2025_근태관리_집계표.xlsx', size: '0.2 MB', verified: false }, aiStatus: null },
    { id: 'S-2-1', cat: 'S-2', catLabel: '안전보건 및 기본인력', maxScore: 15, text: '하청 및 도급 근로자에 대한 사망자수를 기재하여 주십시오.', answers: [{ label: '사망자수', value: '0명' }], file: { name: '2026_안전보건_현황.pdf', size: '0.8 MB', verified: true }, aiStatus: null },
    { id: 'S-2-2', cat: 'S-2', catLabel: '안전보건 및 기본인력', maxScore: 10, text: '귀사의 산업재해율(LTIFR)을 기재하여 주십시오.', answers: [{ label: 'LTIFR', value: '0.0' }], file: { name: '2025_산업재해율_현황.xlsx', size: '0.1 MB', verified: false }, aiStatus: null },
    { id: 'E-1-1', cat: 'E-1', catLabel: '온실가스 배출', maxScore: 15, text: '귀사의 온실가스 직접 배출량(Scope 1) 및 간접 배출량(Scope 2)을 기재하여 주십시오.', answers: [{ label: 'Scope 1', value: '480 tCO₂eq' }, { label: 'Scope 2', value: '1,240 tCO₂eq' }], file: { name: '2026_온실가스_검증보고서.pdf', size: '1.5 MB', verified: true }, aiStatus: null },
    { id: 'G-1-1', cat: 'G-1', catLabel: '지배구조 및 윤리경영', maxScore: 15, text: '귀사는 이사회 또는 경영진 차원의 ESG 의사결정 체계를 보유하고 있습니까?', answers: [{ label: 'ESG 위원회 여부', value: '미운영' }], file: { name: '2026_ESG위원회_회의록.pdf', size: '0.4 MB', verified: false }, aiStatus: null },
  ],
  '미래부품': [
    { id: 'S-1-1', cat: 'S-1', catLabel: '인권 및 근로조건', maxScore: 15, text: '귀사는 임직원의 인권 증진 및 인권침해 구제를 목적으로 하는 인권헌장과 가이드라인을 제정 및 보유하고 있습니까?', answers: [{ label: '인권헌장 제정', value: '예' }, { label: '전사 배포율', value: '95%' }], file: { name: '2026_미래부품_인권경영헌장.pdf', size: '1.0 MB', verified: true }, aiStatus: null },
    { id: 'S-2-1', cat: 'S-2', catLabel: '안전보건 및 기본인력', maxScore: 15, text: '하청 및 도급 근로자에 대한 사망자수를 기재하여 주십시오.', answers: [{ label: '사망자수', value: '0명' }], file: { name: '2026_안전보건_현황.pdf', size: '0.6 MB', verified: true }, aiStatus: null },
    { id: 'E-1-1', cat: 'E-1', catLabel: '온실가스 배출', maxScore: 15, text: '귀사의 온실가스 직접/간접 배출량을 기재하여 주십시오.', answers: [{ label: 'Scope 1', value: '820 tCO₂eq' }, { label: 'Scope 2', value: '2,100 tCO₂eq' }], file: { name: '2026_온실가스_현황.pdf', size: '1.8 MB', verified: true }, aiStatus: null },
    { id: 'G-1-1', cat: 'G-1', catLabel: '지배구조 및 윤리경영', maxScore: 15, text: '귀사는 이사회 또는 경영진 차원의 ESG 의사결정 체계를 보유하고 있습니까?', answers: [{ label: 'ESG 위원회 여부', value: '운영중' }], file: { name: '2026_ESG위원회_회의록.pdf', size: '0.9 MB', verified: true }, aiStatus: null },
  ],
  '대상산업': [
    { id: 'S-1-1', cat: 'S-1', catLabel: '인권 및 근로조건', maxScore: 15, text: '귀사는 임직원의 인권 증진 및 인권침해 구제를 목적으로 하는 인권헌장과 가이드라인을 제정 및 보유하고 있습니까?', answers: [{ label: '인권헌장 제정', value: '예' }, { label: '전사 배포율', value: '100%' }], file: { name: '2026_대상산업_인권경영헌장.pdf', size: '2.1 MB', verified: true }, aiStatus: 'done', aiCompliance: 94, aiScore: 14, aiVerdict: '적합', aiSummary: '인권헌장 및 가이드라인이 최신 기준을 준수합니다.' },
    { id: 'S-2-1', cat: 'S-2', catLabel: '안전보건 및 기본인력', maxScore: 15, text: '하청 및 도급 근로자에 대한 사망자수를 기재하여 주십시오.', answers: [{ label: '사망자수', value: '0명' }, { label: '부상자수', value: '2명' }], file: { name: '2026_안전보건_현황보고서.pdf', size: '1.3 MB', verified: true }, aiStatus: 'done', aiCompliance: 88, aiScore: 13, aiVerdict: '적합' },
    { id: 'E-1-1', cat: 'E-1', catLabel: '온실가스 배출', maxScore: 15, text: '귀사의 온실가스 직접/간접 배출량을 기재하여 주십시오.', answers: [{ label: 'Scope 1', value: '4,820 tCO₂eq' }, { label: 'Scope 2', value: '12,400 tCO₂eq' }], file: { name: '2026_온실가스_검증보고서.pdf', size: '3.2 MB', verified: true }, aiStatus: 'done', aiCompliance: 93, aiScore: 14, aiVerdict: '적합' },
    { id: 'G-1-1', cat: 'G-1', catLabel: '지배구조 및 윤리경영', maxScore: 15, text: '귀사는 이사회 또는 경영진 차원의 ESG 의사결정 체계를 보유하고 있습니까?', answers: [{ label: 'ESG 위원회 여부', value: '운영중' }, { label: '이사회 ESG 안건', value: '연 6회' }], file: { name: '2026_ESG위원회_회의록.pdf', size: '2.4 MB', verified: true }, aiStatus: 'done', aiCompliance: 97, aiScore: 15, aiVerdict: '적합' },
  ],
  '한빛테크': [
    { id: 'S-1-1', cat: 'S-1', catLabel: '인권 및 근로조건', maxScore: 15, text: '귀사는 임직원의 인권 증진 및 인권침해 구제를 목적으로 하는 인권헌장과 가이드라인을 제정 및 보유하고 있습니까?', answers: [{ label: '인권헌장 제정', value: '예' }, { label: '전사 배포율', value: '100%' }], file: { name: '2026_한빛테크_인권경영헌장.pdf', size: '1.6 MB', verified: true }, aiStatus: 'done', aiCompliance: 98, aiScore: 15, aiVerdict: '적합', aiSummary: '최우수 수준의 인권경영 체계가 구축되어 있습니다.' },
    { id: 'S-2-1', cat: 'S-2', catLabel: '안전보건 및 기본인력', maxScore: 15, text: '하청 및 도급 근로자에 대한 사망자수를 기재하여 주십시오.', answers: [{ label: '사망자수', value: '0명' }], file: { name: '2026_안전보건_현황.pdf', size: '1.0 MB', verified: true }, aiStatus: 'done', aiCompliance: 96, aiScore: 15, aiVerdict: '적합' },
    { id: 'E-1-1', cat: 'E-1', catLabel: '온실가스 배출', maxScore: 15, text: '귀사의 온실가스 직접/간접 배출량을 기재하여 주십시오.', answers: [{ label: 'Scope 1', value: '240 tCO₂eq' }, { label: 'Scope 2', value: '880 tCO₂eq' }], file: { name: '2026_온실가스_검증보고서.pdf', size: '2.0 MB', verified: true }, aiStatus: 'done', aiCompliance: 95, aiScore: 14, aiVerdict: '적합' },
    { id: 'G-1-1', cat: 'G-1', catLabel: '지배구조 및 윤리경영', maxScore: 15, text: '귀사는 이사회 또는 경영진 차원의 ESG 의사결정 체계를 보유하고 있습니까?', answers: [{ label: 'ESG 위원회 여부', value: '운영중' }], file: { name: '2026_ESG위원회_회의록.pdf', size: '1.8 MB', verified: true }, aiStatus: 'done', aiCompliance: 96, aiScore: 15, aiVerdict: '적합' },
  ],
  '신성에너지': [
    { id: 'S-1-1', cat: 'S-1', catLabel: '인권 및 근로조건', maxScore: 15, text: '귀사는 임직원의 인권 증진 및 인권침해 구제를 목적으로 하는 인권헌장과 가이드라인을 제정 및 보유하고 있습니까?', answers: [], file: undefined, aiStatus: null },
    { id: 'E-1-1', cat: 'E-1', catLabel: '온실가스 배출', maxScore: 15, text: '귀사의 온실가스 직접/간접 배출량을 기재하여 주십시오.', answers: [], file: undefined, aiStatus: null },
    { id: 'G-1-1', cat: 'G-1', catLabel: '지배구조 및 윤리경영', maxScore: 15, text: '귀사는 이사회 또는 경영진 차원의 ESG 의사결정 체계를 보유하고 있습니까?', answers: [], file: undefined, aiStatus: null },
  ],
};

const STAGE_INFO: Record<number, { label: string; color: string; dot: string }> = {
  1: { label: '배포', color: '#555', dot: '#aaa' },
  2: { label: '설문중', color: '#1a6fbf', dot: '#1a6fbf' },
  3: { label: '설문완료', color: '#1a6fbf', dot: '#3b82f6' },
  4: { label: '평가중', color: '#d97706', dot: '#f59e0b' },
  5: { label: '실사예정', color: '#7c3aed', dot: '#7c3aed' },
  6: { label: '평가완료', color: '#15803d', dot: '#22c55e' },
};

const FOLDER_GROUPS = [
  {
    id: 'L',
    label: 'L. 노동 및 인권',
    folders: [
      { id: 'L1', label: '일반' },
      { id: 'L2', label: '강제노동 및 자발적 근로' },
      { id: 'L3', label: '아동노동 및 연소근로' },
      { id: 'L4', label: '근로시간' },
    ],
  },
  {
    id: 'S',
    label: 'S. 안전 및 보건',
    folders: [
      { id: 'S1', label: 'OHS 체계 및 교육' },
      { id: 'S2', label: '산업안전' },
      { id: 'S3', label: '비상상황 대응' },
      { id: 'S4', label: '산업재해' },
    ],
  },
  {
    id: 'E',
    label: 'E. 환경',
    folders: [
      { id: 'E1', label: '환경 일반' },
      { id: 'E2', label: '환경 허가 및 보고' },
      { id: 'E3', label: '오염물질 절감' },
      { id: 'E4', label: '자원 및 폐기물 관리' },
    ],
  },
  {
    id: 'G',
    label: 'G. 지배구조',
    folders: [
      { id: 'G1', label: 'ESG 경영체계' },
      { id: 'G2', label: '윤리 및 반부패' },
      { id: 'G3', label: '정보보호' },
      { id: 'G4', label: '책임 있는 조달' },
    ],
  },
] as const;

type TopFolderKey = 'BASIC' | 'L' | 'S' | 'ENV' | 'ETH' | 'M';

const TOP_FOLDERS: Array<{ key: TopFolderKey; label: string }> = [
  { key: 'BASIC', label: '기본정보' },
  { key: 'L', label: 'L. 노동' },
  { key: 'S', label: 'S. 인권' },
  { key: 'ENV', label: 'E. 기후환경' },
  { key: 'ETH', label: 'E. 윤리' },
  { key: 'M', label: 'M. 경영' },
];

const QUESTION_FOLDER_BY_ID: Record<string, string> = {
  'S-1-1': 'L1',
  'S-1-2': 'L4',
  'S-1-3': 'L1',
  'S-2-1': 'S4',
  'S-2-2': 'S4',
  'S-2-3': 'L1',
  'S-2-4': 'S2',
  'E-1-1': 'E1',
  'E-1-2': 'E3',
  'E-2-1': 'E3',
  'G-1-1': 'G1',
  'G-1-2': 'G2',
};

function getQuestionFolder(question: SurveyQ) {
  if (QUESTION_FOLDER_BY_ID[question.id]) return QUESTION_FOLDER_BY_ID[question.id];
  if (/^[LSEG]\d$/.test(question.cat)) return question.cat;
  if (question.cat === 'S-1') return 'L1';
  if (question.cat === 'S-2') return 'S1';
  if (question.cat === 'E-2') return 'E3';
  return `${question.cat.charAt(0)}1`;
}

function buildPartnerQuestions(partnerName: string) {
  const source = PARTNER_SURVEYS[partnerName] ?? PARTNER_SURVEYS['신성에너지'];
  const basicQuestions: SurveyQ[] = [
    {
      id: 'B-1-1',
      cat: 'BASIC',
      catLabel: '사업장 일반',
      maxScore: 5,
      text: '귀사의 사업자등록번호와 본사 및 주요 사업장 소재지를 확인하여 주십시오.',
      answers: [{ label: '사업자등록번호', value: '123-45-67890' }, { label: '본사', value: '경기도 화성시 산업로 120' }],
      file: { name: `${partnerName}_사업자등록증.pdf`, size: '0.8 MB', verified: true },
      aiStatus: null,
    },
    {
      id: 'B-1-2',
      cat: 'BASIC',
      catLabel: '임직원 현황',
      maxScore: 5,
      text: '최근 연도 기준 전체 임직원 수와 정규직 인원을 기재하여 주십시오.',
      answers: [{ label: '전체 임직원', value: '131명' }, { label: '정규직', value: '118명' }, { label: '비정규직', value: '13명' }],
      file: { name: `${partnerName}_임직원현황_2025.xlsx`, size: '0.4 MB', verified: true },
      aiStatus: null,
    },
  ];
  const categoryQuestions = FOLDER_GROUPS.flatMap((group) => group.folders.flatMap((folder) => {
    const existing = source.filter((question) => getQuestionFolder(question) === folder.id).slice(0, 3);
    const supplements = Array.from({ length: 3 - existing.length }, (_, index) => {
      const questionNumber = existing.length + index + 1;
      const questionPrompts = [
        `귀사는 ${folder.label} 관련 정책과 운영 기준을 문서화하여 보유하고 있습니까?`,
        `귀사는 ${folder.label} 관련 주요 실적과 관리 지표를 정기적으로 점검하고 있습니까?`,
        `귀사는 ${folder.label} 관련 교육, 개선활동 및 내부 점검을 실시하고 있습니까?`,
      ];
      return {
        id: `AUTO-${folder.id}-${questionNumber}`,
        cat: folder.id,
        catLabel: folder.label,
        maxScore: 10,
        text: questionPrompts[questionNumber - 1],
        answers: [
          { label: `${folder.label} 관리체계`, value: '운영 중' },
          { label: '최근 점검 결과', value: '완료' },
        ],
        file: {
          name: `2026_${partnerName}_${folder.id}_${questionNumber}_증빙자료.pdf`,
          size: `${(0.6 + questionNumber * 0.3).toFixed(1)} MB`,
          verified: questionNumber !== 2,
        },
        aiStatus: null,
      } satisfies SurveyQ;
    });
    return [...existing, ...supplements];
  }));
  return [...basicQuestions, ...categoryQuestions];
}

function getTopFolder(question: SurveyQ): TopFolderKey {
  if (question.cat === 'BASIC') return 'BASIC';
  const folder = getQuestionFolder(question);
  if (folder.startsWith('L')) return 'L';
  if (folder.startsWith('S')) return 'S';
  if (folder.startsWith('E')) return 'ENV';
  if (question.id === 'G-1-1' || folder === 'G1') return 'M';
  return 'ETH';
}

interface Props {
  partnerName: string;
  stage: number;
  reuploads: ReuploatRequest[];
  onToggleReupload: (item: ReuploatRequest) => void;
  onOpenMail: () => void;
  reuploadedQuestionIds: string[];
  onAcknowledgeReupload: (questionId: string) => void;
  hideWorkflowActions?: boolean;
  onBack?: () => void;
  onConsistencyComplete?: () => void;
}

export default function PartnerDetail({ partnerName, stage, reuploads, onToggleReupload, onOpenMail, reuploadedQuestionIds, onAcknowledgeReupload, hideWorkflowActions = false, onBack, onConsistencyComplete }: Props) {
  const questions = useMemo(() => buildPartnerQuestions(partnerName), [partnerName]);
  const [selectedFolder, setSelectedFolder] = useState<TopFolderKey>('BASIC');
  const [openedFileId, setOpenedFileId] = useState<string | null>(null);
  const [aiReviewed, setAiReviewed] = useState(false);
  const [consistencyDone, setConsistencyDone] = useState(false);
  const [penalties, setPenalties] = useState<Record<string, string>>({});

  useEffect(() => {
    setSelectedFolder('BASIC');
    setOpenedFileId(null);
    setAiReviewed(false);
    setConsistencyDone(false);
  }, [partnerName]);

  const si = STAGE_INFO[stage] ?? STAGE_INFO[1];
  const visibleQuestions = questions.filter((question) => getTopFolder(question) === selectedFolder && question.file);
  const openedQuestion = questions.find((question) => question.id === openedFileId);
  const visibleSections = Array.from(new Set(visibleQuestions.map((question) => question.catLabel)));
  const reviewTargets = questions.filter((question) => question.file && (question.aiStatus === 'needs-review' || !question.file.verified));

  function getQuestionCode(question: SurveyQ) {
    const topFolder = getTopFolder(question);
    const questionIndex = questions
      .filter((candidate) => getTopFolder(candidate) === topFolder && candidate.file)
      .findIndex((candidate) => candidate.id === question.id);
    return `${topFolder}.${questionIndex + 1}`;
  }

  return (
    <main className="h-full overflow-y-auto bg-service-page">
      <div className="service-page-wide mx-auto max-w-[92rem]">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            {onBack && <button type="button" onClick={onBack} className="mb-3 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm hover:border-service-primary hover:text-service-primary">← 진행 현황으로</button>}
            <div className="text-xl font-black text-slate-900">자가진단 결과 — {partnerName}</div>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
              <span className="h-2 w-2 rounded-full" style={{ background: si.dot }} />
              <strong style={{ color: si.color }}>{si.label}</strong>
              <span>· 증빙 제출 대상 질의의 설문 답변과 증빙자료를 대조 검토합니다.</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {!hideWorkflowActions && <button type="button" onClick={onOpenMail} className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:border-service-primary hover:text-service-primary">
              메일 관리
              {reuploads.length > 0 && <span className="ml-2 rounded-full bg-service-primary px-2 py-0.5 text-[10px] text-white">{reuploads.length}</span>}
            </button>}
            <div className={`rounded-lg border px-4 py-2.5 text-xs font-semibold ${reuploadedQuestionIds.length > 0 ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-gray-200 bg-white text-gray-600'}`}>
              {reuploadedQuestionIds.length > 0 ? <>확인해야 할 증빙 <strong>{reuploadedQuestionIds.length}건</strong></> : <>증빙 질의 <strong className="text-slate-900">{questions.filter((question) => question.file).length}건</strong></>}
            </div>
            <button type="button" onClick={() => { setConsistencyDone(true); onConsistencyComplete?.(); }} className={`rounded-lg px-4 py-2.5 text-xs font-bold text-white ${consistencyDone ? 'bg-emerald-600' : 'bg-slate-800 hover:bg-slate-900'}`}>
              {consistencyDone ? '정합성 검토 완료됨' : '정합성 검토 완료'}
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {TOP_FOLDERS.map((folder) => (
            <button type="button" key={folder.key} onClick={() => { setSelectedFolder(folder.key); setOpenedFileId(null); }} className={`min-h-11 min-w-36 flex-1 whitespace-nowrap rounded-full border px-5 py-2 text-sm font-semibold ${selectedFolder === folder.key ? 'border-service-primary bg-service-primary text-white' : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'}`}>
              {folder.label}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <div className="text-base font-black text-slate-900">AI 증빙자료 1차 검수</div>
            <div className="mt-1 text-xs text-gray-500">설문 답변과 제출 증빙의 내용·기간·수치 불일치를 자동으로 확인합니다.</div>
          </div>
          <button type="button" onClick={() => setAiReviewed(true)} className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700">AI 1차 검수</button>
        </div>

        {aiReviewed && (
          <div className="mt-3 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 font-black text-white">!</span>
            AI 1차 검수가 완료되었습니다. 재확인이 필요한 {reviewTargets.length}개 증빙자료를 하이라이팅했습니다.
          </div>
        )}

        <div className="mt-7 space-y-8 pb-10">
          {visibleSections.map((section) => (
            <section key={section}>
              <div className="mb-4 flex items-center gap-2"><div className="h-5 w-1.5 rounded-full bg-service-primary" /><div className="text-lg font-black text-gray-900">{section}</div></div>
              <div className="space-y-4">
                {visibleQuestions.filter((question) => question.catLabel === section).map((question) => {
                  const flagged = aiReviewed && (question.aiStatus === 'needs-review' || !question.file?.verified);
                  const reuploaded = reuploadedQuestionIds.includes(question.id);
                  const reuploadRequested = reuploads.some((request) => request.questionId === question.id);
                  const opened = openedFileId === question.id;
                  const questionNumber = visibleQuestions.indexOf(question) + 1;
                  const folderLabel = TOP_FOLDERS.find((folder) => folder.key === selectedFolder)?.label ?? selectedFolder;
                  const locationLabel = `${folderLabel} > ${question.catLabel} > ${questionNumber}번 문항`;
                  return (
                    <article key={question.id} className={`rounded-2xl border bg-white p-6 shadow-sm ${reuploaded ? 'border-blue-500 bg-blue-50/20 ring-2 ring-blue-100' : flagged ? 'border-amber-400 ring-2 ring-amber-100' : 'border-gray-200'}`}>
                      <div className="flex items-start gap-4">
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${flagged ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'}`}>{visibleQuestions.indexOf(question) + 1}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="text-base font-black leading-7 text-gray-900">{getQuestionCode(question)}) {question.text}</div>
                            <div className="flex flex-wrap gap-2">
                              {reuploaded && <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-black text-blue-800">재업로드됨 · 미확인</span>}
                              {flagged && <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-black text-amber-800">AI 재검수 필요</span>}
                            </div>
                          </div>
                          <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                            <div className="text-xs font-bold text-gray-500">협력사 설문 답변</div>
                            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                              {question.answers?.map((answer) => <div key={answer.label} className="flex items-center gap-2 text-sm text-gray-600"><span className="flex h-4 w-4 items-center justify-center border border-service-primary bg-service-primary text-[10px] text-white">✓</span><span>{answer.label}</span><strong className="text-slate-800">{answer.value}</strong></div>)}
                            </div>
                          </div>
                          <div className="mt-3 rounded-xl border border-red-100 bg-red-50/40 p-4">
                            <div className="mb-3 text-xs font-bold text-gray-700">정합성 검토 감점</div>
                            {(question.answers?.length ?? 0) > 1 ? question.answers?.map(answer => {
                              const penaltyKey = `${question.id}:${answer.label}`;
                              return <PenaltySelector key={penaltyKey} label={answer.label} value={penalties[penaltyKey] ?? '미감점'} onChange={value => setPenalties(current => ({ ...current, [penaltyKey]: value }))} />;
                            }) : <PenaltySelector label="문항 전체" value={penalties[question.id] ?? '미감점'} onChange={value => setPenalties(current => ({ ...current, [question.id]: value }))} />}
                          </div>
                          {question.file && (
                            <div className="mt-4">
                              <div className="mb-2 text-xs font-bold text-gray-500">제출 증빙자료</div>
                              <div className="flex flex-wrap items-center gap-2">
                                <button type="button" onClick={() => { setOpenedFileId(opened ? null : question.id); if (reuploaded) onAcknowledgeReupload(question.id); }} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold ${reuploaded ? 'border-blue-500 bg-blue-600 text-white shadow-sm' : flagged ? 'border-amber-400 bg-amber-50 text-amber-900' : opened ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-gray-200 bg-white text-blue-700 hover:border-blue-300'}`}>
                                  <span aria-hidden="true">▤</span>{question.file.name}
                                  {reuploaded && <span className="rounded bg-white/20 px-1.5 py-0.5 text-[9px]">NEW</span>}
                                  {flagged && <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[9px] text-white">확인 필요</span>}
                                </button>
                                {!hideWorkflowActions && <button type="button" onClick={() => onToggleReupload({ questionId: question.id, catId: question.id, locationLabel, questionText: question.text, fileName: question.file!.name })} className={`rounded-lg border px-3 py-2 text-xs font-bold ${reuploadRequested ? 'border-red-300 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
                                  {reuploadRequested ? '재업로드 요청 취소' : '재업로드 요청'}
                                </button>}
                              </div>
                            </div>
                          )}
                          {opened && openedQuestion?.file && (
                            <div className="mt-4 h-[32rem] overflow-hidden rounded-xl border border-blue-200">
                              <MockDocViewer file={openedQuestion.file} answers={openedQuestion.answers} partnerName={partnerName} onClose={() => setOpenedFileId(null)} />
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
          {visibleQuestions.length === 0 && <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-sm text-gray-400">이 폴더에는 증빙 제출 대상 질의가 없습니다.</div>}
        </div>
      </div>
    </main>
  );
}

function PenaltySelector({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <div className="mb-2 flex flex-wrap items-center gap-3 last:mb-0"><span className="min-w-28 text-xs font-semibold text-gray-600">{label}</span>{['미감점', '50% 감점', '100% 감점'].map(option => <label key={option} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold ${value === option ? 'border-red-400 bg-white text-red-700' : 'border-gray-200 bg-white text-gray-500'}`}><input type="radio" checked={value === option} onChange={() => onChange(option)} name={`penalty-${label}`} className="accent-red-500" />{option}</label>)}</div>;
}
