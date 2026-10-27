import { useMemo, useState } from 'react';

type Mail = {
  id: string;
  direction: '받은메일' | '보낸메일';
  sender: string;
  recipient: string;
  subject: string;
  preview: string;
  body: string[];
  date: string;
  status: '수신완료' | '발송완료';
  unread?: boolean;
  attachment?: string;
};

interface Props {
  companyName: string;
  initialMailId?: string;
  onBack: () => void;
}

const receivedSubjects = [
  '실사 전 증빙자료 추가 전달드립니다.',
  '10월 현장실사 출입 안내',
  '환경 데이터 산정범위 관련 문의',
  '실사 일정 담당자 변경 안내',
  '자가진단 답변 수정 요청',
  '현장실사 완료 자료 확인 요청',
  '추가 개선자료 전달드립니다.',
  '실사 방문 인원 확인 요청',
];

function createMails(companyName: string): Mail[] {
  const manager = companyName === '한국정밀' ? '박준석 팀장' : companyName === '그린테크' ? '이민호 부장' : `${companyName} 담당자`;
  return Array.from({ length: 16 }, (_, index) => {
    const received = index % 2 === 0;
    const subject = received
      ? receivedSubjects[(index / 2) % receivedSubjects.length]
      : `RE: [KPC C-ON] ${receivedSubjects[Math.floor(index / 2) % receivedSubjects.length]}`;
    return {
      id: `m${String(16 - index).padStart(2, '0')}`,
      direction: received ? '받은메일' : '보낸메일',
      sender: received ? `${manager} (${companyName})` : '김민수 수석컨설턴트',
      recipient: received ? '김민수 수석컨설턴트' : `${manager} (${companyName})`,
      subject,
      preview: received ? '요청하신 자료와 관련 내용을 전달드립니다. 확인 부탁드립니다.' : '담당자님, 전달해주신 내용 확인했습니다.',
      body: received
        ? [
            '안녕하세요, 담당 실사자님.',
            '현장실사 준비와 관련하여 요청하신 자료 및 확인 내용을 전달드립니다.',
            '첨부한 자료를 검토해 주시고 추가로 필요한 사항이 있으면 회신 부탁드립니다.',
            '감사합니다.',
          ]
        : [
            `안녕하세요, ${manager}님.`,
            '전달해주신 자료를 확인했습니다.',
            '현장실사 당일 세부 내용을 함께 확인하겠습니다.',
            '감사합니다.',
          ],
      date: `2026-${index < 6 ? '10' : '09'}-${String(Math.max(2, 18 - index)).padStart(2, '0')} ${index % 3 === 0 ? '17:42' : index % 3 === 1 ? '14:20' : '09:15'}`,
      status: received ? '수신완료' : '발송완료',
      unread: received && index < 8,
      attachment: received && index % 4 === 0 ? '현장실사_추가증빙자료.zip' : undefined,
    };
  });
}

