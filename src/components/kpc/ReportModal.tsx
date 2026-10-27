import { useRef, useState } from 'react';

interface Props {
  onClose: () => void;
  showConsistencyReview?: boolean;
}

function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      width="13"
      height="13"
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

// Simple donut using SVG
function Donut({ score, color, label }: { score: number; color: string; label: string }) {
  const r = 36;
  const cx = 44;
  const cy = 44;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="88" height="88">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e8e8e8" strokeWidth="10" />
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
        />
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#222">{score}</text>
      </svg>
      <div style={{ fontSize: 12, color: '#444', textAlign: 'center' }}>{label}</div>
    </div>
  );
}

// Horizontal score bar
function ScoreBar({ my, avg, max, color = '#e63946' }: { my: number; avg: number; max: number; color?: string }) {
  return (
    <div className="relative" style={{ height: 28, marginBottom: 6 }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 10, height: 8, background: '#f0f0f0', borderRadius: 4 }} />
      <div style={{ position: 'absolute', left: 0, top: 10, width: `${my}%`, height: 8, background: color, borderRadius: 4 }} />
      {/* avg marker */}
      <div style={{ position: 'absolute', left: `${avg}%`, top: 4, transform: 'translateX(-50%)' }}>
        <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '8px solid #1e6adc' }} />
      </div>
      {/* max marker */}
      <div style={{ position: 'absolute', left: `${max}%`, top: 4, transform: 'translateX(-50%)' }}>
        <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '8px solid #222' }} />
      </div>
      {/* my dot */}
      <div style={{ position: 'absolute', left: `${my}%`, top: 7, transform: 'translateX(-50%)', width: 14, height: 14, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#fff', fontSize: 9, fontWeight: 700 }}>{my}</span>
      </div>
      <div className="flex justify-between" style={{ marginTop: 20, fontSize: 10, color: '#888' }}>
        <span style={{ color }}>나의점수 {my}</span>
        <span style={{ color: '#1e6adc' }}>평균점수 {avg}</span>
        <span>최고점수 {max}</span>
      </div>
    </div>
  );
}

// Vertical bar chart for distribution
function DistBar({ ranges }: { ranges: { label: string; count: number }[] }) {
  const maxCount = Math.max(...ranges.map(r => r.count), 1);
  return (
    <div className="flex items-end gap-4" style={{ height: 80 }}>
      {ranges.map(r => (
        <div key={r.label} className="flex flex-col items-center gap-1">
          <span style={{ fontSize: 10, color: '#555' }}>{r.count}</span>
          <div style={{ width: 36, height: r.count > 0 ? Math.max((r.count / maxCount) * 60, 4) : 4, background: r.count > 0 ? '#e63946' : '#ddd', borderRadius: 2 }} />
          <span style={{ fontSize: 10, color: '#888' }}>{r.label}</span>
        </div>
      ))}
    </div>
  );
}

// Tag component
function Tag({ level }: { level: '우수' | '보통' | '미흡' }) {
  const colors: Record<string, string> = { 우수: '#e63946', 보통: '#f0a500', 미흡: '#888' };
  return (
    <span style={{ display: 'inline-block', background: colors[level], color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: 2, fontWeight: 700 }}>{level}</span>
  );
}

// Section header (blue bg)
function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ background: '#1e4a7a', color: '#fff', padding: '8px 16px', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
      {title}
    </div>
  );
}

// Subsection header with 정책/인증/계획 or 활동 label
function SubHeader({ type, level }: { type: '정책/인증/계획' | '활동'; level: '우수' | '보통' | '미흡' }) {
  return (
    <div className="flex items-center gap-2" style={{ padding: '6px 0', marginBottom: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: '#333' }}>{type}</span>
      <Tag level={level} />
    </div>
  );
}

