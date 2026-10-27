import { useEffect, useMemo, useState } from 'react';
import CampaignDatePicker from './CampaignDatePicker';

interface Props {
  onBack: () => void;
  onSave: (campaign: NewCampaign) => void;
}

export interface NewCampaign {
  name: string;
  provider: string;
  startDate: string;
  endDate: string;
  taskStart: string;
  taskEnd: string;
  status: string;
  active: string;
  contact: string;
  partners: string[];
  auditors: string[];
  industryCode?: number;
  consistencyReviewVisible?: boolean;
}

const clients = ['선택', 'LG', 'SK', '농심', '롯데', '삼성', '한화', '현대'];
const partnerCompanies = ['에코파트너스', '그린테크', '한빛산업', '미래소재', '세림정공', '대성에너지', '우진테크', '신화물류', '동아케미칼', '태광솔루션', '하나모빌리티', '코리아패키징', '제일이앤씨', '삼우전자', '한국정밀', '유진바이오', '선진플랜트', '다온시스템', '우리산업', '청호테크', '새론금속', '인성로지스', '현대부품', '중앙기공'];
const partners = Array.from({ length: 48 }, (_, index) => `${index + 1}] ㈜${partnerCompanies[index % partnerCompanies.length]} ${index >= partnerCompanies.length ? index + 1 : ''} (${String(101 + index)}-${String(10 + index % 80).padStart(2, '0')}-${String(10000 + index * 137).slice(-5)})`);
const auditors = Array.from({ length: 32 }, (_, index) => `${index + 1}] ${partnerCompanies[index % partnerCompanies.length]} 컨설팅 실사자 ${String(index + 1).padStart(2, '0')} (auditor${index + 1}@example.com)`);

const getCampaignStatus = (start: string, end: string) => {
  if (!start || !end) return '준비중';
  const today = new Date().toISOString().slice(0, 10);
  if (today < start) return '준비중';
  if (today > end) return '종료';
  return '진행중';
};

const makeDrafts = (client: string) => {
  const customer = client === '선택' ? '[고객사명]' : client;
  return {
    description: `${customer}는 협력사의 지속가능경영 수준을 진단하고 함께 개선하기 위해 본 ESG 평가 캠페인을 운영합니다. 설문 기간 내 응답과 근거자료 제출을 완료해 주세요.`,
    privacy: `${customer}는 ESG 평가 운영을 위해 담당자 정보와 설문 응답 데이터를 수집·이용합니다. 수집된 정보는 평가 및 개선 지원 목적에 한해 이용되며 관련 법령에 따라 안전하게 관리됩니다.`,
    thirdParty: `${customer}는 원활한 평가와 현장실사 진행을 위해 필요한 범위에서 평가기관 및 지정 실사자에게 정보를 제공합니다. 제공 목적 달성 후 해당 정보는 지체 없이 파기됩니다.`,
  };
};

