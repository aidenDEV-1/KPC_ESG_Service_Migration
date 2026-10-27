// ADM Mock Data
export const admUsers = [
  { no: 5006, level: '제공자', company: 'TEST COMPANY A', group: '', bizNo: '307-81-38444', manager: 'TEST MANAGER 01', email: 'test01@example.com', phone: '', type: '', joinDate: '2026-09-17 13:15', active: '활성', delete: false },
  { no: 5005, level: '제공자', company: 'TEST COMPANY A', group: '', bizNo: '307-81-38444', manager: 'TEST MANAGER 02', email: 'test02@example.com', phone: '', type: '', joinDate: '2026-09-17 13:15', active: '활성', delete: false },
  { no: 5004, level: '실사관리자', company: '', group: 'TEST-GRP', bizNo: '6HP-VP-8QOEB', manager: 'TEST MANAGER 03', email: 'test03@example.com', phone: '', type: '', joinDate: '2026-09-15 09:51', active: '활성', delete: false },
  { no: 5003, level: '실사관리자', company: '', group: '', bizNo: '2SD-83-MEPUY', manager: 'TEST USER 03', email: 'testuser03@example.com', phone: '', type: '', joinDate: '2026-09-14 10:43', active: '활성', delete: false },
  { no: 5002, level: '협력업체', company: 'TEST 협력사 01', group: '', bizNo: '', manager: 'TEST USER 02', email: 'testuser02@example.com', phone: '', type: '', joinDate: '2026-09-14 10:42', active: '활성', delete: false },
  { no: 5001, level: '서베이관리자', company: '', group: '', bizNo: 'DQ9-M0-UU1S1', manager: 'TEST ADMIN', email: 'testadmin@example.com', phone: '', type: '', joinDate: '2026-09-14 10:41', active: '활성', delete: false },
  { no: 5000, level: '협력업체', company: 'TEST 협력사 02', group: '', bizNo: '561-56-16516', manager: 'TEST MANAGER 04', email: 'testmgr04@example.com', phone: '', type: '', joinDate: '2026-09-14 07:47', active: '활성', delete: true },
  { no: 4999, level: '협력업체', company: 'TEST COMPANY B', group: '', bizNo: '134-01-68222', manager: 'TEST MANAGER 05', email: 'testmgr05@example.com', phone: '010-1234-5678', type: 'TEST26', joinDate: '2026-09-11 16:21', active: '활성', delete: false },
  { no: 4998, level: '협력업체', company: 'TEST COMPANY C', group: '', bizNo: '105-81-66591', manager: 'TEST MANAGER 06', email: 'testmgr06@example.com', phone: '010-2345-6789', type: 'TEST26', joinDate: '2026-09-11 16:21', active: '활성', delete: true },
  { no: 4997, level: '협력업체', company: 'TEST COMPANY D', group: '', bizNo: '134-87-12396', manager: 'TEST MANAGER 07', email: 'testmgr07@example.com', phone: '010-3456-7890', type: 'TEST26', joinDate: '2026-09-11 16:21', active: '활성', delete: false },
];

export const admClients = [
  { no: 35, company: 'TEST 고객사 A', bizNo: '1098176596', joinDate: '2026-09-16 15:38', active: '활성' },
  { no: 34, company: 'TEST 고객사 B', bizNo: '3078138444', joinDate: '2026-09-02 14:39', active: '활성' },
  { no: 33, company: 'TEST 고객사 C', bizNo: '6108200050', joinDate: '2026-07-22 19:43', active: '활성' },
  { no: 32, company: 'TEST 고객사 D', bizNo: '1148116585', joinDate: '2026-03-05 13:15', active: '활성' },
  { no: 31, company: 'TEST 고객사 E', bizNo: '1078207862', joinDate: '2025-11-14 13:37', active: '활성' },
  { no: 30, company: 'TEST 고객사 F', bizNo: '1234567891', joinDate: '2025-09-30 09:50', active: '활성' },
  { no: 29, company: 'TEST 고객사 G', bizNo: '4908100105', joinDate: '2025-09-25 09:43', active: '활성' },
  { no: 28, company: 'TEST 고객사 H', bizNo: '1048126067', joinDate: '2025-08-04 16:10', active: '활성' },
  { no: 27, company: 'TEST 고객사 I', bizNo: '1438119635', joinDate: '2025-02-05 14:10', active: '활성' },
  { no: 26, company: 'TEST 고객사 J', bizNo: '2028145975', joinDate: '2024-03-25 15:32', active: '활성' },
];

