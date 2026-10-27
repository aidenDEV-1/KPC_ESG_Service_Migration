const popups = [
  { no: 3, title: 'TEST 팝업 003', startDate: '2026-09-01', endDate: '2026-09-30', active: 'Y' },
  { no: 2, title: 'TEST 팝업 002', startDate: '2026-08-01', endDate: '2026-08-31', active: 'Y' },
  { no: 1, title: 'TEST 팝업 001', startDate: '2026-07-01', endDate: '2026-07-31', active: 'N' },
];

const headers = ['번호', '제목', '노출시작일', '노출종료일', '사용여부'];

interface Props {
  onNavigate?: (page: string) => void;
}

export default function PopupManagement({ onNavigate }: Props) {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>팝업 등록/관리</h2>

      {/* Filter */}
      <div className="flex items-center justify-center gap-3 p-4 mb-5 border rounded bg-white" style={{ borderColor: '#e0e0e0' }}>
        <label style={{ fontSize: 13, color: '#555' }}>활성여부</label>
        <select className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc' }}>
          <option>전체</option><option>활성</option><option>비활성</option>
        </select>
        <label style={{ fontSize: 13, color: '#555' }}>검색어</label>
        <select className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc' }}>
          <option>전체</option><option>제목</option>
        </select>
        <input type="text" placeholder="검색어를 입력해주세요" className="border rounded px-3 py-1 text-sm" style={{ borderColor: '#ccc', width: 220 }} />
        <button className="rounded px-4 py-1 text-white text-sm" style={{ background: '#3d8fef' }}>검색</button>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span style={{ fontSize: 13, color: '#333' }}>목록 {popups.length}건</span>
      </div>

      <div className="bg-white border rounded overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full text-sm border-collapse">
          <thead style={{ background: '#f8f8f8' }}>
            <tr>
              {headers.map(h => (
                <th key={h} className="px-4 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #f0f0f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {popups.map(p => (
              <tr key={p.no} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td className="px-4 py-2 text-center text-xs">{p.no}</td>
                <td className="px-4 py-2 text-center text-xs text-blue-600 cursor-pointer hover:underline" onClick={() => onNavigate?.('popup-edit')}>{p.title}</td>
                <td className="px-4 py-2 text-center text-xs">{p.startDate}</td>
                <td className="px-4 py-2 text-center text-xs">{p.endDate}</td>
                <td className="px-4 py-2 text-center text-xs">{p.active}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-1 text-xs" style={{ color: '#e63946' }}>1</div>
        <button className="rounded px-4 py-1.5 text-white text-sm font-medium" style={{ background: '#e63946' }} onClick={() => onNavigate?.('popup-registration')}>등록</button>
      </div>
    </div>
  );
}
