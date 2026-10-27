import { useState } from 'react';

interface CompanyInfo {
  companyName: string;
  representative: string;
  phone: string;
  mainProduct: string;
  address: string;
}

const defaultCompanyInfo: CompanyInfo = {
  companyName: 'TEST COMPANY 01',
  representative: '',
  phone: '',
  mainProduct: '',
  address: '',
};

const companyFields: Array<{
  key: keyof CompanyInfo;
  label: string;
  placeholder: string;
  type?: string;
}> = [
  { key: 'companyName', label: '기업명', placeholder: '기업명을 입력하세요' },
  { key: 'representative', label: '대표자', placeholder: '대표자명을 입력하세요' },
  { key: 'phone', label: '전화번호', placeholder: '전화번호를 입력하세요', type: 'tel' },
  { key: 'mainProduct', label: '주요제품', placeholder: '주요제품을 입력하세요' },
  { key: 'address', label: '본사 주소', placeholder: '본사 주소를 입력하세요' },
];

const customerScores = {
  '삼성바이오로직스': [
    { campaign: '2024 협력사 ESG 평가', score: 64, date: '2024.11' },
    { campaign: '2025 공급망 ESG 평가', score: 72, date: '2025.10' },
    { campaign: '2026 협력사 ESG 평가', score: 81, date: '2026.09' },
  ],
  'LG생활건강': [
    { campaign: '2023 협력회사 ESG 평가', score: 58, date: '2024.01' },
    { campaign: '2024 동반성장 ESG 평가', score: 67, date: '2024.12' },
    { campaign: '2025 협력회사 ESG 평가', score: 75, date: '2025.12' },
  ],
  '한국생산성본부': [
    { campaign: '2024 ESG 공급망 지원사업', score: 61, date: '2024.08' },
    { campaign: '2025 ESG 공급망 지원사업', score: 70, date: '2025.07' },
    { campaign: '2026 ESG 공급망 지원사업', score: 78, date: '2026.06' },
  ],
};

const otherInfoFields = [
  { key: 'airEmission', label: '대기배출 시설', options: ['선택됨', '1종', '2종', '3종', '4종', '5종', '해당없음'] },
  { key: 'wastewater', label: '폐수처리 시설', options: ['선택됨', '1종', '2종', '3종', '4종', '5종', '해당없음'] },
  { key: 'hazardousMaterial', label: '위험물 시설', options: ['선택됨', '보유', '미보유'] },
  { key: 'designatedWaste', label: '지정폐기물', options: ['선택됨', '예', '아니오'] },
  { key: 'emissionsTrading', label: '배출권 거래제', options: ['선택됨', '해당', '해당없음'] },
  { key: 'inHouseContractor', label: '사내 도급업체', options: ['선택됨', '보유', '미보유'] },
] as const;

type OtherInfoKey = typeof otherInfoFields[number]['key'];
type OtherInfo = Record<OtherInfoKey, string>;

const defaultOtherInfo: OtherInfo = {
  airEmission: '선택됨',
  wastewater: '선택됨',
  hazardousMaterial: '선택됨',
  designatedWaste: '선택됨',
  emissionsTrading: '선택됨',
  inHouseContractor: '선택됨',
};

