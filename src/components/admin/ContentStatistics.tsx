// ADM_620: title is "접속통계" per spec (content statistics page but labeled as access stats)
const months = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
const data2025 = [820, 1050, 940, 1120, 1380, 1200, 760, 1450, 980, 1100, 870, 650];
const data2026 = [1050, 1280, 1150, 1410, 1620, 1380, 920, 1680, 1200, 0, 0, 0];
const maxVal = Math.max(...data2025, ...data2026);

const dailyHeaders = ['구분', '순위', '메뉴구분', '페이지뷰'];

export default function ContentStatistics() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>접속통계</h2>

      {/* Monthly filter */}
      <div className="flex items-center justify-center gap-3 p-4 mb-5 border rounded bg-white" style={{ borderColor: '#e0e0e0' }}>
        <span style={{ fontSize: 13, color: '#555', fontWeight: 500 }}>월간 접속통계</span>
        <span style={{ color: '#ccc' }}>|</span>
        <label style={{ fontSize: 13, color: '#555' }}>연도 선택</label>
        <select className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc' }}>
          <option>2026</option><option>2025</option>
        </select>
        <button className="rounded px-4 py-1 text-white text-sm" style={{ background: '#3d8fef' }}>검색</button>
      </div>

      {/* Bar chart */}
      <div className="bg-white border rounded p-4 mb-5" style={{ borderColor: '#e0e0e0' }}>
        <div className="flex items-end gap-2" style={{ height: 160 }}>
          {months.map((m, i) => (
            <div key={m} className="flex flex-col items-center flex-1 gap-0.5">
              <div className="flex items-end gap-0.5 w-full justify-center" style={{ height: 130 }}>
                <div style={{ width: 10, height: `${(data2025[i] / maxVal) * 100}%`, background: '#e63946', borderRadius: '2px 2px 0 0' }} />
                <div style={{ width: 10, height: `${(data2026[i] / maxVal) * 100}%`, background: '#4a90d9', borderRadius: '2px 2px 0 0' }} />
              </div>
              <span style={{ fontSize: 9, color: '#888' }}>{m}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-3">
          <div className="flex items-center gap-1"><div style={{ width: 12, height: 12, background: '#e63946', borderRadius: 2 }} /><span style={{ fontSize: 11, color: '#666' }}>2025</span></div>
          <div className="flex items-center gap-1"><div style={{ width: 12, height: 12, background: '#4a90d9', borderRadius: 2 }} /><span style={{ fontSize: 11, color: '#666' }}>2026</span></div>
        </div>
      </div>

      {/* Daily filter */}
      <div className="flex items-center justify-center gap-3 p-4 mb-5 border rounded bg-white" style={{ borderColor: '#e0e0e0' }}>
        <span style={{ fontSize: 13, color: '#555', fontWeight: 500 }}>일별 접속통계</span>
        <span style={{ color: '#ccc' }}>|</span>
        <select className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc' }}>
          <option>9월</option>{[...Array(12)].map((_, i) => i !== 8 && <option key={i}>{i+1}월</option>)}
        </select>
        <button className="rounded px-4 py-1 text-white text-sm" style={{ background: '#3d8fef' }}>검색</button>
      </div>

      {/* Daily table */}
      <div className="flex items-center justify-between mb-2">
        <span style={{ fontSize: 13, color: '#333' }}>목록 0건</span>
      </div>
      <div className="bg-white border rounded overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full text-sm border-collapse">
          <thead style={{ background: '#f8f8f8' }}>
            <tr>
              {dailyHeaders.map(h => (
                <th key={h} className="px-4 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #f0f0f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={dailyHeaders.length} className="px-4 py-10 text-center text-xs" style={{ color: '#aaa' }}>조회된 데이터가 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