export default function CampaignRegistrationForm({ onBack, onSave }: Props) {
  const [campaignName, setCampaignName] = useState('');
  const [client, setClient] = useState('선택');
  const [surveyStart, setSurveyStart] = useState('');
  const [surveyEnd, setSurveyEnd] = useState('');
  const [active, setActive] = useState('활성');
  const [industryCode, setIndustryCode] = useState(1);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [selectedAuditors, setSelectedAuditors] = useState<string[]>([]);
  const [improvementEnabled, setImprovementEnabled] = useState(false);
  const [auditEnabled, setAuditEnabled] = useState(false);
  const [taskStart, setTaskStart] = useState('');
  const [taskEnd, setTaskEnd] = useState('');
  const [auditStart, setAuditStart] = useState('');
  const [auditEnd, setAuditEnd] = useState('');
  const [improvementDownload, setImprovementDownload] = useState(true);
  const [resultReportAllowed, setResultReportAllowed] = useState(true);
  const [clientEvidenceAllowed, setClientEvidenceAllowed] = useState(true);
  const [clientReportAllowed, setClientReportAllowed] = useState(true);
  const [consistencyReviewVisible, setConsistencyReviewVisible] = useState(false);
  const [description, setDescription] = useState(makeDrafts('선택').description);
  const [privacy, setPrivacy] = useState(makeDrafts('선택').privacy);
  const [thirdParty, setThirdParty] = useState(makeDrafts('선택').thirdParty);
  const [validationMessage, setValidationMessage] = useState('');

  const status = useMemo(() => getCampaignStatus(surveyStart, surveyEnd), [surveyEnd, surveyStart]);

  useEffect(() => {
    const drafts = makeDrafts(client);
    setDescription(drafts.description);
    setPrivacy(drafts.privacy);
    setThirdParty(drafts.thirdParty);
  }, [client]);

  const submit = () => {
    const missing = [
      !campaignName.trim() && '캠페인명',
      client === '선택' && '고객사',
      !surveyStart && '설문 시작일',
      !surveyEnd && '설문 종료일',
      improvementEnabled && !taskStart && '개선과제 시작일',
      improvementEnabled && !taskEnd && '개선과제 종료일',
      auditEnabled && !auditStart && '현장실사 시작일',
      auditEnabled && !auditEnd && '현장실사 종료일',
    ].filter(Boolean);
    if (missing.length) {
      setValidationMessage(`필수 항목을 입력해 주세요: ${missing.join(', ')}`);
      return;
    }
    localStorage.setItem('consistency-review-enabled', String(consistencyReviewVisible));
    localStorage.setItem(`campaign-consistency-review:${campaignName.trim()}`, String(consistencyReviewVisible));
    onSave({
      name: campaignName.trim(),
      provider: client,
      startDate: surveyStart,
      endDate: surveyEnd,
      taskStart: improvementEnabled ? taskStart : '',
      taskEnd: improvementEnabled ? taskEnd : '',
      status,
      active: active === '활성' ? 'Y' : 'N',
      contact: '',
      partners: selectedPartners,
      auditors: auditEnabled ? selectedAuditors : [],
      industryCode,
      consistencyReviewVisible,
    });
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a3055' }}>캠페인 등록</h2>
          <div className="mt-1 text-xs" style={{ color: '#777' }}>기본 정보와 선택 관리 기능을 설정합니다.</div>
        </div>
        <div className="flex gap-2">
          <button onClick={onBack} className="rounded border px-4 py-2 text-sm" style={{ borderColor: '#ccc', color: '#555' }}>목록</button>
          <button onClick={submit} className="rounded px-5 py-2 text-sm font-semibold text-white" style={{ background: '#e63946' }}>등록</button>
        </div>
      </div>

      {validationMessage && <div role="alert" className="mb-3 rounded border px-4 py-2 text-sm" style={{ borderColor: '#f4b4b9', background: '#fff5f5', color: '#c62828' }}>{validationMessage}</div>}

      <Section title="기본 설정">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <Field label="캠페인명" required wide><input value={campaignName} onChange={event => setCampaignName(event.target.value)} className="w-full rounded border px-3 text-sm" style={inputStyle} /></Field>
          <Field label="고객사" required>
            <select value={client} onChange={event => setClient(event.target.value)} className="w-full rounded border px-3 text-sm" style={inputStyle}>{clients.map(item => <option key={item}>{item}</option>)}</select>
          </Field>
          <Field label="업종">
            <select value={industryCode} onChange={event => setIndustryCode(Number(event.target.value))} className="w-full rounded border px-3 text-sm" style={inputStyle}>
              <option value={1}>제조</option><option value={2}>원자재</option><option value={3}>유통</option><option value={4}>식품</option>
            </select>
          </Field>
          <Field label="설문 기간" required>
            <div className="flex items-center gap-2"><CampaignDatePicker value={surveyStart} onChange={setSurveyStart} label="설문 시작일" /><span>~</span><CampaignDatePicker value={surveyEnd} min={surveyStart} onChange={setSurveyEnd} label="설문 종료일" /></div>
          </Field>
          <Field label="캠페인 상태">
            <StatusBadge status={status} />
            <span className="ml-2 text-xs" style={{ color: '#777' }}>설문 기간에 따라 자동 변경</span>
          </Field>
          <Field label="활성여부">
            <select value={active} onChange={event => setActive(event.target.value)} className="rounded border px-3 text-sm" style={inputStyle}><option>활성</option><option>비활성</option></select>
          </Field>
        </div>
        <div className="mt-5 border-t pt-4" style={{ borderColor: '#eceff3' }}>
          <div className="mb-3 text-sm font-semibold">캠페인 옵션</div>
          <div className="flex flex-wrap gap-x-7 gap-y-3">
            <Check checked={resultReportAllowed} onChange={setResultReportAllowed} label="결과보고서 배포 허용" description="협력사가 결과보고서를 다운로드할 수 있습니다." />
            <Check checked={clientEvidenceAllowed} onChange={setClientEvidenceAllowed} label="고객사 근거자료 다운로드 허용" />
            <Check checked={clientReportAllowed} onChange={setClientReportAllowed} label="고객사 결과보고서 다운로드 허용" />
            <Check checked={consistencyReviewVisible} onChange={setConsistencyReviewVisible} label="정합성 검토 결과 반영" description="결과보고서와 협력사 대시보드에 정합성 검토 결과를 함께 표시합니다." />
          </div>
          <div className="mt-3 rounded px-3 py-2 text-xs" style={{ background: '#f0f5ff', color: '#315d9b' }}>실사자 파일 업로드, 개별 실사자 배정, 진단·실사 동시 진행은 기본 허용됩니다.</div>
        </div>
      </Section>

      <Section title="협력사 설정">
        <TransferList items={partners} selected={selectedPartners} onChange={setSelectedPartners} leftTitle="전체 협력사" rightTitle="선택한 협력사" />
      </Section>

      <ToggleSection title="개선과제 관리" enabled={improvementEnabled} onChange={setImprovementEnabled}>
        <div className="grid grid-cols-2 gap-6">
          <Field label="개선과제 기간" required>
            <div className="flex items-center gap-2"><CampaignDatePicker value={taskStart} onChange={setTaskStart} label="개선과제 시작일" /><span>~</span><CampaignDatePicker value={taskEnd} min={taskStart} onChange={setTaskEnd} label="개선과제 종료일" /></div>
          </Field>
          <Field label="관리 옵션"><Check checked={improvementDownload} onChange={setImprovementDownload} label="개선과제 다운로드 허용" /></Field>
        </div>
      </ToggleSection>

      <ToggleSection title="현장실사 관리" enabled={auditEnabled} onChange={setAuditEnabled}>
        <div className="mb-5 flex items-center justify-between">
          <Field label="현장실사 기간" required>
            <div className="flex items-center gap-2"><CampaignDatePicker value={auditStart} onChange={setAuditStart} label="현장실사 시작일" /><span>~</span><CampaignDatePicker value={auditEnd} min={auditStart} onChange={setAuditEnd} label="현장실사 종료일" /></div>
          </Field>
          <button disabled className="rounded px-4 py-2 text-sm font-semibold text-white opacity-50" style={{ background: '#1a3055' }}>등록 후 캠페인 세부관리</button>
        </div>
        <div className="text-sm font-semibold mb-2">실사자 설정</div>
        <TransferList items={auditors} selected={selectedAuditors} onChange={setSelectedAuditors} leftTitle="전체 실사자" rightTitle="배정 실사자" />
      </ToggleSection>

      <Section title="안내문 초안">
        <DraftField label="캠페인 설명" value={description} onChange={setDescription} />
        <DraftField label="개인정보 처리방침" value={privacy} onChange={setPrivacy} />
        <DraftField label="제3자 정보동의" value={thirdParty} onChange={setThirdParty} />
      </Section>
    </div>
  );
}

