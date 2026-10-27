import { useMemo, useState } from 'react';
import type { CampaignRecord } from './CampaignManagement';
import CampaignDatePicker from './CampaignDatePicker';
import { assignedCampaignAuditors, availableCampaignPartners, selectedCampaignPartners } from '../../data/campaignAssignments';

interface Props {
  onBack: () => void;
  onSave: (campaign: CampaignRecord) => void;
  onNavigateSurvey: () => void;
  onNavigateDetail: () => void;
  campaign: CampaignRecord;
}

const clients = ['LG', 'SK', '농심', '롯데', '삼성', '한화', '현대'];
const databaseCompanyNames = ['에코파트너스', '그린테크', '한빛산업', '미래소재', '세림정공', '대성에너지', '우진테크', '신화물류', '동아케미칼', '태광솔루션', '하나모빌리티', '코리아패키징', '제일이앤씨', '삼우전자', '한국정밀', '유진바이오', '선진플랜트', '다온시스템', '우리산업', '청호테크', '새론금속', '인성로지스', '현대부품', '중앙기공'];
const partnerPool = [
  ...availableCampaignPartners,
  ...selectedCampaignPartners.map(item => item.label),
  ...Array.from({ length: 48 }, (_, index) => `${index + 1}] ㈜${databaseCompanyNames[index % databaseCompanyNames.length]} (${String(101 + index)}-${String(10 + index % 80).padStart(2, '0')}-${String(10000 + index * 137).slice(-5)})`),
];
const auditorPool = Array.from({ length: 32 }, (_, index) => `${databaseCompanyNames[index % databaseCompanyNames.length]} 컨설팅 실사자 ${String(index + 1).padStart(2, '0')} (auditor${index + 1}@example.com)`);

const autoStatus = (start: string, end: string) => {
  if (!start || !end) return '준비중';
  const today = new Date().toISOString().slice(0, 10);
  if (today < start) return '준비중';
  if (today > end) return '종료';
  return '진행중';
};

