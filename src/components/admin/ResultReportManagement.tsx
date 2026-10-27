import { useState } from 'react';
import { admClients } from '../../data';

const logoStyles = [
  'bg-red-50 text-red-600',
  'bg-blue-50 text-blue-700',
  'bg-emerald-50 text-emerald-700',
  'bg-violet-50 text-violet-700',
  'bg-amber-50 text-amber-700',
];

function ClientLogo({ company, index }: { company: string; index: number }) {
  const suffix = company.replace('TEST 고객사 ', '');
  return (
    <div className={`flex h-14 w-20 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-sm font-black ${logoStyles[index % logoStyles.length]}`}>
      {suffix.length <= 2 ? suffix : company.slice(0, 4)}
    </div>
  );
}

export default function ResultReportManagement() {
  const [query, setQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const normalizedQuery = query.trim().toLowerCase();
  const clients = admClients.filter((client) => (
    client.company.toLowerCase().includes(normalizedQuery)
    || client.bizNo.includes(normalizedQuery)
  ));

  return (
    <div>
      <div className="mb-5">
        <div className="text-xl font-bold text-gray-900">결과보고서 관리</div>
        <div className="mt-1 text-xs text-gray-500">고객사별 ESG 결과보고서 구성과 내용을 관리합니다.</div>
      </div>

      <div className="mb-4 flex justify-center gap-2 rounded-lg border border-gray-200 bg-white p-4">
        <label className="relative block w-full max-w-xl">
          <span className="sr-only">고객사 검색</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-none stroke-gray-400" strokeWidth="1.8">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m15.5 15.5 4 4" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="고객사명 또는 사업자번호 검색"
            className="service-control w-full pl-9"
          />
        </label>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm text-gray-600">전체 고객사 <strong className="text-service-primary">{clients.length}</strong>개</div>
        {selectedClient && <div className="text-xs font-medium text-gray-500"><strong className="text-gray-800">{selectedClient}</strong> 결과보고서 편집을 선택했습니다.</div>}
      </div>

      <div className="space-y-3">
        {clients.map((client, index) => (
          <article key={client.no} className="flex min-h-24 flex-wrap items-center gap-5 rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <ClientLogo company={client.company} index={index} />
            <div className="min-w-52 flex-1">
              <div className="text-base font-bold text-gray-900">{client.company}</div>
              <div className="mt-1 text-xs text-gray-500">사업자번호 {client.bizNo}</div>
            </div>
            <div className="w-44">
              <div className="text-[11px] text-gray-400">가입일</div>
              <div className="mt-1 text-xs font-medium text-gray-600">{client.joinDate}</div>
            </div>
            <span className="inline-flex min-w-14 justify-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{client.active}</span>
            <button
              type="button"
              onClick={() => setSelectedClient(client.company)}
              className="ml-auto rounded-md bg-service-primary px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-service-primary-hover"
            >
              결과보고서 편집
            </button>
          </article>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white py-16 text-center text-sm text-gray-400">검색 결과가 없습니다.</div>
      )}
    </div>
  );
}
