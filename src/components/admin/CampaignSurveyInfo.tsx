import { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  createQuestionFormDefaults,
  FOLDER_TREE,
  generateQuestionId,
  normalizeQuestionType,
  QUESTIONS_BY_FOLDER,
  type Question as BasicSetQuestion,
  type QuestionFormValues,
} from './QuestionLibraryBasicSet';
import { CUSTOM_QUESTION_SEED } from './QuestionLibraryMgmt';

interface FolderNode {
  id: string;
  label: string;
  count: number;
  children?: FolderNode[];
}

interface QuestionChoice {
  text: string;
  score: number;
}

interface Question {
  no: number | string;
  displayNo?: number | string;
  title: string;
  type: string;
  attachment: string;
  adopted: boolean;
  modified?: boolean;
  parentNo?: number | string;
  folderId?: string;
  choices?: QuestionChoice[];
  industryCode?: number;
  sourceNo?: string | number;
  sourceFolderId?: string;
  questionId?: string;
  form?: QuestionFormValues;
  industries?: string[];
}

interface ImportCampaign {
  no: number;
  provider: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  active: string;
}

/* ─── 기본 폴더 트리 ─── */
const INIT_FOLDERS: FolderNode[] = [
  { id: 'L', label: 'L.노동', count: 0, children: [
    { id: 'L-고용', label: '고용 관리', count: 4 },
    { id: 'L-근로', label: '근로 조건', count: 3 },
    { id: 'L-임금', label: '임금 관리', count: 3 },
  ]},
  { id: 'S', label: 'S.인권', count: 0, children: [
    { id: 'S-인권', label: '인권 정책', count: 3 },
    { id: 'S-차별', label: '차별 금지', count: 2 },
  ]},
  { id: 'E', label: 'E.환경', count: 0, children: [
    { id: 'E-환경', label: '환경 정책', count: 2 },
    { id: 'E-온실', label: '온실가스 관리', count: 2 },
  ]},
  { id: 'ET', label: 'E.윤리', count: 0, children: [
    { id: 'ET-윤리', label: '윤리 경영', count: 2 },
  ]},
  { id: 'M', label: 'M.경영', count: 0, children: [
    { id: 'M-지배', label: '지배구조', count: 2 },
    { id: 'M-공급망', label: '공급망 관리', count: 2 },
  ]},
  { id: 'D', label: 'D.기본정보', count: 0, children: [
    { id: 'D-회사', label: '회사 일반 현황', count: 3 },
    { id: 'D-인력', label: '인력 현황', count: 3 },
    { id: 'D-재무', label: '재무 현황', count: 2 },
    { id: 'D-공급망', label: '공급망 현황', count: 2 },
    { id: 'D-인증', label: '인증·수상 현황', count: 2 },
  ]},
];

