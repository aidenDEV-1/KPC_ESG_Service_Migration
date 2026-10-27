import { useState } from 'react';

const logs = [
  { no: 211181, sys: 'MNG', url: '/mngr/adminMember/adminMemberList.do?useAt=Y', date: '15:36:55', action: 'test01', id: 'test01', ip: '192.0.2.10' },
  { no: 211180, sys: 'MNG', url: '/mngr/adminMember/adminMemberList.do?useAt=Y', date: '15:36:48', action: 'test01', id: 'test01', ip: '192.0.2.10' },
  { no: 211179, sys: 'MNG', url: '/mngr/statics/accesslog.do', date: '15:36:47', action: 'test01', id: 'test01', ip: '192.0.2.10' },
  { no: 211178, sys: 'MNG', url: '/mngr/adminMember/adminMemberList.do?useAt=Y', date: '15:36:41', action: 'test01', id: 'test01', ip: '192.0.2.10' },
  { no: 211177, sys: 'MNG', url: '/mngr/adminMember/adminMemberList.do?useAt=Y', date: '15:36:40', action: 'test01', id: 'test01', ip: '192.0.2.10' },
  { no: 211176, sys: 'MNG', url: '/mngr/adminMember/adminMemberList.do?useAt=Y', date: '15:36:38', action: 'test01', id: 'test01', ip: '192.0.2.10' },
  { no: 211175, sys: 'MNG', url: '/mngr/statics/weblog.do', date: '15:36:34', action: 'test01', id: 'test01', ip: '192.0.2.10' },
  { no: 211174, sys: 'MNG', url: '/mngr/statics/boardInfo.do', date: '15:36:31', action: 'test01', id: 'test01', ip: '192.0.2.10' },
  { no: 211173, sys: 'MNG', url: '/mngr/statics/accesslog.do', date: '15:36:20', action: 'test01', id: 'test01', ip: '192.0.2.10' },
];

const cleanupRows = [
  { year: '2024', count: '48,021' },
  { year: '2023', count: '120,305' },
  { year: '2022', count: '98,774' },
];

export default function AccessLog() {
  const [showCleanupDialog, setShowCleanupDialog] = useState(false);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>관리로그</h2>

      {/* Filter */}
      <div className="flex items-center justify-center gap-3 p-4 mb-5 border rounded bg-white" style={{ borderColor: '#e0e0e0' }}>
        <label style={{ fontSize: 13, color: '#555' }}>검색구분</label>
        <select className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc' }}>
          <option>전체</option><option>MNG</option><option>FRT</option>
        </select>
        <span style={{ color: '#ccc' }}>|</span>
        <input type="text" placeholder="시작일" className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc', width: 110 }} />
        <span style={{ color: '#888', fontSize: 12 }}>📅</span>
        <span>-</span>
        <input type="text" placeholder="종료일" className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc', width: 110 }} />
        <span style={{ color: '#888', fontSize: 12 }}>📅</span>
        <button className="rounded px-4 py-1 text-white text-sm" style={{ background: '#3d8fef' }}>검색</button>
      </div>

      <div className="mb-2">
        <span style={{ fontSize: 13, color: '#333' }}>목록 211,181건</span>
      </div>

      <div className="bg-white border rounded overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full text-sm border-collapse">
          <thead style={{ background: '#f8f8f8' }}>
            <tr>
              {['번호', '시스템구분', '접속URL', '접속날짜', '액션', '아이디', '접속IP'].map(h => (
                <th key={h} className="px-3 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #f0f0f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.no} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td className="px-3 py-2 text-center text-xs">{l.no}</td>
                <td className="px-3 py-2 text-center text-xs text-blue-600">{l.sys}</td>
                <td className="px-3 py-2 text-xs" style={{ maxWidth: 400 }}>{l.url}</td>
                <td className="px-3 py-2 text-center text-xs">{l.date}</td>
                <td className="px-3 py-2 text-center text-xs">{l.action}</td>
                <td className="px-3 py-2 text-center text-xs">{l.id}</td>
                <td className="px-3 py-2 text-center text-xs">{l.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-1 text-xs">
          <button style={{ color: '#888' }}>«</button>
          <button style={{ color: '#888' }}>‹</button>
          {[1,2,3,4,5,6,7,8,9,10].map(p => (
            <button key={p} className="px-2" style={{ color: p === 1 ? '#e63946' : '#555', fontWeight: p === 1 ? 700 : 400 }}>{p}</button>
          ))}
          <button style={{ color: '#888' }}>›</button>
          <button style={{ color: '#888' }}>»</button>
        </div>
        <button className="rounded px-3 py-1 border text-xs" style={{ borderColor: '#ccc', color: '#555' }} onClick={() => setShowCleanupDialog(true)}>로그정리</button>
      </div>

      {/* ADM_813: 접속로그정리 Dialog */}
      {showCleanupDialog && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="bg-white rounded-lg overflow-hidden shadow-2xl" style={{ width: 480 }}>
            <div className="flex items-center justify-between px-5 py-3" style={{ background: '#e63946' }}>
              <span className="font-bold text-white text-sm">접속로그정리</span>
              <button onClick={() => setShowCleanupDialog(false)} style={{ color: '#fff', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            <div className="p-5">
              <p className="text-xs mb-4" style={{ color: '#555' }}>삭제할 연도를 선택하세요. 해당 연도의 로그가 모두 삭제됩니다.</p>
              <div className="border rounded overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
                <table className="w-full text-sm border-collapse">
                  <thead style={{ background: '#f8f8f8' }}>
                    <tr>
                      <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #f0f0f0' }}>선택</th>
                      <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #f0f0f0' }}>연도</th>
                      <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0' }}>로그 건수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cleanupRows.map(r => (
                      <tr key={r.year} style={{ borderBottom: '1px solid #f5f5f5' }}>
                        <td className="px-4 py-2 text-center"><input type="checkbox" /></td>
                        <td className="px-4 py-2 text-center text-xs">{r.year}</td>
                        <td className="px-4 py-2 text-center text-xs">{r.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowCleanupDialog(false)} className="rounded px-4 py-1.5 text-sm border" style={{ borderColor: '#ccc', color: '#555' }}>취소</button>
                <button className="rounded px-4 py-1.5 text-sm text-white font-medium" style={{ background: '#e63946' }}>삭제</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
