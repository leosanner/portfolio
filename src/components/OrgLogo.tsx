import { orgs, type OrgId } from '../data/orgs';
import type { Locale } from '../i18n/ui';

/** An organisation's logo mark, or its name when there is no logo. */
export default function OrgLogo({ id, lang }: { id: OrgId; lang: Locale }) {
  const org = orgs[id];
  if (!org.logo) {
    return (
      <span className="org org--text" title={org.fullName[lang]}>
        {org.name}
      </span>
    );
  }
  return (
    <img
      className="org"
      src={org.logo}
      alt={org.fullName[lang]}
      title={org.fullName[lang]}
      style={org.scale ? { height: `calc(var(--org-h) * ${org.scale})` } : undefined}
      loading="lazy"
      decoding="async"
    />
  );
}
