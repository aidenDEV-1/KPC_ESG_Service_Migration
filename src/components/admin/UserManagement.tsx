import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';

interface Props {
  onNavigate?: (page: string) => void;
}

type UserLevel = '협력사' | '실사자' | '고객사';

interface User {
  no: number;
  level: UserLevel;
  company: string;
  category?: string;
  bizNo?: string;
  manager: string;
  email: string;
  joinDate: string;
  active: '활성' | '비활성';
}

const companyNames = [
  '에코파트너스', '그린테크', '한빛산업', '미래소재', '세림정공', '대성에너지',
  '우진테크', '신화물류', '동아케미칼', '태광솔루션', '하나모빌리티', '코리아패키징',
  '제일이앤씨', '삼우전자', '한국정밀', '유진바이오', '선진플랜트', '다온시스템',
  '우리산업', '청호테크', '새론금속', '인성로지스', '현대부품', '중앙기공',
];

const categories = ['NS_26', 'HK_26', '제조', '원자재', '유통', '식품'];
const managers = ['김민준', '이서연', '박지훈', '최유진', '정현우', '윤수빈', '장도윤', '한지민'];

const createUsers = (level: UserLevel, offset: number): User[] =>
  companyNames.map((company, index) => ({
    no: offset - index,
    level,
    company: level === '실사자' ? `${company} 컨설팅` : level === '고객사' ? `${company} 그룹` : `㈜${company}`,
    category: level === '협력사' ? categories[index % categories.length] : undefined,
    bizNo: level === '협력사' ? `${String(101 + index).padStart(3, '0')}-${String(10 + (index % 80)).padStart(2, '0')}-${String(10000 + index * 137).slice(-5)}` : undefined,
    manager: managers[index % managers.length],
    email: `${level === '실사자' ? 'auditor' : level === '고객사' ? 'client' : 'partner'}${String(index + 1).padStart(2, '0')}@example.com`,
    joinDate: `2026-${String(10 - (index % 6)).padStart(2, '0')}-${String(28 - (index % 20)).padStart(2, '0')} ${String(9 + (index % 8)).padStart(2, '0')}:${index % 2 ? '30' : '00'}`,
    active: index % 9 === 8 ? '비활성' : '활성',
  }));

const INITIAL_USERS: User[] = [
  ...createUsers('협력사', 5101),
  ...createUsers('실사자', 4101),
  ...createUsers('고객사', 3101),
];

const MEMBER_UPLOAD_HEADERS = ['구분', '기업명', '사업자등록번호', '담당자성명', '담당자이메일'] as const;