export const admQuestions = [
  { no: 5606, category: '노동 및 인권', code: 'L-1-250-5-sb26', title: '복제-귀사는 고충처리 제도 및 시스템을 운영하고 있습니까?', type: '체크박스', required: 'Y', noAnswer: 'N', attachment: 'Y' },
  { no: 5605, category: '경영시스템', code: 'M-3-350', title: '귀사는 협력사의 ESG 역량 강화를 지원하고 있습니까?', type: '체크박스', required: 'Y', noAnswer: 'N', attachment: 'Y' },
  { no: 5604, category: '경영시스템', code: 'M-2-3330', title: '귀사는 ESG 성과를 정기적으로 관리, 검토하고 있습니까?', type: '체크박스', required: 'Y', noAnswer: 'N', attachment: 'Y' },
  { no: 5603, category: '윤리', code: 'C-6-330', title: '귀사는 조달하는 원부자재의 원산지 및 생산과정을 추적·확인하고 있으며, 분쟁/책임광물에 대해서는 별도로 관리하고 있습니까?', type: '체크박스', required: 'Y', noAnswer: 'Y', attachment: 'Y' },
  { no: 5602, category: '윤리', code: 'C-3-350', title: '귀사는 정보보안과 관련된 외부 인증 또는 이에 준하는 표준운영절차(SOP)를 보유하고 있습니까?', type: '체크박스', required: 'Y', noAnswer: 'N', attachment: 'Y' },
  { no: 5601, category: '윤리', code: 'C-3-330', title: '귀사는 정보보호 및 개인정보 보호를 위해 다음 활동을 수행하고 있습니까?', type: '체크박스', required: 'Y', noAnswer: 'N', attachment: 'Y' },
  { no: 5600, category: '환경', code: 'E-9-310', title: '귀사는 주요 환경 이슈별 KPI를 수립하고 목표 대비 성과를 관리하고 있습니까?', type: '체크박스', required: 'N', noAnswer: 'N', attachment: 'Y' },
  { no: 5599, category: '환경', code: 'E-8-380', title: '귀사는 Scope 3 배출량을 산정·관리하고 있습니까?', type: '체크박스', required: 'Y', noAnswer: 'N', attachment: 'Y' },
  { no: 5598, category: '환경', code: 'E-8-370', title: '귀사는 온실가스 감축목표와 실행계획을 수립하고 있습니까?', type: '체크박스', required: 'N', noAnswer: 'N', attachment: 'Y' },
  { no: 5597, category: '환경', code: 'E-8-340', title: '귀사는 온실가스 배출량 및 에너지 소비량을 정기적으로 산정·관리하고 있습니까?', type: '체크박스', required: 'Y', noAnswer: 'N', attachment: 'Y' },
];

