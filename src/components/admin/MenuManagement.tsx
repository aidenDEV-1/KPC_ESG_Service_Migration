import { useState } from 'react';

export default function MenuManagement() {
  const [selected, setSelected] = useState(false);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>메뉴관리</h2>

      <div className="flex gap-4" style={{ minHeight: 500 }}>
        {/* Left: tree panel */}
        <div className="border rounded bg-white" style={{ width: 280, borderColor: '#e0e0e0', flexShrink: 0 }}>
          <div className="flex items-center gap-3 px-3 py-2 border-b text-xs" style={{ borderColor: '#e0e0e0', color: '#555' }}>
            <button className="hover:text-blue-600">+ 전체 펼침</button>
            <button className="hover:text-blue-600">- 전체 닫기</button>
          </div>
          <div className="p-3">
            <div
              className="flex items-center gap-1 px-2 py-1 rounded cursor-pointer hover:bg-gray-100"
              style={{ background: selected ? '#e8f0fe' : undefined }}
              onClick={() => setSelected(true)}
            >
              <span style={{ fontSize: 14 }}>▶</span>
              <span style={{ fontSize: 13 }}>📁</span>
              <span style={{ fontSize: 12, color: '#333' }}>루</span>
            </div>
          </div>
          <div className="flex gap-2 px-3 pb-3">
            <button className="rounded px-3 py-1 text-white text-xs" style={{ background: '#888' }}>삭제</button>
            <button className="rounded px-3 py-1 text-white text-xs" style={{ background: '#e63946' }}>하위메뉴생성</button>
          </div>
        </div>

        {/* Right: form */}
        <div className="flex-1 border rounded bg-white p-4" style={{ borderColor: '#e0e0e0' }}>
          {/* Info text */}
          <div className="border rounded p-3 mb-4 text-xs" style={{ borderColor: '#e0e0e0', background: '#fafafa', color: '#555', lineHeight: 1.7 }}>
            <div>- 메뉴 생성시 메뉴권한관리에서 메뉴에 대한 권한을 등록 해야 메뉴가 해당 사용자에게 메뉴가 노출 됩니다.</div>
            <div>- 상세페이지 여부 항목은 등록 폼과 같이 상세 화면에 Y로 설정합니다. 상세 페이지에 대한 리스트 페이지에 메뉴 선택 처리를 하기 위합니다.</div>
            <div>- 메뉴는 4뎁스 까지 생성 가능하며 4뎁스 구조로 메뉴를 생성시에는 상단1뎁스 왼쪽은 2~4뎁스 구조로 메뉴를 구성해야 합니다.</div>
          </div>

          <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium" style={{ color: '#555', width: 80, flexShrink: 0 }}>메뉴ID</label>
              <span className="text-xs flex-1 border rounded px-2 py-1 bg-gray-50" style={{ borderColor: '#e0e0e0', minHeight: 28 }}></span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium" style={{ color: '#555', width: 80, flexShrink: 0 }}>메뉴순서 <span style={{ color: '#e63946' }}>*</span></label>
              <input type="text" className="border rounded px-2 py-1 text-xs flex-1" style={{ borderColor: '#ccc' }} />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <label className="text-xs font-medium" style={{ color: '#555', width: 80, flexShrink: 0 }}>메뉴경로</label>
            <span className="text-xs flex-1 border rounded px-2 py-1 bg-gray-50" style={{ borderColor: '#e0e0e0', minHeight: 28 }}></span>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <label className="text-xs font-medium" style={{ color: '#555', width: 80, flexShrink: 0 }}>메뉴명 <span style={{ color: '#e63946' }}>*</span></label>
            <input type="text" className="border rounded px-2 py-1 text-xs flex-1" style={{ borderColor: '#ccc' }} />
          </div>

          <div className="grid gap-3 mt-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium" style={{ color: '#555', width: 80, flexShrink: 0 }}>사용여부</label>
              <select className="border rounded px-2 py-1 text-xs flex-1" style={{ borderColor: '#ccc' }}>
                <option>Y</option><option>N</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium" style={{ color: '#555', width: 100, flexShrink: 0 }}>상세 페이지 여부</label>
              <select className="border rounded px-2 py-1 text-xs flex-1" style={{ borderColor: '#ccc' }}>
                <option>Y</option><option>N</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3">
            <label className="text-xs font-medium" style={{ color: '#555', width: 80, flexShrink: 0 }}>메뉴 유형 <span style={{ color: '#e63946' }}>*</span></label>
            <div className="flex gap-4 text-xs">
              {['컨텐츠', '내부링크', '외부링크'].map(t => (
                <label key={t} className="flex items-center gap-1">
                  <input type="radio" name="menuType" value={t} defaultChecked={t === '컨텐츠'} />
                  {t}
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <label className="text-xs font-medium" style={{ color: '#555', width: 80, flexShrink: 0 }}>메뉴 URL</label>
            <input type="text" className="border rounded px-2 py-1 text-xs flex-1" style={{ borderColor: '#ccc' }} />
          </div>

          <div className="flex items-start gap-2 mt-3">
            <label className="text-xs font-medium pt-1" style={{ color: '#555', width: 80, flexShrink: 0 }}>메뉴 Visual</label>
            <textarea className="border rounded px-2 py-1 text-xs flex-1" rows={3} style={{ borderColor: '#ccc', resize: 'vertical' }} />
          </div>

          <div className="flex items-start gap-2 mt-3">
            <label className="text-xs font-medium pt-1" style={{ color: '#555', width: 80, flexShrink: 0 }}>메뉴 설명</label>
            <textarea className="border rounded px-2 py-1 text-xs flex-1" rows={3} style={{ borderColor: '#ccc', resize: 'vertical' }} />
          </div>

          <div className="grid gap-3 mt-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium" style={{ color: '#555', width: 80, flexShrink: 0 }}>등록자ID</label>
              <span className="text-xs flex-1 border rounded px-2 py-1 bg-gray-50" style={{ borderColor: '#e0e0e0', minHeight: 28 }}></span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium" style={{ color: '#555', width: 80, flexShrink: 0 }}>등록일시</label>
              <span className="text-xs flex-1 border rounded px-2 py-1 bg-gray-50" style={{ borderColor: '#e0e0e0', minHeight: 28 }}></span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium" style={{ color: '#555', width: 80, flexShrink: 0 }}>수정자ID</label>
              <span className="text-xs flex-1 border rounded px-2 py-1 bg-gray-50" style={{ borderColor: '#e0e0e0', minHeight: 28 }}></span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium" style={{ color: '#555', width: 80, flexShrink: 0 }}>수정일시</label>
              <span className="text-xs flex-1 border rounded px-2 py-1 bg-gray-50" style={{ borderColor: '#e0e0e0', minHeight: 28 }}></span>
            </div>
          </div>

          <div className="flex justify-center mt-5">
            <button className="rounded px-6 py-2 text-white text-sm font-medium" style={{ background: '#e63946' }}>저장</button>
          </div>
        </div>
      </div>
    </div>
  );
}
