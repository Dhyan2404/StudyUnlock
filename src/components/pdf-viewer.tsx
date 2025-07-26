
"use client";

import React, { useState } from 'react';
import { FileText, Loader2, Frown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Subject } from '@/hooks/use-unlock-store';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useToast } from '@/hooks/use-toast';

// Set up worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


export default function PDFViewer({ subjectName, pdfUrlOverride }: { subjectName: Subject | string, pdfUrlOverride?: string }) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const pdfUrl = pdfUrlOverride;
    const { toast } = useToast();

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1);
        setIsLoading(false);
    }
    
    function onDocumentLoadError(error: Error) {
        console.error("Failed to load PDF", error);
        setIsLoading(false);
        toast({
            title: "Error Loading PDF",
            description: "There was a problem loading the study material. Please try again later.",
            variant: "destructive"
        })
    }

    const goToPreviousPage = () => {
        setPageNumber(prev => Math.max(prev - 1, 1));
    }

    const goToNextPage = () => {
        setPageNumber(prev => Math.min(prev + 1, numPages || 1));
    }

    const onPageRenderSuccess = () => {
        // This is a bit of a hack to remove the text layer that makes text selectable
        const textLayers = document.querySelectorAll('.react-pdf__Page__textLayer');
        textLayers.forEach(layer => {
            const htmlLayer = layer as HTMLElement;
            htmlLayer.style.display = 'none';
        });
    }

    return (
        <div 
            className="flex flex-col h-full w-full bg-background text-foreground"
            onContextMenu={(e) => e.preventDefault()} // Basic screenshot prevention
        >
            <header className="flex items-center justify-center p-2 border-b shrink-0 relative">
                <h1 className="text-lg font-bold font-headline capitalize text-center">
                    {subjectName.replace('-', ' ')} Study Material
                </h1>
            </header>
            
            <main className="flex-grow p-0 md:p-1 overflow-hidden relative flex justify-center items-start">
                 {(isLoading || !pdfUrl) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-20">
                        <div className="text-center text-muted-foreground">
                            {pdfUrl ? (
                                <>
                                    <Loader2 className="h-12 w-12 mx-auto animate-spin mb-4 text-primary" />
                                    <h2 className="text-xl font-headline text-foreground">Loading Study Material...</h2>
                                    <p>Please wait a moment.</p>
                                </>
                            ) : (
                                <>
                                    <Frown className="h-16 w-16 mx-auto mb-4" />
                                    <h2 className="text-2xl font-headline text-foreground">Content Coming Soon</h2>
                                    <p>The study materials for this subject are being prepared.</p>
                                </>
                            )}
                        </div>
                    </div>
                 )}

                {pdfUrl && (
                   <div className="h-full w-full overflow-y-auto">
                        <Document
                            file={pdfUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                            options={{
                                cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
                                cMapPacked: true,
                            }}
                            className="flex flex-col items-center gap-4 py-4"
                        >
                           {Array.from(new Array(numPages || 0), (el, index) => (
                                <div key={`page_${index + 1}`} className="shadow-lg" onContextMenu={(e) => e.preventDefault()}>
                                     <Page 
                                        pageNumber={index + 1}
                                        renderTextLayer={true} // We render it then hide it to improve page rendering quality
                                        onRenderSuccess={onPageRenderSuccess}
                                        width={Math.min(window.innerWidth * 0.9, 800)}
                                    />
                                </div>
                            ))}
                        </Document>
                   </div>
                )}
            </main>
            
            <footer className="text-center text-xs text-muted-foreground p-2 border-t shrink-0 flex items-center justify-between">
                <div>
                   <p className='font-bold'>StudyUnlock</p>
                   <p>Content is protected.</p>
                </div>
                 {numPages && (
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={goToPreviousPage} disabled={pageNumber <= 1}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">
                            Page {pageNumber} of {numPages}
                        </span>
                        <Button variant="outline" size="icon" onClick={goToNextPage} disabled={pageNumber >= numPages}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                <div className="w-40 text-right">
                    <p>Downloading and distribution</p>
                    <p>are prohibited.</p>
                </div>
            </footer>
        </div>
    );
}
