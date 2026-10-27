const boards = [
  { name: '공지사항', posts25: 12, comments25: 0, posts26: 8, comments26: 0 },
  { name: '활동사진', posts25: 5, comments25: 3, posts26: 2, comments26: 1 },
  { name: 'FAQ', posts25: 20, comments25: 0, posts26: 10, comments26: 0 },
  { name: 'QnA', posts25: 45, comments25: 43, posts26: 18, comments26: 17 },
  { name: '알림관리', posts25: 7, comments25: 0, posts26: 3, comments26: 0 },
];

export default function BoardStatistics() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>게시물통계</h2>

      {/* Filter */}
      <div className="flex items-center justify-center gap-3 p-4 mb-5 border rounded bg-white" style={{ borderColor: '#e0e0e0' }}>
        <span style={{ fontSize: 13, color: '#555', fontWeight: 500 }}>월간 접속통계</span>
        <span style={{ color: '#ccc' }}>|</span>
        <label style={{ fontSize: 13, color: '#555' }}>연도 선택</label>
        <select className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc' }}>
          <option>2026</option><option>2025</option>
        </select>
        <button className="rounded px-4 py-1 text-white text-sm" style={{ background: '#3d8fef' }}>검색</button>
      </div>

      <div className="bg-white border rounded overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full text-sm border-collapse">
          <thead style={{ background: '#f8f8f8' }}>
            <tr>
              <th rowSpan={2} className="px-4 py-2 text-center text-xs font-medium" style={{ borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', color: '#555' }}>커뮤니티</th>
              <th colSpan={2} className="px-4 py-2 text-center text-xs font-medium" style={{ borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', color: '#555' }}>2025년</th>
              <th colSpan={2} className="px-4 py-2 text-center text-xs font-medium" style={{ borderBottom: '1px solid #e0e0e0', color: '#555' }}>2026년</th>
            </tr>
            <tr>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #f0f0f0', color: '#555', background: '#f8f8f8' }}>글</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', color: '#555', background: '#f8f8f8' }}>댓글</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #f0f0f0', color: '#555', background: '#f8f8f8' }}>글</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ borderBottom: '1px solid #e0e0e0', color: '#555', background: '#f8f8f8' }}>댓글</th>
            </tr>
            <tr>
              <td colSpan={5} className="px-4 py-1 text-center text-xs font-medium" style={{ background: '#eef2f5', borderBottom: '1px solid #e0e0e0', color: '#555' }}>121212</td>
            </tr>
          </thead>
          <tbody>
            {boards.map(b => (
              <tr key={b.name} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td className="px-4 py-2 text-center text-xs" style={{ borderRight: '1px solid #f0f0f0' }}>{b.name}</td>
                <td className="px-4 py-2 text-center text-xs" style={{ borderRight: '1px solid #f0f0f0' }}>{b.posts25}</td>
                <td className="px-4 py-2 text-center text-xs" style={{ borderRight: '1px solid #e0e0e0' }}>{b.comments25}</td>
                <td className="px-4 py-2 text-center text-xs" style={{ borderRight: '1px solid #f0f0f0' }}>{b.posts26}</td>
                <td className="px-4 py-2 text-center text-xs">{b.comments26}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
