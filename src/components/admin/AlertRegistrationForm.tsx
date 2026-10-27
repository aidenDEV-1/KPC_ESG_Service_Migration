import EditorToolbar from './EditorToolbar';

interface Props {
  onBack: () => void;
}

export default function AlertRegistrationForm({ onBack }: Props) {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>알림관리</h2>
      <div className="bg-white border rounded overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={{ width: 140, background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>*구분</td>
              <td className="px-4 py-3" style={{ width: '42%' }}>
                <select className="border rounded px-2 py-1 text-sm w-full" style={{ borderColor: '#ccc' }}>
                  <option>전체</option><option>캠페인</option><option>시스템</option>
                </select>
              </td>
              <td className="px-4 py-3 text-sm font-medium" style={{ width: 140, background: '#f8f8f8', color: '#444', borderLeft: '1px solid #eee', borderRight: '1px solid #eee' }}>캠페인 구분</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <input type="text" className="border rounded px-2 py-1 text-sm flex-1" style={{ borderColor: '#ccc' }} />
                  <label className="flex items-center gap-1 text-sm" style={{ whiteSpace: 'nowrap' }}>
                    <input type="checkbox" /> 전체 알림
                  </label>
                </div>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>*제목</td>
              <td className="px-4 py-3" colSpan={3}>
                <input type="text" className="border rounded px-2 py-1 text-sm w-full" style={{ borderColor: '#ccc' }} />
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>작성자</td>
              <td className="px-4 py-3 text-sm" style={{ color: '#555' }}>afo1</td>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderLeft: '1px solid #eee', borderRight: '1px solid #eee' }}>작성일</td>
              <td className="px-4 py-3 text-sm" style={{ color: '#555' }}>2026-09-18</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee', verticalAlign: 'top', paddingTop: 12 }}>*내용</td>
              <td className="px-3 py-3" colSpan={3}>
                <EditorToolbar />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>*활성여부</td>
              <td className="px-4 py-3" colSpan={3}>
                <select className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc', width: 100 }}>
                  <option>활성</option><option>비활성</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-4">
        <button onClick={onBack} className="rounded px-3 py-1.5 text-sm border" style={{ borderColor: '#ccc', color: '#555', background: '#f5f5f5' }}>목록</button>
        <button className="rounded px-5 py-1.5 text-sm text-white font-medium" style={{ background: '#e63946' }}>저장</button>
      </div>
    </div>
  );
}
