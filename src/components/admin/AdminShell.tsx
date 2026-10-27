import { useState } from 'react';
import NotificationBell from '../shared/NotificationBell';

type AdminPage =
  | 'access-stats' | 'user-mgmt' | 'client-mgmt' | 'question-mgmt' | 'campaign-mgmt' | 'survey-mgmt'
  | 'alert-mgmt' | 'popup-mgmt' | 'notice-mgmt'
  | 'board-stats' | 'content-stats'
  | 'sys-user-mgmt' | 'access-log' | 'active-session' | 'sys-resource'
  | 'member-login-log' | 'personal-info-log'
  | 'personal-auth-log'
  | 'common-code-mgmt' | 'upload-file-mgmt'
  | 'menu-mgmt' | 'permission-mgmt' | 'board-code-mgmt'
  | 'result-report-mgmt' | 'consultant-assignment-mgmt'
  | 'audit-mgmt'
  | 'question-library-basic-set' | 'question-library-mgmt' | 'question-add';

interface Props {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

// Returns which top-level and sub-level keys should be open for the current page
function getOpenKeysForPage(page: string): string[] {
  const map: Record<string, string[]> = {
    'user-mgmt': ['member'],
    'client-mgmt': ['member'],
    'question-mgmt': ['campaign'],
    'campaign-mgmt': [],
    'question-library-basic-set': ['question-library'],
    'question-library-mgmt': ['question-library'],
    'question-add': ['question-library'],
    'alert-mgmt': ['site'],
    'popup-mgmt': ['site'],
    'notice-mgmt': ['site'],
    'sys-user-mgmt': [],
    'access-log': ['system'],
    'active-session': ['system', 'sys-status'],
    'sys-resource': ['system', 'sys-status'],
    'member-login-log': ['system', 'personal-log'],
    'personal-info-log': ['system', 'personal-log'],
    'personal-auth-log': ['system'],
    'common-code-mgmt': ['system'],
    'upload-file-mgmt': ['system'],
    'menu-mgmt': ['system', 'menu-auth'],
    'permission-mgmt': ['system', 'menu-auth'],
    'board-code-mgmt': ['system'],
  };
  return map[page] ?? [];
}

function isActive(page: string, targetPage: string): boolean {
  return page === targetPage;
}

export default function AdminShell({ currentPage, onNavigate, onLogout, children }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Set<string>>(() => new Set(getOpenKeysForPage(currentPage)));

  const toggleMenu = (key: string) => {
    setOpenMenus(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const nav = (page: AdminPage) => onNavigate(page);

  const subItemStyle = (page: string) => ({
    color: isActive(currentPage, page) ? '#fff' : '#ccc',
    fontSize: 12,
    background: isActive(currentPage, page) ? 'rgba(255,255,255,0.15)' : undefined,
  });

  const subSubItemStyle = (page: string) => ({
    color: isActive(currentPage, page) ? '#fff' : '#bbb',
    fontSize: 11,
    background: isActive(currentPage, page) ? 'rgba(255,255,255,0.15)' : undefined,
  });

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#f5f5f5' }}>
      {/* Header */}
      <header className="service-header flex items-center justify-between px-5 bg-white border-b" style={{ borderColor: '#e0e0e0' }}>
        <div className="flex items-center gap-3">
          <span style={{ fontWeight: 900, fontSize: 22, color: '#e63946', fontStyle: 'italic' }}>kpc</span>
          <span style={{ fontSize: 11, color: '#666' }}>한국생산성본부</span>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#1a3055', marginLeft: 4 }}>통합관리시스템</span>
        </div>
        <div className="flex items-center gap-4">
          <NotificationBell role="ADMIN" />
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-gray-200 flex items-center justify-center" style={{ width: 28, height: 28 }}>
              <span style={{ fontSize: 13 }}>👤</span>
            </div>
            <span style={{ fontSize: 13, color: '#333' }}>TEST ADMIN님 반갑습니다.</span>
          </div>
          <button onClick={onLogout} className="flex flex-col items-center hover:opacity-70" style={{ fontSize: 11, color: '#555' }}>
            <span>⎋</span>
            <span>로그아웃</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        {!collapsed ? (
          <aside className="flex flex-col" style={{ width: 200, background: '#3d4d5c', flexShrink: 0 }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #4a5d6e' }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>시스템 관리 메뉴</span>
              <button onClick={() => setCollapsed(true)} style={{ color: '#aaa', fontSize: 14 }}>◀</button>
            </div>
            <nav className="flex-1 py-2 overflow-y-auto">
              <button onClick={() => nav('access-stats')} className="mb-1 w-full px-4 py-2.5 text-left text-sm font-bold hover:bg-white/10" style={{ color: isActive(currentPage, 'access-stats') ? '#fff' : '#e0e0e0', background: isActive(currentPage, 'access-stats') ? 'rgba(255,255,255,0.15)' : undefined }}>
                ESG 대시보드
              </button>

              {/* 회원 관리 */}
              <button onClick={() => toggleMenu('member')} className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-white/10" style={{ color: '#e0e0e0', fontSize: 13, fontWeight: 600 }}>
                <span>회원 관리</span>
                <span style={{ fontSize: 12 }}>{openMenus.has('member') ? '−' : '+'}</span>
              </button>
              {openMenus.has('member') && (
                <div style={{ background: '#4a5d6e' }}>
                  <button onClick={() => nav('user-mgmt')} className="w-full text-left px-6 py-1.5 hover:bg-white/10" style={subItemStyle('user-mgmt')}>· 사용자 관리</button>
                  <button onClick={() => nav('client-mgmt')} className="w-full text-left px-6 py-1.5 hover:bg-white/10" style={subItemStyle('client-mgmt')}>· 고객사 관리</button>
                </div>
              )}

              {/* 질의 라이브러리 */}
              <button onClick={() => toggleMenu('question-library')} className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-white/10" style={{ color: '#e0e0e0', fontSize: 13, fontWeight: 600 }}>
                <span>질의 라이브러리</span>
                <span style={{ fontSize: 12 }}>{openMenus.has('question-library') ? '−' : '+'}</span>
              </button>
              {openMenus.has('question-library') && (
                <div style={{ background: '#4a5d6e' }}>
                  <button onClick={() => nav('question-library-basic-set')} className="w-full text-left px-6 py-1.5 hover:bg-white/10" style={subItemStyle('question-library-basic-set')}>· 기본 SET</button>
                  <button onClick={() => nav('question-library-mgmt')} className="w-full text-left px-6 py-1.5 hover:bg-white/10" style={subItemStyle('question-library-mgmt')}>· 질의 관리</button>
                </div>
              )}

              {/* 캠페인 관리 (standalone 1Depth) */}
              <button onClick={() => nav('campaign-mgmt')} className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-white/10" style={{ color: isActive(currentPage, 'campaign-mgmt') ? '#fff' : '#e0e0e0', fontSize: 13, fontWeight: 600, background: isActive(currentPage, 'campaign-mgmt') ? 'rgba(255,255,255,0.15)' : undefined }}>
                <span>캠페인 관리</span>
              </button>
              <button onClick={() => nav('survey-mgmt')} className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-white/10" style={{ color: isActive(currentPage, 'survey-mgmt') ? '#fff' : '#e0e0e0', fontSize: 13, fontWeight: 600, background: isActive(currentPage, 'survey-mgmt') ? 'rgba(255,255,255,0.15)' : undefined }}>
                <span>서베이 관리</span>
              </button>

              <button onClick={() => nav('alert-mgmt')} className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-white/10" style={{ color: isActive(currentPage, 'alert-mgmt') ? '#fff' : '#e0e0e0', fontSize: 13, fontWeight: 600, background: isActive(currentPage, 'alert-mgmt') ? 'rgba(255,255,255,0.15)' : undefined }}><span>알림관리</span></button>

              {/* 관리자 관리 */}
              <button onClick={() => nav('sys-user-mgmt')} className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-white/10" style={{ color: isActive(currentPage, 'sys-user-mgmt') ? '#fff' : '#e0e0e0', background: isActive(currentPage, 'sys-user-mgmt') ? 'rgba(255,255,255,0.15)' : undefined, fontSize: 13, fontWeight: 600 }}>
                <span>관리자 관리</span>
              </button>

              {/* 시스템 관리 */}
              <button onClick={() => toggleMenu('system')} className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-white/10" style={{ color: '#e0e0e0', fontSize: 13, fontWeight: 600 }}>
                <span>시스템 관리</span>
                <span style={{ fontSize: 12 }}>{openMenus.has('system') ? '−' : '+'}</span>
              </button>
              {openMenus.has('system') && (
                <div style={{ background: '#4a5d6e' }}>
                  {/* 시스템현황 (nested) */}
                  <button onClick={() => toggleMenu('sys-status')} className="w-full flex items-center justify-between px-6 py-1.5 hover:bg-white/10" style={{ color: '#ccc', fontSize: 12 }}>
                    <span>· 시스템현황</span>
                    <span style={{ fontSize: 11 }}>{openMenus.has('sys-status') ? '∨' : '›'}</span>
                  </button>
                  {openMenus.has('sys-status') && (
                    <div style={{ background: '#3a4f5e' }}>
                      <button onClick={() => nav('active-session')} className="w-full text-left py-1.5 hover:bg-white/10" style={{ ...subSubItemStyle('active-session'), paddingLeft: 32 }}>접속자현황</button>
                      <button onClick={() => nav('sys-resource')} className="w-full text-left py-1.5 hover:bg-white/10" style={{ ...subSubItemStyle('sys-resource'), paddingLeft: 32 }}>메모리현황</button>
                    </div>
                  )}

                  <button onClick={() => nav('personal-auth-log')} className="w-full text-left px-6 py-1.5 hover:bg-white/10" style={subItemStyle('personal-auth-log')}>· 개인인증로그관리</button>
                  <button onClick={() => nav('upload-file-mgmt')} className="w-full text-left px-6 py-1.5 hover:bg-white/10" style={subItemStyle('upload-file-mgmt')}>· 업로드파일관리</button>

                  <button onClick={() => nav('menu-mgmt')} className="w-full text-left px-6 py-1.5 hover:bg-white/10" style={subItemStyle('menu-mgmt')}>· 메뉴관리</button>
                </div>
              )}

              {/* 결과보고서 관리 (standalone 1Depth) */}
              <button
                onClick={() => nav('result-report-mgmt')}
                className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-white/10"
                style={{
                  color: isActive(currentPage, 'result-report-mgmt') ? '#fff' : '#e0e0e0',
                  fontSize: 13,
                  fontWeight: 600,
                  background: isActive(currentPage, 'result-report-mgmt') ? 'rgba(255,255,255,0.15)' : undefined,
                }}
              >
                <span>결과보고서 관리</span>
              </button>
              <button onClick={() => nav('audit-mgmt')} className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-white/10" style={{ color: isActive(currentPage, 'audit-mgmt') ? '#fff' : '#e0e0e0', background: isActive(currentPage, 'audit-mgmt') ? 'rgba(255,255,255,0.15)' : undefined, fontSize: 13, fontWeight: 600 }}>
                <span>실사관리</span>
              </button>

            </nav>
          </aside>
        ) : (
          <div className="flex items-start pt-3 px-1" style={{ background: '#3d4d5c' }}>
            <button onClick={() => setCollapsed(false)} style={{ color: '#aaa', fontSize: 14 }}>▶</button>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