/* ─── 폴더별 초기 질의 ─── */
const INIT_QUESTIONS_BY_FOLDER: Record<string, Question[]> = {
  /* ── L.노동 ── */
  'L-고용': [
    { no: 1, title: '귀사는 공개 채용 원칙을 수립하고 있습니까?', type: '라디오', attachment: '없음', adopted: true, folderId: 'L-고용' },
    { no: 2, title: '채용 시 근로계약서를 서면으로 체결하고 있습니까?', type: '라디오', attachment: '필수', adopted: true, folderId: 'L-고용' },
    { no: 3, title: '수습 기간 제도를 운영하고 있습니까?', type: '라디오', attachment: '없음', adopted: true, folderId: 'L-고용' },
    {
      no: 4,
      title: '채용 공고에 직무 요건을 명시하고 있습니까?',
      type: '라디오',
      attachment: '없음',
      adopted: true,
      folderId: 'L-고용',
      choices: [
        { text: '표준화된 직무 요건을 수립하고 모든 채용 공고에 필수 역량과 자격 기준을 구체적으로 명시하고 있음', score: 5 },
        { text: '직무 요건 기준을 갖추고 있으며 대부분의 채용 공고에 주요 역량과 자격 기준을 명시하고 있음', score: 4 },
        { text: '채용 공고에 담당 업무와 기본 자격 요건을 명시하고 있으나 직무별 세부 기준은 일관되지 않음', score: 3 },
        { text: '직무 요건 작성 기준을 마련하고 있으나 일부 채용 공고에만 제한적으로 적용하고 있음', score: 2 },
        { text: '채용 공고에 적용하는 별도의 직무 요건 기준을 운영하지 않고 있음', score: 1 },
      ],
    },
    { no: '1-1', title: '공개 채용 원칙을 수립한 시기는 언제입니까?', type: '라디오', attachment: '없음', adopted: false, parentNo: 1, folderId: 'L-고용' },
    { no: '2-1', title: '근로계약서에 포함된 주요 항목은 무엇입니까?', type: '드롭다운', attachment: '없음', adopted: false, parentNo: 2, folderId: 'L-고용' },
    { no: '3-1', title: '수습 기간은 몇 개월입니까?', type: '라디오', attachment: '없음', adopted: false, parentNo: 3, folderId: 'L-고용' },
    { no: '3-2', title: '수습 기간 중 급여 지급 기준이 별도로 존재합니까?', type: '라디오', attachment: '없음', adopted: false, parentNo: 3, folderId: 'L-고용' },
    { no: 7, title: '외국인 근로자 고용 현황을 관리하고 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'L-고용' },
    { no: '7-1', title: '외국인 근로자 비율(전체 인원 대비)을 알려주세요.', type: '드롭다운', attachment: '없음', adopted: false, parentNo: 7, folderId: 'L-고용' },
    { no: '7-2', title: '외국인 근로자 고용 시 별도 관리 지침이 있습니까?', type: '라디오', attachment: '없음', adopted: false, parentNo: 7, folderId: 'L-고용' },
    { no: 15, title: '신규 입사자 온보딩 프로그램이 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'L-고용' },
    { no: 8, title: '온보딩 프로그램의 평균 운영 기간은 얼마입니까?', type: '라디오', attachment: '없음', adopted: false, parentNo: 15, folderId: 'L-고용' },
    { no: 9, title: '온보딩 프로그램에 ESG 관련 교육이 포함되어 있습니까?', type: '라디오', attachment: '없음', adopted: false, parentNo: 15, folderId: 'L-고용' },
    { no: 10, title: '인사 평가 제도를 연 1회 이상 운영하고 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'L-고용' },
    { no: '10-1', title: '인사 평가 결과를 근로자에게 공개합니까?', type: '라디오', attachment: '없음', adopted: false, parentNo: 10, folderId: 'L-고용' },
    { no: '10-2', title: '인사 평가에 이의신청 절차가 마련되어 있습니까?', type: '라디오', attachment: '없음', adopted: false, parentNo: 10, folderId: 'L-고용' },
    { no: 11, title: '근로자 개인 인사기록 관리 방식은 무엇입니까?', type: '드롭다운', attachment: '없음', adopted: false, folderId: 'L-고용' },
    { no: 12, title: '고용 형태별 인원 현황을 정기적으로 파악하고 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'L-고용' },
    { no: 13, title: '최근 1년간 신규 채용 인원을 알려주세요.', type: '텍스트상자', attachment: '없음', adopted: false, folderId: 'L-고용' },
    { no: 14, title: '채용 과정에서 외부 채용대행사를 이용하고 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'L-고용' },
  ],
  'L-근로': [
    { no: 1, title: '근로시간이 법정 기준을 초과하지 않습니까?', type: '라디오', attachment: '없음', adopted: true, folderId: 'L-근로' },
    { no: 2, title: '연장근로에 대한 추가 수당을 지급하고 있습니까?', type: '라디오', attachment: '없음', adopted: true, folderId: 'L-근로' },
    { no: 3, title: '근로시간 기록을 체계적으로 관리하고 있습니까?', type: '라디오', attachment: '없음', adopted: true, folderId: 'L-근로' },
    { no: '1-1', title: '주 평균 초과근로 시간을 알려주세요.', type: '텍스트상자', attachment: '없음', adopted: false, parentNo: 1, folderId: 'L-근로' },
    { no: '2-1', title: '연장근로 수당 산정 기준 방식은 무엇입니까?', type: '드롭다운', attachment: '없음', adopted: false, parentNo: 2, folderId: 'L-근로' },
    { no: 4, title: '근로자 휴일 근무 동의 절차가 마련되어 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'L-근로' },
    { no: 5, title: '탄력근무제 또는 재량근무제를 운영하고 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'L-근로' },
    { no: '5-1', title: '탄력근무제 대상 직군을 알려주세요.', type: '드롭다운', attachment: '없음', adopted: false, parentNo: 5, folderId: 'L-근로' },
    { no: 6, title: '재택근무 정책이 공식 수립되어 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'L-근로' },
  ],
  'L-임금': [
    { no: 1, title: '최저임금 이상의 임금을 지급하고 있습니까?', type: '라디오', attachment: '없음', adopted: true, folderId: 'L-임금' },
    { no: 2, title: '임금 지급 방식을 문서화하고 있습니까?', type: '라디오', attachment: '없음', adopted: true, folderId: 'L-임금' },
    { no: 3, title: '성별 임금 격차를 모니터링하고 있습니까?', type: '라디오', attachment: '없음', adopted: true, folderId: 'L-임금' },
    { no: '1-1', title: '최저임금 기준 적용 대상 인원은 몇 명입니까?', type: '텍스트상자', attachment: '없음', adopted: false, parentNo: 1, folderId: 'L-임금' },
    { no: '3-1', title: '성별 임금 격차 현황(%)을 알려주세요.', type: '텍스트상자', attachment: '없음', adopted: false, parentNo: 3, folderId: 'L-임금' },
    { no: 4, title: '성과 기반 임금 체계를 운영하고 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'L-임금' },
    { no: 5, title: '임금 체불 발생 시 처리 절차가 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'L-임금' },
    { no: '5-1', title: '최근 1년간 임금 체불 발생 건수를 알려주세요.', type: '텍스트상자', attachment: '없음', adopted: false, parentNo: 5, folderId: 'L-임금' },
  ],

  /* ── S.인권 ── */
  'S-인권': [
    { no: 1, title: '인권 정책을 공식적으로 수립하고 있습니까?', type: '라디오', attachment: '없음', adopted: true, folderId: 'S-인권' },
    { no: 2, title: '인권 실사를 정기적으로 수행합니까?', type: '라디오', attachment: '없음', adopted: true, folderId: 'S-인권' },
    { no: 3, title: '인권 침해 신고 채널이 마련되어 있습니까?', type: '라디오', attachment: '없음', adopted: true, folderId: 'S-인권' },
    { no: '1-1', title: '인권 정책의 최근 개정 연도를 알려주세요.', type: '텍스트상자', attachment: '없음', adopted: false, parentNo: 1, folderId: 'S-인권' },
    { no: '2-1', title: '인권 실사 수행 주기는 어떻게 됩니까?', type: '드롭다운', attachment: '없음', adopted: false, parentNo: 2, folderId: 'S-인권' },
    { no: '3-1', title: '신고 채널을 통해 접수된 건수(최근 1년)를 알려주세요.', type: '텍스트상자', attachment: '없음', adopted: false, parentNo: 3, folderId: 'S-인권' },
    { no: 4, title: '공급망 전반에 인권 실사를 확대하고 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'S-인권' },
    { no: 5, title: '임직원 인권 교육을 정기 실시하고 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'S-인권' },
    { no: '5-1', title: '연간 인권 교육 시간을 알려주세요.', type: '텍스트상자', attachment: '없음', adopted: false, parentNo: 5, folderId: 'S-인권' },
    { no: 6, title: '아동·강제 노동 방지 서약을 체결하고 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'S-인권' },
  ],
  'S-차별': [
    { no: 1, title: '채용·승진 시 차별 금지 정책이 수립되어 있습니까?', type: '라디오', attachment: '없음', adopted: true, folderId: 'S-차별' },
    { no: 2, title: '성희롱·직장 내 괴롭힘 예방 교육을 실시하고 있습니까?', type: '라디오', attachment: '없음', adopted: true, folderId: 'S-차별' },
    { no: '1-1', title: '차별 금지 정책 대상 범주를 알려주세요.', type: '체크박스', attachment: '없음', adopted: false, parentNo: 1, folderId: 'S-차별' },
    { no: '2-1', title: '최근 1년 예방 교육 이수율(%)을 알려주세요.', type: '텍스트상자', attachment: '없음', adopted: false, parentNo: 2, folderId: 'S-차별' },
    { no: 3, title: '장애인 고용 현황을 관리하고 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'S-차별' },
    { no: '3-1', title: '장애인 고용 비율(%)을 알려주세요.', type: '텍스트상자', attachment: '없음', adopted: false, parentNo: 3, folderId: 'S-차별' },
    { no: 4, title: '외국인 근로자에 대한 차별 방지 지침이 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'S-차별' },
  ],

  /* ── E.환경 ── */
  'E-환경': [
    { no: 1, title: '공식 환경 정책을 수립하고 있습니까?', type: '라디오', attachment: '없음', adopted: true, folderId: 'E-환경' },
    { no: 2, title: '환경 정책이 최근 2년 이내에 개정되었습니까?', type: '라디오', attachment: '없음', adopted: true, folderId: 'E-환경' },
    { no: '1-1', title: '환경 정책의 최근 개정 연도를 알려주세요.', type: '텍스트상자', attachment: '없음', adopted: false, parentNo: 1, folderId: 'E-환경' },
    { no: 3, title: '환경 관련 법규 준수 현황을 모니터링하고 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'E-환경' },
    { no: 4, title: '환경 목표를 설정하고 정기적으로 검토합니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'E-환경' },
    { no: '4-1', title: '환경 목표 달성률(%)을 알려주세요.', type: '텍스트상자', attachment: '없음', adopted: false, parentNo: 4, folderId: 'E-환경' },
    { no: 5, title: '공급망 환경 영향을 평가하고 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'E-환경' },
  ],
  'E-온실': [
    { no: 1, title: '온실가스 배출량을 측정하고 있습니까?', type: '라디오', attachment: '없음', adopted: true, folderId: 'E-온실' },
    { no: 2, title: '온실가스 감축 목표를 설정하고 있습니까?', type: '라디오', attachment: '없음', adopted: true, folderId: 'E-온실' },
    { no: '1-1', title: '연간 온실가스 배출량(tCO2eq)을 알려주세요.', type: '텍스트상자', attachment: '없음', adopted: false, parentNo: 1, folderId: 'E-온실' },
    { no: '2-1', title: '2030년 감축 목표(%)를 알려주세요.', type: '텍스트상자', attachment: '없음', adopted: false, parentNo: 2, folderId: 'E-온실' },
    { no: 3, title: 'Scope 1, 2, 3 배출량을 구분하여 관리하고 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'E-온실' },
    { no: '3-1', title: 'Scope 3 산정 시 포함 카테고리를 알려주세요.', type: '체크박스', attachment: '없음', adopted: false, parentNo: 3, folderId: 'E-온실' },
    { no: 4, title: '탄소중립 로드맵을 수립하고 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'E-온실' },
    { no: 5, title: '재생에너지 사용 비율(%)을 알려주세요.', type: '텍스트상자', attachment: '없음', adopted: false, folderId: 'E-온실' },
  ],

  /* ── E.윤리 ── */
  'ET-윤리': [
    { no: 1, title: '윤리 강령(Code of Ethics)을 수립하고 있습니까?', type: '라디오', attachment: '없음', adopted: true, folderId: 'ET-윤리' },
    { no: 2, title: '임직원 윤리 교육을 연 1회 이상 실시하고 있습니까?', type: '라디오', attachment: '없음', adopted: true, folderId: 'ET-윤리' },
    { no: '1-1', title: '윤리 강령 최근 개정 연도는 언제입니까?', type: '텍스트상자', attachment: '없음', adopted: false, parentNo: 1, folderId: 'ET-윤리' },
    { no: '2-1', title: '윤리 교육 이수율(%)을 알려주세요.', type: '텍스트상자', attachment: '없음', adopted: false, parentNo: 2, folderId: 'ET-윤리' },
    { no: 3, title: '내부 비리 신고 채널(내부제보)이 운영되고 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'ET-윤리' },
    { no: '3-1', title: '최근 1년 내부제보 접수 건수를 알려주세요.', type: '텍스트상자', attachment: '없음', adopted: false, parentNo: 3, folderId: 'ET-윤리' },
    { no: 4, title: '부패 방지 정책을 문서화하여 공시하고 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'ET-윤리' },
    { no: 5, title: '공정거래 관련 내부 심의 절차가 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'ET-윤리' },
  ],

  /* ── M.경영 ── */
  'M-지배': [
    { no: 1, title: '이사회가 구성되어 있습니까?', type: '라디오', attachment: '없음', adopted: true, folderId: 'M-지배' },
    { no: 2, title: '사외이사 비율이 과반수 이상입니까?', type: '라디오', attachment: '없음', adopted: true, folderId: 'M-지배' },
    { no: '1-1', title: '이사회 구성원 수는 몇 명입니까?', type: '텍스트상자', attachment: '없음', adopted: false, parentNo: 1, folderId: 'M-지배' },
    { no: '2-1', title: '사외이사 비율(%)을 알려주세요.', type: '텍스트상자', attachment: '없음', adopted: false, parentNo: 2, folderId: 'M-지배' },
    { no: 3, title: 'ESG 위원회 또는 전담 조직이 설치되어 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'M-지배' },
    { no: '3-1', title: 'ESG 전담 조직 명칭 및 구성원 수를 알려주세요.', type: '텍스트상자', attachment: '없음', adopted: false, parentNo: 3, folderId: 'M-지배' },
    { no: 4, title: '이사회 내 여성 이사 비율을 관리하고 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'M-지배' },
  ],
  'M-공급망': [
    { no: 1, title: '공급망 ESG 평가를 정기적으로 실시하고 있습니까?', type: '라디오', attachment: '없음', adopted: true, folderId: 'M-공급망' },
    { no: 2, title: '공급망 행동규범(CoC)을 수립하여 협력사에 전달합니까?', type: '라디오', attachment: '없음', adopted: true, folderId: 'M-공급망' },
    { no: '1-1', title: '최근 1년 공급망 ESG 평가 대상 업체 수를 알려주세요.', type: '텍스트상자', attachment: '없음', adopted: false, parentNo: 1, folderId: 'M-공급망' },
    { no: '2-1', title: 'CoC 주요 항목을 알려주세요.', type: '체크박스', attachment: '없음', adopted: false, parentNo: 2, folderId: 'M-공급망' },
    { no: 3, title: '1차 공급사 이외 2차 공급사까지 ESG 평가를 확대합니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'M-공급망' },
    { no: 4, title: '공급망 리스크 지도(Risk Map)를 작성하고 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'M-공급망' },
    { no: '4-1', title: '리스크 지도 갱신 주기를 알려주세요.', type: '드롭다운', attachment: '없음', adopted: false, parentNo: 4, folderId: 'M-공급망' },
    { no: 5, title: '공급망 분쟁광물 사용 현황을 파악하고 있습니까?', type: '라디오', attachment: '없음', adopted: false, folderId: 'M-공급망' },
  ],

  /* ── D.기본정보 ── */
  'D-회사': [
    { no: 1, title: '회사명을 입력해 주세요.', type: '텍스트상자', attachment: '없음', adopted: true, folderId: 'D-회사' },
    { no: 2, title: '사업자등록번호를 입력해 주세요.', type: '텍스트상자', attachment: '없음', adopted: true, folderId: 'D-회사' },
    { no: 3, title: '본사 소재지를 입력해 주세요.', type: '텍스트상자', attachment: '없음', adopted: true, folderId: 'D-회사' },
    { no: 4, title: '설립연도를 입력해 주세요.', type: '텍스트상자', attachment: '없음', adopted: false, folderId: 'D-회사' },
  ],
  'D-인력': [
    { no: 1, title: '전체 임직원 수를 입력해 주세요.', type: '정량데이터', attachment: '없음', adopted: true, folderId: 'D-인력' },
    { no: 2, title: '정규직 임직원 수를 입력해 주세요.', type: '정량데이터', attachment: '없음', adopted: true, folderId: 'D-인력' },
    { no: 3, title: '비정규직 임직원 수를 입력해 주세요.', type: '정량데이터', attachment: '없음', adopted: true, folderId: 'D-인력' },
    { no: 4, title: '여성 임직원 비율을 입력해 주세요.', type: '정량데이터', attachment: '없음', adopted: false, folderId: 'D-인력' },
  ],
  'D-재무': [
    { no: 1, title: '최근 회계연도 매출액을 입력해 주세요.', type: '정량데이터', attachment: '없음', adopted: true, folderId: 'D-재무' },
    { no: 2, title: '최근 회계연도 영업이익을 입력해 주세요.', type: '정량데이터', attachment: '없음', adopted: true, folderId: 'D-재무' },
    { no: 3, title: '최근 회계연도 자산총액을 입력해 주세요.', type: '정량데이터', attachment: '없음', adopted: false, folderId: 'D-재무' },
  ],
  'D-공급망': [
    { no: 1, title: '주요 공급 품목을 입력해 주세요.', type: '텍스트그룹', attachment: '없음', adopted: true, folderId: 'D-공급망' },
    { no: 2, title: '주요 납품 국가를 선택해 주세요.', type: '드롭다운', attachment: '없음', adopted: true, folderId: 'D-공급망' },
    { no: 3, title: '전체 협력사 수를 입력해 주세요.', type: '정량데이터', attachment: '없음', adopted: false, folderId: 'D-공급망' },
  ],
  'D-인증': [
    { no: 1, title: '보유 중인 경영시스템 인증을 선택해 주세요.', type: '체크박스', attachment: '필수', adopted: true, folderId: 'D-인증' },
    { no: 2, title: '최근 3년간 수상 실적을 입력해 주세요.', type: '텍스트그룹', attachment: '필수', adopted: true, folderId: 'D-인증' },
    { no: 3, title: '기타 보유 인증을 입력해 주세요.', type: '텍스트상자', attachment: '없음', adopted: false, folderId: 'D-인증' },
  ],
};

/* ─── 캠페인 불러오기 후보 ─── */
const IMPORT_CAMPAIGNS: ImportCampaign[] = [
  { no: 4, provider: 'SK', name: '2026 SK 협력사 ESG 평가', startDate: '2026-05-01', endDate: '2026-08-31', status: '진행중', active: 'Y' },
  { no: 3, provider: '한화', name: '2025 한화 공급망 평가', startDate: '2025-04-01', endDate: '2025-07-31', status: '종료', active: 'Y' },
  { no: 2, provider: '농심', name: '2025 농심 ESG 평가', startDate: '2025-06-01', endDate: '2025-09-30', status: '종료', active: 'Y' },
  { no: 1, provider: 'SK', name: '2024 SK 하이닉스 ESG 평가', startDate: '2024-10-10', endDate: '2024-10-16', status: '종료', active: 'Y' },
];

/* ─── 불러오기 모달 폴더 트리 ─── */
const IMPORT_FOLDERS: FolderNode[] = [
  { id: 'L', label: 'L.노동', count: 0, children: [
    { id: 'L-고용', label: '고용 관리', count: 5 },
    { id: 'L-근로', label: '근로 조건', count: 3 },
    { id: 'L-임금', label: '임금 관리', count: 3 },
  ]},
  { id: 'S', label: 'S.인권', count: 0, children: [
    { id: 'S-인권', label: '인권 정책', count: 5 },
    { id: 'S-차별', label: '차별 금지', count: 4 },
  ]},
  { id: 'E', label: 'E.환경', count: 0, children: [
    { id: 'E-환경', label: '환경 정책', count: 4 },
    { id: 'E-온실', label: '온실가스 관리', count: 3 },
  ]},
  { id: 'ET', label: 'E.윤리', count: 0, children: [
    { id: 'ET-윤리', label: '윤리 경영', count: 4 },
  ]},
  { id: 'M', label: 'M.경영', count: 0, children: [
    { id: 'M-지배', label: '지배구조', count: 4 },
    { id: 'M-공급망', label: '공급망 관리', count: 3 },
  ]},
  { id: 'D', label: 'D.기본정보', count: 0, children: [
    { id: 'D-회사', label: '회사 일반 현황', count: 3 },
    { id: 'D-인력', label: '인력 현황', count: 3 },
    { id: 'D-재무', label: '재무 현황', count: 2 },
    { id: 'D-공급망', label: '공급망 현황', count: 2 },
    { id: 'D-인증', label: '인증·수상 현황', count: 2 },
  ]},
];

/* ─── 불러오기 후보 질의 (폴더별) ─── */
const IMPORT_QUESTIONS_BY_FOLDER: Record<string, { no: number; title: string; type: string; attachment: string }[]> = {
  'L-고용': [
    { no: 1, title: '귀사는 공개 채용 원칙을 수립하고 있습니까?', type: '라디오', attachment: 'N' },
    { no: 2, title: '채용 시 근로계약서를 서면으로 체결하고 있습니까?', type: '라디오', attachment: 'Y' },
    { no: 3, title: '수습 기간 제도를 운영하고 있습니까?', type: '라디오', attachment: 'N' },
    { no: 4, title: '채용 공고에 직무 요건을 명시하고 있습니까?', type: '라디오', attachment: 'N' },
    { no: 5, title: '채용 과정에서 외부 채용대행사를 이용하고 있습니까?', type: '라디오', attachment: 'N' },
  ],
  'L-근로': [
    { no: 1, title: '근로시간 준수 현황을 모니터링하고 있습니까?', type: '라디오', attachment: 'N' },
    { no: 2, title: '연장근로 동의서를 징수하고 있습니까?', type: '라디오', attachment: 'N' },
    { no: 3, title: '근로시간 이의신청 절차가 있습니까?', type: '라디오', attachment: 'N' },
  ],
  'L-임금': [
    { no: 1, title: '최저임금 이상의 임금을 지급하고 있습니까?', type: '라디오', attachment: 'N' },
    { no: 2, title: '임금 지급 방식을 문서화하고 있습니까?', type: '라디오', attachment: 'N' },
    { no: 3, title: '성별 임금 격차를 모니터링하고 있습니까?', type: '라디오', attachment: 'N' },
  ],
  'S-인권': [
    { no: 1, title: '인권 정책을 공식 수립하고 있습니까?', type: '라디오', attachment: 'N' },
    { no: 2, title: '인권 실사를 연 1회 이상 수행합니까?', type: '라디오', attachment: 'N' },
    { no: 3, title: '공급망 인권 리스크를 평가하고 있습니까?', type: '라디오', attachment: 'N' },
    { no: 4, title: '인권 침해 신고 채널이 운영되고 있습니까?', type: '라디오', attachment: 'N' },
    { no: 5, title: '인권 교육을 임직원에게 정기 실시합니까?', type: '라디오', attachment: 'N' },
  ],
  'S-차별': [
    { no: 1, title: '차별 금지 정책이 수립되어 있습니까?', type: '라디오', attachment: 'N' },
    { no: 2, title: '성희롱 예방 교육을 연 1회 이상 실시합니까?', type: '라디오', attachment: 'N' },
    { no: 3, title: '장애인 고용 현황을 관리합니까?', type: '라디오', attachment: 'N' },
    { no: 4, title: '외국인 근로자 차별 방지 지침이 있습니까?', type: '라디오', attachment: 'N' },
  ],
  'E-환경': [
    { no: 1, title: '공식 환경 정책을 수립하고 있습니까?', type: '라디오', attachment: 'N' },
    { no: 2, title: '환경 목표를 설정하고 정기적으로 검토합니까?', type: '라디오', attachment: 'N' },
    { no: 3, title: '환경 법규 준수 현황을 모니터링합니까?', type: '라디오', attachment: 'N' },
    { no: 4, title: '공급망 환경 영향을 평가하고 있습니까?', type: '라디오', attachment: 'N' },
  ],
  'E-온실': [
    { no: 1, title: '온실가스 배출량을 측정하고 있습니까?', type: '라디오', attachment: 'N' },
    { no: 2, title: '온실가스 감축 목표를 설정하고 있습니까?', type: '라디오', attachment: 'N' },
    { no: 3, title: '탄소중립 로드맵을 수립하고 있습니까?', type: '라디오', attachment: 'N' },
  ],
  'ET-윤리': [
    { no: 1, title: '윤리 강령을 수립하고 있습니까?', type: '라디오', attachment: 'N' },
    { no: 2, title: '임직원 윤리 교육을 실시합니까?', type: '라디오', attachment: 'N' },
    { no: 3, title: '내부 비리 신고 채널을 운영합니까?', type: '라디오', attachment: 'N' },
    { no: 4, title: '부패 방지 정책을 공시하고 있습니까?', type: '라디오', attachment: 'N' },
  ],
  'M-지배': [
    { no: 1, title: '이사회가 구성되어 있습니까?', type: '라디오', attachment: 'N' },
    { no: 2, title: '사외이사 비율이 과반수 이상입니까?', type: '라디오', attachment: 'N' },
    { no: 3, title: 'ESG 위원회가 설치되어 있습니까?', type: '라디오', attachment: 'N' },
    { no: 4, title: '이사회 여성 이사 비율을 관리합니까?', type: '라디오', attachment: 'N' },
  ],
  'M-공급망': [
    { no: 1, title: '공급망 ESG 평가를 정기적으로 실시합니까?', type: '라디오', attachment: 'N' },
    { no: 2, title: '공급망 행동규범(CoC)을 협력사에 전달합니까?', type: '라디오', attachment: 'N' },
    { no: 3, title: '공급망 리스크 지도(Risk Map)를 작성합니까?', type: '라디오', attachment: 'N' },
  ],
  'D-회사': [
    { no: 1, title: '회사명을 입력해 주세요.', type: '텍스트상자', attachment: 'N' },
    { no: 2, title: '사업자등록번호를 입력해 주세요.', type: '텍스트상자', attachment: 'N' },
    { no: 3, title: '본사 소재지를 입력해 주세요.', type: '텍스트상자', attachment: 'N' },
  ],
  'D-인력': [
    { no: 1, title: '전체 임직원 수를 입력해 주세요.', type: '정량데이터', attachment: 'N' },
    { no: 2, title: '정규직 임직원 수를 입력해 주세요.', type: '정량데이터', attachment: 'N' },
    { no: 3, title: '비정규직 임직원 수를 입력해 주세요.', type: '정량데이터', attachment: 'N' },
  ],
  'D-재무': [
    { no: 1, title: '최근 회계연도 매출액을 입력해 주세요.', type: '정량데이터', attachment: 'N' },
    { no: 2, title: '최근 회계연도 영업이익을 입력해 주세요.', type: '정량데이터', attachment: 'N' },
  ],
  'D-공급망': [
    { no: 1, title: '주요 공급 품목을 입력해 주세요.', type: '텍스트그룹', attachment: 'N' },
    { no: 2, title: '주요 납품 국가를 선택해 주세요.', type: '드롭다운', attachment: 'N' },
  ],
  'D-인증': [
    { no: 1, title: '보유 중인 경영시스템 인증을 선택해 주세요.', type: '체크박스', attachment: 'Y' },
    { no: 2, title: '최근 3년간 수상 실적을 입력해 주세요.', type: '텍스트그룹', attachment: 'Y' },
  ],
  ...Object.fromEntries(['I-제조', 'I-원자재', 'I-유통', 'I-서비스'].map(folderId => [
    folderId,
    (QUESTIONS_BY_FOLDER[folderId] ?? []).map(question => ({
      no: Number(question.no),
      title: question.title,
      type: question.type,
      attachment: question.attachment,
    })),
  ])),
};

/* 폴더 트리에서 top-parent id 매핑 (하위 폴더 → INIT_FOLDERS 상위 id) */
const FOLDER_PARENT_MAP: Record<string, { parentId: string; parentLabel: string }> = {
  'L-고용': { parentId: 'L', parentLabel: 'L.노동' },
  'L-근로': { parentId: 'L', parentLabel: 'L.노동' },
  'L-임금': { parentId: 'L', parentLabel: 'L.노동' },
  'S-인권': { parentId: 'S', parentLabel: 'S.인권' },
  'S-차별': { parentId: 'S', parentLabel: 'S.인권' },
  'E-환경': { parentId: 'E', parentLabel: 'E.환경' },
  'E-온실': { parentId: 'E', parentLabel: 'E.환경' },
  'ET-윤리': { parentId: 'ET', parentLabel: 'E.윤리' },
  'M-지배': { parentId: 'M', parentLabel: 'M.경영' },
  'M-공급망': { parentId: 'M', parentLabel: 'M.경영' },
  'D-회사': { parentId: 'D', parentLabel: 'D.기본정보' },
  'D-인력': { parentId: 'D', parentLabel: 'D.기본정보' },
  'D-재무': { parentId: 'D', parentLabel: 'D.기본정보' },
  'D-공급망': { parentId: 'D', parentLabel: 'D.기본정보' },
  'D-인증': { parentId: 'D', parentLabel: 'D.기본정보' },
  'I-제조': { parentId: 'I', parentLabel: 'I.산업 특화 지표' },
  'I-원자재': { parentId: 'I', parentLabel: 'I.산업 특화 지표' },
  'I-유통': { parentId: 'I', parentLabel: 'I.산업 특화 지표' },
  'I-서비스': { parentId: 'I', parentLabel: 'I.산업 특화 지표' },
};

const LIBRARY_FOLDER_ALIASES: Record<string, string> = {
  'S-인권': 'S-인권정책',
  'E-환경': 'E-환경정책',
  'ET-윤리': 'ET-윤리경영',
  'M-지배': 'M-지배구조',
};

const IMPORT_FOLDER_LABELS: Record<string, string> = {
  'L-고용': '고용 관리', 'L-근로': '근로 조건', 'L-임금': '임금 관리',
  'S-인권': '인권 정책', 'S-차별': '차별 금지',
  'E-환경': '환경 정책', 'E-온실': '온실가스 관리',
  'ET-윤리': '윤리 경영',
  'M-지배': '지배구조', 'M-공급망': '공급망 관리',
  'D-회사': '회사 일반 현황', 'D-인력': '인력 현황', 'D-재무': '재무 현황',
  'D-공급망': '공급망 현황', 'D-인증': '인증·수상 현황',
  'I-제조': '제조', 'I-원자재': '원자재', 'I-유통': '유통', 'I-서비스': '서비스',
};

const getQuestionChoices = (question: Question): QuestionChoice[] => {
  if (question.choices) return question.choices;
  if (question.type === '체크박스') {
    return [
      { text: '해당', score: 5 },
      { text: '해당 없음', score: 0 },
    ];
  }
  if (normalizeQuestionType(question.type) === '텍스트박스') {
    return [{ text: '직접 입력', score: 0 }];
  }
  return [
    { text: '예', score: 5 },
    { text: '아니오', score: 0 },
  ];
};

// Module-level store: campaignName → list of Question (reflected set)
export const CAMPAIGN_SAVED_SETS: Record<string, Question[]> = {};

// Module-level store: persist survey state per campaign across navigation
export const CAMPAIGN_SURVEY_STATE: Record<string, {
  questionsByFolder: Record<string, Question[]>;
  surveyFolders: FolderNode[];
}> = {};

const createImportedCampaignSurveyState = () => {
  const questionsByFolder = Object.fromEntries(
    Object.entries(IMPORT_QUESTIONS_BY_FOLDER).map(([folderId, questions]) => [
      folderId,
      questions.map(question => ({
        ...question,
        displayNo: question.no,
        attachment: question.attachment === 'Y' ? '필수' : '없음',
        adopted: true,
        folderId,
        sourceNo: question.no,
        sourceFolderId: folderId,
      })),
    ]),
  );
  const surveyFolders = IMPORT_FOLDERS.map(folder => ({
    ...folder,
    children: folder.children?.map(child => ({ ...child })),
  }));

  return { questionsByFolder, surveyFolders };
};

['2026 SK 협력사 ESG 평가', '2025 한화 공급망 평가'].forEach(campaignName => {
  const state = createImportedCampaignSurveyState();
  CAMPAIGN_SURVEY_STATE[campaignName] = state;
  CAMPAIGN_SAVED_SETS[campaignName] = Object.values(state.questionsByFolder).flat();
});

interface Props {
  campaignName?: string;
  campaignIndustryCode?: number;
  onBack: () => void;
  onNavigateAdd?: (folderId: string) => void;
  customQuestions?: BasicSetQuestion[];
  initialCustomBankOpen?: boolean;
}

type ModalState = 'none' | 'basic-set' | 'import-list' | 'import-questions' | 'custom-bank';

export default function CampaignSurveyInfo({ campaignName = '2026 삼성 공급망 ESG 평가', campaignIndustryCode = 1, onBack, onNavigateAdd, customQuestions = [], initialCustomBankOpen = false }: Props) {
  const [surveyFolders, setSurveyFolders] = useState<FolderNode[]>(() =>
    (campaignName ? CAMPAIGN_SURVEY_STATE[campaignName]?.surveyFolders : undefined) ?? INIT_FOLDERS
  );
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(['L', 'S', 'E', 'ET', 'M', 'D', 'I']));
  const [selectedFolder, setSelectedFolder] = useState('L-고용');

  const [questionsByFolder, setQuestionsByFolder] = useState<Record<string, Question[]>>(() =>
    (campaignName ? CAMPAIGN_SURVEY_STATE[campaignName]?.questionsByFolder : undefined) ?? {}
  );
  // Start nextNo past any already-persisted question nos
  const nextNoRef = useRef(
    Math.max(200, ...Object.values(
      (campaignName ? CAMPAIGN_SURVEY_STATE[campaignName]?.questionsByFolder : undefined) ?? {}
    ).flat().map(q => typeof q.no === 'number' ? q.no + 1 : 200))
  );

  const [editingNo, setEditingNo] = useState<number | string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState('라디오');
  const [editAttachment, setEditAttachment] = useState<string>('없음');
  const [editItems, setEditItems] = useState(['예', '아니오']);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('라디오');
  const [newAttachment, setNewAttachment] = useState('없음');
  const [newItems, setNewItems] = useState(['예', '아니오']);
  const [expandedQuestionKey, setExpandedQuestionKey] = useState<string | null>(null);
  const [choiceScores, setChoiceScores] = useState<Record<string, string>>({});
  const [savedChoiceScores, setSavedChoiceScores] = useState<Record<string, string>>({});

  const [newlyAdoptedNos, setNewlyAdoptedNos] = useState<Set<string | number>>(new Set());
  const adoptedTimers = useRef<Map<string | number, ReturnType<typeof setTimeout>>>(new Map());

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [modalState, setModalState] = useState<ModalState>(initialCustomBankOpen ? 'custom-bank' : 'none');
  const [campaignModal, setCampaignModal] = useState<BasicSetQuestion | null>(null);
  const [basicSelectedFolder, setBasicSelectedFolder] = useState('L-고용');
  const [basicOpenFolders, setBasicOpenFolders] = useState<Set<string>>(new Set(['L', 'S', 'E', 'ET', 'M', 'D', 'I']));
  const [checkedBasicByFolder, setCheckedBasicByFolder] = useState<Record<string, string[]>>({});
  const [importOpenFolders, setImportOpenFolders] = useState<Set<string>>(new Set(['L', 'S', 'E', 'ET', 'M', 'D']));
  const [importSelectedFolder, setImportSelectedFolder] = useState('L-고용');
  const [selectedImportCampaign, setSelectedImportCampaign] = useState<ImportCampaign | null>(null);
  // folderId → 선택된 질의 인덱스 배열 (폴더 전환해도 초기화 안 됨)
  const [checkedByFolder, setCheckedByFolder] = useState<Record<string, number[]>>({});
  const [importFilter, setImportFilter] = useState('');
  const [importActiveFilter, setImportActiveFilter] = useState('전체');
  const [importStatusFilter, setImportStatusFilter] = useState('전체');

  const [expandedLibraryParents, setExpandedLibraryParents] = useState<Set<string | number>>(new Set());
  const [editingFolderName, setEditingFolderName] = useState(false);
  const [folderNameDraft, setFolderNameDraft] = useState('');
  const [customBankSearch, setCustomBankSearch] = useState('');
  const [customBankType, setCustomBankType] = useState('');
  const [customDetail, setCustomDetail] = useState<BasicSetQuestion | null>(null);

  // Filter bar state for unreflected area
  const [filterIndustry, setFilterIndustry] = useState<string>('전체');

  // Persist survey state to module-level store so it survives navigation
  useEffect(() => {
    if (campaignName) {
      CAMPAIGN_SURVEY_STATE[campaignName] = { questionsByFolder, surveyFolders };
    }
  }, [questionsByFolder, surveyFolders, campaignName]);

  useEffect(() => {
    if (showToast) { const t = setTimeout(() => setShowToast(false), 4000); return () => clearTimeout(t); }
  }, [showToast]);

  const currentQuestions = questionsByFolder[selectedFolder] ?? [];
  const adoptedQs = currentQuestions.filter(q => q.adopted);
  const libraryQs = currentQuestions.filter(q => !q.adopted);

  // Collect campaign names from all questions across all folders for the filter dropdown
  const allQuestionsFlat = Object.values(QUESTIONS_BY_FOLDER).flat() as BasicSetQuestion[];

  // BUG 7: libraryGroups sources from QUESTIONS_BY_FOLDER minus already-reflected questions
  const adoptedTitles = new Set(adoptedQs.map(q => q.title));
  const rawLibraryQs = (QUESTIONS_BY_FOLDER[selectedFolder] ?? []) as BasicSetQuestion[];
  const libraryGroups = rawLibraryQs
    .filter(q => !q.parentNo && !adoptedTitles.has(q.title))
    .map(parent => {
      const children = rawLibraryQs.filter(q => q.parentNo === parent.no && !adoptedTitles.has(q.title));
      const pending = [parent, ...children] as unknown as Question[];
      return {
        parent: parent as unknown as Question,
        children: children as unknown as Question[],
        pending,
        locked: false as boolean,
      };
    })
    .filter(group => group.pending.length > 0)
    .filter(group => {
      const q = group.parent as unknown as BasicSetQuestion;
      if (filterIndustry !== '전체') {
        const parentMatch = (q.industries ?? q.form?.industries ?? []).includes(filterIndustry);
        const childMatch = group.children.some(c => ((c as unknown as BasicSetQuestion).industries ?? (c as unknown as BasicSetQuestion).form?.industries ?? []).includes(filterIndustry));
        if (!parentMatch && !childMatch) return false;
      }
      return true;
    });

  const toggleFolder = (id: string) => {
    setOpenFolders(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const collectAllIds = (nodes: FolderNode[]): string[] => {
    const ids: string[] = [];
    for (const n of nodes) { ids.push(n.id); if (n.children) ids.push(...collectAllIds(n.children)); }
    return ids;
  };

  const removeFromTree = (nodes: FolderNode[], targetId: string): FolderNode[] =>
    nodes.filter(n => n.id !== targetId).map(n => ({ ...n, children: n.children ? removeFromTree(n.children, targetId) : undefined }));

  const deleteFolder = (folderId: string) => {
    setSurveyFolders(prev => {
      const toRemove = new Set<string>();
      const collect = (nodes: FolderNode[]) => {
        for (const n of nodes) {
          if (n.id === folderId) { toRemove.add(n.id); collectAllIds(n.children ?? []).forEach(id => toRemove.add(id)); return; }
          if (n.children) collect(n.children);
        }
      };
      collect(prev);
      const next = removeFromTree(prev, folderId);
      setQuestionsByFolder(qbf => { const r = { ...qbf }; toRemove.forEach(id => delete r[id]); return r; });
      if (toRemove.has(selectedFolder)) {
        const remaining = collectAllIds(next).filter(id => !toRemove.has(id));
        const firstLeaf = remaining.find(id => next.flatMap(n => n.children ?? []).some(c => c.id === id));
        if (firstLeaf) setSelectedFolder(firstLeaf);
      }
      return next;
    });
  };

  const updateFolderQuestions = (folderId: string, updater: (qs: Question[]) => Question[]) => {
    setQuestionsByFolder(prev => ({ ...prev, [folderId]: updater(prev[folderId] ?? []) }));
  };

  const adoptQuestion = (q: Question) => {
    updateFolderQuestions(selectedFolder, qs => {
      const rootNo = q.parentNo ?? q.no;
      const root = qs.find(question => question.no === rootNo);
      const children = qs.filter(question => question.parentNo === rootNo);
      const nextNo = Math.max(0, ...qs
        .filter(question => question.adopted)
        .map(question => question.displayNo ?? question.no)
        .map(no => typeof no === 'number' ? no : /^\d+$/.test(String(no)) ? Number(no) : 0)) + 1;

      if (q.parentNo !== undefined && root) {
        const remainingGroup = [root, ...children.filter(child => child.no !== q.no)];
        return qs.map(question => {
          if (question.no === q.no) return { ...question, adopted: true, displayNo: nextNo };
          const groupIndex = remainingGroup.findIndex(member => member.no === question.no);
          return groupIndex >= 0 ? { ...question, displayNo: `${nextNo}-${groupIndex + 1}` } : question;
        });
      }

      if (children.length > 0) {
        return qs.map(question => {
          if (question.no === q.no) return { ...question, adopted: true, displayNo: nextNo };
          const childIndex = children.findIndex(child => child.no === question.no);
          return childIndex >= 0 ? { ...question, displayNo: `${nextNo}-${childIndex + 1}` } : question;
        });
      }

      return qs.map(question => question.no === q.no ? { ...question, adopted: true, displayNo: nextNo } : question);
    });
    setNewlyAdoptedNos(prev => new Set([...prev, q.no]));
    if (adoptedTimers.current.has(q.no)) clearTimeout(adoptedTimers.current.get(q.no)!);
    const t = setTimeout(() => setNewlyAdoptedNos(prev => { const s = new Set(prev); s.delete(q.no); return s; }), 3500);
    adoptedTimers.current.set(q.no, t);
  };

  const unadoptQuestion = (q: Question) => {
    updateFolderQuestions(selectedFolder, qs => {
      const rootNo = q.parentNo ?? q.no;
      const groupNos = new Set([
        rootNo,
        ...qs.filter(question => question.parentNo === rootNo).map(question => question.no),
      ]);
      const next = qs.map(question => question.no === q.no ? { ...question, adopted: false } : question);
      const groupStillAdopted = next.some(question => groupNos.has(question.no) && question.adopted);
      return groupStillAdopted
        ? next
        : next.map(question => groupNos.has(question.no) ? { ...question, displayNo: undefined } : question);
    });
  };

  // BUG 7: adopt a question from the library (QUESTIONS_BY_FOLDER) into the survey
  const adoptLibraryQuestion = (q: Question) => {
    const curAdopted = (questionsByFolder[selectedFolder] ?? []).filter(item => item.adopted);
    const nextDisplayNo = Math.max(0, ...curAdopted
      .map(item => item.displayNo ?? item.no)
      .map(no => typeof no === 'number' ? no : /^\d+$/.test(String(no)) ? Number(no) : 0)) + 1;
    const newQ: Question = {
      no: nextNoRef.current++,
      displayNo: nextDisplayNo,
      title: q.title,
      type: q.type,
      attachment: String(q.attachment) === 'Y' ? '필수' : '없음',
      adopted: true,
      folderId: selectedFolder,
      sourceNo: q.no,
      sourceFolderId: selectedFolder,
      industryCode: (q as any).industryCode ?? 0,
    };
    updateFolderQuestions(selectedFolder, qs => [...qs, newQ]);
    // ensure folder is in surveyFolders
    setSurveyFolders(prev => {
      if (collectAllIds(prev).includes(selectedFolder)) return prev;
      const parent = FOLDER_TREE.find(node => node.children?.some(child => child.id === selectedFolder));
      const child = parent?.children?.find(node => node.id === selectedFolder);
      if (!parent || !child) return prev;
      if (prev.some(node => node.id === parent.id)) {
        return prev.map(node => node.id === parent.id
          ? { ...node, children: [...(node.children ?? []), { id: child.id, label: child.label, count: 0 }] }
          : node);
      }
      return [...prev, {
        id: parent.id,
        label: parent.label.replace(/^[▼▶]\s*/, ''),
        count: 0,
        children: [{ id: child.id, label: child.label, count: 0 }],
      }];
    });
    setNewlyAdoptedNos(prev => new Set([...prev, newQ.no]));
    if (adoptedTimers.current.has(newQ.no)) clearTimeout(adoptedTimers.current.get(newQ.no)!);
    const t = setTimeout(() => setNewlyAdoptedNos(prev => { const s = new Set(prev); s.delete(newQ.no); return s; }), 3500);
    adoptedTimers.current.set(newQ.no, t);
  };

  const adoptCustomQuestion = (question: BasicSetQuestion) => {
    const existing = questionsByFolder[selectedFolder] ?? [];
    const nextDisplayNo = Math.max(0, ...existing
      .filter(item => item.adopted)
      .map(item => item.displayNo ?? item.no)
      .map(no => typeof no === 'number' ? no : Number(no) || 0)) + 1;
    updateFolderQuestions(selectedFolder, questions => [...questions, {
      no: nextNoRef.current++,
      displayNo: nextDisplayNo,
      title: question.title,
      type: normalizeQuestionType(question.type),
      attachment: question.attachment === 'Y' ? '필수' : '없음',
      adopted: true,
      folderId: selectedFolder,
      sourceNo: question.no,
      sourceFolderId: selectedFolder,
      choices: question.choices,
      form: question.form,
      industries: question.industries ?? question.form?.industries ?? [],
    }]);
    setModalState('none');
    setToastMsg(`기타 지표 “${question.title}”을 ${folderLabel(selectedFolder)} 폴더에 추가했습니다.`);
    setShowToast(true);
  };

  const startEdit = (q: Question) => {
    setEditingNo(q.no);
    setEditTitle(q.title);
    setEditType(normalizeQuestionType(q.type));
    setEditAttachment(q.attachment ?? '없음');
    setEditItems(getQuestionChoices(q).map(choice => choice.text));
  };
  const saveEdit = () => {
    updateFolderQuestions(selectedFolder, qs => qs.map(q => {
      if (q.no !== editingNo) return q;
      const previousChoices = getQuestionChoices(q);
      const choices = editItems
        .map(item => item.trim())
        .filter(Boolean)
        .map((text, index) => ({
          text,
          score: previousChoices[index]?.score ?? Math.max(0, 5 - index),
        }));
      return {
        ...q,
        title: editTitle,
        type: editType,
        attachment: editAttachment,
        choices,
        modified: true,
        form: q.form ? {
          ...q.form,
          title: editTitle,
          questionType: editType,
          hasAttachment: editAttachment === '없음' ? 'no' : 'yes',
        } : undefined,
      };
    }));
    const scorePrefix = `${selectedFolder}:${String(editingNo)}:`;
    setChoiceScores(prev => Object.fromEntries(Object.entries(prev).filter(([key]) => !key.startsWith(scorePrefix))));
    setSavedChoiceScores(prev => Object.fromEntries(Object.entries(prev).filter(([key]) => !key.startsWith(scorePrefix))));
    setEditingNo(null); setToastMsg('수정 내용이 이 캠페인에만 반영됩니다.'); setShowToast(true);
  };
  const cancelEdit = () => setEditingNo(null);

  const startAddQuestion = () => {
    setNewTitle('');
    setNewType('라디오');
    setNewAttachment('없음');
    setNewItems(['예', '아니오']);
    setIsAddingQuestion(true);
  };

  const saveNewQuestion = () => {
    const title = newTitle.trim();
    if (!title) {
      setToastMsg('질의 제목을 입력해 주세요.');
      setShowToast(true);
      return;
    }

    const libraryFolderId = LIBRARY_FOLDER_ALIASES[selectedFolder] ?? selectedFolder;
    const libraryQuestions = QUESTIONS_BY_FOLDER[libraryFolderId] ?? [];
    const campaignQuestions = questionsByFolder[selectedFolder] ?? [];
    const sequenceValues = [
      ...libraryQuestions
        .filter(question => !question.parentNo)
        .map(question => createQuestionFormDefaults(question, libraryFolderId).sequence),
      ...campaignQuestions
        .filter(question => question.sourceNo === undefined && question.form)
        .map(question => question.form!.sequence),
    ];
    const nextSequence = Math.max(
      0,
      ...sequenceValues.map(sequence => Number(sequence.replace(/\D/g, '')) || 0),
    ) + 1;
    const defaults = createQuestionFormDefaults({
      no: String(nextSequence),
      title,
      type: newType,
      attachment: newAttachment === '필수' ? 'Y' : 'N',
      updated: '',
      campaigns: 0,
    }, libraryFolderId);
    const form: QuestionFormValues = {
      ...defaults,
      classification: '분류[1]:정책/인증/계획',
      sequence: String(nextSequence),
      depth: '심화',
      industry: '-산업분류-',
      companyCode: '',
      hasAttachment: newAttachment === '없음' ? 'no' : 'yes',
      questionType: newType,
      title,
      industryCode: campaignIndustryCode,
    };
    const idValues = {
      ...form,
      industry: `구분[${campaignIndustryCode}]:캠페인 업종`,
    };
    const nextDisplayNo = Math.max(
      0,
      ...campaignQuestions
        .filter(question => question.adopted)
        .map(question => question.displayNo ?? question.no)
        .map(no => typeof no === 'number' ? no : /^\d+$/.test(String(no)) ? Number(no) : 0),
    ) + 1;
    const choices = newItems
      .map(item => item.trim())
      .filter(Boolean)
      .map((text, index) => ({ text, score: Math.max(0, 5 - index) }));
    const question: Question = {
      no: nextNoRef.current++,
      displayNo: nextDisplayNo,
      title,
      type: newType,
      attachment: newAttachment,
      adopted: true,
      folderId: selectedFolder,
      sourceFolderId: libraryFolderId,
      industryCode: campaignIndustryCode,
      questionId: generateQuestionId(idValues),
      form,
      choices,
    };

    updateFolderQuestions(selectedFolder, questions => [...questions, question]);
    setIsAddingQuestion(false);
    setToastMsg('질의가 반영 질의에 추가되었습니다.');
    setShowToast(true);
  };

  const deleteAddedQuestion = (question: Question) => {
    updateFolderQuestions(selectedFolder, questions => questions.filter(item => item.no !== question.no));
    if (editingNo === question.no) setEditingNo(null);
    setExpandedQuestionKey(prev => prev === `${selectedFolder}:${question.no}` ? null : prev);
  };

  const toggleQuestionChoices = (questionKey: string) => {
    setExpandedQuestionKey(prev => prev === questionKey ? null : questionKey);
  };

  const saveChoiceScores = (questionKey: string, choices: QuestionChoice[]) => {
    setSavedChoiceScores(prev => {
      const next = { ...prev };
      choices.forEach((choice, index) => {
        const scoreKey = `${questionKey}:${index}`;
        next[scoreKey] = choiceScores[scoreKey] ?? prev[scoreKey] ?? String(choice.score);
      });
      return next;
    });
    setChoiceScores(prev => {
      const next = { ...prev };
      choices.forEach((_, index) => delete next[`${questionKey}:${index}`]);
      return next;
    });
    setToastMsg('보기별 배점이 저장되었습니다.');
    setShowToast(true);
  };

  const toggleLibraryParent = (no: string | number) => {
    setExpandedLibraryParents(prev => { const s = new Set(prev); s.has(no) ? s.delete(no) : s.add(no); return s; });
  };

  const toggleImportFolder = (id: string) => {
    setImportOpenFolders(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const toggleBasicFolder = (id: string) => {
    setBasicOpenFolders(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const toggleBasicQuestion = (folderId: string, no: string) => {
    setCheckedBasicByFolder(prev => {
      const current = prev[folderId] ?? [];
      return { ...prev, [folderId]: current.includes(no) ? current.filter(value => value !== no) : [...current, no] };
    });
  };

  const totalBasicChecked = Object.values(checkedBasicByFolder).reduce((total, values) => total + values.length, 0);

  const toggleBasicTopFolder = (node: (typeof FOLDER_TREE)[number]) => {
    const childIds = (node.children ?? []).map(child => child.id);
    const allSelected = childIds.every(folderId => {
      const questions = (QUESTIONS_BY_FOLDER[folderId] ?? []).filter(question => !(question.industries?.length ?? question.form?.industries?.length ?? 0));
      return questions.length > 0 && (checkedBasicByFolder[folderId]?.length ?? 0) === questions.length;
    });
    setCheckedBasicByFolder(prev => {
      const next = { ...prev };
      childIds.forEach(folderId => {
        next[folderId] = allSelected ? [] : (QUESTIONS_BY_FOLDER[folderId] ?? []).filter(question => !(question.industries?.length ?? question.form?.industries?.length ?? 0)).map(question => question.no);
      });
      return next;
    });
  };

  const selectEntireBasicSet = () => {
    setCheckedBasicByFolder(Object.fromEntries(
      FOLDER_TREE.flatMap(node => node.children ?? []).map(child => [
        child.id,
        (QUESTIONS_BY_FOLDER[child.id] ?? []).filter(question => !(question.industries?.length ?? question.form?.industries?.length ?? 0)).map(question => question.no),
      ]),
    ));
  };

  const handleBasicSetImport = () => {
    const entries = Object.entries(checkedBasicByFolder).filter(([, nos]) => nos.length > 0);
    if (entries.length === 0) return;

    setQuestionsByFolder(prev => {
      const next = { ...prev };
      entries.forEach(([folderId, nos]) => {
        const source = (QUESTIONS_BY_FOLDER[folderId] ?? []).filter(question => nos.includes(question.no));
        const existing = next[folderId] ?? [];
        const importedNoBySource = new Map<string, number | string>();
        const importedDisplayNoBySource = new Map<string, number | string>();
        const childIndexByParent = new Map<string, number>();
        let nextDisplayNo = Math.max(0, ...existing
          .filter(question => question.adopted)
          .map(question => question.displayNo ?? question.no)
          .map(no => typeof no === 'number' ? no : /^\d+$/.test(String(no)) ? Number(no) : 0)) + 1;
        const imported = source
          .map((question: BasicSetQuestion) => {
            const no = nextNoRef.current++;
            importedNoBySource.set(question.no, no);
            const importedParentNo = question.parentNo ? importedNoBySource.get(question.parentNo) : undefined;
            let displayNo: number | string;
            if (question.parentNo && importedParentNo !== undefined) {
              const childIndex = (childIndexByParent.get(question.parentNo) ?? 0) + 1;
              childIndexByParent.set(question.parentNo, childIndex);
              displayNo = `${importedDisplayNoBySource.get(question.parentNo)}-${childIndex}`;
            } else {
              displayNo = nextDisplayNo++;
            }
            importedDisplayNoBySource.set(question.no, displayNo);
            return {
              no,
              displayNo,
              title: question.title,
              type: question.type,
              attachment: question.attachment === 'Y' ? '필수' : '없음',
              adopted: true,
              parentNo: importedParentNo,
              folderId,
              industryCode: (question as BasicSetQuestion).industryCode ?? 0,
              sourceNo: question.no,
              sourceFolderId: folderId,
            };
          });
        next[folderId] = [...existing, ...imported];
      });
      return next;
    });

    setSurveyFolders(prev => {
      let next = prev;
      entries.forEach(([folderId]) => {
        if (collectAllIds(next).includes(folderId)) return;
        const parent = FOLDER_TREE.find(node => node.children?.some(child => child.id === folderId));
        const child = parent?.children?.find(node => node.id === folderId);
        if (!parent || !child) return;
        if (next.some(node => node.id === parent.id)) {
          next = next.map(node => node.id === parent.id
            ? { ...node, children: [...(node.children ?? []), { id: child.id, label: child.label, count: 0 }] }
            : node);
        } else {
          next = [...next, {
            id: parent.id,
            label: parent.label.replace(/^[▼▶]\s*/, ''),
            count: 0,
            children: [{ id: child.id, label: child.label, count: 0 }],
          }];
        }
      });
      return next;
    });

    const parentIds = entries
      .map(([folderId]) => FOLDER_TREE.find(node => node.children?.some(child => child.id === folderId))?.id)
      .filter(Boolean) as string[];
    setOpenFolders(prev => new Set([...prev, ...parentIds]));
    setSelectedFolder(entries[0][0]);
    setCheckedBasicByFolder({});
    setModalState('none');
    setToastMsg(`기본 SET에서 ${totalBasicChecked}건의 질의를 반영 질의로 가져왔습니다.`);
    setShowToast(true);
  };

  const totalChecked = Object.values(checkedByFolder).reduce((s, arr) => s + arr.length, 0);

  const toggleFolderAllCheck = (folderId: string) => {
    const qs = IMPORT_QUESTIONS_BY_FOLDER[folderId] ?? [];
    const cur = checkedByFolder[folderId] ?? [];
    const allChecked = qs.length > 0 && cur.length === qs.length;
    setCheckedByFolder(prev => ({ ...prev, [folderId]: allChecked ? [] : qs.map((_, i) => i) }));
  };

  const handleImport = () => {
    const entries = Object.entries(checkedByFolder).filter(([, idxs]) => idxs.length > 0);
    if (entries.length === 0) { setToastMsg('선택된 질의가 없습니다.'); setShowToast(true); return; }

    let totalAdded = 0;

    /* 1. 폴더별 질의 추가 (adopted: true) */
    setQuestionsByFolder(prev => {
      const next = { ...prev };
      for (const [folderId, idxs] of entries) {
        const srcQs = IMPORT_QUESTIONS_BY_FOLDER[folderId] ?? [];
        const existing = next[folderId] ?? [];
        const existingTitles = new Set(existing.map(q => q.title));
        const newQs: Question[] = srcQs
          .filter((_, i) => idxs.includes(i))
          .filter(iq => !existingTitles.has(iq.title))
          .map(iq => ({
            no: nextNoRef.current++,
            title: iq.title,
            type: iq.type,
            attachment: iq.attachment === 'Y' ? '필수' : '없음',
            adopted: true,   // ← 바로 반영 질의로 추가
            folderId,
            sourceNo: iq.no,
            sourceFolderId: folderId,
          }));
        next[folderId] = [...existing, ...newQs];
        totalAdded += newQs.length;
      }
      return next;
    });

    /* 2. 없는 폴더 자동 생성 */
    setSurveyFolders(prev => {
      let next = prev;
      for (const [folderId] of entries) {
        if (collectAllIds(next).includes(folderId)) continue;
        const parentInfo = FOLDER_PARENT_MAP[folderId];
        const childNode = { id: folderId, label: IMPORT_FOLDER_LABELS[folderId] ?? folderId, count: 0 };
        if (!parentInfo) {
          next = [...next, childNode];
        } else if (next.some(n => n.id === parentInfo.parentId)) {
          next = next.map(n => n.id === parentInfo.parentId
            ? { ...n, children: [...(n.children ?? []), childNode] } : n);
        } else {
          next = [...next, { id: parentInfo.parentId, label: parentInfo.parentLabel, count: 0, children: [childNode] }];
        }
      }
      return next;
    });

    /* 3. 상위 폴더 열기 */
    const parentIds = entries.map(([fid]) => FOLDER_PARENT_MAP[fid]?.parentId).filter(Boolean) as string[];
    if (parentIds.length) setOpenFolders(prev => new Set([...prev, ...parentIds]));

    setCheckedByFolder({});
    setModalState('none');
    setSelectedImportCampaign(null);
    setToastMsg(`총 ${totalAdded}건의 질의가 반영 질의로 추가되었습니다.`);
    setShowToast(true);
  };

  const folderLabel = (id: string): string => {
    const search = (nodes: FolderNode[]): string | null => {
      for (const n of nodes) { if (n.id === id) return n.label; if (n.children) { const r = search(n.children); if (r) return r; } }
      return null;
    };
    return search(surveyFolders) ?? IMPORT_FOLDER_LABELS[id] ?? id;
  };

  const addSiblingFolder = () => {
    const selectedTop = surveyFolders.find(node => node.id === selectedFolder);
    const parentId = selectedTop?.id
      ?? surveyFolders.find(node => node.children?.some(child => child.id === selectedFolder))?.id;
    if (!parentId) return;
    const id = `${parentId}-custom-${Date.now()}`;
    setSurveyFolders(prev => prev.map(node => node.id === parentId
      ? { ...node, children: [...(node.children ?? []), { id, label: '새 폴더', count: 0 }] }
      : node));
    setQuestionsByFolder(prev => ({ ...prev, [id]: [] }));
    setOpenFolders(prev => new Set([...prev, parentId]));
    setSelectedFolder(id);
    setFolderNameDraft('새 폴더');
    setEditingFolderName(true);
  };

  const isBasicFolderUsed = (folderId: string) =>
    (questionsByFolder[folderId]?.length
      ?? questionsByFolder[Object.entries(LIBRARY_FOLDER_ALIASES).find(([, libraryId]) => libraryId === folderId)?.[0] ?? '']?.length
      ?? 0) > 0;
  const openBasicSetModal = () => {
    const firstAvailable = FOLDER_TREE
      .flatMap(node => node.children ?? [])
      .find(child => !isBasicFolderUsed(child.id));
    setBasicSelectedFolder(firstAvailable?.id ?? 'L-고용');
    setCheckedBasicByFolder({});
    setModalState('basic-set');
  };

  const saveFolderName = () => {
    const nextLabel = folderNameDraft.trim();
    if (!nextLabel) return;
    const rename = (nodes: FolderNode[]): FolderNode[] => nodes.map(node => ({
      ...node,
      label: node.id === selectedFolder ? nextLabel : node.label,
      children: node.children ? rename(node.children) : undefined,
    }));
    setSurveyFolders(rename);
    setEditingFolderName(false);
  };

  const filteredImportCampaigns = IMPORT_CAMPAIGNS.filter(c => {
    if (importActiveFilter !== '전체' && c.active !== importActiveFilter) return false;
    if (importStatusFilter !== '전체' && c.status !== importStatusFilter) return false;
    if (importFilter && !c.name.includes(importFilter)) return false;
    return true;
  });

  const importFolderQuestions = IMPORT_QUESTIONS_BY_FOLDER[importSelectedFolder] ?? [];
  const downloadSurveySet = () => {
    const rows = surveyFolders.flatMap(topFolder => (topFolder.children ?? []).flatMap(child =>
      (questionsByFolder[child.id] ?? []).filter(question => question.adopted).map(question => ({
        대분류: topFolder.label,
        폴더명: child.label,
        질의번호: question.displayNo ?? question.no,
        질의제목: question.title,
        질의유형: question.type,
        첨부파일: question.attachment,
      })),
    ));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), '설문 SET');
    XLSX.writeFile(workbook, `${campaignName || '캠페인'}_설문SET.xlsx`);
  };

  return (
    <div style={{ position: 'relative' }}>
      {showToast && (
        <div style={{ position: 'fixed', top: 72, right: 24, zIndex: 2000, background: '#1a6fbf', color: '#fff', borderRadius: 6, padding: '12px 20px', fontSize: 13, maxWidth: 400, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', whiteSpace: 'pre-line' }}>
          {toastMsg}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a3055' }}>설문 정보 등록</h2>
          {campaignName && <span style={{ fontSize: 13, color: '#888' }}>| {campaignName}</span>}
        </div>
        <div className="flex gap-2">
          <button onClick={openBasicSetModal} style={{ background: '#1a6fbf', color: '#fff', border: 'none', borderRadius: 4, padding: '7px 16px', fontSize: 13, cursor: 'pointer' }}>기본 SET 불러오기</button>
          <button onClick={downloadSurveySet} className="inline-flex items-center gap-2" style={{ background: '#1a3055', color: '#fff', border: 'none', borderRadius: 4, padding: '7px 16px', fontSize: 13, cursor: 'pointer' }}><svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" strokeLinecap="round" strokeLinejoin="round" /></svg>설문SET 다운로드</button>
          <button onClick={() => setModalState('import-list')} style={{ background: '#167d8d', color: '#fff', border: 'none', borderRadius: 4, padding: '7px 16px', fontSize: 13, cursor: 'pointer' }}>캠페인 불러오기</button>
          <button onClick={onBack} style={{ border: '1px solid #ccc', background: '#fff', borderRadius: 4, padding: '7px 16px', fontSize: 13, cursor: 'pointer' }}>뒤로</button>
        </div>
      </div>

      <div className="flex gap-4" style={{ minHeight: 600 }}>
        {/* 좌: 설문 구성 폴더 트리 */}
        <div style={{ width: 210, flexShrink: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 4, padding: '8px 0', fontSize: 12, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '8px 12px', fontWeight: 700, color: '#1a3055', borderBottom: '1px solid #e8e8e8', fontSize: 13, marginBottom: 4 }}>설문 구성</div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {surveyFolders.map(topNode => (
              <div key={topNode.id}>
                <div
                  role="button" tabIndex={0}
                  onClick={() => { setSelectedFolder(topNode.id); toggleFolder(topNode.id); }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      setSelectedFolder(topNode.id);
                      toggleFolder(topNode.id);
                    }
                  }}
                  className="w-full hover:bg-gray-50 flex items-center justify-between"
                  style={{ padding: '5px 12px', fontWeight: 600, color: '#333', fontSize: 12, cursor: 'pointer', userSelect: 'none' }}
                >
                  <span>{openFolders.has(topNode.id) ? '▼' : '▶'} {topNode.label}</span>
                  <div className="flex items-center gap-1">
                    <span style={{ background: '#e0e0e0', borderRadius: 10, padding: '1px 7px', fontSize: 11 }}>
                      {topNode.children?.reduce((s, c) => s + (questionsByFolder[c.id]?.filter(q => q.adopted).length ?? 0), 0) ?? 0}
                    </span>
                    <button onClick={e => { e.stopPropagation(); deleteFolder(topNode.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e63946', fontSize: 13, lineHeight: 1, padding: '0 2px' }}>×</button>
                  </div>
                </div>
                {openFolders.has(topNode.id) && topNode.children?.map(child => {
                  const adoptedCount = questionsByFolder[child.id]?.filter(q => q.adopted).length ?? 0;
                  return (
                    <div key={child.id}
                      role="button" tabIndex={0}
                      onClick={() => setSelectedFolder(child.id)}
                      onKeyDown={e => e.key === 'Enter' && setSelectedFolder(child.id)}
                      className="w-full hover:bg-blue-50 flex items-center justify-between"
                      style={{
                        padding: '4px 12px 4px 22px', fontSize: 11, cursor: 'pointer', userSelect: 'none',
                        color: selectedFolder === child.id ? '#1a6fbf' : '#555',
                        background: selectedFolder === child.id ? '#eff6ff' : undefined,
                        borderLeft: selectedFolder === child.id ? '3px solid #1a6fbf' : '3px solid transparent',
                      }}
                    >
                      <span>{child.label}</span>
                      <div className="flex items-center gap-1">
                        <span style={{ background: '#e0e0e0', borderRadius: 10, padding: '1px 6px', fontSize: 10 }}>{adoptedCount}</span>
                        <button onClick={e => { e.stopPropagation(); deleteFolder(child.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e63946', fontSize: 13, lineHeight: 1, padding: '0 2px' }}>×</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #e8e8e8', padding: '8px 10px' }}>
            <button onClick={addSiblingFolder} style={{ width: '100%', border: '1px dashed #1a6fbf', background: '#f0f7ff', color: '#1a6fbf', borderRadius: 4, padding: '5px 8px', fontSize: 11, cursor: 'pointer' }}>+ 폴더 추가</button>
          </div>
        </div>

        {/* 우: 질의 목록 */}
        <div style={{ flex: 1, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 4, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="flex items-center justify-between" style={{ padding: '12px 16px', borderBottom: '1px solid #e8e8e8', flexShrink: 0 }}>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 13, color: '#888' }}>폴더명</span>
              {editingFolderName ? (
                <>
                  <input
                    value={folderNameDraft}
                    onChange={event => setFolderNameDraft(event.target.value)}
                    onKeyDown={event => event.key === 'Enter' && saveFolderName()}
                    autoFocus
                    style={{ border: '1px solid #b9c2cf', borderRadius: 3, padding: '4px 8px', fontSize: 13, width: 180 }}
                  />
                  <button onClick={saveFolderName} style={{ border: 'none', background: '#1a6fbf', color: '#fff', borderRadius: 3, padding: '4px 9px', fontSize: 11, cursor: 'pointer' }}>저장</button>
                  <button onClick={() => setEditingFolderName(false)} style={{ border: '1px solid #ccc', background: '#fff', borderRadius: 3, padding: '3px 8px', fontSize: 11, cursor: 'pointer' }}>취소</button>
                </>
              ) : (
                <>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{folderLabel(selectedFolder)}</span>
                  <button
                    onClick={() => { setFolderNameDraft(folderLabel(selectedFolder)); setEditingFolderName(true); }}
                    style={{ background: 'none', border: 'none', color: '#1a6fbf', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    ✏ 수정
                  </button>
                </>
              )}
            </div>
            <div className="flex gap-2">
              {/* BUG 9: 질의 추가 button */}
              {onNavigateAdd && (
                <button
                  onClick={() => { setCustomDetail(null); setCustomBankSearch(''); setCustomBankType(''); setModalState('custom-bank'); }}
                  style={{ background: '#1a3055', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', fontSize: 13, cursor: 'pointer' }}
                >+ 질의 추가</button>
              )}
              <button
                onClick={() => {
                  const campaignEntry = { name: campaignName, client: '', period: '', status: '진행중' };
                  const today = new Date();
                  const todayStr = `${String(today.getFullYear()).slice(2)}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`;

                  // 1. Collect all reflected questions across all folders
                  const allReflected: Question[] = [];
                  Object.values(questionsByFolder).forEach(qs => {
                    qs.filter(q => q.adopted).forEach(q => allReflected.push(q));
                  });

                  // Save campaign set so other campaigns can "불러오기"
                  CAMPAIGN_SAVED_SETS[campaignName] = allReflected;

                  // 2-8. Process each reflected question per spec
                  Object.keys(questionsByFolder).forEach(folderId => {
                    const qs = questionsByFolder[folderId] ?? [];
                    const adoptedInFolder = qs.filter(q => q.adopted);
                    if (!adoptedInFolder.length) return;

                    let srcFolder = QUESTIONS_BY_FOLDER[folderId];
                    if (!srcFolder) {
                      (QUESTIONS_BY_FOLDER as Record<string, BasicSetQuestion[]>)[folderId] = [];
                      srcFolder = QUESTIONS_BY_FOLDER[folderId];
                    }

                    adoptedInFolder.forEach(q => {
                      // Find original library question by sourceNo (preferred) or by title (fallback for old questions)
                      const src = (q.sourceNo !== undefined
                        ? srcFolder.find(bq => bq.no === String(q.sourceNo))
                        : undefined) as (BasicSetQuestion | undefined);

                      if (!src) {
                        // CASE 5: Truly new question (sourceNo is undefined, added via 질의 추가) — add to library
                        if (q.sourceNo !== undefined) return; // sourceNo present but src not found — skip, don't create
                        const targetFolderId = q.sourceFolderId ?? folderId;
                        if (!QUESTIONS_BY_FOLDER[targetFolderId]) {
                          (QUESTIONS_BY_FOLDER as Record<string, BasicSetQuestion[]>)[targetFolderId] = [];
                        }
                        const targetFolder = QUESTIONS_BY_FOLDER[targetFolderId];
                        const parentCount = targetFolder.filter(bq => !bq.parentNo).length;
                        targetFolder.push({
                          no: String(parentCount + 1),
                          questionId: q.questionId,
                          title: q.title,
                          type: q.type,
                          attachment: q.attachment === '없음' ? 'N' : 'Y',
                          updated: todayStr,
                          campaigns: 1,
                          campaignList: [campaignEntry],
                          industryCode: campaignIndustryCode,
                          form: q.form,
                          choices: q.choices,
                        });
                        return;
                      }

                      const srcIndustryCode = src.industryCode ?? 0;

                      if (srcIndustryCode === 0) {
                        // CASE 1 & 2: Common question (industryCode 0) — ALWAYS campaign mapping only, NEVER create child or new entry
                        const alreadyHas = (src.campaignList ?? []).some(c => c.name === campaignName);
                        if (!alreadyHas) {
                          src.campaignList = [...(src.campaignList ?? []), campaignEntry];
                          src.campaigns = (src.campaigns ?? 0) + 1;
                        }
                        return;
                      }

                      // Industry-specific question (industryCode !== 0)
                      // If src is itself a child (has parentNo), new entries are siblings (same parent);
                      // otherwise new entries are children of src.
                      const siblingParentNo = src.parentNo ?? src.no;
                      const isSrcChild = src.parentNo !== undefined;

                      if (!q.modified) {
                        // CASE 3: Not modified — compare industry codes
                        if (srcIndustryCode === campaignIndustryCode) {
                          // Same industry code: campaign mapping only
                          const alreadyHas = (src.campaignList ?? []).some(c => c.name === campaignName);
                          if (!alreadyHas) {
                            src.campaignList = [...(src.campaignList ?? []), campaignEntry];
                            src.campaigns = (src.campaigns ?? 0) + 1;
                          }
                        } else {
                          // Different industry code: create sibling (if src is child) or child (if src is root)
                          const siblings = srcFolder.filter(bq => bq.parentNo === siblingParentNo);
                          const newNo = isSrcChild
                            ? `${siblingParentNo}-${siblings.length + 1}`
                            : `${src.no}-${siblings.length + 1}`;
                          srcFolder.push({
                            no: newNo,
                            parentNo: siblingParentNo,
                            title: q.title,
                            type: q.type,
                            attachment: q.attachment === '필수' ? 'Y' : 'N',
                            updated: todayStr,
                            campaigns: 1,
                            campaignList: [campaignEntry],
                            industryCode: campaignIndustryCode,
                          });
                        }
                      } else {
                        // CASE 4: Modified — create sibling (if src is child) or child (if src is root)
                        const siblings = srcFolder.filter(bq => bq.parentNo === siblingParentNo);
                        const newNo = isSrcChild
                          ? `${siblingParentNo}-${siblings.length + 1}`
                          : `${src.no}-${siblings.length + 1}`;
                        srcFolder.push({
                          no: newNo,
                          parentNo: siblingParentNo,
                          title: q.title,
                          type: q.type,
                          attachment: q.attachment === '필수' ? 'Y' : 'N',
                          updated: todayStr,
                          campaigns: 1,
                          campaignList: [campaignEntry],
                          industryCode: campaignIndustryCode,
                        });
                      }
                    });
                  });

                  setToastMsg('저장되었습니다.');
                  setShowToast(true);
                  setTimeout(() => onBack(), 800);
                }}
                style={{ background: '#e63946', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', fontSize: 13, cursor: 'pointer' }}
              >저장</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 120px 90px 90px 80px 130px', borderBottom: '1px solid #e8e8e8', background: '#f7f8fa', padding: '8px 16px', fontSize: 12, fontWeight: 600, color: '#555', flexShrink: 0 }}>
            <span>No</span><span>질의 제목</span>
            <span style={{ textAlign: 'center' }}>할당 산업</span>
            <span style={{ textAlign: 'center' }}>반영캠페인</span>
            <span style={{ textAlign: 'center' }}>질의 유형</span>
            <span style={{ textAlign: 'center' }}>첨부파일</span>
            <span style={{ textAlign: 'center' }}>관리</span>
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {/* 반영된 질의 */}
            {adoptedQs.map(q => {
              const questionKey = `${selectedFolder}:${q.no}`;
              const isChoicesExpanded = expandedQuestionKey === questionKey;
              const choices = getQuestionChoices(q);
              const isAdoptedChild = q.parentNo !== undefined
                && adoptedQs.some(parent => parent.no === q.parentNo);
              return (
                <div key={q.no}>
                <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 120px 90px 90px 80px 130px', padding: '8px 16px', fontSize: 13, borderBottom: '1px solid #f0f0f0', background: editingNo === q.no ? '#fffbea' : '#fff', alignItems: 'center' }}>
                  <span style={{ color: '#555', fontSize: 12 }}>{isAdoptedChild ? `ㄴ ${q.displayNo ?? q.no}` : q.displayNo ?? q.no}</span>
                  <span className="flex items-center gap-2" style={{ paddingLeft: isAdoptedChild ? 12 : 0 }}>
                    <button
                      type="button"
                      onClick={() => toggleQuestionChoices(questionKey)}
                      aria-expanded={isChoicesExpanded}
                      aria-controls={`question-choices-${String(q.no).replaceAll('.', '-')}`}
                      style={{ background: 'none', border: 'none', color: '#1a3055', cursor: 'pointer', fontSize: 13, textAlign: 'left', padding: 0 }}
                    >
                      <span style={{ display: 'inline-block', width: 14, color: '#888', fontSize: 10 }}>
                        {isChoicesExpanded ? '▼' : '▶'}
                      </span>
                      {q.title}
                    </button>
                    {q.modified && <span style={{ background: '#f59e0b', color: '#fff', fontSize: 10, borderRadius: 3, padding: '1px 5px', flexShrink: 0 }}>수정됨</span>}
                    {newlyAdoptedNos.has(q.no) && <span style={{ background: '#16a34a', color: '#fff', fontSize: 10, borderRadius: 3, padding: '1px 5px', flexShrink: 0 }}>채택됨</span>}
                  </span>
                  <span className="flex flex-wrap justify-center gap-1">{(q.industries ?? q.form?.industries ?? []).length > 0 ? (q.industries ?? q.form?.industries ?? []).map(industry => <span key={industry} className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-700 ring-1 ring-orange-200">{industry}</span>) : <span className="text-xs text-gray-300">-</span>}</span>
                  <span style={{ textAlign: 'center', color: '#999', fontSize: 12 }}>-</span>
                  <span style={{ textAlign: 'center', color: '#555', fontSize: 12 }}>{normalizeQuestionType(q.type)}</span>
                  <span style={{ textAlign: 'center', color: q.attachment === '필수' ? '#1a6fbf' : '#999', fontSize: 12 }}>{q.attachment}</span>
                  <div className="flex gap-1 justify-center">
                    {editingNo === q.no ? (
                      <>
                        <button onClick={saveEdit} style={{ background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 3, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>저장</button>
                        <button onClick={cancelEdit} style={{ border: '1px solid #ccc', background: '#fff', borderRadius: 3, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>취소</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(q)} style={{ background: '#1a6fbf', color: '#fff', border: 'none', borderRadius: 3, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>수정</button>
                        {q.sourceNo === undefined ? (
                          <button onClick={() => deleteAddedQuestion(q)} style={{ border: '1px solid #e63946', color: '#e63946', background: '#fff', borderRadius: 3, padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>삭제</button>
                        ) : (
                          <button onClick={() => unadoptQuestion(q)} style={{ border: '1px solid #e63946', color: '#e63946', background: '#fff', borderRadius: 3, padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>미반영</button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {isChoicesExpanded && (
                  <div
                    id={`question-choices-${String(q.no).replaceAll('.', '-')}`}
                    style={{ background: '#f7f9fc', borderBottom: '1px solid #dfe5ec', padding: '10px 16px 12px 76px' }}
                  >
                    {normalizeQuestionType(q.type) === '텍스트박스' ? (
                      <div style={{ padding: '10px 0', color: '#888', fontSize: 12, fontStyle: 'italic' }}>
                        이 질의는 응답자가 직접 텍스트를 입력하는 유형입니다.
                        <br />
                        <textarea disabled placeholder="텍스트 입력란 (실제 응답 시 활성화됨)" style={{ width: '100%', minHeight: 60, border: '1px dashed #ccc', borderRadius: 4, padding: '6px 10px', fontSize: 12, marginTop: 8, background: '#f9f9f9', resize: 'vertical' }} />
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '72px 90px 1fr', minHeight: 30, alignItems: 'center', background: '#eef2f6', borderTop: '1px solid #dfe5ec', borderBottom: '1px solid #dfe5ec', color: '#555', fontSize: 12, fontWeight: 600 }}>
                          <span style={{ textAlign: 'center' }}>보기 번호</span>
                          <span style={{ textAlign: 'center' }}>배점</span>
                          <span style={{ paddingLeft: 16 }}>보기 텍스트</span>
                        </div>
                        {choices.map((choice, index) => {
                          const scoreKey = `${questionKey}:${index}`;
                          return (
                            <div key={scoreKey} style={{ display: 'grid', gridTemplateColumns: '72px 90px 1fr', minHeight: 36, alignItems: 'center', background: '#fff', borderBottom: '1px solid #e8ebef', color: '#444', fontSize: 12 }}>
                              <span style={{ textAlign: 'center', color: '#666' }}>{index + 1}</span>
                              <span style={{ display: 'flex', justifyContent: 'center' }}>
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  aria-label={`${q.title} 보기 ${index + 1} 배점`}
                                  value={choiceScores[scoreKey] ?? savedChoiceScores[scoreKey] ?? String(choice.score)}
                                  onChange={e => {
                                    if (/^\d*\.?\d*$/.test(e.target.value)) {
                                      setChoiceScores(prev => ({ ...prev, [scoreKey]: e.target.value }));
                                    }
                                  }}
                                  onBlur={e => {
                                    if (e.target.value === '') {
                                      setChoiceScores(prev => ({ ...prev, [scoreKey]: savedChoiceScores[scoreKey] ?? String(choice.score) }));
                                    }
                                  }}
                                  style={{ width: 54, border: '1px solid #c9ced6', borderRadius: 3, padding: '4px 6px', fontSize: 12, textAlign: 'right', background: '#fff' }}
                                />
                              </span>
                              <span style={{ paddingLeft: 16 }}>{choice.text}</span>
                            </div>
                          );
                        })}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 10 }}>
                          <button
                            type="button"
                            onClick={() => saveChoiceScores(questionKey, choices)}
                            style={{ background: '#1a6fbf', color: '#fff', border: 'none', borderRadius: 3, padding: '5px 16px', fontSize: 12, cursor: 'pointer' }}
                          >
                            저장
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {editingNo === q.no && (
                  <div style={{ background: '#fffbea', borderBottom: '1px solid #f0e0a0', padding: '14px 20px 16px' }}>
                    <div style={{ background: '#eef3fb', border: '1px solid #c5d8f5', borderRadius: 4, padding: '8px 14px', fontSize: 12, color: '#1a6fbf', marginBottom: 12 }}>
                      ⓘ 기본 SET 질의 — 수정사항은 이 캠페인에만 반영됩니다.
                    </div>
                    <div className="flex items-center gap-4 mb-3 flex-wrap">
                      <span style={{ fontSize: 12, fontWeight: 600, minWidth: 50 }}>질의 유형</span>
                      {['라디오', '체크박스', '텍스트박스', '정량데이터'].map(t => (
                        <label key={t} className="flex items-center gap-1" style={{ fontSize: 12, cursor: 'pointer' }}>
                          <input type="radio" checked={editType === t} onChange={() => setEditType(t)} style={{ accentColor: '#1a6fbf' }} /> {t}
                        </label>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <span style={{ fontSize: 12, fontWeight: 600, minWidth: 50 }}>첨부파일</span>
                      {['없음', '선택', '필수'].map(a => (
                        <label key={a} className="flex items-center gap-1" style={{ fontSize: 12, cursor: 'pointer' }}>
                          <input type="radio" checked={editAttachment === a} onChange={() => setEditAttachment(a)} style={{ accentColor: '#1a6fbf' }} /> {a}
                        </label>
                      ))}
                    </div>
                    <textarea value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{ width: '100%', border: '1px solid #ccc', borderRadius: 4, padding: '8px 12px', fontSize: 13, minHeight: 80, resize: 'vertical', marginBottom: 10 }} />
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>답변 문항</div>
                    {editItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 mb-2">
                        <span style={{ fontSize: 12, color: '#888', minWidth: 16 }}>{i + 1}</span>
                        <input value={item} onChange={e => setEditItems(prev => prev.map((v, j) => j === i ? e.target.value : v))} style={{ border: '1px solid #ccc', borderRadius: 4, padding: '5px 10px', fontSize: 12, flex: 1 }} />
                        <button onClick={() => setEditItems(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: 16 }}>×</button>
                      </div>
                    ))}
                    <button onClick={() => setEditItems(prev => [...prev, ''])} style={{ border: '1px dashed #1a6fbf', background: '#f0f7ff', color: '#1a6fbf', borderRadius: 4, padding: '5px 14px', fontSize: 12, cursor: 'pointer' }}>+ 문항 추가</button>
                  </div>
                )}
                </div>
              );
            })}

            {isAddingQuestion && (
              <div style={{ background: '#fffbea', borderBottom: '1px solid #f0e0a0', padding: '12px 16px 16px' }}>
                <div className="flex items-center justify-between mb-3">
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#1a3055' }}>새 질의 추가</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={saveNewQuestion}
                      style={{ background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 3, padding: '4px 12px', fontSize: 12, cursor: 'pointer' }}
                    >
                      저장
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingQuestion(false)}
                      style={{ border: '1px solid #ccc', background: '#fff', borderRadius: 3, padding: '4px 12px', fontSize: 12, cursor: 'pointer' }}
                    >
                      취소
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-3 flex-wrap">
                  <span style={{ fontSize: 12, fontWeight: 600, minWidth: 50 }}>질의 유형</span>
                  {['라디오', '체크박스', '텍스트박스', '정량데이터'].map(type => (
                    <label key={type} className="flex items-center gap-1" style={{ fontSize: 12, cursor: 'pointer' }}>
                      <input type="radio" checked={newType === type} onChange={() => setNewType(type)} style={{ accentColor: '#1a6fbf' }} /> {type}
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <span style={{ fontSize: 12, fontWeight: 600, minWidth: 50 }}>첨부파일</span>
                  {['없음', '선택', '필수'].map(attachment => (
                    <label key={attachment} className="flex items-center gap-1" style={{ fontSize: 12, cursor: 'pointer' }}>
                      <input type="radio" checked={newAttachment === attachment} onChange={() => setNewAttachment(attachment)} style={{ accentColor: '#1a6fbf' }} /> {attachment}
                    </label>
                  ))}
                </div>
                <textarea
                  value={newTitle}
                  onChange={event => setNewTitle(event.target.value)}
                  placeholder="질의 제목을 입력해 주세요."
                  autoFocus
                  style={{ width: '100%', border: '1px solid #ccc', borderRadius: 4, padding: '8px 12px', fontSize: 13, minHeight: 80, resize: 'vertical', marginBottom: 10 }}
                />
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>답변 문항</div>
                {newItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <span style={{ fontSize: 12, color: '#888', minWidth: 16 }}>{index + 1}</span>
                    <input
                      value={item}
                      onChange={event => setNewItems(items => items.map((value, itemIndex) => itemIndex === index ? event.target.value : value))}
                      style={{ border: '1px solid #ccc', borderRadius: 4, padding: '5px 10px', fontSize: 12, flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => setNewItems(items => items.filter((_, itemIndex) => itemIndex !== index))}
                      style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: 16 }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setNewItems(items => [...items, ''])}
                  style={{ border: '1px dashed #1a6fbf', background: '#f0f7ff', color: '#1a6fbf', borderRadius: 4, padding: '5px 14px', fontSize: 12, cursor: 'pointer' }}
                >
                  + 문항 추가
                </button>
              </div>
            )}

            {/* 라이브러리 구분선 + 필터 */}
            <div style={{ borderTop: '2px dashed #bbb', margin: '6px 16px', padding: '8px 0 4px' }}>
              <span style={{ fontSize: 12, color: '#888' }}>라이브러리 미반영 질의 — 반영 버튼을 눌러 설문에 추가하세요</span>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span style={{ fontSize: 11, color: '#666' }}>산업</span>
                <select
                  value={filterIndustry}
                  onChange={e => setFilterIndustry(e.target.value)}
                  style={{ border: '1px solid #ccc', borderRadius: 3, padding: '3px 6px', fontSize: 11 }}
                >
                  <option value="전체">전체</option>
                  {['제조', '원자재', '유통', '환경', '전기'].map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                {filterIndustry !== '전체' && (
                  <button
                    onClick={() => setFilterIndustry('전체')}
                    style={{ background: 'none', border: 'none', color: '#e63946', fontSize: 11, cursor: 'pointer' }}
                  >초기화</button>
                )}
              </div>
            </div>

            {/* 미반영 질의 */}
            {libraryGroups.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#888', fontSize: 12, fontStyle: 'italic' }}>
                모든 질의가 반영되었습니다
              </div>
            ) : libraryGroups.flatMap(group => {
              const groupKey = group.parent.no;
              const isExpanded = expandedLibraryParents.has(groupKey);
              const hasConnectedRows = group.pending.length > 1;
              return group.pending.map((question, index) => {
                const isHeader = index === 0;
                const isNested = !isHeader;
                if (!isHeader && !isExpanded) return null;
                const displayNo = group.locked ? question.displayNo ?? question.no : '';
                const libQ = question as unknown as BasicSetQuestion;
                return (
                  <div key={question.no} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 90px 90px 80px 130px', padding: '7px 16px', fontSize: 12, borderBottom: '1px solid #f0f0f0', background: '#fafafa', color: group.locked ? '#8d96a3' : '#666', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, minHeight: 18 }}>
                      {isHeader && hasConnectedRows && (
                        <button onClick={() => toggleLibraryParent(groupKey)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#666', padding: '0 2px', lineHeight: 1 }}>
                          {isExpanded ? '▼' : '▶'}
                        </button>
                      )}
                      {isNested && <span style={{ fontSize: 11, color: '#999', marginRight: 2 }}>ㄴ</span>}
                      <span>{displayNo}</span>
                    </span>
                    <span style={{ paddingLeft: isNested ? 12 : 0, color: group.locked ? '#8d96a3' : '#555' }}>{question.title}</span>
                    <span style={{ textAlign: 'center' }}>
                      {libQ.campaigns > 0 ? (
                        <button
                          type="button"
                          onClick={() => setCampaignModal(libQ)}
                          style={{ background: 'none', border: 'none', color: '#1a6fbf', cursor: 'pointer', fontWeight: 700, fontSize: 12 }}
                        >
                          {libQ.campaigns}
                        </button>
                      ) : (
                        <span style={{ color: '#999' }}>0</span>
                      )}
                    </span>
                    <span style={{ textAlign: 'center' }}>{normalizeQuestionType(question.type)}</span>
                    <span style={{ textAlign: 'center' }}>{question.attachment}</span>
                    <div className="flex justify-center">
                      <button
                        onClick={() => adoptLibraryQuestion(question)}
                        disabled={group.locked}
                        title={group.locked ? '연결된 질의가 이미 반영되어 있어 직접 반영할 수 없습니다.' : undefined}
                        style={{
                          background: group.locked ? '#c5c9ce' : '#2e7d32',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 3,
                          padding: '4px 12px',
                          fontSize: 12,
                          cursor: group.locked ? 'not-allowed' : 'pointer',
                        }}
                      >
                        반영
                      </button>
                    </div>
                  </div>
                );
              });
            })}
          </div>
        </div>
      </div>

      {/* 반영 캠페인 상세 모달 */}
      {campaignModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                {(campaignModal.campaignList ?? []).map((campaign, index) => (
                  <tr key={`${campaign.name}-${index}`} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '8px 12px' }}>{campaign.name}</td>
                    <td style={{ padding: '8px 12px' }}>{campaign.client}</td>
                    <td style={{ padding: '8px 12px' }}>{campaign.period}</td>
                    <td style={{ padding: '8px 12px', color: campaign.status === '진행중' ? '#2e7d32' : '#555' }}>{campaign.status}</td>
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

      {/* 기본 SET 불러오기 모달 */}
      {modalState === 'basic-set' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 6, width: 980, maxWidth: '96vw', maxHeight: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <div className="flex items-center justify-between" style={{ padding: '18px 24px', borderBottom: '1px solid #e8e8e8' }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>기본 SET 불러오기</span>
              <div className="flex items-center gap-3">
                <button onClick={selectEntireBasicSet} className="rounded px-3 py-2 text-xs font-semibold text-white" style={{ background: '#1a3055' }}>기본 SET 전체 선택</button>
                <button onClick={() => setModalState('none')} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>×</button>
              </div>
            </div>
            <div className="flex flex-1 overflow-hidden">
              <div style={{ width: 220, flexShrink: 0, borderRight: '1px solid #e8e8e8', overflowY: 'auto', padding: '10px 0' }}>
                <div style={{ padding: '4px 12px', fontSize: 12, fontWeight: 700, color: '#1a3055', marginBottom: 4 }}>기본 SET</div>
                {FOLDER_TREE.map(node => (
                  <div key={node.id}>
                    <div className="flex items-center hover:bg-gray-50">
                      <button onClick={() => toggleBasicFolder(node.id)} className="flex-1 text-left" style={{ padding: '5px 6px 5px 12px', fontSize: 12, fontWeight: 600, color: '#333' }}>
                        {basicOpenFolders.has(node.id) ? '▼' : '▶'} {node.label.replace(/^[▼▶]\s*/, '')}
                      </button>
                      <input
                        type="checkbox"
                        aria-label={`${node.label} 전체 선택`}
                        checked={(node.children ?? []).length > 0 && (node.children ?? []).every(child => (QUESTIONS_BY_FOLDER[child.id]?.length ?? 0) > 0 && (checkedBasicByFolder[child.id]?.length ?? 0) === (QUESTIONS_BY_FOLDER[child.id]?.length ?? 0))}
                        onChange={() => toggleBasicTopFolder(node)}
                        className="mr-3"
                        style={{ accentColor: '#1a6fbf' }}
                      />
                    </div>
                    {basicOpenFolders.has(node.id) && node.children?.map(child => {
                      const checkedCount = checkedBasicByFolder[child.id]?.length ?? 0;
                      const questionCount = QUESTIONS_BY_FOLDER[child.id]?.length ?? 0;
                      const disabled = isBasicFolderUsed(child.id);
                      return (
                        <button
                          key={child.id}
                          onClick={() => !disabled && setBasicSelectedFolder(child.id)}
                          disabled={disabled}
                          title={disabled ? '현재 설문에서 이미 사용 중인 폴더입니다.' : undefined}
                          className={disabled ? 'w-full flex items-center justify-between text-left' : 'w-full flex items-center justify-between text-left hover:bg-blue-50'}
                          style={{
                            padding: '4px 12px 4px 24px',
                            fontSize: 11,
                            color: disabled ? '#aaa' : basicSelectedFolder === child.id ? '#1a6fbf' : '#555',
                            background: disabled ? '#f6f6f6' : basicSelectedFolder === child.id ? '#eff6ff' : undefined,
                            borderLeft: !disabled && basicSelectedFolder === child.id ? '3px solid #1a6fbf' : '3px solid transparent',
                            cursor: disabled ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <span>{child.label}</span>
                          <span style={{ background: disabled ? '#e5e5e5' : checkedCount ? '#1a6fbf' : '#e0e0e0', color: disabled ? '#aaa' : checkedCount ? '#fff' : '#555', borderRadius: 10, padding: '1px 6px', fontSize: 10 }}>
                            {checkedCount ? `${checkedCount}/${questionCount}` : questionCount}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {(() => {
                  const questions = (QUESTIONS_BY_FOLDER[basicSelectedFolder] ?? []).filter(q => (q.industryCode ?? 0) === 0 && !(q.industries?.length ?? q.form?.industries?.length ?? 0));
                  const checked = checkedBasicByFolder[basicSelectedFolder] ?? [];
                  const allChecked = questions.length > 0 && checked.length === questions.length;
                  return (
                    <>
                      <div style={{ padding: '10px 16px', borderBottom: '1px solid #e8e8e8', background: '#f7f8fa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12, color: '#555', fontWeight: 700 }}>
                          {FOLDER_TREE.flatMap(node => node.children ?? []).find(child => child.id === basicSelectedFolder)?.label}
                        </span>
                        <div className="flex gap-2">
                          <button onClick={() => setCheckedBasicByFolder(prev => ({ ...prev, [basicSelectedFolder]: questions.map(question => question.no) }))} style={{ background: 'none', border: 'none', color: '#1a6fbf', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>전체 선택</button>
                          <button onClick={() => setCheckedBasicByFolder(prev => ({ ...prev, [basicSelectedFolder]: [] }))} style={{ background: 'none', border: 'none', color: '#888', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>전체 해제</button>
                        </div>
                      </div>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead>
                          <tr style={{ background: '#f7f8fa', borderBottom: '1px solid #e8e8e8' }}>
                            <th style={{ padding: '8px 10px', width: 40 }}>
                              <input type="checkbox" checked={allChecked} onChange={() => setCheckedBasicByFolder(prev => ({ ...prev, [basicSelectedFolder]: allChecked ? [] : questions.map(question => question.no) }))} style={{ accentColor: '#1a6fbf' }} />
                            </th>
                            <th style={{ padding: '8px 10px', width: 70, textAlign: 'center' }}>NO</th>
                            <th style={{ padding: '8px 10px', textAlign: 'left' }}>질의 제목</th>
                            <th style={{ padding: '8px 10px', width: 80, textAlign: 'center' }}>질의 유형</th>
                            <th style={{ padding: '8px 10px', width: 65, textAlign: 'center' }}>첨부파일</th>
                          </tr>
                        </thead>
                        <tbody>
                          {questions.map(question => (
                            <tr key={question.no} style={{ borderBottom: '1px solid #f0f0f0', background: checked.includes(question.no) ? '#eff6ff' : question.parentNo ? '#fafafa' : '#fff' }}>
                              <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                                <input type="checkbox" checked={checked.includes(question.no)} onChange={() => toggleBasicQuestion(basicSelectedFolder, question.no)} style={{ accentColor: '#1a6fbf' }} />
                              </td>
                              <td style={{ padding: '8px 10px', textAlign: 'center', color: '#666' }}>{question.parentNo ? `ㄴ ${question.no}` : question.no}</td>
                              <td style={{ padding: '8px 10px', paddingLeft: question.parentNo ? 24 : 10, color: '#1a6fbf' }}>{question.title}</td>
                              <td style={{ padding: '8px 10px', textAlign: 'center', color: '#666' }}>{normalizeQuestionType(question.type)}</td>
                              <td style={{ padding: '8px 10px', textAlign: 'center', color: '#666' }}>{question.attachment}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  );
                })()}
              </div>
            </div>
            <div className="flex items-center justify-between" style={{ padding: '12px 24px', borderTop: '1px solid #e8e8e8', background: '#f7f8fa' }}>
              <span style={{ fontSize: 12, color: '#555' }}>선택한 질의는 각 폴더의 반영 질의로 바로 추가됩니다.</span>
              <button
                onClick={handleBasicSetImport}
                disabled={totalBasicChecked === 0}
                style={{ background: totalBasicChecked === 0 ? '#bbb' : '#1a6fbf', color: '#fff', border: 'none', borderRadius: 4, padding: '7px 18px', fontSize: 13, cursor: totalBasicChecked === 0 ? 'not-allowed' : 'pointer' }}
              >
                가져오기 ({totalBasicChecked})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 캠페인 목록 모달 */}
      {modalState === 'import-list' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 6, padding: '28px 32px', width: 700, maxWidth: '95vw', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <div className="flex items-center justify-between mb-5">
              <span style={{ fontWeight: 700, fontSize: 17 }}>캠페인 목록</span>
              <button onClick={() => setModalState('none')} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>×</button>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span style={{ fontSize: 12 }}>활성여부</span>
              <select value={importActiveFilter} onChange={e => setImportActiveFilter(e.target.value)} style={{ border: '1px solid #ccc', borderRadius: 4, padding: '4px 8px', fontSize: 12 }}>
                <option>전체</option><option value="Y">Y</option><option value="N">N</option>
              </select>
              <span style={{ fontSize: 12 }}>상태</span>
              <select value={importStatusFilter} onChange={e => setImportStatusFilter(e.target.value)} style={{ border: '1px solid #ccc', borderRadius: 4, padding: '4px 8px', fontSize: 12 }}>
                <option>전체</option><option>진행중</option><option>종료</option>
              </select>
              <input value={importFilter} onChange={e => setImportFilter(e.target.value)} placeholder="캠페인명 검색" style={{ flex: 1, border: '1px solid #ccc', borderRadius: 4, padding: '4px 10px', fontSize: 12 }} />
              <button style={{ background: '#1a6fbf', color: '#fff', border: 'none', borderRadius: 4, padding: '5px 12px', fontSize: 12, cursor: 'pointer' }}>🔍</button>
            </div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>목록 <strong>{filteredImportCampaigns.length}</strong>건</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f7f8fa', borderBottom: '1px solid #e0e0e0' }}>
                  {['번호', '제공자', '캠페인명', '시작일', '종료일', '상태', '활성여부'].map(h => (
                    <th key={h} style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#555', fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredImportCampaigns.map(c => (
                  <tr key={c.no} onClick={() => { setSelectedImportCampaign(c); setImportSelectedFolder('L-고용'); setCheckedByFolder({}); setModalState('import-questions'); }} style={{ borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }} className="hover:bg-blue-50">
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>{c.no}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>{c.provider}</td>
                    <td style={{ padding: '8px 10px', color: '#1a6fbf', textDecoration: 'underline' }}>{c.name}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>{c.startDate}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>{c.endDate}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', color: c.status === '진행중' ? '#2e7d32' : '#555' }}>{c.status}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>{c.active}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <button onClick={() => setModalState('none')} style={{ border: '1px solid #ccc', background: '#fff', borderRadius: 4, padding: '7px 24px', fontSize: 13, cursor: 'pointer' }}>닫기</button>
            </div>
          </div>
        </div>
      )}

      {/* 질의 선택 모달 */}
      {modalState === 'import-questions' && selectedImportCampaign && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 6, width: 860, maxWidth: '96vw', maxHeight: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <div className="flex items-center justify-between" style={{ padding: '18px 24px', borderBottom: '1px solid #e8e8e8' }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>캠페인 불러오기 — {selectedImportCampaign.name}</span>
              <button onClick={() => setModalState('none')} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>×</button>
            </div>
            <div className="flex flex-1 overflow-hidden">
              {/* 좌: 폴더 트리 (폴더 체크박스 포함) */}
              <div style={{ width: 220, flexShrink: 0, borderRight: '1px solid #e8e8e8', overflowY: 'auto', padding: '10px 0' }}>
                <div style={{ padding: '4px 12px', fontSize: 12, fontWeight: 700, color: '#333', marginBottom: 4 }}>설문 폴더</div>
                {IMPORT_FOLDERS.map(node => (
                  <div key={node.id}>
                    <button onClick={() => toggleImportFolder(node.id)} className="w-full text-left hover:bg-gray-50 flex items-center gap-1" style={{ padding: '5px 12px', fontSize: 12, fontWeight: 600, color: '#333' }}>
                      {importOpenFolders.has(node.id) ? '▼' : '▶'} {node.label}
                    </button>
                    {importOpenFolders.has(node.id) && node.children?.map(child => {
                      const childQs = IMPORT_QUESTIONS_BY_FOLDER[child.id] ?? [];
                      const childChecked = checkedByFolder[child.id] ?? [];
                      const allChecked = childQs.length > 0 && childChecked.length === childQs.length;
                      const partial = childChecked.length > 0 && childChecked.length < childQs.length;
                      return (
                        <div
                          key={child.id}
                          className="hover:bg-blue-50 flex items-center"
                          style={{
                            padding: '4px 8px 4px 16px', fontSize: 11,
                            background: importSelectedFolder === child.id ? '#eff6ff' : undefined,
                            borderLeft: importSelectedFolder === child.id ? '3px solid #1a6fbf' : '3px solid transparent',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={allChecked}
                            ref={el => { if (el) el.indeterminate = partial; }}
                            onChange={() => toggleFolderAllCheck(child.id)}
                            style={{ accentColor: '#1a6fbf', marginRight: 6, cursor: 'pointer', flexShrink: 0 }}
                          />
                          <button
                            onClick={() => setImportSelectedFolder(child.id)}
                            className="flex-1 text-left flex items-center justify-between"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: importSelectedFolder === child.id ? '#1a6fbf' : '#555', padding: 0 }}
                          >
                            <span>{child.label}</span>
                            <span style={{ background: childChecked.length > 0 ? '#1a6fbf' : '#e0e0e0', color: childChecked.length > 0 ? '#fff' : '#555', borderRadius: 10, padding: '1px 6px', fontSize: 10, marginLeft: 4, flexShrink: 0 }}>
                              {childChecked.length > 0 ? `${childChecked.length}/${childQs.length}` : childQs.length}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* 우: 질의 목록 */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {(() => {
                  const curChecked = checkedByFolder[importSelectedFolder] ?? [];
                  const allSel = importFolderQuestions.length > 0 && curChecked.length === importFolderQuestions.length;
                  return (
                    <>
                      <div style={{ padding: '10px 16px', borderBottom: '1px solid #e8e8e8', background: '#f7f8fa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>{IMPORT_FOLDER_LABELS[importSelectedFolder] ?? importSelectedFolder}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setCheckedByFolder(prev => ({ ...prev, [importSelectedFolder]: importFolderQuestions.map((_, i) => i) }))}
                            style={{ background: 'none', border: 'none', color: '#1a6fbf', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
                          >전체 선택</button>
                          <button
                            onClick={() => setCheckedByFolder(prev => ({ ...prev, [importSelectedFolder]: [] }))}
                            style={{ background: 'none', border: 'none', color: '#888', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
                          >전체 해제</button>
                        </div>
                      </div>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead>
                          <tr style={{ background: '#f7f8fa', borderBottom: '1px solid #e8e8e8' }}>
                            <th style={{ padding: '8px 10px', width: 36 }}>
                              <input
                                type="checkbox"
                                checked={allSel}
                                onChange={() => setCheckedByFolder(prev => ({ ...prev, [importSelectedFolder]: allSel ? [] : importFolderQuestions.map((_, i) => i) }))}
                                style={{ accentColor: '#1a6fbf' }}
                              />
                            </th>
                            <th style={{ padding: '8px 10px', width: 40, textAlign: 'center' }}>NO</th>
                            <th style={{ padding: '8px 10px', textAlign: 'left' }}>질의 제목</th>
                            <th style={{ padding: '8px 10px', width: 70, textAlign: 'center' }}>유형</th>
                            <th style={{ padding: '8px 10px', width: 50, textAlign: 'center' }}>첨부</th>
                          </tr>
                        </thead>
                        <tbody>
                          {importFolderQuestions.map((q, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #f0f0f0', background: curChecked.includes(i) ? '#eff6ff' : '#fff' }}>
                              <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                                <input
                                  type="checkbox"
                                  checked={curChecked.includes(i)}
                                  onChange={() => setCheckedByFolder(prev => {
                                    const cur = prev[importSelectedFolder] ?? [];
                                    return { ...prev, [importSelectedFolder]: cur.includes(i) ? cur.filter(x => x !== i) : [...cur, i] };
                                  })}
                                  style={{ accentColor: '#1a6fbf' }}
                                />
                              </td>
                              <td style={{ padding: '8px 10px', textAlign: 'center', color: '#666' }}>{q.no}</td>
                              <td style={{ padding: '8px 10px' }}>{q.title}</td>
                              <td style={{ padding: '8px 10px', textAlign: 'center', color: '#666' }}>{normalizeQuestionType(q.type)}</td>
                              <td style={{ padding: '8px 10px', textAlign: 'center', color: '#666' }}>{q.attachment}</td>
                            </tr>
                          ))}
                          {importFolderQuestions.length === 0 && (
                            <tr><td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#aaa', fontSize: 12 }}>해당 폴더에 질의가 없습니다.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="flex items-center justify-between" style={{ padding: '12px 24px', borderTop: '1px solid #e8e8e8', background: '#f7f8fa' }}>
              <span style={{ fontSize: 12, color: '#555' }}>
                선택한 질의는 각 폴더에 <strong>반영 질의</strong>로 바로 추가됩니다.
                {Object.keys(checkedByFolder).filter(k => (checkedByFolder[k]?.length ?? 0) > 0).map(fid => (
                  <span key={fid} style={{ marginLeft: 6, background: '#eef3fb', borderRadius: 4, padding: '1px 7px', fontSize: 11, color: '#1a6fbf' }}>
                    {IMPORT_FOLDER_LABELS[fid] ?? fid} {checkedByFolder[fid].length}건
                    {!collectAllIds(surveyFolders).includes(fid) && <span style={{ color: '#e63946' }}> *신규</span>}
                  </span>
                ))}
              </span>
              <div className="flex gap-2">
                <button onClick={() => setModalState('import-list')} style={{ border: '1px solid #ccc', background: '#fff', borderRadius: 4, padding: '7px 18px', fontSize: 13, cursor: 'pointer' }}>← 목록</button>
                <button
                  onClick={handleImport}
                  disabled={totalChecked === 0}
                  style={{ background: totalChecked === 0 ? '#bbb' : '#1a6fbf', color: '#fff', border: 'none', borderRadius: 4, padding: '7px 18px', fontSize: 13, cursor: totalChecked === 0 ? 'not-allowed' : 'pointer' }}
                >
                  가져오기 ({totalChecked})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalState === 'custom-bank' && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="flex max-h-[90vh] w-[1050px] max-w-[96vw] flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <div className="text-lg font-bold" style={{ color: '#1a3055' }}>{customDetail ? '기타 지표 상세' : '기타 지표 선택'}</div>
                <div className="mt-1 text-xs" style={{ color: '#777' }}>추가 위치: {folderLabel(selectedFolder)}</div>
              </div>
              <button onClick={() => setModalState('none')} className="text-xl" style={{ color: '#777' }}>×</button>
            </div>
            {customDetail ? (
              <div className="overflow-y-auto p-6">
                <div className="mb-5 rounded border bg-gray-50 p-4" style={{ borderColor: '#e0e0e0' }}>
                  <div className="mb-2 text-xs font-semibold" style={{ color: '#777' }}>질의 ID</div>
                  <div className="font-semibold"><span className="mr-2 rounded px-2 py-1 text-xs" style={{ background: '#fff0f1', color: '#d92f3c' }}>[C]</span>{customDetail.questionId}</div>
                </div>
                <div className="grid grid-cols-[150px_1fr] overflow-hidden rounded border text-sm" style={{ borderColor: '#e0e0e0' }}>
                  <div className="border-b border-r bg-gray-50 p-4 font-semibold">질의 제목</div><div className="border-b p-4">{customDetail.title}</div>
                  <div className="border-b border-r bg-gray-50 p-4 font-semibold">질의 유형</div><div className="border-b p-4">{normalizeQuestionType(customDetail.type)}</div>
                  <div className="border-r bg-gray-50 p-4 font-semibold">첨부파일</div><div className="p-4">{customDetail.attachment}</div>
                </div>
                <div className="mt-4 rounded px-4 py-3 text-sm" style={{ background: '#f0f5ff', color: '#315d9b' }}>이 화면에서는 질의 내용을 조회만 할 수 있습니다.</div>
                <div className="mt-6 flex justify-between">
                  <button onClick={() => setCustomDetail(null)} className="rounded border px-5 py-2 text-sm font-semibold">← 목록으로</button>
                  <button onClick={() => adoptCustomQuestion(customDetail)} className="rounded px-5 py-2 text-sm font-semibold text-white" style={{ background: '#1a6fbf' }}>이 질의 선택</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 border-b bg-gray-50 px-6 py-3">
                  <select value={customBankType} onChange={event => setCustomBankType(event.target.value)} className="rounded border px-3 text-sm" style={{ height: 36 }}><option value="">질의유형 전체</option><option>라디오</option><option>체크박스</option><option>텍스트박스</option><option>정량데이터</option></select>
                  <input value={customBankSearch} onChange={event => setCustomBankSearch(event.target.value)} placeholder="검색어를 입력하세요" className="min-w-0 flex-1 rounded border px-3 text-sm" style={{ height: 36 }} />
                  <button className="rounded px-4 text-sm font-semibold text-white" style={{ background: '#1a3055', height: 36 }}>검색</button>
                  {onNavigateAdd && <button onClick={() => onNavigateAdd(selectedFolder)} className="rounded px-4 text-sm font-semibold text-white" style={{ background: '#e63946', height: 36 }}>+ 질의 추가</button>}
                </div>
                <div className="overflow-y-auto p-5">
                  <table className="w-full border-collapse text-sm">
                    <thead><tr style={{ borderTop: '1px solid #d6dae0', borderBottom: '1px solid #d6dae0', background: '#f8f9fb' }}>
                      {['NO', '선택', '질의 ID', '질의 제목', '질의 유형', '첨부'].map(header => <th key={header} className="px-3 py-3 text-center text-xs font-semibold">{header}</th>)}
                    </tr></thead>
                    <tbody>
                      {[...customQuestions, ...CUSTOM_QUESTION_SEED]
                        .filter(question => !customBankType || normalizeQuestionType(question.type) === customBankType)
                        .filter(question => !customBankSearch.trim() || `${question.title} ${question.questionId ?? ''}`.toLowerCase().includes(customBankSearch.toLowerCase()))
                        .map((question, index) => (
                          <tr key={`${question.no}-${index}`} className="hover:bg-blue-50" style={{ borderBottom: '1px solid #edf0f3' }}>
                            <td className="px-3 py-3 text-center text-xs">{question.no}</td>
                            <td className="px-3 py-3 text-center"><button onClick={() => adoptCustomQuestion(question)} className="rounded px-3 py-1.5 text-xs font-semibold text-white" style={{ background: '#1a6fbf' }}>선택</button></td>
                            <td className="px-3 py-3 text-center text-xs"><span className="mr-1 rounded px-1 py-0.5 text-[10px]" style={{ background: '#fff0f1', color: '#d92f3c' }}>[C]</span>{question.questionId}</td>
                            <td className="px-3 py-3 text-xs text-blue-600"><button onClick={() => setCustomDetail(question)} title={question.title} className="max-w-[470px] truncate text-left hover:underline">{question.title}</button></td>
                            <td className="px-3 py-3 text-center text-xs">{normalizeQuestionType(question.type)}</td>
                            <td className="px-3 py-3 text-center text-xs">{question.attachment}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
