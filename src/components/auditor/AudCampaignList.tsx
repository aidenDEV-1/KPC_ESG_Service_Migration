import { useState } from 'react';
import * as XLSX from 'xlsx';
import { getAuditResult, type AuditAreaScores } from './auditResultStore';
import SurveyResultView from '../kpc/SurveyResultView';

type AuditStatus = '예정' | '완료';

type AssignedPartner = {
  name: string;
  client: string;
  logo: string;
  logoStyle: string;
  manager: string;
  phone: string;
  date: string;
  time: string;
  location: string;
  status: AuditStatus;
};

type Schedule = {
  id: string;
  day: number;
  time: string;
  endTime: string;
  company: string;
  location: string;
};

interface Props {
  onOpenMail: (company: string, mailId?: string) => void;
  onStartAudit: (company: string) => void;
  onOpenImprovement: (company: string) => void;
}

const assignedPartners: AssignedPartner[] = [
  { name: '한국정밀', client: 'DEX전자', logo: 'DEX', logoStyle: 'text-blue-800', manager: '박준석 팀장', phone: '010-3456-7890', date: '2026.10.19', time: '09:30', location: '경기도 화성시', status: '예정' },
  { name: '그린테크', client: 'KORTA', logo: 'KORTA', logoStyle: 'text-slate-700', manager: '이민호 부장', phone: '010-4567-8901', date: '2026.10.19', time: '14:00', location: '경기도 평택시', status: '예정' },
  { name: '미래부품', client: 'DEX전자', logo: 'DEX', logoStyle: 'text-blue-800', manager: '김수영 차장', phone: '010-5678-9012', date: '2026.10.21', time: '09:00', location: '충청남도 천안시', status: '예정' },
  { name: '대상산업', client: 'GLOBAL', logo: 'GLOBAL', logoStyle: 'text-emerald-700', manager: '정동환 과장', phone: '010-6789-0123', date: '2026.10.22', time: '11:00', location: '경상남도 창원시', status: '예정' },
  { name: '한빛테크', client: 'DEX전자', logo: 'DEX', logoStyle: 'text-blue-800', manager: '강태진 대리', phone: '010-7890-1234', date: '2026.10.23', time: '10:30', location: '인천광역시 남동구', status: '예정' },
  { name: '신성에너지', client: 'KORTA', logo: 'KORTA', logoStyle: 'text-slate-700', manager: '오지수 사원', phone: '010-8901-2345', date: '2026.10.15', time: '09:00', location: '대전광역시 유성구', status: '완료' },
  { name: '세영테크', client: 'GLOBAL', logo: 'GLOBAL', logoStyle: 'text-emerald-700', manager: '윤서진 과장', phone: '010-9012-3456', date: '2026.10.14', time: '14:30', location: '경기도 안산시', status: '완료' },
];