const inputStyle = { height: 38, borderColor: '#cfd3d9' };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mb-4 rounded border bg-white p-5" style={{ borderColor: '#e0e0e0' }}><h3 className="mb-4" style={{ fontSize: 15, fontWeight: 700, color: '#1a3055' }}>{title}</h3>{children}</section>;
}

function ToggleSection({ title, enabled, onChange, children }: { title: string; enabled: boolean; onChange: (value: boolean) => void; children: React.ReactNode }) {
  return (
    <section className="mb-4 overflow-hidden rounded border bg-white" style={{ borderColor: enabled ? '#a9bfe7' : '#e0e0e0' }}>
      <label className="flex cursor-pointer items-center gap-2 px-5 py-4" style={{ background: enabled ? '#f3f7ff' : '#fafafa' }}>
        <input type="checkbox" checked={enabled} onChange={event => onChange(event.target.checked)} style={{ accentColor: '#1a6fbf' }} />
        <span style={{ fontSize: 15, fontWeight: 700, color: '#1a3055' }}>{title}</span>
        <span className="ml-auto text-xs" style={{ color: enabled ? '#1a6fbf' : '#888' }}>{enabled ? '활성화됨' : '체크하여 활성화'}</span>
      </label>
      {enabled && <div className="border-t p-5" style={{ borderColor: '#dfe7f5' }}>{children}</div>}
    </section>
  );
}

