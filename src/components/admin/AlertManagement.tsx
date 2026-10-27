import NotificationManagement from '../shared/NotificationManagement';
import type { AccountRole } from '../shared/notificationStore';

export default function AlertManagement({ role = 'ADMIN' }: { onNavigate?: (page: string) => void; role?: AccountRole }) {
  return <NotificationManagement role={role} />;
}
