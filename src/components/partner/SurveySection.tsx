import { surveySections, SurveyQuestion } from '../../data';
import type { SurveyPage } from './SurveyNav';

interface Props {
  sectionId: string;
  onNext: () => void;
  onPrev: () => void;
}

function QuestionBlock({ q }: { q: SurveyQuestion }) {
  return (
    <div className="border-b py-5" style={{ borderColor: '#f0f0f0' }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: '#222' }}>
        <span style={{ color: '#333' }}>{q.id}) </span>{q.text}
        {' '}<span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white text-xs cursor-pointer" style={{ background: '#888', fontSize: 9 }}>?</span>
      </div>

      {(q.type === 'radio' || q.type === 'radio_text') && q.options && (
        <div className="flex flex-col gap-2 pl-2">
          {q.options.map(opt => (
            <label key={opt.label} className="flex items-start gap-2 text-sm">
              <input type="radio" name={q.id} className="mt-0.5 flex-shrink-0" />
              <span>{opt.label}</span>
              {opt.hasText && (
                <input
                  type="text"
                  placeholder="필요 시, 관련 설명 작성 또는 URL링크를 입력해주세요."
                  className="border rounded px-2 py-1 text-xs flex-1"
                  style={{ borderColor: '#ccc' }}
                />
              )}
            </label>
          ))}
        </div>
      )}

      {(q.type === 'checkbox' || q.type === 'checkbox_text') && q.options && (
        <div className="flex flex-col gap-2 pl-2">
          {q.options.map(opt => (
            <label key={opt.label} className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-0.5 flex-shrink-0" />
              <span>{opt.label}</span>
              {opt.hasText && (
                <input
                  type="text"
                  placeholder="필요 시, 관련 설명 작성 또는 URL링크를 입력해주세요."
                  className="border rounded px-2 py-1 text-xs flex-1"
                  style={{ borderColor: '#ccc' }}
                />
              )}
            </label>
          ))}
        </div>
      )}

      {q.hasFile && (
        <div className="flex items-center gap-3 mt-3">
          <button className="rounded px-3 py-1.5 text-white text-xs font-medium" style={{ background: '#4a90d9', fontSize: 12 }}>
            ☁ 파일등록
          </button>
          <input
            type="text"
            placeholder="근거자료를 등록해주세요."
            className="border rounded px-3 py-1.5 text-xs flex-1"
            style={{ borderColor: '#e0e0e0', background: '#fafafa', maxWidth: 360 }}
            readOnly
          />
        </div>
      )}
    </div>
  );
}

function findSection(sectionId: string) {
  for (const catKey of Object.keys(surveySections)) {
    const secs = surveySections[catKey];
    const found = secs.find(s => s.id === sectionId);
    if (found) return found;
  }
  return null;
}

export default function SurveySection({ sectionId, onNext, onPrev }: Props) {
  const section = findSection(sectionId);

  if (!section) return <div className="p-6">섹션을 찾을 수 없습니다.</div>;

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#e8e8e8' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>{section.title}</h2>
          <div style={{ height: 3, width: 40, background: '#4a90d9', borderRadius: 2, marginTop: 4 }} />
        </div>
        <div className="flex gap-2">
          <button onClick={onPrev} className="rounded px-4 py-1.5 text-sm font-medium text-white" style={{ background: '#3d4d5c' }}>다음</button>
          <button onClick={onNext} className="rounded px-4 py-1.5 text-sm font-medium text-white" style={{ background: '#e63946' }}>저장</button>
        </div>
      </div>

      {/* Questions */}
      <div className="px-6 pb-6">
        {section.questions.map(q => (
          <QuestionBlock key={q.id} q={q} />
        ))}
      </div>

      {/* Right arrow for next section */}
      <button
        onClick={onNext}
        className="fixed right-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-white border shadow text-gray-500 hover:bg-gray-50"
        style={{ width: 32, height: 32, borderColor: '#ddd' }}
      >
        ›
      </button>
    </div>
  );
}
