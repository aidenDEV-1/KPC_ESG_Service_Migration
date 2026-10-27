import { useState } from 'react';

type CompanyInfo = {
  companyName: string;
  representative: string;
  phone: string;
  mainProduct: string;
  address: string;
};

const otherFields = [
  ['airEmission', '대기배출 시설', ['선택', '1종', '2종', '3종', '4종', '5종', '해당없음']],
  ['wastewater', '폐수처리 시설', ['선택', '1종', '2종', '3종', '4종', '5종', '해당없음']],
  ['hazardousMaterial', '위험물 시설', ['선택', '보유', '미보유']],
  ['designatedWaste', '지정폐기물', ['선택', '예', '아니오']],
  ['emissionsTrading', '배출권 거래제', ['선택', '해당', '해당없음']],
  ['inHouseContractor', '사내 도급업체', ['선택', '보유', '미보유']],
] as const;

export default function PartProfileSetup({ onComplete, onLogout }: { onComplete: () => void; onLogout: () => void }) {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [company, setCompany] = useState<CompanyInfo>({ companyName: 'TEST COMPANY 01', representative: '', phone: '', mainProduct: '', address: '' });
  const [other, setOther] = useState<Record<string, string>>(Object.fromEntries(otherFields.map(([key]) => [key, '선택'])));
  const [error, setError] = useState('');

  const submit = () => {
    if (password.length < 8 || password !== passwordConfirm) {
      setError('8자 이상의 동일한 비밀번호를 입력해 주세요.');
      return;
    }
    if (Object.values(company).some(value => !value.trim())) {
      setError('기업정보의 필수 항목을 모두 입력해 주세요.');
      return;
    }
    localStorage.setItem('part-company-info', JSON.stringify(company));
    localStorage.setItem('part-other-info', JSON.stringify(other));
    localStorage.setItem('part-profile-complete', 'true');
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="flex h-14 items-center border-b border-gray-200 bg-white px-8">
        <span className="text-lg font-black italic text-[#e63946]">kpc</span>
        <span className="ml-2 text-sm font-bold text-[#1a3055]">Supply Chain ESG Assessment</span>
        <button type="button" onClick={onLogout} className="ml-auto rounded-full bg-gray-500 px-4 py-1.5 text-xs text-white">로그아웃</button>
      </div>
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-7">
          <div className="text-2xl font-bold text-gray-900">최초 로그인 정보 등록</div>
          <p className="mt-2 text-sm text-gray-500">안전한 이용을 위해 비밀번호를 변경하고 기업 기본정보를 입력해 주세요.</p>
        </div>
        <section className="mb-5 rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-5 text-base font-bold text-gray-800">비밀번호 변경</div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="새 비밀번호"><input type="password" value={password} onChange={event => setPassword(event.target.value)} className="h-10 w-full rounded border border-gray-300 px-3 text-sm" placeholder="8자 이상 입력" /></Field>
            <Field label="새 비밀번호 확인"><input type="password" value={passwordConfirm} onChange={event => setPasswordConfirm(event.target.value)} className="h-10 w-full rounded border border-gray-300 px-3 text-sm" placeholder="비밀번호 재입력" /></Field>
          </div>
        </section>
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-5 text-base font-bold text-gray-800">기업정보</div>
            <div className="space-y-4">
              {([['companyName', '기업명'], ['representative', '대표자'], ['phone', '전화번호'], ['mainProduct', '주요제품'], ['address', '본사 주소']] as Array<[keyof CompanyInfo, string]>).map(([key, label]) => (
                <Field key={key} label={label}><input value={company[key]} onChange={event => setCompany(current => ({ ...current, [key]: event.target.value }))} className="h-10 w-full rounded border border-gray-300 px-3 text-sm" /></Field>
              ))}
            </div>
          </section>
          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-5 text-base font-bold text-gray-800">기타정보</div>
            <div className="space-y-4">
              {otherFields.map(([key, label, options]) => (
                <Field key={key} label={label}><select value={other[key]} onChange={event => setOther(current => ({ ...current, [key]: event.target.value }))} className="h-10 w-full rounded border border-gray-300 bg-white px-3 text-sm">{options.map(option => <option key={option}>{option}</option>)}</select></Field>
              ))}
            </div>
          </section>
        </div>
        <div className="mt-6 flex items-center justify-end gap-4">
          {error && <span className="text-sm font-medium text-red-600">{error}</span>}
          <button type="button" onClick={submit} className="rounded bg-[#e63946] px-8 py-3 text-sm font-bold text-white">등록 완료</button>
        </div>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-gray-600">{label} <span className="text-[#e63946]">*</span></span>{children}</label>;
}
