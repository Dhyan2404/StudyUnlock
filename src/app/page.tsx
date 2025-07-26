
"use client"

import StarfieldBackground from '@/components/starfield-background';
import SubjectSelection from '@/components/subject-selection';
import { ThemeToggle } from '@/components/theme-toggle';
import { BookOpenCheck, Timer } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { playSound } from '@/lib/audio';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.8,
    },
  },
};

const galaxyItemVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 100,
    },
  },
};

const Typewriter = ({ text, className, onComplete }: { text: string, className?: string, onComplete?: () => void }) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayText('');
    setIsComplete(false);
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.substring(0, i + 1));
        if (text[i] !== ' ') { // Don't play sound for spaces
          playSound('/sounds/typing.mp3');
        }
        i++;
      } else {
        clearInterval(intervalId);
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
      }
    }, 50); // Slightly slower for a better typing feel with sound
    return () => clearInterval(intervalId);
  }, [text, onComplete]);

  return (
    <div className={className}>
      {displayText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </div>
  );
};

const StudyTimer = () => {
    const [seconds, setSeconds] = useState(0);
    const storageKey = 'studyUnlockTimeStudied';

    // Load initial time from localStorage
    useEffect(() => {
        const storedSeconds = localStorage.getItem(storageKey);
        if (storedSeconds) {
            setSeconds(parseInt(storedSeconds, 10));
        }
    }, []);

    // Update timer every second and save to localStorage
    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds(prevSeconds => {
                const newSeconds = prevSeconds + 1;
                localStorage.setItem(storageKey, newSeconds.toString());
                return newSeconds;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        const pad = (num: number) => num.toString().padStart(2, '0');

        return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
    }

    return (
        <div className="flex items-center justify-center font-semibold text-foreground/80">
            <Timer className="mr-2 h-5 w-5" />
            <p>Time Studied: {formatTime(seconds)}</p>
        </div>
    )
}


export default function Home() {
  const titleText = "Welcome to StudyUnlock";
  const descriptionText = "Select a subject to begin. Unlock chapters with your code to access exclusive study materials, available anytime, even offline.";
  const [isTitleComplete, setIsTitleComplete] = useState(false);
  const [isDescriptionComplete, setIsDescriptionComplete] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col">
      <StarfieldBackground />
      <main className="flex-grow flex flex-col items-center p-4 sm:p-12 md:p-24 z-10">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <motion.div 
          className="text-center mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={galaxyItemVariants} className="inline-flex items-center justify-center bg-primary text-primary-foreground p-3 rounded-full mb-4 shadow-lg">
            <BookOpenCheck className="h-10 w-10" />
          </motion.div>
          
          <Typewriter text={titleText} className="text-4xl sm:text-5xl font-bold font-headline text-foreground" onComplete={() => setIsTitleComplete(true)} />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isTitleComplete ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
             {isTitleComplete && <Typewriter text={descriptionText} className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto" onComplete={() => setIsDescriptionComplete(true)} />}
          </motion.div>

        </motion.div>
        
        <SubjectSelection isTitleAnimationComplete={isTitleComplete} />

      </main>
      <motion.footer 
        className="w-full text-center p-4 mt-auto z-10 space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: isDescriptionComplete ? 0.2 : 2 }}
      >
        <StudyTimer />
        <p className="text-sm text-muted-foreground">
          This app is best experienced on mobile devices.
        </p>
        <p className="text-sm text-foreground/80 font-semibold animate-pulse">
          Made with ❤️ by Dhyan
        </p>
      </motion.footer>
    </div>
  );
}
