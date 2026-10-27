interface Props {
  onLoginADMIN: () => void;
  onLoginKPC: () => void;
  onLoginPART: () => void;
  onLoginAUD: () => void;
  onLoginCustomer: () => void;
}

export default function FrontLogin({ onLoginADMIN, onLoginKPC, onLoginPART, onLoginAUD, onLoginCustomer }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(to bottom, #1a1a3e 0%, #2d1a2e 40%, #3d1a1a 70%, #6b3a1a 100%)',
        backgroundSize: 'cover',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        <div>
          <span style={{ fontWeight: 900, fontSize: 28, color: '#fff', fontStyle: 'italic' }}>kpc</span>
          <span style={{ display: 'inline-block', width: 28, height: 28, borderRadius: '50%', border: '2px solid #aaa', marginLeft: 4, verticalAlign: 'middle', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: '#aaa', fontSize: 10 }}>◎</span>
          </span>
        </div>
        <div style={{ color: '#fff', lineHeight: 1.2 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Supply Chain</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>ESG Assessment</div>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-3" style={{ width: 320 }}>
        <div className="rounded-full bg-white/90 flex items-center px-4 py-3 gap-2">
          <span style={{ color: '#888', fontSize: 14 }}>✉</span>
          <input type="email" placeholder="Please enter your email" className="bg-transparent outline-none flex-1 text-sm" style={{ color: '#333' }} />
        </div>
        <div className="rounded-full bg-white/90 flex items-center px-4 py-3 gap-2">
          <span style={{ color: '#888', fontSize: 14 }}>🔒</span>
          <input type="password" placeholder="Please enter your Password" className="bg-transparent outline-none flex-1 text-sm" style={{ color: '#333' }} />
        </div>

        <button
          onClick={onLoginADMIN}
          className="rounded-full py-3 font-bold text-white text-sm mt-2 hover:opacity-90 transition-opacity"
          style={{ background: '#e63946' }}
        >
          ADMIN
        </button>
        <button
          onClick={onLoginKPC}
          className="rounded-full py-3 font-medium text-white text-sm hover:opacity-90 transition-opacity"
          style={{ background: '#555' }}
        >
          KPC
        </button>
        <button
          onClick={onLoginPART}
          className="rounded-full py-3 font-medium text-white text-sm hover:opacity-90 transition-opacity"
          style={{ background: '#3d5a7a' }}
        >
          협력사
        </button>
        <button onClick={onLoginAUD} className="rounded-full bg-[#167d8d] py-3 text-sm font-medium text-white hover:opacity-90">
          실사자
        </button>
        <button onClick={onLoginCustomer} className="rounded-full bg-[#6b4f7d] py-3 text-sm font-medium text-white hover:opacity-90">
          고객사
        </button>

        <button className="rounded-full py-2 text-sm mt-1 bg-white/20 text-white flex items-center justify-center gap-2">
          <span>≡</span> Find Password
        </button>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, textAlign: 'center', marginTop: 8 }}>
          Copyright © 2021 Korea Productivity Center. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
