
"use client";

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

// Optimized hook to handle both device orientation (mobile) and mouse movement (desktop)
function useParallax() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const wrapper = ref.current;
        if (!wrapper) return;

        let isOrientationListenerActive = false;

        const handleMouseMove = (event: MouseEvent) => {
            if (isOrientationListenerActive) return; // Prioritize gyroscope on mobile

            const { clientX, clientY } = event;
            const { innerWidth, innerHeight } = window;
            
            // Calculate movement from the center of the screen
            const moveX = (clientX - innerWidth / 2) / (innerWidth / 2);
            const moveY = (clientY - innerHeight / 2) / (innerHeight / 2);

            requestAnimationFrame(() => {
                // Update CSS variables for parallax effect on the background (EXTREME speed)
                wrapper.style.setProperty('--tx', `${-moveX * 250}px`);
                wrapper.style.setProperty('--ty', `${-moveY * 250}px`);
                
                // Update separate CSS variables for card rotation (EXTREME sensitivity)
                wrapper.style.setProperty('--rx', `${-moveY * 60}deg`);
                wrapper.style.setProperty('--ry', `${moveX * 60}deg`);
            });
        };

        const handleOrientation = (event: DeviceOrientationEvent) => {
            isOrientationListenerActive = true;
            const beta = event.beta ?? 0; // X-axis rotation in range [-180, 180]
            const gamma = event.gamma ?? 0; // Y-axis rotation in range [-90, 90]

            // Clamp values for a controlled effect
            const clampedY = Math.min(Math.max(beta, -45), 45);
            const clampedX = Math.min(Math.max(gamma, -45), 45);

            requestAnimationFrame(() => {
                // Update CSS variables for parallax effect on the background (EXTREME speed)
                wrapper.style.setProperty('--tx', `${-clampedX * 15}px`);
                wrapper.style.setProperty('--ty', `${-clampedY * 15}px`);
                
                // Update separate CSS variables for card rotation, with a stronger effect (EXTREME sensitivity)
                wrapper.style.setProperty('--rx', `${-clampedY * 1.5}deg`);
                wrapper.style.setProperty('--ry', `${clampedX * 1.5}deg`);
            });
        };

        const requestPermission = () => {
             if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                (DeviceOrientationEvent as any).requestPermission()
                    .then((permissionState: string) => {
                        if (permissionState === 'granted') {
                            window.addEventListener('deviceorientation', handleOrientation);
                        } else {
                            window.addEventListener('mousemove', handleMouseMove);
                        }
                    })
                    .catch(() => window.addEventListener('mousemove', handleMouseMove));
            } else {
                // For devices that don't require permission (e.g., Android)
                window.addEventListener('deviceorientation', handleOrientation);
                window.addEventListener('mousemove', handleMouseMove);
            }
        };

        // On desktop, the mousemove event will fire immediately.
        // On mobile, we request permission for device orientation.
        requestPermission();

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return ref;
}


export default function StarfieldBackground() {
    const parallaxRef = useParallax();

    return (
        <div 
            ref={parallaxRef}
            className="absolute inset-0 -z-10 h-full w-full transition-all duration-500 ease-out"
        >
            <div className={cn(
                "absolute inset-0 transition-opacity duration-1000",
                "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100",
                "dark:opacity-0"
            )}></div>
            <div className={cn(
                "absolute inset-0 opacity-0 transition-opacity duration-1000",
                "dark:bg-black dark:opacity-100"
            )}>
                <div id="stars1" className="starfield"></div>
                <div id="stars2" className="starfield"></div>
                <div id="stars3" className="starfield"></div>
            </div>
        </div>
    );
}