export const admCampaigns = [
  { no: 177, provider: 'SK', name: '2026 SK 협력사 ESG 평가', startDate: '2026-05-01', endDate: '2026-08-31', status: '진행중', regDate: '2026-09-16 15:13:44.0', active: 'Y' },
  { no: 176, provider: '한화', name: '2025 한화 공급망 평가', startDate: '2025-04-01', endDate: '2025-07-31', status: '종료', regDate: '2026-09-11 15:40:18.0', active: 'Y' },
  { no: 175, provider: 'TEST 고객사 B', name: '2026 TEST 협력회사 ESG 자가평가 (임가공)', startDate: '2026-09-03', endDate: '2026-10-09', status: '자동', regDate: '2026-09-02 14:48:07.0', active: 'Y' },
  { no: 174, provider: 'test', name: 'TEST 농심 테스트', startDate: '2026-04-17', endDate: '2026-04-24', status: '자동', regDate: '2026-04-17 13:03:53.0', active: 'Y' },
  { no: 173, provider: 'TEST 고객사', name: 'TEST 원재료 test', startDate: '2026-03-12', endDate: '2026-03-16', status: '자동', regDate: '2026-03-12 10:10:59.0', active: 'Y' },
  { no: 172, provider: 'TEST 고객사 K', name: 'TEST 2024 공급망 ESG 평가 (EcoVadis Align)', startDate: '2024-10-10', endDate: '2024-10-16', status: '자동', regDate: '2024-10-15 11:11:22.0', active: 'Y' },
  { no: 171, provider: 'test', name: '[TEST 현대 건설기계 부문] 공급망 ESG 자가평가(2개년 연속 평가 업체 보정 시뮬레이션)', startDate: '2024-08-13', endDate: '2024-08-14', status: '자동', regDate: '2024-08-13 15:26:07.0', active: 'Y' },
  { no: 170, provider: 'test', name: '테스트 20231009', startDate: '2023-10-09', endDate: '2026-05-06', status: '자동', regDate: '2023-10-09 01:31:57.0', active: 'Y' },
  { no: 169, provider: 'test', name: '테스트 질의 목제 문제 확인', startDate: '2023-08-01', endDate: '2025-09-12', status: '자동', regDate: '2023-08-01 17:08:48.0', active: 'Y' },
  { no: 168, provider: 'test', name: '[TEST] ESG 공급망 지원사업', startDate: '2023-07-31', endDate: '2025-06-23', status: '자동', regDate: '2023-07-31 12:31:50.0', active: 'Y' },
];

export const accessStats = {
  2025: [120, 106, 615, 310, 1402, 1303, 550, 473, 906, 898, 1095, 1166],
  2026: [421, 57, 216, 336, 258, 413, 223, 156, 211, 0, 0, 0],
};

// KPC campaign data
export const kpcCampaigns = [
  {
    id: 'CPI202601',
    logo: 'NAVER',
    logoColor: '#03C75A',
    name: 'TEST 2026년 파트너사 ESG 자가진단(건설)',
    dateRange: '2026-01-01 ~ 2026-12-31',
    remaining: '105일 10:10분 후 종료',
  },
  {
    id: 'CPI202602',
    logo: 'NAVER',
    logoColor: '#03C75A',
    name: 'TEST 2026년 파트너사 ESG 자가진단(서비스)',
    dateRange: '2026-01-01 ~ 2026-12-31',
    remaining: '105일 10:10분 후 종료',
  },
  {
    id: 'CPI202603',
    logo: 'NAVER',
    logoColor: '#03C75A',
    name: 'TEST 2026년 파트너사 ESG 자가진단(제조)',
    dateRange: '2026-01-01 ~ 2026-12-31',
    remaining: '105일 10:10분 후 종료',
  },
  {
    id: 'CPI202604',
    logo: 'NAVER',
    logoColor: '#03C75A',
    name: 'TEST 2026년 파트너사 ESG 자가진단(정보통신)',
    dateRange: '2026-01-01 ~ 2026-12-31',
    remaining: '105일 10:10분 후 종료',
  },
  {
    id: 'CPI202605',
    logo: 'SAMSUNG',
    logoColor: '#1428A0',
    name: 'TEST 2024 협력사 ESG 평가 (TEST)',
    dateRange: '2024-09-23 ~ 2026-11-30',
    remaining: '74일 10:10분 후 종료',
  },
  {
    id: 'CPI202606',
    logo: '농심',
    logoColor: '#e63946',
    name: 'TEST 2026 협력사 ESG 자가평가(현장 컨설팅 대상기업 2차)',
    dateRange: '2026-08-06 ~ 2026-11-30',
    remaining: '74일 10:10분 후 종료',
  },
  {
    id: 'CPI202607',
    logo: '농심',
    logoColor: '#e63946',
    name: 'TEST 2026 협력사 ESG 자가평가(현장 컨설팅 대상기업 3차)',
    dateRange: '2026-09-07 ~ 2026-10-30',
    remaining: '43일 10:10분 후 종료',
  },
  {
    id: 'CPI202608',
    logo: 'HK Kolmar',
    logoColor: '#003087',
    name: 'TEST 2026 협력회사 ESG 자가평가 (원료)',
    dateRange: '2026-09-03 ~ 2026-10-09',
    remaining: '22일 10:10분 후 종료',
  },
  {
    id: 'CPI202609',
    logo: 'HK Kolmar',
    logoColor: '#003087',
    name: 'TEST 2026 협력회사 ESG 자가평가 (포장재)',
    dateRange: '2026-09-03 ~ 2026-10-09',
    remaining: '22일 10:10분 후 종료',
  },
  {
    id: 'CPI202610',
    logo: 'HK Kolmar',
    logoColor: '#003087',
    name: 'TEST 2026 협력회사 ESG 자가평가 (임가공)',
    dateRange: '2026-09-03 ~ 2026-10-09',
    remaining: '22일 10:10분 후 종료',
  },
  {
    id: 'CPI202611',
    logo: 'KOTRA',
    logoColor: '#005BAA',
    name: 'TEST 2026 KOTRA 해외 공급망 ESG 대응 자가평가',
    dateRange: '2026-09-16 ~ 2026-10-01',
    remaining: '14일 10:10분 후 종료',
  },
  {
    id: 'CPI202612',
    logo: 'THE 7',
    logoColor: '#333',
    name: 'DEX TEST',
    dateRange: '2026-09-10 ~ 2026-09-26',
    remaining: '9일 10:10분 후 종료',
  },
];