const schedules: Schedule[] = [
  { id: 's01', day: 1, time: '10:00', endTime: '12:00', company: '동아부품', location: '서울특별시 금천구' },
  { id: 's02', day: 2, time: '14:00', endTime: '16:30', company: '청명에너지', location: '충청북도 청주시' },
  { id: 's03', day: 5, time: '09:30', endTime: '12:00', company: '태성금속', location: '경기도 시흥시' },
  { id: 's04', day: 5, time: '14:00', endTime: '16:00', company: '우림산업', location: '경기도 김포시' },
  { id: 's05', day: 7, time: '11:00', endTime: '14:00', company: '제일테크', location: '인천광역시 서구' },
  { id: 's06', day: 9, time: '10:30', endTime: '13:00', company: '다온소재', location: '경기도 용인시' },
  { id: 's07', day: 14, time: '14:30', endTime: '17:00', company: '세영테크', location: '경기도 안산시' },
  { id: 's08', day: 15, time: '09:00', endTime: '12:00', company: '신성에너지', location: '대전광역시 유성구' },
  { id: 's09', day: 19, time: '09:30', endTime: '12:00', company: '한국정밀', location: '경기도 화성시' },
  { id: 's10', day: 19, time: '14:00', endTime: '16:30', company: '그린테크', location: '경기도 평택시' },
  { id: 's11', day: 20, time: '10:00', endTime: '12:30', company: '한솔전자', location: '경기도 수원시' },
  { id: 's12', day: 21, time: '09:00', endTime: '11:30', company: '미래부품', location: '충청남도 천안시' },
  { id: 's13', day: 21, time: '15:00', endTime: '17:30', company: '새론산업', location: '충청남도 아산시' },
  { id: 's14', day: 22, time: '11:00', endTime: '14:00', company: '대상산업', location: '경상남도 창원시' },
  { id: 's15', day: 23, time: '10:30', endTime: '13:00', company: '한빛테크', location: '인천광역시 남동구' },
  { id: 's16', day: 23, time: '14:30', endTime: '17:00', company: '에코파트너', location: '서울특별시 강서구' },
  { id: 's17', day: 23, time: '17:30', endTime: '19:00', company: '한솔금속', location: '인천광역시 서구' },
];

const calendarCells = [
  { day: 28, muted: true }, { day: 29, muted: true }, { day: 30, muted: true },
  ...Array.from({ length: 31 }, (_, index) => ({ day: index + 1, muted: false })),
  { day: 1, muted: true },
];