export default function Dashboard() {
  const showConsistencyReview = localStorage.getItem('consistency-review-enabled') === 'true';
  const [selectedCustomer, setSelectedCustomer] = useState<keyof typeof customerScores>('삼성바이오로직스');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => {
    const saved = localStorage.getItem('part-company-info');
    if (!saved) return defaultCompanyInfo;
    try {
      return { ...defaultCompanyInfo, ...JSON.parse(saved) };
    } catch {
      return defaultCompanyInfo;
    }
  });
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [companyInfoSaved, setCompanyInfoSaved] = useState(false);
  const [otherInfo, setOtherInfo] = useState<OtherInfo>(() => {
    const saved = localStorage.getItem('part-other-info');
    if (!saved) return defaultOtherInfo;
    try {
      return { ...defaultOtherInfo, ...JSON.parse(saved) };
    } catch {
      return defaultOtherInfo;
    }
  });
  const [otherInfoSaved, setOtherInfoSaved] = useState(false);

  const updateCompanyInfo = (key: keyof CompanyInfo, value: string) => {
    setCompanyInfo((current) => ({ ...current, [key]: value }));
    setCompanyInfoSaved(false);
  };

  const handleCompanyAction = () => {
    if (!isEditingCompany) {
      setIsEditingCompany(true);
      setCompanyInfoSaved(false);
      return;
    }

    localStorage.setItem('part-company-info', JSON.stringify(companyInfo));
    setIsEditingCompany(false);
    setCompanyInfoSaved(true);
  };

  const updateOtherInfo = (key: OtherInfoKey, value: string) => {
    setOtherInfo((current) => ({ ...current, [key]: value }));
    setOtherInfoSaved(false);
  };

  const saveOtherInfo = () => {
    localStorage.setItem('part-other-info', JSON.stringify(otherInfo));
    setOtherInfoSaved(true);
  };

  return (
    <div className="service-page">
      <div className="bg-white border rounded p-6 mb-6" style={{ borderColor: '#e0e0e0' }}>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>ESG Score</div>
            <div className="mt-1 text-xs text-gray-500">고객사별 종료 캠페인의 점수 추이입니다.</div>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
            고객사
            <select value={selectedCustomer} onChange={event => setSelectedCustomer(event.target.value as keyof typeof customerScores)} className="h-9 rounded border border-gray-300 bg-white px-3 text-xs">
              {Object.keys(customerScores).map(customer => <option key={customer}>{customer}</option>)}
            </select>
          </label>
        </div>
        <div className="grid items-center gap-6 lg:grid-cols-[180px_1fr]">
          <div className="rounded-lg bg-[#f7f8fa] p-5 text-center">
            <div className="text-xs text-gray-500">최근 ESG Score</div>
            <div className="mt-2 text-4xl font-black text-[#e63946]">{customerScores[selectedCustomer].at(-1)?.score}</div>
            <div className="mt-1 text-xs font-semibold text-gray-500">100점 만점</div>
            {showConsistencyReview && <div className="mt-4 border-t border-gray-200 pt-3"><div className="text-[10px] font-semibold text-blue-600">정합성 검토 후</div><div className="mt-1 text-2xl font-black text-blue-700">{(customerScores[selectedCustomer].at(-1)?.score ?? 0) - 3}<span className="ml-1 text-xs font-semibold">점</span></div><div className="mt-1 text-[10px] text-gray-400">자가진단과 함께 표시</div></div>}
          </div>
          <ScoreTrend values={customerScores[selectedCustomer]} showConsistencyReview={showConsistencyReview} />
        </div>
      </div>

      {/* Two column info */}
      <div className="grid grid-cols-2 gap-6">
        {/* 기업정보 */}
        <div className="bg-white border rounded p-5" style={{ borderColor: '#e0e0e0' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span style={{ fontSize: 14, fontWeight: 700 }}>기업정보</span>
              <span className="text-blue-600 text-xs cursor-pointer hover:underline ml-2">[ 메뉴얼 다운로드 ]</span>
            </div>
            <div className="flex items-center gap-2">
              {companyInfoSaved && <span style={{ fontSize: 11, color: '#167342' }}>저장되었습니다.</span>}
              <button
                type="button"
                onClick={handleCompanyAction}
                className="border rounded px-3 py-1 text-xs"
                style={{
                  borderColor: isEditingCompany ? '#167d8d' : '#ccc',
                  background: isEditingCompany ? '#167d8d' : '#fff',
                  color: isEditingCompany ? '#fff' : '#555',
                }}
              >
                {isEditingCompany ? '저장' : '수정'}
              </button>
            </div>
          </div>
          {companyFields.map((field) => (
            <div key={field.key} className="flex items-center border-b py-2" style={{ borderColor: '#f0f0f0' }}>
              <label htmlFor={`company-${field.key}`} className="text-xs font-medium w-24 flex-shrink-0" style={{ color: '#555' }}>
                {field.label}
              </label>
              <input
                id={`company-${field.key}`}
                type={field.type ?? 'text'}
                value={companyInfo[field.key]}
                readOnly={!isEditingCompany}
                onChange={(event) => updateCompanyInfo(field.key, event.target.value)}
                placeholder={isEditingCompany ? field.placeholder : ''}
                className="flex-1 border rounded px-3 py-1.5 text-xs ml-2"
                style={{
                  borderColor: isEditingCompany ? '#9ebec3' : '#e0e0e0',
                  background: isEditingCompany ? '#fff' : '#fafafa',
                  minHeight: 28,
                  outlineColor: '#167d8d',
                  cursor: isEditingCompany ? 'text' : 'default',
                }}
              />
            </div>
          ))}
        </div>

        {/* 기타정보 */}
        <div className="bg-white border rounded p-5" style={{ borderColor: '#e0e0e0' }}>
          <div className="flex items-center justify-between mb-4">
            <span style={{ fontSize: 14, fontWeight: 700 }}>기타정보</span>
            <div className="flex items-center gap-2">
              {otherInfoSaved && <span style={{ fontSize: 11, color: '#167342' }}>저장되었습니다.</span>}
              <button
                type="button"
                onClick={saveOtherInfo}
                className="border rounded px-3 py-1 text-xs"
                style={{ borderColor: '#ccc', color: '#555' }}
              >
                수정
              </button>
            </div>
          </div>
          {otherInfoFields.map((field) => (
            <div key={field.key} className="flex items-center border-b py-2" style={{ borderColor: '#f0f0f0' }}>
              <label htmlFor={`other-${field.key}`} className="text-xs font-medium w-28 flex-shrink-0" style={{ color: '#555' }}>
                {field.label}
              </label>
              <select
                id={`other-${field.key}`}
                value={otherInfo[field.key]}
                onChange={(event) => updateOtherInfo(field.key, event.target.value)}
                className="flex-1 border rounded px-2 py-1.5 text-xs ml-2"
                style={{ borderColor: '#e0e0e0' }}
              >
                {field.options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          ))}

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <span style={{ fontWeight: 900, fontSize: 16, color: '#e63946', fontStyle: 'italic' }}>kpc</span>
            <div className="w-5 h-5 rounded-full border flex items-center justify-center" style={{ borderColor: '#999' }}>
              <span style={{ fontSize: 7, color: '#999' }}>◎</span>
            </div>
            <div style={{ fontSize: 10, lineHeight: 1.2, color: '#333' }}>
              <div style={{ fontWeight: 700 }}>Supply Chain</div>
              <div style={{ fontWeight: 700 }}>ESG Assessment</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreTrend({ values, showConsistencyReview }: { values: Array<{ campaign: string; score: number; date: string }>; showConsistencyReview: boolean }) {
  const points = values.map((item, index) => `${70 + index * 250},${155 - item.score * 1.25}`).join(' ');
  const reviewedPoints = values.map((item, index) => `${70 + index * 250},${155 - (item.score - 3) * 1.25}`).join(' ');
  return (
    <div className="overflow-x-auto">
      {showConsistencyReview && <div className="mb-1 flex justify-end gap-4 text-[10px] font-semibold"><span className="text-red-600">● 자가진단</span><span className="text-blue-700">● 정합성 검토 후</span></div>}
      <svg viewBox="0 0 640 190" className="min-w-[560px] w-full" role="img" aria-label="ESG 점수 추이 그래프">
        {[30, 70, 110, 150].map(y => <line key={y} x1="45" y1={y} x2="610" y2={y} stroke="#edf0f3" strokeWidth="1" />)}
        <polyline points={points} fill="none" stroke="#e63946" strokeWidth="3" strokeLinejoin="round" />
        {showConsistencyReview && <polyline points={reviewedPoints} fill="none" stroke="#1e5fae" strokeWidth="3" strokeLinejoin="round" />}
        {values.map((item, index) => {
          const x = 70 + index * 250;
          const y = 155 - item.score * 1.25;
          const reviewedY = 155 - (item.score - 3) * 1.25;
          return <g key={item.campaign}><circle cx={x} cy={y} r="6" fill="#fff" stroke="#e63946" strokeWidth="3" /><text x={x} y={y - 14} textAnchor="middle" fontSize="12" fontWeight="700" fill="#333">{item.score}점</text>{showConsistencyReview && <><circle cx={x} cy={reviewedY} r="5" fill="#fff" stroke="#1e5fae" strokeWidth="3" /><text x={x} y={reviewedY + 17} textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e5fae">{item.score - 3}점</text></>}<text x={x} y="174" textAnchor="middle" fontSize="10" fill="#777">{item.date}</text></g>;
        })}
      </svg>
      <div className="grid grid-cols-3 text-center text-[11px] text-gray-500">{values.map(value => <span key={value.campaign} className="truncate px-2" title={value.campaign}>{value.campaign}</span>)}</div>
    </div>
  );
}