export default function AudMailManagement({ companyName, initialMailId, onBack }: Props) {
  const mails = useMemo(() => createMails(companyName), [companyName]);
  const [tab, setTab] = useState<'전체' | '보낸메일' | '받은메일'>('전체');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(initialMailId ?? null);
  const selectedMail = mails.find((mail) => mail.id === selectedId);
  const filteredMails = mails.filter((mail) => (
    (tab === '전체' || mail.direction === tab)
    && (!query.trim() || `${mail.subject} ${mail.preview} ${mail.sender}`.toLowerCase().includes(query.trim().toLowerCase()))
  ));

  if (selectedMail) {
    return (
      <main className="flex-1 overflow-auto bg-service-page">
        <div className="service-page-wide mx-auto max-w-[90rem]">
          <div className="mb-5 flex items-center gap-3">
            <button type="button" onClick={() => setSelectedId(null)} className="flex h-9 items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-600 hover:border-service-primary hover:text-service-primary">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
                <path d="m14 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              메일 목록
            </button>
            <div className="h-5 w-px bg-gray-300" />
            <div>
              <div className="text-lg font-bold text-gray-900">메일 관리 — {companyName}</div>
              <div className="mt-0.5 text-xs text-gray-500">선택한 메일의 상세 내용입니다.</div>
            </div>
          </div>

          <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-7 py-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded px-2.5 py-1 text-xs font-bold ring-1 ${selectedMail.direction === '받은메일' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-blue-50 text-blue-700 ring-blue-200'}`}>{selectedMail.direction}</span>
                <span className="text-xs text-gray-400">{selectedMail.date}</span>
              </div>
              <div className="mt-4 text-xl font-black text-gray-900">{selectedMail.subject}</div>
              <dl className="mt-5 grid gap-2 text-sm">
                <div className="flex gap-4"><dt className="w-16 font-semibold text-gray-400">보낸 사람</dt><dd className="font-medium text-gray-700">{selectedMail.sender}</dd></div>
                <div className="flex gap-4"><dt className="w-16 font-semibold text-gray-400">받는 사람</dt><dd className="font-medium text-gray-700">{selectedMail.recipient}</dd></div>
              </dl>
            </div>
            <div className="min-h-72 px-7 py-8 text-sm leading-8 text-gray-700">
              {selectedMail.body.map((paragraph) => <p key={paragraph} className="mb-4">{paragraph}</p>)}
            </div>
            {selectedMail.attachment && (
              <div className="border-t border-gray-100 bg-gray-50 px-7 py-4">
                <div className="text-xs font-semibold text-gray-500">첨부파일</div>
                <button type="button" className="mt-2 inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-blue-700">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8"><path d="M8 12.5 13.5 7a3 3 0 0 1 4.2 4.2l-7.2 7.2a5 5 0 1 1-7.1-7.1l7-7" strokeLinecap="round" /></svg>
                  {selectedMail.attachment}
                </button>
              </div>
            )}
            <div className="flex justify-end border-t border-gray-100 px-7 py-4">
              <button type="button" className="rounded-md bg-service-primary px-5 py-2.5 text-xs font-semibold text-white hover:bg-service-primary-hover">답장 작성</button>
            </div>
          </article>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-auto bg-service-page">
      <div className="service-page-wide mx-auto max-w-[96rem]">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onBack} className="flex h-9 items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-600 hover:border-service-primary hover:text-service-primary">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8"><path d="m14 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              실사 관리
            </button>
            <div>
              <div className="text-xl font-black text-gray-900">메일 관리 — {companyName}</div>
              <div className="mt-1 text-xs text-gray-500">협력사와 주고받은 실사 관련 메일을 관리합니다.</div>
            </div>
          </div>
          <button type="button" className="rounded-md bg-service-primary px-5 py-2.5 text-xs font-semibold text-white hover:bg-service-primary-hover">보완 요청 메일 작성</button>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {(['전체', '보낸메일', '받은메일'] as const).map((item) => (
              <button type="button" key={item} onClick={() => setTab(item)} className={`rounded-md border px-5 py-2 text-xs font-semibold ${tab === item ? 'border-slate-800 bg-slate-800 text-white' : 'border-gray-300 bg-white text-gray-600'}`}>
                {item} ({item === '전체' ? mails.length : mails.filter((mail) => mail.direction === item).length})
              </button>
            ))}
          </div>
          <label className="relative block w-72">
            <span className="sr-only">메일 검색</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="제목, 내용, 발신자 검색" className="service-control w-full pr-10" />
            <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-none stroke-gray-400" strokeWidth="1.8"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 4 4" /></svg>
          </label>
        </div>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4 text-sm text-gray-600">목록 <strong className="text-service-primary">{filteredMails.length}</strong>건</div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[70rem] border-collapse text-xs">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="w-16 px-4 py-3">NO</th><th className="w-24 px-4 py-3">구분</th><th className="w-44 px-4 py-3 text-left">발신자</th><th className="w-44 px-4 py-3 text-left">수신자</th><th className="px-4 py-3 text-left">제목 및 내용 요약</th><th className="w-40 px-4 py-3">일시</th><th className="w-24 px-4 py-3">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMails.map((mail, index) => (
                  <tr key={mail.id} onClick={() => setSelectedId(mail.id)} className={`cursor-pointer hover:bg-gray-50 ${mail.unread ? 'bg-blue-50/40' : ''}`}>
                    <td className="px-4 py-4 text-center text-gray-500">{filteredMails.length - index}</td>
                    <td className="px-4 py-4 text-center"><span className={`rounded px-2 py-1 font-bold ring-1 ${mail.direction === '받은메일' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-blue-50 text-blue-700 ring-blue-200'}`}>{mail.direction}</span></td>
                    <td className="px-4 py-4 font-medium text-gray-700">{mail.sender}</td>
                    <td className="px-4 py-4 font-medium text-gray-700">{mail.recipient}</td>
                    <td className="px-4 py-4"><div className={`${mail.unread ? 'font-black' : 'font-semibold'} text-gray-900`}>{mail.subject}</div><div className="mt-1 truncate text-gray-400">{mail.preview}</div></td>
                    <td className="px-4 py-4 text-center text-gray-500">{mail.date}</td>
                    <td className={`px-4 py-4 text-center font-bold ${mail.status === '수신완료' ? 'text-emerald-600' : 'text-blue-600'}`}>{mail.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