const downloadWorkbook = (rows: (string | number)[][], fileName: string) => {
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  worksheet['!cols'] = rows[0].map(() => ({ wch: 22 }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'List');
  XLSX.writeFile(workbook, fileName, { compression: true });
};

const columnsByLevel: Record<UserLevel, string[]> = {
  협력사: ['번호', '기업명', '구분', '사업자번호', '담당자명', '담당자 이메일', '가입일', '활성', '삭제'],
  실사자: ['번호', '기업명', '담당자명', '담당자 이메일', '활성', '삭제'],
  고객사: ['번호', '기업명', '담당자명', '담당자 이메일', '활성', '삭제'],
};

export default function UserManagement({ onNavigate }: Props) {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [selectedLevel, setSelectedLevel] = useState<UserLevel>('협력사');
  const [excelMessage, setExcelMessage] = useState('');
  const [searchColumn, setSearchColumn] = useState('기업명');
  const [searchDraft, setSearchDraft] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const columnValue = (user: User) => {
    const values: Record<string, string> = {
      번호: String(user.no),
      기업명: user.company,
      구분: user.category ?? '',
      사업자번호: user.bizNo ?? '',
      담당자명: user.manager,
      '담당자 이메일': user.email,
      가입일: user.joinDate,
      활성: user.active,
    };
    return values[searchColumn] ?? '';
  };
  const visibleUsers = users
    .filter(user => user.level === selectedLevel)
    .filter(user => !searchTerm || columnValue(user).toLowerCase().includes(searchTerm.toLowerCase()));

  const downloadTemplate = () => {
    downloadWorkbook(
      [[...MEMBER_UPLOAD_HEADERS], ['협력사', '㈜예시회사', '123-45-67890', '홍길동', 'manager@example.com']],
      '회원엑셀로드양식.xlsx',
    );
    setExcelMessage('회원 엑셀 로드 양식을 다운로드했습니다.');
  };

  const downloadUsers = () => {
    const rows = visibleUsers.map(user => selectedLevel === '협력사'
      ? [user.no, user.company, user.category ?? '', user.bizNo ?? '', user.manager, user.email, user.joinDate, user.active, '']
      : [user.no, user.company, user.manager, user.email, user.active, '']);
    downloadWorkbook(
      [columnsByLevel[selectedLevel], ...rows],
      `${selectedLevel}_사용자목록.xlsx`,
    );
    setExcelMessage(`${selectedLevel} 사용자 ${visibleUsers.length}명의 목록을 다운로드했습니다.`);
  };

  const loadMembers = async (file: File) => {
    try {
      const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet, { defval: '', raw: false });
      const imported = rows.filter(row => row.기업명 && row.담당자이메일).map((row, index): User => ({
        no: Math.max(...users.map(user => user.no)) + index + 1,
        level: ['협력사', '실사자', '고객사'].includes(row.구분) ? row.구분 as UserLevel : selectedLevel,
        company: row.기업명,
        category: row.구분,
        bizNo: row.사업자등록번호,
        manager: row.담당자성명,
        email: row.담당자이메일,
        joinDate: new Date().toLocaleString('sv-SE').slice(0, 16),
        active: '활성',
      }));
      setUsers(current => [...imported, ...current]);
      setExcelMessage(`${imported.length}명의 회원을 불러왔습니다.`);
    } catch {
      setExcelMessage('엑셀 파일을 읽지 못했습니다. 파일 형식을 확인해 주세요.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const deleteUser = (no: number) => setUsers(current => current.filter(user => user.no !== no));

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>사용자 관리</h1>

      <div className="mb-4 grid grid-cols-3 overflow-hidden rounded border bg-white" style={{ borderColor: '#d9dee8' }}>
        {(['협력사', '실사자', '고객사'] as UserLevel[]).map(level => (
          <button
            key={level}
            type="button"
            onClick={() => {
              setSelectedLevel(level);
              setSearchColumn('기업명');
              setSearchDraft('');
              setSearchTerm('');
            }}
            className="py-3 text-sm font-semibold transition-colors"
            style={{
              background: selectedLevel === level ? '#1a3055' : '#fff',
              color: selectedLevel === level ? '#fff' : '#555',
              borderRight: level !== '고객사' ? '1px solid #d9dee8' : undefined,
            }}
          >
            {level}
            <span className="ml-2 text-xs" style={{ opacity: 0.75 }}>{users.filter(user => user.level === level).length}</span>
          </button>
        ))}
      </div>

      <div className="mb-2 flex items-center justify-between gap-3">
        <span style={{ fontSize: 13, color: '#333' }}>
          {selectedLevel} 목록 <span style={{ color: '#e63946', fontWeight: 700 }}>{visibleUsers.length}</span>건
        </span>
        <div className="flex flex-1 justify-end gap-2">
          <select
            aria-label="검색 열"
            value={searchColumn}
            onChange={event => setSearchColumn(event.target.value)}
            className="rounded border px-3 text-sm"
            style={{ borderColor: '#cfd3d9', height: 34 }}
          >
            {columnsByLevel[selectedLevel].filter(column => column !== '삭제').map(column => <option key={column}>{column}</option>)}
          </select>
          <input
            aria-label="사용자 검색어"
            value={searchDraft}
            onChange={event => setSearchDraft(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') setSearchTerm(searchDraft.trim());
            }}
            placeholder={`${searchColumn} 검색`}
            className="rounded border px-3 text-sm"
            style={{ borderColor: '#cfd3d9', height: 34, width: 210 }}
          />
          <button type="button" onClick={() => setSearchTerm(searchDraft.trim())} className="rounded px-4 text-sm font-semibold text-white" style={{ background: '#1a3055' }}>검색</button>
          <button onClick={downloadTemplate} className="rounded border px-3 py-1 text-sm font-medium" style={{ borderColor: '#1e56d9', color: '#1e56d9', background: '#fff' }}>회원엑셀로드양식</button>
          <button onClick={() => fileInputRef.current?.click()} className="rounded border px-3 py-1 text-sm font-medium" style={{ borderColor: '#1e56d9', color: '#1e56d9', background: '#fff' }}>엑셀로드</button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            aria-label="회원 엑셀 파일 선택"
            className="hidden"
            onChange={event => {
              const file = event.target.files?.[0];
              if (file) void loadMembers(file);
            }}
          />
          <button onClick={downloadUsers} className="rounded px-3 py-1 text-sm font-medium text-white" style={{ background: '#1e56d9' }}>엑셀다운로드</button>
        </div>
      </div>

      {excelMessage && (
        <div role="status" className="mb-2 rounded border px-3 py-2 text-xs" style={{ borderColor: '#bdd1f8', background: '#f4f8ff', color: '#1e56d9' }}>
          {excelMessage}
        </div>
      )}

      <div className="overflow-hidden rounded border bg-white" style={{ borderColor: '#e0e0e0' }}>
        <table className="w-full border-collapse text-sm">
          <thead style={{ background: '#f8f8f8' }}>
            <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
              {columnsByLevel[selectedLevel].map(column => (
                <th key={column} className="px-3 py-2.5 text-center text-xs font-semibold" style={{ color: '#444', borderRight: '1px solid #eeeeee', whiteSpace: 'nowrap' }}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleUsers.map(user => (
              <tr key={user.no} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td className="px-3 py-2 text-center text-xs">{user.no}</td>
                <td className="px-3 py-2 text-center text-xs font-medium text-blue-600">{user.company}</td>
                {selectedLevel === '협력사' && (
                  <>
                    <td className="px-3 py-2 text-center text-xs">{user.category}</td>
                    <td className="px-3 py-2 text-center text-xs">{user.bizNo}</td>
                  </>
                )}
                <td className="px-3 py-2 text-center text-xs">{user.manager}</td>
                <td className="px-3 py-2 text-center text-xs text-blue-600">{user.email}</td>
                {selectedLevel === '협력사' && <td className="px-3 py-2 text-center text-xs">{user.joinDate}</td>}
                <td className="px-3 py-2 text-center text-xs">
                  <span className="rounded-full px-2 py-0.5" style={{ background: user.active === '활성' ? '#eaf7ef' : '#f2f2f2', color: user.active === '활성' ? '#26824d' : '#777' }}>{user.active}</span>
                </td>
                <td className="px-3 py-2 text-center text-xs">
                  <button type="button" onClick={() => deleteUser(user.no)} style={{ color: '#e63946', fontSize: 11 }}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
        <button className="rounded px-4 py-2 text-sm font-medium text-white" style={{ background: '#e63946' }} onClick={() => onNavigate?.('user-registration')}>사용자 등록</button>
      </div>
    </div>
  );
}
