interface Props {
  onBack: () => void;
}

export default function BasicInfoCategoryMgmt({ onBack }: Props) {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>기본정보 분류 관리</h2>
      <div className="flex gap-6">
        {/* Left tree panel */}
        <div style={{ width: 320, flexShrink: 0 }}>
          <div className="border rounded overflow-hidden" style={{ borderColor: '#ccc' }}>
            <div className="flex items-center gap-3 px-3 py-2 border-b" style={{ borderColor: '#e0e0e0', background: '#f8f8f8' }}>
              <button style={{ fontSize: 12, color: '#3d8fef', cursor: 'pointer', background: 'none', border: 'none' }}>+ 전체 펼침</button>
              <button style={{ fontSize: 12, color: '#888', cursor: 'pointer', background: 'none', border: 'none' }}>- 전체 닫기</button>
            </div>
            <div className="p-3" style={{ minHeight: 200 }}>
              <div className="flex items-center gap-2 py-1">
                <span style={{ fontSize: 14 }}>📁</span>
                <span style={{ fontSize: 13, color: '#333' }}>Top</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="rounded px-3 py-1.5 text-sm font-medium text-white" style={{ background: '#888' }}>삭제</button>
            <button className="rounded px-3 py-1.5 text-sm font-medium text-white" style={{ background: '#e63946' }}>하위분류생성</button>
          </div>
        </div>

        {/* Right form */}
        <div className="flex-1">
          <div className="text-xs mb-4" style={{ color: '#555', lineHeight: 1.8 }}>
            - 설문 분류 관리는 1 뎁스 까지 생성 가능 합니다.<br />
            - 설문 제작은 0 뎁스에서 가능합니다.
          </div>
          <div className="bg-white border rounded overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td className="px-4 py-3 text-sm font-medium" style={{ width: 120, background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>캠페인</td>
                  <td className="px-4 py-3 text-sm" colSpan={3}>TEST ESG CAMPAIGN 01</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>메뉴ID</td>
                  <td className="px-4 py-3" style={{ width: '38%' }}>
                    <input type="text" className="border rounded px-2 py-1 text-sm w-full" style={{ borderColor: '#ccc' }} />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderLeft: '1px solid #eee', borderRight: '1px solid #eee' }}>메뉴순서 *</td>
                  <td className="px-4 py-3">
                    <input type="number" className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc', width: 80 }} />
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>메뉴경로</td>
                  <td className="px-4 py-3 text-sm" colSpan={3} style={{ color: '#888' }}></td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>분류명 *</td>
                  <td className="px-4 py-3">
                    <input type="text" className="border rounded px-2 py-1 text-sm w-full" style={{ borderColor: '#ccc' }} />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderLeft: '1px solid #eee', borderRight: '1px solid #eee' }}>분류번호 *</td>
                  <td className="px-4 py-3">
                    <input type="text" className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc', width: 100 }} />
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
          <div className="flex justify-end mt-3">
            <button className="rounded px-5 py-1.5 text-sm text-white font-medium" style={{ background: '#e63946' }}>분류 저장</button>
          </div>
        </div>
      </div>
    </div>
  );
}
