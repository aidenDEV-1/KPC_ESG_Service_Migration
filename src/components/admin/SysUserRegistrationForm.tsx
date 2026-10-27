import { useState } from 'react';

interface Props {
  onBack: () => void;
}

export default function SysUserRegistrationForm({ onBack }: Props) {
  const [role, setRole] = useState('선택');

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>사용자 등록/관리</h2>
      <p style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>ADMIN 또는 KPC 관리자 계정을 등록합니다.</p>
      <p style={{ fontSize: 12, color: '#e63946', marginBottom: 16 }}>※ 회원 '비활성' 설정 시 해당 아이디로 로그인되지 않습니다.</p>

      <div className="bg-white border rounded overflow-hidden mb-4" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={{ width: 140, background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>* ID</td>
              <td className="px-4 py-3" style={{ width: '38%' }}>
                <input type="text" className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc', width: 200 }} />
              </td>
              <td className="px-4 py-3 text-sm font-medium" style={{ width: 140, background: '#f8f8f8', color: '#444', borderLeft: '1px solid #eee', borderRight: '1px solid #eee' }}>이름</td>
              <td className="px-4 py-3">
                <input type="text" className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc', width: 200 }} />
              </td>
            </tr>
            {role !== '선택' && (
              <tr>
                <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>권한 범위</td>
                <td className="px-4 py-3 text-xs leading-5" colSpan={3} style={{ color: role === 'ADMIN' ? '#1a3055' : '#666' }}>
                  {role === 'ADMIN'
                    ? '전체 권한: 시스템 관리, 기본 SET, 회원, 질의, 캠페인, KPC 사용자 등록'
                    : '운영 권한: 회원, 질의, 캠페인 관리 / 시스템 관리 및 기본 SET 관리 제외'}
                </td>
              </tr>
            )}
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>비밀번호</td>
              <td className="px-4 py-3">
                <input type="password" className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc', width: 200 }} />
              </td>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderLeft: '1px solid #eee', borderRight: '1px solid #eee' }}>활성여부</td>
              <td className="px-4 py-3">
                <select className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc', width: 100 }}>
                  <option>활성</option><option>비활성</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>관리자권한</td>
              <td className="px-4 py-3" style={{ position: 'relative' }}>
                <select value={role} onChange={event => setRole(event.target.value)} className="h-9 w-36 rounded border border-gray-300 bg-white px-3 text-sm">
                  <option value="선택" disabled>선택</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="KPC">KPC</option>
                </select>
              </td>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderLeft: '1px solid #eee', borderRight: '1px solid #eee' }}>부서</td>
              <td className="px-4 py-3">
                <input type="text" className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc', width: 200 }} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="rounded px-3 py-1.5 text-sm border" style={{ borderColor: '#ccc', color: '#555', background: '#f5f5f5' }}>목록</button>
        <button className="rounded px-5 py-1.5 text-sm text-white font-medium" style={{ background: '#e63946' }}>저장</button>
      </div>
    </div>
  );
}
