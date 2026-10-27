import { useState } from 'react';

const years = [2023, 2024, 2025, 2026];
const assessmentAreas = ['L.노동', 'S.인권', 'E.환경', 'E.윤리', 'M.경영'] as const;
type AssessmentArea = (typeof assessmentAreas)[number];
type ScoreMetric = '총점' | AssessmentArea;

const companySeeds = [
  { name: '한국정밀', color: '#d64545', totals: [86, 78, 84, 94] },
  { name: '그린테크', color: '#2f80ed', totals: [72, 82, 76, 91] },
  { name: '미래부품', color: '#f59e0b', totals: [76, 75, 88, 80] },
  { name: '대상산업', color: '#7c3aed', totals: [58, 62, 83, 89] },
  { name: '한빛테크', color: '#12a594', totals: [45, 49, 67, 74] },
  { name: '신성에너지', color: '#64748b', totals: [66, 64, 72, 77] },
  { name: '다온소재', color: '#db2777', totals: [69, 81, 84, 86] },
  { name: '새론산업', color: '#0891b2', totals: [68, 71, 79, 89] },
  { name: '에코파트너', color: '#65a30d', totals: [74, 78, 83, 80] },
  { name: '세진모터스', color: '#dc2626', totals: [71, 78, null, null] },
  { name: '유진소재', color: '#ea580c', totals: [64, 73, null, null] },
  { name: '한솔전자', color: '#2563eb', totals: [null, 70, 79, 87] },
  { name: '태성금속', color: '#4f46e5', totals: [null, 62, 74, 82] },
  { name: '우림산업', color: '#9333ea', totals: [59, 68, 77, null] },
  { name: '제일테크', color: '#c026d3', totals: [73, 75, 84, null] },
  { name: '동아부품', color: '#0d9488', totals: [null, null, 69, 81] },
  { name: '청명에너지', color: '#16a34a', totals: [null, null, 76, 88] },
];
const areaOffsets = [-4, -2, 0, 2, 4];
const companies = companySeeds.map((company, companyIndex) => ({
  name: company.name,
  color: company.color,
  areaScores: Object.fromEntries(assessmentAreas.map((area, areaIndex) => [
    area,
    company.totals.map((total, yearIndex) => total === null ? null : total + areaOffsets[(areaIndex + companyIndex + yearIndex) % areaOffsets.length]),
  ])) as Record<AssessmentArea, (number | null)[]>,
}));

type Company = (typeof companies)[number];
type HoveredPoint = { yearIndex: number; score: number } | null;

const xPositions = [120, 330, 540, 750];
const toY = (score: number) => 330 - score * 2.75;

function getScores(company: Company, metric: ScoreMetric) {
  if (metric !== '총점') return company.areaScores[metric];
  return years.map((_, yearIndex) => {
    const scores = assessmentAreas.map(area => company.areaScores[area][yearIndex]);
    if (scores.some(score => score === null)) return null;
    return Math.round(scores.reduce((total, score) => total + (score ?? 0), 0) / assessmentAreas.length);
  });
}

function getEvaluatedScores(company: Company, metric: ScoreMetric) {
  return getScores(company, metric).flatMap((score, index) => score === null ? [] : [{ score, index }]);
}

function getLatestEvaluation(company: Company, metric: ScoreMetric) {
  return getEvaluatedScores(company, metric).at(-1)!;
}

function getLabelPositions(sortedCompanies: Company[], metric: ScoreMetric) {
  const minimumY = 52;
  const maximumY = 318;
  const gap = 19;
  const positions: number[] = [];

  sortedCompanies.forEach((company, index) => {
    const desiredY = toY(getLatestEvaluation(company, metric).score);
    positions.push(index === 0 ? Math.max(minimumY, desiredY) : Math.max(desiredY, positions[index - 1] + gap));
  });

  const overflow = Math.max(0, (positions.at(-1) ?? maximumY) - maximumY);
  return positions.map((position) => position - overflow);
}

