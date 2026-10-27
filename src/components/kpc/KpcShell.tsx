import { useState } from 'react';
import NotificationBell from '../shared/NotificationBell';

export type KpcPage = 'home' | 'user-mgmt' | 'user-registration' | 'client-mgmt' | 'client-company-registration' | 'client-company-edit' | 'basic-set' | 'question-mgmt' | 'campaign-mgmt' | 'campaign-registration' | 'campaign-edit-detail' | 'campaign-detail' | 'campaign-survey-info' | 'campaign-list' | 'alert-mgmt' | 'alert-registration' | 'audit-mgmt';

export default function KpcShell({ page, onNavigate, onLogout, children, accountName = 'KPC' }: { page: KpcPage; onNavigate: (page: KpcPage) => void; onLogout: () => void; children: React.ReactNode; accountName?: string }) {
  const [memberOpen, setMemberOpen] = useState(false);
  const [questionOpen, setQuestionOpen] = useState(false);
  const item = (key: KpcPage) => `w-full px-5 py-3 text-left text-sm font-semibold transition ${page === key ? 'bg-white/15 text-white' : 'text-slate-200 hover:bg-white/10'}`;
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f6f8]">
      <header className="flex h-14 items-center border-b border-gray-200 bg-white px-5">
        <span className="text-xl font-black italic text-[#e63946]">kpc</span><span className="ml-2 text-xs font-bold text-[#1a3055]">Supply Chain ESG Assessment</span>
        <div className="ml-auto flex items-center gap-3"><strong className="text-sm text-gray-700">{accountName}</strong><NotificationBell role="KPC" /><button type="button" onClick={onLogout} className="rounded-full bg-gray-500 px-4 py-1.5 text-xs text-white">로그아웃</button></div>
      </header>
      <div className="flex flex-1">
        <aside className="w-56 shrink-0 bg-[#3d4d5c]">
          <div className="border-b border-white/10 px-5 py-4 text-sm font-bold text-white">KPC 운영 메뉴</div>
          <nav className="py-2">
            <button type="button" onClick={() => onNavigate('home')} className={item('home')}>HOME</button>
            <button type="button" onClick={() => setMemberOpen(value => !value)} className="flex w-full items-center justify-between px-5 py-3 text-left text-sm font-semibold text-slate-200 hover:bg-white/10"><span>회원 관리</span><span>{memberOpen ? '−' : '+'}</span></button>
            {memberOpen && <div className="bg-black/10"><button type="button" onClick={() => onNavigate('user-mgmt')} className={item('user-mgmt')}>· 사용자 관리</button><button type="button" onClick={() => onNavigate('client-mgmt')} className={item('client-mgmt')}>· 고객사 관리</button></div>}
            <button type="button" onClick={() => setQuestionOpen(value => !value)} className="flex w-full items-center justify-between px-5 py-3 text-left text-sm font-semibold text-slate-200 hover:bg-white/10"><span>질의 라이브러리</span><span>{questionOpen ? '−' : '+'}</span></button>
            {questionOpen && <div className="bg-black/10"><button type="button" onClick={() => onNavigate('basic-set')} className={item('basic-set')}>· 기본 SET</button><button type="button" onClick={() => onNavigate('question-mgmt')} className={item('question-mgmt')}>· 질의 관리</button></div>}
            <button type="button" onClick={() => onNavigate('campaign-mgmt')} className={item('campaign-mgmt')}>캠페인 관리</button>
            <button type="button" onClick={() => onNavigate('campaign-list')} className={item('campaign-list')}>서베이 관리</button>
            <button type="button" onClick={() => onNavigate('alert-mgmt')} className={item('alert-mgmt')}>알림관리</button>
            <button type="button" onClick={() => onNavigate('audit-mgmt')} className={item('audit-mgmt')}>실사관리</button>
          </nav>
        </aside>
        <main className="min-w-0 flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
