import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import {
  createQuestionFormDefaults,
  FOLDER_TREE,
  generateQuestionId,
  normalizeQuestionType,
  QUESTIONS_BY_FOLDER,
  type QuestionFormValues,
} from './QuestionLibraryBasicSet';

interface Props {
  onBack: () => void;
  onSave: (values: QuestionFormValues) => void;
  initialValues?: QuestionFormValues;
  inheritStructure?: boolean;
  mode?: 'create' | 'child' | 'edit';
  onDelete?: () => void;
  hasChildren?: boolean;
  additionalQuestions?: Array<{ form?: QuestionFormValues; questionId?: string }>;
  idTag?: 'B' | 'C';
  readOnly?: boolean;
  displayQuestionId?: string;
}

const firstCategoryPlaceholder = '-1차 카테고리-';
const secondCategoryPlaceholder = '-2차 카테고리-';
const getCategoryCode = (categoryId: string) => categoryId === 'ET' ? 'C' : categoryId;

const firstCategoryOptions = [
  firstCategoryPlaceholder,
  ...FOLDER_TREE.map((category) => {
    const label = category.label.replace(/^[▼▶]\s*/, '').replace(/^[A-Z]+\./, '');
    return `구분[${getCategoryCode(category.id)}]:${label}`;
  }),
];

const secondCategoriesByFirst = Object.fromEntries(
  FOLDER_TREE.map((category) => [
    `구분[${getCategoryCode(category.id)}]:${category.label.replace(/^[▼▶]\s*/, '').replace(/^[A-Z]+\./, '')}`,
    [secondCategoryPlaceholder, ...(category.children ?? []).map((child) => child.label)],
  ]),
) as Record<string, string[]>;

const classifications = [
  '분류',
  '분류[1]:정책/인증/계획',
  '분류[2]:거버넌스/매커니즘(체계)',
  '분류[3]:활동',
  '분류[4]:성과',
  '분류[5]:목표',
];
const questionTypes = ['라디오', '체크박스', '텍스트박스', '정량데이터'];
const existingQuestionIds = new Set(
  Object.entries(QUESTIONS_BY_FOLDER).flatMap(([folderId, questions]) =>
    questions.map(question => generateQuestionId(createQuestionFormDefaults(question, folderId))),
  ),
);

const colors = {
  navy: '#12357b',
  label: '#f7f7f7',
  border: '#dddddd',
  fieldBorder: '#d4d4d4',
  text: '#171717',
  muted: '#8a8a8a',
  note: '#075ac8',
  duplicate: '#667893',
  white: '#ffffff',
};

