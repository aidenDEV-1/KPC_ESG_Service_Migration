import { useState, useRef, useEffect } from 'react';

interface Props {
  onBack: () => void;
}

const level1Options = [
  '구분[L]:노동 및 인권',
  '구분[S]:안전 및 보건',
  '구분[E]:환경',
  '구분[C]:윤리',
  '구분[M]:경영시스템',
  '구분[ETC]:기타',
  '구분[D]:기본정보',
];

const level2ByL: Record<string, string[]> = {
  '구분[L]:노동 및 인권': ['L01.일반', 'L02.강제노동 및 자발적 근로', 'L03.아동노동 및 연소근로', 'L04.근로시간', 'L05.임금 및 복리후생', 'L06.인도적 대우', 'L07.차별금지', 'L08.결사의 자유'],
  '구분[S]:안전 및 보건': ['S01.OHS 체계 및 교육', 'S02.산업안전', 'S03.비상상황 대응', 'S04.산업재해', 'S05.산업위생', 'S06.육체노동', 'S07.기계설비 안전 유지', 'S08.식품, 위생 및 주거'],
  '구분[E]:환경': ['E01.환경 일반', 'E02.환경 허가 및 보고', 'E03.오염물질 저감', 'E04.유해물질 관리', 'E05.폐기물 처리', 'E06.대기오염물질', 'E07.수자원 관리', 'E08.에너지 및 온실가스 배출', 'E09.생물다양성'],
  '구분[C]:윤리': ['C01.윤리 일반', 'C02.반부패 및 이해상충 금지', 'C03.개인정보 보호', 'C04.불공정 거래 방지', 'C05.지적재산 보호', 'C06.책임 있는 자재 구매', 'C07.윤리 기타'],
  '구분[M]:경영시스템': ['M01.경영진 참여', 'M02.성과 관리', 'M03.협력사 관리', 'M04.사회공헌'],
};

