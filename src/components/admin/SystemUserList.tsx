const users = [
  { no: 7, role: 'ADMIN', name: '시스템 관리자', id: 'admin01', dept: '플랫폼운영팀', regDate: '2026-09-16', lastAccess: '2026-09-17', lastIp: '192.0.2.10' },
  { no: 6, role: 'ADMIN', name: '서비스 관리자', id: 'admin02', dept: 'ESG사업팀', regDate: '2025-05-25', lastAccess: '2026-09-17', lastIp: '192.0.2.11' },
  { no: 5, role: 'KPC', name: '김지훈', id: 'kpc01', dept: 'ESG컨설팅1센터', regDate: '2025-05-25', lastAccess: '2026-09-14', lastIp: '192.0.2.12' },
  { no: 4, role: 'KPC', name: '이서현', id: 'kpc02', dept: 'ESG컨설팅1센터', regDate: '2025-04-03', lastAccess: '2026-09-17', lastIp: '192.0.2.13' },
  { no: 3, role: 'KPC', name: '박민수', id: 'kpc03', dept: 'ESG컨설팅2센터', regDate: '2024-11-02', lastAccess: '2026-09-16', lastIp: '192.0.2.14' },
  { no: 2, role: 'KPC', name: '최유진', id: 'kpc04', dept: 'ESG컨설팅2센터', regDate: '2024-08-18', lastAccess: '2026-09-16', lastIp: '192.0.2.15' },
  { no: 1, role: 'KPC', name: '정현우', id: 'kpc05', dept: '공급망ESG센터', regDate: '2024-05-15', lastAccess: '2026-09-13', lastIp: '192.0.2.16' },
];

const headers = ['번호', '권한코드', '이름', '아이디', '부서', '등록날짜', '최근접속일', '최근접속아이피'];

interface Props {
  onNavigate?: (page: string) => void;
}

export default function SystemUserList({ onNavigate }: Props) {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#1a3055' }}>관리자 관리</h2>
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded border bg-white p-4" style={{ borderColor: '#c8d5e9' }}><div className="mb-1 text-sm font-bold" style={{ color: '#1a3055' }}>ADMIN</div><div className="text-xs leading-5" style={{ color: '#666' }}>시스템 관리와 기본 SET을 포함해 회원·질의·캠페인 전체 권한을 보유하며 KPC 사용자를 등록할 수 있습니다.</div></div>
        <div className="rounded border bg-white p-4" style={{ borderColor: '#e0e0e0' }}><div className="mb-1 text-sm font-bold" style={{ color: '#555' }}>KPC</div><div className="text-xs leading-5" style={{ color: '#666' }}>회원·질의·캠페인 운영 권한을 보유합니다. 시스템 관리와 기본 SET 관리 및 관리자 등록은 사용할 수 없습니다.</div></div>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-center gap-3 p-4 mb-5 border rounded bg-white" style={{ borderColor: '#e0e0e0' }}>
        <label style={{ fontSize: 13, color: '#555' }}>활성여부</label>
        <select className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc' }}>
          <option>Y</option><option>N</option><option>전체</option>
        </select>
        <label style={{ fontSize: 13, color: '#555' }}>검색조건</label>
        <select className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc' }}>
          <option>전체</option><option>이름</option><option>아이디</option>
        </select>
        <input type="text" placeholder="검색어를 입력해주세요" className="border rounded px-3 py-1 text-sm" style={{ borderColor: '#ccc', width: 220 }} />
        <button className="rounded px-4 py-1 text-white text-sm" style={{ background: '#3d8fef' }}>검색</button>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span style={{ fontSize: 13, color: '#333' }}>목록 {users.length}건</span>
        <button className="rounded px-3 py-1 text-white text-xs font-medium" style={{ background: '#5c7080' }}>엑셀다운로드</button>
      </div>

      <div className="bg-white border rounded overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full text-sm border-collapse">
          <thead style={{ background: '#f8f8f8' }}>
            <tr>
              {headers.map(h => (
                <th key={h} className="px-3 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #f0f0f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.no} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td className="px-3 py-2 text-center text-xs">{u.no}</td>
                <td className="px-3 py-2 text-center text-xs text-blue-600">{u.role}</td>
                <td className="px-3 py-2 text-center text-xs">{u.name}</td>
                <td className="px-3 py-2 text-center text-xs text-blue-600 cursor-pointer hover:underline">{u.id}</td>
                <td className="px-3 py-2 text-center text-xs">{u.dept}</td>
                <td className="px-3 py-2 text-center text-xs">{u.regDate}</td>
                <td className="px-3 py-2 text-center text-xs">{u.lastAccess}</td>
                <td className="px-3 py-2 text-center text-xs">{u.lastIp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-1 text-xs" style={{ color: '#e63946' }}>1</div>
        <button className="rounded px-4 py-1.5 text-white text-sm font-medium" style={{ background: '#e63946' }} onClick={() => onNavigate?.('sys-user-registration')}>KPC 사용자 등록</button>
      </div>
    </div>
  );
}
