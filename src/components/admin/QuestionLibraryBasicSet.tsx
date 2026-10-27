import { useState } from 'react';

export interface QuestionFormValues {
  summary: string;
  firstCategory: string;
  secondCategory: string;
  classification: string;
  sequence: string;
  depth: string;
  industry: string;
  companyCode: string;
  required: string;
  notApplicable: string;
  notApplicableReason: string;
  hasAttachment: string;
  questionType: string;
  title: string;
  industryCode?: number;
  industries?: string[];
}

export interface Question {
  no: string;
  questionId?: string;
  parentNo?: string;
  title: string;
  type: string;
  attachment: string;
  updated: string;
  campaigns: number;
  folderId?: string;
  form?: QuestionFormValues;
  campaignList?: { name: string; client: string; period: string; status: string }[];
  industryCode?: number; // 0=공통, 1=제조, 2=원자재, 3=유통, 4=식품
  industries?: string[];
  sourceNo?: string | number;
  sourceFolderId?: string;
  customerName?: string;
  choices?: { text: string; score: number }[];
}

export interface FolderNode {
  id: string;
  label: string;
  children?: FolderNode[];
}

export const normalizeQuestionType = (type: string) => {
  if (['드롭다운', '텍스트', '텍스트상자', '텍스트그룹'].includes(type)) return '텍스트박스';
  return type;
};

export const FOLDER_TREE: FolderNode[] = [
  {
    id: 'L', label: '▼ L.노동', children: [
      { id: 'L-고용', label: '고용 관리' },
      { id: 'L-근로', label: '근로 조건' },
      { id: 'L-임금', label: '임금 관리' },
      { id: 'L-휴가', label: '휴가·휴직' },
      { id: 'L-비정규', label: '비정규직 관리' },
    ],
  },
  {
    id: 'S', label: '▼ S.인권', children: [
      { id: 'S-인권정책', label: '인권 정책' },
      { id: 'S-차별', label: '차별 금지' },
      { id: 'S-아동', label: '아동노동 금지' },
      { id: 'S-강제', label: '강제노동 금지' },
      { id: 'S-결사', label: '결사의 자유' },
    ],
  },
  {
    id: 'E', label: '▼ E.환경', children: [
      { id: 'E-환경정책', label: '환경 정책' },
      { id: 'E-온실', label: '온실가스 관리' },
      { id: 'E-폐기물', label: '폐기물 관리' },
      { id: 'E-수자원', label: '수자원 관리' },
      { id: 'E-에너지', label: '에너지 관리' },
    ],
  },
  {
    id: 'ET', label: '▼ E.윤리', children: [
      { id: 'ET-윤리경영', label: '윤리 경영' },
      { id: 'ET-공정거래', label: '공정 거래' },
      { id: 'ET-부패', label: '부패 방지' },
      { id: 'ET-이해충돌', label: '이해충돌 관리' },
      { id: 'ET-개인정보', label: '개인정보 보호' },
    ],
  },
  {
    id: 'M', label: '▼ M.경영', children: [
      { id: 'M-지배구조', label: '지배구조' },
      { id: 'M-공급망', label: '공급망 관리' },
      { id: 'M-ESG공시', label: 'ESG 공시' },
      { id: 'M-리스크', label: '리스크 관리' },
      { id: 'M-이해관계자', label: '이해관계자 소통' },
    ],
  },
  {
    id: 'D', label: '▼ D.기본정보', children: [
      { id: 'D-회사', label: '회사 일반 현황' },
      { id: 'D-인력', label: '인력 현황' },
      { id: 'D-재무', label: '재무 현황' },
      { id: 'D-공급망', label: '공급망 현황' },
      { id: 'D-인증', label: '인증·수상 현황' },
    ],
  },
];

