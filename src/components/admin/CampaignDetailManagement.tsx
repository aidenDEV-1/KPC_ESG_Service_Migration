import { useState } from 'react';
import CampaignDatePicker from './CampaignDatePicker';
import {
  assignedCampaignAuditors,
  selectedCampaignPartners,
} from '../../data/campaignAssignments';

interface Props {
  onBack: () => void;
  campaignName?: string;
}

type Assignments = Record<number, string>;
type Notes = Record<number, string>;
type Dates = Record<number, string>;

const headers = [
  '순번',
  '회사명',
  '사용자ID',
  '사용자명',
  '제출완료',
  '*설문기간연장',
  '*실사자 배정',
  '*메모',
];

const initialAssignments: Assignments = {
  1: assignedCampaignAuditors[1],
  2: assignedCampaignAuditors[2],
  3: '',
};

export default function CampaignDetailManagement({ onBack, campaignName = '캠페인' }: Props) {
  const [assignments, setAssignments] = useState<Assignments>(initialAssignments);
  const [notes, setNotes] = useState<Notes>({});
  const [extensionDates, setExtensionDates] = useState<Dates>({});
  const [openExtension, setOpenExtension] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const updateAssignment = (partnerId: number, auditor: string) => {
    setAssignments((current) => ({ ...current, [partnerId]: auditor }));
    setSaved(false);
  };

  const updateNote = (partnerId: number, note: string) => {
    setNotes((current) => ({ ...current, [partnerId]: note }));
    setSaved(false);
  };

  return (
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 18 }}>캠페인세부관리</div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 34 }}>{campaignName}</div>

      <div className="mb-4 flex items-center gap-4">
        <div style={{ fontSize: 20, fontWeight: 700 }}>참여 협력사 리스트</div>
        <label className="inline-flex items-center gap-1" style={{ fontSize: 16 }}>
          개별 실사자 배정
          <input type="checkbox" checked readOnly style={{ accentColor: '#3d8fef' }} />
        </label>
      </div>

      <div style={{ fontSize: 14, lineHeight: 1.75, marginBottom: 26 }}>
        <div>1. 개별 실사자 배정과 파일 업로드는 현장실사 관리의 기본 기능으로 제공됩니다.</div>
        <div>2. 1업체에 1명의 실사자만 배정이 가능합니다. 실사자 배정이 선택되어진 경우 해당 업체에 배정된 실사자만 실사를 진행할 수 있습니다.</div>
        <div>3. 설문 재수정 선택 시 설문작성 기간이 종료되었어도 등록일 이후 3일까지만 수정할 수 있습니다.</div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          style={{
            border: '1px solid #9b9b9b',
            background: '#ffffff',
            color: '#666666',
            height: 42,
            padding: '0 14px',
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          이전페이지
        </button>
        <div className="flex items-center gap-3">
          {saved && <span style={{ color: '#156f3a', fontSize: 14 }}>저장되었습니다.</span>}
          <button
            type="button"
            onClick={() => setSaved(true)}
            style={{
              border: 0,
              background: '#356ed2',
              color: '#ffffff',
              width: 102,
              height: 46,
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            저장
          </button>
        </div>
      </div>

      <div className="overflow-x-auto" style={{ borderTop: '1px solid #cfcfcf' }}>
        <table style={{ width: '100%', minWidth: 1180, borderCollapse: 'collapse', background: '#ffffff' }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              {headers.map((header) => (
                <th
                  key={header}
                  style={{
                    borderRight: '1px solid #e4e4e4',
                    borderBottom: '1px solid #d8d8d8',
                    padding: '10px 8px',
                    fontSize: 13,
                    fontWeight: 700,
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedCampaignPartners.map((partner) => (
              <tr key={partner.id} style={{ height: 66 }}>
                <td style={cellStyle}>{partner.id}</td>
                <td style={cellStyle}>{partner.companyName}</td>
                <td style={cellStyle}>{partner.userId}</td>
                <td style={cellStyle}>{partner.userName}</td>
                <td style={{ ...cellStyle, color: '#003ee7', fontWeight: 600 }}>Y</td>
                <td style={cellStyle}>
                  {openExtension === partner.id ? (
                    <div className="flex items-center justify-center gap-1">
                      <CampaignDatePicker
                        value={extensionDates[partner.id] ?? ''}
                        onChange={value => {
                          setExtensionDates(current => ({ ...current, [partner.id]: value }));
                          setSaved(false);
                        }}
                        label={`${partner.companyName} 설문 연장일`}
                        width={130}
                      />
                      <button type="button" onClick={() => setOpenExtension(null)} className="rounded border px-2 py-2 text-xs" style={{ borderColor: '#ccc' }}>확인</button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setOpenExtension(partner.id)}
                      style={{ border: 0, borderRadius: 3, background: '#7b1644', color: '#ffffff', minWidth: 82, height: 38, padding: '0 10px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                    >
                      {extensionDates[partner.id] || '기간 연장'}
                    </button>
                  )}
                </td>
                <td style={{ ...cellStyle, minWidth: 220 }}>
                  <select
                    aria-label={`${partner.companyName} 실사자 배정`}
                    value={assignments[partner.id] ?? ''}
                    onChange={(event) => updateAssignment(partner.id, event.target.value)}
                    style={{
                      width: '100%',
                      height: 38,
                      border: '1px solid #cfcfcf',
                      background: '#ffffff',
                      padding: '0 10px',
                      fontSize: 14,
                      color: assignments[partner.id] ? '#333333' : '#777777',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">선택</option>
                    {assignedCampaignAuditors.map((auditor) => (
                      <option key={auditor} value={auditor}>{auditor}</option>
                    ))}
                  </select>
                </td>
                <td style={{ ...cellStyle, minWidth: 100 }}>
                  <input
                    aria-label={`${partner.companyName} 메모`}
                    value={notes[partner.id] ?? ''}
                    onChange={(event) => updateNote(partner.id, event.target.value)}
                    style={{
                      width: '100%',
                      height: 38,
                      border: '1px solid #d2d2d2',
                      padding: '0 8px',
                      fontSize: 14,
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cellStyle: React.CSSProperties = {
  borderRight: '1px solid #e4e4e4',
  borderBottom: '1px solid #d8d8d8',
  padding: '8px',
  fontSize: 14,
  textAlign: 'center',
  whiteSpace: 'nowrap',
};