// Generic table for detail items
function DetailTable({ rows }: { rows: { indicator: string; status: '충족' | '미충족' | string; opinion?: string }[] }) {
  return (
    <table className="w-full" style={{ fontSize: 11, borderCollapse: 'collapse', marginBottom: 12 }}>
      <thead>
        <tr style={{ background: '#f5f5f5' }}>
          <th style={{ padding: '5px 8px', borderBottom: '1px solid #e0e0e0', textAlign: 'left', fontWeight: 600, width: '40%' }}>지표</th>
          <th style={{ padding: '5px 8px', borderBottom: '1px solid #e0e0e0', textAlign: 'center', fontWeight: 600, width: 60 }}>상태</th>
          <th style={{ padding: '5px 8px', borderBottom: '1px solid #e0e0e0', textAlign: 'left', fontWeight: 600 }}>문항진단의견</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
            <td style={{ padding: '5px 8px', color: '#444' }}>{r.indicator}</td>
            <td style={{ padding: '5px 8px', textAlign: 'center', color: r.status === '충족' ? '#1e6adc' : '#e63946' }}>{r.status}</td>
            <td style={{ padding: '5px 8px', color: '#555' }}>{r.opinion || ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Domain summary table (분야별 평가 종합)
function DomainTable({ rows }: { rows: { name: string; mine: number | string; avg: number | string; max: number | string }[] }) {
  return (
    <table className="w-full" style={{ fontSize: 11, borderCollapse: 'collapse', marginBottom: 16 }}>
      <thead>
        <tr style={{ background: '#f5f5f5' }}>
          <th style={{ padding: '5px 8px', borderBottom: '1px solid #e0e0e0', textAlign: 'center', fontWeight: 600 }}>구분</th>
          <th style={{ padding: '5px 8px', borderBottom: '1px solid #e0e0e0', textAlign: 'center', fontWeight: 600 }}>평가</th>
          <th style={{ padding: '5px 8px', borderBottom: '1px solid #e0e0e0', textAlign: 'center', fontWeight: 600 }}>평가기업 평균점수</th>
          <th style={{ padding: '5px 8px', borderBottom: '1px solid #e0e0e0', textAlign: 'center', fontWeight: 600 }}>평가기업 최고점수</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #f0f0f0', background: r.name === '종합점수' ? '#f8f8f8' : undefined }}>
            <td style={{ padding: '5px 8px', color: '#444', fontWeight: r.name === '종합점수' ? 700 : undefined }}>{r.name}</td>
            <td style={{ padding: '5px 8px', textAlign: 'center', color: '#444' }}>{r.mine}</td>
            <td style={{ padding: '5px 8px', textAlign: 'center', color: '#444' }}>{r.avg}</td>
            <td style={{ padding: '5px 8px', textAlign: 'center', color: '#444' }}>{r.max}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Completion rate table used in 세부 평가 for domain summary
function CompletionTable({ rows }: { rows: { cat: string; total: number; fulfilled: number; rate: string }[] }) {
  return (
    <table className="w-full" style={{ fontSize: 11, borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#f5f5f5' }}>
          <th style={{ padding: '5px 8px', borderBottom: '1px solid #e0e0e0', fontWeight: 600, textAlign: 'center' }}>구분</th>
          <th style={{ padding: '5px 8px', borderBottom: '1px solid #e0e0e0', fontWeight: 600, textAlign: 'center' }}>항목 수</th>
          <th style={{ padding: '5px 8px', borderBottom: '1px solid #e0e0e0', fontWeight: 600, textAlign: 'center' }}>충족 항목 수</th>
          <th style={{ padding: '5px 8px', borderBottom: '1px solid #e0e0e0', fontWeight: 600, textAlign: 'center' }}>충족률</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
            <td style={{ padding: '5px 8px', color: '#444' }}>{r.cat}</td>
            <td style={{ padding: '5px 8px', textAlign: 'center' }}>{r.total}</td>
            <td style={{ padding: '5px 8px', textAlign: 'center' }}>{r.fulfilled}</td>
            <td style={{ padding: '5px 8px', textAlign: 'center' }}>{r.rate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Domain detail section (for 세부 평가 항목 inside each domain)
function DomainDetailSection({ domainTitle, score, avg, max, distRanges, completionRows, subsections }: {
  domainTitle: string;
  score: number;
  avg: number;
  max: number;
  distRanges: { label: string; count: number }[];
  completionRows: { cat: string; total: number; fulfilled: number; rate: string }[];
  subsections: Array<{
    title: string;
    policy?: { level: '우수' | '보통' | '미흡'; rows: { indicator: string; status: string; opinion?: string }[] };
    activity?: { level: '우수' | '보통' | '미흡'; rows: { indicator: string; status: string; opinion?: string }[] };
    opinion?: string;
  }>;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#222', marginBottom: 8, borderBottom: '2px solid #e63946', paddingBottom: 6 }}>
        {domainTitle}
      </div>
      <div style={{ fontSize: 11, color: '#555', marginBottom: 12 }}>
        귀사는 {domainTitle.split(' ')[1]}분야에서 <span style={{ color: '#e63946', fontWeight: 700 }}>{score}</span>점을 획득하였으며,
        평가기업 내 상위 <span style={{ color: '#e63946', fontWeight: 700 }}>0%</span>입니다.
      </div>

      <div className="flex gap-6 mb-4">
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 8 }}>기업별 점수 분포</div>
          <DistBar ranges={distRanges} />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div style={{ fontSize: 28, fontWeight: 900, color: '#e63946' }}>{score} <span style={{ fontSize: 14, fontWeight: 400, color: '#888' }}>/100</span></div>
          <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>
            진단 결과 {score}점으로 평가대상 기업 최고 점수 대비 -{(max - score).toFixed(1)}점,<br />
            평가대상 기업 평균 점수 대비 -{Math.abs(score - avg).toFixed(1)}점입니다.
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        {/* Spider placeholder */}
        <div style={{ width: 140, height: 120, border: '1px solid #e0e0e0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
          <svg width="120" height="100" viewBox="0 0 120 100">
            {/* Hexagon spider */}
            {[0.3, 0.6, 1].map(s => (
              <polygon key={s} points={`60,${10 + (1 - s) * 30} ${60 + 40 * s},${25 + (1 - s) * 15} ${60 + 40 * s},${65 - (1 - s) * 15} 60,${80 - (1 - s) * 30} ${60 - 40 * s},${65 - (1 - s) * 15} ${60 - 40 * s},${25 + (1 - s) * 15}`}
              fill="none" stroke="#ddd" strokeWidth="1" />
            ))}
            <polygon points="60,32 75,42 72,58 60,65 48,58 45,42" fill="rgba(230,57,70,0.25)" stroke="#e63946" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="flex-1">
          <CompletionTable rows={completionRows} />
          <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>
            ※ 상기 항목 수와 하나의 상세 지표 항목 수는 "해당없음"의 응답 유무에 따라 일부 차이가 있을 수 있습니다.
          </div>
        </div>
      </div>

      {/* Subsections */}
      {subsections.map((sub, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <SectionHeader title={sub.title} />
          {sub.policy && (
            <>
              <SubHeader type="정책/인증/계획" level={sub.policy.level} />
              <DetailTable rows={sub.policy.rows as any} />
            </>
          )}
          {sub.activity && (
            <>
              <SubHeader type="활동" level={sub.activity.level} />
              <DetailTable rows={sub.activity.rows as any} />
            </>
          )}
          {sub.opinion !== undefined && (
            <div style={{ border: '1px solid #e0e0e0', borderRadius: 4, padding: 10, fontSize: 11, color: '#888', minHeight: 48 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#555', marginBottom: 4 }}>영역 진단 의견</div>
              {sub.opinion}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ReportModal({ onClose, showConsistencyReview = false }: Props) {
  const company = 'TEST COMPANY 01';
  const campaign = 'TEST ESG 캠페인 01';
  const reportContentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPdf = async () => {
    if (!reportContentRef.current || isDownloading) return;

    setIsDownloading(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const reportContent = reportContentRef.current;
      const canvas = await html2canvas(reportContent, {
        backgroundColor: '#ffffff',
        scale: 1.5,
        useCORS: true,
        width: reportContent.scrollWidth,
        height: reportContent.scrollHeight,
        windowWidth: reportContent.scrollWidth,
        windowHeight: reportContent.scrollHeight,
      });

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
      const margin = 8;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageWidth = pageWidth - margin * 2;
      const imageHeight = (canvas.height * imageWidth) / canvas.width;
      const printableHeight = pageHeight - margin * 2;
      const imageData = canvas.toDataURL('image/jpeg', 0.92);

      let pageOffset = 0;
      while (pageOffset < imageHeight) {
        if (pageOffset > 0) pdf.addPage();
        pdf.addImage(
          imageData,
          'JPEG',
          margin,
          margin - pageOffset,
          imageWidth,
          imageHeight,
          undefined,
          'FAST',
        );
        pageOffset += printableHeight;
      }

      pdf.save('TEST_COMPANY_01_ESG_결과보고서.pdf');
    } finally {
      setIsDownloading(false);
    }
  };

  const scorecard = { total: 52.2, labor: 75.6, safety: 84.6, env: 35.6, ethics: 12.8 };

  const laborRows = [
    { name: '인권경영체계', mine: 66.7, avg: 62.7, max: 66.7 },
    { name: '자발적근로', mine: 100.0, avg: 85.4, max: 100.0 },
    { name: '근로시간', mine: 87.5, avg: 80.6, max: 87.5 },
    { name: '아동근로자', mine: 66.7, avg: 72.2, max: 100.0 },
    { name: '임금및복리후생', mine: 75.0, avg: 71.3, max: 75.0 },
    { name: '인도적대우', mine: 60.0, avg: 62.5, max: 60.0 },
    { name: '다양성인정', mine: 50.0, avg: 55.3, max: 66.7 },
    { name: '결사의자유', mine: 66.7, avg: 60.2, max: 66.7 },
    { name: '종합점수', mine: 75.6, avg: 68.9, max: 75.6 },
  ];

  const safetyRows = [
    { name: '안전경영체계', mine: 100.0, avg: 80.3, max: 100.0 },
    { name: '안전조직관리', mine: 83.3, avg: 76.2, max: 100.0 },
    { name: '비상사태대비', mine: 100.0, avg: 88.5, max: 100.0 },
    { name: '육체적 과중 업무 통제', mine: 75.0, avg: 70.1, max: 100.0 },
    { name: '건강위험요인 통제', mine: 66.7, avg: 72.3, max: 83.3 },
    { name: '산업재해 예방', mine: 83.3, avg: 79.4, max: 100.0 },
    { name: '종합점수', mine: 84.6, avg: 78.2, max: 100.0 },
  ];

  const envRows = [
    { name: '환경경영체계', mine: 50.0, avg: 55.3, max: 75.0 },
    { name: '온실가스 배출관리', mine: 33.3, avg: 42.1, max: 66.7 },
    { name: '에너지 사용관리', mine: 40.0, avg: 48.5, max: 60.0 },
    { name: '수자원 관리', mine: 25.0, avg: 38.2, max: 50.0 },
    { name: '폐기물 관리', mine: 33.3, avg: 40.5, max: 66.7 },
    { name: '대기오염물질 관리', mine: 25.0, avg: 35.3, max: 50.0 },
    { name: '책임구매', mine: 20.0, avg: 32.6, max: 40.0 },
    { name: '종합점수', mine: 35.6, avg: 42.8, max: 64.3 },
  ];

  const ethicsRows = [
    { name: '윤리경영체계', mine: 17.9, avg: 34.8, max: 51.8 },
    { name: '정직 및 반부패', mine: 0, avg: 28.6, max: 57.1 },
    { name: '공정거래', mine: 47.8, avg: 54.3, max: 60.9 },
    { name: '지적재산보호', mine: 0, avg: 0, max: 0 },
    { name: '개인 정보 보호', mine: 0, avg: 50, max: 100 },
    { name: '지속가능한 원재료 조달', mine: 0, avg: 0, max: 0 },
    { name: '종합점수', mine: 12.8, avg: 33, max: 53.2 },
  ];

  return (
    <>
      {/* Dim overlay */}
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10000 }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10001,
          width: 880,
          maxWidth: '95vw',
          maxHeight: '90vh',
          background: '#fff',
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0" style={{ borderColor: '#e0e0e0' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#222' }}>결과보고서</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={downloadPdf}
              disabled={isDownloading}
              className="inline-flex items-center justify-center gap-1"
              style={{
                fontSize: 12,
                color: '#ffffff',
                background: '#167d8d',
                border: 0,
                borderRadius: 3,
                padding: '5px 10px',
                cursor: isDownloading ? 'wait' : 'pointer',
                opacity: isDownloading ? 0.7 : 1,
              }}
            >
              {isDownloading ? 'PDF 생성 중...' : 'PDF 다운로드'}
              {!isDownloading && <DownloadIcon />}
            </button>
            <button onClick={onClose} style={{ fontSize: 16, color: '#555', lineHeight: 1, cursor: 'pointer', background: 'none', border: 'none' }}>✕</button>
          </div>
        </div>

        {/* Scrollable body */}
        <div ref={reportContentRef} style={{ overflowY: 'auto', flex: 1, padding: '0 0 24px' }}>

          {/* Cover */}
          <div style={{
            position: 'relative',
            height: 220,
            background: 'linear-gradient(135deg, #0a2a4a 0%, #1a4a6a 40%, #2a6a8a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 8,
          }}>
            {/* Ocean-like decorative waves */}
            <svg style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} width="100%" height="60" viewBox="0 0 880 60" preserveAspectRatio="none">
              <path d="M0,30 C150,50 300,10 450,30 C600,50 750,10 880,30 L880,60 L0,60 Z" fill="rgba(255,255,255,0.05)" />
              <path d="M0,40 C150,20 300,55 450,40 C600,25 750,55 880,40 L880,60 L0,60 Z" fill="rgba(255,255,255,0.05)" />
            </svg>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', letterSpacing: 2, textTransform: 'uppercase' }}>ESG Supply Chain Assessment</div>
            <div style={{
              background: 'rgba(0,0,0,0.45)',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '16px 32px',
              borderRadius: 4,
              textAlign: 'center',
            }}>
              <div style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{campaign}</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 20, fontWeight: 900 }}>{company}</div>
            </div>
          </div>

          <div style={{ padding: '24px 32px' }}>

            {/* Section 1: 기업명 */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1a3055', borderBottom: '2px solid #1a3055', paddingBottom: 6, marginBottom: 16 }}>
                1. 기업명
              </div>
              <table className="w-full" style={{ fontSize: 12, borderCollapse: 'collapse', marginBottom: 20 }}>
                <tbody>
                  {[
                    ['기업명', company],
                    ['대표자명', 'TEST USER 01'],
                    ['사업자번호', '000-00-00001'],
                    ['업종', '제조업'],
                    ['소재지', '서울시 테스트구 테스트로 1'],
                    ['평가기간', '2026-07-29 ~ 2026-08-21'],
                  ].map(([k, v]) => (
                    <tr key={k} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '7px 12px', background: '#f8f8f8', fontWeight: 600, color: '#555', width: 140 }}>{k}</td>
                      <td style={{ padding: '7px 12px', color: '#333' }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Bar charts for 매출액/영업이익/임직원수 */}
              <div className="flex gap-6">
                {[
                  { label: '매출액 (백만원)', value: 5200, max: 10000 },
                  { label: '영업이익 (백만원)', value: 380, max: 1000 },
                  { label: '임직원수 (명)', value: 145, max: 500 },
                ].map(item => (
                  <div key={item.label} style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: '#555', marginBottom: 6 }}>{item.label}</div>
                    <div style={{ height: 80, display: 'flex', alignItems: 'flex-end', borderBottom: '1px solid #e0e0e0', paddingBottom: 4 }}>
                      <div style={{ width: 40, background: '#e63946', height: `${(item.value / item.max) * 72}px`, borderRadius: '2px 2px 0 0' }} />
                    </div>
                    <div style={{ fontSize: 11, color: '#333', marginTop: 4 }}>{item.value.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Scorecard */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1a3055', borderBottom: '2px solid #1a3055', paddingBottom: 6, marginBottom: 16 }}>
                2. Scorecard
              </div>

              <div className="flex gap-6 mb-6">
                {/* Overall score box */}
                <div style={{ border: '2px solid #e63946', borderRadius: 6, padding: '20px 24px', textAlign: 'center', minWidth: 140 }}>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Overall Score</div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: '#e63946', lineHeight: 1 }}>{scorecard.total}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>/100</div>
                </div>

                {/* Domain donuts */}
                <div className="flex gap-4 flex-wrap">
                  <Donut score={scorecard.labor} color="#e63946" label="1. 인권" />
                  <Donut score={scorecard.safety} color="#e63946" label="2. 안전" />
                  <Donut score={scorecard.env} color="#e63946" label="3. 환경" />
                  <Donut score={scorecard.ethics} color="#e63946" label="4. 윤리" />
                </div>
              </div>

              {showConsistencyReview && <div className="mb-5 overflow-hidden rounded border border-blue-200"><div className="bg-blue-50 px-4 py-2 text-xs font-bold text-blue-800">정합성 검토 결과 병기</div><table className="w-full border-collapse text-xs"><thead className="bg-gray-50"><tr>{['구분', '총점', '인권', '안전', '환경', '윤리'].map(value => <th key={value} className="border-b px-3 py-2 text-center">{value}</th>)}</tr></thead><tbody><tr>{['자가진단', scorecard.total, scorecard.labor, scorecard.safety, scorecard.env, scorecard.ethics].map((value, index) => <td key={index} className="border-b px-3 py-2 text-center">{value}</td>)}</tr><tr className="font-bold text-blue-800">{['정합성 검토 후', 49.2, 72.6, 80.6, 33.6, 10.8].map((value, index) => <td key={index} className="px-3 py-2 text-center">{value}</td>)}</tr></tbody></table></div>}

              {/* Score distribution */}
              <div className="flex gap-6 mb-4">
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 8 }}>기업별 점수 분포</div>
                  <DistBar ranges={[
                    { label: '0~20점', count: 1 },
                    { label: '21~40점', count: 0 },
                    { label: '41~60점', count: 1 },
                    { label: '61~80점', count: 0 },
                    { label: '81~100점', count: 0 },
                  ]} />
                </div>
              </div>

              {/* 종합의견 */}
              <div style={{ border: '1px solid #e0e0e0', borderRadius: 4, padding: 12, minHeight: 60 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 4 }}>종합의견</div>
                <div style={{ fontSize: 11, color: '#bbb' }}></div>
              </div>
            </div>

            {/* Section 3: 분야별 평가 종합 */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1a3055', borderBottom: '2px solid #1a3055', paddingBottom: 6, marginBottom: 16 }}>
                3. 분야별 평가 종합
              </div>

              {/* 1. 인권 */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 8 }}>1. 인권</div>
                <ScoreBar my={scorecard.labor} avg={68.9} max={75.6} />
                <DomainTable rows={laborRows} />
              </div>

              {/* 2. 안전 */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 8 }}>2. 안전</div>
                <ScoreBar my={scorecard.safety} avg={78.2} max={100} />
                <DomainTable rows={safetyRows} />
              </div>

              {/* 3. 환경 */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 8 }}>3. 환경</div>
                <ScoreBar my={scorecard.env} avg={42.8} max={64.3} />
                <DomainTable rows={envRows} />
              </div>

              {/* 4. 윤리 */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 8 }}>4. 윤리</div>
                <ScoreBar my={scorecard.ethics} avg={33} max={53.2} />
                <DomainTable rows={ethicsRows} />
              </div>
            </div>

            {/* Section 4: 세부 평가 항목 */}
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1a3055', borderBottom: '2px solid #1a3055', paddingBottom: 6, marginBottom: 20 }}>
                4. 세부 평가 항목
              </div>

              {/* 1. 인권 세부 */}
              <DomainDetailSection
                domainTitle="1. 인권"
                score={scorecard.labor}
                avg={68.9}
                max={75.6}
                distRanges={[
                  { label: '0~20점', count: 0 },
                  { label: '21~40점', count: 0 },
                  { label: '41~60점', count: 0 },
                  { label: '61~80점', count: 1 },
                  { label: '81~100점', count: 1 },
                ]}
                completionRows={[
                  { cat: '정책/인증/계획', total: 24, fulfilled: 18, rate: '75.0%' },
                  { cat: '거버넌스/매커니즘(체계)', total: 0, fulfilled: 0, rate: '0%' },
                  { cat: '활동', total: 16, fulfilled: 12, rate: '75.0%' },
                  { cat: '성과', total: 4, fulfilled: 3, rate: '75.0%' },
                  { cat: '목표', total: 0, fulfilled: 0, rate: '0%' },
                ]}
                subsections={[
                  {
                    title: '1.인권-1) 인권경영체계',
                    policy: {
                      level: '보통',
                      rows: [
                        { indicator: '인권경영 정책/방침이 있습니까?', status: '충족', opinion: '인권 경영 정책 보유' },
                        { indicator: '인권경영 조직/체계가 있습니까?', status: '충족', opinion: '인권 경영 조직 운영 중' },
                        { indicator: '인권 실사를 실시하고 있습니까?', status: '미충족', opinion: '' },
                      ],
                    },
                    activity: {
                      level: '보통',
                      rows: [
                        { indicator: '인권경영 교육을 실시하고 있습니까?', status: '충족', opinion: '연 1회 이상 교육 실시' },
                        { indicator: '인권 침해 구제 절차가 있습니까?', status: '충족', opinion: '고충처리 절차 운영 중' },
                      ],
                    },
                  },
                  {
                    title: '1.인권-2) 자발적근로',
                    policy: {
                      level: '우수',
                      rows: [
                        { indicator: '자발적 근로에 관한 정책이 있습니까?', status: '충족', opinion: '취업규칙에 명시' },
                        { indicator: '강제근로 방지 체계가 있습니까?', status: '충족', opinion: '절차 수립 및 운영' },
                      ],
                    },
                  },
                  {
                    title: '1.인권-3) 근로시간',
                    policy: {
                      level: '우수',
                      rows: [
                        { indicator: '법정 근로시간을 준수하고 있습니까?', status: '충족', opinion: '법정 근로시간 준수 확인' },
                        { indicator: '초과근무에 대한 관리 체계가 있습니까?', status: '충족', opinion: '초과근무 사전 승인제 운영' },
                        { indicator: '근로시간 기록을 관리하고 있습니까?', status: '충족', opinion: '전산으로 근태 관리' },
                      ],
                    },
                    activity: {
                      level: '우수',
                      rows: [
                        { indicator: '임직원에게 안전한 작업 수행을 위한 개인 안전 보호구를 지급하고 교육을 진행하고 있습니까?', status: '충족', opinion: '임직원에게 안전한 작업 수행을 위한 개인 안전 보호구를 지급하고 교육을 진행함' },
                        { indicator: '소음, 분진 등 유해 작업환경을 정기적으로 측정하고 있습니까?', status: '충족', opinion: '소음, 분진 등 유해 작업환경을 정기적으로 측정하고 있음' },
                      ],
                    },
                  },
                  {
                    title: '1.인권-4) 아동근로자',
                    policy: {
                      level: '보통',
                      rows: [
                        { indicator: '아동근로 금지 정책이 있습니까?', status: '충족', opinion: '취업규칙에 18세 미만 채용 금지 명시' },
                        { indicator: '채용 시 연령 확인 절차가 있습니까?', status: '충족', opinion: '신분증 확인 절차 운영' },
                        { indicator: '청소년 근로자 보호 규정이 있습니까?', status: '미충족', opinion: '' },
                      ],
                    },
                  },
                  {
                    title: '1.인권-5) 임금및복리후생',
                    policy: {
                      level: '보통',
                      rows: [
                        { indicator: '최저임금 이상의 임금을 지급하고 있습니까?', status: '충족', opinion: '최저임금법 준수' },
                        { indicator: '임금 체계가 투명하게 공개되어 있습니까?', status: '충족', opinion: '취업규칙에 임금 체계 명시' },
                      ],
                    },
                    activity: {
                      level: '보통',
                      rows: [
                        { indicator: '복리후생 프로그램을 운영하고 있습니까?', status: '충족', opinion: '식대, 교통비 등 복리후생 제공' },
                      ],
                    },
                  },
                  {
                    title: '1.인권-6) 인도적대우',
                    policy: {
                      level: '보통',
                      rows: [
                        { indicator: '직장 내 괴롭힘 방지 정책이 있습니까?', status: '충족', opinion: '직장 내 괴롭힘 방지법 준수' },
                        { indicator: '징계 절차가 공정하게 운영되고 있습니까?', status: '미충족', opinion: '' },
                      ],
                    },
                  },
                  {
                    title: '1.인권-7) 다양성인정',
                    policy: {
                      level: '보통',
                      rows: [
                        { indicator: '채용 시 차별 금지 정책이 있습니까?', status: '충족', opinion: '균등한 기회 제공 정책 보유' },
                        { indicator: '다양성 관련 교육을 실시하고 있습니까?', status: '미충족', opinion: '' },
                      ],
                    },
                  },
                  {
                    title: '1.인권-8) 결사의자유',
                    policy: {
                      level: '보통',
                      rows: [
                        { indicator: '노동조합 결성의 자유를 보장합니까?', status: '충족', opinion: '노동3권 보장' },
                        { indicator: '단체교섭 절차가 있습니까?', status: '충족', opinion: '단체협약 체결 절차 운영' },
                      ],
                    },
                    opinion: '',
                  },
                ]}
              />

              {/* 2. 안전 세부 */}
              <DomainDetailSection
                domainTitle="2. 안전"
                score={scorecard.safety}
                avg={78.2}
                max={100}
                distRanges={[
                  { label: '0~20점', count: 0 },
                  { label: '21~40점', count: 0 },
                  { label: '41~60점', count: 0 },
                  { label: '61~80점', count: 0 },
                  { label: '81~100점', count: 2 },
                ]}
                completionRows={[
                  { cat: '정책/인증/계획', total: 20, fulfilled: 17, rate: '85.0%' },
                  { cat: '거버넌스/매커니즘(체계)', total: 0, fulfilled: 0, rate: '0%' },
                  { cat: '활동', total: 18, fulfilled: 15, rate: '83.3%' },
                  { cat: '성과', total: 3, fulfilled: 3, rate: '100%' },
                  { cat: '목표', total: 0, fulfilled: 0, rate: '0%' },
                ]}
                subsections={[
                  {
                    title: '2.안전-1) 안전경영체계',
                    policy: {
                      level: '우수',
                      rows: [
                        { indicator: '안전보건 방침이 있습니까?', status: '충족', opinion: '안전보건 방침 수립·공표' },
                        { indicator: '안전보건 목표가 있습니까?', status: '충족', opinion: '연간 안전보건 목표 수립' },
                        { indicator: '안전보건 관리 조직이 있습니까?', status: '충족', opinion: '안전보건 담당자 지정·운영' },
                      ],
                    },
                    activity: {
                      level: '우수',
                      rows: [
                        { indicator: '안전보건 교육을 정기적으로 실시합니까?', status: '충족', opinion: '월 1회 이상 안전교육 실시' },
                        { indicator: '위험성 평가를 실시하고 있습니까?', status: '충족', opinion: '연 1회 이상 위험성 평가 실시' },
                      ],
                    },
                  },
                  {
                    title: '2.안전-2) 안전조직관리',
                    policy: {
                      level: '우수',
                      rows: [
                        { indicator: '안전관리자를 선임하였습니까?', status: '충족', opinion: '법정 안전관리자 선임' },
                        { indicator: '보건관리자를 선임하였습니까?', status: '충족', opinion: '법정 보건관리자 선임' },
                      ],
                    },
                  },
                  {
                    title: '2.안전-3) 비상사태대비',
                    activity: {
                      level: '우수',
                      rows: [
                        { indicator: '귀사의 비상대응 체계 구축 현황을 체크하여 주십시오.', status: '충족', opinion: '' },
                        { indicator: '화재 및 위험상황 대피 훈련을 정기 실시함', status: '충족', opinion: '' },
                        { indicator: '화재감지기, 소화기 등 소방시설을 적절히 설치함', status: '충족', opinion: '' },
                        { indicator: '소방시설 정기점검 및 기능 확인을 진행함', status: '충족', opinion: '' },
                        { indicator: '비상통로 및 탈출경로를 적절히 관리함', status: '충족', opinion: '' },
                        { indicator: '비상대응조직(ERT)를 위해 적절한 개인 안전 보호구를 지급하고, 비상대응에 대한 교육을 정기적으로 제공하고 있습니까?', status: '충족', opinion: '비상대응조직(ERT)를 위해 적절한 개인 안전 보호구를 지급하고, 비상대응에 대한 교육을 정기적으로 제공하고 있음' },
                      ],
                    },
                  },
                  {
                    title: '2.안전-4) 육체적 과중 업무 통제',
                    policy: {
                      level: '보통',
                      rows: [
                        { indicator: '저체 / 이준 / 계획', status: '충족', opinion: '' },
                        { indicator: '과중 업무 방지 정책이 있습니까?', status: '충족', opinion: '인간공학적 작업환경 개선 계획 수립' },
                      ],
                    },
                    activity: {
                      level: '보통',
                      rows: [
                        { indicator: '근골격계 질환 예방 프로그램을 운영합니까?', status: '충족', opinion: '스트레칭 교육 및 예방 활동 실시' },
                      ],
                    },
                  },
                  {
                    title: '2.안전-5) 건강위험요인 통제',
                    policy: {
                      level: '보통',
                      rows: [
                        { indicator: '작업환경 측정을 실시합니까?', status: '충족', opinion: '반기 1회 작업환경 측정 실시' },
                        { indicator: '특수건강검진을 실시합니까?', status: '미충족', opinion: '' },
                      ],
                    },
                  },
                  {
                    title: '2.안전-6) 산업재해 예방',
                    activity: {
                      level: '우수',
                      rows: [
                        { indicator: '산업재해 발생 시 보고 체계가 있습니까?', status: '충족', opinion: '재해 발생 즉시 보고 절차 운영' },
                        { indicator: '재해 원인 분석 및 재발 방지 대책을 수립합니까?', status: '충족', opinion: '재해 원인 분석 및 개선 조치 실시' },
                      ],
                    },
                    opinion: '',
                  },
                ]}
              />

              {/* 3. 환경 세부 */}
              <DomainDetailSection
                domainTitle="3. 환경"
                score={scorecard.env}
                avg={42.8}
                max={64.3}
                distRanges={[
                  { label: '0~20점', count: 0 },
                  { label: '21~40점', count: 1 },
                  { label: '41~60점', count: 1 },
                  { label: '61~80점', count: 0 },
                  { label: '81~100점', count: 0 },
                ]}
                completionRows={[
                  { cat: '정책/인증/계획', total: 18, fulfilled: 7, rate: '38.9%' },
                  { cat: '거버넌스/매커니즘(체계)', total: 0, fulfilled: 0, rate: '0%' },
                  { cat: '활동', total: 20, fulfilled: 6, rate: '30.0%' },
                  { cat: '성과', total: 4, fulfilled: 2, rate: '50.0%' },
                  { cat: '목표', total: 0, fulfilled: 0, rate: '0%' },
                ]}
                subsections={[
                  {
                    title: '3.환경-1) 환경경영체계',
                    policy: {
                      level: '보통',
                      rows: [
                        { indicator: '환경 방침이 있습니까?', status: '충족', opinion: '환경 방침 수립·공표' },
                        { indicator: '환경 목표 및 세부 목표가 있습니까?', status: '미충족', opinion: '' },
                        { indicator: 'ISO 14001 인증을 보유하고 있습니까?', status: '미충족', opinion: '' },
                      ],
                    },
                    activity: {
                      level: '보통',
                      rows: [
                        { indicator: '환경 교육을 정기적으로 실시합니까?', status: '충족', opinion: '연 1회 환경 교육 실시' },
                      ],
                    },
                  },
                  {
                    title: '3.환경-2) 온실가스 배출관리',
                    policy: {
                      level: '미흡',
                      rows: [
                        { indicator: '온실가스 배출량 산정·보고 체계가 있습니까?', status: '미충족', opinion: '' },
                        { indicator: '온실가스 감축 목표가 있습니까?', status: '미충족', opinion: '' },
                      ],
                    },
                    activity: {
                      level: '미흡',
                      rows: [
                        { indicator: '온실가스 감축 활동을 실시합니까?', status: '충족', opinion: 'LED 교체, 에너지 절약 캠페인 실시' },
                      ],
                    },
                  },
                  {
                    title: '3.환경-6) 대기오염물질 관리',
                    policy: {
                      level: '미흡',
                      rows: [
                        { indicator: '대기오염물질 배출 허가를 받았습니까?', status: '미충족', opinion: '' },
                        { indicator: '대기오염 방지 시설을 설치하였습니까?', status: '미충족', opinion: '' },
                      ],
                    },
                  },
                  {
                    title: '3.환경-7) 책임구매',
                    policy: {
                      level: '미흡',
                      rows: [
                        { indicator: '친환경 구매 정책이 있습니까?', status: '미충족', opinion: '' },
                        { indicator: '공급망 ESG 평가를 실시합니까?', status: '미충족', opinion: '' },
                      ],
                    },
                    activity: {
                      level: '미흡',
                      rows: [
                        { indicator: '원부자재의 출처를 파악하고 있습니까?', status: '미충족', opinion: '' },
                        { indicator: '친환경 원부자재 사용 비율을 높이기 위한 계획이 있습니까?', status: '미충족', opinion: '' },
                      ],
                    },
                    opinion: '',
                  },
                ]}
              />

              {/* 4. 윤리 세부 */}
              <DomainDetailSection
                domainTitle="4. 윤리"
                score={scorecard.ethics}
                avg={33}
                max={53.2}
                distRanges={[
                  { label: '0~20점', count: 1 },
                  { label: '21~40점', count: 0 },
                  { label: '41~60점', count: 1 },
                  { label: '61~80점', count: 0 },
                  { label: '81~100점', count: 0 },
                ]}
                completionRows={[
                  { cat: '정책/인증/계획', total: 13, fulfilled: 7, rate: '53.8%' },
                  { cat: '거버넌스/매커니즘(체계)', total: 0, fulfilled: 0, rate: '0%' },
                  { cat: '활동', total: 15, fulfilled: 5, rate: '33.3%' },
                  { cat: '성과', total: 2, fulfilled: 2, rate: '100%' },
                  { cat: '목표', total: 0, fulfilled: 0, rate: '0%' },
                ]}
                subsections={[
                  {
                    title: '4.윤리-1) 윤리경영체계',
                    policy: {
                      level: '미흡',
                      rows: [
                        { indicator: '윤리경영 방침/강령이 있습니까?', status: '충족', opinion: '윤리강령 보유 및 공표' },
                        { indicator: '윤리경영 교육을 실시합니까?', status: '미충족', opinion: '' },
                        { indicator: '부패 방지 정책이 있습니까?', status: '미충족', opinion: '' },
                      ],
                    },
                    activity: {
                      level: '미흡',
                      rows: [
                        { indicator: '내부 고발 채널이 있습니까?', status: '충족', opinion: '내부 신고 채널 운영 중' },
                        { indicator: '윤리 위반 조사 절차가 있습니까?', status: '미충족', opinion: '' },
                      ],
                    },
                  },
                  {
                    title: '4.윤리-2) 정직 및 반부패',
                    policy: {
                      level: '미흡',
                      rows: [
                        { indicator: '부패 방지 교육을 실시합니까?', status: '미충족', opinion: '' },
                        { indicator: '청탁 금지 정책이 있습니까?', status: '미충족', opinion: '' },
                      ],
                    },
                  },
                  {
                    title: '4.윤리-3) 공정거래',
                    policy: {
                      level: '보통',
                      rows: [
                        { indicator: '공정거래 정책이 있습니까?', status: '충족', opinion: '공정거래 자율준수 프로그램 운영' },
                        { indicator: '하도급 거래 공정화 절차가 있습니까?', status: '충족', opinion: '하도급법 준수 절차 운영' },
                      ],
                    },
                    activity: {
                      level: '보통',
                      rows: [
                        { indicator: '공정거래 교육을 실시합니까?', status: '충족', opinion: '연 1회 이상 교육 실시' },
                      ],
                    },
                  },
                  {
                    title: '4.윤리-5) 개인 정보 보호',
                    policy: {
                      level: '미흡',
                      rows: [
                        { indicator: '개인정보 보호 정책이 있습니까?', status: '미충족', opinion: '' },
                        { indicator: '개인정보 보호책임자를 지정하였습니까?', status: '미충족', opinion: '' },
                      ],
                    },
                    activity: {
                      level: '미흡',
                      rows: [
                        { indicator: '개인정보 보호 교육을 실시합니까?', status: '미충족', opinion: '' },
                      ],
                    },
                    opinion: '',
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
