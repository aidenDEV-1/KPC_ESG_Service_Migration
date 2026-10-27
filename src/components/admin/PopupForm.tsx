import EditorToolbar from './EditorToolbar';

interface Props {
  mode: 'registration' | 'edit';
  onBack: () => void;
}

export default function PopupForm({ mode, onBack }: Props) {
  const isEdit = mode === 'edit';

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>팝업정보 {isEdit ? '수정' : '등록'}</h2>
      <div className="bg-white border rounded overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={{ width: 140, background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>제목</td>
              <td className="px-4 py-3" colSpan={3}>
                <input type="text" defaultValue={isEdit ? '팝업테스트3' : ''} className="border rounded px-2 py-1 text-sm w-full" style={{ borderColor: '#ccc' }} />
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>노출 시작일</td>
              <td className="px-4 py-3" style={{ width: '38%' }}>
                <div className="flex items-center gap-2">
                  <input type="text" defaultValue={isEdit ? '2025-02-07' : ''} className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc', width: 120 }} />
                  <span style={{ fontSize: 16 }}>📅</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderLeft: '1px solid #eee', borderRight: '1px solid #eee' }}>노출 종료일</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <input type="text" defaultValue={isEdit ? '2025-02-13' : ''} className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc', width: 120 }} />
                  <span style={{ fontSize: 16 }}>📅</span>
                </div>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>사이즈 width</td>
              <td className="px-4 py-3">
                <input type="text" defaultValue={isEdit ? '445' : ''} className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc', width: 80 }} />
              </td>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderLeft: '1px solid #eee', borderRight: '1px solid #eee' }}>사이즈 height</td>
              <td className="px-4 py-3">
                <input type="text" defaultValue={isEdit ? '440' : ''} className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc', width: 80 }} />
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>위치 top</td>
              <td className="px-4 py-3">
                <input type="text" defaultValue={isEdit ? '40' : ''} className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc', width: 80 }} />
              </td>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderLeft: '1px solid #eee', borderRight: '1px solid #eee' }}>위치 left</td>
              <td className="px-4 py-3">
                <input type="text" defaultValue={isEdit ? '20' : ''} className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc', width: 80 }} />
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>팝업 대상</td>
              <td className="px-4 py-3" colSpan={3}>
                <div className="flex gap-4">
                  {['모두 공개', '실사자만 공개', '협력사만 공개'].map((label, i) => (
                    <label key={label} className="flex items-center gap-1 text-sm">
                      <input type="radio" name="popup-target" defaultChecked={i === 0} /> {label}
                    </label>
                  ))}
                </div>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee', verticalAlign: 'top', paddingTop: 12 }}>내용</td>
              <td className="px-3 py-3" colSpan={3}>
                <EditorToolbar>
                  {isEdit && <span>테스트 팝업입니다.</span>}
                </EditorToolbar>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>사용여부</td>
              <td className="px-4 py-3" colSpan={3}>
                <select className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc', width: 80 }}>
                  <option>Y</option><option>N</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button onClick={onBack} className="rounded px-3 py-1.5 text-sm border" style={{ borderColor: '#ccc', color: '#555', background: '#f5f5f5' }}>목록</button>
        <div className="flex gap-2">
          <button className="rounded px-3 py-1.5 text-sm text-white" style={{ background: '#3d8fef' }}>미리보기</button>
          <button onClick={onBack} className="rounded px-3 py-1.5 text-sm border" style={{ borderColor: '#ccc', color: '#555', background: '#888', color: '#fff' }}>취소</button>
          <button className="rounded px-5 py-1.5 text-sm text-white font-medium" style={{ background: '#e63946' }}>저장</button>
        </div>
      </div>
    </div>
  );
}
