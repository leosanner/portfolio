/**
 * Organisations connected to Leo's work, with their logos.
 * Logos in /public/logos/ are white single-colour marks made from each organisation's
 * official file, so they sit evenly on the dark background. Without a logo, the name
 * is shown as text.
 */
import type { Localized } from '../i18n/ui';

export type OrgId = 'cnpq' | 'unifesp' | 'usp' | 'petrobras' | 'univesp' | 'trust-gtw';

export interface Org {
  name: string;
  fullName: Localized;
  logo?: string;
  /** Visual height relative to the default, for marks with fine detail. */
  scale?: number;
}

export const orgs: Record<OrgId, Org> = {
  cnpq: {
    name: 'CNPq',
    fullName: {
      en: 'National Council for Scientific and Technological Development (CNPq)',
      pt: 'Conselho Nacional de Desenvolvimento Científico e Tecnológico (CNPq)',
    },
    logo: '/logos/cnpq.png',
  },
  unifesp: {
    name: 'UNIFESP',
    fullName: { en: 'Federal University of São Paulo (UNIFESP)', pt: 'Universidade Federal de São Paulo (UNIFESP)' },
    logo: '/logos/unifesp.png',
    scale: 1.7,
  },
  usp: {
    name: 'USP',
    fullName: { en: 'University of São Paulo (USP)', pt: 'Universidade de São Paulo (USP)' },
    logo: '/logos/usp.png',
  },
  petrobras: {
    name: 'Petrobras',
    fullName: { en: 'Petrobras', pt: 'Petrobras' },
    logo: '/logos/petrobras.png',
  },
  univesp: {
    name: 'UNIVESP',
    fullName: {
      en: 'Virtual University of the State of São Paulo (UNIVESP)',
      pt: 'Universidade Virtual do Estado de São Paulo (UNIVESP)',
    },
    logo: '/logos/univesp.png',
    scale: 1.3,
  },
  'trust-gtw': {
    name: 'Trust GTW',
    fullName: { en: 'Trust GTW', pt: 'Trust GTW' },
  },
};

export type OrgRole = 'funding' | 'university' | 'company';

export interface Affiliation {
  org: OrgId;
  role: OrgRole;
}