function SelectField({
  value,
  onChange,
  options,
  width,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  width: number | string;
  disabled?: boolean;
}) {
  return (
    <select
      aria-label={value}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      style={{
        width,
        height: 38,
        border: `1px solid ${colors.fieldBorder}`,
        background: disabled ? '#fafafa' : colors.white,
        color: disabled ? '#9a9a9a' : '#595959',
        padding: '0 12px',
        fontSize: 16,
      }}
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}

function Radio({
  name,
  value,
  checked,
  onChange,
  label,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        style={{ width: 15, height: 15, accentColor: colors.navy }}
      />
      <span>{label}</span>
    </label>
  );
}

function LabelCell({ children }: { children: React.ReactNode }) {
  return (
    <td
      style={{
        background: colors.label,
        borderRight: `1px solid ${colors.border}`,
        padding: '0 20px',
        fontWeight: 700,
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </td>
  );
}

interface ChoiceRow {
  id: number;
  satisfaction: string;
  answerTitle: string;
  extraField: string;
  fulfilledComment: string;
  unfulfilledComment: string;
}

interface LabelRow {
  id: number;
  before: string;
  after: string;
}

function QuestionDetailForm({
  questionType,
  initialTitle,
  onTitleChange,
}: {
  questionType: string;
  initialTitle: string;
  onTitleChange: (title: string) => void;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [help, setHelp] = useState('');
  const helpEditorRef = useRef<HTMLDivElement>(null);
  const [choiceRows, setChoiceRows] = useState<ChoiceRow[]>([
    { id: 1, satisfaction: '선택', answerTitle: '', extraField: '선택', fulfilledComment: '', unfulfilledComment: '' },
    { id: 2, satisfaction: '선택', answerTitle: '', extraField: '선택', fulfilledComment: '', unfulfilledComment: '' },
  ]);
  const [labelRows, setLabelRows] = useState<LabelRow[]>([
    { id: 1, before: '', after: '' },
  ]);

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    height: 38,
    border: `1px solid ${colors.fieldBorder}`,
    background: colors.white,
    padding: '0 12px',
    fontSize: 15,
    color: colors.text,
  };

  const detailCellStyle: React.CSSProperties = {
    borderRight: `1px solid ${colors.border}`,
    borderBottom: `1px solid ${colors.border}`,
    padding: '8px',
    textAlign: 'center',
  };

  const updateChoiceRow = (id: number, field: keyof ChoiceRow, value: string) => {
    setChoiceRows((rows) => rows.map((row) => row.id === id ? { ...row, [field]: value } : row));
  };

  const addChoiceRow = () => {
    setChoiceRows((rows) => [
      ...rows,
      {
        id: Math.max(...rows.map((row) => row.id), 0) + 1,
        satisfaction: '선택',
        answerTitle: '',
        extraField: '선택',
        fulfilledComment: '',
        unfulfilledComment: '',
      },
    ]);
  };

  const removeChoiceRow = (id: number) => {
    setChoiceRows((rows) => rows.filter((row) => row.id !== id).map((row, index) => ({ ...row, id: index + 1 })));
  };

  const updateLabelRow = (id: number, field: keyof LabelRow, value: string) => {
    setLabelRows((rows) => rows.map((row) => row.id === id ? { ...row, [field]: value } : row));
  };

  const addLabelRow = () => {
    setLabelRows((rows) => [...rows, { id: Math.max(...rows.map((row) => row.id), 0) + 1, before: '', after: '' }]);
  };

  const removeLabelRow = (id: number) => {
    setLabelRows((rows) => rows.filter((row) => row.id !== id).map((row, index) => ({ ...row, id: index + 1 })));
  };

  const isChoiceType = ['라디오', '체크박스'].includes(questionType);
  const isLabelType = ['텍스트박스', '정량데이터'].includes(questionType);

  const applyHelpFormat = (command: 'bold' | 'italic' | 'underline' | 'foreColor', value?: string) => {
    helpEditorRef.current?.focus();
    document.execCommand(command, false, value);
    setHelp(helpEditorRef.current?.innerHTML ?? '');
  };

  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
        질의 상세 설정 <span style={{ color: colors.note, fontSize: 15 }}>({questionType})</span>
      </div>
      <div className="overflow-x-auto">
        <table
          style={{
            width: '100%',
            minWidth: 980,
            borderCollapse: 'collapse',
            borderTop: `1px solid ${colors.text}`,
            borderBottom: `1px solid ${colors.border}`,
            background: colors.white,
            fontSize: 15,
          }}
        >
          <colgroup>
            <col style={{ width: 155 }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <LabelCell>제목</LabelCell>
              <td style={{ padding: '8px 14px', borderBottom: `1px solid ${colors.border}` }}>
                <input
                  aria-label="질의 제목"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    onTitleChange(event.target.value);
                  }}
                  style={fieldStyle}
                />
              </td>
            </tr>

            <tr>
              <LabelCell>문항등록</LabelCell>
              <td style={{ padding: isChoiceType || isLabelType ? '8px 14px 14px' : '8px 14px', borderBottom: `1px solid ${colors.border}` }}>
                {isChoiceType && (
                  <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: `1px solid ${colors.border}` }}>
                      <thead>
                        <tr style={{ background: colors.label }}>
                          <th style={{ ...detailCellStyle, width: 66 }}>번호</th>
                          <th style={{ ...detailCellStyle, width: 165 }}>충족 여부</th>
                          <th style={detailCellStyle}>답변 제목</th>
                          <th style={{ ...detailCellStyle, width: 165 }}>추가필드</th>
                          <th style={{ ...detailCellStyle, width: 105 }}>설정</th>
                        </tr>
                      </thead>
                      <tbody>
                        {choiceRows.map((row, index) => (
                          <Fragment key={row.id}>
                            <tr>
                              <td style={detailCellStyle}>{index + 1}</td>
                              <td style={detailCellStyle}>
                                <select
                                  aria-label={`${index + 1}번 충족 여부`}
                                  value={row.satisfaction}
                                  onChange={(event) => updateChoiceRow(row.id, 'satisfaction', event.target.value)}
                                  style={fieldStyle}
                                >
                                  {['선택', '충족', '미충족'].map((option) => <option key={option}>{option}</option>)}
                                </select>
                              </td>
                              <td style={detailCellStyle}>
                                <input
                                  aria-label={`${index + 1}번 답변 제목`}
                                  value={row.answerTitle}
                                  onChange={(event) => updateChoiceRow(row.id, 'answerTitle', event.target.value)}
                                  style={fieldStyle}
                                />
                              </td>
                              <td style={detailCellStyle}>
                                <select
                                  aria-label={`${index + 1}번 추가필드`}
                                  value={row.extraField}
                                  onChange={(event) => updateChoiceRow(row.id, 'extraField', event.target.value)}
                                  style={fieldStyle}
                                >
                                  {['선택', '없음', '텍스트', '파일'].map((option) => <option key={option}>{option}</option>)}
                                </select>
                              </td>
                              <td style={detailCellStyle}>
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => removeChoiceRow(row.id)}
                                    style={{ border: 0, borderRadius: 2, background: '#ef2d24', color: colors.white, height: 38, padding: '0 14px', cursor: 'pointer' }}
                                  >
                                    삭제
                                  </button>
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={5} style={{ padding: '8px 14px', borderBottom: `1px solid ${colors.border}` }}>
                                <div className={questionType === '체크박스' ? 'grid grid-cols-2 gap-1' : ''}>
                                  <input
                                    aria-label={`${row.id}번 선택 시 멘트`}
                                    value={row.fulfilledComment}
                                    onChange={(event) => updateChoiceRow(row.id, 'fulfilledComment', event.target.value)}
                                    placeholder="선택 시 멘트"
                                    style={fieldStyle}
                                  />
                                  {questionType === '체크박스' && (
                                    <input
                                      aria-label={`${row.id}번 비선택 시 멘트`}
                                      value={row.unfulfilledComment}
                                      onChange={(event) => updateChoiceRow(row.id, 'unfulfilledComment', event.target.value)}
                                      placeholder="비선택 시 멘트"
                                      style={fieldStyle}
                                    />
                                  )}
                                </div>
                              </td>
                            </tr>
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                    <button
                      type="button"
                      onClick={addChoiceRow}
                      style={{ border: 0, borderRadius: 2, background: colors.navy, color: colors.white, width: 86, height: 40, marginTop: 14, fontSize: 16, cursor: 'pointer' }}
                    >
                      추가
                    </button>
                  </>
                )}

                {isLabelType && (
                  <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: `1px solid ${colors.border}` }}>
                      <thead>
                        <tr style={{ background: colors.label }}>
                          <th style={{ ...detailCellStyle, width: 66 }}>번호</th>
                          <th style={detailCellStyle}>라벨</th>
                          <th style={{ ...detailCellStyle, width: 105 }}>설정</th>
                        </tr>
                      </thead>
                      <tbody>
                        {labelRows.map((row, index) => (
                          <tr key={row.id} style={{ background: index % 2 ? colors.label : colors.white }}>
                            <td style={detailCellStyle}>{index + 1}</td>
                            <td style={detailCellStyle}>
                              <div className="grid grid-cols-2 gap-1">
                                <input
                                  aria-label={`${index + 1}번 ${questionType === '정량데이터' ? '데이터 이름' : '앞 라벨'}`}
                                  value={row.before}
                                  onChange={(event) => updateLabelRow(row.id, 'before', event.target.value)}
                                  placeholder={questionType === '정량데이터' ? '데이터의 이름' : '앞 라벨 (선택)'}
                                  style={fieldStyle}
                                />
                                <input
                                  aria-label={`${index + 1}번 ${questionType === '정량데이터' ? '데이터 단위' : '뒤 라벨'}`}
                                  value={row.after}
                                  onChange={(event) => updateLabelRow(row.id, 'after', event.target.value)}
                                  placeholder={questionType === '정량데이터' ? '데이터의 단위' : '뒤 라벨 (선택)'}
                                  style={fieldStyle}
                                />
                              </div>
                            </td>
                            <td style={detailCellStyle}>
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => removeLabelRow(row.id)}
                                  style={{ border: 0, borderRadius: 2, background: '#ef2d24', color: colors.white, height: 38, padding: '0 14px', cursor: 'pointer' }}
                                >
                                  삭제
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button
                      type="button"
                      onClick={addLabelRow}
                      style={{ border: 0, borderRadius: 2, background: colors.navy, color: colors.white, width: 86, height: 40, marginTop: 14, fontSize: 16, cursor: 'pointer' }}
                    >
                      추가
                    </button>
                  </>
                )}
              </td>
            </tr>

            <tr>
              <LabelCell>도움말</LabelCell>
              <td style={{ padding: '8px 14px' }}>
                <div className="flex items-center gap-1 border border-b-0 bg-gray-50 p-2" style={{ borderColor: colors.fieldBorder }}>
                  <button type="button" onClick={() => applyHelpFormat('bold')} aria-label="굵게" className="h-8 w-8 rounded border bg-white font-bold" style={{ borderColor: colors.fieldBorder }}>B</button>
                  <button type="button" onClick={() => applyHelpFormat('italic')} aria-label="기울임" className="h-8 w-8 rounded border bg-white italic" style={{ borderColor: colors.fieldBorder }}>I</button>
                  <button type="button" onClick={() => applyHelpFormat('underline')} aria-label="밑줄" className="h-8 w-8 rounded border bg-white underline" style={{ borderColor: colors.fieldBorder }}>U</button>
                  <label className="ml-1 flex h-8 items-center gap-2 rounded border bg-white px-2 text-xs" style={{ borderColor: colors.fieldBorder }}>
                    글꼴 색
                    <input
                      aria-label="글꼴 색"
                      type="color"
                      defaultValue="#171717"
                      className="h-5 w-6 cursor-pointer border-0 bg-transparent p-0"
                      onChange={(event) => applyHelpFormat('foreColor', event.target.value)}
                    />
                  </label>
                </div>
                <div
                  ref={helpEditorRef}
                  role="textbox"
                  aria-label="질의 도움말"
                  aria-multiline="true"
                  contentEditable
                  suppressContentEditableWarning
                  onInput={event => setHelp(event.currentTarget.innerHTML)}
                  data-empty={!help}
                  className="min-h-36 border bg-white p-4 text-sm outline-none focus:border-blue-500"
                  style={{ borderColor: colors.fieldBorder }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function QuestionAddPage({
  onBack,
  onSave,
  initialValues,
  inheritStructure = false,
  mode = 'create',
  onDelete,
  hasChildren = false,
  additionalQuestions = [],
  idTag = 'B',
  readOnly = false,
  displayQuestionId,
}: Props) {
  const [summary, setSummary] = useState(initialValues?.summary ?? '');
  const [firstCategory, setFirstCategory] = useState(initialValues?.firstCategory ?? firstCategoryPlaceholder);
  const [secondCategory, setSecondCategory] = useState(initialValues?.secondCategory ?? secondCategoryPlaceholder);
  const [classification, setClassification] = useState(initialValues?.classification ?? classifications[0]);
  const [sequence, setSequence] = useState(initialValues?.sequence ?? '');
  const [depth] = useState('일반');
  const [industry] = useState('산업분류');
  const [industries, setIndustries] = useState<string[]>(initialValues?.industries ?? []);
  const [companyCode, setCompanyCode] = useState(initialValues?.companyCode ?? '');
  const [required, setRequired] = useState(initialValues?.required ?? 'yes');
  const [notApplicable, setNotApplicable] = useState(initialValues?.notApplicable ?? 'no');
  const [notApplicableReason, setNotApplicableReason] = useState(initialValues?.notApplicableReason ?? '');
  const [hasAttachment, setHasAttachment] = useState(initialValues?.hasAttachment ?? 'no');
  const [questionType, setQuestionType] = useState(normalizeQuestionType(initialValues?.questionType ?? questionTypes[0]));
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const questionIndustryCode = initialValues?.industryCode ?? 0;
  const [duplicateCheck, setDuplicateCheck] = useState<{ id: string; duplicate: boolean } | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const secondCategoryOptions = secondCategoriesByFirst[firstCategory] ?? [secondCategoryPlaceholder];

  useEffect(() => {
    if (
      firstCategory === firstCategoryPlaceholder
      || secondCategory === secondCategoryPlaceholder
      || classification === classifications[0]
    ) {
      setSequence('');
      return;
    }

    const baseSequences = Object.entries(QUESTIONS_BY_FOLDER).flatMap(([folderId, questions]) =>
      questions.flatMap(question => {
        const values = createQuestionFormDefaults(question, folderId);
        if (
          values.firstCategory !== firstCategory
          || values.secondCategory !== secondCategory
          || values.classification !== classification
        ) return [];
        const parsed = Number(values.sequence);
        return Number.isFinite(parsed) ? [parsed] : [];
      }),
    );
    const addedSequences = additionalQuestions.flatMap(question => {
      const values = question.form;
      if (values) {
        if (
          values.firstCategory !== firstCategory
          || values.secondCategory !== secondCategory
          || values.classification !== classification
        ) return [];
        const parsed = Number(values.sequence);
        return Number.isFinite(parsed) ? [parsed] : [];
      }
      const prefix = generateQuestionId({
        summary: '', firstCategory, secondCategory, classification, sequence: '0',
        depth: '일반', industry: '산업분류', companyCode: '', required: 'yes',
        notApplicable: 'no', notApplicableReason: '', hasAttachment: 'no',
        questionType: '라디오', title: '',
      }).replace(/-0$/, '');
      if (!question.questionId?.startsWith(`${prefix}-`)) return [];
      const idParts = question.questionId.split('-');
      const parsed = Number(idParts[idParts.length - 1]);
      return Number.isFinite(parsed) ? [parsed] : [];
    });
    setSequence(String(Math.max(0, ...baseSequences, ...addedSequences) + 1));
  }, [additionalQuestions, classification, firstCategory, secondCategory]);
  const questionId = useMemo(() => generateQuestionId({
    summary,
    firstCategory,
    secondCategory,
    classification,
    sequence,
    depth,
    industry,
    companyCode,
    required,
    notApplicable,
    notApplicableReason,
    hasAttachment,
    questionType,
    title,
  }), [
    classification,
    companyCode,
    depth,
    firstCategory,
    hasAttachment,
    industry,
    notApplicable,
    notApplicableReason,
    questionType,
    required,
    secondCategory,
    sequence,
    summary,
    title,
  ]);

  const currentDuplicateCheck = duplicateCheck?.id === questionId ? duplicateCheck : null;

  const handleFirstCategoryChange = (value: string) => {
    setFirstCategory(value);
    setSecondCategory(secondCategoryPlaceholder);
  };

  const checkDuplicate = () => {
    if (questionId === '--') {
      setDuplicateCheck(null);
      return;
    }
    setDuplicateCheck({ id: questionId, duplicate: existingQuestionIds.has(questionId) });
  };

  const inputStyle = {
    height: 38,
    border: `1px solid ${colors.fieldBorder}`,
    background: colors.white,
    padding: '0 12px',
    fontSize: 16,
    color: colors.text,
  };

  return (
    <div style={{ color: colors.text, minWidth: 0 }}>
      <div className="mb-5">
        <div style={{ fontSize: 24, fontWeight: 700 }}>{readOnly ? '질의 상세' : mode === 'edit' ? '질의 수정' : '질의 등록'}</div>
      </div>

      <fieldset disabled={readOnly} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
      <div className="overflow-x-auto">
        <table
          style={{
            width: '100%',
            minWidth: 1080,
            borderCollapse: 'collapse',
            borderTop: `1px solid ${colors.text}`,
            borderBottom: `1px solid ${colors.border}`,
            background: colors.white,
            fontSize: 16,
          }}
        >
          <colgroup>
            <col style={{ width: 150 }} />
            <col style={{ width: '40%' }} />
            <col style={{ width: 150 }} />
            <col />
          </colgroup>
          <tbody>
            <tr style={{ height: 55, borderBottom: `1px solid ${colors.border}` }}>
              <LabelCell>질의 ID</LabelCell>
              <td style={{ padding: '8px 14px' }}>
                <div className="flex items-center gap-2">
                  {(displayQuestionId ?? questionId) !== '--' && (
                    <span className="rounded px-2 py-1 text-xs font-bold" style={{ background: idTag === 'B' ? '#e8eef8' : '#fff0f1', color: idTag === 'B' ? colors.navy : '#d92f3c' }}>[{idTag}]</span>
                  )}
                  {idTag === 'B' && industries.length > 0 && <span className="rounded bg-orange-100 px-2 py-1 text-xs font-bold text-orange-700" title={industries.join(', ')}>[I]</span>}
                  <span>{displayQuestionId ?? questionId}</span>
                  {!readOnly && <button
                    type="button"
                    onClick={checkDuplicate}
                    style={{
                      height: 38,
                      border: 0,
                      borderRadius: 2,
                      background: colors.duplicate,
                      color: colors.white,
                      padding: '0 14px',
                      fontSize: 16,
                      cursor: 'pointer',
                    }}
                  >
                    중복체크
                  </button>}
                  {currentDuplicateCheck && (
                    <span style={{ color: currentDuplicateCheck.duplicate ? '#d62525' : '#156f3a', fontSize: 14 }}>
                      {currentDuplicateCheck.duplicate ? '이미 사용 중인 질의 ID입니다.' : '사용 가능한 질의 ID입니다.'}
                    </span>
                  )}
                </div>
              </td>
              <LabelCell>요약 메모</LabelCell>
              <td style={{ padding: '8px 14px' }}>
                <input
                  aria-label="요약 메모"
                  value={summary}
                  onChange={(event) => setSummary(event.target.value)}
                  style={{ ...inputStyle, width: '100%' }}
                />
              </td>
            </tr>

            <tr style={{ height: 108, borderBottom: `1px solid ${colors.border}` }}>
              <LabelCell>
                카테고리 설정 <span style={{ color: '#d62525' }}>*</span>
              </LabelCell>
              <td colSpan={3} style={{ padding: '10px 14px', verticalAlign: 'top' }}>
                <div style={{ color: colors.note, marginBottom: 9 }}>
                  * 카테고리는 영문(대문자), 숫자만 가능합니다. (한글, 특수문자 사용 불가)
                </div>
                <div className="flex items-center gap-2">
                  <SelectField value={firstCategory} onChange={handleFirstCategoryChange} options={firstCategoryOptions} width={210} disabled={inheritStructure} />
                  <span>-</span>
                  <SelectField
                    value={secondCategory}
                    onChange={setSecondCategory}
                    options={secondCategoryOptions}
                    width={210}
                    disabled={inheritStructure || firstCategory === firstCategoryPlaceholder}
                  />
                  <span>-</span>
                  <SelectField value={classification} onChange={setClassification} options={classifications} width={274} disabled={inheritStructure} />
                  <input
                    aria-label="순번"
                    inputMode="numeric"
                    value={sequence}
                    readOnly
                    placeholder="자동"
                    style={{
                      ...inputStyle,
                      width: 75,
                      background: '#f4f6f8',
                      color: colors.text,
                      textAlign: 'center',
                    }}
                  />
                </div>
                <div style={{ color: colors.note, marginTop: 9 }}>
                  * 1차·2차 카테고리와 분류를 선택하면 기존 마지막 순번 다음 번호가 자동으로 입력됩니다.
                </div>
                {idTag === 'B' && !readOnly && <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-gray-600">산업 특화</span>
                  {['제조', '원자재', '유통', '환경', '전기'].map(item => <label key={item} className={`flex items-center gap-1 rounded border px-3 py-1.5 text-xs ${industries.includes(item) ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-gray-300 bg-white text-gray-600'}`}><input type="checkbox" checked={industries.includes(item)} onChange={() => setIndustries(current => current.includes(item) ? current.filter(value => value !== item) : [...current, item])} />{item}</label>)}
                  <span className="text-xs text-gray-400">선택 사항이며 질의 ID에는 영향을 주지 않습니다.</span>
                </div>}
              </td>
            </tr>

            <tr style={{ height: 50, borderBottom: `1px solid ${colors.border}` }}>
              <LabelCell>
                필수여부 <span style={{ color: '#d62525' }}>*</span>
              </LabelCell>
              <td style={{ padding: '0 14px' }}>
                <div className="flex items-center gap-3">
                  <Radio name="required" value="yes" checked={required === 'yes'} onChange={setRequired} label="예" />
                  <Radio name="required" value="no" checked={required === 'no'} onChange={setRequired} label="아니오" />
                </div>
              </td>
              <LabelCell>질의 등록일</LabelCell>
              <td style={{ padding: '0 14px' }}>2026-09-26</td>
            </tr>

            <tr style={{ height: 55, borderBottom: `1px solid ${colors.border}` }}>
              <LabelCell>
                해당없음 여부 <span style={{ color: '#d62525' }}>*</span>
              </LabelCell>
              <td style={{ padding: '0 14px' }}>
                <div className="flex items-center gap-2">
                  <Radio name="not-applicable" value="yes" checked={notApplicable === 'yes'} onChange={setNotApplicable} label="예" />
                  <input
                    aria-label="대체문구"
                    disabled={notApplicable !== 'yes'}
                    value={notApplicableReason}
                    onChange={(event) => setNotApplicableReason(event.target.value)}
                    placeholder="대체문구 입력필수(예:관련없음-폐기물배출 없음)"
                    style={{
                      ...inputStyle,
                      width: 340,
                      background: notApplicable === 'yes' ? colors.white : '#fafafa',
                      color: notApplicable === 'yes' ? colors.text : colors.muted,
                    }}
                  />
                  <Radio name="not-applicable" value="no" checked={notApplicable === 'no'} onChange={setNotApplicable} label="아니오" />
                </div>
              </td>
              <LabelCell>
                첨부파일 여부 <span style={{ color: '#d62525' }}>*</span>
              </LabelCell>
              <td style={{ padding: '0 14px' }}>
                <div className="flex items-center gap-3">
                  <Radio name="attachment" value="yes" checked={hasAttachment === 'yes'} onChange={setHasAttachment} label="예" />
                  <Radio name="attachment" value="no" checked={hasAttachment === 'no'} onChange={setHasAttachment} label="아니오" />
                </div>
              </td>
            </tr>

            <tr style={{ height: 50 }}>
              <LabelCell>
                질의 유형 <span style={{ color: '#d62525' }}>*</span>
              </LabelCell>
              <td colSpan={3} style={{ padding: '0 14px' }}>
                <div className="flex items-center gap-3">
                  {questionTypes.map((type) => (
                    <Radio
                      key={type}
                      name="question-type"
                      value={type}
                      checked={questionType === type}
                      onChange={setQuestionType}
                      label={type}
                    />
                  ))}
                </div>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      <div style={{ pointerEvents: readOnly ? 'none' : undefined }}>
        <QuestionDetailForm
          key={questionType}
          questionType={questionType}
          initialTitle={title}
          onTitleChange={setTitle}
        />
      </div>
      </fieldset>

      <div className="mt-12 flex justify-center gap-2">
        {!readOnly && mode === 'edit' && onDelete && (
          <button
            type="button"
            onClick={() => setDeleteConfirmOpen(true)}
            style={{
              width: 84,
              height: 40,
              border: 0,
              borderRadius: 2,
              background: '#ef2d24',
              color: colors.white,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            삭제
          </button>
        )}
        {!readOnly && <button
          type="button"
          onClick={() => onSave({
            summary,
            firstCategory,
            secondCategory,
            classification,
            sequence,
            depth,
            industry,
            companyCode,
            required,
            notApplicable,
            notApplicableReason,
            hasAttachment,
            questionType,
            title,
            industryCode: questionIndustryCode,
            industries,
          })}
          style={{
            width: 84,
            height: 40,
            border: 0,
            borderRadius: 2,
            background: colors.navy,
            color: colors.white,
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          {mode === 'edit' ? '수정' : '등록'}
        </button>}
        <button
          type="button"
          onClick={onBack}
          style={{
            width: 84,
            height: 40,
            border: `1px solid #8b8b8b`,
            borderRadius: 2,
            background: colors.white,
            color: '#777777',
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          목록
        </button>
      </div>

      {deleteConfirmOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: colors.white, borderRadius: 6, padding: '26px 30px', width: 420, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>질의 삭제</div>
            <div style={{ fontSize: 15, lineHeight: 1.7, color: '#555' }}>
              선택한 질의를 삭제하시겠습니까?
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                style={{ height: 38, border: `1px solid ${colors.fieldBorder}`, borderRadius: 2, background: colors.white, color: '#555', padding: '0 18px', fontSize: 15, cursor: 'pointer' }}
              >
                취소
              </button>
              <button
                type="button"
                onClick={onDelete}
                style={{ height: 38, border: 0, borderRadius: 2, background: '#ef2d24', color: colors.white, padding: '0 18px', fontSize: 15, cursor: 'pointer' }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
