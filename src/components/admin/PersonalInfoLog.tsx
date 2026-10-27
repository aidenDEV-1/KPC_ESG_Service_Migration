const logs = [
  { no: 21172, id: 'test07', ip: '192.0.2.10', type: '수정', prog: '/mngr/member/saveExec.do', date: '2026-09-17 15:20:19.0', sys: 'MNG' },
  { no: 21171, id: 'test07', ip: '192.0.2.10', type: '조회', prog: '/mngr/member/form.do', date: '2026-09-17 15:20:16.0', sys: 'MNG' },
  { no: 21170, id: 'test07', ip: '192.0.2.10', type: '수정', prog: '/mngr/member/saveExec.do', date: '2026-09-17 15:19:05.0', sys: 'MNG' },
  { no: 21169, id: 'test07', ip: '192.0.2.10', type: '조회', prog: '/mngr/member/form.do', date: '2026-09-17 15:18:40.0', sys: 'MNG' },
  { no: 21168, id: 'test06', ip: '192.0.2.10', type: '수정', prog: '/mngr/campaign/campaignModExec.do', date: '2026-09-17 15:13:33.0', sys: 'MNG' },
  { no: 21167, id: 'test06', ip: '192.0.2.10', type: '수정', prog: '/mngr/campaign/campaignModExec.do', date: '2026-09-17 15:13:24.0', sys: 'MNG' },
  { no: 21166, id: 'test06', ip: '192.0.2.10', type: '수정', prog: '/mngr/campaign/campaignModExec.do', date: '2026-09-17 15:13:20.0', sys: 'MNG' },
  { no: 21165, id: 'test06', ip: '192.0.2.10', type: '조회', prog: '/mngr/member/form.do', date: '2026-09-17 15:13:44.0', sys: 'MNG' },
  { no: 21164, id: 'test06', ip: '192.0.2.10', type: '조회', prog: '/mngr/member/form.do', date: '2026-09-17 15:13:40.0', sys: 'MNG' },
  { no: 21163, id: 'test06', ip: '192.0.2.10', type: '조회', prog: '/mngr/member/form.do', date: '2026-09-17 15:13:12.0', sys: 'MNG' },
];

export default function PersonalInfoLog() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>개인정보처리로그관리</h2>

      {/* Filter */}
      <div className="flex items-center justify-center gap-3 p-4 mb-5 border rounded bg-white" style={{ borderColor: '#e0e0e0' }}>
        <input type="text" placeholder="아이디를 입력하세요" className="border rounded px-3 py-1 text-sm" style={{ borderColor: '#ccc', width: 280 }} />
        <button className="rounded px-4 py-1 text-white text-sm" style={{ background: '#3d8fef' }}>🔍</button>
      </div>

      <div className="bg-white border rounded overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full text-sm border-collapse">
          <thead style={{ background: '#f8f8f8' }}>
            <tr>
              {['번호', '아이디', '접속아이피', '처리구분', '처리프로그램', '처리일자', '시스템구분'].map(h => (
                <th key={h} className="px-3 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #f0f0f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.no} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td className="px-3 py-2 text-center text-xs">{l.no}</td>
                <td className="px-3 py-2 text-center text-xs">{l.id}</td>
                <td className="px-3 py-2 text-center text-xs">{l.ip}</td>
                <td className="px-3 py-2 text-center text-xs">{l.type}</td>
                <td className="px-3 py-2 text-xs">{l.prog}</td>
                <td className="px-3 py-2 text-center text-xs">{l.date}</td>
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