export const QUESTIONS_BY_FOLDER: Record<string, Question[]> = {
  'L-고용': [
    { no: '1', title: '귀사는 공개 채용 원칙을 수립하고 있습니까?', type: '라디오', attachment: 'N', updated: '26.09.10', campaigns: 2, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03 ~ 2026-06', status: '종료' }, { name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05 ~ 2026-08', status: '진행중' }] },
    { no: '2', title: '채용 시 근로계약서를 서면으로 체결하고 있습니까?', type: '라디오', attachment: 'Y', updated: '26.08.15', campaigns: 1, campaignList: [{ name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05 ~ 2026-08', status: '진행중' }] },
    { no: '3', title: '수습 기간 제도를 운영하고 있습니까?', type: '라디오', attachment: 'N', updated: '26.07.20', campaigns: 2, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03 ~ 2026-06', status: '종료' }, { name: '2026 LG 협력사 ESG 평가', client: 'lg', period: '2026-04 ~ 2026-07', status: '종료' }] },
    { no: '3-1', parentNo: '3', title: '수습 기간은 몇 개월입니까?', type: '라디오', attachment: 'N', updated: '26.07.20', campaigns: 0 },
    { no: '3-2', parentNo: '3', title: '수습 기간 중 급여 지급 기준이 별도로 존재합니까?', type: '라디오', attachment: 'N', updated: '26.07.20', campaigns: 0 },
    { no: '4', title: '외국인 근로자 고용 현황을 관리하고 있습니까?', type: '라디오', attachment: 'N', updated: '26.06.30', campaigns: 1, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03 ~ 2026-06', status: '종료' }] },
    { no: '4-1', parentNo: '4', title: '외국인 근로자 비율(전체 인원 대비)을 알려주세요.', type: '드롭다운', attachment: 'N', updated: '26.06.30', campaigns: 0 },
    { no: '5', title: '신규 입사자 온보딩 프로그램이 있습니까?', type: '라디오', attachment: 'N', updated: '26.05.12', campaigns: 2, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03 ~ 2026-06', status: '종료' }, { name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05 ~ 2026-08', status: '진행중' }] },
    { no: '5-1', parentNo: '5', title: '온보딩 프로그램의 평균 운영 기간은 얼마입니까?', type: '라디오', attachment: 'N', updated: '26.05.12', campaigns: 0 },
    { no: '5-2', parentNo: '5', title: '온보딩 프로그램에 ESG 관련 교육이 포함되어 있습니까?', type: '라디오', attachment: 'N', updated: '26.05.12', campaigns: 0 },
    { no: '6', title: '인사 평가 제도를 연 1회 이상 운영하고 있습니까?', type: '라디오', attachment: 'N', updated: '26.04.08', campaigns: 1, campaignList: [{ name: '2026 LG 협력사 ESG 평가', client: 'lg', period: '2026-04 ~ 2026-07', status: '종료' }] },
    { no: '7', title: '근로자 개인 인사기록 관리 방식은 무엇입니까?', type: '드롭다운', attachment: 'N', updated: '26.03.25', campaigns: 0 },
    { no: '8', title: '고용 형태별 인원 현황을 정기적으로 파악하고 있습니까?', type: '라디오', attachment: 'N', updated: '26.02.14', campaigns: 1, campaignList: [{ name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05 ~ 2026-08', status: '진행중' }] },
    { no: '9', title: '최근 1년간 신규 채용 인원을 알려주세요.', type: '텍스트', attachment: 'N', updated: '26.01.10', campaigns: 1, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03 ~ 2026-06', status: '종료' }] },
    { no: '10', title: '채용 과정에서 외부 채용대행사를 이용하고 있습니까?', type: '라디오', attachment: 'N', updated: '25.12.05', campaigns: 0 },
  ],

  /* ── D.기본정보 ── */
  'D-회사': [
    { no: '1', title: '귀사의 법인명(상호)을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.09.10', campaigns: 3, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03~06', status: '종료' }, { name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05~08', status: '진행중' }, { name: '2026 LG 협력사 ESG 평가', client: 'lg', period: '2026-04~07', status: '종료' }] },
    { no: '1-1', parentNo: '1', title: '사업자등록번호를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.09.10', campaigns: 0 },
    { no: '2', title: '본사 소재지(시/도)를 선택해 주세요.', type: '드롭다운', attachment: 'N', updated: '26.09.10', campaigns: 2, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03~06', status: '종료' }, { name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05~08', status: '진행중' }] },
    { no: '3', title: '설립 연도를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.08.20', campaigns: 2, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03~06', status: '종료' }, { name: '2026 LG 협력사 ESG 평가', client: 'lg', period: '2026-04~07', status: '종료' }] },
    { no: '3-1', parentNo: '3', title: '기업 형태(법인/개인)를 선택해 주세요.', type: '라디오', attachment: 'N', updated: '26.08.20', campaigns: 0 },
    { no: '4', title: '주요 사업 분야(업종)를 선택해 주세요.', type: '드롭다운', attachment: 'N', updated: '26.08.15', campaigns: 3, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03~06', status: '종료' }, { name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05~08', status: '진행중' }, { name: '2026 LG 협력사 ESG 평가', client: 'lg', period: '2026-04~07', status: '종료' }] },
    { no: '4-1', parentNo: '4', title: '세부 제품/서비스 내용을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.08.15', campaigns: 0 },
    { no: '5', title: '국내 사업장 수를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.07.30', campaigns: 1, campaignList: [{ name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05~08', status: '진행중' }] },
    { no: '5-1', parentNo: '5', title: '해외 사업장 보유 여부를 선택해 주세요.', type: '라디오', attachment: 'N', updated: '26.07.30', campaigns: 0 },
    { no: '6', title: '대표이사 성명을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.07.10', campaigns: 2, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03~06', status: '종료' }, { name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05~08', status: '진행중' }] },
    { no: '7', title: 'ESG 담당자 연락처(이메일)를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.06.25', campaigns: 1, campaignList: [{ name: '2026 LG 협력사 ESG 평가', client: 'lg', period: '2026-04~07', status: '종료' }] },
    { no: '7-1', parentNo: '7', title: 'ESG 담당 부서명을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.06.25', campaigns: 0 },
    { no: '8', title: '최근 결산 기준 연도를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.06.10', campaigns: 0 },
    { no: '9', title: '지배주주/최대주주 현황을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.05.20', campaigns: 0 },
    { no: '9-1', parentNo: '9', title: '최대주주 지분율(%)을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.05.20', campaigns: 0 },
    { no: '10', title: '귀사 웹사이트 URL을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.04.15', campaigns: 1, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03~06', status: '종료' }] },
  ],
  'D-인력': [
    { no: '1', title: '전체 임직원 수(정규직+비정규직)를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.09.10', campaigns: 3, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03~06', status: '종료' }, { name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05~08', status: '진행중' }, { name: '2026 LG 협력사 ESG 평가', client: 'lg', period: '2026-04~07', status: '종료' }] },
    { no: '1-1', parentNo: '1', title: '정규직 인원수를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.09.10', campaigns: 0 },
    { no: '1-2', parentNo: '1', title: '비정규직 인원수를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.09.10', campaigns: 0 },
    { no: '2', title: '성별 인원 현황(남/여 비율)을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.09.05', campaigns: 2, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03~06', status: '종료' }, { name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05~08', status: '진행중' }] },
    { no: '3', title: '연령대별 인원 분포를 알려주세요.', type: '텍스트', attachment: 'N', updated: '26.08.30', campaigns: 1, campaignList: [{ name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05~08', status: '진행중' }] },
    { no: '3-1', parentNo: '3', title: '30세 미만 비율(%)을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.08.30', campaigns: 0 },
    { no: '4', title: '최근 1년 이직률(%)을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.08.20', campaigns: 2, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03~06', status: '종료' }, { name: '2026 LG 협력사 ESG 평가', client: 'lg', period: '2026-04~07', status: '종료' }] },
    { no: '4-1', parentNo: '4', title: '자발적 이직률(%)을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.08.20', campaigns: 0 },
    { no: '5', title: '임원(이사 이상) 인원수를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.08.10', campaigns: 1, campaignList: [{ name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05~08', status: '진행중' }] },
    { no: '5-1', parentNo: '5', title: '여성 임원 비율(%)을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.08.10', campaigns: 0 },
    { no: '6', title: '장애인 고용 인원수를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.07.25', campaigns: 0 },
    { no: '7', title: '외국인 근로자 인원수를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.07.10', campaigns: 0 },
    { no: '8', title: '최근 1년 신규 채용 인원수를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.06.20', campaigns: 1, campaignList: [{ name: '2026 LG 협력사 ESG 평가', client: 'lg', period: '2026-04~07', status: '종료' }] },
    { no: '9', title: '육아휴직 사용 인원(남/여)을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.05.30', campaigns: 0 },
    { no: '10', title: '산업재해 발생 건수를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.05.10', campaigns: 2, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03~06', status: '종료' }, { name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05~08', status: '진행중' }] },
  ],
  'D-재무': [
    { no: '1', title: '최근 결산 연도 매출액(백만 원)을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.09.10', campaigns: 3, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03~06', status: '종료' }, { name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05~08', status: '진행중' }, { name: '2026 LG 협력사 ESG 평가', client: 'lg', period: '2026-04~07', status: '종료' }] },
    { no: '1-1', parentNo: '1', title: '전년 대비 매출 증감률(%)을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.09.10', campaigns: 0 },
    { no: '2', title: '영업이익(백만 원)을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.09.05', campaigns: 2, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03~06', status: '종료' }, { name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05~08', status: '진행중' }] },
    { no: '3', title: '총자산(백만 원)을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.08.25', campaigns: 2, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03~06', status: '종료' }, { name: '2026 LG 협력사 ESG 평가', client: 'lg', period: '2026-04~07', status: '종료' }] },
    { no: '3-1', parentNo: '3', title: '부채비율(%)을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.08.25', campaigns: 0 },
    { no: '4', title: '신용등급(해당 시)을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.08.15', campaigns: 1, campaignList: [{ name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05~08', status: '진행중' }] },
    { no: '4-1', parentNo: '4', title: '신용평가 기관명을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.08.15', campaigns: 0 },
    { no: '5', title: '외부 감사 여부를 선택해 주세요.', type: '라디오', attachment: 'N', updated: '26.08.05', campaigns: 2, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03~06', status: '종료' }, { name: '2026 LG 협력사 ESG 평가', client: 'lg', period: '2026-04~07', status: '종료' }] },
    { no: '5-1', parentNo: '5', title: '감사 법인명을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.08.05', campaigns: 0 },
    { no: '6', title: '보험 가입 현황(배상책임 등)을 선택해 주세요.', type: '체크박스', attachment: 'N', updated: '26.07.20', campaigns: 0 },
    { no: '7', title: 'ESG 투자 금액(백만 원)을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.07.05', campaigns: 0 },
    { no: '8', title: '연구개발(R&D) 투자 금액(백만 원)을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.06.15', campaigns: 1, campaignList: [{ name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05~08', status: '진행중' }] },
    { no: '9', title: '최근 3년 매출 추이를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.05.25', campaigns: 0 },
    { no: '10', title: '재무제표 공시 여부를 선택해 주세요.', type: '라디오', attachment: 'Y', updated: '26.05.05', campaigns: 1, campaignList: [{ name: '2026 LG 협력사 ESG 평가', client: 'lg', period: '2026-04~07', status: '종료' }] },
  ],
  'D-공급망': [
    { no: '1', title: '1차 공급사 업체 수를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.09.10', campaigns: 3, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03~06', status: '종료' }, { name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05~08', status: '진행중' }, { name: '2026 LG 협력사 ESG 평가', client: 'lg', period: '2026-04~07', status: '종료' }] },
    { no: '1-1', parentNo: '1', title: '국내 공급사 수를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.09.10', campaigns: 0 },
    { no: '1-2', parentNo: '1', title: '해외 공급사 수를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.09.10', campaigns: 0 },
    { no: '2', title: '주요 원자재 조달 국가를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.09.05', campaigns: 2, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03~06', status: '종료' }, { name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05~08', status: '진행중' }] },
    { no: '2-1', parentNo: '2', title: '분쟁광물 포함 원자재 여부를 선택해 주세요.', type: '라디오', attachment: 'N', updated: '26.09.05', campaigns: 0 },
    { no: '3', title: '상위 5개 공급사 매입 비중(%)을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.08.28', campaigns: 1, campaignList: [{ name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05~08', status: '진행중' }] },
    { no: '4', title: '공급망 행동규범(CoC) 체결 업체 수를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.08.18', campaigns: 2, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03~06', status: '종료' }, { name: '2026 LG 협력사 ESG 평가', client: 'lg', period: '2026-04~07', status: '종료' }] },
    { no: '4-1', parentNo: '4', title: 'CoC 미체결 업체에 대한 조치 방침을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.08.18', campaigns: 0 },
    { no: '5', title: '공급망 ESG 평가 실시 업체 수를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.08.05', campaigns: 2, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03~06', status: '종료' }, { name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05~08', status: '진행중' }] },
    { no: '5-1', parentNo: '5', title: 'ESG 평가 결과 부적격 판정 업체 수를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.08.05', campaigns: 0 },
    { no: '6', title: '귀사가 납품하는 주요 고객사를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.07.22', campaigns: 0 },
    { no: '7', title: '물류·배송 탄소발자국 관리 여부를 선택해 주세요.', type: '라디오', attachment: 'N', updated: '26.06.18', campaigns: 0 },
    { no: '8', title: '현지화 구매(Local Sourcing) 비율(%)을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.05.28', campaigns: 0 },
    { no: '9', title: '주요 공급사와의 장기 계약 비율(%)을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.05.08', campaigns: 0 },
    { no: '10', title: '공급망 리스크 지도(Risk Map) 작성 여부를 선택해 주세요.', type: '라디오', attachment: 'N', updated: '26.04.18', campaigns: 1, campaignList: [{ name: '2026 LG 협력사 ESG 평가', client: 'lg', period: '2026-04~07', status: '종료' }] },
  ],
  'D-인증': [
    { no: '1', title: '보유 중인 ISO 인증을 선택해 주세요.', type: '체크박스', attachment: 'N', updated: '26.09.10', campaigns: 3, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03~06', status: '종료' }, { name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05~08', status: '진행중' }, { name: '2026 LG 협력사 ESG 평가', client: 'lg', period: '2026-04~07', status: '종료' }] },
    { no: '1-1', parentNo: '1', title: 'ISO 9001(품질경영) 인증 취득 연도를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.09.10', campaigns: 0 },
    { no: '1-2', parentNo: '1', title: 'ISO 14001(환경경영) 인증 취득 연도를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.09.10', campaigns: 0 },
    { no: '2', title: '정부·기관 표창 또는 우수기업 지정 현황을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.09.05', campaigns: 2, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03~06', status: '종료' }, { name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05~08', status: '진행중' }] },
    { no: '2-1', parentNo: '2', title: '수상 연도 및 수여 기관을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.09.05', campaigns: 0 },
    { no: '3', title: '특허 등 지식재산권 보유 현황을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.08.22', campaigns: 1, campaignList: [{ name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05~08', status: '진행중' }] },
    { no: '3-1', parentNo: '3', title: '등록 특허 건수를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.08.22', campaigns: 0 },
    { no: '4', title: '안전보건경영시스템(ISO 45001) 인증 여부를 선택해 주세요.', type: '라디오', attachment: 'N', updated: '26.08.12', campaigns: 2, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03~06', status: '종료' }, { name: '2026 LG 협력사 ESG 평가', client: 'lg', period: '2026-04~07', status: '종료' }] },
    { no: '4-1', parentNo: '4', title: 'ISO 45001 인증 취득 연도를 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.08.12', campaigns: 0 },
    { no: '5', title: 'ESG 평가 등급(외부 기관) 취득 여부를 선택해 주세요.', type: '라디오', attachment: 'N', updated: '26.08.02', campaigns: 2, campaignList: [{ name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03~06', status: '종료' }, { name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05~08', status: '진행중' }] },
    { no: '5-1', parentNo: '5', title: '평가 기관명 및 등급을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.08.02', campaigns: 0 },
    { no: '6', title: '탄소경영 인증(CDP 등) 취득 여부를 선택해 주세요.', type: '라디오', attachment: 'N', updated: '26.07.18', campaigns: 0 },
    { no: '7', title: '공정무역 또는 사회적 책임 인증 여부를 선택해 주세요.', type: '라디오', attachment: 'N', updated: '26.06.28', campaigns: 0 },
    { no: '8', title: '정보보호 인증(ISMS-P 등) 취득 여부를 선택해 주세요.', type: '라디오', attachment: 'N', updated: '26.06.08', campaigns: 0 },
    { no: '9', title: '여성기업·사회적기업 등 특수 인증 보유 여부를 선택해 주세요.', type: '라디오', attachment: 'N', updated: '26.05.18', campaigns: 0 },
    { no: '10', title: '기타 보유 인증 현황을 입력해 주세요.', type: '텍스트', attachment: 'N', updated: '26.04.28', campaigns: 0 },
  ],
};

type QuestionSeed = readonly [
  title: string,
  type: string,
  children?: readonly (readonly [title: string, type: string])[],
];

const EXAMPLE_CAMPAIGNS = [
  { name: '2026 삼성 공급망 ESG 평가', client: 'samsung', period: '2026-03 ~ 2026-06', status: '종료' },
  { name: '2026 SK 협력사 ESG 평가', client: 'sk', period: '2026-05 ~ 2026-08', status: '진행중' },
  { name: '2026 LG 협력사 ESG 평가', client: 'lg', period: '2026-04 ~ 2026-07', status: '종료' },
];

const getDefaultChildSeeds = (type: string): readonly (readonly [title: string, type: string])[] => {
  if (type === '라디오') {
    return [
      ['‘예’라고 응답한 경우 적용 범위와 최근 운영 실적을 입력해 주세요.', '텍스트'],
      ['관련 규정 또는 증빙자료를 보유하고 있습니까?', '라디오'],
    ];
  }
  if (type === '체크박스' || type === '드롭다운') {
    return [['선택한 항목별 세부 내용과 적용 범위를 입력해 주세요.', '텍스트']];
  }
  if (type === '정량데이터') {
    return [['입력한 수치의 산정 기준과 대상 기간을 입력해 주세요.', '텍스트']];
  }
  return [['입력한 내용의 근거와 관련 증빙자료를 설명해 주세요.', '텍스트']];
};

const buildQuestionExamples = (seeds: readonly QuestionSeed[]): Question[] =>
  seeds.flatMap(([title, type, children], index) => {
    const no = String(index + 1);
    const campaigns = (index + 1) % 4;
    const parent: Question = {
      no,
      title,
      type,
      attachment: index % 3 === 1 ? 'Y' : 'N',
      updated: `26.${String(9 - (index % 6)).padStart(2, '0')}.${String(10 + index).padStart(2, '0')}`,
      campaigns,
      campaignList: EXAMPLE_CAMPAIGNS.slice(0, campaigns),
      industryCode: 0,
    };
    const childSeeds = children?.length ? children : getDefaultChildSeeds(type);
    const childQuestions: Question[] = childSeeds.map(([childTitle, childType], childIndex) => ({
      no: `${no}-${childIndex + 1}`,
      parentNo: no,
      title: childTitle,
      type: childType,
      attachment: 'N',
      updated: parent.updated,
      campaigns: 1,
      campaignList: [EXAMPLE_CAMPAIGNS[0]],
    }));
    return [parent, ...childQuestions];
  });

const ADDITIONAL_QUESTION_SEEDS: Record<string, readonly QuestionSeed[]> = {
  'L-근로': [
    ['주당 근로시간을 관련 법령에 맞게 관리하고 있습니까?', '라디오', [
      ['최근 3개월의 주당 평균 근로시간을 입력해 주세요.', '정량데이터'],
      ['연장근로에 대한 근로자 동의 절차가 있습니까?', '라디오'],
    ]],
    ['근로계약서에 근로시간과 휴게시간을 명시하고 있습니까?', '라디오'],
    ['연장·야간·휴일근로 현황을 별도로 관리하고 있습니까?', '라디오'],
    ['근로시간 기록 시스템의 운영 방식을 선택해 주세요.', '드롭다운'],
    ['법정 휴게시간 준수 여부를 정기적으로 점검하고 있습니까?', '라디오'],
    ['교대근무자의 건강보호 조치를 운영하고 있습니까?', '라디오'],
    ['근로시간 위반 발생 시 시정 절차를 입력해 주세요.', '텍스트'],
  ],
  'L-임금': [
    ['최저임금 이상을 모든 근로자에게 지급하고 있습니까?', '라디오', [
      ['최저임금 준수 여부를 점검하는 주기를 선택해 주세요.', '드롭다운'],
    ]],
    ['급여명세서를 근로자에게 정기적으로 제공하고 있습니까?', '라디오'],
    ['연장·야간·휴일근로 수당을 구분하여 지급하고 있습니까?', '라디오'],
    ['동일가치노동 동일임금 원칙을 적용하고 있습니까?', '라디오'],
    ['성과급 산정 기준을 근로자에게 공개하고 있습니까?', '라디오'],
    ['임금체불 발생 건수를 입력해 주세요.', '정량데이터'],
    ['임금 관련 이의제기 및 구제 절차를 운영하고 있습니까?', '라디오'],
  ],
  'L-휴가': [
    ['연차유급휴가 사용을 보장하고 있습니까?', '라디오', [
      ['전년도 연차휴가 평균 사용률(%)을 입력해 주세요.', '정량데이터'],
    ]],
    ['출산전후휴가 및 배우자 출산휴가 제도를 운영하고 있습니까?', '라디오'],
    ['육아휴직 사용자의 복직을 보장하고 있습니까?', '라디오'],
    ['가족돌봄휴가 및 휴직 제도를 안내하고 있습니까?', '라디오'],
    ['휴가 신청 및 승인 절차를 선택해 주세요.', '드롭다운'],
    ['미사용 연차휴가에 대한 처리 기준이 있습니까?', '라디오'],
    ['휴직자에 대한 인사상 불이익 금지 규정이 있습니까?', '라디오'],
  ],
  'L-비정규': [
    ['비정규직 근로자의 고용 현황을 관리하고 있습니까?', '라디오', [
      ['전체 근로자 대비 비정규직 비율(%)을 입력해 주세요.', '정량데이터'],
      ['비정규직의 평균 계약 기간을 입력해 주세요.', '정량데이터'],
    ]],
    ['비정규직에게 정규직과 동등한 복리후생을 제공하고 있습니까?', '라디오'],
    ['정규직 전환 기준과 절차를 운영하고 있습니까?', '라디오'],
    ['파견·도급 근로자의 근로조건을 점검하고 있습니까?', '라디오'],
    ['비정규직 차별 시정 절차를 마련하고 있습니까?', '라디오'],
    ['기간제 근로계약 갱신 기준을 사전에 안내하고 있습니까?', '라디오'],
    ['최근 1년간 정규직 전환 인원을 입력해 주세요.', '정량데이터'],
  ],
  'S-인권정책': [
    ['국제 인권 원칙을 반영한 인권경영 정책을 보유하고 있습니까?', '라디오', [
      ['인권정책의 최종 승인 주체를 선택해 주세요.', '드롭다운'],
    ]],
    ['인권정책을 임직원과 외부 이해관계자에게 공개하고 있습니까?', '라디오'],
    ['정기적인 인권영향평가를 실시하고 있습니까?', '라디오'],
    ['인권 리스크가 높은 사업장을 별도로 관리하고 있습니까?', '라디오'],
    ['협력사 행동규범에 인권 기준을 포함하고 있습니까?', '라디오'],
    ['인권교육 대상과 운영 주기를 입력해 주세요.', '텍스트'],
    ['인권경영 성과를 이사회에 보고하고 있습니까?', '라디오'],
  ],
  'S-차별': [
    ['고용 및 업무상 차별 금지 규정을 보유하고 있습니까?', '라디오', [
      ['차별 금지 사유를 모두 선택해 주세요.', '체크박스'],
    ]],
    ['채용 과정에서 지원자의 다양성을 고려하고 있습니까?', '라디오'],
    ['장애인 근로자를 위한 합리적 편의를 제공하고 있습니까?', '라디오'],
    ['성별 임금격차를 정기적으로 분석하고 있습니까?', '라디오'],
    ['차별 사건 신고자에 대한 보호 절차가 있습니까?', '라디오'],
    ['최근 1년간 확인된 차별 사건 수를 입력해 주세요.', '정량데이터'],
    ['차별 사건에 대한 재발방지 교육을 실시하고 있습니까?', '라디오'],
  ],
  'S-아동': [
    ['아동노동 금지 정책을 보유하고 있습니까?', '라디오', [
      ['채용 시 연령을 확인하는 증빙자료를 선택해 주세요.', '체크박스'],
    ]],
    ['모든 신규 입사자의 연령을 확인하고 있습니까?', '라디오'],
    ['청소년 근로자의 근로시간을 별도로 관리하고 있습니까?', '라디오'],
    ['고위험 국가의 공급망에서 아동노동 리스크를 평가하고 있습니까?', '라디오'],
    ['아동노동 발견 시 구제 절차를 마련하고 있습니까?', '라디오'],
    ['협력사의 아동노동 예방 조치를 점검하고 있습니까?', '라디오'],
    ['최근 3년간 아동노동 적발 건수를 입력해 주세요.', '정량데이터'],
  ],
  'S-강제': [
    ['강제노동 및 인신매매 금지 정책을 보유하고 있습니까?', '라디오', [
      ['금지하고 있는 강제노동 유형을 모두 선택해 주세요.', '체크박스'],
    ]],
    ['근로자의 신분증이나 여권을 보관하지 않습니까?', '라디오'],
    ['채용수수료를 근로자에게 부담시키지 않습니까?', '라디오'],
    ['근로자가 자유롭게 퇴사할 권리를 보장하고 있습니까?', '라디오'],
    ['외국인 근로자의 계약 내용을 모국어로 제공하고 있습니까?', '라디오'],
    ['강제노동 고위험 협력사를 평가하고 있습니까?', '라디오'],
    ['강제노동 의심 사례의 조사 절차를 입력해 주세요.', '텍스트'],
  ],
  'S-결사': [
    ['근로자의 결사의 자유와 단체교섭권을 보장하고 있습니까?', '라디오', [
      ['현재 노동조합 또는 근로자협의회 유형을 선택해 주세요.', '드롭다운'],
    ]],
    ['노동조합 가입을 이유로 불이익을 주지 않습니까?', '라디오'],
    ['노사협의회를 정기적으로 개최하고 있습니까?', '라디오'],
    ['단체협약 적용 대상 근로자 비율(%)을 입력해 주세요.', '정량데이터'],
    ['경영상 중요 변경사항을 근로자 대표와 협의하고 있습니까?', '라디오'],
    ['근로자 대표의 활동 시간을 보장하고 있습니까?', '라디오'],
    ['최근 1년간 노사협의회 개최 횟수를 입력해 주세요.', '정량데이터'],
  ],
  'E-환경정책': [
    ['최고경영자의 승인을 받은 환경경영 정책이 있습니까?', '라디오', [
      ['환경정책의 최근 개정 연도를 입력해 주세요.', '텍스트'],
    ]],
    ['환경 법규 및 규제 목록을 정기적으로 관리하고 있습니까?', '라디오'],
    ['사업장별 환경 목표와 실행계획을 수립하고 있습니까?', '라디오'],
    ['환경경영시스템 인증을 보유하고 있습니까?', '체크박스'],
    ['환경사고 대응 매뉴얼과 비상훈련 체계를 운영하고 있습니까?', '라디오'],
    ['환경성과를 경영진에게 정기적으로 보고하고 있습니까?', '라디오'],
    ['최근 3년간 환경 법규 위반 건수를 입력해 주세요.', '정량데이터'],
  ],
  'E-온실': [
    ['온실가스 배출량을 정기적으로 산정하고 있습니까?', '라디오', [
      ['최근 연도 Scope 1 배출량(tCO₂e)을 입력해 주세요.', '정량데이터'],
      ['최근 연도 Scope 2 배출량(tCO₂e)을 입력해 주세요.', '정량데이터'],
    ]],
    ['온실가스 배출량에 대한 제3자 검증을 받고 있습니까?', '라디오'],
    ['중장기 온실가스 감축 목표를 수립하고 있습니까?', '라디오'],
    ['Scope 3 배출량 산정 범위를 선택해 주세요.', '체크박스'],
    ['사업장별 감축 과제를 관리하고 있습니까?', '라디오'],
    ['내부 탄소가격을 의사결정에 활용하고 있습니까?', '라디오'],
    ['기준연도 대비 배출량 감축률(%)을 입력해 주세요.', '정량데이터'],
  ],
  'E-폐기물': [
    ['폐기물 발생량을 종류별로 관리하고 있습니까?', '라디오', [
      ['일반폐기물 연간 발생량(ton)을 입력해 주세요.', '정량데이터'],
      ['지정폐기물 연간 발생량(ton)을 입력해 주세요.', '정량데이터'],
    ]],
    ['폐기물 보관 및 처리 기준을 문서화하고 있습니까?', '라디오'],
    ['폐기물 처리업체의 인허가를 정기적으로 확인하고 있습니까?', '라디오'],
    ['폐기물 재활용 목표를 수립하고 있습니까?', '라디오'],
    ['제품 및 포장재 감량 활동을 운영하고 있습니까?', '라디오'],
    ['폐기물 이동 및 인계 기록을 보관하고 있습니까?', '라디오'],
    ['최근 연도 폐기물 재활용률(%)을 입력해 주세요.', '정량데이터'],
  ],
  'E-수자원': [
    ['사업장별 용수 사용량을 관리하고 있습니까?', '라디오', [
      ['최근 연도 총 용수 취수량(ton)을 입력해 주세요.', '정량데이터'],
      ['최근 연도 재이용수 사용량(ton)을 입력해 주세요.', '정량데이터'],
    ]],
    ['용수 절감 목표와 실행계획을 수립하고 있습니까?', '라디오'],
    ['수자원 스트레스 지역의 사업장을 식별하고 있습니까?', '라디오'],
    ['폐수 배출 수질을 정기적으로 측정하고 있습니까?', '라디오'],
    ['폐수처리시설 비상 대응 절차를 운영하고 있습니까?', '라디오'],
    ['협력사의 수자원 리스크를 평가하고 있습니까?', '라디오'],
    ['기준연도 대비 용수 사용 절감률(%)을 입력해 주세요.', '정량데이터'],
  ],
  'E-에너지': [
    ['사업장별 에너지 사용량을 정기적으로 관리하고 있습니까?', '라디오', [
      ['최근 연도 전력 사용량(MWh)을 입력해 주세요.', '정량데이터'],
      ['최근 연도 연료 사용량(GJ)을 입력해 주세요.', '정량데이터'],
    ]],
    ['에너지 절감 목표와 투자계획을 수립하고 있습니까?', '라디오'],
    ['고효율 설비로의 교체 활동을 추진하고 있습니까?', '라디오'],
    ['재생에너지를 구매하거나 직접 생산하고 있습니까?', '라디오'],
    ['에너지 진단을 정기적으로 실시하고 있습니까?', '라디오'],
    ['제품 생산량 대비 에너지 원단위를 관리하고 있습니까?', '라디오'],
    ['최근 연도 재생에너지 사용 비율(%)을 입력해 주세요.', '정량데이터'],
  ],
  'ET-윤리경영': [
    ['임직원 윤리규정 또는 행동강령을 보유하고 있습니까?', '라디오', [
      ['행동강령 적용 대상을 모두 선택해 주세요.', '체크박스'],
    ]],
    ['윤리경영 전담 조직과 책임자를 지정하고 있습니까?', '라디오'],
    ['전 임직원을 대상으로 윤리교육을 실시하고 있습니까?', '라디오'],
    ['윤리규정 위반에 대한 징계 기준을 운영하고 있습니까?', '라디오'],
    ['익명 신고가 가능한 제보 채널을 운영하고 있습니까?', '라디오'],
    ['윤리경영 성과를 이사회에 보고하고 있습니까?', '라디오'],
    ['최근 1년간 윤리교육 이수율(%)을 입력해 주세요.', '정량데이터'],
  ],
  'ET-공정거래': [
    ['공정거래 법규 준수 정책을 보유하고 있습니까?', '라디오', [
      ['공정거래 교육 대상 직무를 모두 선택해 주세요.', '체크박스'],
    ]],
    ['협력사 선정 및 평가 기준을 공개하고 있습니까?', '라디오'],
    ['표준계약서를 사용하고 계약서를 교부하고 있습니까?', '라디오'],
    ['하도급 대금을 법정 기한 내 지급하고 있습니까?', '라디오'],
    ['부당한 기술자료 요구를 금지하고 있습니까?', '라디오'],
    ['불공정거래 신고 및 구제 절차를 운영하고 있습니까?', '라디오'],
    ['최근 3년간 공정거래 법규 위반 건수를 입력해 주세요.', '정량데이터'],
  ],
  'ET-부패': [
    ['뇌물 및 부패 방지 정책을 보유하고 있습니까?', '라디오', [
      ['부패 리스크 평가 대상 지역을 선택해 주세요.', '체크박스'],
    ]],
    ['선물·접대·기부금 승인 기준을 운영하고 있습니까?', '라디오'],
    ['고위험 직무 대상 부패방지 교육을 실시하고 있습니까?', '라디오'],
    ['제3자와 거래 전 부패 리스크를 검토하고 있습니까?', '라디오'],
    ['정치적 기부 및 후원 내역을 관리하고 있습니까?', '라디오'],
    ['부패 신고자 보호 및 보복 금지 절차가 있습니까?', '라디오'],
    ['최근 3년간 확인된 부패 사건 수를 입력해 주세요.', '정량데이터'],
  ],
  'ET-이해충돌': [
    ['이해충돌 방지 규정을 보유하고 있습니까?', '라디오', [
      ['신고가 필요한 이해충돌 유형을 모두 선택해 주세요.', '체크박스'],
    ]],
    ['임직원에게 이해충돌 여부를 정기적으로 확인하고 있습니까?', '라디오'],
    ['특수관계인 거래에 대한 사전 승인 절차가 있습니까?', '라디오'],
    ['겸직 및 외부활동 승인 기준을 운영하고 있습니까?', '라디오'],
    ['구매 담당자의 친족 관계를 점검하고 있습니까?', '라디오'],
    ['이해충돌 신고 내용을 독립적으로 검토하고 있습니까?', '라디오'],
    ['최근 1년간 접수된 이해충돌 신고 건수를 입력해 주세요.', '정량데이터'],
  ],
  'ET-개인정보': [
    ['개인정보 보호 정책과 내부관리계획을 보유하고 있습니까?', '라디오', [
      ['보유 중인 개인정보 유형을 모두 선택해 주세요.', '체크박스'],
    ]],
    ['개인정보 수집 및 이용 동의를 적법하게 받고 있습니까?', '라디오'],
    ['개인정보 보유기간 만료 시 안전하게 파기하고 있습니까?', '라디오'],
    ['개인정보 처리 위탁업체를 정기적으로 점검하고 있습니까?', '라디오'],
    ['개인정보 유출사고 대응 절차를 운영하고 있습니까?', '라디오'],
    ['개인정보 접근권한을 최소한으로 부여하고 있습니까?', '라디오'],
    ['최근 3년간 개인정보 침해사고 건수를 입력해 주세요.', '정량데이터'],
  ],
  'M-지배구조': [
    ['이사회 구성과 운영 규정을 보유하고 있습니까?', '라디오', [
      ['현재 이사회 구성원 수를 입력해 주세요.', '정량데이터'],
      ['사외이사 비율(%)을 입력해 주세요.', '정량데이터'],
    ]],
    ['이사회 내 ESG 관련 책임과 역할을 정의하고 있습니까?', '라디오'],
    ['이사회의 다양성과 전문성을 고려하고 있습니까?', '라디오'],
    ['이사회 활동을 정기적으로 평가하고 있습니까?', '라디오'],
    ['감사기구의 독립성을 보장하고 있습니까?', '라디오'],
    ['주주 의결권 행사를 위한 정보를 충분히 제공하고 있습니까?', '라디오'],
    ['최근 연도 이사회 개최 횟수를 입력해 주세요.', '정량데이터'],
  ],
  'M-공급망': [
    ['협력사 ESG 행동규범을 제정하고 있습니까?', '라디오', [
      ['행동규범 서약을 완료한 협력사 비율(%)을 입력해 주세요.', '정량데이터'],
    ]],
    ['신규 협력사 선정 시 ESG 기준을 반영하고 있습니까?', '라디오'],
    ['협력사 ESG 리스크 평가를 정기적으로 실시하고 있습니까?', '라디오'],
    ['고위험 협력사에 대한 현장실사를 실시하고 있습니까?', '라디오'],
    ['협력사의 개선조치 이행 여부를 추적하고 있습니까?', '라디오'],
    ['협력사 대상 ESG 교육 및 지원 프로그램을 운영하고 있습니까?', '라디오'],
    ['최근 연도 ESG 평가 협력사 수를 입력해 주세요.', '정량데이터'],
  ],
  'M-ESG공시': [
    ['ESG 또는 지속가능경영 보고서를 발간하고 있습니까?', '라디오', [
      ['적용 중인 공시 기준을 모두 선택해 주세요.', '체크박스'],
    ]],
    ['중요성 평가를 통해 핵심 ESG 이슈를 선정하고 있습니까?', '라디오'],
    ['공시 데이터의 내부 검증 절차를 운영하고 있습니까?', '라디오'],
    ['주요 ESG 지표에 대해 제3자 검증을 받고 있습니까?', '라디오'],
    ['기후 관련 재무정보를 별도로 공시하고 있습니까?', '라디오'],
    ['ESG 정보의 보고 범위와 경계를 명시하고 있습니까?', '라디오'],
    ['최근 지속가능경영 보고서 발간 연도를 입력해 주세요.', '텍스트'],
  ],
  'M-리스크': [
    ['전사 리스크 관리 체계를 구축하고 있습니까?', '라디오', [
      ['관리 중인 주요 ESG 리스크를 모두 선택해 주세요.', '체크박스'],
    ]],
    ['ESG 리스크를 전사 리스크 목록에 통합하고 있습니까?', '라디오'],
    ['리스크별 담당자와 대응계획을 지정하고 있습니까?', '라디오'],
    ['중대 리스크를 이사회에 정기적으로 보고하고 있습니까?', '라디오'],
    ['기후변화 시나리오 분석을 실시하고 있습니까?', '라디오'],
    ['사업연속성계획과 위기대응 훈련을 운영하고 있습니까?', '라디오'],
    ['최근 연도 리스크 대응 훈련 횟수를 입력해 주세요.', '정량데이터'],
  ],
  'M-이해관계자': [
    ['주요 이해관계자 그룹을 식별하고 있습니까?', '라디오', [
      ['관리 중인 이해관계자 그룹을 모두 선택해 주세요.', '체크박스'],
    ]],
    ['이해관계자별 소통 채널과 담당자를 지정하고 있습니까?', '라디오'],
    ['정기적인 이해관계자 의견수렴을 실시하고 있습니까?', '라디오'],
    ['접수된 의견을 경영 의사결정에 반영하고 있습니까?', '라디오'],
    ['지역사회 영향평가 및 지원 활동을 운영하고 있습니까?', '라디오'],
    ['고객 불만의 처리기한과 절차를 관리하고 있습니까?', '라디오'],
    ['최근 1년간 이해관계자 간담회 개최 횟수를 입력해 주세요.', '정량데이터'],
  ],
};

Object.entries(ADDITIONAL_QUESTION_SEEDS).forEach(([folderId, seeds]) => {
  QUESTIONS_BY_FOLDER[folderId] = buildQuestionExamples(seeds);
});

// BUG 5: Ensure all explicit child questions have at least 1 campaign
Object.values(QUESTIONS_BY_FOLDER).forEach(questions => {
  questions.forEach(q => {
    if (q.parentNo && !q.campaigns) {
      q.campaigns = 1;
      q.campaignList = [EXAMPLE_CAMPAIGNS[0]];
    }
  });
});

// BUG 4: Add 2 industry-specific (non-zero industryCode) questions to every folder
const _INDUSTRY_CODES_CYCLE = [1, 2, 3, 4];
const _INDUSTRY_EXTRA_QUESTIONS: Record<string, [string, string, number, string, string, number][]> = {
  'L-고용':    [['생산직 근로자 안전보건 교육 실시 여부를 선택해 주세요.', '라디오', 1, 'N', '26.09.01', 0], ['조달 근로자의 인권 실태 점검 여부를 선택해 주세요.', '라디오', 2, 'N', '26.09.01', 1]],
  'L-근로':    [['생산 현장 교대근무자 건강보호 조치를 운영하고 있습니까?', '라디오', 1, 'N', '26.09.01', 1], ['유통 물류 근로자 야간작업 관리 기준을 보유하고 있습니까?', '라디오', 3, 'N', '26.09.01', 2]],
  'L-임금':    [['생산직 성과급 산정 기준을 공개하고 있습니까?', '라디오', 1, 'N', '26.09.01', 0], ['원자재 조달 인력 급여 지급 현황을 관리하고 있습니까?', '라디오', 2, 'N', '26.09.01', 1]],
  'L-휴가':    [['식품업 교대 근무자 육아휴직 사용 현황을 파악하고 있습니까?', '라디오', 4, 'N', '26.09.01', 0], ['유통업 계절성 인력의 연차 관리 기준이 있습니까?', '라디오', 3, 'N', '26.09.01', 1]],
  'L-비정규':  [['생산 라인 파견 근로자 비중을 관리하고 있습니까?', '라디오', 1, 'N', '26.09.01', 0], ['식품 공장 기간제 근로자 전환 기준이 있습니까?', '라디오', 4, 'N', '26.09.01', 1]],
  'S-인권정책':[['원자재 채굴 현장 인권경영 적용 여부를 선택해 주세요.', '라디오', 2, 'N', '26.09.01', 0], ['식품 공급망 아동노동 모니터링 체계를 갖추고 있습니까?', '라디오', 4, 'N', '26.09.01', 1]],
  'S-차별':    [['생산직 여성 관리자 비율을 공개하고 있습니까?', '라디오', 1, 'N', '26.09.01', 0], ['유통 현장 외국인 근로자 차별 금지 조치를 운영하고 있습니까?', '라디오', 3, 'N', '26.09.01', 1]],
  'S-아동':    [['원자재 산지 아동노동 실태조사를 실시하고 있습니까?', '라디오', 2, 'N', '26.09.01', 0], ['식품 가공 현장 청소년 근로 제한 기준이 있습니까?', '라디오', 4, 'N', '26.09.01', 1]],
  'S-강제':    [['생산 공장 외국인 여권 보관 금지 여부를 확인하고 있습니까?', '라디오', 1, 'N', '26.09.01', 0], ['원자재 채굴 협력사의 강제노동 리스크를 평가하고 있습니까?', '라디오', 2, 'N', '26.09.01', 1]],
  'S-결사':    [['유통 물류 센터 근로자 조합 활동을 보장하고 있습니까?', '라디오', 3, 'N', '26.09.01', 0], ['식품 공장 노사협의회 운영 현황을 공개하고 있습니까?', '라디오', 4, 'N', '26.09.01', 1]],
  'E-환경정책':[['생산 공정 환경영향 평가를 정기적으로 실시하고 있습니까?', '라디오', 1, 'N', '26.09.01', 0], ['원자재 채굴로 인한 생태계 훼손 모니터링 체계가 있습니까?', '라디오', 2, 'N', '26.09.01', 1]],
  'E-온실':    [['생산 설비 에너지 효율화 투자 현황을 관리하고 있습니까?', '라디오', 1, 'N', '26.09.01', 0], ['유통 물류 차량의 온실가스 배출량을 산정하고 있습니까?', '라디오', 3, 'N', '26.09.01', 1]],
  'E-폐기물':  [['식품 포장재 폐기물 감량 목표를 수립하고 있습니까?', '라디오', 4, 'N', '26.09.01', 0], ['생산 공정 부산물의 재활용 비율을 관리하고 있습니까?', '라디오', 1, 'N', '26.09.01', 1]],
  'E-수자원':  [['식품 가공 용수 재이용률을 관리하고 있습니까?', '라디오', 4, 'N', '26.09.01', 0], ['원자재 채굴 지역 수자원 오염 리스크를 평가하고 있습니까?', '라디오', 2, 'N', '26.09.01', 1]],
  'E-에너지':  [['생산 공장 재생에너지 전환 계획을 수립하고 있습니까?', '라디오', 1, 'N', '26.09.01', 0], ['유통 물류 센터 에너지 사용량을 정기적으로 측정하고 있습니까?', '라디오', 3, 'N', '26.09.01', 1]],
  'ET-윤리경영':[['원자재 조달 파트너사 행동강령 서약 현황을 관리하고 있습니까?', '라디오', 2, 'N', '26.09.01', 0], ['식품 유통 채널의 불공정 관행 모니터링 체계가 있습니까?', '라디오', 4, 'N', '26.09.01', 1]],
  'ET-공정거래':[['생산 설비 부품 조달 시 우월적 지위 남용 방지 기준이 있습니까?', '라디오', 1, 'N', '26.09.01', 0], ['유통 납품업체에 표준계약서를 사용하고 있습니까?', '라디오', 3, 'N', '26.09.01', 1]],
  'ET-부패':   [['원자재 채굴국 부패 리스크를 평가하고 있습니까?', '라디오', 2, 'N', '26.09.01', 0], ['식품 인허가 관련 부패 방지 절차를 운영하고 있습니까?', '라디오', 4, 'N', '26.09.01', 1]],
  'ET-이해충돌':[['생산 구매 담당자의 이해충돌 신고 현황을 관리하고 있습니까?', '라디오', 1, 'N', '26.09.01', 0], ['유통 바이어와의 특수관계 거래를 별도로 관리하고 있습니까?', '라디오', 3, 'N', '26.09.01', 1]],
  'ET-개인정보':[['식품 소비자 개인정보 수집·이용 동의 절차를 운영하고 있습니까?', '라디오', 4, 'N', '26.09.01', 0], ['원자재 거래처 담당자 정보 보호 기준이 있습니까?', '라디오', 2, 'N', '26.09.01', 1]],
  'M-지배구조': [['생산 법인의 이사회 구성 현황을 공개하고 있습니까?', '라디오', 1, 'N', '26.09.01', 0], ['유통 자회사 지배구조 리스크를 평가하고 있습니까?', '라디오', 3, 'N', '26.09.01', 1]],
  'M-공급망':  [['원자재 1차 공급사의 ESG 역량을 평가하고 있습니까?', '라디오', 2, 'N', '26.09.01', 0], ['식품 원료 공급망 추적 체계를 갖추고 있습니까?', '라디오', 4, 'N', '26.09.01', 1]],
  'M-ESG공시': [['생산 공장별 환경 데이터를 별도로 공시하고 있습니까?', '라디오', 1, 'N', '26.09.01', 0], ['유통 물류 탄소발자국 공시 계획이 있습니까?', '라디오', 3, 'N', '26.09.01', 1]],
  'M-리스크':  [['원자재 가격 변동에 따른 리스크 시나리오를 분석하고 있습니까?', '라디오', 2, 'N', '26.09.01', 0], ['식품 안전 리스크를 전사 리스크 체계에 통합하고 있습니까?', '라디오', 4, 'N', '26.09.01', 1]],
  'M-이해관계자':[['생산 지역사회 주민과의 소통 채널을 운영하고 있습니까?', '라디오', 1, 'N', '26.09.01', 0], ['유통 가맹점주와 정기적인 의견수렴을 실시하고 있습니까?', '라디오', 3, 'N', '26.09.01', 1]],
  'D-회사':    [['제조업 생산거점 현황을 공개하고 있습니까?', '라디오', 1, 'N', '26.09.01', 0], ['식품 위생 인허가 현황을 관리하고 있습니까?', '라디오', 4, 'N', '26.09.01', 1]],
  'D-인력':    [['생산 라인 교대 인력 현황을 별도로 관리하고 있습니까?', '라디오', 1, 'N', '26.09.01', 0], ['유통 물류 센터 인력 운용 현황을 파악하고 있습니까?', '라디오', 3, 'N', '26.09.01', 1]],
  'D-재무':    [['원자재 가격 변동이 매출에 미치는 영향을 공개하고 있습니까?', '라디오', 2, 'N', '26.09.01', 0], ['식품 원가율 및 수익성 지표를 관리하고 있습니까?', '라디오', 4, 'N', '26.09.01', 1]],
  'D-공급망':  [['생산용 핵심 원자재 조달처를 다변화하고 있습니까?', '라디오', 1, 'N', '26.09.01', 0], ['식품 원료의 원산지 이력 추적 체계를 갖추고 있습니까?', '라디오', 4, 'N', '26.09.01', 1]],
  'D-인증':    [['원자재 채취 관련 국제 인증(예: RJC, ASC)을 보유하고 있습니까?', '라디오', 2, 'N', '26.09.01', 0], ['식품 안전 인증(HACCP, ISO 22000 등)을 보유하고 있습니까?', '라디오', 4, 'N', '26.09.01', 1]],
};

Object.keys(QUESTIONS_BY_FOLDER).forEach((folderId) => {
  const extras = _INDUSTRY_EXTRA_QUESTIONS[folderId];
  if (!extras) return;
  const parentCount = QUESTIONS_BY_FOLDER[folderId].filter(q => !q.parentNo).length;
  extras.forEach(([title, type, ic, attachment, updated, campIdx], i) => {
    QUESTIONS_BY_FOLDER[folderId].push({
      no: String(parentCount + i + 1),
      title,
      type,
      attachment,
      updated,
      campaigns: 1,
      industryCode: ic,
      campaignList: [EXAMPLE_CAMPAIGNS[campIdx % 3]],
    });
  });
});

// 기본 SET은 독립 질의만 관리하며 기존 자식 질의는 노출·편집 대상에서 제외한다.
Object.keys(QUESTIONS_BY_FOLDER).forEach(folderId => {
  QUESTIONS_BY_FOLDER[folderId] = QUESTIONS_BY_FOLDER[folderId]
    .filter(question => !question.parentNo)
    .map(question => ({ ...question, type: normalizeQuestionType(question.type) }));
});

const INDUSTRY_SPECIALIZED_TITLES: Record<string, string[]> = {
  'I-제조': [
    '생산 공정별 에너지 사용량을 관리하고 있습니까?', '설비별 온실가스 배출량을 산정하고 있습니까?',
    '생산 부산물의 재활용률을 관리하고 있습니까?', '유해화학물질 사용 저감 목표를 수립하고 있습니까?',
    '제품 전 과정 환경영향을 평가하고 있습니까?', '생산설비 안전점검을 정기적으로 실시하고 있습니까?',
    '스마트팩토리 데이터를 ESG 성과관리에 활용하고 있습니까?', '협력 제조사의 품질·환경 리스크를 평가하고 있습니까?',
    '제품 회수 및 리콜 대응 절차를 운영하고 있습니까?', '친환경 제품 매출 비중을 관리하고 있습니까?',
    '생산직 근로자의 안전교육 이수율을 관리하고 있습니까?', '노후 설비 교체 계획을 수립하고 있습니까?',
  ],
  'I-원자재': [
    '핵심 원자재의 원산지 추적 체계를 운영하고 있습니까?', '분쟁광물 사용 여부를 정기적으로 확인하고 있습니까?',
    '원자재 채굴 지역의 인권 리스크를 평가하고 있습니까?', '책임 있는 원자재 구매 정책을 보유하고 있습니까?',
    '재생 원료 사용 비율을 관리하고 있습니까?', '원자재 가격 변동 리스크 대응계획을 수립하고 있습니까?',
    '고위험 원산지에 대한 실사를 수행하고 있습니까?', '원자재 공급업체의 환경 인허가를 확인하고 있습니까?',
    '산림 훼손 방지 원칙을 구매기준에 반영하고 있습니까?', '원자재 운송 과정의 탄소배출량을 측정하고 있습니까?',
    '인증 원자재 구매 비중을 관리하고 있습니까?', '원자재 대체 소재 개발 계획을 보유하고 있습니까?',
  ],
  'I-유통': [
    '물류 차량의 온실가스 배출량을 관리하고 있습니까?', '친환경 포장재 사용 비율을 관리하고 있습니까?',
    '반품·폐기 상품 감축 목표를 수립하고 있습니까?', '물류센터 에너지 효율을 정기적으로 점검하고 있습니까?',
    '유통기한 임박 상품의 기부 체계를 운영하고 있습니까?', '배송 협력사의 안전운전 기준을 관리하고 있습니까?',
    '고객 개인정보 보호 점검을 정기적으로 수행하고 있습니까?', '공정한 입점·납품 거래기준을 운영하고 있습니까?',
    '친환경 배송수단 전환 계획을 수립하고 있습니까?', '매장 폐기물 분리배출 성과를 관리하고 있습니까?',
    '공급망 재고 리스크를 실시간으로 모니터링하고 있습니까?', '소비자 불만 처리기한을 관리하고 있습니까?',
  ],
  'I-서비스': [
    '서비스 제공 과정의 에너지 사용량을 관리하고 있습니까?', '고객 데이터 보호를 위한 접근통제를 운영하고 있습니까?',
    '디지털 서비스의 접근성을 정기적으로 점검하고 있습니까?', '고객 만족도와 불만 처리 성과를 관리하고 있습니까?',
    '서비스 협력사의 노동·인권 리스크를 평가하고 있습니까?', '임직원 정보보안 교육을 정기적으로 실시하고 있습니까?',
    '서비스 중단에 대비한 업무연속성계획을 운영하고 있습니까?', '친환경 서비스 또는 솔루션 매출을 관리하고 있습니까?',
    'AI·알고리즘 윤리 원칙을 수립하고 있습니까?', '고객 정보 파기 절차를 정기적으로 점검하고 있습니까?',
    '서비스 품질 사고의 재발방지 절차를 운영하고 있습니까?', '원격근무 환경의 보안 기준을 운영하고 있습니까?',
  ],
};

Object.entries(INDUSTRY_SPECIALIZED_TITLES).forEach(([folderId, titles]) => {
  QUESTIONS_BY_FOLDER[folderId] = titles.map((title, index) => ({
    no: String(index + 1),
    title,
    type: index % 4 === 2 ? '정량데이터' : index % 4 === 3 ? '체크박스' : '라디오',
    attachment: index % 3 === 0 ? 'Y' : 'N',
    updated: `26.10.${String(18 - (index % 9)).padStart(2, '0')}`,
    campaigns: index % 4,
    campaignList: EXAMPLE_CAMPAIGNS.slice(0, index % 4),
    industryCode: 0,
  }));
});

const specializedPool = Object.values(INDUSTRY_SPECIALIZED_TITLES).flat();
const industryNames = ['제조', '원자재', '유통', '환경', '전기'];
FOLDER_TREE.flatMap(node => node.children ?? []).forEach((folder, folderIndex) => {
  const target = QUESTIONS_BY_FOLDER[folder.id] ?? (QUESTIONS_BY_FOLDER[folder.id] = []);
  const parentCount = target.filter(question => !question.parentNo).length;
  [0, 1].forEach(offset => target.push({
    no: String(parentCount + offset + 1),
    title: specializedPool[(folderIndex * 2 + offset) % specializedPool.length],
    type: offset ? '체크박스' : '라디오',
    attachment: offset ? 'N' : 'Y',
    updated: '26.10.18',
    campaigns: 0,
    industries: [industryNames[(folderIndex + offset) % industryNames.length]],
  }));
});
Object.keys(QUESTIONS_BY_FOLDER).filter(key => key.startsWith('I-')).forEach(key => delete QUESTIONS_BY_FOLDER[key]);

const DEFAULT_QUESTIONS = QUESTIONS_BY_FOLDER['L-고용'];

const firstCategoryValue = (folderId: string) => {
  const rootId = folderId.split('-')[0];
  const root = FOLDER_TREE.find(node => node.id === rootId);
  if (!root) return '-1차 카테고리-';
  const code = root.id === 'ET' ? 'C' : root.id;
  return `구분[${code}]:${root.label.replace(/^[▼▶]\s*/, '').replace(/^[A-Z]+\./, '')}`;
};

const secondCategoryCode = (firstCategory: string, secondCategory: string) => {
  const firstCode = firstCategory.match(/\[([A-Z]+)\]/)?.[1];
  const root = FOLDER_TREE.find(node => (node.id === 'ET' ? 'C' : node.id) === firstCode);
  const childIndex = root?.children?.findIndex(node => node.label === secondCategory) ?? -1;
  return childIndex >= 0 ? String(childIndex + 1) : secondCategory.match(/\[(\d+)\]/)?.[1] ?? '';
};

export function generateQuestionId(values: QuestionFormValues): string {
  const firstCode = values.firstCategory.match(/\[([A-Z]+)\]/)?.[1] ?? '';
  const secondCode = secondCategoryCode(values.firstCategory, values.secondCategory);
  const classificationCode = values.classification.match(/\[(\d+)\]/)?.[1] ?? '';
  const sequenceCode = values.sequence.replace(/\D/g, '');
  if (![firstCode, secondCode, classificationCode, sequenceCode].every(Boolean)) return '--';
  return `${firstCode}-${secondCode}-${classificationCode}-${sequenceCode}`;
}

export function createQuestionFormDefaults(question: Question, folderId: string): QuestionFormValues {
  if (question.form) return question.form;
  const secondCategory = FOLDER_TREE
    .flatMap(node => node.children ?? [])
    .find(node => node.id === folderId)?.label ?? '-2차 카테고리-';

  return {
    summary: '',
    firstCategory: firstCategoryValue(folderId),
    secondCategory,
    classification: '분류[1]:정책/인증/계획',
    sequence: question.parentNo ?? question.no,
    depth: '일반',
    industry: '산업분류',
    companyCode: '',
    required: 'yes',
    notApplicable: 'no',
    notApplicableReason: '',
    hasAttachment: question.attachment === 'Y' ? 'yes' : 'no',
    questionType: normalizeQuestionType(question.type),
    title: question.title,
    industries: question.industries ?? [],
  };
}

export function getFolderIdForForm(values: QuestionFormValues): string {
  for (const root of FOLDER_TREE) {
    const first = firstCategoryValue(root.id);
    if (first !== values.firstCategory) continue;
    const child = root.children?.find(node => node.label === values.secondCategory);
    if (child) return child.id;
  }
  return 'L-고용';
}

export function findMatchingBaseParent(values: QuestionFormValues): { question: Question; folderId: string } | undefined {
  for (const [folderId, questions] of Object.entries(QUESTIONS_BY_FOLDER)) {
    const question = questions.find(candidate => {
      if (candidate.parentNo) return false;
      const form = createQuestionFormDefaults(candidate, folderId);
      return form.firstCategory === values.firstCategory
        && form.secondCategory === values.secondCategory
        && form.classification === values.classification
        && form.sequence === values.sequence;
    });
    if (question) return { question, folderId };
  }
  return undefined;
}

export function getBaseChildCount(parentNo: string, folderId: string): number {
  return (QUESTIONS_BY_FOLDER[folderId] ?? []).filter(question => question.parentNo === parentNo).length;
}

interface Props {
  onNavigateAdd: (question?: Question, folderId?: string, mode?: 'edit' | 'child') => void;
  addedQuestions: Question[];
  editedQuestions: Question[];
  deletedQuestionKeys: Set<string>;
  readOnly?: boolean;
}

const questionKey = (folderId: string, no: string) => `${folderId}::${no}`;

export default function QuestionLibraryBasicSet({
  onNavigateAdd,
  addedQuestions,
  editedQuestions,
  deletedQuestionKeys,
  readOnly = false,
}: Props) {
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(['L', 'S', 'E', 'ET', 'M', 'D', 'I']));
  const [selectedFolder, setSelectedFolder] = useState('L-고용');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(
    () => new Set(['3', '4', '5', ...addedQuestions.flatMap(question => question.parentNo ? [question.parentNo] : [])]),
  );
  const [campaignModal, setCampaignModal] = useState<Question | null>(null);
  const [versionModal, setVersionModal] = useState(false);
  const [currentVersionName, setCurrentVersionName] = useState(() => localStorage.getItem('basic-set-current-version') ?? '2026 공급망 ESG 기본 SET v3.2');
  const [versions, setVersions] = useState<string[]>(() => {
    const stored = JSON.parse(localStorage.getItem('basic-set-versions') ?? '[]') as string[];
    return [...stored, '2026 공급망 ESG 기본 SET v3.2', '2026 공급망 ESG 기본 SET v3.1', '2026 공급망 ESG 기본 SET v3.0'].filter((value, index, all) => all.indexOf(value) === index);
  });
  const [selectedVersionName, setSelectedVersionName] = useState(() => localStorage.getItem('basic-set-current-version') ?? '2026 공급망 ESG 기본 SET v3.2');
  const [versionSnapshots, setVersionSnapshots] = useState<Record<string, Question[]>>({});
  const [updated, setUpdated] = useState('2026.09.17');
  const [newVersion, setNewVersion] = useState('');
  const [qType, setQType] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [searchText, setSearchText] = useState('');

  const isCurrentVersion = selectedVersionName === currentVersionName;
  const baseQuestions = (() => {
    const seenIds = new Map<string, number>();
    return (QUESTIONS_BY_FOLDER[selectedFolder] ?? DEFAULT_QUESTIONS)
      .filter(question => !isCurrentVersion || !deletedQuestionKeys.has(questionKey(selectedFolder, question.no)))
      .map(question => isCurrentVersion ? (editedQuestions.find(edited => edited.folderId === selectedFolder && edited.no === question.no) ?? question) : question)
      .map(question => {
        const rawId = generateQuestionId(createQuestionFormDefaults(question, selectedFolder));
        const count = seenIds.get(rawId) ?? 0;
        seenIds.set(rawId, count + 1);
        const questionId = count === 0 ? rawId : `${rawId}-${count}`;
        return { ...question, questionId };
      });
  })();
  const folderQuestions = [
    ...baseQuestions,
    ...(isCurrentVersion
      ? addedQuestions.filter(question => question.folderId === selectedFolder)
      : (versionSnapshots[selectedVersionName] ?? []).filter(question => question.folderId === selectedFolder)),
  ];
  const questions = folderQuestions.filter(question => !question.parentNo);

  const toggleFolder = (id: string) => {
    setOpenFolders(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleRow = (no: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(no)) next.delete(no);
      else next.add(no);
      return next;
    });
  };

  const folderLabel = FOLDER_TREE.flatMap(n => n.children ?? []).find(n => n.id === selectedFolder)?.label ?? '고용 관리';

  const visibleQuestions = questions
    .filter(question => !industryFilter || (question.industries ?? question.form?.industries ?? []).includes(industryFilter))
    .filter(question => !qType || normalizeQuestionType(question.type) === qType)
    .filter(question => !searchText.trim() || `${question.title} ${question.questionId ?? ''}`.toLowerCase().includes(searchText.trim().toLowerCase()));

  const handleSaveVersion = () => {
    if (newVersion.trim()) {
      const nextName = newVersion.trim();
      setVersionSnapshots(current => ({ ...current, [currentVersionName]: addedQuestions.map(question => ({ ...question })) }));
      setVersions(current => [nextName, ...current.filter(versionName => versionName !== nextName)]);
      setCurrentVersionName(nextName);
      setSelectedVersionName(nextName);
      const today = new Date();
      setUpdated(`${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`);
    }
    setVersionModal(false);
    setNewVersion('');
  };

  return (
    <div className="flex flex-col" style={{ minHeight: '100%' }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4" style={{ fontSize: 14, color: '#555' }}>
        <span style={{ color: '#1a3055', fontWeight: 600 }}>질의 라이브러리</span>
        <span>›</span>
        <span style={{ fontWeight: 700 }}>기본 SET</span>
      </div>

      <div className="flex gap-4" style={{ flex: 1 }}>
        {/* Left folder tree panel */}
        <div style={{ width: 160, flexShrink: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 4, padding: '8px 0', fontSize: 12, overflowY: 'auto' }}>
          <div style={{ padding: '6px 12px', fontWeight: 700, color: '#1a3055', borderBottom: '1px solid #e8e8e8', fontSize: 13, marginBottom: 4 }}>기본 SET</div>
          {FOLDER_TREE.map(node => (
            <div key={node.id}>
              <button
                onClick={() => node.children && toggleFolder(node.id)}
                className="w-full text-left hover:bg-blue-50"
                style={{ padding: '5px 12px', color: '#333', fontWeight: 600, fontSize: 12 }}
              >
                {node.children ? (openFolders.has(node.id) ? '▼ ' : '▶ ') : ''}{node.label.replace(/^[▼▶] /, '')}
              </button>
              {node.children && openFolders.has(node.id) && node.children.map(child => (
                <button
                  key={child.id}
                  onClick={() => setSelectedFolder(child.id)}
                  className="w-full text-left hover:bg-blue-50"
                  style={{
                    padding: '4px 12px 4px 22px',
                    fontSize: 11,
                    color: selectedFolder === child.id ? '#fff' : '#555',
                    background: selectedFolder === child.id ? '#1a3055' : undefined,
                  }}
                >
                  {child.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Right content */}
        <div className="flex flex-col flex-1" style={{ minWidth: 0 }}>
          {/* Search/filter bar */}
          <div className="flex items-center gap-2 mb-3">
            <select value={industryFilter} onChange={event => setIndustryFilter(event.target.value)} style={{ border: '1px solid #ccc', borderRadius: 4, padding: '5px 10px', fontSize: 13, height: 34 }}>
              <option value="">산업 전체</option>{industryNames.map(industry => <option key={industry}>{industry}</option>)}
            </select>
            <select value={qType} onChange={e => setQType(e.target.value)} style={{ border: '1px solid #ccc', borderRadius: 4, padding: '5px 10px', fontSize: 13, height: 34 }}>
              <option value="">질의유형</option>
              <option>라디오</option>
              <option>체크박스</option>
              <option>텍스트박스</option>
              <option>정량데이터</option>
            </select>
            <input
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              placeholder="검색 질의 제목을 입력하세요"
              style={{ flex: 1, border: '1px solid #ccc', borderRadius: 4, padding: '5px 12px', fontSize: 13, height: 34 }}
            />
            <button style={{ background: '#1a3055', color: '#fff', border: 'none', borderRadius: 4, padding: '5px 16px', fontSize: 13, height: 34, cursor: 'pointer' }}>
              🔍 검색
            </button>
          </div>

          {/* SET info bar */}
          <div className="flex items-center gap-4 mb-3" style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 4, padding: '10px 16px' }}>
            <span style={{ fontSize: 13, color: '#666' }}>버전명</span>
            <select
              value={selectedVersionName}
              onChange={event => setSelectedVersionName(event.target.value)}
              style={{ border: '1px solid #cfd3d9', borderRadius: 4, padding: '5px 10px', minWidth: 280, fontSize: 13, fontWeight: 700, color: '#1a3055' }}
            >
              {versions.map(versionName => <option key={versionName}>{versionName}</option>)}
            </select>
            <span style={{ color: '#ccc' }}>|</span>
            <span style={{ fontSize: 13, color: '#666' }}>Updated</span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{updated}</span>
            <div style={{ flex: 1 }} />
            {!readOnly && <button
              onClick={() => onNavigateAdd()}
              style={{ background: '#1a3055', color: '#fff', border: 'none', borderRadius: 4, padding: '5px 14px', fontSize: 13, cursor: 'pointer' }}
            >
              + 질의 추가
            </button>}
          </div>

          {/* Folder label */}
          <div className="flex items-center gap-2 mb-2" style={{ fontSize: 13 }}>
            <span style={{ color: '#555' }}>폴더:</span>
            <span style={{ fontWeight: 700 }}>{folderLabel}</span>
            {!readOnly && <button style={{ color: '#1a3055', fontSize: 12, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>✏ 수정</button>}
          </div>

          {/* Table */}
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f7f8fa', borderBottom: '1px solid #e0e0e0' }}>
                  <th style={{ padding: '9px 12px', textAlign: 'left', width: 88, fontWeight: 600, color: '#333', whiteSpace: 'nowrap' }}>NO</th>
                  <th style={{ padding: '9px 12px', textAlign: 'left', width: 155, fontWeight: 600, color: '#333' }}>질의 ID</th>
                  <th style={{ padding: '9px 12px', textAlign: 'left', fontWeight: 600, color: '#333' }}>질의 제목</th>
                  <th style={{ padding: '9px 12px', textAlign: 'center', width: 90, fontWeight: 600, color: '#333' }}>질의 유형</th>
                  <th style={{ padding: '9px 12px', textAlign: 'center', width: 70, fontWeight: 600, color: '#333' }}>첨부파일</th>
                  <th style={{ padding: '9px 12px', textAlign: 'center', width: 80, fontWeight: 600, color: '#333' }}>업데이트</th>
                  <th style={{ padding: '9px 12px', textAlign: 'center', width: 80, fontWeight: 600, color: '#333' }}>반영 캠페인</th>
                </tr>
              </thead>
              <tbody>
                {visibleQuestions.map(q => {
                  return (
                    <tr key={q.no} style={{ borderBottom: '1px solid #f0f0f0', background: isCurrentVersion ? '#fff' : '#fff8d9' }}>
                      <td style={{ padding: '7px 12px', color: '#555', whiteSpace: 'nowrap' }}>
                        <span>
                          {q.no}
                        </span>
                      </td>
                      <td style={{ padding: '7px 12px', color: '#667085', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                        <span className="mr-1 rounded px-1.5 py-0.5 text-[10px] font-bold" style={{ background: '#e8eef8', color: '#1a3055' }}>[B]</span>
                        {(q.industries ?? q.form?.industries ?? []).length > 0 && <button type="button" onClick={() => window.alert(`선택 산업: ${(q.industries ?? q.form?.industries ?? []).join(', ')}`)} title={(q.industries ?? q.form?.industries ?? []).join(', ')} className="mr-1 rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-700">[I]</button>}
                        {q.questionId}
                      </td>
                      <td style={{ padding: '7px 12px' }}>
                        <span>
                          <button
                            onClick={() => { if (!readOnly) onNavigateAdd(q, selectedFolder, 'edit'); }}
                            disabled={readOnly}
                            style={{ background: 'none', border: 'none', color: '#1a6fbf', cursor: readOnly ? 'default' : 'pointer', fontSize: 13, textDecoration: 'none' }}
                          >
                            {q.title}
                          </button>
                        </span>
                      </td>
                      <td style={{ padding: '7px 12px', textAlign: 'center', color: '#555' }}>{normalizeQuestionType(q.type)}</td>
                      <td style={{ padding: '7px 12px', textAlign: 'center', color: '#555' }}>{q.attachment}</td>
                      <td style={{ padding: '7px 12px', textAlign: 'center', color: '#555' }}>{q.updated}</td>
                      <td style={{ padding: '7px 12px', textAlign: 'center' }}>
                        {q.campaigns > 0 ? (
                          <button
                            onClick={() => setCampaignModal(q)}
                            style={{ background: 'none', border: 'none', color: '#1a6fbf', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}
                          >
                            {q.campaigns}
                          </button>
                        ) : (
                          <span style={{ color: '#999' }}>0</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Campaign Usage Modal */}
      {campaignModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 6, padding: '28px 32px', minWidth: 520, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
            <div className="flex items-center justify-between mb-4">
              <span style={{ fontWeight: 700, fontSize: 16 }}>질의 사용 캠페인</span>
              <button onClick={() => setCampaignModal(null)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888' }}>×</button>
            </div>
            <div style={{ marginBottom: 12, fontSize: 13, color: '#555' }}>질의 NO: {campaignModal.no}</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f7f8fa', borderBottom: '1px solid #e0e0e0' }}>
                  <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>캠페인명</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>고객사</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>기간</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>상태</th>
                </tr>
              </thead>
              <tbody>
                {(campaignModal.campaignList ?? []).map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '8px 12px' }}>{c.name}</td>
                    <td style={{ padding: '8px 12px' }}>{c.client}</td>
                    <td style={{ padding: '8px 12px' }}>{c.period}</td>
                    <td style={{ padding: '8px 12px', color: c.status === '진행중' ? '#2e7d32' : '#555' }}>{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <button onClick={() => setCampaignModal(null)} style={{ border: '1px solid #ccc', background: '#fff', borderRadius: 4, padding: '7px 24px', fontSize: 13, cursor: 'pointer' }}>닫기</button>
            </div>
          </div>
        </div>
      )}

      {/* Version Update Modal */}
      {versionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 6, padding: '28px 32px', minWidth: 460, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
            <div className="flex items-center justify-between mb-5">
              <span style={{ fontWeight: 700, fontSize: 16 }}>SET 버전 업데이트</span>
              <button onClick={() => setVersionModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888' }}>×</button>
            </div>
            <div style={{ background: '#f7f8fa', border: '1px solid #e8e8e8', borderRadius: 4, padding: '16px 20px', marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: '#333' }}>현재 정보</div>
              <div className="flex gap-8" style={{ fontSize: 13 }}>
                <div>
                  <div style={{ color: '#888', marginBottom: 4 }}>현재 버전명</div>
                  <div style={{ fontWeight: 600 }}>{currentVersionName}</div>
                </div>
                <div>
                  <div style={{ color: '#888', marginBottom: 4 }}>현재 Update Date</div>
                  <div style={{ fontWeight: 600 }}>{updated}</div>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>새 버전명</label>
              <input
                value={newVersion}
                onChange={e => setNewVersion(e.target.value)}
                placeholder="예: 2026 공급망 ESG 기본 SET v3.3"
                style={{ width: '100%', border: '1px solid #ccc', borderRadius: 4, padding: '8px 12px', fontSize: 13 }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setVersionModal(false)} style={{ border: '1px solid #ccc', background: '#fff', borderRadius: 4, padding: '7px 24px', fontSize: 13, cursor: 'pointer' }}>취소</button>
              <button onClick={handleSaveVersion} style={{ background: '#e63946', color: '#fff', border: 'none', borderRadius: 4, padding: '7px 24px', fontSize: 13, cursor: 'pointer' }}>저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
