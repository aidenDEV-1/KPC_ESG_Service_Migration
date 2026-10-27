const codes = [
  { code: 'CC_CAMPAIGN_STATE_CODE', name: '캠페인 상태 코드', used: 'Y' },
  { code: 'CC_CORP_TY_CODE', name: '업종코드', used: 'Y' },
  { code: 'CC_INDU_TY_CODE', name: '산업분류코드', used: 'Y' },
  { code: 'CC_LANG_CODE', name: '언어셋 코드', used: 'Y' },
  { code: 'CC_MEM_ADD_INFO1', name: '대기배출 시설 종류', used: 'Y' },
  { code: 'CC_MEM_ADD_INFO2', name: '폐수처리 시설 종류', used: 'Y' },
  { code: 'CC_MEM_ADD_INFO3', name: '위험물 보관/사용 시설', used: 'Y' },
  { code: 'CC_MEM_ADD_INFO4', name: '지정폐기물 관리 대상', used: 'Y' },
  { code: 'CC_MEM_ADD_INFO5', name: '온실가스 배출권 거래제', used: 'Y' },
  { code: 'CC_MEM_ADD_INFO6', name: '사내 도급업체 보유', used: 'Y' },
  { code: 'CC_QUES_TY_CODE', name: '실의 유형 코드', used: 'Y' },
  { code: 'CC_SECSN_RESN_CODE', name: '탈퇴_사유_코드', used: 'Y' },
  { code: 'CC_SURVEY_ANS_CODE', name: '설문답변코드', used: 'Y' },
  { code: 'CC_SURVEY_ETC1_PART', name: '설문 기타 분류1', used: 'Y' },
  { code: 'CC_SURVEY_ETC2_PART', name: '설문 기타 분류2', used: 'Y' },
  { code: 'CC_SURVEY_PROGRS_STTUS_CODE', name: '설문 진행 상태', used: 'Y' },
  { code: 'CC_SURVEY_TYPE1_CODE', name: '실문 1차 카테고리', used: 'Y' },
  { code: 'CC_SURVEY_TYPE2_CODE', name: '실문 2차 카테고리', used: 'Y' },
  { code: 'CC_SURVEY_TYPE2_CODE_C', name: '실문 2차 카테고리 윤리', used: 'Y' },
  { code: 'CC_SURVEY_TYPE2_CODE_D', name: '실문 2차 카테고리 기본정보', used: 'Y' },
];

export default function CommonCodeMgmt() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>공통코드등록/관리</h2>

      <div className="bg-white border rounded overflow-auto" style={{ borderColor: '#e0e0e0', maxHeight: 600 }}>
        <table className="w-full text-sm border-collapse">
          <thead style={{ background: '#f8f8f8', position: 'sticky', top: 0 }}>
            <tr>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #f0f0f0', width: '35%' }}>분류코드</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #f0f0f0' }}>분류명</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #f0f0f0', width: 80 }}>사용여부</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: '#555', borderBottom: '1px solid #e0e0e0', width: 200 }}>버튼</th>
            </tr>
          </thead>
          <tbody>
            {codes.map(c => (
              <tr key={c.code} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td className="px-4 py-2 text-xs" style={{ borderRight: '1px solid #f0f0f0' }}>{c.code}</td>
                <td className="px-4 py-2 text-xs" style={{ borderRight: '1px solid #f0f0f0' }}>{c.name}</td>
                <td className="px-4 py-2 text-center text-xs" style={{ borderRight: '1px solid #f0f0f0' }}>{c.used}</td>
                <td className="px-4 py-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button className="rounded px-2 py-0.5 text-white text-xs" style={{ background: '#888', fontSize: 11 }}>삭제</button>
                    <button className="rounded px-2 py-0.5 text-white text-xs" style={{ background: '#5c7080', fontSize: 11 }}>상세보기</button>
                    <button className="rounded px-2 py-0.5 text-white text-xs" style={{ background: '#3d8fef', fontSize: 11 }}>수정</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
