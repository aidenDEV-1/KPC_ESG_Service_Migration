export type AuditAreaScores = {
  total: number;
  labor: number;
  safety: number;
  environment: number;
  ethics: number;
};

export type StoredAuditResult = {
  completedAt: string;
  scores: AuditAreaScores;
  answers?: Record<string, { answer: string | string[]; improvement: string; reviewed: boolean; auditorFiles: string[] }>;
};

export function getAuditResult(companyName: string): StoredAuditResult | null {
  try {
    return JSON.parse(localStorage.getItem(`aud-final-result-${companyName}`) ?? 'null');
  } catch {
    return null;
  }
}

export function calculateAuditScores(values: Record<string, { answer: string | string[]; reviewed: boolean }>): AuditAreaScores {
  const scoreFor = (prefixes: string[], base: number) => {
    const rows = Object.entries(values).filter(([id]) => prefixes.some(prefix => id.startsWith(prefix)));
    if (rows.length === 0) return base;
    const reviewed = rows.filter(([, value]) => value.reviewed).length;
    const answered = rows.filter(([, value]) => Array.isArray(value.answer) ? value.answer.length > 0 : value.answer.trim().length > 0).length;
    return Math.min(100, Number((base + reviewed / rows.length * 8 + answered / rows.length * 4).toFixed(1)));
  };
  const labor = scoreFor(['L-'], 70);
  const safety = scoreFor(['S-'], 72);
  const environment = scoreFor(['E-'], 68);
  const ethics = scoreFor(['G-', 'M-'], 71);
  return {
    total: Number(((labor + safety + environment + ethics) / 4).toFixed(1)),
    labor,
    safety,
    environment,
    ethics,
  };
}
