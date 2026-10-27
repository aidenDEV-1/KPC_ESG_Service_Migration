import { useState } from 'react';

// Login screens
import AdminLogin from './components/auth/AdminLogin';
import FrontLogin from './components/auth/FrontLogin';

import CustomerShell from './components/customer/CustomerShell';

// ADM
import AdminShell from './components/admin/AdminShell';
import AccessStats from './components/admin/AccessStats';
import UserManagement from './components/admin/UserManagement';
import ClientCompany from './components/admin/ClientCompany';
import QuestionManagement from './components/admin/QuestionManagement';
import QuestionLibraryBasicSet, {
  createQuestionFormDefaults,
  generateQuestionId,
  getBaseChildCount,
  getFolderIdForForm,
  FOLDER_TREE,
  QUESTIONS_BY_FOLDER,
  type Question,
  type QuestionFormValues,
} from './components/admin/QuestionLibraryBasicSet';
import CampaignEditDetail from './components/admin/CampaignEditDetail';
import CampaignSurveyInfo, { CAMPAIGN_SURVEY_STATE } from './components/admin/CampaignSurveyInfo';
import QuestionLibraryMgmt, { CUSTOM_QUESTION_SEED, type QuestionManagementCategory } from './components/admin/QuestionLibraryMgmt';
import QuestionAddPage from './components/admin/QuestionAddPage';
import CampaignManagement, { type CampaignRecord } from './components/admin/CampaignManagement';
import AlertManagement from './components/admin/AlertManagement';
import PopupManagement from './components/admin/PopupManagement';
import NoticeManagement from './components/admin/NoticeManagement';
import BoardStatistics from './components/admin/BoardStatistics';
import ContentStatistics from './components/admin/ContentStatistics';
import SystemUserList from './components/admin/SystemUserList';
import AccessLog from './components/admin/AccessLog';
import ActiveSession from './components/admin/ActiveSession';
import SystemResource from './components/admin/SystemResource';
import MemberLoginLog from './components/admin/MemberLoginLog';
import PersonalInfoLog from './components/admin/PersonalInfoLog';
import PersonalAuthLog from './components/admin/PersonalAuthLog';
import CommonCodeMgmt from './components/admin/CommonCodeMgmt';
import UploadFileMgmt from './components/admin/UploadFileMgmt';
import MenuManagement from './components/admin/MenuManagement';
import PermissionManagement from './components/admin/PermissionManagement';
import BoardCodeMgmt from './components/admin/BoardCodeMgmt';
import ResultReportManagement from './components/admin/ResultReportManagement';
import ConsultantAssignmentManagement from './components/admin/ConsultantAssignmentManagement';

// ADM child screens
import UserRegistrationForm from './components/admin/UserRegistrationForm';
import ClientCompanyForm from './components/admin/ClientCompanyForm';
import SysUserRegistrationForm from './components/admin/SysUserRegistrationForm';
import AlertRegistrationForm from './components/admin/AlertRegistrationForm';
import PopupForm from './components/admin/PopupForm';
import NoticeRegistrationForm from './components/admin/NoticeRegistrationForm';
import QuestionRegistrationForm from './components/admin/QuestionRegistrationForm';
import CampaignRegistrationForm, { type NewCampaign } from './components/admin/CampaignRegistrationForm';
import CampaignDetailManagement from './components/admin/CampaignDetailManagement';
import BasicInfoCategoryMgmt from './components/admin/BasicInfoCategoryMgmt';
import SurveyCategoryMgmt from './components/admin/SurveyCategoryMgmt';
import { admCampaigns } from './data';

// Front header
import FrontHeader from './components/partner/FrontHeader';

// AUD
import AudCampaignList from './components/auditor/AudCampaignList';
import AudFieldAuditForm from './components/auditor/AudFieldAuditForm';
import AudMailManagement from './components/auditor/AudMailManagement';
import { CustomerImprovementDetail } from './components/customer/CustomerImprovement';

// KPC
import KpcCampaignList from './components/kpc/CampaignList';
import EvalResult from './components/kpc/EvalResult';
import ProgressView from './components/kpc/ProgressView';
import KpcShell, { type KpcPage } from './components/kpc/KpcShell';
import ConsultantAuditManagement from './components/kpc/ConsultantAuditManagement';

// PART
import Dashboard from './components/partner/Dashboard';
import AssessmentList from './components/partner/AssessmentList';
import SurveyNav, { type SurveyPage } from './components/partner/SurveyNav';
import SurveyIntro from './components/partner/SurveyIntro';
import BasicInfo from './components/partner/BasicInfo';
import SurveySection from './components/partner/SurveySection';
import DataPage from './components/partner/DataPage';
import PartProfileSetup from './components/partner/PartProfileSetup';

