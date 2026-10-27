interface Props {
  onStart: () => void;
}

export default function SurveyIntro({ onStart }: Props) {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>TEST 2024 협력사 ESG 평가 (TEST)</div>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>2024-09-23 ~ 2026-11-30</div>

      <button
        onClick={onStart}
        className="flex items-center gap-2 px-5 py-3 rounded-full text-white font-medium mb-12"
        style={{ background: '#e63946', fontSize: 14 }}
      >
        ▶ 진단 시작하기
      </button>

      {/* Consent section */}
      <div className="border rounded bg-white" style={{ borderColor: '#e0e0e0' }}>
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: '#e8e8e8' }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>협력사 ESG 진단 및 자료 제공 동의서</span>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" />
            전체 약관 및 이용 제공에 동의합니다.
          </label>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Consent 1 */}
          <div>
            <label className="flex items-center gap-2 mb-3">
              <input type="checkbox" defaultChecked style={{ accentColor: '#e63946' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#e63946' }}>
                아래 '개인정보 수집 및 이용 동의서'의 전체 약관 및 이용 제공에 동의합니다.
              </span>
            </label>
            <div className="border rounded p-4 overflow-y-auto text-xs text-gray-600" style={{ maxHeight: 140, borderColor: '#ddd' }}>
              <p>'개인정보보호법' 등의 관련 법률에 따라 당사가 아래의 개인정보를 수집·이용하는 것에 동의합니다.</p>
              <p>1. 개인정보 수집·이용자 : 한국생산성본부</p>
              <p>2. 수집·이용 목적 :</p>
              <p>- 본인 및 소속회사 식별 확인</p>
              <p>- ESG 평가 참여 요청</p>
              <p>3. 개인정보수집항목: 성명, 연락처, E-MAIL</p>
              <p>4. 보유 및 이용 기간 :</p>
              <p>-개인정보 수집 및 이용 목적 달성 시까지</p>
            </div>
          </div>

          {/* Consent 2 */}
          <div>
            <label className="flex items-center gap-2 mb-3">
              <input type="checkbox" defaultChecked style={{ accentColor: '#e63946' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#e63946' }}>
                아래 '협력사 ESG 진단 및 자료 제공 동의서'의 전체 약관 및 이용 제공에 동의합니다.
              </span>
            </label>
            <div className="border rounded p-4 overflow-y-auto text-xs text-gray-600" style={{ maxHeight: 140, borderColor: '#ddd' }}>
              <p>TEST 고객사와 당사(이하 "협력사")은(는) 양자간에 체결한 제조위탁계약을 기반으로 TEST 고객사가 협력사의 ESG 컨설팅 및 평가(이하 "컨설팅")를 하는 데에 있어, 협력사는 이와 관련한 업무를 제3자가 TEST 고객사로부터 위임 받아 수행하는데 동의하고 이를 위한 자료 제공에 대하여 다음과 같이 합의한다.</p>
              <p style={{ marginTop: 8 }}>제1조 지속가능경영 진단 동의</p>
              <p>1) TEST 고객사는 협력사의 컨설팅을 위하여 제3자에 이와 관련한 업무를 위탁하고, 협력사는 컨설팅을 받는 데에 동의한다.</p>
              <p>진단 항목: 인권, 안전, 환경, 윤리 항목</p>
              <p style={{ marginTop: 8 }}>제2조 자료의 활용</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