export const evalCompanies = [
  { no: 1, company: 'TEST 협력사 001', total: 63.9, labor: 71.8, safety: 80.5, env: 62.4, ethics: 40.8 },
  { no: 2, company: 'TEST 협력사 002', total: 76.7, labor: 93.2, safety: 79.8, env: 69.6, ethics: 64.2 },
  { no: 3, company: 'TEST 협력사 003', total: 55.7, labor: 63.6, safety: 66.5, env: 62.8, ethics: 29.7 },
  { no: 4, company: 'TEST 협력사 004', total: 47.9, labor: 42.8, safety: 79.8, env: 47.7, ethics: 21.3 },
  { no: 5, company: 'TEST 협력사 005', total: 66.2, labor: 95.1, safety: 57.6, env: 75.0, ethics: 37.2 },
  { no: 6, company: 'TEST 협력사 006', total: 53.2, labor: 57.6, safety: 83.3, env: 54.4, ethics: 17.5 },
  { no: 7, company: 'TEST 협력사 007', total: 58.7, labor: 73.5, safety: 61.8, env: 53.1, ethics: 46.6 },
  { no: 8, company: 'TEST 협력사 008', total: 36.7, labor: 65.4, safety: 45.5, env: 19.2, ethics: 16.8 },
  { no: 9, company: 'TEST 협력사 009', total: 58.1, labor: 88.0, safety: 69.7, env: 31.3, ethics: 43.6 },
  { no: 10, company: 'TEST 협력사 010', total: 45.0, labor: 74.7, safety: 35.0, env: 17.2, ethics: 53.2 },
];

