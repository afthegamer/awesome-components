export const CANDIDATE_SEARCH_KEYS = ['lastName', 'firstName', 'company'] as const;
export type CandidateSearchKey = (typeof CANDIDATE_SEARCH_KEYS)[number];

export const CANDIDATE_SEARCH_OPTIONS: ReadonlyArray<{ value: CandidateSearchKey; label: string }> =
  [
    { value: 'lastName', label: 'Nom' },
    { value: 'firstName', label: 'Prénom' },
    { value: 'company', label: 'Entreprise' },
  ];
