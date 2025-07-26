
"use client";

import { useState, type ElementType, useCallback, useRef } from 'react';
import { Beaker, CheckCircle, Landmark, Lock, Sigma, KeyRound, Dna, Atom, FlaskConical } from 'lucide-react';
import { useUnlockStore, type Subject, ALL_SUBJECTS } from '@/hooks/use-unlock-store';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent as OriginalDialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Confetti from 'react-confetti';
import ChapterSelection from './chapter-selection';
import { FramelessDialog, FramelessDialogContent } from './ui/frameless-dialog';
import { motion, Variants } from 'framer-motion';
import { playSound } from '@/lib/audio';


type SubjectInfo = {
  id: Subject;
  name: string;
  icon: ElementType;
  color: string;
  glowColor: string;
};

const subjects: SubjectInfo[] = [
  { id: 'science', name: 'Science', icon: Beaker, color: 'hover:border-emerald-500/50', glowColor: 'shadow-emerald-500/50 border-emerald-500/80' },
  { id: 'math', name: 'Math', icon: Sigma, color: 'hover:border-sky-500/50', glowColor: 'shadow-sky-500/50 border-sky-500/80' },
  { id: 'social-studies', name: 'Social Studies', icon: Landmark, color: 'hover:border-amber-500/50', glowColor: 'shadow-amber-500/50 border-amber-500/80' },
];

