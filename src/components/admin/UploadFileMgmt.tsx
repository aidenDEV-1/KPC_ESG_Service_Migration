import { useMemo, useState } from 'react';

interface EvidenceFile {
  no: number;
  campaign: string;
  questionId: string;
  fileName: string;
  size: string;
  uploader: string;
  company: string;
  uploadedAt: string;
  expiresAt: string;
}

const CAMPAIGNS = ['2026 LG 협력사 ESG 평가', '2026 SK 협력사 ESG 평가', '2026 삼성 공급망 ESG 평가', '2025 한화 공급망 평가'];
const COMPANIES = ['㈜에코파트너스', '㈜그린테크', '㈜한빛산업', '㈜미래소재', '㈜세림정공', '㈜대성에너지'];
const FILES: EvidenceFile[] = Array.from({ length: 24 }, (_, index) => ({
  no: 8124 - index,
  campaign: CAMPAIGNS[index % CAMPAIGNS.length],
  questionId: `${['L', 'S', 'E', 'M'][index % 4]}-${(index % 5) + 1}-1-${index + 1}`,
  fileName: ['환경경영방침.pdf', '온실가스_배출량.xlsx', '인권경영_교육실적.pdf', '안전보건_점검표.xlsx', '윤리규정.pdf', '폐기물처리_증빙.zip'][index % 6],
  size: `${(1.2 + (index % 8) * 0.7).toFixed(1)} MB`,
  uploader: `partner${String((index % 12) + 1).padStart(2, '0')}@example.com`,
  company: COMPANIES[index % COMPANIES.length],
  uploadedAt: `2026-${String(9 - (index % 5)).padStart(2, '0')}-${String(18 - (index % 9)).padStart(2, '0')}`,
  expiresAt: index % 4 === 3 ? '2024-12-31' : '2027-12-31',
}));

export default function UploadFileMgmt() {
  const [files, setFiles] = useState(FILES);
  const [campaign, setCampaign] = useState('');
  const [keyword, setKeyword] = useState('');
  const [deleteCampaign, setDeleteCampaign] = useState('');
  const filtered = useMemo(() => files.filter(file =>
    (!campaign || file.campaign === campaign)
    && (!keyword.trim() || `${file.fileName} ${file.company} ${file.uploader} ${file.questionId}`.toLowerCase().includes(keyword.toLowerCase())),
  ), [campaign, files, keyword]);

  const campaignDeleteCount = files.filter(file => file.campaign === deleteCampaign).length;
  const deleteEligible = campaignDeleteCount > 0 && files
    .filter(file => file.campaign === deleteCampaign)
    .every(file => file.expiresAt < new Date().toISOString().slice(0, 10));

  return (
    <div>
      <div className="mb-5">
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a3055' }}>업로드 파일관리</h2>
        <p className="mt-1 text-xs" style={{ color: '#777' }}>협력사가 자가평가 과정에서 제출한 근거자료를 캠페인별로 관리합니다.</p>
      </div>
      <div className="mb-4 flex items-center gap-2 rounded border bg-white p-4" style={{ borderColor: '#e0e0e0' }}>
        <select value={campaign} onChange={event => setCampaign(event.target.value)} className="rounded border px-3 text-sm" style={{ borderColor: '#ccc', height: 36, minWidth: 240 }}><option value="">캠페인 전체</option>{CAMPAIGNS.map(item => <option key={item}>{item}</option>)}</select>
        <input value={keyword} onChange={event => setKeyword(event.target.value)} placeholder="파일명, 회사명, 등록자, 질의 ID 검색" className="min-w-0 flex-1 rounded border px-3 text-sm" style={{ borderColor: '#ccc', height: 36 }} />
        <button className="rounded px-4 text-sm font-semibold text-white" style={{ background: '#1a3055', height: 36 }}>검색</button>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm">목록 <strong style={{ color: '#e63946' }}>{filtered.length}</strong>건</span>
        <button onClick={() => setDeleteCampaign(campaign || CAMPAIGNS[3])} className="rounded border px-4 py-2 text-sm font-semibold" style={{ borderColor: '#e63946', color: '#e63946', background: '#fff' }}>캠페인별 일괄 삭제</button>
      </div>
      <div className="overflow-hidden rounded border bg-white" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full border-collapse text-sm">
          <thead style={{ background: '#f8f8f8' }}><tr>{['번호', '캠페인명', '질의 ID', '근거자료 파일', '크기', '등록자', '협력사', '등록일', '보관 만료일', '다운로드'].map(header => <th key={header} className="border-b px-2 py-3 text-center text-xs font-semibold">{header}</th>)}</tr></thead>
          <tbody>{filtered.map(file => {
            const expired = file.expiresAt < new Date().toISOString().slice(0, 10);
            return <tr key={file.no} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-2 py-3 text-center text-xs">{file.no}</td><td className="px-2 py-3 text-xs">{file.campaign}</td>
              <td className="px-2 py-3 text-center text-xs">{file.questionId}</td><td className="px-2 py-3 text-xs font-medium text-blue-600">{file.fileName}</td>
              <td className="px-2 py-3 text-center text-xs">{file.size}</td><td className="px-2 py-3 text-center text-xs">{file.uploader}</td>
              <td className="px-2 py-3 text-center text-xs">{file.company}</td><td className="px-2 py-3 text-center text-xs">{file.uploadedAt}</td>
              <td className="px-2 py-3 text-center text-xs"><span className="rounded-full px-2 py-1" style={{ background: expired ? '#fff0f1' : '#eef7f2', color: expired ? '#c93643' : '#27784b' }}>{file.expiresAt}{expired ? ' 만료' : ''}</span></td>
              <td className="px-2 py-3 text-center"><button className="rounded border px-2 py-1 text-xs" style={{ borderColor: '#1a6fbf', color: '#1a6fbf' }}>다운로드</button></td>
            </tr>;
          })}</tbody>
        </table>
      </div>

      {deleteCampaign && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="w-[480px] rounded-lg bg-white p-6 shadow-2xl">
            <div className="mb-2 text-lg font-bold">캠페인 근거자료 일괄 삭제</div>
            <p className="mb-4 text-sm leading-6" style={{ color: '#555' }}>보관 기간이 지난 캠페인의 근거자료를 일괄 삭제합니다. 삭제 후에는 복구할 수 없습니다.</p>
            <select value={deleteCampaign} onChange={event => setDeleteCampaign(event.target.value)} className="w-full rounded border px-3 py-2 text-sm">{CAMPAIGNS.map(item => <option key={item}>{item}</option>)}</select>
            <div className="mt-3 rounded px-4 py-3 text-sm" style={{ background: deleteEligible ? '#fff5f5' : '#fff8e5', color: deleteEligible ? '#b72f3a' : '#8b6300' }}>{deleteCampaign} · {deleteEligible ? `삭제 대상 ${campaignDeleteCount}건` : '보관 기간이 지나지 않아 삭제할 수 없습니다.'}</div>
            <div className="mt-5 flex justify-end gap-2"><button onClick={() => setDeleteCampaign('')} className="rounded border px-4 py-2 text-sm">취소</button><button disabled={!deleteEligible} onClick={() => { setFiles(current => current.filter(file => file.campaign !== deleteCampaign)); setDeleteCampaign(''); }} className="rounded px-4 py-2 text-sm font-semibold text-white disabled:opacity-40" style={{ background: '#e63946' }}>일괄 삭제</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