type AdminPage =
  | 'access-stats' | 'user-mgmt' | 'client-mgmt' | 'question-mgmt' | 'campaign-mgmt'
  | 'alert-mgmt' | 'popup-mgmt' | 'notice-mgmt'
  | 'board-stats' | 'content-stats'
  | 'sys-user-mgmt' | 'access-log' | 'active-session' | 'sys-resource'
  | 'member-login-log' | 'personal-info-log'
  | 'personal-auth-log'
  | 'common-code-mgmt' | 'upload-file-mgmt'
  | 'menu-mgmt' | 'permission-mgmt' | 'board-code-mgmt'
  | 'result-report-mgmt' | 'consultant-assignment-mgmt'
  | 'audit-mgmt'
  | 'survey-mgmt'
  | 'question-library-basic-set' | 'question-library-mgmt' | 'question-add'
  // Child screens
  | 'user-registration'
  | 'client-company-registration' | 'client-company-edit'
  | 'question-registration'
  | 'alert-registration'
  | 'popup-registration' | 'popup-edit'
  | 'notice-registration'
  | 'campaign-registration' | 'campaign-detail'
  | 'basic-info-category' | 'survey-category'
  | 'sys-user-registration'
  | 'question-library-basic-set' | 'question-library-mgmt' | 'question-add'
  | 'campaign-edit-detail' | 'campaign-survey-info';

type PartnerTab = '현황' | '진단' | '데이터' | '알림관리';
type KpcView = KpcPage | 'eval-result' | 'progress';

type AuditorView = 'campaign-list' | 'mail-management' | 'field-audit-form' | 'improvement-view' | 'notification-management';

type AppScreen =
  | { type: 'login-admin' }
  | { type: 'login-front' }
  | { type: 'partner-profile-setup' }
  | { type: 'admin'; page: AdminPage }
  | { type: 'kpc'; view: KpcView; accountType?: 'ADMIN' | 'KPC'; selectedCampaign?: string; selectedCampaignName?: string; selectedCampaignPeriod?: string; selectedPartner?: string }
  | { type: 'partner'; tab: PartnerTab; surveyPage?: SurveyPage }
  | { type: 'auditor'; view: AuditorView; selectedCompany?: string; selectedMailId?: string }
  | { type: 'customer' };

const surveyOrder: SurveyPage[] = [
  'intro', 'basic-info',
  'L01', 'L02', 'L03', 'L04', 'L05', 'L06', 'L07', 'L08',
  'S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08',
  'E01', 'E02', 'E03', 'E04', 'E05', 'E06', 'E07', 'E08', 'E09',
  'C01', 'C02', 'C03', 'C04', 'C05', 'C06', 'C07',
  'M01', 'M02', 'M03', 'M04',
];

import dexLogo from './imports/DEX._White__1_.png';

const DexLogoOverlay = () => (
  <div style={{ position: 'fixed', bottom: 16, right: 20, zIndex: 9999, pointerEvents: 'none' }}>
    <img src={dexLogo} alt="DEX" style={{ height: 28, opacity: 0.85 }} />
  </div>
);

