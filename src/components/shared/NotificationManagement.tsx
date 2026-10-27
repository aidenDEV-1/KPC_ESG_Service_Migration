import { useRef, useState } from 'react';
import { getNotices, saveNotice, type AccountRole, type NoticeType } from './notificationStore';

const groups = {
  고객사별: ['고객사 A', '고객사 B', '고객사 C'],
  캠페인별: ['2026 공급망 ESG 정기평가', '2026 핵심 협력사 ESG 평가'],
  협력사별: ['한국정밀', '그린테크', '미래부품', '대상산업'],
  실사자별: ['TEST AUDITOR 01', 'TEST AUDITOR 02', 'TEST AUDITOR 03'],
};

export default function NotificationManagement({ role }: { role: AccountRole }) {
  const [form, setForm] = useState(false);
  const [typeFilter, setTypeFilter] = useState('전체');
  const [version, setVersion] = useState(0);
  const notices = getNotices().filter(item => typeFilter === '전체' || item.type === typeFilter);
  if (form) return <NoticeForm role={role} onBack={() => setForm(false)} onSaved={() => { setVersion(value => value + 1); setForm(false); }} />;
  return <div className="service-page-wide mx-auto max-w-[96rem]" data-version={version}><div className="mb-5 flex items-center justify-between"><div><div className="service-page-title">알림관리</div><div className="service-page-description">계정과 캠페인 대상별 공지 및 알림을 관리합니다.</div></div><button type="button" onClick={() => setForm(true)} className="rounded bg-service-primary px-5 py-2.5 text-sm font-bold text-white">등록</button></div><div className="mb-5 flex items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white p-4"><span className="text-xs font-bold text-gray-500">공지 유형</span><select value={typeFilter} onChange={event => setTypeFilter(event.target.value)} className="h-9 rounded border border-gray-300 px-3 text-sm"><option>전체</option><option>알림</option>{role === 'ADMIN' || role === 'KPC' ? <option>팝업</option> : null}</select></div><div className="overflow-hidden rounded-lg border border-gray-200 bg-white"><table className="w-full text-xs"><thead className="bg-gray-50"><tr>{['번호', '제목', '제공자', ...(role === 'PART' || role === 'AUD' || role === 'CUSTOMER' ? [] : ['공지 유형']), '노출 대상', '노출 시작일', '노출 종료일', '사용 여부'].map(value => <th key={value} className="border-b px-4 py-3">{value}</th>)}</tr></thead><tbody className="divide-y">{notices.map((item, index) => <tr key={item.id}><td className="px-4 py-3 text-center">{notices.length - index}</td><td className="px-4 py-3 font-bold text-blue-700">{item.title}</td><td className="px-4 py-3 text-center">{item.sender || '시스템 관리자'}</td>{role === 'PART' || role === 'AUD' || role === 'CUSTOMER' ? null : <td className="px-4 py-3 text-center">{item.type}</td>}<td className="px-4 py-3 text-center">{item.targetLabel}</td><td className="px-4 py-3 text-center">{item.startDate}</td><td className="px-4 py-3 text-center">{item.endDate}</td><td className="px-4 py-3 text-center">{item.active ? 'Y' : 'N'}</td></tr>)}</tbody></table></div></div>;
}