export default function CampaignEditDetail({ onBack, onSave, onNavigateSurvey, onNavigateDetail, campaign }: Props) {
  const [name, setName] = useState(campaign.name);
  const [client, setClient] = useState(campaign.provider);
  const [startDate, setStartDate] = useState(campaign.startDate);
  const [endDate, setEndDate] = useState(campaign.endDate);
  const [active, setActive] = useState(campaign.active === 'Y' ? '활성' : '비활성');
  const [partners, setPartners] = useState(campaign.partners ?? selectedCampaignPartners.map(item => item.label));
  const [auditors, setAuditors] = useState(campaign.auditors ?? assignedCampaignAuditors.slice(0, 3));
  const [improvementEnabled, setImprovementEnabled] = useState(Boolean(campaign.taskStart || campaign.taskEnd));
  const [auditEnabled, setAuditEnabled] = useState(Boolean((campaign.auditors ?? []).length));
  const [taskStart, setTaskStart] = useState(campaign.taskStart ?? '');
  const [taskEnd, setTaskEnd] = useState(campaign.taskEnd ?? '');
  const [auditStart, setAuditStart] = useState(campaign.startDate);
  const [auditEnd, setAuditEnd] = useState(campaign.endDate);
  const [resultReportAllowed, setResultReportAllowed] = useState(true);
  const [clientEvidenceAllowed, setClientEvidenceAllowed] = useState(true);
  const [clientReportAllowed, setClientReportAllowed] = useState(true);
  const [consistencyReviewVisible, setConsistencyReviewVisible] = useState(campaign.consistencyReviewVisible ?? false);
  const [improvementDownload, setImprovementDownload] = useState(true);
  const [description, setDescription] = useState(`${campaign.provider}는 협력사의 지속가능경영 수준 진단과 개선을 위해 본 ESG 평가 캠페인을 운영합니다.`);
  const [privacy, setPrivacy] = useState(`${campaign.provider}는 캠페인 운영에 필요한 담당자 정보와 설문 응답을 평가 목적으로 수집·이용합니다.`);
  const [thirdParty, setThirdParty] = useState(`${campaign.provider}는 평가와 현장실사를 위해 필요한 범위에서 평가기관 및 지정 실사자에게 정보를 제공합니다.`);
  const [message, setMessage] = useState('');
  const status = useMemo(() => autoStatus(startDate, endDate), [endDate, startDate]);

  const save = () => {
    const missing = [
      !name.trim() && '캠페인명',
      !client && '고객사',
      !startDate && '설문 시작일',
      !endDate && '설문 종료일',
      improvementEnabled && !taskStart && '개선과제 시작일',
      improvementEnabled && !taskEnd && '개선과제 종료일',
      auditEnabled && !auditStart && '현장실사 시작일',
      auditEnabled && !auditEnd && '현장실사 종료일',
    ].filter(Boolean);
    if (missing.length) {
      setMessage(`필수 항목을 입력해 주세요: ${missing.join(', ')}`);
      return;
    }
    localStorage.setItem('consistency-review-enabled', String(consistencyReviewVisible));
    localStorage.setItem(`campaign-consistency-review:${campaign.name}`, String(consistencyReviewVisible));
    onSave({
      ...campaign,
      name: name.trim(),
      provider: client,
      startDate,
      endDate,
      status,
      active: active === '활성' ? 'Y' : 'N',
      contact: '',
      taskStart: improvementEnabled ? taskStart : '',
      taskEnd: improvementEnabled ? taskEnd : '',
      partners,
      auditors: auditEnabled ? auditors : [],
      consistencyReviewVisible,
    });
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div><h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a3055' }}>캠페인 수정</h2><div className="mt-1 text-xs" style={{ color: '#777' }}>{campaign.provider} · {campaign.name}</div></div>
        <div className="flex flex-wrap gap-2">
          <button onClick={onBack} className="rounded border px-4 py-2 text-sm" style={{ borderColor: '#ccc' }}>이전</button>
          <button onClick={save} className="rounded px-4 py-2 text-sm font-semibold text-white" style={{ background: '#1a6fbf' }}>저장</button>
          <button onClick={onNavigateDetail} className="rounded px-4 py-2 text-sm font-semibold text-white" style={{ background: '#1a3055' }}>캠페인 세부관리</button>
          <button onClick={onNavigateSurvey} className="rounded px-4 py-2 text-sm font-semibold text-white" style={{ background: '#1a3055' }}>설문 정보 등록</button>
          <button className="rounded px-4 py-2 text-sm font-semibold text-white" style={{ background: '#e63946' }}>삭제</button>
        </div>
      </div>
      {message && <div className="mb-3 rounded border px-4 py-2 text-sm" style={{ borderColor: '#f4b4b9', background: '#fff5f5', color: '#c62828' }}>{message}</div>}

      <EditSection title="기본 설정">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <EditField label="캠페인명" required wide><input value={name} onChange={event => setName(event.target.value)} className="w-full rounded border px-3 text-sm" style={editInputStyle} /></EditField>
          <EditField label="고객사" required><select value={client} onChange={event => setClient(event.target.value)} className="w-full rounded border px-3 text-sm" style={editInputStyle}>{[...new Set([client, ...clients])].map(item => <option key={item}>{item}</option>)}</select></EditField>
          <EditField label="활성여부"><select value={active} onChange={event => setActive(event.target.value)} className="rounded border px-3 text-sm" style={editInputStyle}><option>활성</option><option>비활성</option></select></EditField>
          <EditField label="설문 기간" required><div className="flex items-center gap-2"><CampaignDatePicker value={startDate} onChange={setStartDate} label="설문 시작일" /><span>~</span><CampaignDatePicker value={endDate} min={startDate} onChange={setEndDate} label="설문 종료일" /></div></EditField>
          <EditField label="캠페인 상태"><span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: status === '진행중' ? '#eaf3ff' : status === '준비중' ? '#fff5da' : '#eef0f2', color: '#315d9b' }}>{status}</span><span className="ml-2 text-xs" style={{ color: '#777' }}>설문 기간 기준 자동</span></EditField>
        </div>
        <div className="mt-5 border-t pt-4" style={{ borderColor: '#eceff3' }}>
          <div className="mb-3 text-sm font-semibold">캠페인 옵션</div>
          <div className="flex flex-wrap gap-6">
            <EditCheck checked={resultReportAllowed} onChange={setResultReportAllowed} label="결과보고서 배포 허용" />
            <EditCheck checked={clientEvidenceAllowed} onChange={setClientEvidenceAllowed} label="고객사 근거자료 다운로드 허용" />
            <EditCheck checked={clientReportAllowed} onChange={setClientReportAllowed} label="고객사 결과보고서 다운로드 허용" />
            <EditCheck checked={consistencyReviewVisible} onChange={setConsistencyReviewVisible} label="정합성 검토 결과 반영" />
          </div>
          <div className="mt-3 rounded px-3 py-2 text-xs" style={{ background: '#f0f5ff', color: '#315d9b' }}>실사자 파일 업로드, 개별 실사자 배정, 진단·실사 동시 진행은 기본 허용됩니다.</div>
        </div>
      </EditSection>

      <EditSection title="협력사 설정">
        <EditTransfer items={[...new Set(partnerPool)]} selected={partners} onChange={setPartners} left="전체 협력사" right="선택한 협력사" />
      </EditSection>

      <EditToggle title="개선과제 관리" enabled={improvementEnabled} onChange={setImprovementEnabled}>
        <div className="grid grid-cols-2 gap-6">
          <EditField label="개선과제 기간" required><div className="flex items-center gap-2"><CampaignDatePicker value={taskStart} onChange={setTaskStart} label="개선과제 시작일" /><span>~</span><CampaignDatePicker value={taskEnd} min={taskStart} onChange={setTaskEnd} label="개선과제 종료일" /></div></EditField>
          <EditField label="관리 옵션"><EditCheck checked={improvementDownload} onChange={setImprovementDownload} label="개선과제 다운로드 허용" /></EditField>
        </div>
      </EditToggle>

      <EditToggle title="현장실사 관리" enabled={auditEnabled} onChange={setAuditEnabled}>
        <div className="mb-5 flex items-center justify-between">
          <EditField label="현장실사 기간" required><div className="flex items-center gap-2"><CampaignDatePicker value={auditStart} onChange={setAuditStart} label="현장실사 시작일" /><span>~</span><CampaignDatePicker value={auditEnd} min={auditStart} onChange={setAuditEnd} label="현장실사 종료일" /></div></EditField>
          <button onClick={onNavigateDetail} className="rounded px-4 py-2 text-sm font-semibold text-white" style={{ background: '#1a3055' }}>캠페인 세부관리</button>
        </div>
        <div className="mb-2 text-sm font-semibold">실사자 설정</div>
        <EditTransfer items={[...new Set([...assignedCampaignAuditors, ...auditorPool])]} selected={auditors} onChange={setAuditors} left="전체 실사자" right="배정 실사자" />
      </EditToggle>

      <EditSection title="안내문 초안">
        <EditDraft label="캠페인 설명" value={description} onChange={setDescription} />
        <EditDraft label="개인정보 처리방침" value={privacy} onChange={setPrivacy} />
        <EditDraft label="제3자 정보동의" value={thirdParty} onChange={setThirdParty} />
      </EditSection>
    </div>
  );
}

