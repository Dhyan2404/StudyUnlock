
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

// Replace these placeholder IDs with your actual Google Drive File IDs
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
        pdfUrl: 'https://drive.google.com/file/d/1V1s8ntf27q7VyymxaQSYNR0EkOX6WCwP/preview'
      }],
    },
    {
      id: 'biology',
      name: 'Biology',
      chapters: [{
        id: 'bio-main',
        name: 'Biology',
        pdfUrl: 'https://drive.google.com/file/d/1TsQvff4Fr75OivpahlQ7hHOnvi1sLCtn/preview'
      }],
    },
    {
      id: 'physics',
      name: 'Physics',
      chapters: [{
        id: 'phy-main',
        name: 'Physics',
        pdfUrl: 'https://drive.google.com/file/d/1m311G9NhlVVCCnoUvPIhj-TnbfMIIrFD/preview'
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
        // Note: You will need to replace the ID for each chapter
        pdfUrl: `https://drive.google.com/file/d/REPLACE_WITH_MATH_CH${i+1}_FILE_ID/preview`,
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
         // Note: You will need to replace the ID for each chapter
        pdfUrl: `https://drive.google.com/file/d/REPLACE_WITH_SS_CH${i+1}_FILE_ID/preview`,
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
