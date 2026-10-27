import { admClients } from '../../data';

interface Props {
  onNavigate?: (page: string) => void;
}

export default function ClientCompany({ onNavigate }: Props) {
  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>고객사 관리</h1>

      {/* Filters */}
      <div className="bg-white border rounded p-4 mb-4 flex justify-center gap-2" style={{ borderColor: '#e0e0e0' }}>
        <select className="border rounded px-3 py-1 text-sm" style={{ borderColor: '#ccc' }}>
          <option>활성여부</option>
          <option>활성</option>
          <option>비활성</option>
        </select>
        <select className="border rounded px-3 py-1 text-sm" style={{ borderColor: '#ccc' }}>
          <option>검색 조건</option>
          <option>회사명</option>
          <option>사업자번호</option>
        </select>
        <input type="text" placeholder="검색어를 입력하세요" className="border rounded px-3 py-1 text-sm" style={{ borderColor: '#ccc', width: 200 }} />
        <button className="rounded px-3 py-1 text-white text-sm" style={{ backgroundColor: '#1e56d9' }}>🔍</button>
      </div>

      {/* Count */}
      <div className="mb-2">
        <span style={{ fontSize: 13, color: '#333' }}>목록 <span style={{ color: '#e63946', fontWeight: 700 }}>35</span>건</span>
      </div>

      {/* Table */}
      <div className="bg-white border rounded overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full text-sm border-collapse">
          <thead style={{ background: '#f8f8f8' }}>
            <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
              {['번호', '회사명', '사업자번호', '가입일', '활성여부'].map(h => (
                <th key={h} className="px-4 py-2 text-center text-xs font-medium" style={{ color: '#555', borderRight: '1px solid #f0f0f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {admClients.map(c => (
              <tr key={c.no} style={{ borderBottom: '1px solid #f5f5f5' }} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-center text-xs">{c.no}</td>
                <td className="px-4 py-2 text-center text-xs text-blue-600 cursor-pointer hover:underline" onClick={() => onNavigate?.('client-company-edit')}>{c.company}</td>
                <td className="px-4 py-2 text-center text-xs">{c.bizNo}</td>
                <td className="px-4 py-2 text-center text-xs">{c.joinDate}</td>
                <td className="px-4 py-2 text-center text-xs">{c.active}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-1 mt-4">
        {[1, 2, 3, 4].map(p => (
          <button key={p} className="px-2 py-1 text-sm"
            style={{ color: p === 1 ? '#e63946' : '#555', fontWeight: p === 1 ? 700 : 400 }}>{p}</button>
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <button className="rounded px-4 py-2 text-white text-sm font-medium" style={{ background: '#e63946' }} onClick={() => onNavigate?.('client-company-registration')}>고객사 등록</button>
      </div>
    </div>
  );
}