const editInputStyle = { height: 38, borderColor: '#cfd3d9' };
function EditSection({ title, children }: { title: string; children: React.ReactNode }) { return <section className="mb-4 rounded border bg-white p-5" style={{ borderColor: '#e0e0e0' }}><h3 className="mb-4" style={{ fontSize: 15, fontWeight: 700, color: '#1a3055' }}>{title}</h3>{children}</section>; }
function EditField({ label, required, wide, children }: { label: string; required?: boolean; wide?: boolean; children: React.ReactNode }) { return <label className={wide ? 'col-span-2' : ''}><span className="mb-1.5 block text-xs font-semibold" style={{ color: '#555' }}>{required && <span style={{ color: '#e63946' }}>* </span>}{label}</span><div className="flex min-h-10 items-center">{children}</div></label>; }
function EditCheck({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) { return <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} style={{ accentColor: '#1a6fbf' }} />{label}</label>; }
function EditToggle({ title, enabled, onChange, children }: { title: string; enabled: boolean; onChange: (value: boolean) => void; children: React.ReactNode }) { return <section className="mb-4 overflow-hidden rounded border bg-white" style={{ borderColor: enabled ? '#a9bfe7' : '#e0e0e0' }}><label className="flex cursor-pointer items-center gap-2 px-5 py-4" style={{ background: enabled ? '#f3f7ff' : '#fafafa' }}><input type="checkbox" checked={enabled} onChange={event => onChange(event.target.checked)} style={{ accentColor: '#1a6fbf' }} /><span style={{ fontSize: 15, fontWeight: 700, color: '#1a3055' }}>{title}</span><span className="ml-auto text-xs" style={{ color: enabled ? '#1a6fbf' : '#888' }}>{enabled ? '활성화됨' : '체크하여 활성화'}</span></label>{enabled && <div className="border-t p-5" style={{ borderColor: '#dfe7f5' }}>{children}</div>}</section>; }
function EditTransfer({ items, selected, onChange, left, right }: { items: string[]; selected: string[]; onChange: (items: string[]) => void; left: string; right: string }) {
  const [leftSearch, setLeftSearch] = useState('');
  const [rightSearch, setRightSearch] = useState('');
  const available = items.filter(item => !selected.includes(item));
  return <div className="grid grid-cols-[1fr_auto_1fr] gap-3"><EditList title={left} items={available.filter(item => item.toLowerCase().includes(leftSearch.toLowerCase()))} search={leftSearch} onSearch={setLeftSearch} onDoubleClick={item => onChange([...selected, item])} /><div className="flex flex-col justify-center gap-2"><button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => onChange(items)}>⇒</button><button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => available[0] && onChange([...selected, available[0]])}>→</button><button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => onChange(selected.slice(0, -1))}>←</button><button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => onChange([])}>⇐</button></div><EditList title={right} items={selected.filter(item => item.toLowerCase().includes(rightSearch.toLowerCase()))} search={rightSearch} onSearch={setRightSearch} onDoubleClick={item => onChange(selected.filter(value => value !== item))} /></div>;
}
function EditList({ title, items, search, onSearch, onDoubleClick }: { title: string; items: string[]; search: string; onSearch: (value: string) => void; onDoubleClick: (item: string) => void }) { return <div><div className="mb-1 text-xs" style={{ color: '#666' }}>{title} ({items.length})</div><input value={search} onChange={event => onSearch(event.target.value)} placeholder="협력업체/실사자 검색" className="mb-2 w-full rounded border px-3 py-2 text-xs" /><div className="h-48 overflow-auto rounded border p-1" style={{ borderColor: '#d7dbe1' }}>{items.map(item => <button type="button" key={item} onDoubleClick={() => onDoubleClick(item)} className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-blue-50">{item}</button>)}</div></div>; }
function EditDraft({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="mb-4 block last:mb-0"><span className="mb-1.5 flex items-center gap-2 text-xs font-semibold" style={{ color: '#555' }}>{label}<span className="rounded px-2 py-0.5 text-[10px]" style={{ background: '#fff4d8', color: '#986500' }}>자동 초안 · 고객사명 확인</span></span><textarea value={value} onChange={event => onChange(event.target.value)} className="w-full rounded border p-3 text-sm" style={{ borderColor: '#cfd3d9', minHeight: 82 }} /></label>; }
