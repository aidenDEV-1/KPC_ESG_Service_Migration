const sessions = [
  { no: 4, id: 'test04@example.com', grade: 'A01', ip: '192.0.2.10', date: '2026.09.17 15:09:44', sessionId: 'TEST-SESSION-001' },
  { no: 3, id: 'test03@example.com', grade: 'P01', ip: '192.0.2.10', date: '2026.09.17 15:37:01', sessionId: 'TEST-SESSION-002' },
  { no: 2, id: 'test02@example.com', grade: 'A01', ip: '192.0.2.10', date: '2026.09.17 15:09:44', sessionId: 'TEST-SESSION-003' },
  { no: 1, id: 'test01@example.com', grade: 'A01', ip: '192.0.2.10', date: '2026.09.17 15:21:25', sessionId: 'TEST-SESSION-004' },
];

export default function ActiveSession() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>접속자현황</h2>

      {/* Filter */}
      <div className="flex items-center justify-center gap-3 p-4 mb-5 border rounded bg-white" style={{ borderColor: '#e0e0e0' }}>
        <label style={{ fontSize: 13, color: '#555' }}>접속 구분</label>
        <select className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc' }}>
          <option>사용자사이트</option><option>관리자사이트</option><option>전체</option>
        </select>
        <button className="rounded px-3 py-1 text-white text-sm" style={{ background: '#3d8fef' }}>🔍</button>
      </div>

      <div className="bg-white border rounded overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full text-sm border-collapse">
          <thead style={{ background: '#f8f8f8' }}>
            <tr>
              {['번호', '아이디', 'gradeCd', '접속IP', '접속일자', '강제로그아웃', 'SessionId'].map(h => (
                <th key={h} className="px-3 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #f0f0f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessions.map(s => (
              <tr key={s.no} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td className="px-3 py-2 text-center text-xs">{s.no}</td>
                <td className="px-3 py-2 text-center text-xs">{s.id}</td>
                <td className="px-3 py-2 text-center text-xs">{s.grade}</td>
                <td className="px-3 py-2 text-center text-xs">{s.ip}</td>
                <td className="px-3 py-2 text-center text-xs">{s.date}</td>
                <td className="px-3 py-2 text-center">
                  <button className="rounded px-2 py-0.5 text-white text-xs" style={{ background: '#9b2335' }}>로그아웃</button>
                </td>
                <td className="px-3 py-2 text-center text-xs font-mono" style={{ fontSize: 11 }}>{s.sessionId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
