import { useRef, useState } from 'react';

interface Props {
  mode: 'registration' | 'edit';
  onBack: () => void;
}

interface CropState {
  source: string;
  fileName: string;
}

export default function ClientCompanyForm({ mode, onBack }: Props) {
  const [activeStatus, setActiveStatus] = useState('활성유무');
  const [cropState, setCropState] = useState<CropState | null>(null);
  const [croppedLogo, setCroppedLogo] = useState('');
  const [fileName, setFileName] = useState('');
  const [zoom, setZoom] = useState(1);
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(50);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = mode === 'edit';

  const selectLogo = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      setZoom(1);
      setPositionX(50);
      setPositionY(50);
      setCropState({ source: String(reader.result), fileName: file.name });
    };
    reader.readAsDataURL(file);
  };

  const applyCrop = () => {
    if (!cropState) return;
    const image = new Image();
    image.onload = () => {
      const outputWidth = 320;
      const outputHeight = 135;
      const coverScale = Math.max(outputWidth / image.naturalWidth, outputHeight / image.naturalHeight) * zoom;
      const sourceWidth = outputWidth / coverScale;
      const sourceHeight = outputHeight / coverScale;
      const sourceX = (image.naturalWidth - sourceWidth) * (positionX / 100);
      const sourceY = (image.naturalHeight - sourceHeight) * (positionY / 100);
      const canvas = document.createElement('canvas');
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, outputWidth, outputHeight);
      setCroppedLogo(canvas.toDataURL('image/png'));
      setFileName(cropState.fileName);
      setCropState(null);
    };
    image.src = cropState.source;
  };

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{isEdit ? '고객사 수정' : '고객사 등록'}</h2>

      <div className="mb-4 overflow-hidden rounded border bg-white" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full border-collapse">
          <tbody>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={{ width: 160, background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>*기업명</td>
              <td className="px-4 py-3" style={{ width: '40%' }}>
                <input aria-label="기업명" defaultValue={isEdit ? 'TEST COMPANY 01' : ''} className="w-full rounded border px-2 py-1 text-sm" style={{ borderColor: '#ccc' }} />
              </td>
              <td className="px-4 py-3 text-sm font-medium" style={{ width: 160, background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee', borderLeft: '1px solid #eee' }}>
                *사업자번호
                <div style={{ fontSize: 10, color: '#e63946' }}>등록된 사업자 번호는 변경 불가</div>
              </td>
              <td className="px-4 py-3">
                <input aria-label="사업자번호" defaultValue={isEdit ? '000-00-00001' : ''} disabled={isEdit} className="w-full rounded border px-2 py-1 text-sm" style={{ borderColor: '#ccc', background: isEdit ? '#f5f5f5' : '#fff' }} />
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>로고 첨부파일</td>
              <td className="px-4 py-3" colSpan={3}>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded border px-3 py-1 text-sm" style={{ borderColor: '#ccc', background: '#f5f5f5' }}>파일 선택</button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    aria-label="로고 이미지 선택"
                    onChange={event => {
                      const file = event.target.files?.[0];
                      if (file) selectLogo(file);
                      event.target.value = '';
                    }}
                  />
                  <span style={{ fontSize: 12, color: fileName ? '#444' : '#888' }}>{fileName || (isEdit ? 'TEST-COMPANY-01-logo.png' : '선택된 파일 없음')}</span>
                </div>
                {croppedLogo && (
                  <div className="mt-3 overflow-hidden rounded border bg-white p-2" style={{ borderColor: '#e0e0e0', width: 336 }}>
                    <img src={croppedLogo} alt="잘라낸 로고 미리보기" style={{ width: 320, height: 135, objectFit: 'contain' }} />
                  </div>
                )}
                <div className="mt-1" style={{ fontSize: 11, color: '#888' }}>이미지를 선택하면 320 × 135 비율에 맞게 자를 수 있습니다.</div>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>*활성여부</td>
              <td className="px-4 py-3">
                <select className="w-32 rounded border px-2 py-1 text-sm" style={{ borderColor: '#ccc' }} value={activeStatus} onChange={event => setActiveStatus(event.target.value)}>
                  <option>활성유무</option><option>활성</option><option>비활성</option>
                </select>
              </td>
              <td colSpan={2} />
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="rounded border px-3 py-1.5 text-sm" style={{ borderColor: '#ccc', color: '#555', background: '#f5f5f5' }}>취소</button>
        <button className="rounded px-5 py-1.5 text-sm font-medium text-white" style={{ background: isEdit ? '#3d8fef' : '#e63946' }}>{isEdit ? '수정' : '등록'}</button>
      </div>

      {cropState && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.72)' }} role="dialog" aria-modal="true" aria-label="로고 이미지 자르기">
          <div className="rounded-lg bg-white p-6 shadow-2xl" style={{ width: 700 }}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#222' }}>로고 이미지 자르기</div>
                <div className="mt-1" style={{ fontSize: 12, color: '#777' }}>밝은 영역 안에 사용할 로고가 들어오도록 조정해 주세요.</div>
              </div>
              <button type="button" onClick={() => setCropState(null)} aria-label="닫기" style={{ color: '#777', fontSize: 22 }}>×</button>
            </div>

            <div className="flex justify-center rounded bg-slate-900 p-8">
              <div className="relative overflow-hidden border-2 border-white shadow-xl" style={{ width: 560, aspectRatio: '320 / 135' }}>
                <img
                  src={cropState.source}
                  alt="자를 로고"
                  className="absolute inset-0 h-full w-full select-none"
                  style={{
                    objectFit: 'cover',
                    objectPosition: `${positionX}% ${positionY}%`,
                    transform: `scale(${zoom})`,
                  }}
                />
                <div className="pointer-events-none absolute inset-0" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.75)' }} />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-5">
              <label className="text-xs font-medium" style={{ color: '#555' }}>
                확대
                <input className="mt-2 w-full" type="range" min="1" max="3" step="0.05" value={zoom} onChange={event => setZoom(Number(event.target.value))} />
              </label>
              <label className="text-xs font-medium" style={{ color: '#555' }}>
                좌우 위치
                <input className="mt-2 w-full" type="range" min="0" max="100" value={positionX} onChange={event => setPositionX(Number(event.target.value))} />
              </label>
              <label className="text-xs font-medium" style={{ color: '#555' }}>
                상하 위치
                <input className="mt-2 w-full" type="range" min="0" max="100" value={positionY} onChange={event => setPositionY(Number(event.target.value))} />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setCropState(null)} className="rounded border px-5 py-2 text-sm" style={{ borderColor: '#ccc', color: '#555' }}>취소</button>
              <button type="button" onClick={applyCrop} className="rounded px-5 py-2 text-sm font-medium text-white" style={{ background: '#1a3055' }}>자르기 적용</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
