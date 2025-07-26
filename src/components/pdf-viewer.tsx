
"use client";

import React from 'react';
import { Frown, Loader2 } from 'lucide-react';
import type { Subject } from '@/hooks/use-unlock-store';

export default function PDFViewer({ subjectName, pdfUrlOverride }: { subjectName: Subject | string, pdfUrlOverride?: string }) {
    const pdfUrl = pdfUrlOverride;

    return (
        <div 
            className="flex flex-col h-full w-full bg-background text-foreground"
        >
            <header className="flex items-center justify-center p-2 border-b shrink-0 relative">
                <h1 className="text-lg font-bold font-headline capitalize text-center">
                    {subjectName.replace('-', ' ')} Study Material
                </h1>
            </header>
            
            <main className="flex-grow overflow-hidden relative flex justify-center items-center bg-gray-200 dark:bg-gray-800">
                {!pdfUrl || pdfUrl.includes('REPLACE_WITH') ? (
                     <div className="text-center text-muted-foreground p-8">
                         <Frown className="h-16 w-16 mx-auto mb-4" />
                         <h2 className="text-2xl font-headline text-foreground">Content Not Available</h2>
                         <p>The study materials for this subject have not been configured yet.</p>
                         <p className="text-sm mt-2">Please replace the placeholder link in <code className="bg-muted px-1 py-0.5 rounded">src/lib/chapters.ts</code>.</p>
                     </div>
                ) : (
                    <iframe
                        src={pdfUrl}
                        className="w-full h-full border-0"
                        title={`${subjectName} PDF Viewer`}
                        // Security sandbox to prevent downloads, printing, etc.
                        sandbox="allow-scripts allow-same-origin"
                    >
                         <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-20">
                            <div className="text-center text-muted-foreground">
                                <Loader2 className="h-12 w-12 mx-auto animate-spin mb-4 text-primary" />
                                <h2 className="text-xl font-headline text-foreground">Loading Study Material...</h2>
                                <p>Your browser may not support embedded previews.</p>
                            </div>
                        </div>
                    </iframe>
                )}
            </main>
            
            <footer className="text-center text-xs text-muted-foreground p-2 border-t shrink-0 flex items-center justify-between">
                <div>
                   <p className='font-bold'>StudyUnlock</p>
                   <p>Content is protected.</p>
                </div>
                <div className="w-40 text-right">
                    <p>Downloading and distribution</p>
                    <p>are prohibited.</p>
                </div>
            </footer>
        </div>
    );
}
