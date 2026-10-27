// Mock WYSIWYG editor toolbar matching the original screenshot appearance
export default function EditorToolbar({ children }: { children?: React.ReactNode }) {
  const row1 = ['⊞', '⊟', '📷', '📋', '✂', '📄', '📋', '📋', '→', '←', '🔍', '🔍', '⚡', '⚖', '–', '⊞', '◎', '⊕', '☐', '☐', '☐', '☐', '↔', '📝', 'B', 'I', 'U', 'S', 'x₂', 'x²', 'I', '≡', '≡', '⊕', '""', '≡', '≡', '≡', '≡', '≡', '≡', '⟵', '⟶', '↩', '↩', '≡', 'A', '표', '≡', 'Ω', '≡', '⊞'];
  const row2 = ['스타일', '포맷', '폰트', '크기', 'A', 'A', 'X', '≡', '?'];

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 3, overflow: 'hidden' }}>
      {/* Toolbar row 1 */}
      <div className="flex flex-wrap items-center gap-px px-1 py-1" style={{ background: '#f5f5f5', borderBottom: '1px solid #e0e0e0', minHeight: 32 }}>
        {row1.map((icon, i) => (
          <button key={i} style={{ fontSize: 10, padding: '2px 3px', background: 'none', border: 'none', cursor: 'pointer', color: '#444', minWidth: 18, height: 20, lineHeight: 1 }} title={icon}>{icon}</button>
        ))}
      </div>
      {/* Toolbar row 2 - dropdowns */}
      <div className="flex items-center gap-1 px-1 py-1" style={{ background: '#f5f5f5', borderBottom: '1px solid #e0e0e0', minHeight: 30 }}>
        {['스타일', '포맷', '폰트', '크기'].map(label => (
          <select key={label} style={{ fontSize: 11, padding: '1px 4px', border: '1px solid #ccc', borderRadius: 2, height: 22, background: '#fff' }}>
            <option>{label}</option>
          </select>
        ))}
        {['A', 'A', 'X', '≡', '?'].map((icon, i) => (
          <button key={i} style={{ fontSize: 11, padding: '2px 4px', background: 'none', border: 'none', cursor: 'pointer', color: '#444' }}>{icon}</button>
        ))}
      </div>
      {/* Editor area */}
      <div style={{ minHeight: 160, background: '#fff', padding: 8, fontSize: 13, color: '#333' }}>
        {children}
      </div>
      {/* Bottom scrollbar placeholder */}
      <div style={{ height: 14, background: '#f5f5f5', borderTop: '1px solid #e0e0e0' }} />
    </div>
  );
}