function UnlockDialog({ subject, isOpen, onOpenChange, onUnlockSuccess }: { subject: SubjectInfo, isOpen: boolean, onOpenChange: (open: boolean) => void, onUnlockSuccess: (subjectId: Subject | 'all') => void }) {
  const [code, setCode] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [animationState, setAnimationState] = useState<'idle' | 'shaking' | 'falling'>('idle');
  const { unlockSubject } = useUnlockStore();
  const { toast } = useToast();

  const handleUnlock = async () => {
    setAnimationState('idle');
    setIsUnlocking(true);
    const { success, subject: unlockedSubjectValue } = await unlockSubject(code);
    setIsUnlocking(false);

    if (success && unlockedSubjectValue) {
        const subjectId = subject.id;
        const unlockedAll = unlockedSubjectValue === 'all';
        const unlockedSpecific = unlockedSubjectValue === subjectId || unlockedSubjectValue.replace('-', '') === subjectId.replace('-', '');

        if(unlockedAll || unlockedSpecific) {
            playSound('/sounds/click.mp3'); // Success sound
            onUnlockSuccess(unlockedAll ? 'all' : subject.id);
            onOpenChange(false);
            setCode('');
        } else {
             triggerFailureAnimation();
        }
    } else {
      triggerFailureAnimation();
      toast({
        title: "Unlock Failed",
        description: "The code you entered is invalid or has already been used. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const triggerFailureAnimation = () => {
        playSound('/sounds/click.mp3'); // Error sound
        setAnimationState('shaking');
        setTimeout(() => {
          setAnimationState('falling');
          setTimeout(() => {
            setCode(''); // Clear the input after animation
            setAnimationState('idle');
          }, 1000); // Duration of the fall animation + cascade
        }, 500); // Duration of the shake animation
  };
  
  const displayCode = animationState === 'falling' ? '' : code;
  const fallingCodeArray = Array.from({ length: code.length }, () => '*');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <OriginalDialogContent className="glass-card" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Unlock {subject.name}</DialogTitle>
        </DialogHeader>
        <motion.div
            animate={animationState === 'shaking' ? { x: [0, -10, 10, -10, 10, -5, 5, 0] } : { x: 0 }}
            transition={{ type: "spring", stiffness: 800, damping: 15, duration: 0.5 }}
        >
            <DialogDescription>Enter your one-time code to view the study materials for this subject.</DialogDescription>
            <div className="space-y-2 mt-4">
                <div className="relative h-10 w-full">
                  <Input 
                    placeholder="Enter unlock code"
                    value={displayCode}
                    onChange={(e) => setCode(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && !isUnlocking && handleUnlock()}
                    disabled={isUnlocking}
                    className={cn(
                      "transition-all text-center font-bold tracking-widest",
                      animationState === 'shaking' && "border-destructive",
                      animationState === 'falling' && "text-transparent caret-transparent"
                    )}
                  />
                  {animationState === 'falling' && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-center font-bold tracking-widest text-destructive overflow-hidden">
                          {fallingCodeArray.map((char, index) => (
                            <motion.span
                                key={index}
                                initial={{ y: 0, opacity: 1 }}
                                animate={{ y: 40, opacity: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.05,
                                    ease: 'easeIn'
                                }}
                                style={{display: 'inline-block'}}
                            >
                                {char}
                            </motion.span>
                          ))}
                      </div>
                  )}
                </div>

              {animationState !== 'idle' && <p className="text-sm font-semibold text-destructive text-center animate-pulse">Invalid Code. Please try again!</p>}
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={handleUnlock} disabled={isUnlocking}>
                {isUnlocking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Unlock
              </Button>
            </DialogFooter>
        </motion.div>
      </OriginalDialogContent>
    </Dialog>
  );
}

function MasterUnlockDialog({ isOpen, onOpenChange, onUnlockSuccess }: { isOpen: boolean, onOpenChange: (open: boolean) => void, onUnlockSuccess: (subjectId: 'all') => void }) {
    const [code, setCode] = useState('');
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [animationState, setAnimationState] = useState<'idle' | 'shaking' | 'falling'>('idle');
    const { unlockSubject } = useUnlockStore();
    const { toast } = useToast();


    const handleUnlock = async () => {
        setAnimationState('idle');
        setIsUnlocking(true);
        const { success, subject: unlockedSubjectValue } = await unlockSubject(code);
        setIsUnlocking(false);

        if (success && unlockedSubjectValue === 'all') {
            playSound('/sounds/click.mp3');
            onUnlockSuccess('all');
            onOpenChange(false);
            setCode('');
        } else {
            triggerFailureAnimation();
            if (success) {
                 toast({
                    title: "Not a Master Code",
                    description: "This code is for a specific subject, not all subjects.",
                    variant: "destructive"
                });
            } else {
                toast({
                  title: "Unlock Failed",
                  description: "The master code you entered is invalid or has already been used.",
                  variant: "destructive",
                });
            }
        }
    };
    
    const triggerFailureAnimation = () => {
        playSound('/sounds/click.mp3'); // Error sound
        setAnimationState('shaking');
        setTimeout(() => {
          setAnimationState('falling');
          setTimeout(() => {
            setCode(''); // Clear the input after animation
            setAnimationState('idle');
          }, 1000); // Duration of the fall animation + cascade
        }, 500); // Duration of the shake animation
    };

    const displayCode = animationState === 'falling' ? '' : code;
    const fallingCodeArray = Array.from({ length: code.length }, () => '*');


    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <OriginalDialogContent className="glass-card" onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Enter Master Code</DialogTitle>
                </DialogHeader>
                 <motion.div
                    animate={animationState === 'shaking' ? { x: [0, -10, 10, -10, 10, -5, 5, 0] } : { x: 0 }}
                    transition={{ type: "spring", stiffness: 800, damping: 15, duration: 0.5 }}
                >
                    <DialogDescription>A master code will unlock all subjects at once.</DialogDescription>
                    <div className="space-y-2 mt-4">
                      <div className="relative h-10 w-full">
                          <Input
                              placeholder="Enter master code"
                              value={displayCode}
                              onChange={(e) => setCode(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && !isUnlocking && handleUnlock()}
                              disabled={isUnlocking}
                              className={cn(
                                "transition-all text-center font-bold tracking-widest",
                                animationState === 'shaking' && "border-destructive",
                                animationState === 'falling' && "text-transparent caret-transparent"
                              )}
                          />
                          {animationState === 'falling' && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-center font-bold tracking-widest text-destructive overflow-hidden">
                                  {fallingCodeArray.map((char, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ y: 0, opacity: 1 }}
                                        animate={{ y: 40, opacity: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: index * 0.05,
                                            ease: 'easeIn'
                                        }}
                                        style={{display: 'inline-block'}}
                                    >
                                        {char}
                                    </motion.span>
                                  ))}
                              </div>
                          )}
                      </div>
                       {animationState !== 'idle' && <p className="text-sm font-semibold text-destructive text-center animate-pulse">Invalid Code. Please try again!</p>}
                    </div>
                    <DialogFooter className="mt-4">
                        <Button onClick={handleUnlock} disabled={isUnlocking}>
                            {isUnlocking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Unlock All
                        </Button>
                    </DialogFooter>
                </motion.div>
            </OriginalDialogContent>
        </Dialog>
    )
}

const cardContentVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 1,
        }
    }
}