function NoticeForm({ role, onBack, onSaved }: { role: AccountRole; onBack: () => void; onSaved: () => void }) {
  const full = role === 'ADMIN' || role === 'KPC';
  const [type, setType] = useState<NoticeType>('알림');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targets, setTargets] = useState<string[]>(full ? ['전체'] : ['KPC']);
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState('');
  const [preview, setPreview] = useState(false);
  const [popup, setPopup] = useState({ width: 460, height: 280, top: 120, left: 420 });
  const restrictedOptions = role === 'CUSTOMER' ? ['KPC', '협력사별'] : role === 'PART' ? ['KPC', '고객사별', '실사자별'] : ['KPC', '고객사별', '협력사별'];
  const options = full ? ['전체', '고객사별', '캠페인별', '협력사별', '실사자별'] : restrictedOptions;
  const toggle = (value: string) => setTargets(current => full ? (value === '전체' ? ['전체'] : [...current.filter(item => item !== '전체'), ...(current.includes(value) ? [] : [value])].filter((item, index, array) => array.indexOf(item) === index).filter(item => current.includes(value) ? item !== value : true)) : [value]);
  const save = () => {
    if (!title.trim()) return;
    const roles = new Set<AccountRole>();
    if (targets.includes('전체')) ['ADMIN', 'KPC', 'PART', 'AUD', 'CUSTOMER'].forEach(value => roles.add(value as AccountRole));
    if (targets.includes('KPC')) { roles.add('ADMIN'); roles.add('KPC'); }
    if (targets.includes('고객사별')) roles.add('CUSTOMER');
    if (targets.includes('캠페인별') || targets.includes('협력사별')) roles.add('PART');
    if (targets.includes('실사자별')) roles.add('AUD');
    const sender = role === 'ADMIN' ? 'ADMIN 관리자' : role === 'KPC' ? 'KPC 운영자' : role === 'PART' ? '협력사 담당자' : role === 'AUD' ? '현장실사자' : role === 'CUSTOMER' ? '고객사 담당자' : '컨설턴트';
    saveNotice({ id: `notice-${Date.now()}`, title, content, sender, type: full ? type : '알림', targetRoles: [...roles], targetLabel: targets.join(', '), createdAt: new Date().toISOString().slice(0, 10), startDate: type === '알림' || !full ? new Date().toISOString().slice(0, 10) : startDate, endDate: type === '알림' || !full ? '-' : endDate || '-', active: true, popup: type === '팝업' && full ? popup : undefined });
    onSaved();
  };
  return <div className="service-page-wide mx-auto max-w-[96rem]"><div className="mb-5 text-xl font-black">알림 등록</div><div className="overflow-hidden rounded-lg border border-gray-200 bg-white"><div className="grid grid-cols-[9rem_1fr] border-b"><div className="bg-gray-50 p-4 text-sm font-bold">제목</div><div className="flex items-center gap-6 p-3"><input value={title} onChange={event => setTitle(event.target.value)} className="h-10 flex-1 rounded border border-gray-300 px-3" />{full && <div className="flex gap-4 text-sm"><label><input type="radio" checked={type === '알림'} onChange={() => setType('알림')} /> 알림</label><label><input type="radio" checked={type === '팝업'} onChange={() => setType('팝업')} /> 팝업</label></div>}</div></div><div className="grid grid-cols-[9rem_1fr] border-b"><div className="bg-gray-50 p-4 text-sm font-bold">노출 대상</div><div className="space-y-3 p-4"><div className="flex flex-wrap gap-5">{options.map(option => <label key={option} className="text-sm"><input type={full ? 'checkbox' : 'radio'} checked={targets.includes(option)} onChange={() => toggle(option)} /> {option}</label>)}</div>{targets.filter(target => groups[target as keyof typeof groups]).map(target => <MultiSelect key={target} label={target.replace('별', ' 선택')} values={groups[target as keyof typeof groups]} selected={selected[target] ?? []} onChange={values => setSelected(current => ({ ...current, [target]: values }))} />)}</div></div>{full && type === '팝업' && <div className="grid grid-cols-[9rem_1fr] border-b"><div className="bg-gray-50 p-4 text-sm font-bold">노출 기간</div><div className="flex items-center gap-3 p-3"><input type="date" value={startDate} onChange={event => setStartDate(event.target.value)} className="rounded border p-2" /><span>~</span><input type="date" value={endDate} onChange={event => setEndDate(event.target.value)} className="rounded border p-2" /><button type="button" onClick={() => setPreview(true)} className="ml-4 rounded bg-[#1a3055] px-4 py-2 text-xs font-bold text-white">팝업 미리보기</button></div></div>}<div className="grid grid-cols-[9rem_1fr]"><div className="bg-gray-50 p-4 text-sm font-bold">내용</div><div className="p-3"><textarea value={content} onChange={event => setContent(event.target.value)} className="min-h-56 w-full rounded border border-gray-300 p-3" /></div></div></div><div className="mt-4 flex justify-between"><button type="button" onClick={onBack} className="rounded border px-4 py-2">목록</button><button type="button" onClick={save} className="rounded bg-service-primary px-6 py-2 text-white">저장</button></div>{preview && <PopupPlacementPreview initial={popup} title={title} content={content} onCancel={() => setPreview(false)} onConfirm={value => { setPopup(value); setPreview(false); }} />}</div>;
}

