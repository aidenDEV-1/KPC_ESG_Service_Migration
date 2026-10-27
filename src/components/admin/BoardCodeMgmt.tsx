const boards = [
  { no: 5, name: '알림관리', reply: 'N', comment: 'N', pinned: 'N', files: 0, used: 'Y' },
  { no: 4, name: 'QnA', reply: 'Y', comment: 'N', pinned: 'N', files: 1, used: 'Y' },
  { no: 3, name: 'FAQ', reply: 'N', comment: 'N', pinned: 'N', files: 0, used: 'Y' },
  { no: 2, name: '활동사진', reply: 'Y', comment: 'Y', pinned: 'Y', files: 10, used: 'Y' },
  { no: 1, name: '공지사항', reply: 'N', comment: 'N', pinned: 'Y', files: 1, used: 'Y' },
];

const headers = ['게시판 번호', '게시판명', '답글여부', '코멘트여부', '상단고정여부', '파일첨부개수', '사용여부'];

export default function BoardCodeMgmt() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>게시판코드관리</h2>

      {/* Filter */}
      <div className="flex items-center justify-center gap-3 p-4 mb-5 border rounded bg-white" style={{ borderColor: '#e0e0e0' }}>
        <label style={{ fontSize: 13, color: '#555' }}>활성여부</label>
        <select className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc' }}>
          <option>전체</option><option>활성</option><option>비활성</option>
        </select>
        <label style={{ fontSize: 13, color: '#555' }}>검색어</label>
        <select className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc' }}>
          <option>전체</option><option>게시판명</option>
        </select>
        <input type="text" placeholder="검색어를 입력해주세요" className="border rounded px-3 py-1 text-sm" style={{ borderColor: '#ccc', width: 220 }} />
        <button className="rounded px-4 py-1 text-white text-sm" style={{ background: '#3d8fef' }}>검색</button>
      </div>

      <div className="bg-white border rounded overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full text-sm border-collapse">
          <thead style={{ background: '#f8f8f8' }}>
            <tr>
              {headers.map(h => (
                <th key={h} className="px-4 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #f0f0f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {boards.map(b => (
              <tr key={b.no} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td className="px-4 py-2 text-center text-xs text-blue-600 cursor-pointer hover:underline">{b.no}</td>
                <td className="px-4 py-2 text-center text-xs">{b.name}</td>
                <td className="px-4 py-2 text-center text-xs">{b.reply}</td>
                <td className="px-4 py-2 text-center text-xs">{b.comment}</td>
                <td className="px-4 py-2 text-center text-xs">{b.pinned}</td>
                <td className="px-4 py-2 text-center text-xs">{b.files}</td>
                <td className="px-4 py-2 text-center text-xs">{b.used}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-1 text-xs" style={{ color: '#e63946' }}>1</div>
        <button className="rounded px-4 py-1.5 text-white text-sm font-medium" style={{ background: '#e63946' }}>게시판 등록</button>
      </div>
    </div>
  );
}