export const progressCompanies = [
  { no: 1, company: 'TEST 협력사 001', completion: 100, submitted: 'Y', infoAgree: 'Y', labor: '100%', safety: '100%', env: '100%', ethics: '100%' },
  { no: 2, company: 'TEST 협력사 002', completion: 100, submitted: 'Y', infoAgree: 'Y', labor: '100%', safety: '100%', env: '100%', ethics: '100%' },
  { no: 3, company: 'TEST 협력사 003', completion: 100, submitted: 'Y', infoAgree: 'Y', labor: '100%', safety: '100%', env: '100%', ethics: '100%' },
  { no: 4, company: 'TEST 협력사 004', completion: 100, submitted: 'Y', infoAgree: 'Y', labor: '100%', safety: '100%', env: '100%', ethics: '100%' },
  { no: 5, company: 'TEST 협력사 005', completion: 100, submitted: 'Y', infoAgree: 'Y', labor: '100%', safety: '100%', env: '100%', ethics: '100%' },
  { no: 6, company: 'TEST 협력사 006', completion: 100, submitted: 'Y', infoAgree: 'Y', labor: '100%', safety: '100%', env: '100%', ethics: '100%' },
  { no: 7, company: 'TEST 협력사 007', completion: 100, submitted: 'Y', infoAgree: 'Y', labor: '100%', safety: '100%', env: '100%', ethics: '100%' },
  { no: 8, company: 'TEST 협력사 008', completion: 100, submitted: 'Y', infoAgree: 'Y', labor: '100%', safety: '100%', env: '100%', ethics: '100%' },
  { no: 9, company: 'TEST 협력사 009', completion: 100, submitted: 'Y', infoAgree: 'Y', labor: '100%', safety: '100%', env: '100%', ethics: '100%' },
  { no: 10, company: 'TEST 협력사 010', completion: 100, submitted: 'Y', infoAgree: 'Y', labor: '100%', safety: '100%', env: '100%', ethics: '100%' },
  { no: 11, company: 'TEST 협력사 011', completion: 0, submitted: '', infoAgree: 'Y', labor: '0%', safety: '0%', env: '0%', ethics: '0%' },
];

// Survey sections
export type QuestionType = 'radio' | 'checkbox' | 'radio_text' | 'checkbox_text' | 'number_grid';

export interface SurveyQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options?: { label: string; hasText?: boolean }[];
  hasFile?: boolean;
}

export interface SurveySection {
  id: string;
  title: string;
  questions: SurveyQuestion[];
}

