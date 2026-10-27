import { useRef, useState } from 'react';
import { kpcCampaigns } from '../../data';

interface Props {
  onOpenProgress: (id: string, name: string, dateRange: string) => void;
  onOpenEvaluation: (id: string, name: string, dateRange: string) => void;
}

const completedCampaigns = [
  { id: 'DONE-01', logo: 'THE Y', logoColor: '#111', name: 'DEX TEST', dateRange: '2026-09-10 ~ 2026-09-26' },
  { id: 'DONE-02', logo: 'THE Y', logoColor: '#111', name: 'dex111111', dateRange: '2026-09-02 ~ 2026-09-23' },
  { id: 'DONE-03', logo: 'THE Y', logoColor: '#111', name: 'DEX TEST11', dateRange: '2026-09-10 ~ 2026-09-16' },
  { id: 'DONE-04', logo: '농심', logoColor: '#d93b32', name: '2026 Nongshim Supply Chain ESG Self-Assessment (English)', dateRange: '2026-08-03 ~ 2026-09-11' },
  { id: 'DONE-05', logo: '농심', logoColor: '#d93b32', name: '2026 농심 협력사 ESG 자가평가', dateRange: '2026-06-02 ~ 2026-08-31' },
  { id: 'DONE-06', logo: '울산대', logoColor: '#17864b', name: '2026 울산대학교 RISE사업단 기업지원 R&D센터 탄소중립·ESG 기술 및 경영 컨설팅 지원사업', dateRange: '2026-07-29 ~ 2026-08-21' },
  { id: 'DONE-07', logo: '농심', logoColor: '#d93b32', name: '2026 농심 협력사 ESG 자가평가(현장 컨설팅 대상기업)', dateRange: '2026-06-09 ~ 2026-07-16' },
  { id: 'DONE-08', logo: 'THE Y', logoColor: '#111', name: '테스트 20231009', dateRange: '2023-10-09 ~ 2026-05-06' },
  { id: 'DONE-09', logo: 'THE Y', logoColor: '#111', name: '농심 테스트', dateRange: '2026-04-17 ~ 2026-04-24' },
];

export default function CampaignList({ onOpenProgress, onOpenEvaluation }: Props) {
  const [tab, setTab] = useState<'active' | 'completed'>('active');
  const [search, setSearch] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});
  const campaigns = (tab === 'active' ? kpcCampaigns : completedCampaigns)
    .filter(campaign => campaign.name.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto px-6 py-4">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('active')} className="rounded px-6 py-2 text-sm font-medium" style={{ color: tab === 'active' ? '#fff' : '#555', border: '1px solid #ccc', background: tab === 'active' ? '#3d4d5c' : '#fff' }}>진행중</button>
        <button onClick={() => setTab('completed')} className="rounded px-6 py-2 text-sm font-medium" style={{ color: tab === 'completed' ? '#fff' : '#555', border: '1px solid #ccc', background: tab === 'completed' ? '#52617f' : '#fff' }}>종료</button>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <span style={{ fontSize: 12, fontWeight: 700 }}>Search</span>
        <select style={{ border: '1px solid #ccc', borderRadius: 3, padding: '7px 10px', fontSize: 12 }}><option>최근 6개월</option><option>최근 1년</option><option>전체 기간</option></select>
        <select style={{ border: '1px solid #ccc', borderRadius: 3, padding: '7px 10px', fontSize: 12 }}><option>전체</option><option>자동</option><option>수동</option></select>
        <input value={search} onChange={event => setSearch(event.target.value)} placeholder="검색어를 입력하세요" style={{ border: '1px solid #ccc', borderRadius: 3, padding: '7px 10px', width: 180, fontSize: 12 }} />
        <button style={{ border: 'none', borderRadius: 3, background: '#334a8a', color: '#fff', padding: '7px 11px', cursor: 'pointer' }}>검색</button>
      </div>

      {/* Campaign Cards */}
      <div className="flex flex-col gap-4">
        {campaigns.map((c, index) => (
          <div
            key={c.id}
            className="bg-white border rounded flex items-center px-5 py-4 gap-5"
            style={{ borderColor: '#e0e0e0' }}
          >
            {/* Logo box */}
            <div
              className="flex items-center justify-center border rounded flex-shrink-0"
              style={{ width: 72, height: 56, borderColor: '#ddd', fontSize: 11, fontWeight: 700, color: c.logoColor }}
            >
              {c.logo}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div style={{ fontSize: 14, fontWeight: 600, color: '#222', marginBottom: 4 }}>{tab === 'completed' ? `${index + 1}. ` : ''}{c.name}</div>
              <div style={{ fontSize: 12, color: '#888' }}>
                {c.dateRange}
                {'remaining' in c && <span style={{ color: '#e63946', marginLeft: 8 }}>({c.remaining})</span>}
                {uploadedFiles[c.id] && <span style={{ color: '#2e7d32', marginLeft: 8 }}>첨부: {uploadedFiles[c.id]}</span>}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {tab === 'active' && (
                <>
                  <input
                    ref={element => { fileInputs.current[c.id] = element; }}
                    type="file"
                    hidden
                    onChange={event => {
                      const file = event.target.files?.[0];
                      if (file) setUploadedFiles(current => ({ ...current, [c.id]: file.name }));
                    }}
                  />
                  <button onClick={() => fileInputs.current[c.id]?.click()} className="rounded px-3 py-1.5 text-xs text-white" style={{ background: '#4a90d9' }}>
                    파일등록(참고문서)
                  </button>
                </>
              )}
              <button
                onClick={() => onOpenProgress(c.id, c.name, c.dateRange)}
                className="rounded px-5 py-2 text-sm font-medium text-white"
                style={{ background: '#3d4d5c' }}
              >
                진행현황
              </button>
              <button
                onClick={() => onOpenEvaluation(c.id, c.name, c.dateRange)}
                className="rounded px-5 py-2 text-sm font-medium text-white"
                style={{ background: '#e63946' }}
              >
                자가진단 결과
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