const contentItemVariants = (index: number): Variants => {
    const direction = [
        { x: -50, opacity: 0 }, // science from left
        { x: 50, opacity: 0 },  // math from right
        { y: 50, opacity: 0 },  // social studies from bottom
    ][index] || { y: 20, opacity: 0 };
    
    return {
        hidden: direction,
        visible: {
            x: 0,
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                damping: 12,
                stiffness: 100,
            }
        }
    }
};


function SubjectCard({ subject, index, isUnlocked, onUnlockSuccess, itemVariants }: { subject: SubjectInfo, index: number, isUnlocked: boolean, onUnlockSuccess: (subjectId: Subject | 'all') => void, itemVariants: Variants }) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [isChapterSelectionOpen, setChapterSelectionOpen] = useState(false);
  const [sourceBounds, setSourceBounds] = useState<DOMRect | null>(null);


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const bgX = ((e.clientX - left) / width) * 100;
    const bgY = ((e.clientY - top) / height) * 100;
    cardRef.current.style.setProperty('--mouse-x', `${bgX}%`);
    cardRef.current.style.setProperty('--mouse-y', `${bgY}%`);
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    playSound('/sounds/click.mp3');
    if (isUnlocked) {
      setSourceBounds(e.currentTarget.getBoundingClientRect());
      setChapterSelectionOpen(true);
    } else {
      setDialogOpen(true);
    }
  };
  
  const CardContentWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div
            onClick={handleCardClick}
            role="button"
            tabIndex={0}
            className={cn(
                "relative w-full h-full p-0 transition-transform duration-300 ease-out group glass-card shadow-lg hover:shadow-2xl",
                "transform-style-3d",
                "will-change-transform",
                !isUnlocked && subject.color,
                isUnlocked && subject.glowColor,
                isUnlocked && "shadow-xl"
            )}
            onMouseMove={handleMouseMove}
            ref={cardRef}
        >
            {children}
        </div>
    );
  };
  
  return (
    <>
        <motion.div 
            style={{ transform: 'rotateX(var(--rx)) rotateY(var(--ry))' }}
            className="w-full h-full [perspective:1000px]"
        >
            <motion.div
                variants={itemVariants}
                className="h-full w-full"
                whileInView={{ filter: 'blur(0px)' }}
                initial={{ filter: 'blur(20px)'}}
                transition={{
                    duration: 0.6,
                    ease: 'easeOut',
                }}
            >
                <CardContentWrapper>
                    <div className="absolute inset-0 card-highlight-bg opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    <motion.div 
                        className="flex flex-col items-center justify-center text-center h-full p-6 [transform:translateZ(40px)]"
                        variants={cardContentVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div ref={iconRef} className="relative mb-4" variants={contentItemVariants(index)}>
                            <subject.icon className="h-16 w-16 text-primary transition-transform duration-300 group-hover:scale-125 group-hover:[filter:drop-shadow(0_0_8px_hsl(var(--primary)))]" />
                            <div className="absolute -top-1 -right-1 bg-background rounded-full p-1 shadow-md">
                                {isUnlocked ? <CheckCircle className="h-6 w-6 text-emerald-500" /> : <Lock className="h-6 w-6 text-muted-foreground" />}
                            </div>
                        </motion.div>
                        <motion.div variants={contentItemVariants(index)}>
                            <CardHeader className="p-0">
                                <CardTitle className="font-headline text-2xl font-bold">{subject.name}</CardTitle>
                            </CardHeader>
                        </motion.div>
                        <motion.p variants={contentItemVariants(index)} className="text-muted-foreground mt-2 text-sm">
                            {isUnlocked ? 'View Chapters' : 'Locked'}
                        </motion.p>
                    </motion.div>
                </CardContentWrapper>
            </motion.div>
        </motion.div>

        <FramelessDialog open={isChapterSelectionOpen} onOpenChange={setChapterSelectionOpen}>
            {isUnlocked && (
                <FramelessDialogContent sourceBounds={sourceBounds}>
                    <ChapterSelection subjectName={subject.id} onBack={() => setChapterSelectionOpen(false)} />
                </FramelessDialogContent>
            )}
        </FramelessDialog>

      {!isUnlocked && <UnlockDialog subject={subject} isOpen={isDialogOpen} onOpenChange={setDialogOpen} onUnlockSuccess={onUnlockSuccess} />}
    </>
  );
}