type PopupPlacement = { width: number; height: number; top: number; left: number };

function PopupPlacementPreview({ initial, title, content, onCancel, onConfirm }: { initial: PopupPlacement; title: string; content: string; onCancel: () => void; onConfirm: (value: PopupPlacement) => void }) {
  const [box, setBox] = useState(initial);
  const gesture = useRef<{ type: 'move' | 'resize'; x: number; y: number; initial: PopupPlacement } | null>(null);
  const start = (event: React.PointerEvent<HTMLDivElement>, type: 'move' | 'resize') => {
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = { type, x: event.clientX, y: event.clientY, initial: box };
  };
  const update = (event: React.PointerEvent<HTMLDivElement>) => {
    const current = gesture.current;
    if (!current) return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    if (current.type === 'move') {
      setBox(value => ({ ...value, left: Math.max(0, Math.min(window.innerWidth - value.width, current.initial.left + dx)), top: Math.max(54, Math.min(window.innerHeight - value.height, current.initial.top + dy)) }));
    } else {
      setBox(value => ({ ...value, width: Math.max(280, Math.min(window.innerWidth - value.left, current.initial.width + dx)), height: Math.max(180, Math.min(window.innerHeight - value.top, current.initial.height + dy)) }));
    }
  };
  return <div className="fixed inset-0 z-[300] overflow-hidden bg-black/55">
    <div className="absolute inset-x-0 top-0 flex h-14 items-center justify-between bg-gray-950 px-6 text-white shadow-lg"><div><strong className="text-sm">팝업 위치·크기 미리보기</strong><span className="ml-3 text-xs text-gray-300">상단 검정 바를 끌어 이동하고, 우측 아래 모서리를 끌어 크기를 조절하세요.</span></div><div className="flex gap-2"><button type="button" onClick={onCancel} className="rounded border border-gray-500 px-4 py-2 text-xs">취소</button><button type="button" onClick={() => onConfirm(box)} className="rounded bg-blue-600 px-5 py-2 text-xs font-bold">이 위치로 확인</button></div></div>
    <div className="absolute overflow-hidden rounded-xl border-[3px] border-gray-950 bg-white shadow-2xl" style={{ width: box.width, height: box.height, top: box.top, left: box.left }}>
      <div onPointerDown={event => start(event, 'move')} onPointerMove={update} onPointerUp={() => { gesture.current = null; }} className="flex h-10 cursor-move touch-none items-center justify-between bg-gray-950 px-4 text-white"><span className="text-xs font-bold">이 영역을 끌어 팝업 이동</span><span className="text-[10px] text-gray-300">{Math.round(box.width)} × {Math.round(box.height)}</span></div>
      <div className="p-5"><strong className="text-base">{title || '팝업 제목'}</strong><div className="mt-1 text-[10px] text-gray-400">제공: 현재 로그인 계정</div><div className="mt-5 whitespace-pre-wrap text-sm leading-6 text-gray-600">{content || '팝업 내용을 미리 확인합니다.'}</div></div>
      <div onPointerDown={event => start(event, 'resize')} onPointerMove={update} onPointerUp={() => { gesture.current = null; }} className="absolute bottom-0 right-0 flex h-8 w-8 touch-none cursor-nwse-resize items-end justify-end bg-gray-950 p-1 text-white" aria-label="팝업 크기 조절">↘</div>
    </div>
  </div>;
}

function MultiSelect({ label, values, selected, onChange }: { label: string; values: string[]; selected: string[]; onChange: (values: string[]) => void }) {
  return <details className="relative inline-block"><summary className="cursor-pointer rounded border border-gray-300 bg-white px-4 py-2 text-xs">{label} ({selected.length})</summary><div className="absolute left-0 top-10 z-20 w-72 rounded border bg-white p-3 shadow-xl"><button type="button" onClick={() => onChange(selected.length === values.length ? [] : values)} className="mb-2 w-full rounded bg-gray-100 py-2 text-xs font-bold">전체 선택</button>{values.map(value => <label key={value} className="block py-1 text-xs"><input type="checkbox" checked={selected.includes(value)} onChange={() => onChange(selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value])} /> {value}</label>)}</div></details>;
}
