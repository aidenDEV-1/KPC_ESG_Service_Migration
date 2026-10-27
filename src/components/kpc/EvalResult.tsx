import { useState } from 'react';
import * as XLSX from 'xlsx';
import ReportModal from './ReportModal';
import SurveyResultView from './SurveyResultView';

interface Props {
  onBack: () => void;
  campaignName?: string;
  campaignPeriod?: string;
  onReviewPartner?: (company: string) => void;
}

// Simple line chart using SVG
function LineChart() {
  // X: 평균/최고점/최저점, Y: score
  const points: [number, number][] = [
    [60, 120],  // 평균 65.9
    [200, 10],  // 최고점 99.8
    [340, 170], // 최저점 14.5
  ];
  const toSvg = ([x, y]: [number, number]) => `${x},${y}`;
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#333', marginBottom: 8, textAlign: 'center' }}>전체기업 종합점수</div>
      <svg width="100%" height="200" viewBox="0 0 420 200" style={{ display: 'block' }}>
        {/* Grid lines */}
        {[0, 50, 100, 150, 200].map(y => (
          <line key={y} x1="40" y1={y} x2="380" y2={y} stroke="#f0f0f0" strokeWidth="1" />
        ))}
        {/* Y axis labels */}
        {[[0, '100'], [50, '75'], [100, '50'], [150, '25'], [190, '0']].map(([y, label]) => (
          <text key={y} x="32" y={Number(y) + 4} textAnchor="end" fontSize="9" fill="#999">{label}</text>
        ))}
        {/* Line */}
        <polyline
          points={points.map(toSvg).join(' ')}
          fill="none"
          stroke="#e63946"
          strokeWidth="2"
        />
        {/* Dots */}
        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="5" fill="#e63946" stroke="#fff" strokeWidth="2" />
        ))}
        {/* Score labels on dots */}
        {[['65.9', 60, 110], ['99.8', 200, 4], ['14.5', 340, 165]].map(([val, x, y]) => (
          <text key={val} x={Number(x)} y={Number(y)} textAnchor="middle" fontSize="10" fill="#e63946" fontWeight="700">{val}</text>
        ))}
        {/* X axis labels */}
        {[['평균', 60], ['최고점', 200], ['최저점', 340]].map(([label, x]) => (
          <text key={label} x={Number(x)} y="195" textAnchor="middle" fontSize="10" fill="#666">{label}</text>
        ))}
      </svg>
    </div>
  );
}

