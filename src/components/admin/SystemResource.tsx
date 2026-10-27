export default function SystemResource() {
  const totalKb = 638976;
  const usedKb = 410313;
  const freeKb = 228662;
  const usedPct = Math.round((usedKb / totalKb) * 100);
  const freePct = Math.round((freeKb / totalKb) * 100);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>시스템자원현황</h2>

      {/* Host info */}
      <div className="bg-white border rounded overflow-hidden mb-5" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full text-sm border-collapse">
          <thead style={{ background: '#f8f8f8' }}>
            <tr>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', width: '50%' }}>호스트</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0' }}>측정시각</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 text-center text-xs" style={{ borderRight: '1px solid #e0e0e0' }}>TEST-HOST-001 (192.0.2.10)</td>
              <td className="px-4 py-3 text-center text-xs">2026년 09월 17일 오후 03시 37분 09초</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-3">
        <button className="rounded px-4 py-1.5 text-white text-sm" style={{ background: '#3d8fef' }}>다시 읽기</button>
      </div>

      {/* Memory info */}
      <div className="bg-white border rounded overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full text-sm border-collapse">
          <thead style={{ background: '#f8f8f8' }}>
            <tr>
              <th className="px-6 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>전체 가상머신 메모리</th>
              <th className="px-6 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>사용중인 메모리</th>
              <th className="px-6 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0' }}>남아있는 메모리</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-6 py-4 text-center" style={{ borderRight: '1px solid #e0e0e0', verticalAlign: 'middle' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{totalKb.toLocaleString()} KB</div>
              </td>
              <td className="px-6 py-4 text-center" style={{ borderRight: '1px solid #e0e0e0', verticalAlign: 'middle' }}>
                <div style={{ fontSize: 13, color: '#555', marginBottom: 4 }}>({usedKb.toLocaleString()} KB)</div>
                <div className="rounded-full overflow-hidden mx-auto" style={{ height: 10, background: '#eee', width: '80%' }}>
                  <div style={{ width: `${usedPct}%`, height: '100%', background: '#e9a0a8', borderRadius: 9999 }} />
                </div>
                <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>({usedPct}%)</div>
              </td>
              <td className="px-6 py-4 text-center" style={{ verticalAlign: 'middle' }}>
                <div style={{ fontSize: 13, color: '#555', marginBottom: 4 }}>({freeKb.toLocaleString()} KB)</div>
                <div className="rounded-full overflow-hidden mx-auto" style={{ height: 10, background: '#eee', width: '80%' }}>
                  <div style={{ width: `${freePct}%`, height: '100%', background: '#90c0e0', borderRadius: 9999 }} />
                </div>
                <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>({freePct}%)</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
