import { Document, Page, Text, View, StyleSheet, Link, renderToFile } from '@react-pdf/renderer';
import path from 'path';
import { experiences } from '../src/data/experience';
import { schools } from '../src/data/education';
import { profile } from '../src/data/profile';

const C = {
  accent: '#0077cc',
  black: '#111111',
  muted: '#555555',
  light: '#888888',
  border: '#dddddd',
  bg: '#f7f9fc',
};

const s = StyleSheet.create({
  page:         { fontFamily: 'Helvetica', fontSize: 10, color: C.black, paddingHorizontal: 44, paddingVertical: 40, lineHeight: 1.45 },
  // Header
  headerName:   { fontSize: 22, fontFamily: 'Helvetica-Bold', color: C.black, marginBottom: 3 },
  headerTitle:  { fontSize: 11, color: C.accent, marginBottom: 6 },
  headerMeta:   { flexDirection: 'row', flexWrap: 'wrap', gap: 4, fontSize: 8.5, color: C.muted },
  headerSep:    { color: C.border, marginHorizontal: 4 },
  // Sections
  section:      { marginTop: 14 },
  sectionTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.accent, textTransform: 'uppercase', letterSpacing: 1.2, borderBottomWidth: 1, borderBottomColor: C.border, paddingBottom: 3, marginBottom: 8 },
  // Company block
  companyRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 1 },
  companyName:  { fontSize: 10.5, fontFamily: 'Helvetica-Bold' },
  companyLoc:   { fontSize: 8.5, color: C.muted },
  // Role block
  roleRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 },
  roleTitle:    { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: C.muted },
  period:       { fontSize: 8.5, color: C.light },
  bullet:       { flexDirection: 'row', marginTop: 2.5, paddingLeft: 2 },
  bulletDot:    { width: 10, color: C.accent, fontSize: 9 },
  bulletText:   { flex: 1, fontSize: 9, color: '#333333', lineHeight: 1.5 },
  divider:      { borderTopWidth: 0.5, borderTopColor: C.border, marginTop: 7, marginBottom: 3 },
  // Education
  eduRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 1 },
  eduInst:      { fontSize: 10, fontFamily: 'Helvetica-Bold', flex: 1, marginRight: 8 },
  eduLoc:       { fontSize: 8.5, color: C.muted },
  degreeRow:    { flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 },
  degreeTitle:  { fontSize: 9.5 },
  degreeField:  { fontSize: 8.5, color: C.muted },
  distinction:  { fontSize: 8, color: '#b07d00', marginTop: 1 },
  note:         { fontSize: 8, color: C.light, fontStyle: 'italic', marginTop: 3 },
  // Certs
  certRow:      { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  certDot:      { width: 10, color: C.accent, fontSize: 9 },
  certText:     { fontSize: 9 },
  // Skills
  skillRow:     { flexDirection: 'row', marginBottom: 3.5 },
  skillKey:     { fontFamily: 'Helvetica-Bold', fontSize: 9, width: 160 },
  skillVal:     { flex: 1, fontSize: 9, color: '#333333' },
});

function Header() {
  return (
    <View>
      <Text style={s.headerName}>{profile.name}</Text>
      <Text style={s.headerTitle}>{profile.title}</Text>
      <View style={s.headerMeta}>
        <Text>{profile.location}</Text>
        <Text style={s.headerSep}>·</Text>
        <Link src={`mailto:${profile.email}`}><Text>{profile.email}</Text></Link>
        <Text style={s.headerSep}>·</Text>
        <Text>{profile.phone}</Text>
        <Text style={s.headerSep}>·</Text>
        <Link src={`https://${profile.linkedin}`}><Text>{profile.linkedin}</Text></Link>
        <Text style={s.headerSep}>·</Text>
        <Link src={`https://${profile.github}`}><Text>{profile.github}</Text></Link>
      </View>
    </View>
  );
}

function Summary() {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>Summary</Text>
      <Text style={{ fontSize: 9, color: '#333333', lineHeight: 1.55 }}>{profile.summary}</Text>
    </View>
  );
}

function Experience() {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>Experience</Text>
      {experiences.map((exp, i) => {
        const start = exp.roles[exp.roles.length - 1].period.split('–')[0].trim();
        const end   = exp.roles[0].period.split('–')[1].trim();
        return (
          <View key={i} style={i > 0 ? { marginTop: 10 } : {}}>
            <View style={s.companyRow}>
              <Text style={s.companyName}>{exp.company}</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {exp.location && <Text style={s.companyLoc}>{exp.location}</Text>}
                <Text style={s.period}>{start} – {end}</Text>
              </View>
            </View>
            {exp.roles.map((r, j) => (
              <View key={j}>
                {exp.roles.length > 1 && (
                  <View style={j > 0 ? [s.roleRow, { marginTop: 6 }] : s.roleRow}>
                    <Text style={s.roleTitle}>{r.role}</Text>
                    <Text style={s.period}>{r.period}</Text>
                  </View>
                )}
                {exp.roles.length === 1 && (
                  <View style={s.roleRow}>
                    <Text style={s.roleTitle}>{r.role}</Text>
                    {r.location && <Text style={s.companyLoc}>{r.location}</Text>}
                  </View>
                )}
                {r.bullets.map((b, k) => (
                  <View key={k} style={s.bullet}>
                    <Text style={s.bulletDot}>›</Text>
                    <Text style={s.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}

function Education() {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>Education</Text>
      {schools.map((school, i) => (
        <View key={i} style={i > 0 ? { marginTop: 8 } : {}}>
          <View style={s.eduRow}>
            <Text style={s.eduInst}>{school.institution}</Text>
            <Text style={s.eduLoc}>{school.location}</Text>
          </View>
          {school.degrees.map((d, j) => (
            <View key={j} style={s.degreeRow}>
              <View>
                <Text style={s.degreeTitle}>{d.title} — {d.field}</Text>
                {d.distinction && <Text style={s.distinction}>{d.distinction}</Text>}
              </View>
              <Text style={s.period}>{d.period}</Text>
            </View>
          ))}
          {school.note && <Text style={s.note}>{school.note}</Text>}
        </View>
      ))}
    </View>
  );
}

function Certifications() {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>Certifications</Text>
      {profile.certifications.map((c, i) => (
        <View key={i} style={s.certRow}>
          <Text style={s.certDot}>›</Text>
          <Text style={s.certText}>{c.name} <Text style={{ color: C.light }}>({c.id})</Text></Text>
        </View>
      ))}
    </View>
  );
}

function Skills() {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>Technical Skills</Text>
      {Object.entries(profile.skills).map(([key, val], i) => (
        <View key={i} style={s.skillRow}>
          <Text style={s.skillKey}>{key}</Text>
          <Text style={s.skillVal}>{val}</Text>
        </View>
      ))}
    </View>
  );
}

const Resume = () => (
  <Document title={`${profile.name} — Resume`} author={profile.name}>
    <Page size="LETTER" style={s.page}>
      <Header />
      <Summary />
      <Experience />
      <Education />
      <Certifications />
      <Skills />
    </Page>
  </Document>
);

const outPath = path.resolve(process.cwd(), 'public', 'resume.pdf');

renderToFile(<Resume />, outPath)
  .then(() => console.log(`✓ resume.pdf generated → ${outPath}`))
  .catch((err: Error) => { console.error('✗ resume generation failed:', err.message); process.exit(1); });
