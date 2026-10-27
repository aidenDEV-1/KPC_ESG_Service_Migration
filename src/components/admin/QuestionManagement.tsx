import { admQuestions } from '../../data';

interface Props {
  onNavigate?: (page: string) => void;
}

export default function QuestionManagement({ onNavigate }: Props) {
  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>질의 관리</h1>

      {/* Filters */}
      <div className="bg-white border rounded p-4 mb-4 flex justify-center gap-2" style={{ borderColor: '#e0e0e0' }}>
        <select className="border rounded px-3 py-1 text-sm" style={{ borderColor: '#ccc' }}>
          <option>시험분류</option>
          <option>노동 및 인권</option>
          <option>안전 및 보건</option>
          <option>환경</option>
          <option>윤리</option>
          <option>경영시스템</option>
        </select>
        <select className="border rounded px-3 py-1 text-sm" style={{ borderColor: '#ccc' }}>
          <option>질의유형</option>
          <option>체크박스</option>
          <option>라디오</option>
        </select>
        <select className="border rounded px-3 py-1 text-sm" style={{ borderColor: '#ccc' }}>
          <option>리스트 목록 선택</option>
        </select>
        <input type="text" placeholder="검색 질의 제목을 입력하" className="border rounded px-3 py-1 text-sm" style={{ borderColor: '#ccc', width: 200 }} />
        <button className="rounded px-3 py-1 text-white text-sm" style={{ backgroundColor: '#1e56d9' }}>🔍</button>
      </div>

      {/* Count */}
      <div className="mb-2">
        <span style={{ fontSize: 13 }}>목록 <span style={{ color: '#e63946', fontWeight: 700 }}>5,606</span>건</span>
      </div>

      {/* Table */}
      <div className="bg-white border rounded overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full text-sm border-collapse">
          <thead style={{ background: '#f8f8f8' }}>
            <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
              {['No', '시험분류', '문제 번호', '제목', '유형', '필수', '해당없음', '첨부파일'].map(h => (
                <th key={h} className="px-3 py-2 text-center text-xs font-medium" style={{ color: '#555', borderRight: '1px solid #f0f0f0', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {admQuestions.map(q => (
              <tr key={q.no} style={{ borderBottom: '1px solid #f5f5f5' }} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-center text-xs text-blue-600 cursor-pointer hover:underline">{q.no}</td>
                <td className="px-3 py-2 text-center text-xs">{q.category}</td>
                <td className="px-3 py-2 text-center text-xs">{q.code}</td>
                <td className="px-3 py-2 text-xs text-blue-600 cursor-pointer hover:underline" style={{ maxWidth: 420 }}>{q.title}</td>
                <td className="px-3 py-2 text-center text-xs">{q.type}</td>
                <td className="px-3 py-2 text-center text-xs">{q.required}</td>
                <td className="px-3 py-2 text-center text-xs">{q.noAnswer}</td>
                <td className="px-3 py-2 text-center text-xs">{q.attachment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-1 mt-4">
        <button className="px-2 py-1 text-sm text-gray-500">«</button>
        <button className="px-2 py-1 text-sm text-gray-500">‹</button>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(p => (
          <button key={p} className="px-2 py-1 text-sm"
            style={{ color: p === 1 ? '#e63946' : '#555', fontWeight: p === 1 ? 700 : 400 }}>{p}</button>
        ))}
        <button className="px-2 py-1 text-sm text-gray-500">›</button>
        <button className="px-2 py-1 text-sm text-gray-500">»</button>
      </div>

      <div className="flex justify-end mt-4">
        <button className="rounded px-4 py-2 text-white text-sm font-medium" style={{ background: '#1e56d9' }} onClick={() => onNavigate?.('question-registration')}>등록</button>
      </div>
    </div>
  );
}
