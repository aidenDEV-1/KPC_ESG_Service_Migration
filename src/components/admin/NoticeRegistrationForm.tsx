import { useState } from 'react';
import EditorToolbar from './EditorToolbar';

interface Props {
  onBack: () => void;
}

export default function NoticeRegistrationForm({ onBack }: Props) {
  const [targetType, setTargetType] = useState<'전체' | '고객사별' | '캠페인별'>('전체');
  const [targetValue, setTargetValue] = useState('');
  const targetOptions = targetType === '고객사별'
    ? ['LG', 'SK', '농심', '롯데', '삼성', '한화', '현대']
    : ['2026 LG 협력사 ESG 평가', '2026 SK 협력사 ESG 평가', '2026 삼성 공급망 ESG 평가', '2026 한화 공급망 ESG 평가'];
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>공지사항</h2>
      <div className="bg-white border rounded overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={{ width: 140, background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>*제목</td>
              <td className="px-4 py-3" colSpan={3}>
                <input type="text" className="border rounded px-2 py-1 text-sm w-full" style={{ borderColor: '#ccc' }} />
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>*노출 대상</td>
              <td className="px-4 py-3" colSpan={3}>
                <div className="flex items-center gap-5">
                  {(['전체', '고객사별', '캠페인별'] as const).map(type => (
                    <label key={type} className="flex cursor-pointer items-center gap-1.5 text-sm">
                      <input type="radio" name="notice-target" checked={targetType === type} onChange={() => { setTargetType(type); setTargetValue(''); }} style={{ accentColor: '#1a6fbf' }} />
                      {type}
                    </label>
                  ))}
                  {targetType !== '전체' && (
                    <select value={targetValue} onChange={event => setTargetValue(event.target.value)} className="min-w-64 rounded border px-3 py-2 text-sm" style={{ borderColor: '#ccc' }}>
                      <option value="">{targetType === '고객사별' ? '고객사 선택' : '캠페인 선택'}</option>
                      {targetOptions.map(option => <option key={option}>{option}</option>)}
                    </select>
                  )}
                </div>
                <div className="mt-2 text-xs" style={{ color: '#777' }}>
                  {targetType === '전체' ? '모든 고객사와 캠페인 사용자에게 공지합니다.' : targetType === '고객사별' ? '선택 고객사의 모든 캠페인 사용자에게 공지합니다.' : '선택한 캠페인 참여 사용자에게만 공지합니다.'}
                </div>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>작성자</td>
              <td className="px-4 py-3 text-sm" style={{ color: '#555', width: '38%' }}>afo1</td>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderLeft: '1px solid #eee', borderRight: '1px solid #eee' }}>작성일</td>
              <td className="px-4 py-3 text-sm" style={{ color: '#555' }}>2026-09-18</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee', verticalAlign: 'top', paddingTop: 12 }}>*내용</td>
              <td className="px-3 py-3" colSpan={3}>
                <EditorToolbar />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium" style={{ background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' }}>*활성여부</td>
              <td className="px-4 py-3" colSpan={3}>
                <select className="border rounded px-2 py-1 text-sm" style={{ borderColor: '#ccc', width: 100 }}>
                  <option>활성</option><option>비활성</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-4">
        <button onClick={onBack} className="rounded px-3 py-1.5 text-sm border" style={{ borderColor: '#ccc', color: '#555', background: '#f5f5f5' }}>목록</button>
        <button className="rounded px-5 py-1.5 text-sm text-white font-medium" style={{ background: '#e63946' }}>저장</button>
      </div>
    </div>
  );
}