export const surveySections: Record<string, SurveySection[]> = {
  L: [
    {
      id: 'L01', title: '1. 일반',
      questions: [
        { id: 'L1.1', text: '귀사는 임직원의 인권 증진 및 인권침해 구제를 목적으로 하는 인권헌장을 보유하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'L1.2', text: '귀사의 인권헌장에 포함되어 있는 요소를 체크해 주시기 바랍니다.', type: 'checkbox', options: [{ label: '아동노동과 연소노동자' }, { label: '임금 및 복리후생' }, { label: '근로시간' }, { label: '강제노동 및 인신매매' }, { label: '결사의 자유와 단체교섭' }, { label: '안전 보건' }, { label: '직장 내 괴롭힘' }, { label: '차별 금지' }, { label: '고객 인권' }, { label: '지역주민 인권' }, { label: '관계없음' }], hasFile: true },
        { id: 'L1.3', text: '귀사는 고충처리 제도 및 시스템을 운영하고 있습니까?', type: 'checkbox', options: [{ label: '내부 임직원으로부터 고충을 접수할 수 있는 채널을 운영하고 있습니다.' }, { label: '외부 이해관계자로부터 고충을 접수할 수 있는 채널을 운영하고 있습니다.' }], hasFile: true },
        { id: 'L1.4', text: '귀사는 인권/노동 관련 접수된 고충을 보고 및 처리하는 공식적인 절차를 수립하고 있습니까?', type: 'radio_text', options: [{ label: '예. 당신은 접수된 고충을 보고 및 처리하는 절차를 수립하고 있습니다.', hasText: true }, { label: '아니오. 당신은 별도의 보고 및 처리 절차를 수립하고 있지 않습니다.' }], hasFile: true },
        { id: 'L1.5', text: '귀사는 임직원을 대상으로 인권관련 교육을 진행하고 있습니까?', type: 'checkbox_text', options: [{ label: '법정 교육(성희롱 및 장애인 인식개선 교육 등)', hasText: true }, { label: '인권 일반 교육(차별, 결사의 자유, 아동/강제노동 등)', hasText: true }, { label: '임직원 복리후생(근로시간, 임금, 복리후생 등)', hasText: true }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'L02', title: '2. 강제노동 및 자발적 근로',
      questions: [
        { id: 'L2.1', text: '귀사는 근로자의 자발적 근로를 보장하기 위한 정책 또는 절차를 수립하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'L2.2', text: '귀사는 강제노동(bonded labor, 채무에 의한 노동)을 금지하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'L2.3', text: '귀사는 근로자의 신분증명서(여권, 신분증 등)를 허가 없이 보관하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'L2.4', text: '귀사는 근로자에게 고용과 관련하여 수수료를 부과하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'L03', title: '3. 아동노동 및 연소근로',
      questions: [
        { id: 'L3.1', text: '귀사는 아동노동(18세 미만)을 금지하는 정책 또는 절차를 수립하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'L3.2', text: '귀사는 연소근로자(18세 미만)를 고용하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'L3.3', text: '귀사는 연소근로자(18세 미만)를 고용하는 경우 해당 법률을 준수하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }, { label: '해당없음' }], hasFile: true },
      ],
    },
    {
      id: 'L04', title: '4. 근로시간',
      questions: [
        { id: 'L4.1', text: '귀사의 주당 평균 근로시간은 얼마입니까?', type: 'radio', options: [{ label: '48시간 이하' }, { label: '48시간 초과' }], hasFile: true },
        { id: 'L4.2', text: '귀사는 법정 최대 근로시간을 준수하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'L4.3', text: '귀사는 초과근무에 대해 법정 기준에 따라 수당을 지급하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'L05', title: '5. 임금 및 복리후생',
      questions: [
        { id: 'L5.1', text: '귀사는 최저임금 이상의 임금을 지급하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'L5.2', text: '귀사는 임금 명세서를 근로자에게 제공하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'L5.3', text: '귀사는 법정 복리후생(4대보험 등)을 근로자에게 제공하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'L06', title: '6. 인도적 대우',
      questions: [
        { id: 'L6.1', text: '귀사는 직장 내 괴롭힘 및 폭력을 금지하는 정책을 보유하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'L6.2', text: '귀사는 직장 내 괴롭힘 신고 및 처리 절차를 운영하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'L6.3', text: '귀사는 성희롱 예방 교육을 실시하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'L07', title: '7. 차별 금지',
      questions: [
        { id: 'L7.1', text: '귀사는 채용, 승진, 교육 등에서 차별을 금지하는 정책을 보유하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'L7.2', text: '귀사가 차별을 금지하는 대상은 무엇입니까?', type: 'checkbox', options: [{ label: '성별' }, { label: '나이' }, { label: '인종/민족' }, { label: '장애' }, { label: '종교' }, { label: '국적' }, { label: '기타' }], hasFile: true },
      ],
    },
    {
      id: 'L08', title: '8. 결사의 자유',
      questions: [
        { id: 'L8.1', text: '귀사는 근로자의 단결권 및 단체교섭권을 보장하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'L8.2', text: '귀사에 노동조합이 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
  ],
  S: [
    {
      id: 'S01', title: '1. OHS 체계 및 교육',
      questions: [
        { id: 'S1.1', text: '귀사는 산업안전보건 관리체계(OHS)를 구축하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'S1.2', text: '귀사는 산업안전보건 관련 교육을 실시하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'S1.3', text: '귀사가 실시하는 안전보건 교육의 유형을 선택해 주세요.', type: 'checkbox', options: [{ label: '신규 채용 시 교육' }, { label: '정기 교육' }, { label: '특별 교육' }, { label: '관리감독자 교육' }, { label: '해당없음' }], hasFile: true },
        { id: 'S1.4', text: '귀사는 안전보건 관련 외부 인증을 보유하고 있습니까?', type: 'radio', options: [{ label: '예 (ISO 45001 등)' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'S02', title: '2. 산업안전',
      questions: [
        { id: 'S2.1', text: '귀사는 작업장 위험성 평가를 실시하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'S2.2', text: '귀사는 안전점검을 정기적으로 실시하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'S2.3', text: '귀사의 안전점검 주기를 선택해 주세요.', type: 'radio', options: [{ label: '월 1회 이상' }, { label: '분기 1회' }, { label: '반기 1회' }, { label: '연 1회' }], hasFile: true },
      ],
    },
    {
      id: 'S03', title: '3. 비상상황 대응',
      questions: [
        { id: 'S3.1', text: '귀사는 비상상황 대응 계획(재난, 화재 등)을 수립하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'S3.2', text: '귀사는 비상대피 훈련을 정기적으로 실시하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'S04', title: '4. 산업재해',
      questions: [
        { id: 'S4.1', text: '귀사에서 최근 3년간 산업재해가 발생하였습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'S4.2', text: '귀사는 산업재해 발생 시 보고 및 조사 절차를 운영하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'S05', title: '5. 산업위생',
      questions: [
        { id: 'S5.1', text: '귀사는 작업환경 측정을 실시하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'S5.2', text: '귀사는 근로자에게 개인보호장비(PPE)를 제공하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'S06', title: '6. 육체노동',
      questions: [
        { id: 'S6.1', text: '귀사는 근골격계 질환 예방 프로그램을 운영하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'S6.2', text: '귀사는 육체적으로 힘든 작업에 대한 위험성 평가를 실시하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'S07', title: '7. 기계설비 안전 유지',
      questions: [
        { id: 'S7.1', text: '귀사는 기계·설비에 대한 정기 점검 및 유지보수를 실시하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'S7.2', text: '귀사는 기계·설비 안전장치(잠금/태그아웃 등)를 운영하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'S08', title: '8. 식품, 위생 및 주거',
      questions: [
        { id: 'S8.1', text: '귀사는 근로자에게 위생적인 식음용 시설(정수기, 식당 등)을 제공하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'S8.2', text: '귀사는 근로자 숙소를 운영하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
  ],
  E: [
    {
      id: 'E01', title: '1. 환경 일반',
      questions: [
        { id: 'E1.1', text: '귀사는 환경경영 정책 또는 방침을 수립하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'E1.2', text: '귀사는 환경 관련 외부 인증을 보유하고 있습니까?', type: 'radio', options: [{ label: '예 (ISO 14001 등)' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'E02', title: '2. 환경 허가 및 보고',
      questions: [
        { id: 'E2.1', text: '귀사는 사업 운영에 필요한 환경 관련 허가를 모두 보유하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'E2.2', text: '귀사는 환경 관련 법규를 준수하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'E03', title: '3. 오염물질 저감',
      questions: [
        { id: 'E3.1', text: '귀사는 오염물질 저감을 위한 목표 및 계획을 수립하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'E3.2', text: '귀사는 오염물질 배출량을 정기적으로 측정하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'E04', title: '4. 유해물질 관리',
      questions: [
        { id: 'E4.1', text: '귀사는 유해화학물질 목록(MSDS 등)을 관리하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'E4.2', text: '귀사는 유해물질 취급에 관한 교육을 실시하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'E4.3', text: '귀사는 유해물질 관련 규제(RoHS, REACH 등)를 준수하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }, { label: '해당없음' }], hasFile: true },
      ],
    },
    {
      id: 'E05', title: '5. 폐기물 처리',
      questions: [
        { id: 'E5.1', text: '귀사는 폐기물 발생량을 관리하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'E5.2', text: '귀사는 폐기물을 적법하게 처리하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'E06', title: '6. 대기오염물질',
      questions: [
        { id: 'E6.1', text: '귀사는 대기오염물질 배출 허가를 보유하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }, { label: '해당없음' }], hasFile: true },
        { id: 'E6.2', text: '귀사는 대기오염물질 배출량을 측정·관리하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'E07', title: '7. 수자원 관리',
      questions: [
        { id: 'E7.1', text: '귀사는 용수 사용량을 측정·관리하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'E7.2', text: '귀사는 폐수 배출 허가를 보유하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }, { label: '해당없음' }], hasFile: true },
      ],
    },
    {
      id: 'E08', title: '8. 에너지 및 온실가스 배출',
      questions: [
        { id: 'E8.1', text: '귀사는 에너지 소비량을 측정·관리하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'E8.2', text: '귀사는 온실가스(GHG) 배출량을 산정하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'E8.3', text: '귀사는 온실가스 감축 목표를 수립하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'E09', title: '9. 생물다양성',
      questions: [
        { id: 'E9.1', text: '귀사의 사업장은 생태적으로 민감한 지역(보호구역 등) 인근에 위치하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'E9.2', text: '귀사는 생물다양성 보호를 위한 정책 또는 프로그램을 운영하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
  ],
  C: [
    {
      id: 'C01', title: '1. 윤리 일반',
      questions: [
        { id: 'C1.1', text: '귀사는 윤리경영 정책 또는 행동강령을 보유하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'C1.2', text: '귀사는 윤리경영 교육을 실시하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'C02', title: '2. 반부패 및 이해상충 금지',
      questions: [
        { id: 'C2.1', text: '귀사는 반부패 정책(뇌물, 청탁 금지 등)을 보유하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'C2.2', text: '귀사는 이해상충 신고 및 처리 절차를 운영하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'C2.3', text: '귀사는 부패 방지 관련 교육을 실시하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'C03', title: '3. 개인정보 보호',
      questions: [
        { id: 'C3.1', text: '귀사는 개인정보 보호 정책을 수립하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'C3.2', text: '귀사는 개인정보 관련 교육을 실시하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'C04', title: '4. 불공정 거래 방지',
      questions: [
        { id: 'C4.1', text: '귀사는 공정거래 관련 법규를 준수하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'C4.2', text: '귀사는 담합, 가격 고정 등 불공정 거래 행위를 금지하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'C05', title: '5. 지적재산 보호',
      questions: [
        { id: 'C5.1', text: '귀사는 지적재산권(특허, 저작권 등)을 보호하는 정책을 보유하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'C5.2', text: '귀사는 소프트웨어 불법 복제를 금지하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'C06', title: '6. 책임 있는 자재 구매',
      questions: [
        { id: 'C6.1', text: '귀사는 공급망에서 분쟁광물(주석, 탄탈럼, 텅스텐, 금) 사용 여부를 파악하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }, { label: '해당없음' }], hasFile: true },
        { id: 'C6.2', text: '귀사는 원재료 및 부품의 원산지를 추적·관리하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'C07', title: '7. 윤리 기타',
      questions: [
        { id: 'C7.1', text: '귀사는 내부 고발자 보호 정책을 운영하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'C7.2', text: '귀사는 부정행위 신고 채널을 운영하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
  ],
  M: [
    {
      id: 'M01', title: '1. 경영진 참여',
      questions: [
        { id: 'M1.1', text: '귀사의 경영진(임원 이상)은 ESG 경영에 직접 참여하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'M1.2', text: '귀사는 ESG 전담 조직 또는 담당자를 지정하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'M02', title: '2. 성과 관리',
      questions: [
        { id: 'M2.1', text: '귀사는 ESG 성과 지표(KPI)를 수립하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'M2.2', text: '귀사는 ESG 성과를 정기적으로 검토하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'M03', title: '3. 협력사 관리 및 관리',
      questions: [
        { id: 'M3.1', text: '귀사는 협력사(1차 공급업체)에 대한 ESG 기준을 운영하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'M3.2', text: '귀사는 협력사의 ESG 역량 강화를 지원하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
    {
      id: 'M04', title: '4. 사회공헌',
      questions: [
        { id: 'M4.1', text: '귀사는 지역사회 공헌 활동을 실시하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
        { id: 'M4.2', text: '귀사는 사회공헌 예산을 별도로 편성하고 있습니까?', type: 'radio', options: [{ label: '예' }, { label: '아니오' }], hasFile: true },
      ],
    },
  ],
};
