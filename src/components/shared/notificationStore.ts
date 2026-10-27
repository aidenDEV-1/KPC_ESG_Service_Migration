export type AccountRole = 'ADMIN' | 'KPC' | 'PART' | 'AUD' | 'CUSTOMER' | 'CONSULTANT';
export type NoticeType = '알림' | '팝업';

export type Notice = {
  id: string;
  title: string;
  content: string;
  sender: string;
  type: NoticeType;
  targetRoles: AccountRole[];
  targetLabel: string;
  createdAt: string;
  startDate: string;
  endDate: string;
  active: boolean;
  popup?: { width: number; height: number; top: number; left: number };
};

const KEY = 'kpc-global-notices';
export const NOTICE_EVENT = 'kpc-notices-changed';

const seed: Notice[] = [
  { id: 'notice-3', title: '2026년 공급망 ESG 평가 일정 안내', content: '평가 일정과 제출 기한을 확인해 주세요.', sender: 'KPC 운영자', type: '알림', targetRoles: ['ADMIN', 'KPC', 'PART', 'AUD', 'CUSTOMER'], targetLabel: '전체', createdAt: '2026-09-18', startDate: '2026-09-18', endDate: '-', active: true },
  { id: 'notice-2', title: '현장실사 운영 공지', content: '현장실사 대상 기업과 배정 일정을 확인해 주세요.', sender: 'ADMIN 관리자', type: '팝업', targetRoles: ['ADMIN', 'KPC', 'AUD'], targetLabel: 'KPC · 실사자', createdAt: '2026-09-12', startDate: '2026-09-15', endDate: '2026-10-31', active: true, popup: { width: 460, height: 280, top: 120, left: 420 } },
];

export function getNotices(): Notice[] {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    return Array.isArray(stored) ? stored : seed;
  } catch {
    return seed;
  }
}

export function saveNotice(notice: Notice) {
  const notices = [notice, ...getNotices().filter(item => item.id !== notice.id)];
  localStorage.setItem(KEY, JSON.stringify(notices));
  window.dispatchEvent(new CustomEvent(NOTICE_EVENT));
}

export function getRoleNotices(role: AccountRole) {
  const today = new Date().toISOString().slice(0, 10);
  return getNotices().filter(item => item.active && item.targetRoles.includes(role) && item.startDate <= today && (item.endDate === '-' || item.endDate >= today));
}

export function getReadIds(role: AccountRole): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(`kpc-notice-read:${role}`) ?? '[]')); } catch { return new Set(); }
}

export function markRead(role: AccountRole, id: string) {
  const ids = getReadIds(role);
  ids.add(id);
  localStorage.setItem(`kpc-notice-read:${role}`, JSON.stringify([...ids]));
  window.dispatchEvent(new CustomEvent(NOTICE_EVENT));
}
