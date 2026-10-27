const headers = ['번호', '제목', '작성자', '작성일', '조회수', '사용여부'];

interface Props {
  onNavigate?: (page: string) => void;
}

export default function NoticeManagement({ onNavigate }: Props) {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>공지사항</h2>

      {/* Filter */}
      <div className="flex items-center justify-center gap-3 p-4 mb-5 border rounded bg-white" style={{ borderColor: '#e0e0e0' }}>
        <label style={{ fontSize: 13, color: '#555' }}>활성여부</label>
        <select className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc' }}>
          <option>활성</option><option>전체</option><option>비활성</option>
        </select>
        <label style={{ fontSize: 13, color: '#555' }}>검색어</label>
        <select className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc' }}>
          <option>전체</option><option>제목</option><option>작성자</option>
        </select>
        <input type="text" placeholder="검색어를 입력해주세요" className="border rounded px-3 py-1 text-sm" style={{ borderColor: '#ccc', width: 220 }} />
        <button className="rounded px-4 py-1 text-white text-sm" style={{ background: '#3d8fef' }}>검색</button>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span style={{ fontSize: 13, color: '#333' }}>목록 0건</span>
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
            <tr>
              <td colSpan={headers.length} className="px-4 py-10 text-center text-xs" style={{ color: '#aaa' }}>조회된 데이터가 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-1 text-xs" style={{ color: '#e63946' }}>1</div>
        <button className="rounded px-4 py-1.5 text-white text-sm font-medium" style={{ background: '#e63946' }} onClick={() => onNavigate?.('notice-registration')}>글쓰기</button>
      </div>
    </div>
  );
}
