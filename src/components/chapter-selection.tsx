
"use client";

import React, { useState, useRef, type ElementType, lazy } from 'react';
import type { Subject } from '@/hooks/use-unlock-store';
import { allSubjectChapters, type Chapter, type Section } from '@/lib/chapters';
import { Button } from './ui/button';
import { ArrowLeft, FlaskConical, Dna, Atom, Sigma, Landmark, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import StarfieldBackground from './starfield-background';
import { playSound } from '@/lib/audio';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('./pdf-viewer'), { 
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-20">
            <div className="text-center text-muted-foreground">
                <Loader2 className="h-12 w-12 mx-auto animate-spin mb-4 text-primary" />
                <h2 className="text-xl font-headline text-foreground">Preparing Viewer...</h2>
                <p>Please wait a moment.</p>
            </div>
        </div>
    )
});


const SectionCard = ({ section, onSelect, icon: IconComponent }: { section: Section, onSelect: (chapter: Chapter) => void, icon: ElementType }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const bgX = ((e.clientX - left) / width) * 100;
        const bgY = ((e.clientY - top) / height) * 100;
        cardRef.current.style.setProperty('--mouse-x', `${bgX}%`);
        cardRef.current.style.setProperty('--mouse-y', `${bgY}%`);
    };
    
    // For single-chapter sections, we go directly to the content.
    // For multi-chapter sections, this could be adapted to show a chapter list.
    const chapterToSelect = section.chapters[0];
    
    const handleClick = () => {
        playSound('/sounds/click.mp3');
        onSelect(chapterToSelect);
    };

    return (
        <motion.div
            style={{ transform: 'rotateX(var(--rx)) rotateY(var(--ry))' }}
            className="w-full h-80 [perspective:1000px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card
                ref={cardRef}
                onClick={handleClick}
                onMouseMove={handleMouseMove}
                className={cn(
                    "relative w-full h-full p-0 transition-transform duration-300 ease-out group glass-card shadow-lg hover:shadow-2xl",
                    "transform-style-3d",
                    "will-change-transform",
                    "cursor-pointer hover:border-primary/50"
                )}
            >
                <div className="absolute inset-0 card-highlight-bg opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                <div className="flex flex-col items-center justify-center text-center h-full p-6 [transform:translateZ(40px)]">
                    <IconComponent className="h-20 w-20 text-primary transition-transform duration-300 group-hover:scale-125 group-hover:[filter:drop-shadow(0_0_8px_hsl(var(--primary)))]" />
                    <CardHeader className="p-0 mt-4">
                        <CardTitle className="font-headline text-3xl font-bold">{section.name}</CardTitle>
                    </CardHeader>
                    <p className="text-muted-foreground mt-2 text-sm">
                        View Study Material
                    </p>
                </div>
            </Card>
        </motion.div>
    );
}

const ChapterButtonCard = ({ chapter, onSelect }: { chapter: Chapter, onSelect: (chapter: Chapter) => void }) => {
    const handleClick = () => {
        playSound('/sounds/click.mp3');
        onSelect(chapter);
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 100 }}
            whileHover={{ scale: 1.05 }}
        >
            <Button 
                variant="outline" 
                className="w-full h-24 text-lg font-semibold glass-card hover:bg-primary/10 border-primary/20" 
                onClick={handleClick}
            >
                {chapter.name}
            </Button>
        </motion.div>
    );
};

export default function ChapterSelection({ subjectName, onBack }: { subjectName: Subject, onBack: () => void }) {
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
    const subjectData = allSubjectChapters[subjectName];

    const ICONS: Record<string, ElementType> = {
        chemistry: FlaskConical,
        biology: Dna,
        physics: Atom,
        math: Sigma,
        'social-studies': Landmark
    };

    const handleBackFromPdf = () => {
        playSound('/sounds/click.mp3');
        setSelectedChapter(null);
    }
    
    const handleBackToSubjects = () => {
        playSound('/sounds/click.mp3');
        onBack();
    }

    if (selectedChapter) {
        return (
            <div className="h-screen w-screen bg-background relative">
                <Button
                    variant="ghost"
                    onClick={handleBackFromPdf}
                    className="absolute top-2 left-2 z-20 bg-background/80 hover:bg-background flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Chapters
                </Button>
                <PDFViewer subjectName={selectedChapter.name as Subject} pdfUrlOverride={selectedChapter.pdfUrl} />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen w-screen bg-background text-foreground relative">
            <StarfieldBackground />
            <header className="flex items-center justify-between p-4 border-b shrink-0 relative z-10 bg-background/50 backdrop-blur-sm">
                 <Button
                    variant="ghost"
                    onClick={handleBackToSubjects}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Subjects
                </Button>
                <h1 className="text-2xl font-bold font-headline capitalize">
                    {subjectData.name}
                </h1>
                <div className="w-24"></div> 
            </header>

            <main className="flex-grow p-4 md:p-6 overflow-y-auto z-10">
                <div className={cn(
                    "grid gap-8 w-full max-w-5xl mx-auto pt-4", 
                    subjectData.id === 'science' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                )}>
                    {subjectData.id === 'science' ? (
                        subjectData.sections.map(section => (
                            <SectionCard key={section.id} section={section} onSelect={setSelectedChapter} icon={ICONS[section.id]} />
                        ))
                    ) : (
                        subjectData.sections.flatMap(section =>
                            section.chapters.map(chapter => (
                                <ChapterButtonCard key={chapter.id} chapter={chapter} onSelect={setSelectedChapter} />
                            ))
                        )
                    )}
                </div>
            </main>
        </div>
    );
}