function Field({ label, required, wide, children }: { label: string; required?: boolean; wide?: boolean; children: React.ReactNode }) {
  return <label className={wide ? 'col-span-2' : ''}><span className="mb-1.5 block text-xs font-semibold" style={{ color: '#555' }}>{required && <span style={{ color: '#e63946' }}>* </span>}{label}</span><div className="flex min-h-10 items-center">{children}</div></label>;
}

function Check({ checked, onChange, label, description }: { checked: boolean; onChange: (value: boolean) => void; label: string; description?: string }) {
  return <label className="flex cursor-pointer items-start gap-2 text-sm"><input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} className="mt-1" style={{ accentColor: '#1a6fbf' }} /><span>{label}{description && <span className="mt-0.5 block text-xs" style={{ color: '#888' }}>{description}</span>}</span></label>;
}

function StatusBadge({ status }: { status: string }) {
  return <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: status === '진행중' ? '#eaf3ff' : status === '준비중' ? '#fff5da' : '#eef0f2', color: status === '진행중' ? '#1767bd' : status === '준비중' ? '#9a6700' : '#666' }}>{status}</span>;
}

function TransferList({ items, selected, onChange, leftTitle, rightTitle }: { items: string[]; selected: string[]; onChange: (items: string[]) => void; leftTitle: string; rightTitle: string }) {
  const [leftSearch, setLeftSearch] = useState('');
  const [rightSearch, setRightSearch] = useState('');
  const available = items.filter(item => !selected.includes(item));
  const filteredAvailable = available.filter(item => item.toLowerCase().includes(leftSearch.toLowerCase()));
  const filteredSelected = selected.filter(item => item.toLowerCase().includes(rightSearch.toLowerCase()));
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-3">
      <div><div className="mb-1 text-xs" style={{ color: '#666' }}>{leftTitle} ({available.length})</div><input value={leftSearch} onChange={event => setLeftSearch(event.target.value)} placeholder="협력업체/실사자 검색" className="mb-2 w-full rounded border px-3 py-2 text-xs" /><div className="h-48 overflow-auto rounded border p-1" style={{ borderColor: '#d7dbe1' }}>{filteredAvailable.map(item => <button type="button" key={item} onDoubleClick={() => onChange([...selected, item])} className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-blue-50">{item}</button>)}</div></div>
      <div className="flex flex-col justify-center gap-2"><button type="button" onClick={() => onChange(items)} className="rounded border px-2 py-1 text-xs">⇒</button><button type="button" onClick={() => available[0] && onChange([...selected, available[0]])} className="rounded border px-2 py-1 text-xs">→</button><button type="button" onClick={() => onChange(selected.slice(0, -1))} className="rounded border px-2 py-1 text-xs">←</button><button type="button" onClick={() => onChange([])} className="rounded border px-2 py-1 text-xs">⇐</button></div>
      <div><div className="mb-1 text-xs" style={{ color: '#666' }}>{rightTitle} ({selected.length})</div><input value={rightSearch} onChange={event => setRightSearch(event.target.value)} placeholder="선택 목록 검색" className="mb-2 w-full rounded border px-3 py-2 text-xs" /><div className="h-48 overflow-auto rounded border p-1" style={{ borderColor: '#d7dbe1' }}>{filteredSelected.map(item => <button type="button" key={item} onDoubleClick={() => onChange(selected.filter(value => value !== item))} className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-red-50">{item}</button>)}</div></div>
    </div>
  );
}

function DraftField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="mb-4 block last:mb-0"><span className="mb-1.5 flex items-center gap-2 text-xs font-semibold" style={{ color: '#555' }}>{label}<span className="rounded px-2 py-0.5 text-[10px]" style={{ background: '#fff4d8', color: '#986500' }}>자동 초안 · 고객사명 확인</span></span><textarea value={value} onChange={event => onChange(event.target.value)} className="w-full rounded border p-3 text-sm" style={{ borderColor: '#cfd3d9', minHeight: 82, resize: 'vertical' }} /></label>;
}
