export interface CampaignPartner {
  id: number;
  label: string;
  companyName: string;
  userId: string;
  userName: string;
}

export const availableCampaignPartners = [
  'TEST PARTNER 동진전자 (000-00-00001)',
  'TEST PARTNER 창원기계 (000-00-00002)',
  'TEST PARTNER 삼화전자 (000-00-00003)',
  'TEST PARTNER 한양정밀 (000-00-00004)',
];

export const selectedCampaignPartners: CampaignPartner[] = [
  {
    id: 1,
    label: 'TEST PARTNER 세영테크 (000-00-00005)',
    companyName: 'TEST PARTNER 세영테크',
    userId: 'testpart05@example.com',
    userName: '김세영',
  },
  {
    id: 2,
    label: 'TEST PARTNER 미래산업 (000-00-00006)',
    companyName: 'TEST PARTNER 미래산업',
    userId: 'testpart06@example.com',
    userName: '이미래',
  },
  {
    id: 3,
    label: 'TEST PARTNER 한국부품 (000-00-00007)',
    companyName: 'TEST PARTNER 한국부품',
    userId: 'testpart07@example.com',
    userName: '박한국',
  },
];

export const assignedCampaignAuditors = [
  'TEST AUDITOR 04 (test04@example.com)',
  'TEST AUDITOR 01 (test01@example.com)',
  'TEST AUDITOR 02 (test02@example.com)',
  'TEST AUDITOR 03 (test03@example.com)',
];
