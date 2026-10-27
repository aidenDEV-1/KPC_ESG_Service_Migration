interface Props {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a3055' }}>
      <div className="bg-white rounded shadow-lg" style={{ width: 460, padding: '48px 52px 52px' }}>
        {/* KPC Logo */}
        <div className="flex items-center justify-center mb-10">
          <span style={{ fontWeight: 900, fontSize: 32, color: '#e63946', fontStyle: 'italic', letterSpacing: -1 }}>kpc</span>
          <div className="ml-3 border-l pl-3" style={{ borderColor: '#ccc' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1a3055' }}>한국생산성본부</div>
            <div style={{ fontSize: 10, color: '#888', letterSpacing: 1 }}>KOREA PRODUCTIVITY CENTER</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="ID"
            className="w-full border rounded px-4 py-3 outline-none focus:border-blue-500"
            style={{ fontSize: 14, borderColor: '#ccc' }}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded px-4 py-3 outline-none focus:border-blue-500"
            style={{ fontSize: 14, borderColor: '#ccc' }}
          />
          <label className="flex items-center gap-2 mt-1" style={{ fontSize: 13 }}>
            <input type="checkbox" />
            아이디저장하기
          </label>
          <button
            onClick={onLogin}
            className="w-full py-3 rounded text-white font-medium mt-1 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#1a3055', fontSize: 15 }}
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}
