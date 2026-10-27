import { useMemo, useState } from 'react';

type LogType = '전체' | '로그인' | '개인정보 처리' | '관리자 접속';

const LOGS = Array.from({ length: 24 }, (_, index) => {
  const types = ['로그인', '개인정보 처리', '관리자 접속'] as const;
  const type = types[index % types.length];
  return {
    no: 220124 - index,
    type,
    id: index % 4 === 0 ? `partner${String(index + 1).padStart(2, '0')}@example.com` : `admin${String((index % 7) + 1).padStart(2, '0')}`,
    action: type === '로그인' ? (index % 2 ? '로그아웃' : '로그인') : type === '개인정보 처리' ? (index % 2 ? '조회' : '수정') : '관리자 페이지 접속',
    target: type === '로그인' ? '통합 로그인' : type === '개인정보 처리' ? '회원 및 캠페인 정보' : '/mngr/campaign/list',
    date: `2026-09-${String(18 - (index % 8)).padStart(2, '0')} ${String(9 + (index % 8)).padStart(2, '0')}:${String((index * 7) % 60).padStart(2, '0')}:00`,
    ip: `192.0.2.${10 + (index % 8)}`,
    system: index % 3 ? 'MNG' : 'FRT',
  };
});

export default function PersonalAuthLog() {
  const [type, setType] = useState<LogType>('전체');
  const [keyword, setKeyword] = useState('');
  const filtered = useMemo(() => LOGS.filter(log =>
    (type === '전체' || log.type === type)
    && (!keyword.trim() || `${log.id} ${log.action} ${log.target} ${log.ip}`.toLowerCase().includes(keyword.toLowerCase())),
  ), [keyword, type]);

  return (
    <div>
      <div className="mb-5">
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a3055' }}>개인인증로그관리</h2>
        <p className="mt-1 text-xs" style={{ color: '#777' }}>회원 로그인, 개인정보 처리, 관리자 접속 로그를 한 화면에서 조회합니다.</p>
      </div>
      <div className="mb-4 grid grid-cols-4 overflow-hidden rounded border bg-white" style={{ borderColor: '#d9dee8' }}>
        {(['전체', '로그인', '개인정보 처리', '관리자 접속'] as LogType[]).map(item => (
          <button key={item} onClick={() => setType(item)} className="py-3 text-sm font-semibold" style={{ background: type === item ? '#1a3055' : '#fff', color: type === item ? '#fff' : '#555', borderRight: item !== '관리자 접속' ? '1px solid #e0e0e0' : undefined }}>{item}</button>
        ))}
      </div>
      <div className="mb-3 flex justify-end gap-2">
        <input value={keyword} onChange={event => setKeyword(event.target.value)} placeholder="아이디, 처리내용, IP 검색" className="rounded border px-3 text-sm" style={{ borderColor: '#ccc', width: 300, height: 36 }} />
        <button className="rounded px-4 text-sm font-semibold text-white" style={{ background: '#1a3055' }}>검색</button>
      </div>
      <div className="mb-2 text-sm">목록 <strong style={{ color: '#e63946' }}>{filtered.length}</strong>건</div>
      <div className="overflow-hidden rounded border bg-white" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full border-collapse text-sm">
          <thead style={{ background: '#f8f8f8' }}><tr>{['번호', '로그 구분', '아이디', '처리 내용', '대상', '처리 일시', '접속 IP', '시스템'].map(header => <th key={header} className="border-b px-3 py-3 text-center text-xs font-semibold">{header}</th>)}</tr></thead>
          <tbody>{filtered.map(log => <tr key={log.no} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #f0f0f0' }}>
            <td className="px-3 py-3 text-center text-xs">{log.no}</td>
            <td className="px-3 py-3 text-center text-xs"><span className="rounded-full px-2 py-1 font-semibold" style={{ background: log.type === '로그인' ? '#eaf3ff' : log.type === '개인정보 처리' ? '#fff4df' : '#f0ecff', color: '#445' }}>{log.type}</span></td>
            <td className="px-3 py-3 text-center text-xs">{log.id}</td><td className="px-3 py-3 text-center text-xs">{log.action}</td>
            <td className="px-3 py-3 text-xs">{log.target}</td><td className="px-3 py-3 text-center text-xs">{log.date}</td>
            <td className="px-3 py-3 text-center text-xs">{log.ip}</td><td className="px-3 py-3 text-center text-xs">{log.system}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
