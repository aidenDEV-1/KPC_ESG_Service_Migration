import { surveySections } from '../../data';

type SurveyPage =
  | 'intro' | 'basic-info'
  | 'L01' | 'L02' | 'L03' | 'L04' | 'L05' | 'L06' | 'L07' | 'L08'
  | 'S01' | 'S02' | 'S03' | 'S04' | 'S05' | 'S06' | 'S07' | 'S08'
  | 'E01' | 'E02' | 'E03' | 'E04' | 'E05' | 'E06' | 'E07' | 'E08' | 'E09'
  | 'C01' | 'C02' | 'C03' | 'C04' | 'C05' | 'C06' | 'C07'
  | 'M01' | 'M02' | 'M03' | 'M04';

export type { SurveyPage };

interface Props {
  currentPage: SurveyPage;
  onNavigate: (page: SurveyPage) => void;
}

const categories = [
  { key: 'L', label: 'L. 노동 및 인권', sections: surveySections.L },
  { key: 'S', label: 'S. 안전 및 보건', sections: surveySections.S },
  { key: 'E', label: 'E. 환경', sections: surveySections.E },
  { key: 'C', label: 'C. 윤리', sections: surveySections.C },
  { key: 'M', label: 'M. 경영시스템', sections: surveySections.M },
];

export default function SurveyNav({ currentPage, onNavigate }: Props) {
  return (
    <nav className="flex-shrink-0 border-r bg-white overflow-y-auto" style={{ width: 220, borderColor: '#e0e0e0' }}>
      <div
        className="px-4 py-3 border-b cursor-pointer hover:bg-gray-50"
        style={{ borderColor: '#f0f0f0', fontWeight: currentPage === 'intro' ? 700 : 400, color: currentPage === 'intro' ? '#e63946' : '#333' }}
        onClick={() => onNavigate('intro')}
      >
        평가안내
      </div>
      <div
        className="px-4 py-3 border-b cursor-pointer hover:bg-gray-50"
        style={{ borderColor: '#f0f0f0', fontWeight: currentPage === 'basic-info' ? 700 : 400, color: currentPage === 'basic-info' ? '#e63946' : '#333' }}
        onClick={() => onNavigate('basic-info')}
      >
        기본정보
      </div>
      <div className="px-4 py-3 border-b" style={{ borderColor: '#f0f0f0', fontSize: 13, color: '#333', fontWeight: 600 }}>답변 작성</div>

      {categories.map(cat => (
        <div key={cat.key}>
          <div className="flex items-center justify-between px-4 py-2" style={{ background: '#f8f8f8', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#333' }}>{cat.label}</span>
            <div className="flex items-center gap-1">
              <span style={{ fontSize: 11, color: '#888' }}>0%</span>
              <div className="rounded-full overflow-hidden" style={{ width: 40, height: 6, background: '#ddd' }}>
                <div style={{ width: 0, height: '100%', background: '#4a90d9', borderRadius: 9999 }} />
              </div>
              <span style={{ fontSize: 11, color: '#888' }}>∧</span>
            </div>
          </div>
          {cat.sections.map(sec => (
            <div
              key={sec.id}
              className="px-5 py-1.5 cursor-pointer hover:bg-red-50"
              style={{
                borderBottom: '1px solid #f5f5f5',
                fontSize: 12,
                color: currentPage === sec.id ? '#e63946' : '#555',
                fontWeight: currentPage === sec.id ? 700 : 400,
              }}
              onClick={() => onNavigate(sec.id as SurveyPage)}
            >
              {sec.title}
            </div>
          ))}
        </div>
      ))}
    </nav>
  );
}