function CardSkeleton() {
    return (
        <Card className="w-full h-full">
            <div className="flex flex-col items-center justify-center text-center h-full p-6">
                <Skeleton className="h-16 w-16 rounded-full mb-4" />
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
            </div>
        </Card>
    );
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0,
    },
  },
};

const directionalItemVariants = (index: number): Variants => {
  const directions = [
    { x: -200, opacity: 0 }, // science from left
    { y: 200, opacity: 0 },  // math from bottom
    { x: 200, opacity: 0 },  // social studies from right
  ];

  return {
    hidden: directions[index] || { opacity: 0 },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 40,
        restDelta: 0.001
      },
    },
  };
};

export default function SubjectSelection({ isTitleAnimationComplete }: { isTitleAnimationComplete: boolean }) {
  const { isInitialized, unlockedSubjects } = useUnlockStore();
  const [justUnlocked, setJustUnlocked] = useState<Subject | 'all' | null>(null);
  const [isMasterDialogOpen, setMasterDialogOpen] = useState(false);
  const allUnlocked = unlockedSubjects.length === ALL_SUBJECTS.length;

  const handleUnlockSuccess = useCallback((subjectId: Subject | 'all') => {
    setJustUnlocked(subjectId);
    setTimeout(() => {
        setJustUnlocked(null);
    }, 5000); // Confetti lasts for 5 seconds
  }, []);

  const handleMasterCodeClick = () => {
    playSound('/sounds/click.mp3');
    setMasterDialogOpen(true);
  }

  return (
    <>
      {justUnlocked && <Confetti recycle={false} numberOfPieces={justUnlocked === 'all' ? 800 : 400} gravity={0.1} />}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl"
        variants={containerVariants}
        initial="hidden"
        animate={isTitleAnimationComplete ? "visible" : "hidden"}
      >
        {subjects.map((subject, index) => (
          <motion.div 
              key={subject.id} 
              className="h-80 w-full" 
              variants={directionalItemVariants(index)}
              style={{ transformStyle: 'preserve-3d' }}
          >
            {!isInitialized ? (
              <CardSkeleton />
            ) : (
              <SubjectCard 
                subject={subject} 
                index={index}
                isUnlocked={unlockedSubjects.includes(subject.id)}
                onUnlockSuccess={handleUnlockSuccess}
                itemVariants={directionalItemVariants(index)}
              />
            )}
          </motion.div>
        ))}
      </motion.div>
       {!allUnlocked && isInitialized && (
        <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={isTitleAnimationComplete ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
        >
            <Button variant="ghost" onClick={handleMasterCodeClick}>
                <KeyRound className="mr-2" />
                Have a Master Code?
            </Button>
        </motion.div>
      )}
      <MasterUnlockDialog isOpen={isMasterDialogOpen} onOpenChange={setMasterDialogOpen} onUnlockSuccess={handleUnlockSuccess} />
    </>
  );
}