export default function CustomerHistory({
  embedded = false,
  onBack,
}: {
  embedded?: boolean;
  onBack?: () => void;
}) {
  const [metric, setMetric] = useState<ScoreMetric>('총점');
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(() => new Set(companies.map(company => company.name)));
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false);
  const [focusedCompany, setFocusedCompany] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<HoveredPoint>(null);

  const visibleCompanies = companies.filter(company => selectedCompanies.has(company.name));
  const rankedCompanies = [...visibleCompanies].sort(
    (a, b) => getLatestEvaluation(b, metric).score - getLatestEvaluation(a, metric).score,
  );
  const labelPositions = getLabelPositions(rankedCompanies, metric);
  const hoveredCompanies = hoveredPoint
    ? visibleCompanies.filter((company) => getScores(company, metric)[hoveredPoint.yearIndex] === hoveredPoint.score)
    : [];

  return (
    <div className={embedded ? 'space-y-5' : 'service-page-wide'}>
      {!embedded && onBack && (
        <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-service-primary">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
            <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          추이 분석으로
        </button>
      )}
      <div className="mb-5 flex items-end justify-between">
        <div>
          <div className="service-page-title">이력 관리</div>
          <div className="service-page-description">협력사의 연도별 ESG 평가 성장 추이를 확인합니다.</div>
        </div>
        <div className="flex gap-2">
          <div style={{ position: 'relative' }}>
            <button type="button" onClick={() => setCompanyMenuOpen(open => !open)} style={{ ...filterStyle, minWidth: 150, textAlign: 'left', cursor: 'pointer' }}>
              {selectedCompanies.size === companies.length ? '전체 협력사' : `협력사 ${selectedCompanies.size}개 선택`}
              <span style={{ float: 'right' }}>▾</span>
            </button>
            {companyMenuOpen && (
              <div style={{ position: 'absolute', top: 40, right: 0, zIndex: 20, width: 190, background: '#fff', border: '1px solid #ccd2da', borderRadius: 4, boxShadow: '0 6px 18px rgba(0,0,0,0.14)', padding: '7px 0' }}>
                <label className="flex items-center gap-2" style={{ padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', borderBottom: '1px solid #eef0f3' }}>
                  <input
                    type="checkbox"
                    checked={selectedCompanies.size === companies.length}
                    onChange={() => setSelectedCompanies(selectedCompanies.size === companies.length ? new Set() : new Set(companies.map(company => company.name)))}
                  />
                  전체 협력사
                </label>
                {companies.map(company => (
                  <label key={company.name} className="flex items-center gap-2" style={{ padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedCompanies.has(company.name)}
                      onChange={() => setSelectedCompanies(current => {
                        const next = new Set(current);
                        next.has(company.name) ? next.delete(company.name) : next.add(company.name);
                        return next;
                      })}
                    />
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: company.color }} />
                    {company.name}
                  </label>
                ))}
              </div>
            )}
          </div>
          <select value={metric} onChange={(event) => setMetric(event.target.value as ScoreMetric)} style={filterStyle}>
            {['총점', ...assessmentAreas].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </div>

      <section style={{ border: '1px solid #dde1e7', borderRadius: 6, background: '#ffffff', padding: '22px 24px', marginBottom: 20 }}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="service-section-title">고객사 ESG 성장 추이</div>
            <div style={{ marginTop: 4, fontSize: 12, color: '#7b8491' }}>협력사별 점수 변화와 이력을 연도 단위로 비교할 수 있습니다.</div>
          </div>
        </div>

        <svg
          width="100%"
          viewBox="0 0 1040 390"
          role="img"
          aria-label="협력사 연도별 ESG 점수 이력 차트"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {[20, 40, 60, 80, 100].map((score) => (
            <g key={score}>
              <line x1="70" x2="780" y1={toY(score)} y2={toY(score)} stroke="#e8ebef" strokeWidth="1" />
              <text x="55" y={toY(score) + 4} textAnchor="end" fill="#89919d" fontSize="11">{score}</text>
            </g>
          ))}
          <line x1="70" x2="780" y1="330" y2="330" stroke="#bfc5cd" />
          {years.map((year, index) => (
            <g key={year}>
              <line x1={xPositions[index]} x2={xPositions[index]} y1="50" y2="330" stroke="#f0f2f5" />
              <text x={xPositions[index]} y="355" textAnchor="middle" fill="#555555" fontSize="13" fontWeight="600">{year}</text>
            </g>
          ))}
          {visibleCompanies.map((company) => {
            const evaluatedScores = getEvaluatedScores(company, metric);
            const points = evaluatedScores.map(({ score, index }) => `${xPositions[index]},${toY(score)}`).join(' ');
            const isFocused = focusedCompany === company.name;
            const isDimmed = !!focusedCompany && !isFocused;
            return (
              <g key={company.name} opacity={isDimmed ? 0.18 : 1}>
                <polyline points={points} fill="none" stroke={company.color} strokeWidth={isFocused ? 5 : 2.5} />
                {evaluatedScores.map(({ score, index }) => (
                  <g
                    key={`${company.name}-${years[index]}`}
                    onMouseEnter={() => setHoveredPoint({ yearIndex: index, score })}
                    onMouseLeave={() => setHoveredPoint(null)}
                    onFocus={() => setHoveredPoint({ yearIndex: index, score })}
                    onBlur={() => setHoveredPoint(null)}
                    tabIndex={0}
                    aria-label={`${company.name} ${years[index]}년 ${score}점`}
                    style={{ cursor: 'pointer', outline: 'none' }}
                  >
                    <circle cx={xPositions[index]} cy={toY(score)} r="10" fill="transparent" />
                    <circle cx={xPositions[index]} cy={toY(score)} r={isFocused ? 6.5 : 5} fill="#ffffff" stroke={company.color} strokeWidth={isFocused ? 4 : 3} pointerEvents="none" />
                  </g>
                ))}
              </g>
            );
          })}
          {rankedCompanies.map((company, index) => {
            const latest = getLatestEvaluation(company, metric);
            const pointX = xPositions[latest.index];
            const pointY = toY(latest.score);
            const labelY = labelPositions[index];
            return (
              <g
                key={`label-${company.name}`}
                onClick={() => setFocusedCompany(current => current === company.name ? null : company.name)}
                role="button"
                tabIndex={0}
                aria-label={`${company.name} 그래프 강조`}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    setFocusedCompany(current => current === company.name ? null : company.name);
                  }
                }}
                opacity={focusedCompany && focusedCompany !== company.name ? 0.18 : 1}
                style={{ cursor: 'pointer', outline: 'none' }}
              >
                <path
                  d={`M ${pointX + 7} ${pointY} H 820 L 875 ${labelY} H 892`}
                  fill="none"
                  stroke={company.color}
                  strokeWidth="1.25"
                  strokeDasharray="4 4"
                  opacity="0.72"
                />
                <circle cx="900" cy={labelY} r="3.5" fill={company.color} />
                <text x="909" y={labelY + 4} fill={company.color} fontSize="11" fontWeight="700">{company.name}</text>
              </g>
            );
          })}
          {hoveredPoint && (() => {
            const tooltipWidth = 154;
            const tooltipHeight = hoveredCompanies.length * 23 + 14;
            const pointX = xPositions[hoveredPoint.yearIndex];
            const pointY = toY(hoveredPoint.score);
            const tooltipX = pointX > 650 ? pointX - tooltipWidth - 13 : pointX + 13;
            const tooltipY = Math.max(48, Math.min(330 - tooltipHeight, pointY - tooltipHeight / 2));
            return (
              <g pointerEvents="none">
                <rect
                  x={tooltipX}
                  y={tooltipY}
                  width={tooltipWidth}
                  height={tooltipHeight}
                  rx="6"
                  fill="#ffffff"
                  stroke="#d9dee5"
                  filter="drop-shadow(0 3px 6px rgba(31, 41, 55, 0.16))"
                />
                {hoveredCompanies.map((company, index) => (
                  <g key={`tooltip-${company.name}`} transform={`translate(${tooltipX + 12} ${tooltipY + 20 + index * 23})`}>
                    <circle cx="0" cy="-4" r="4" fill={company.color} />
                    <text x="10" y="0" fill="#4b5563" fontSize="11" fontWeight="600">{company.name}</text>
                    <text x={tooltipWidth - 34} y="0" textAnchor="end" fill={company.color} fontSize="12" fontWeight="800">{hoveredPoint.score}</text>
                  </g>
                ))}
              </g>
            );
          })()}
        </svg>
      </section>

      <section style={{ border: '1px solid #dde1e7', borderRadius: 6, background: '#ffffff', overflow: 'hidden' }}>
        <div style={{ padding: '15px 18px', borderBottom: '1px solid #e4e7ec', fontSize: 15, fontWeight: 700 }}>연도별 평가 점수</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#f7f8fa' }}>
              <th style={historyCellStyle}>협력사</th>
              <th style={historyCellStyle}>평가 영역</th>
              {years.map((year) => <th key={year} style={historyCellStyle}>{year}</th>)}
              <th style={historyCellStyle}>누적 변화</th>
            </tr>
          </thead>
          <tbody>
            {visibleCompanies.map((company) => {
              const scores = getScores(company, metric);
              const evaluatedScores = getEvaluatedScores(company, metric);
              const change = evaluatedScores.at(-1)!.score - evaluatedScores[0].score;
              return (
                <tr key={company.name}>
                  <td style={{ ...historyCellStyle, fontWeight: 700 }}>{company.name}</td>
                  <td style={historyCellStyle}>{metric}</td>
                  {scores.map((score, index) => <td key={years[index]} style={historyCellStyle}>{score ?? '-'}</td>)}
                  <td style={{ ...historyCellStyle, color: change >= 0 ? '#15803d' : '#d64545', fontWeight: 700 }}>{change >= 0 ? '+' : ''}{change}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

const filterStyle: React.CSSProperties = {
  height: 'var(--size-control)',
  border: '1px solid #cccccc',
  borderRadius: 'var(--radius-control)',
  background: 'var(--color-surface)',
  padding: '0 var(--space-3)',
  fontSize: 'var(--text-body-small)',
  color: 'var(--color-text-secondary)',
};

const historyCellStyle: React.CSSProperties = {
  padding: '11px 12px',
  borderRight: '1px solid #e7eaee',
  borderBottom: '1px solid #e1e5ea',
  textAlign: 'center',
  color: '#4b5563',
};
