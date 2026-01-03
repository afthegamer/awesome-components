export const CandidateSearchType = {
  LASTNAME: 'lastName',
  FIRSTNAME: 'firstName',
  COMPANY: 'company',
} as const;

export type CandidateSearchType = (typeof CandidateSearchType)[keyof typeof CandidateSearchType];
