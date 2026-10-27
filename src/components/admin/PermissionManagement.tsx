import { useState } from 'react';

const roles = [
  { code: 'ADM', name: '최고관리자' },
  { code: 'CONT', name: '콘텐츠관리자' },
  { code: 'MENU', name: '업무담당자' },
];

export default function PermissionManagement() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>권한목록</h2>

      {/* Top: role list */}
      <div className="bg-white border rounded overflow-hidden mb-4" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full text-sm border-collapse">
          <thead style={{ background: '#f8f8f8' }}>
            <tr>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #f0f0f0' }}>권한코드</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0' }}>권한명</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(r => (
              <tr
                key={r.code}
                onClick={() => setSelected(r.code)}
                className="cursor-pointer hover:bg-blue-50"
                style={{ borderBottom: '1px solid #f5f5f5', background: selected === r.code ? '#e8f0fe' : undefined }}
              >
                <td className="px-4 py-2 text-center text-xs font-medium text-blue-600" style={{ borderRight: '1px solid #f0f0f0' }}>{r.code}</td>
                <td className="px-4 py-2 text-center text-xs">{r.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button className="rounded px-3 py-1 text-white text-xs" style={{ background: '#888' }}>삭제</button>
        <div className="flex-1" />
        <button className="rounded px-3 py-1 text-white text-xs" style={{ background: '#3d8fef' }} onClick={() => setShowEditDialog(true)}>이름변경</button>
        <button className="rounded px-3 py-1 text-white text-xs" style={{ background: '#e63946' }} onClick={() => setShowAddDialog(true)}>권한추가</button>
      </div>

      {/* Bottom: menu permissions */}
      <div className="bg-white border rounded overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full text-sm border-collapse">
          <thead style={{ background: '#f8f8f8' }}>
            <tr>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #f0f0f0' }}>메뉴명</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #f0f0f0', width: 80 }}>권한<br />여부</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #f0f0f0' }}>수정자</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0' }}>수정일시</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="px-4 py-10 text-center text-xs" style={{ color: '#aaa' }}>권한 코드를 선택해주세요</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4">
        <button className="rounded px-6 py-2 text-white text-sm font-medium" style={{ background: '#e63946' }}>저장</button>
      </div>

      {/* ADM_852: 권한수정 Dialog */}
      {showEditDialog && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="bg-white rounded-lg overflow-hidden shadow-2xl" style={{ width: 400 }}>
            <div className="flex items-center justify-between px-5 py-3" style={{ background: '#e63946' }}>
              <span className="font-bold text-white text-sm">권한수정</span>
              <button onClick={() => setShowEditDialog(false)} style={{ color: '#fff', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            <div className="p-5">
              <div className="border rounded overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
                <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td className="px-4 py-3 text-sm font-medium" style={{ width: 100, background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>권한코드</td>
                      <td className="px-4 py-3 text-sm" style={{ color: '#555' }}>{selected || 'ADM'}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>권한명 *</td>
                      <td className="px-4 py-3">
                        <input type="text" defaultValue={roles.find(r => r.code === selected)?.name || '최고관리자'} className="border rounded px-2 py-1 text-sm w-full" style={{ borderColor: '#ccc' }} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowEditDialog(false)} className="rounded px-4 py-1.5 text-sm border" style={{ borderColor: '#ccc', color: '#555' }}>취소</button>
                <button className="rounded px-4 py-1.5 text-sm text-white font-medium" style={{ background: '#e63946' }}>수정</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADM_853: 권한추가 Dialog */}
      {showAddDialog && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="bg-white rounded-lg overflow-hidden shadow-2xl" style={{ width: 400 }}>
            <div className="flex items-center justify-between px-5 py-3" style={{ background: '#e63946' }}>
              <span className="font-bold text-white text-sm">권한추가</span>
              <button onClick={() => setShowAddDialog(false)} style={{ color: '#fff', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            <div className="p-5">
              <div className="border rounded overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
                <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td className="px-4 py-3 text-sm font-medium" style={{ width: 100, background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>권한코드 *</td>
                      <td className="px-4 py-3">
                        <input type="text" placeholder="영문 대문자" className="border rounded px-2 py-1 text-sm w-full" style={{ borderColor: '#ccc' }} />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>권한명 *</td>
                      <td className="px-4 py-3">
                        <input type="text" className="border rounded px-2 py-1 text-sm w-full" style={{ borderColor: '#ccc' }} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowAddDialog(false)} className="rounded px-4 py-1.5 text-sm border" style={{ borderColor: '#ccc', color: '#555' }}>취소</button>
                <button className="rounded px-4 py-1.5 text-sm text-white font-medium" style={{ background: '#e63946' }}>추가</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
