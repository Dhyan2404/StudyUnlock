
export type Chapter = {
  id: string;
  name: string;
  pdfUrl: string;
};

export type Section = {
  id: string;
  name: string;
  chapters: Chapter[];
};

export type SubjectChapters = {
  id: 'science' | 'math' | 'social-studies';
  name: string;
  sections: Section[];
};

const scienceChapters: SubjectChapters = {
  id: 'science',
  name: 'Science',
  sections: [
    {
      id: 'chemistry',
      name: 'Chemistry',
      chapters: [{
        id: 'chem-main',
        name: 'Chemistry',
        pdfUrl: '/science/chemistry.pdf'
      }],
    },
    {
      id: 'biology',
      name: 'Biology',
      chapters: [{
        id: 'bio-main',
        name: 'Biology',
        pdfUrl: '/science/biology.pdf'
      }],
    },
    {
      id: 'physics',
      name: 'Physics',
      chapters: [{
        id: 'phy-main',
        name: 'Physics',
        pdfUrl: '/science/physics.pdf'
      }],
    },
  ],
};

const mathChapters: SubjectChapters = {
  id: 'math',
  name: 'Math',
  sections: [
    {
      id: 'main',
      name: 'Chapters',
      chapters: Array.from({ length: 14 }, (_, i) => ({
        id: `ch-${i + 1}`,
        name: `Chapter ${i + 1}`,
        pdfUrl: `/math/ch${i + 1}.pdf`,
      })),
    },
  ],
};

const socialStudiesChapters: SubjectChapters = {
  id: 'social-studies',
  name: 'Social Studies',
  sections: [
    {
      id: 'main',
      name: 'Chapters',
      chapters: Array.from({ length: 22 }, (_, i) => ({
        id: `ch-${i + 1}`,
        name: `Chapter ${i + 1}`,
        pdfUrl: `/ss/ch${i + 1}.pdf`,
      })),
    },
  ],
};

export const allSubjectChapters: Record<
  'science' | 'math' | 'social-studies',
  SubjectChapters
> = {
  science: scienceChapters,
  math: mathChapters,
  'social-studies': socialStudiesChapters,
};
