const logs = [
  { no: 172205, id: 'test01', date: '2026-09-17 15:33:04.0', ip: '192.0.2.10', loginType: '로그인', sys: 'MNG' },
  { no: 172204, id: 'test01@example.com', date: '2026-09-17 15:20:41.0', ip: '192.0.2.10', loginType: '로그인', sys: 'FRT' },
  { no: 172203, id: 'test01@example.com', date: '2026-09-17 15:20:35.0', ip: '192.0.2.10', loginType: '로그아웃', sys: 'FRT' },
  { no: 172202, id: 'test01@example.com', date: '2026-09-17 15:20:01.0', ip: '192.0.2.10', loginType: '로그인', sys: 'FRT' },
  { no: 172201, id: 'test01@example.com', date: '2026-09-17 15:19:38.0', ip: '192.0.2.10', loginType: '로그아웃', sys: 'FRT' },
  { no: 172200, id: 'test01', date: '2026-09-17 15:15:34.0', ip: '192.0.2.10', loginType: '로그인', sys: 'MNG' },
  { no: 172199, id: 'test07', date: '2026-09-17 15:15:29.0', ip: '192.0.2.10', loginType: '로그인', sys: 'MNG' },
  { no: 172198, id: 'test02@example.com', date: '2026-09-17 15:09:59.0', ip: '192.0.2.10', loginType: '로그인', sys: 'FRT' },
  { no: 172197, id: 'test01@example.com', date: '2026-09-17 15:07:43.0', ip: '192.0.2.10', loginType: '로그인', sys: 'FRT' },
];

export default function MemberLoginLog() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>회원로그인로그관리</h2>

      {/* Filter */}
      <div className="flex items-center justify-center gap-3 p-4 mb-5 border rounded bg-white" style={{ borderColor: '#e0e0e0' }}>
        <input type="text" placeholder="아이디를 입력해주세요" className="border rounded px-3 py-1 text-sm" style={{ borderColor: '#ccc', width: 280 }} />
        <button className="rounded px-4 py-1 text-white text-sm" style={{ background: '#3d8fef' }}>🔍</button>
      </div>

      <div className="mb-2">
        <span style={{ fontSize: 13, color: '#333' }}>목록 172,205건</span>
      </div>

      <div className="bg-white border rounded overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full text-sm border-collapse">
          <thead style={{ background: '#f8f8f8' }}>
            <tr>
              {['번호', '아이디', '로그인일자', '접속아이피', '로그인구분', '시스템구분'].map(h => (
                <th key={h} className="px-3 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #f0f0f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.no} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td className="px-3 py-2 text-center text-xs">{l.no}</td>
                <td className="px-3 py-2 text-center text-xs">{l.id}</td>
                <td className="px-3 py-2 text-center text-xs">{l.date}</td>
                <td className="px-3 py-2 text-center text-xs">{l.ip}</td>
                <td className="px-3 py-2 text-center text-xs">{l.loginType}</td>
                <td className="px-3 py-2 text-center text-xs">{l.sys}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-1 mt-4 text-xs">
        <button style={{ color: '#888' }}>«</button>
        <button style={{ color: '#888' }}>‹</button>
        {[1,2,3,4,5,6,7,8,9,10].map(p => (
          <button key={p} className="px-2" style={{ color: p === 1 ? '#e63946' : '#555', fontWeight: p === 1 ? 700 : 400 }}>{p}</button>
        ))}
        <button style={{ color: '#888' }}>›</button>
        <button style={{ color: '#888' }}>»</button>
      </div>
    </div>
  );
}