export default function App() {
  const [screen, setScreen] = useState<AppScreen>({ type: 'login-front' });
  const [addedQuestions, setAddedQuestions] = useState<Question[]>([]);
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const [revisionQuestions, setRevisionQuestions] = useState<Question[]>([]);
  const [questionAddDestination, setQuestionAddDestination] = useState<'basic' | 'custom' | 'campaign-custom'>('basic');
  const [campaignCustomTarget, setCampaignCustomTarget] = useState<{ campaignName: string; folderId: string } | null>(null);
  const [campaignSurveyReturnModal, setCampaignSurveyReturnModal] = useState(false);
  const [questionReadOnly, setQuestionReadOnly] = useState(false);
  const [questionDisplayId, setQuestionDisplayId] = useState<string | undefined>();
  const [editedQuestions, setEditedQuestions] = useState<Question[]>([]);
  const [deletedQuestionKeys, setDeletedQuestionKeys] = useState<Set<string>>(new Set());
  const [adminCampaigns, setAdminCampaigns] = useState<CampaignRecord[]>(admCampaigns);
  const [selectedAdminCampaignNo, setSelectedAdminCampaignNo] = useState(admCampaigns[0].no);
  const [questionContext, setQuestionContext] = useState<{
    question: Question;
    folderId: string;
    mode: 'edit' | 'child';
  } | null>(null);

  let content: React.ReactNode = null;

  if (screen.type === 'customer') {
    content = <CustomerShell onLogout={() => setScreen({ type: 'login-front' })} />;
  } else if (screen.type === 'login-admin') {
    content = <AdminLogin onLogin={() => setScreen({ type: 'admin', page: 'access-stats' })} />;
  } else if (screen.type === 'login-front') {
    content = (
      <FrontLogin
        onLoginADMIN={() => setScreen({ type: 'login-admin' })}
        onLoginKPC={() => setScreen({ type: 'kpc', view: 'home', accountType: 'KPC' })}
        onLoginPART={() => setScreen(localStorage.getItem('part-profile-complete') ? { type: 'partner', tab: '현황' } : { type: 'partner-profile-setup' })}
        onLoginAUD={() => setScreen({ type: 'auditor', view: 'campaign-list' })}
        onLoginCustomer={() => setScreen({ type: 'customer' })}
      />
    );
  } else if (screen.type === 'partner-profile-setup') {
    content = <PartProfileSetup onComplete={() => setScreen({ type: 'partner', tab: '현황' })} onLogout={() => setScreen({ type: 'login-front' })} />;
  } else if (screen.type === 'admin') {
    const p = screen.page;
    const nav = (page: string) => setScreen({ type: 'admin', page: page as AdminPage });
    content = (
      <AdminShell currentPage={p} onNavigate={nav} onLogout={() => setScreen({ type: 'login-front' })}>
        {p === 'access-stats' && <AccessStats onOpenProgress={(id, name, dateRange) => setScreen({ type: 'kpc', view: 'progress', accountType: 'ADMIN', selectedCampaign: id, selectedCampaignName: name, selectedCampaignPeriod: dateRange })} onOpenEvaluation={(id, name, dateRange) => setScreen({ type: 'kpc', view: 'eval-result', accountType: 'ADMIN', selectedCampaign: id, selectedCampaignName: name, selectedCampaignPeriod: dateRange })} onOpenAudit={() => setScreen({ type: 'kpc', view: 'audit-mgmt', accountType: 'ADMIN' })} />}
        {p === 'user-mgmt' && <UserManagement onNavigate={nav} />}
        {p === 'client-mgmt' && <ClientCompany onNavigate={nav} />}
        {p === 'question-mgmt' && <QuestionManagement onNavigate={nav} />}
        {p === 'campaign-mgmt' && (
          <CampaignManagement
            onNavigate={nav}
            campaigns={adminCampaigns}
            onSelectCampaign={campaign => setSelectedAdminCampaignNo(campaign.no)}
          />
        )}
        {p === 'survey-mgmt' && <KpcCampaignList onOpenProgress={(id, name, dateRange) => setScreen({ type: 'kpc', view: 'progress', accountType: 'ADMIN', selectedCampaign: id, selectedCampaignName: name, selectedCampaignPeriod: dateRange })} onOpenEvaluation={(id, name, dateRange) => setScreen({ type: 'kpc', view: 'eval-result', accountType: 'ADMIN', selectedCampaign: id, selectedCampaignName: name, selectedCampaignPeriod: dateRange })} />}
        {p === 'alert-mgmt' && <AlertManagement onNavigate={nav} />}
        {p === 'popup-mgmt' && <PopupManagement onNavigate={nav} />}
        {p === 'notice-mgmt' && <NoticeManagement onNavigate={nav} />}
        {p === 'board-stats' && <BoardStatistics />}
        {p === 'content-stats' && <ContentStatistics />}
        {p === 'sys-user-mgmt' && <SystemUserList onNavigate={nav} />}
        {p === 'access-log' && <AccessLog />}
        {p === 'active-session' && <ActiveSession />}
        {p === 'sys-resource' && <SystemResource />}
        {p === 'member-login-log' && <MemberLoginLog />}
        {p === 'personal-info-log' && <PersonalInfoLog />}
        {p === 'personal-auth-log' && <PersonalAuthLog />}
        {p === 'common-code-mgmt' && <CommonCodeMgmt />}
        {p === 'upload-file-mgmt' && <UploadFileMgmt />}
        {p === 'menu-mgmt' && <MenuManagement />}
        {p === 'permission-mgmt' && <PermissionManagement />}
        {p === 'board-code-mgmt' && <BoardCodeMgmt />}
        {p === 'result-report-mgmt' && <ResultReportManagement />}
        {p === 'consultant-assignment-mgmt' && <ConsultantAssignmentManagement />}
        {p === 'audit-mgmt' && <ConsultantAuditManagement />}
        {/* Child screens */}
        {p === 'user-registration' && <UserRegistrationForm onBack={() => nav('user-mgmt')} />}
        {p === 'client-company-registration' && <ClientCompanyForm mode="registration" onBack={() => nav('client-mgmt')} />}
        {p === 'client-company-edit' && <ClientCompanyForm mode="edit" onBack={() => nav('client-mgmt')} />}
        {p === 'question-registration' && <QuestionRegistrationForm onBack={() => nav('question-mgmt')} />}
        {p === 'alert-registration' && <AlertRegistrationForm onBack={() => nav('alert-mgmt')} />}
        {p === 'popup-registration' && <PopupForm mode="registration" onBack={() => nav('popup-mgmt')} />}
        {p === 'popup-edit' && <PopupForm mode="edit" onBack={() => nav('popup-mgmt')} />}
        {p === 'notice-registration' && <NoticeRegistrationForm onBack={() => nav('notice-mgmt')} />}
        {p === 'campaign-registration' && (
          <CampaignRegistrationForm
            onBack={() => nav('campaign-mgmt')}
            onSave={(campaign: NewCampaign) => {
              const now = new Date();
              const regDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00.0`;
              const nextNo = Math.max(...adminCampaigns.map(item => item.no), 0) + 1;
              setAdminCampaigns(current => [{
                no: nextNo,
                provider: campaign.provider,
                name: campaign.name,
                startDate: campaign.startDate,
                endDate: campaign.endDate,
                taskStart: campaign.taskStart,
                taskEnd: campaign.taskEnd,
                status: campaign.status,
                regDate,
                active: campaign.active,
                contact: campaign.contact,
                partners: campaign.partners,
                auditors: campaign.auditors,
                industryCode: campaign.industryCode,
                consistencyReviewVisible: campaign.consistencyReviewVisible,
              }, ...current]);
              setSelectedAdminCampaignNo(nextNo);
              nav('campaign-mgmt');
            }}
          />
        )}
        {p === 'campaign-detail' && (
          <CampaignDetailManagement
            campaignName={adminCampaigns.find(campaign => campaign.no === selectedAdminCampaignNo)?.name}
            onBack={() => nav('campaign-edit-detail')}
          />
        )}
        {p === 'basic-info-category' && <BasicInfoCategoryMgmt onBack={() => nav('campaign-mgmt')} />}
        {p === 'survey-category' && <SurveyCategoryMgmt onBack={() => nav('campaign-mgmt')} />}
        {p === 'sys-user-registration' && <SysUserRegistrationForm onBack={() => nav('sys-user-mgmt')} />}
        {p === 'campaign-edit-detail' && (
          <CampaignEditDetail
            campaign={adminCampaigns.find(campaign => campaign.no === selectedAdminCampaignNo) ?? adminCampaigns[0]}
            onBack={() => nav('campaign-mgmt')}
            onSave={updatedCampaign => {
              setAdminCampaigns(current => current.map(campaign =>
                campaign.no === updatedCampaign.no ? updatedCampaign : campaign,
              ));
              nav('campaign-mgmt');
            }}
            onNavigateSurvey={() => { setCampaignSurveyReturnModal(false); nav('campaign-survey-info'); }}
            onNavigateDetail={() => nav('campaign-detail')}
          />
        )}
        {p === 'campaign-survey-info' && (
          <CampaignSurveyInfo
            campaignName={adminCampaigns.find(campaign => campaign.no === selectedAdminCampaignNo)?.name}
            campaignIndustryCode={adminCampaigns.find(campaign => campaign.no === selectedAdminCampaignNo)?.industryCode ?? 1}
            initialCustomBankOpen={campaignSurveyReturnModal}
            onBack={() => nav('campaign-edit-detail')}
            customQuestions={customQuestions}
            onNavigateAdd={(folderId) => {
              const campaignName = adminCampaigns.find(campaign => campaign.no === selectedAdminCampaignNo)?.name ?? '';
              setCampaignCustomTarget({ campaignName, folderId });
              setCampaignSurveyReturnModal(true);
              setQuestionAddDestination('campaign-custom');
              setQuestionReadOnly(false);
              setQuestionDisplayId(undefined);
              setQuestionContext(null);
              nav('question-add');
            }}
          />
        )}
        {p === 'question-library-basic-set' && (
          <QuestionLibraryBasicSet
            addedQuestions={addedQuestions}
            editedQuestions={editedQuestions}
            deletedQuestionKeys={deletedQuestionKeys}
            onNavigateAdd={(question, folderId, mode) => {
              setQuestionAddDestination('basic');
              setQuestionReadOnly(false);
              setQuestionDisplayId(undefined);
              setQuestionContext(question && folderId && mode ? { question, folderId, mode } : null);
              nav('question-add');
            }}
          />
        )}
        {p === 'question-library-mgmt' && (
          <QuestionLibraryMgmt
            customQuestions={customQuestions}
            revisionQuestions={revisionQuestions}
            onNavigateAdd={() => {
              setQuestionAddDestination('custom');
              setQuestionReadOnly(false);
              setQuestionDisplayId(undefined);
              setQuestionContext(null);
              nav('question-add');
            }}
            onOpenQuestion={(question, editable, category: QuestionManagementCategory) => {
              const idParts = question.questionId?.split('-') ?? [];
              const prefix = idParts[0];
              const root = FOLDER_TREE.find(node => (node.id === 'ET' ? 'C' : node.id) === prefix);
              const childIndex = Math.max(0, Number(idParts[1] ?? 1) - 1);
              const folderId = root?.children?.[childIndex]?.id ?? 'L-고용';
              const classificationLabels = [
                '분류[1]:정책/인증/계획',
                '분류[2]:거버넌스/매커니즘(체계)',
                '분류[3]:활동',
                '분류[4]:성과',
                '분류[5]:목표',
              ];
              const defaults = createQuestionFormDefaults(question, folderId);
              const contextualQuestion = {
                ...question,
                form: question.form ?? {
                  ...defaults,
                  classification: classificationLabels[Math.max(0, Number(idParts[2] ?? 1) - 1)] ?? classificationLabels[0],
                  sequence: idParts[3] ?? defaults.sequence,
                },
              };
              setQuestionAddDestination(category === '기타 지표' ? 'custom' : 'basic');
              setQuestionReadOnly(!editable);
              setQuestionDisplayId(editable ? undefined : question.questionId);
              setQuestionContext({ question: contextualQuestion, folderId, mode: 'edit' });
              nav('question-add');
            }}
          />
        )}
        {p === 'question-add' && (
          <QuestionAddPage
            onBack={() => nav(questionAddDestination === 'campaign-custom' ? 'campaign-survey-info' : questionAddDestination === 'custom' ? 'question-library-mgmt' : 'question-library-basic-set')}
            initialValues={questionContext
              ? createQuestionFormDefaults(questionContext.question, questionContext.folderId)
              : questionAddDestination === 'campaign-custom' && campaignCustomTarget
                ? createQuestionFormDefaults({ no: '', title: '', type: '라디오', attachment: 'N', campaigns: 0 }, campaignCustomTarget.folderId)
                : undefined}
            inheritStructure={questionContext?.mode === 'child'}
            mode={questionContext?.mode ?? 'create'}
            additionalQuestions={questionAddDestination === 'custom' || questionAddDestination === 'campaign-custom' ? [...customQuestions, ...CUSTOM_QUESTION_SEED] : [...addedQuestions, ...revisionQuestions]}
            idTag={questionAddDestination === 'custom' || questionAddDestination === 'campaign-custom' ? 'C' : 'B'}
            readOnly={questionReadOnly}
            displayQuestionId={questionDisplayId}
            hasChildren={!!questionContext && (
              addedQuestions.some(question => question.folderId === questionContext.folderId && question.parentNo === questionContext.question.no)
              || (questionContext.mode === 'edit'
                && !questionContext.question.parentNo
                && getBaseChildCount(questionContext.question.no, questionContext.folderId) > 0)
            )}
            onDelete={questionContext?.mode === 'edit' ? () => {
              const target = questionContext.question;
              const folderId = questionContext.folderId;
              const targetNos = new Set([
                target.no,
                ...(target.parentNo ? [] : [
                  ...(QUESTIONS_BY_FOLDER[folderId] ?? []).filter(question => question.parentNo === target.no).map(question => question.no),
                  ...addedQuestions.filter(question => question.folderId === folderId && question.parentNo === target.no).map(question => question.no),
                ]),
              ]);

              setAddedQuestions(current => current.filter(question => question.folderId !== folderId || !targetNos.has(question.no)));
              setEditedQuestions(current => current.filter(question => question.folderId !== folderId || !targetNos.has(question.no)));
              setDeletedQuestionKeys(current => {
                const next = new Set(current);
                targetNos.forEach(no => next.add(`${folderId}::${no}`));
                return next;
              });
              setQuestionContext(null);
              nav('question-library-basic-set');
            } : undefined}
            onSave={(values: QuestionFormValues) => {
              if (questionAddDestination === 'basic') {
                const updateVersion = window.confirm('수정사항을 저장합니다. 기본 SET 버전도 지금 업데이트하시겠습니까?');
                if (updateVersion) {
                  const versionName = window.prompt('새 버전명을 입력해 주세요.');
                  if (versionName?.trim()) {
                    const stored = JSON.parse(localStorage.getItem('basic-set-versions') ?? '[]') as string[];
                    localStorage.setItem('basic-set-versions', JSON.stringify([versionName.trim(), ...stored.filter(item => item !== versionName.trim())]));
                    localStorage.setItem('basic-set-current-version', versionName.trim());
                  }
                }
              }
              if (questionAddDestination === 'custom' || questionAddDestination === 'campaign-custom') {
                const today = new Date();
                const generatedId = generateQuestionId(values);
                const idPrefix = generatedId.split('-').slice(0, 3).join('-');
                const customSequence = [...customQuestions, ...CUSTOM_QUESTION_SEED]
                  .filter(question => question.questionId?.startsWith(`${idPrefix}-`)).length + 1;
                const createdQuestion: Question = {
                  no: String(5700 + customQuestions.length),
                  questionId: `${idPrefix}-${customSequence}`,
                  title: values.title.trim() || '새 기타 지표',
                  type: values.questionType,
                  attachment: values.hasAttachment === 'yes' ? 'Y' : 'N',
                  updated: `${String(today.getFullYear()).slice(-2)}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`,
                  campaigns: 0,
                  form: values,
                  industries: values.industries,
                  customerName: questionContext?.question.customerName ?? '공통',
                };
                setCustomQuestions(current => [{ ...createdQuestion, no: String(5700 + current.length) }, ...current]);
                if (questionAddDestination === 'campaign-custom' && campaignCustomTarget) {
                  const surveyState = CAMPAIGN_SURVEY_STATE[campaignCustomTarget.campaignName];
                  if (surveyState) {
                    const existing = surveyState.questionsByFolder[campaignCustomTarget.folderId] ?? [];
                    surveyState.questionsByFolder[campaignCustomTarget.folderId] = [...existing, {
                      no: 9000 + existing.length,
                      displayNo: existing.filter(question => question.adopted).length + 1,
                      title: createdQuestion.title,
                      type: createdQuestion.type,
                      attachment: createdQuestion.attachment === 'Y' ? '필수' : '없음',
                      adopted: true,
                      folderId: campaignCustomTarget.folderId,
                      sourceNo: createdQuestion.no,
                      sourceFolderId: campaignCustomTarget.folderId,
                      form: values,
                      industries: values.industries,
                    }];
                  }
                  nav('campaign-survey-info');
                  return;
                }
                nav('question-library-mgmt');
                return;
              }
              if (questionContext?.mode === 'edit') {
                const target = questionContext.question;
                const today = new Date();
                const revisedQuestion: Question = {
                  ...target,
                  no: String(6000 + revisionQuestions.length),
                  questionId: generateQuestionId(values),
                  title: values.title.trim() || target.title,
                  type: values.questionType,
                  attachment: values.hasAttachment === 'yes' ? 'Y' : 'N',
                  updated: `${String(today.getFullYear()).slice(-2)}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`,
                  campaigns: 0,
                  folderId: questionContext.folderId,
                  form: { ...values, summary: target.title },
                  industries: values.industries,
                  industryCode: typeof values.industryCode === 'number' ? values.industryCode : (target.industryCode ?? 0),
                };
                setRevisionQuestions(current => [revisedQuestion, ...current]);
                setQuestionContext(null);
                nav('question-library-basic-set');
                return;
              }

              const explicitParent = questionContext?.mode === 'child'
                ? {
                    question: questionContext.question.parentNo
                      ? { ...questionContext.question, no: questionContext.question.parentNo }
                      : questionContext.question,
                    folderId: questionContext.folderId,
                  }
                : undefined;
              const addedParent = !explicitParent
                ? addedQuestions.find(candidate => {
                    if (candidate.parentNo || !candidate.form) return false;
                    return candidate.form.firstCategory === values.firstCategory
                      && candidate.form.secondCategory === values.secondCategory
                      && candidate.form.classification === values.classification
                      && candidate.form.sequence === values.sequence;
                  })
                : undefined;
              const matchingCurrentBaseParent = Object.entries(QUESTIONS_BY_FOLDER)
                .flatMap(([folderId, questions]) => questions
                  .filter(question => !question.parentNo && !deletedQuestionKeys.has(`${folderId}::${question.no}`))
                  .map(question => ({
                    folderId,
                    question: editedQuestions.find(edited => edited.folderId === folderId && edited.no === question.no) ?? question,
                  })))
                .find(candidate => {
                  const form = createQuestionFormDefaults(candidate.question, candidate.folderId);
                  return form.firstCategory === values.firstCategory
                    && form.secondCategory === values.secondCategory
                    && form.classification === values.classification
                    && form.sequence === values.sequence;
                });
              const matchedParent = explicitParent
                ?? (addedParent ? { question: addedParent, folderId: addedParent.folderId ?? getFolderIdForForm(values) } : undefined)
                ?? matchingCurrentBaseParent;
              const folderId = matchedParent?.folderId ?? getFolderIdForForm(values);
              const parentNo = matchedParent?.question.no;
              const siblingCount = parentNo
                ? getBaseChildCount(parentNo, folderId) + addedQuestions.filter(question => question.folderId === folderId && question.parentNo === parentNo).length
                : 0;
              const rootCount = addedQuestions.filter(question => question.folderId === folderId && !question.parentNo).length;
              // BUG 1: no should be next sequential number after existing parent questions in the folder
              const baseParentCount = (QUESTIONS_BY_FOLDER[folderId] ?? [])
                .filter(q => !q.parentNo && !deletedQuestionKeys.has(`${folderId}::${q.no}`)).length;
              const no = parentNo ? `${parentNo}-${siblingCount + 1}` : String(baseParentCount + rootCount + 1);
              const today = new Date();
              const updated = `${String(today.getFullYear()).slice(-2)}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

              setAddedQuestions(current => [...current, {
                no,
                questionId: generateQuestionId(values),
                parentNo,
                title: values.title.trim() || '새 질의',
                type: values.questionType,
                attachment: values.hasAttachment === 'yes' ? 'Y' : 'N',
                updated,
                campaigns: 0,
                folderId,
                form: values,
                industries: values.industries,
                industryCode: typeof values.industryCode === 'number' ? values.industryCode : 0, // BUG 2
              }]);
              setQuestionContext(null);
              nav('question-library-basic-set');
            }}
          />
        )}
      </AdminShell>
    );
  } else if (screen.type === 'kpc') {
    const kpcView = screen.view;
    const accountType = screen.accountType ?? 'KPC';
    const backFromCampaignView = () => accountType === 'ADMIN'
      ? setScreen({ type: 'admin', page: 'access-stats' })
      : setScreen({ type: 'kpc', view: 'campaign-list', accountType });
    const kpcContent = (
      <>
          {kpcView === 'home' && <AccessStats onOpenProgress={(id, name, dateRange) => setScreen({ type: 'kpc', view: 'progress', accountType, selectedCampaign: id, selectedCampaignName: name, selectedCampaignPeriod: dateRange })} onOpenEvaluation={(id, name, dateRange) => setScreen({ type: 'kpc', view: 'eval-result', accountType, selectedCampaign: id, selectedCampaignName: name, selectedCampaignPeriod: dateRange })} onOpenAudit={() => setScreen({ type: 'kpc', view: 'audit-mgmt', accountType })} />}
          {kpcView === 'user-mgmt' && <UserManagement onNavigate={page => setScreen({ type: 'kpc', view: page as KpcPage, accountType })} />}
          {kpcView === 'user-registration' && <UserRegistrationForm onBack={() => setScreen({ type: 'kpc', view: 'user-mgmt', accountType })} />}
          {kpcView === 'client-mgmt' && <ClientCompany onNavigate={page => setScreen({ type: 'kpc', view: page as KpcPage, accountType })} />}
          {kpcView === 'client-company-registration' && <ClientCompanyForm mode="registration" onBack={() => setScreen({ type: 'kpc', view: 'client-mgmt', accountType })} />}
          {kpcView === 'client-company-edit' && <ClientCompanyForm mode="edit" onBack={() => setScreen({ type: 'kpc', view: 'client-mgmt', accountType })} />}
          {kpcView === 'basic-set' && <QuestionLibraryBasicSet onNavigateAdd={() => undefined} addedQuestions={addedQuestions} editedQuestions={editedQuestions} deletedQuestionKeys={deletedQuestionKeys} readOnly />}
          {kpcView === 'question-mgmt' && <QuestionLibraryMgmt customQuestions={customQuestions} revisionQuestions={revisionQuestions} onNavigateAdd={() => undefined} onOpenQuestion={() => undefined} />}
          {kpcView === 'alert-mgmt' && <AlertManagement role="KPC" />}
          {kpcView === 'alert-registration' && <AlertRegistrationForm onBack={() => setScreen({ type: 'kpc', view: 'alert-mgmt', accountType })} />}
          {kpcView === 'audit-mgmt' && <ConsultantAuditManagement />}
          {kpcView === 'campaign-mgmt' && <CampaignManagement campaigns={adminCampaigns} onSelectCampaign={campaign => setSelectedAdminCampaignNo(campaign.no)} onNavigate={page => setScreen({ type: 'kpc', view: page as KpcPage, accountType })} />}
          {kpcView === 'campaign-registration' && <CampaignRegistrationForm onBack={() => setScreen({ type: 'kpc', view: 'campaign-mgmt', accountType })} onSave={campaign => { const now = new Date(); const nextNo = Math.max(...adminCampaigns.map(item => item.no), 0) + 1; setAdminCampaigns(current => [{ ...campaign, no: nextNo, regDate: now.toISOString().slice(0, 10) } as CampaignRecord, ...current]); setSelectedAdminCampaignNo(nextNo); setScreen({ type: 'kpc', view: 'campaign-mgmt', accountType }); }} />}
          {kpcView === 'campaign-edit-detail' && <CampaignEditDetail campaign={adminCampaigns.find(campaign => campaign.no === selectedAdminCampaignNo) ?? adminCampaigns[0]} onBack={() => setScreen({ type: 'kpc', view: 'campaign-mgmt', accountType })} onSave={updated => { setAdminCampaigns(current => current.map(item => item.no === updated.no ? updated : item)); setScreen({ type: 'kpc', view: 'campaign-mgmt', accountType }); }} onNavigateDetail={() => setScreen({ type: 'kpc', view: 'campaign-detail', accountType })} onNavigateSurvey={() => setScreen({ type: 'kpc', view: 'campaign-survey-info', accountType })} />}
          {kpcView === 'campaign-detail' && <CampaignDetailManagement campaignName={adminCampaigns.find(campaign => campaign.no === selectedAdminCampaignNo)?.name} onBack={() => setScreen({ type: 'kpc', view: 'campaign-edit-detail', accountType })} />}
          {kpcView === 'campaign-survey-info' && <CampaignSurveyInfo campaignName={adminCampaigns.find(campaign => campaign.no === selectedAdminCampaignNo)?.name} campaignIndustryCode={adminCampaigns.find(campaign => campaign.no === selectedAdminCampaignNo)?.industryCode ?? 1} onBack={() => setScreen({ type: 'kpc', view: 'campaign-edit-detail', accountType })} customQuestions={customQuestions} />}
          {kpcView === 'campaign-list' && (
            <KpcCampaignList
              onOpenProgress={(id, name, dateRange) => setScreen({ type: 'kpc', view: 'progress', accountType, selectedCampaign: id, selectedCampaignName: name, selectedCampaignPeriod: dateRange })}
              onOpenEvaluation={(id, name, dateRange) => setScreen({ type: 'kpc', view: 'eval-result', accountType, selectedCampaign: id, selectedCampaignName: name, selectedCampaignPeriod: dateRange })}
            />
          )}
          {kpcView === 'eval-result' && (
            <div className="flex" style={{ minHeight: 'calc(100vh - 56px)' }}>
              <EvalResult
                campaignName={screen.selectedCampaignName}
                campaignPeriod={screen.selectedCampaignPeriod}
                onBack={backFromCampaignView}
                onReviewPartner={company => setScreen({ ...screen, view: 'progress', selectedPartner: company })}
              />
            </div>
          )}
          {kpcView === 'progress' && (
            <div className="flex" style={{ minHeight: 'calc(100vh - 56px)' }}>
              <ProgressView
                campaignName={screen.selectedCampaignName}
                campaignPeriod={screen.selectedCampaignPeriod}
                onBack={backFromCampaignView}
                initialPartner={screen.selectedPartner}
              />
            </div>
          )}
      </>
    );
    content = accountType === 'ADMIN'
      ? <AdminShell currentPage="access-stats" onNavigate={page => setScreen({ type: 'admin', page: page as AdminPage })} onLogout={() => setScreen({ type: 'login-front' })}>{kpcContent}</AdminShell>
      : <KpcShell page={(kpcView === 'progress' || kpcView === 'eval-result' ? 'campaign-list' : kpcView === 'campaign-registration' || kpcView === 'campaign-edit-detail' || kpcView === 'campaign-detail' || kpcView === 'campaign-survey-info' ? 'campaign-mgmt' : kpcView === 'alert-registration' ? 'alert-mgmt' : kpcView === 'user-registration' ? 'user-mgmt' : kpcView === 'client-company-registration' || kpcView === 'client-company-edit' ? 'client-mgmt' : kpcView) as KpcPage} onNavigate={page => setScreen({ type: 'kpc', view: page, accountType })} onLogout={() => setScreen({ type: 'login-front' })} accountName={accountType}>{kpcContent}</KpcShell>;
  } else if (screen.type === 'auditor') {
    const auditorView = screen.view;
    content = (
      <div className="min-h-screen flex flex-col" style={{ background: '#f0f0f0' }}>
        <FrontHeader role="AUD" audSection={auditorView === 'notification-management' ? '알림관리' : '실사관리'} onAudSectionChange={section => setScreen({ type: 'auditor', view: section === '알림관리' ? 'notification-management' : 'campaign-list' })} onLogout={() => setScreen({ type: 'login-front' })} userEmail="auditor01@example.com" />
        {auditorView === 'campaign-list' && (
          <AudCampaignList
            onOpenMail={(company, mailId) => setScreen({ type: 'auditor', view: 'mail-management', selectedCompany: company, selectedMailId: mailId })}
            onStartAudit={(company) => setScreen({ type: 'auditor', view: 'field-audit-form', selectedCompany: company })}
            onOpenImprovement={(company) => setScreen({ type: 'auditor', view: 'improvement-view', selectedCompany: company })}
          />
        )}
        {auditorView === 'mail-management' && (
          <AudMailManagement
            companyName={screen.selectedCompany ?? '한국정밀'}
            initialMailId={screen.selectedMailId}
            onBack={() => setScreen({ type: 'auditor', view: 'campaign-list' })}
          />
        )}
        {auditorView === 'field-audit-form' && (
          <AudFieldAuditForm
            companyName={screen.selectedCompany ?? '한국정밀'}
            onBack={() => setScreen({ type: 'auditor', view: 'campaign-list' })}
          />
        )}
        {auditorView === 'improvement-view' && (
          <main className="flex-1 overflow-auto bg-service-page py-6">
            <CustomerImprovementDetail companyName={screen.selectedCompany ?? '한국정밀'} onBack={() => setScreen({ type: 'auditor', view: 'campaign-list' })} />
          </main>
        )}
        {auditorView === 'notification-management' && <main className="flex-1 overflow-auto bg-service-page p-6"><AlertManagement role="AUD" /></main>}
      </div>
    );
  } else if (screen.type === 'partner') {
    const partnerTab = screen.tab;
    const surveyPage = screen.surveyPage;
    const changePartnerTab = (tab: PartnerTab) => {
      if (localStorage.getItem('part-implementation-dirty') && !window.confirm('저장하지 않은 변경사항이 있습니다. 페이지를 이동하시겠습니까?')) return;
      setScreen({ type: 'partner', tab });
    };
    const goToSurveyPage = (page: SurveyPage) => setScreen({ type: 'partner', tab: '진단', surveyPage: page });
    const nextSurveyPage = (current: SurveyPage) => {
      const idx = surveyOrder.indexOf(current);
      if (idx < surveyOrder.length - 1) goToSurveyPage(surveyOrder[idx + 1]);
    };
    const prevSurveyPage = (current: SurveyPage) => {
      const idx = surveyOrder.indexOf(current);
      if (idx > 0) goToSurveyPage(surveyOrder[idx - 1]);
    };

    if (partnerTab === '진단' && surveyPage) {
      content = (
        <div className="min-h-screen flex flex-col" style={{ background: '#f5f5f5' }}>
          <FrontHeader role="PART" activeTab="진단" onTabChange={changePartnerTab} onLogout={() => setScreen({ type: 'login-front' })} userEmail="testpart@example.com" />
          <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            <SurveyNav currentPage={surveyPage} onNavigate={goToSurveyPage} />
            <main className="flex-1 overflow-auto flex flex-col bg-white">
              {surveyPage === 'intro' && <SurveyIntro onStart={() => goToSurveyPage('basic-info')} />}
              {surveyPage === 'basic-info' && <BasicInfo />}
              {surveyPage !== 'intro' && surveyPage !== 'basic-info' && (
                <SurveySection sectionId={surveyPage} onNext={() => nextSurveyPage(surveyPage)} onPrev={() => prevSurveyPage(surveyPage)} />
              )}
            </main>
          </div>
        </div>
      );
    } else {
      content = (
        <div className="min-h-screen flex flex-col" style={{ background: '#f5f5f5' }}>
          <FrontHeader role="PART" activeTab={partnerTab} onTabChange={changePartnerTab} onLogout={() => setScreen({ type: 'login-front' })} userEmail="testpart@example.com" />
          <div className="flex-1 overflow-auto">
            {partnerTab === '현황' && <Dashboard />}
            {partnerTab === '진단' && <AssessmentList onStartAssessment={() => setScreen({ type: 'partner', tab: '진단', surveyPage: 'intro' })} />}
            {partnerTab === '데이터' && <DataPage />}
            {partnerTab === '알림관리' && <div className="p-6"><AlertManagement role="PART" /></div>}
          </div>
        </div>
      );
    }
  }

  return (
    <>
      {content}
      <DexLogoOverlay />
    </>
  );
}
