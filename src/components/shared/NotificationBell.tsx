import { useEffect, useState } from 'react';
import { getReadIds, getRoleNotices, markRead, NOTICE_EVENT, type AccountRole, type Notice } from './notificationStore';

export default function NotificationBell({ role }: { role: AccountRole }) {
  const [open, setOpen] = useState(false);
  const [notices, setNotices] = useState(() => getRoleNotices(role));
  const [readIds, setReadIds] = useState(() => getReadIds(role));
  const [popup, setPopup] = useState<Notice | null>(() => getRoleNotices(role).find(item => item.type === '팝업' && !getReadIds(role).has(item.id)) ?? null);
  useEffect(() => {
    const refresh = () => {
      const nextNotices = getRoleNotices(role);
      const nextReadIds = getReadIds(role);
      setNotices(nextNotices);
      setReadIds(nextReadIds);
      setPopup(nextNotices.find(item => item.type === '팝업' && !nextReadIds.has(item.id)) ?? null);
    };
    window.addEventListener(NOTICE_EVENT, refresh);
    return () => window.removeEventListener(NOTICE_EVENT, refresh);
  }, [role]);
  const unread = notices.filter(item => !readIds.has(item.id)).length;
  const read = (notice: Notice) => { markRead(role, notice.id); setReadIds(getReadIds(role)); };
  return <div className="relative">
    <button type="button" onClick={() => setOpen(value => !value)} aria-label={`알림 ${unread}건`} className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"><svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8"><path d="M6 9a6 6 0 0 1 12 0v5l2 2H4l2-2V9Z" /><path d="M10 19h4" /></svg>{unread > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{unread}</span>}</button>
    {open && <div className="absolute right-0 top-11 z-[200] w-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl"><div className="flex items-center justify-between border-b px-4 py-3"><strong className="text-sm">알림</strong><span className="text-xs text-red-500">미확인 {unread}건</span></div><div className="max-h-96 divide-y overflow-y-auto">{notices.map(item => <button type="button" key={item.id} onClick={() => read(item)} className={`block w-full px-4 py-3 text-left ${readIds.has(item.id) ? 'bg-gray-50 text-gray-400' : 'bg-blue-50/70 text-gray-800'}`}><div className="flex items-center gap-2"><span className={`rounded px-2 py-0.5 text-[10px] font-bold ${item.type === '팝업' ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'}`}>{item.type}</span><strong className="text-xs">{item.title}</strong></div><div className="mt-1 line-clamp-2 text-[11px]">{item.content}</div><div className="mt-2 flex justify-between text-[10px] text-gray-400"><span>제공: {item.sender || '시스템 관리자'}</span><span>{item.createdAt}</span></div></button>)}{notices.length === 0 && <div className="py-10 text-center text-xs text-gray-400">도착한 알림이 없습니다.</div>}</div></div>}
    {popup && popup.popup && <div className="fixed z-[190] rounded-xl border border-gray-200 bg-white p-5 shadow-2xl" style={{ width: popup.popup.width, minHeight: popup.popup.height, top: popup.popup.top, left: popup.popup.left }}><div className="flex justify-between"><div><strong>{popup.title}</strong><div className="mt-1 text-[10px] font-medium text-gray-400">제공: {popup.sender || '시스템 관리자'}</div></div><button type="button" onClick={() => { read(popup); setPopup(null); }}>×</button></div><div className="mt-5 whitespace-pre-wrap text-sm leading-6 text-gray-600">{popup.content}</div><button type="button" onClick={() => { read(popup); setPopup(null); }} className="mt-6 rounded bg-[#1a3055] px-5 py-2 text-xs font-bold text-white">확인</button></div>}
  </div>;
}