const classifyOptions = ['정책/인증/계획', '거버넌스/매커니즘(체계)', '활동', '성과', '목표'];
function Dropdown({ options, value, onChange, width = 160 }: { options: string[]; value: string; onChange: (v: string) => void; width?: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block', width }}>
      <button
        className="border rounded px-2 py-1 text-sm flex items-center justify-between"
        style={{ borderColor: '#aaa', width: '100%', background: '#fff', textAlign: 'left' }}
        onClick={() => setOpen(v => !v)}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, fontSize: 12 }}>{value}</span>
        <span style={{ fontSize: 10, color: '#888', marginLeft: 4 }}>▼</span>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, width: Math.max(width, 220), background: '#fff', border: '1px solid #bbb', borderRadius: 3, zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', maxHeight: 220, overflowY: 'auto' }}>
          {options.map(opt => (
            <div
              key={opt}
              style={{ padding: '6px 10px', fontSize: 12, cursor: 'pointer', background: opt === value ? '#e8f0fe' : '#fff', borderBottom: '1px solid #f5f5f5' }}
              onClick={() => { onChange(opt); setOpen(false); }}
              className="hover:bg-blue-50"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function QuestionRegistrationForm({ onBack }: Props) {
  const [cat1, setCat1] = useState('-1차 카테고리-');
  const [cat2, setCat2] = useState('-2차 카테고리-');
  const [classify, setClassify] = useState('분류');
  const [sequence, setSequence] = useState('');

  useEffect(() => {
    if (!cat1.startsWith('구분[') || cat2 === '-2차 카테고리-' || classify === '분류') {
      setSequence('');
      return;
    }
    const categoryIndex = (level2ByL[cat1] ?? []).indexOf(cat2);
    setSequence(String(Math.max(1, categoryIndex + 1) + 5));
  }, [cat1, cat2, classify]);

  const cat1Options = ['- 1차 카테고리-', ...level1Options];
  const cat2Options = ['-2차 카테고리-', ...(level2ByL[cat1] || [])];

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>질의 등록</h2>
      <div className="flex justify-end mb-4">
        <button className="rounded px-4 py-1.5 text-sm text-white" style={{ background: '#3d8fef' }}>복사</button>
      </div>

      <div className="bg-white border rounded overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={{ width: 140, background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>질의 ID</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 12, color: '#555' }}>
                    {sequence ? `${cat1.match(/\[([A-Z]+)\]/)?.[1] ?? ''}-${String((level2ByL[cat1] ?? []).indexOf(cat2) + 1).padStart(2, '0')}-${classifyOptions.indexOf(classify) + 1}-${sequence}` : '--'}
                  </span>
                  <button className="rounded px-2 py-0.5 text-xs text-white" style={{ background: '#3d8fef' }}>중복체크</button>
                </div>
              </td>
              <td className="px-4 py-3 text-sm font-medium" style={{ width: 120, background: '#f8f8f8', color: '#444', borderLeft: '1px solid #eee', borderRight: '1px solid #eee' }}>요약 메모</td>
              <td className="px-4 py-3">
                <input type="text" className="border rounded px-2 py-1 text-sm w-full" style={{ borderColor: '#ccc' }} />
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee', verticalAlign: 'top', paddingTop: 12 }}>카테고리 설정 *</td>
              <td className="px-4 py-3" colSpan={3}>
                <div style={{ fontSize: 11, color: '#e63946', marginBottom: 6 }}>* 카테고리는 영문(대문자), 숫자만 가능합니다. (한글, 특수문자 사용 불가)</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Dropdown options={cat1Options} value={cat1} onChange={v => { setCat1(v); setCat2('-2차 카테고리-'); }} width={200} />
                  <span style={{ color: '#888' }}>-</span>
                  <Dropdown options={cat2Options} value={cat2} onChange={setCat2} width={200} />
                  <span style={{ color: '#888' }}>-</span>
                  <Dropdown options={['분류', ...classifyOptions]} value={classify} onChange={setClassify} width={140} />
                  <input aria-label="자동 순번" readOnly value={sequence} placeholder="자동 순번" className="rounded border px-2 py-1 text-center text-xs" style={{ borderColor: '#ccc', width: 82, background: '#f4f6f8' }} />
                </div>
                <div style={{ fontSize: 11, color: '#3d8fef', marginTop: 6 }}>카테고리와 분류 선택 시 다음 순번이 자동으로 입력됩니다.</div>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>필수여부 *</td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <label className="flex items-center gap-1 text-sm"><input type="radio" name="required" defaultChecked /> 예</label>
                  <label className="flex items-center gap-1 text-sm"><input type="radio" name="required" /> 아니오</label>
                </div>
              </td>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderLeft: '1px solid #eee', borderRight: '1px solid #eee' }}>질의 등록일</td>
              <td className="px-4 py-3 text-sm">2026-09-18</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>해당없음 여부 *</td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <label className="flex items-center gap-1 text-sm"><input type="radio" name="na" /> 예:관련없음-폐기물배출 없음</label>
                  <label className="flex items-center gap-1 text-sm"><input type="radio" name="na" defaultChecked /> 아니오</label>
                </div>
              </td>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderLeft: '1px solid #eee', borderRight: '1px solid #eee' }}>첨부파일 여부 *</td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <label className="flex items-center gap-1 text-sm"><input type="radio" name="attach" /> 예</label>
                  <label className="flex items-center gap-1 text-sm"><input type="radio" name="attach" defaultChecked /> 아니오</label>
                </div>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>질의 유형 *</td>
              <td className="px-4 py-3" colSpan={3}>
                <div className="flex gap-3 flex-wrap">
                  {['라디오', '체크박스', '텍스트박스', '정량데이터'].map(t => (
                    <label key={t} className="flex items-center gap-1 text-sm">
                      <input type="radio" name="qtype" defaultChecked={t === '라디오'} /> {t}
                    </label>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-3 mt-6">
        <button className="rounded px-6 py-2 text-sm text-white font-medium" style={{ background: '#3d4d5c' }}>등록</button>
        <button onClick={onBack} className="rounded px-6 py-2 text-sm border font-medium" style={{ borderColor: '#ccc', color: '#555' }}>목록</button>
      </div>
    </div>
  );
}
