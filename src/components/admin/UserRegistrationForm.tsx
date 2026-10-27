import { useState } from 'react';

interface Props {
  onBack: () => void;
}

const fieldStyle = { borderColor: '#ccc', height: 34 };
const labelStyle = { width: 160, background: '#f8f8f8', color: '#444', borderRight: '1px solid #eee' };

export default function UserRegistrationForm({ onBack }: Props) {
  const [businessNumber, setBusinessNumber] = useState('');
  const [duplicateMessage, setDuplicateMessage] = useState('');

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>사용자 등록</h2>
      <div className="mb-4 flex justify-between">
        <button onClick={onBack} className="rounded border px-3 py-1.5 text-sm" style={{ borderColor: '#ccc', color: '#555', background: '#f5f5f5' }}>취소</button>
        <button className="rounded px-4 py-1.5 text-sm font-medium text-white" style={{ background: '#e63946' }}>등록</button>
      </div>

      <div className="overflow-hidden rounded border bg-white" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full border-collapse">
          <tbody>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm" style={labelStyle}>회원 UID</td>
              <td className="px-4 py-3 text-xs" style={{ color: '#888', width: '35%' }}>저장 후 표시됨</td>
              <td className="px-4 py-3 text-sm" style={{ ...labelStyle, borderLeft: '1px solid #eee' }}>언어선택</td>
              <td className="px-4 py-3">
                <select aria-label="언어선택" className="w-32 rounded border px-2 text-sm" style={fieldStyle}><option>한글</option><option>English</option></select>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={labelStyle}>*담당자 이메일</td>
              <td className="px-4 py-3"><input aria-label="담당자 이메일" type="email" className="w-full rounded border px-2 text-sm" style={fieldStyle} /></td>
              <td className="px-4 py-3 text-sm font-medium" style={{ ...labelStyle, borderLeft: '1px solid #eee' }}>*비밀번호</td>
              <td className="px-4 py-3"><input aria-label="비밀번호" type="password" className="w-full rounded border px-2 text-sm" style={fieldStyle} /></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={labelStyle}>*담당자명</td>
              <td className="px-4 py-3"><input aria-label="담당자명" className="w-full rounded border px-2 text-sm" style={fieldStyle} /></td>
              <td className="px-4 py-3 text-sm font-medium" style={{ ...labelStyle, borderLeft: '1px solid #eee' }}>담당자 연락처</td>
              <td className="px-4 py-3"><input aria-label="담당자 연락처" className="w-full rounded border px-2 text-sm" style={fieldStyle} placeholder="02-0000-0000" /></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td className="px-4 py-3 text-sm font-medium" style={labelStyle}>*사용자 등급</td>
              <td className="px-4 py-3">
                <select aria-label="사용자 등급" className="w-full rounded border px-2 text-sm" style={fieldStyle}>
                  <option value="">사용자 등급 선택</option><option>협력사</option><option>실사자</option><option>고객사</option>
                </select>
              </td>
              <td className="px-4 py-3 text-sm font-medium" style={{ ...labelStyle, borderLeft: '1px solid #eee' }}>활성여부</td>
              <td className="px-4 py-3">
                <select aria-label="활성여부" className="w-full rounded border px-2 text-sm" style={fieldStyle}><option>사용</option><option>미사용</option></select>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium" style={labelStyle}>*기업명</td>
              <td className="px-4 py-3"><input aria-label="기업명" className="w-full rounded border px-2 text-sm" style={fieldStyle} /></td>
              <td className="px-4 py-3 text-sm font-medium" style={{ ...labelStyle, borderLeft: '1px solid #eee' }}>*사업자번호</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <input
                    aria-label="사업자번호"
                    value={businessNumber}
                    onChange={event => { setBusinessNumber(event.target.value); setDuplicateMessage(''); }}
                    className="min-w-0 flex-1 rounded border px-2 text-sm"
                    style={fieldStyle}
                    placeholder="000-00-00000"
                  />
                  <button
                    type="button"
                    onClick={() => setDuplicateMessage(businessNumber.trim() ? '사용 가능한 사업자번호입니다.' : '사업자번호를 입력해 주세요.')}
                    className="shrink-0 rounded border px-3 text-xs font-medium"
                    style={{ borderColor: '#1e56d9', color: '#1e56d9', background: '#fff' }}
                  >
                    중복체크
                  </button>
                </div>
                {duplicateMessage && <div className="mt-1 text-xs" style={{ color: businessNumber.trim() ? '#26824d' : '#e63946' }}>{duplicateMessage}</div>}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
