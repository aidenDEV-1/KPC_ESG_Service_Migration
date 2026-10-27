export default function BasicInfo() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#e8e8e8' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>기본정보</h2>
        <button className="rounded px-4 py-1.5 text-sm text-white font-medium" style={{ background: '#e63946' }}>저장</button>
      </div>

      <div className="p-6">
        {/* Q1 */}
        <div className="border-b pb-5 mb-5" style={{ borderColor: '#f0f0f0' }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>1) 귀사의 최근 3년간 매출액 및 영업이익을 기입하여 주십시오.</div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm w-16 flex-shrink-0">매출액</span>
              {['2021', '2022', '2023'].map(y => (
                <div key={y} className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold text-gray-500">{y}년</span>
                  <input type="text" aria-label={`${y}년 매출액`} className="border rounded px-3 py-1.5 text-sm" style={{ borderColor: '#ccc', width: 120 }} />
                </div>
              ))}
              <span className="text-sm text-red-500">억원</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm w-16 flex-shrink-0">영업이익</span>
              {['2021', '2022', '2023'].map(y => (
                <div key={y} className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold text-gray-500">{y}년</span>
                  <input type="text" aria-label={`${y}년 영업이익`} className="border rounded px-3 py-1.5 text-sm" style={{ borderColor: '#ccc', width: 120 }} />
                </div>
              ))}
              <span className="text-sm text-red-500">억원</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>단위는 <span style={{ color: '#e63946', fontWeight: 700 }}>"억원"</span>입니다. 꼭 확인해 주세요.</div>
        </div>

        {/* Q2 */}
        <div className="border-b pb-5 mb-5" style={{ borderColor: '#f0f0f0' }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>2) 귀사는 연소근로자(18세 미만)를 고용하고 있습니까?</div>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm"><input type="radio" name="q2" /> 예</label>
            <label className="flex items-center gap-2 text-sm"><input type="radio" name="q2" /> 아니오</label>
          </div>
        </div>
      </div>
    </div>
  );
}
