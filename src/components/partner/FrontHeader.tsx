import NotificationBell from '../shared/NotificationBell';

type PartnerTab = '현황' | '진단' | '데이터' | '알림관리';

interface Props {
  role: 'PART' | 'AUD';
  activeTab?: PartnerTab;
  onTabChange?: (tab: PartnerTab) => void;
  onLogout: () => void;
  userEmail?: string;
  audSection?: '실사관리' | '알림관리';
  onAudSectionChange?: (section: '실사관리' | '알림관리') => void;
}

export default function FrontHeader({ role, activeTab, onTabChange, onLogout, userEmail = 'test@example.com', audSection = '실사관리', onAudSectionChange }: Props) {
  const tabs: PartnerTab[] = ['현황', '진단', '데이터', '알림관리'];

  return (
    <header className="service-header bg-white border-b flex items-center px-6" style={{ borderColor: '#e8e8e8' }}>
      {/* Logo */}
      <div className="flex items-center gap-2 mr-auto">
        <span style={{ fontWeight: 900, fontSize: 18, color: '#e63946', fontStyle: 'italic' }}>kpc</span>
        <div className="w-6 h-6 rounded-full border flex items-center justify-center" style={{ borderColor: '#999' }}>
          <span style={{ fontSize: 8, color: '#999' }}>◎</span>
        </div>
        <div style={{ fontSize: 11, lineHeight: 1.2, color: '#333' }}>
          <div style={{ fontWeight: 700 }}>Supply Chain</div>
          <div style={{ fontWeight: 700 }}>ESG Assessment</div>
        </div>
      </div>

      {/* Center nav */}
      {role === 'PART' && onTabChange && (
        <nav className="flex items-center gap-8">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className="py-4 text-sm font-medium relative"
              style={{
                color: activeTab === tab ? '#e63946' : '#555',
                borderBottom: activeTab === tab ? '2px solid #e63946' : '2px solid transparent',
              }}
            >
              {tab}
            </button>
          ))}
        </nav>
      )}
      {role === 'AUD' && <nav className="absolute left-1/2 flex -translate-x-1/2 gap-8">{(['실사관리', '알림관리'] as const).map(item => <button type="button" key={item} onClick={() => onAudSectionChange?.(item)} className={`py-4 text-sm font-medium ${audSection === item ? 'border-b-2 border-service-primary text-service-primary' : 'text-gray-500'}`}>{item}</button>)}</nav>}

      {/* Right: user + logout */}
      <div className="flex items-center gap-3 ml-auto">
        <NotificationBell role={role === 'PART' ? 'PART' : role === 'AUD' ? 'AUD' : 'CONSULTANT'} />
        <div className="flex items-center gap-1">
          <span style={{ color: '#888', fontSize: 14 }}>👤</span>
          <span style={{ fontSize: 13, color: '#555' }}>{userEmail}</span>
        </div>
        <button
          onClick={onLogout}
          className="rounded-full px-4 py-1 text-sm"
          style={{ background: '#888', color: '#fff' }}
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}