// Bar chart for domain averages
function DomainBarChart() {
  const bars = [
    { label: '인권', value: 81.6 },
    { label: '안전', value: 71.9 },
    { label: '환경', value: 55.6 },
    { label: '윤리', value: 54.7 },
  ];
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#333', marginBottom: 8, textAlign: 'center' }}>영역별 평균점수</div>
      <svg width="100%" height="200" viewBox="0 0 280 200" style={{ display: 'block' }}>
        {/* Grid */}
        {[0, 50, 100, 150, 190].map(y => (
          <line key={y} x1="30" y1={y} x2="270" y2={y} stroke="#f0f0f0" strokeWidth="1" />
        ))}
        {[[0, '100'], [50, '75'], [100, '50'], [150, '25'], [190, '0']].map(([y, label]) => (
          <text key={y} x="25" y={Number(y) + 4} textAnchor="end" fontSize="9" fill="#999">{label}</text>
        ))}
        {bars.map((b, i) => {
          const barH = (b.value / 100) * 190;
          const x = 50 + i * 55;
          return (
            <g key={b.label}>
              <rect x={x} y={190 - barH} width="36" height={barH} fill="#e63946" rx="2" />
              <text x={x + 18} y={185 - barH} textAnchor="middle" fontSize="10" fill="#e63946" fontWeight="700">{b.value}</text>
              <text x={x + 18} y="198" textAnchor="middle" fontSize="10" fill="#666">{b.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const COMPANIES = [
  { no: 1, company: 'TEST COMPANY 01', total: 67.2, labor: 93.9, safety: 84.6, env: 42.7, ethics: 47.6, reviewed: { total: 62.2, labor: 88.9, safety: 79.6, env: 40.7, ethics: 43.6 }, audit: 'Y', task: '작성 완료' },
  { no: 2, company: 'TEST COMPANY 02', total: 63.1, labor: 62.2, safety: 98.1, env: 38.8, ethics: 53.2, reviewed: null, audit: 'N', task: '작성 중' },
  { no: 3, company: 'TEST COMPANY 03', total: 78.4, labor: 82.1, safety: 80.5, env: 73.8, ethics: 77.2, reviewed: { total: 76.4, labor: 80.1, safety: 78.5, env: 72.8, ethics: 75.2 }, audit: 'N', task: '미작성' },
];

function ScoreDistributionChart() {
  const bins = [
    ['20점 미만', 9], ['20~30점', 4], ['30~40점', 15], ['40~50점', 16], ['50~60점', 11],
    ['60~70점', 28], ['70~80점', 19], ['80~90점', 17], ['90점 이상', 25],
  ] as const;
  return (
    <div className="px-5 pb-5">
      <div className="mb-3 text-sm font-bold">협력사 점수 분포</div>
      <div className="flex h-52 items-end gap-2 border-b border-gray-300 px-3">
        {bins.map(([label, count], index) => <div key={label} className="flex h-full flex-1 flex-col items-center justify-end"><strong className="mb-1 text-xs text-gray-700">{count}</strong><div className={`w-3/5 min-w-5 rounded-t ${index <= 2 ? 'bg-red-500' : index <= 5 ? 'bg-amber-400' : 'bg-emerald-500'}`} style={{ height: `${count * 5}px` }} /><span className="my-2 whitespace-nowrap text-[9px] text-gray-600">{label}</span></div>)}
      </div>
      <div className="mt-2 text-center text-[10px] text-gray-400">점수 구간별 협력사 수 (단위: 개사)</div>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

export default function EvalResult({
  onBack,
  campaignName = 'TEST ESG 캠페인 01',
  campaignPeriod = '2026-07-29 ~ 2026-08-21',
  onReviewPartner,
}: Props) {
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSurveyResult, setShowSurveyResult] = useState(false);
  const improvementEnabled = true;

  const PDF_URL = '/downloads/sample_report.pdf';

  const downloadPdf = () => {
    const link = document.createElement('a');
    link.href = PDF_URL;
    link.download = '결과보고서.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const summaryRows = [{ label: '전체평균', total: 65.9, labor: 81.6, safety: 71.9, env: 55.6, ethics: 54.7 }];
  const downloadCombinedData = () => {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(summaryRows), '평가결과 요약표');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(COMPANIES.map(item => ({ 기업명: item.company }))), '참가기업 기본정보');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(COMPANIES), '평가 결과');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(COMPANIES.map(item => ({ 기업명: item.company, 인권: item.labor, 안전: item.safety, 환경: item.env, 윤리: item.ethics }))), '참가기업 수치 DATA');
    XLSX.writeFile(workbook, '종합_결과_DATA.xlsx');
  };

  return (
    <div className="min-h-full w-full">
      <div className="sticky top-0 z-20 flex min-h-14 items-center gap-4 border-b border-gray-200 bg-white px-6 py-2 shadow-sm">
        <button onClick={onBack} className="inline-flex items-center gap-2 rounded-lg bg-[#1a3055] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#243f6d]">
          <span aria-hidden="true">←</span> 캠페인 목록
        </button>
        <div className="min-w-0"><div className="truncate text-sm font-bold text-gray-900">{campaignName}</div><div className="text-[11px] text-gray-400">{campaignPeriod}</div></div>
      </div>

      {/* Main content */}
      <div className="p-6">

        {/* Score summary panel */}
        <div className="border rounded bg-white mb-5" style={{ borderColor: '#e0e0e0' }}>
          {/* Summary header */}
          <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: '#e8e8e8' }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 700 }}>전체점수 요약</span>
              <span style={{ fontSize: 11, color: '#e63946', marginLeft: 8 }}>
                - 최종 자료는 관리자에게 요청하여 점수 집계 / 캠페인 완료 후 사용하세요
              </span>
            </div>
            <button
              onClick={() => setSummaryExpanded(v => !v)}
              style={{ color: '#555', fontSize: 18, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {summaryExpanded ? '∧' : '∨'}
            </button>
          </div>

          {/* Expanded charts (SADM_202) */}
          {summaryExpanded && (
            <div className="px-5 py-4 border-b" style={{ borderColor: '#e8e8e8' }}>
              <div className="flex gap-6">
                <LineChart />
                <DomainBarChart />
              </div>
            </div>
          )}

          {/* Summary table */}
          <table className="w-full text-sm border-collapse">
            <thead style={{ background: '#f8f8f8' }}>
              <tr>
                {['구분', '총점', '1.인권', '2.안전', '3.환경', '4.윤리'].map(h => (
                  <th key={h} className="px-4 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e8e8e8', borderRight: '1px solid #f0f0f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summaryRows.map(row => (
                <tr key={row.label} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td className="px-4 py-2 text-center text-xs">{row.label}</td>
                  <td className="px-4 py-2 text-center text-xs">{row.total}</td>
                  <td className="px-4 py-2 text-center text-xs">{row.labor}</td>
                  <td className="px-4 py-2 text-center text-xs">{row.safety}</td>
                  <td className="px-4 py-2 text-center text-xs">{row.env}</td>
                  <td className="px-4 py-2 text-center text-xs">{row.ethics}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-gray-100 pt-4"><ScoreDistributionChart /></div>

          {/* Action buttons row */}
          <div className="flex gap-2 px-5 py-3 flex-wrap">
            <button type="button" onClick={downloadCombinedData} className="inline-flex items-center gap-1 rounded bg-[#167d8d] px-3 py-1.5 text-xs font-medium text-white">종합 결과 DATA <DownloadIcon /></button>
            {['개선과제 종합DATA', '보고서 일괄 다운로드'].map(b => (
              <button
                key={b}
                type="button"
                onClick={b === '보고서 일괄 다운로드' ? downloadPdf : downloadCombinedData}
                className="inline-flex items-center justify-center gap-1 rounded px-3 py-1.5 text-xs text-white font-medium"
                style={{ background: '#167d8d' }}
              >
                {b}
                <DownloadIcon />
              </button>
            ))}
          </div>
        </div>

        {/* Filter row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-2">
            <select className="border rounded px-2 py-1 text-xs" style={{ borderColor: '#ccc' }}>
              <option>제출한</option>
              <option>전체</option>
            </select>
            <select className="border rounded px-2 py-1 text-xs" style={{ borderColor: '#ccc' }}>
              <option>점수</option>
              <option>기업명</option>
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <input type="text" placeholder="업체명 검색" className="border rounded px-2 py-1 text-xs" style={{ borderColor: '#ccc', width: 120 }} />
            <button className="rounded px-3 py-1 text-xs text-white" style={{ background: '#3d4d5c' }}>검색</button>
            <button className="rounded px-3 py-1 text-xs border" style={{ borderColor: '#ccc', color: '#555' }}>검색초기화</button>
          </div>
        </div>

        {/* Company table (SADM_201 action buttons) */}
        <div className="overflow-x-auto rounded border bg-white" style={{ borderColor: '#e0e0e0' }}>
          <table className="w-full min-w-[92rem] border-collapse text-sm">
            <thead style={{ background: '#f8f8f8' }}>
              <tr>
                <th rowSpan={2} className="border-b border-r px-3 py-2 text-xs">NO.</th><th rowSpan={2} className="border-b border-r px-3 py-2 text-xs">기업명</th>
                <th colSpan={5} className="border-b border-r px-3 py-2 text-xs text-[#1a3055]">자가진단 결과</th>
                <th colSpan={5} className="border-b border-r px-3 py-2 text-xs text-[#e63946]">정합성 검토 후</th>
                <th rowSpan={2} className="border-b border-r px-3 py-2 text-xs">점수 GAP</th><th rowSpan={2} className="border-b border-r px-3 py-2 text-xs">현장실사<br />대상 여부</th>
                {improvementEnabled && <th rowSpan={2} className="border-b border-r px-3 py-2 text-xs">개선과제<br />작성 상태</th>}<th rowSpan={2} className="border-b px-3 py-2 text-xs">상세정보</th>
              </tr>
              <tr>
                {['총점', '인권', '안전', '환경', '윤리', '총점', '인권', '안전', '환경', '윤리'].map((h, index) => <th key={`${h}-${index}`} className="border-b border-r px-2 py-2 text-[10px] font-medium text-gray-500">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {COMPANIES.map(c => (
                <tr key={c.no} style={{ borderBottom: '1px solid #f5f5f5' }} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-center text-xs">{c.no}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-center text-xs font-bold">{c.company}</td>
                  {[c.total, c.labor, c.safety, c.env, c.ethics].map((value, index) => <td key={`self-${index}`} className="border-l border-gray-100 px-2 py-2 text-center text-xs">{value}</td>)}
                  {(c.reviewed ? [c.reviewed.total, c.reviewed.labor, c.reviewed.safety, c.reviewed.env, c.reviewed.ethics] : ['-', '-', '-', '-', '-']).map((value, index) => <td key={`review-${index}`} className="border-l border-gray-100 px-2 py-2 text-center text-xs font-bold">{value}</td>)}
                  <td className="px-3 py-2 text-center text-xs font-bold text-red-600">{c.reviewed ? `${(c.reviewed.total - c.total).toFixed(1)}` : '-'}</td>
                  <td className="px-3 py-2 text-center text-xs">{c.audit}</td>
                  {improvementEnabled && <td className={`px-3 py-2 text-center text-xs font-bold ${c.task === '작성 완료' ? 'text-emerald-700' : c.task === '작성 중' ? 'text-amber-600' : 'text-gray-400'}`}>{c.task}</td>}
                  <td className="px-3 py-3 text-center">
                    <div className="flex gap-1 justify-center flex-wrap">
                      <button
                        className="rounded px-2 py-0.5 text-white text-xs"
                        style={{ background: '#3d4d5c', fontSize: 10 }}
                        onClick={() => setShowSurveyResult(true)}
                      >
                        설문 결과
                      </button>
                      <button
                        className="rounded px-2 py-0.5 text-white text-xs"
                        style={{ background: '#3d4d5c', fontSize: 10 }}
                        onClick={() => onReviewPartner?.(c.company)}
                      >
                        정합성 검토
                      </button>
                      {improvementEnabled && <button type="button" onClick={() => { const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet([{ 기업명: c.company, 개선과제: 'ESG 규정 및 증빙관리 체계 보완', 상태: c.no === 1 ? '작성 중' : '미작성' }]), '개선과제'); XLSX.writeFile(workbook, `${c.company}_개선과제.xlsx`); }} className="rounded bg-slate-700 px-2 py-0.5 text-[10px] text-white">개선과제</button>}
                      <button
                        className="inline-flex items-center justify-center gap-1 rounded px-2 py-0.5 text-white text-xs"
                        style={{ background: '#167d8d', fontSize: 10 }}
                        onClick={() => setShowReportModal(true)}
                        title="레포트 생성 및 다운로드"
                      >
                        결과보고서
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SADM_230: 결과보고서 modal */}
      {showReportModal && (
        <ReportModal onClose={() => setShowReportModal(false)} showConsistencyReview={localStorage.getItem(`campaign-consistency-review:${campaignName}`) === 'true' || localStorage.getItem('consistency-review-enabled') === 'true'} />
      )}


      {/* SADM_240/241: 설문결과 full-screen view */}
      {showSurveyResult && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: '#fff', overflow: 'auto' }}>
          <SurveyResultView onClose={() => setShowSurveyResult(false)} />
        </div>
      )}
    </div>
  );
}
