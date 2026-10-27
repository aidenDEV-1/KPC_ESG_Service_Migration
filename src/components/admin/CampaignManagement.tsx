import { useMemo, useState } from 'react';
import { admCampaigns } from '../../data';

export type CampaignRecord = (typeof admCampaigns)[number] & {
  taskStart?: string;
  taskEnd?: string;
  contact?: string;
  partners?: string[];
  auditors?: string[];
  industryCode?: number;
  consistencyReviewVisible?: boolean;
};

interface Props {
  onNavigate?: (page: string) => void;
  campaigns?: CampaignRecord[];
  onSelectCampaign?: (campaign: CampaignRecord) => void;
}

const normalizeStatus = (status: string) => {
  if (status === '종료') return '종료';
  if (status === '준비중' || status === '수동') return '준비중';
  return '진행중';
};

export default function CampaignManagement({ onNavigate, campaigns = admCampaigns, onSelectCampaign }: Props) {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [keyword, setKeyword] = useState('');

  const clientFolders = useMemo(() => {
    const groups = new Map<string, CampaignRecord[]>();
    campaigns.forEach(campaign => groups.set(campaign.provider, [...(groups.get(campaign.provider) ?? []), campaign]));
    return [...groups.entries()]
      .map(([name, items]) => ({
        name,
        campaigns: items,
        activeCount: items.filter(item => normalizeStatus(item.status) === '진행중').length,
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  }, [campaigns]);

  const selectedCampaigns = useMemo(() => campaigns
    .filter(campaign => campaign.provider === selectedClient)
    .filter(campaign => !statusFilter || normalizeStatus(campaign.status) === statusFilter)
    .filter(campaign => !keyword.trim() || campaign.name.toLowerCase().includes(keyword.trim().toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name, 'ko')), [campaigns, keyword, selectedClient, statusFilter]);

  const activeClients = clientFolders.filter(folder => folder.activeCount > 0);
  const inactiveClients = clientFolders.filter(folder => folder.activeCount === 0);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1a3055' }}>캠페인 관리</h1>
          {selectedClient && <div className="mt-1 text-xs" style={{ color: '#777' }}>고객사별 캠페인 · {selectedClient}</div>}
        </div>
        <button className="rounded px-4 py-2 text-sm font-semibold text-white" style={{ background: '#e63946' }} onClick={() => onNavigate?.('campaign-registration')}>캠페인 등록</button>
      </div>

      {!selectedClient ? (
        <div className="space-y-5">
          <ClientFolderSection title="진행 중인 캠페인이 있는 고객사" folders={activeClients} active onSelect={setSelectedClient} />
          <ClientFolderSection title="진행 중인 캠페인이 없는 고객사" folders={inactiveClients} onSelect={setSelectedClient} />
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-2 rounded border bg-white p-3" style={{ borderColor: '#e0e0e0' }}>
            <button type="button" onClick={() => { setSelectedClient(null); setKeyword(''); setStatusFilter(''); }} className="rounded border px-4 py-2 text-sm font-semibold" style={{ borderColor: '#9eb2d4', color: '#1a3055', background: '#f4f7fc' }}>← 고객사 폴더 목록으로 돌아가기</button>
            <div className="mx-2 h-6 w-px bg-gray-200" />
            <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} className="rounded border px-3 text-sm" style={{ borderColor: '#ccc', height: 36 }}>
              <option value="">상태 전체</option><option>준비중</option><option>진행중</option><option>종료</option>
            </select>
            <input value={keyword} onChange={event => setKeyword(event.target.value)} placeholder="캠페인명 검색" className="min-w-0 flex-1 rounded border px-3 text-sm" style={{ borderColor: '#ccc', height: 36 }} />
            <button type="button" className="rounded px-4 text-sm font-semibold text-white" style={{ background: '#1a3055', height: 36 }}>검색</button>
          </div>

          <div className="mb-2 flex items-center justify-between">
            <div style={{ fontSize: 17, fontWeight: 700 }}>{selectedClient} 캠페인</div>
            <span className="text-sm" style={{ color: '#666' }}>총 <strong style={{ color: '#e63946' }}>{selectedCampaigns.length}</strong>건</span>
          </div>
          <div className="overflow-hidden rounded border bg-white" style={{ borderColor: '#e0e0e0' }}>
            <table className="w-full border-collapse text-sm">
              <thead style={{ background: '#f8f8f8' }}><tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                {['번호', '고객사', '캠페인명', '시작일', '종료일', '상태', '등록일', '활성여부'].map(header => (
                  <th key={header} className="px-3 py-3 text-center text-xs font-semibold" style={{ color: '#444' }}>{header}</th>
                ))}
              </tr></thead>
              <tbody>
                {selectedCampaigns.map(campaign => {
                  const status = normalizeStatus(campaign.status);
                  return (
                    <tr key={campaign.no} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #edf0f3' }}>
                      <td className="px-3 py-3 text-center text-xs">{campaign.no}</td>
                      <td className="px-3 py-3 text-center text-xs">{campaign.provider}</td>
                      <td
                        className="cursor-pointer px-3 py-3 text-xs font-medium text-blue-600 hover:underline"
                        onClick={() => { onSelectCampaign?.(campaign); onNavigate?.('campaign-edit-detail'); }}
                      >{campaign.name}</td>
                      <td className="px-3 py-3 text-center text-xs">{campaign.startDate}</td>
                      <td className="px-3 py-3 text-center text-xs">{campaign.endDate}</td>
                      <td className="px-3 py-3 text-center text-xs">
                        <span className="rounded-full px-2 py-1 font-semibold" style={{
                          background: status === '진행중' ? '#eaf3ff' : status === '준비중' ? '#fff6df' : '#f0f1f3',
                          color: status === '진행중' ? '#1767bd' : status === '준비중' ? '#a66a00' : '#6b7280',
                        }}>{status}</span>
                      </td>
                      <td className="px-3 py-3 text-center text-xs">{campaign.regDate}</td>
                      <td className="px-3 py-3 text-center text-xs">{campaign.active}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function ClientFolderSection({
  title,
  folders,
  active = false,
  onSelect,
}: {
  title: string;
  folders: Array<{ name: string; campaigns: CampaignRecord[]; activeCount: number }>;
  active?: boolean;
  onSelect: (name: string) => void;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a3055' }}>{title} <span style={{ color: '#e63946' }}>({folders.length})</span></h2>
        <span className="text-xs" style={{ color: '#888' }}>고객사명 가나다순</span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {folders.map(folder => (
          <button
            type="button"
            key={folder.name}
            onClick={() => onSelect(folder.name)}
            className="flex items-center gap-4 rounded border bg-white p-4 text-left transition-shadow hover:shadow-md"
            style={{ borderColor: active ? '#cbd8f5' : '#e0e0e0', minHeight: 96 }}
          >
            <span className="relative block h-12 w-14 shrink-0 rounded" style={{ background: active ? '#456cf2' : '#9aa1ab' }}>
              <span className="absolute -top-1 left-1 h-2 w-6 rounded-t" style={{ background: active ? '#456cf2' : '#9aa1ab' }} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold" style={{ color: '#222' }}>{folder.name}</span>
              <span className="mt-1 block text-xs font-semibold" style={{ color: active ? '#315ed7' : '#777' }}>진행 중 {folder.activeCount}건</span>
              <span className="mt-0.5 block text-xs" style={{ color: '#777' }}>전체 {folder.campaigns.length}건</span>
            </span>
            <span style={{ color: '#5f6670', fontSize: 20 }}>›</span>
          </button>
        ))}
      </div>
    </section>
  );
}