function ScheduleDashboard() {
  const [selectedDay, setSelectedDay] = useState(19);
  const [scheduleItems, setScheduleItems] = useState(schedules);
  const [draft, setDraft] = useState({ id: '', day: 19, time: '09:00', endTime: '11:00', company: '', location: '' });
  const selectedSchedules = scheduleItems.filter((schedule) => schedule.day === selectedDay);
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][new Date(2026, 9, selectedDay).getDay()];
  const todayDay = 19;

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="grid h-[42rem] xl:grid-cols-[2.25fr_0.75fr]">
        <div className="border-b border-gray-200 p-5 xl:border-b-0 xl:border-r">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-xl font-black text-gray-900">월간 실사 일정</div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setDraft({ id: '', day: selectedDay, time: '09:00', endTime: '11:00', company: '', location: '' })} className="rounded-lg bg-[#1a3055] px-3 py-2 text-xs font-bold text-white">+ 일정 추가</button>
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200" aria-label="이전 달">‹</button>
              <strong className="text-lg text-gray-900">2026.10</strong>
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200" aria-label="다음 달">›</button>
            </div>
          </div>
          <div className="grid grid-cols-7 border-b border-gray-200 pb-2 text-center text-xs font-bold text-gray-500">
            {['월', '화', '수', '목', '금', '토', '일'].map((day) => <div key={day}>{day}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {calendarCells.map((cell, index) => {
              const daySchedules = cell.muted ? [] : scheduleItems.filter((schedule) => schedule.day === cell.day);
              const selected = !cell.muted && selectedDay === cell.day;
              return (
                <button
                  type="button"
                  key={`${cell.day}-${index}`}
                  disabled={cell.muted}
                  onClick={() => setSelectedDay(cell.day)}
                  className={`relative h-24 overflow-hidden border-b border-r border-gray-100 p-2 text-left transition-colors ${
                    selected ? 'bg-blue-50 ring-2 ring-inset ring-blue-400' : cell.muted ? 'cursor-default bg-gray-50 text-gray-300' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`absolute left-2 top-2 text-xs font-bold ${selected ? 'text-blue-600' : ''}`}>
                    {cell.day}
                    {!cell.muted && cell.day === todayDay && <span className="ml-1 rounded-full bg-service-primary px-1.5 py-0.5 text-[8px] font-bold text-white">오늘</span>}
                  </span>
                  <span className={`absolute inset-x-2 bottom-2 top-8 block ${daySchedules.length >= 3 ? 'space-y-0.5' : 'space-y-1'}`}>
                    {daySchedules.map((schedule, scheduleIndex) => (
                      <span key={schedule.id} className={`block rounded px-1 text-center font-semibold ${daySchedules.length >= 3 ? 'py-0.5 text-[9px] leading-3' : 'py-1 text-[10px] leading-3'} ${scheduleIndex % 2 === 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-indigo-50 text-indigo-700'}`}>
                        {schedule.time}
                      </span>
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="overflow-y-auto bg-gray-50/60 p-4">
          <div className="text-base font-black text-gray-900">2026년 10월 {selectedDay}일</div>
          <div className="mt-1 text-sm text-gray-500">총 {selectedSchedules.length}건의 일정이 있습니다.</div>
          <div className="mt-4 space-y-2">
            <div className="rounded-lg border border-blue-200 bg-white p-3">
              <div className="grid grid-cols-2 gap-2">
                <input type="number" min={1} max={31} value={draft.day} onChange={event => setDraft(current => ({ ...current, day: Number(event.target.value) }))} className="rounded border px-2 py-1.5 text-xs" aria-label="실사 일자" />
                <input value={draft.company} onChange={event => setDraft(current => ({ ...current, company: event.target.value }))} className="rounded border px-2 py-1.5 text-xs" placeholder="기업명" />
                <input type="time" value={draft.time} onChange={event => setDraft(current => ({ ...current, time: event.target.value }))} className="rounded border px-2 py-1.5 text-xs" />
                <input type="time" value={draft.endTime} onChange={event => setDraft(current => ({ ...current, endTime: event.target.value }))} className="rounded border px-2 py-1.5 text-xs" />
                <input value={draft.location} onChange={event => setDraft(current => ({ ...current, location: event.target.value }))} className="col-span-2 rounded border px-2 py-1.5 text-xs" placeholder="실사 장소" />
              </div>
              <button type="button" onClick={() => { if (!draft.company.trim()) return; setScheduleItems(current => draft.id ? current.map(item => item.id === draft.id ? { ...draft } : item) : [...current, { ...draft, id: `s${Date.now()}` }]); setSelectedDay(draft.day); setDraft({ id: '', day: draft.day, time: '09:00', endTime: '11:00', company: '', location: '' }); }} className="mt-2 w-full rounded bg-blue-600 py-2 text-xs font-bold text-white">{draft.id ? '일정 수정 저장' : '일정 추가'}</button>
            </div>
            {selectedSchedules.map((schedule) => (
              <div key={schedule.id} className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                <div className="text-xs font-semibold text-gray-500">{weekday}요일 {schedule.time} ~ {schedule.endTime}</div>
                <div className="mt-1.5 text-base font-black text-gray-900">{schedule.company}</div>
                <div className="mt-1 text-xs text-gray-500">{schedule.location} · ESG 현장실사</div>
                <div className="mt-3 flex gap-2"><button type="button" onClick={() => setDraft({ ...schedule })} className="rounded border border-gray-300 px-2 py-1 text-[10px] font-bold">수정</button><button type="button" onClick={() => setScheduleItems(current => current.filter(item => item.id !== schedule.id))} className="rounded border border-red-200 px-2 py-1 text-[10px] font-bold text-red-600">삭제</button></div>
              </div>
            ))}
            {selectedSchedules.length === 0 && <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center text-sm text-gray-400">등록된 일정이 없습니다.</div>}
          </div>
        </div>
      </div>
    </section>
  );
}

function AuditProgressChart() {
  const items = [{ label: '진행 예정', value: 5, color: '#3b82f6' }, { label: '진행 중', value: 2, color: '#f59e0b' }, { label: '완료', value: 7, color: '#22c55e' }];
  return <section className="flex h-[42rem] flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><div className="text-base font-black">현장실사 진행 현황</div><div className="mt-3 text-xs text-gray-400">전체 실사 단계별 기업 수</div><div className="mt-8 flex flex-1 items-end justify-around gap-5 border-b border-gray-200 px-3">{items.map(item => <div key={item.label} className="flex h-full flex-1 flex-col items-center justify-end"><strong className="mb-2 text-2xl" style={{ color: item.color }}>{item.value}</strong><div className="w-16 rounded-t-lg" style={{ height: `${item.value * 42}px`, background: item.color }} /><span className="my-4 text-xs font-bold text-gray-600">{item.label}</span></div>)}</div><div className="mt-5 grid grid-cols-3 gap-2">{items.map(item => <div key={item.label} className="rounded-lg bg-gray-50 p-3 text-center text-xs"><span className="mx-auto mb-2 block h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />{item.label}</div>)}</div></section>;
}

function PartnerSection({ status, onOpenMail, onStartAudit }: { status: AuditStatus } & Pick<Props, 'onOpenMail' | 'onStartAudit'>) {
  const visiblePartners = assignedPartners.filter((partner) => partner.status === status);
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <div className={`h-4 w-1 rounded-full ${status === '예정' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
        <div className="text-lg font-bold text-gray-900">{status} 실사</div>
        <span className="rounded-full bg-gray-200 px-2.5 py-1 text-xs font-bold text-gray-600">{visiblePartners.length}개사</span>
      </div>
      <div className="space-y-3">
        {visiblePartners.map((partner) => (
          <article key={partner.name} className="flex flex-wrap items-center gap-5 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <div className={`flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-sm font-black ${partner.logoStyle}`}>{partner.logo}</div>
            <div className="min-w-44 flex-1">
              <div className="text-base font-bold text-gray-900">{partner.name}</div>
              <div className="mt-1 text-xs text-gray-400">{partner.client} 협력사</div>
            </div>
            <div className="w-40">
              <div className="text-xs font-semibold text-gray-700">{partner.manager}</div>
              <div className="mt-1 text-xs text-gray-400">{partner.phone}</div>
            </div>
            <div className="w-40">
              <div className="text-xs font-semibold text-gray-700">{partner.date} {partner.time}</div>
              <div className="mt-1 text-xs text-gray-400">{partner.location}</div>
            </div>
            <button type="button" onClick={() => onStartAudit(partner.name)} className="h-10 rounded-lg bg-slate-700 px-4 text-xs font-semibold text-white hover:bg-slate-800">
              실사평가
            </button>
            <span className={`inline-flex h-10 min-w-16 items-center justify-center rounded-full px-3 text-xs font-bold ${status === '예정' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>{status}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function AudCampaignList({ onOpenMail, onStartAudit, onOpenImprovement }: Props) {
  const [detail, setDetail] = useState<{ type: 'result' | 'improvement'; company: string } | null>(null);
  const completedDefaults: Record<string, AuditAreaScores> = {
    신성에너지: { total: 77, labor: 75.3, safety: 80, environment: 74.2, ethics: 78.5 },
    세영테크: { total: 79, labor: 77.3, safety: 82, environment: 76.2, ethics: 80.5 },
  };
  const auditRows = assignedPartners.map((partner, index) => {
    const storedResult = getAuditResult(partner.name);
    const finalScores = storedResult?.scores ?? (partner.status === '완료' ? completedDefaults[partner.name] : null);
    return { ...partner, selfScore: 72 + index * 2, verifiedScore: 69 + index * 2, finalScores };
  });
  const downloadRows = (name: string) => { const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(auditRows), name); XLSX.writeFile(workbook, `${name}.xlsx`); };
  return (
    <main className="flex-1 overflow-auto bg-service-page">
      <div className="service-page-wide mx-auto max-w-[100rem] space-y-8">
        <div>
          <div className="service-page-title">실사 관리</div>
          <div className="service-page-description">배정된 현장실사 일정과 협력사 커뮤니케이션을 관리합니다.</div>
        </div>
        <div className="grid items-start gap-5 2xl:grid-cols-[minmax(0,2.5fr)_minmax(22rem,0.72fr)]">
          <ScheduleDashboard />
          <AuditProgressChart />
        </div>
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4"><div className="text-lg font-black">현장실사 대상 기업</div><div className="flex gap-2"><button type="button" onClick={() => downloadRows('개선과제 일괄')} className="rounded bg-[#167d8d] px-4 py-2 text-xs font-bold text-white">개선과제 일괄 다운로드</button><button type="button" onClick={() => downloadRows('최종보고서 일괄')} className="rounded bg-[#1a3055] px-4 py-2 text-xs font-bold text-white">보고서 일괄 다운로드</button></div></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[82rem] text-xs"><thead className="bg-gray-50"><tr><th rowSpan={2} className="px-3 py-3">NO.</th><th rowSpan={2} className="px-3 py-3 text-center">기업명</th><th colSpan={5} className="border-b border-gray-200 px-3 py-2 text-[#1a3055]">최종 실사결과 반영 점수</th><th rowSpan={2} className="px-3 py-3">자가진단 대비 GAP</th><th rowSpan={2} className="px-3 py-3">정합성 검토 대비 GAP</th><th rowSpan={2} className="px-3 py-3">상태</th><th rowSpan={2} className="px-3 py-3">상세</th></tr><tr>{['총점', '인권', '안전', '환경', '윤리'].map(value => <th key={value} className="border-r border-gray-100 px-3 py-2">{value}</th>)}</tr></thead><tbody className="divide-y divide-gray-100">{auditRows.map((row, index) => { const final = row.finalScores; const gapSelf = final ? Number((final.total - row.selfScore).toFixed(1)) : null; const gapVerified = final ? Number((final.total - row.verifiedScore).toFixed(1)) : null; return <tr key={row.name}><td className="px-3 py-3 text-center">{index + 1}</td><td className="px-3 py-3 text-center font-bold">{row.name}</td>{final ? [final.total, final.labor, final.safety, final.environment, final.ethics].map((score, scoreIndex) => <td key={scoreIndex} className="border-l border-gray-100 text-center font-bold">{score}</td>) : [0, 1, 2, 3, 4].map(value => <td key={value} className="border-l border-gray-100 text-center">-</td>)}<td className="text-center font-bold text-red-600">{gapSelf === null ? '-' : gapSelf > 0 ? `+${gapSelf}` : gapSelf}</td><td className="text-center font-bold text-red-600">{gapVerified === null ? '-' : gapVerified > 0 ? `+${gapVerified}` : gapVerified}</td><td className="text-center"><span className={`rounded-full px-2 py-1 font-bold ${final ? 'bg-green-50 text-green-700' : index < 2 ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>{final ? '완료' : index < 2 ? '진행 중' : '진행 예정'}</span></td><td className="whitespace-nowrap px-3 text-center"><button onClick={() => setDetail({ type: 'result', company: row.name })} className="mr-1 rounded bg-slate-700 px-2 py-1 text-white">실사 결과</button><button onClick={() => onOpenImprovement(row.name)} className="mr-1 rounded bg-slate-700 px-2 py-1 text-white">개선과제</button><button onClick={() => downloadRows(`${row.name}_최종보고서`)} className="rounded bg-[#167d8d] px-2 py-1 text-white">최종보고서</button></td></tr>; })}</tbody></table></div>
        </section>
        <PartnerSection status="예정" onOpenMail={onOpenMail} onStartAudit={onStartAudit} />
        <PartnerSection status="완료" onOpenMail={onOpenMail} onStartAudit={onStartAudit} />
        {detail?.type === 'result' && <div className="fixed inset-0 z-[100] bg-white"><SurveyResultView initialTab="실사결과보기" onClose={() => setDetail(null)} /></div>}
      </div>
    </main>
  );
}
