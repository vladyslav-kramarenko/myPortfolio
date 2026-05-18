export type Degree = { title: string; field: string; period: string; distinction?: string | null };
export type CertLink = { label: string; url: string };
export type School = { institution: string; location: string; url?: string; degrees: Degree[]; note: string | string[] | null; certLinks?: CertLink[] };

export const schools: School[] = [
  {
    institution: 'National Technical University "Kharkiv Polytechnic Institute"',
    location: 'Kharkiv, Ukraine',
    url: 'https://www.kpi.kharkov.ua/eng/',
    degrees: [
      { title: "Master's Degree", field: 'Project Management', period: '2013 – 2015', distinction: 'Graduated with Honors' },
      { title: "Bachelor's Degree", field: 'Computer Science',  period: '2009 – 2013', distinction: null },
    ],
    note: 'Both theses centred on the same project: a Java-based simulation tool for forecasting industrial development, built jointly with one other student. During the Bachelor\'s program, also built a web interface for remotely piloting Arduino-controlled cars with live video feed — Java, Spring, JSP, Maven backend; HTML, CSS, JavaScript, jQuery frontend (2011–2012).',
  },
  {
    institution: 'O.M. Beketov National University of Urban Economy',
    location: 'Kharkiv, Ukraine',
    url: 'https://en.kname.edu.ua/',
    degrees: [
      { title: 'PhD Candidate', field: 'Computer Science', period: '2020 – 2022', distinction: null },
    ],
    note: 'Studies discontinued — relocated to Canada following the 2022 invasion of Ukraine.',
  },
  {
    institution: 'EPAM Systems — University Programs',
    location: 'Remote',
    url: 'https://www.epam.com',
    degrees: [
      { title: 'Java, AWS & IT Marathons', field: 'Eight programs across a decade — backend, cloud & full-stack', period: '2014 – 2024', distinction: 'Merit invitation to EPAM internal hiring track (2024)' },
    ],
    note: [
      'Eight programs across a decade: Java Laboratory (2014–2015) · Java Spring-Summer 2022 (196 h, certified) · IT Marathon (Nov–Dec 2022) · AWS Cloud Practitioner Essentials (Feb–Mar 2023) · Developing on AWS (Oct 2023) · Mentoring Track (2023) · IT Marathon 3.0 (40 h, Nov–Dec 2023) · IT Marathon 4.0 (60 h, Oct 2024, physical prize).',
      'The AWS courses — completed during the Canada relocation period — fed directly into 3 AWS certifications earned within 4 months of starting the next role: Cloud Practitioner (Aug 2023), Solutions Architect – Associate (Nov 2023), Developer – Associate (Dec 2023).',
      'Mentoring project: rebuilt a tax service API first in plain Java, then in Spring Boot — deliberately, to understand the architectural difference hands-on — with a Jenkins CI/CD pipeline throughout.',
      'IT Marathons covered the full delivery cycle — requirements through cloud deployment — in intensive team challenges. After top results in the external Java Laboratory, received a personal invitation to join EPAM\'s internal training program with a job offer track.',
    ],
    certLinks: [
      { label: 'Java Spring-Summer 2022', url: 'https://certificates.epam.com/certificates/121ef58b-c16f-4eb1-816f-aa715cbec7d0' },
      { label: 'IT Marathon (2022)', url: 'https://certificates.epam.com/certificates/ffbe8999-875d-48f6-b8cc-6b62e4575c25' },
    ],
  },
];
