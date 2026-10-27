interface Props {
  value: string;
  onChange: (value: string) => void;
  label: string;
  min?: string;
  width?: number;
}

const formatDate = (value: string) => value ? `${value.replaceAll('-', '.')}.` : '';

export default function CampaignDatePicker({ value, onChange, label, min, width = 145 }: Props) {
  return (
    <div style={{ position: 'relative', width, height: 31 }}>
      <input
        aria-hidden="true"
        tabIndex={-1}
        readOnly
        value={formatDate(value)}
        placeholder="YYYY.MM.DD."
        style={{ width: '100%', height: '100%', border: '1px solid #ccc', borderRadius: 4, padding: '6px 30px 6px 10px', fontSize: 13, background: '#fff', color: '#333' }}
      />
      <span aria-hidden="true" style={{ position: 'absolute', right: 9, top: 6, color: '#6b7280', fontSize: 13, pointerEvents: 'none', zIndex: 1 }}>▦</span>
      <input
        type="date"
        aria-label={label}
        value={value}
        min={min}
        onChange={event => onChange(event.target.value)}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
      />
    </div>
  );
}
