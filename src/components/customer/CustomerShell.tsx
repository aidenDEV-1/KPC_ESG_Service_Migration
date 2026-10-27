import { useState } from 'react';
import CustomerHome from './CustomerHome';
import CustomerImprovement from './CustomerImprovement';
import CustomerProgress from './CustomerProgress';
import NotificationBell from '../shared/NotificationBell';
import NotificationManagement from '../shared/NotificationManagement';

type CustomerSection = 'summary' | 'campaign' | 'trend' | 'improvement' | 'notifications';

interface Props {
  onLogout: () => void;
}

export default function CustomerShell({ onLogout }: Props) {
  const [section, setSection] = useState<CustomerSection>('summary');
  const openSection = (nextSection: CustomerSection) => {
    setSection(nextSection);
  };
  const navigation: Array<{ key: CustomerSection; label: string }> = [
    { key: 'summary', label: '요약' },
    { key: 'campaign', label: '캠페인 분석' },
    { key: 'trend', label: '추이 분석' },
    { key: 'improvement', label: '이행관리' },
    { key: 'notifications', label: '알림관리' },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-service-page text-gray-800">
      <header className="service-header flex shrink-0 items-center border-b border-gray-200 bg-white px-6">
        <div className="flex min-w-56 items-center gap-2">
          <span className="text-xl font-black italic tracking-tight text-service-primary">kpc</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-400">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.4">
              <circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.5" /><path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3" />
            </svg>
          </span>
          <span className="flex flex-col text-[11px] font-semibold leading-tight text-gray-700"><span>Supply Chain</span><span>ESG Assessment</span></span>
        </div>

        <nav className="flex flex-1 justify-center self-stretch" aria-label="상단 메뉴">
          {navigation.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => openSection(item.key)}
              className={`flex items-center border-b-2 px-6 text-sm font-semibold transition-colors ${section === item.key ? 'border-service-primary text-service-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex min-w-56 items-center justify-end gap-3">
          <NotificationBell role="CUSTOMER" />
          <div className="flex items-center gap-2 text-gray-600">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.6">
                <circle cx="12" cy="8" r="3.2" /><path d="M5.5 19c.8-3.3 3-5 6.5-5s5.7 1.7 6.5 5" strokeLinecap="round" />
              </svg>
            </span>
            <span className="text-xs font-medium">TEST CUSTOMER님</span>
          </div>
          <button type="button" onClick={onLogout} className="rounded-full bg-gray-500 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-600">로그아웃</button>
        </div>
      </header>

      <main className="min-h-0 min-w-0 flex-1 overflow-auto">
        {section === 'summary'
          ? <CustomerHome view="summary" />
          : section === 'campaign'
            ? <CustomerProgress />
            : section === 'trend'
              ? <CustomerHome view="trend" />
              : section === 'improvement' ? <CustomerImprovement /> : <div className="p-6"><NotificationManagement role="CUSTOMER" /></div>}
      </main>
    </div>
  );
}
