# **App Name**: StudyUnlock

## Core Features:

- Subject Selection: Display science, math, and social studies buttons for subject selection.
- Code Validation: Securely validate unlock codes against a service, differentiate one-time and all-access codes, and track code usage with firebase.
- Unlock Status: Visualize locked/unlocked states with clear indicators (lock/checkmark) that saves the status locally and avoids repeated prompts.
- PDF Display: Securely render PDF files within the app, preventing downloads and external access; implements screenshot and screen recording prevention using FLAG_SECURE.
- Offline Access: Provide PDF access even without an internet connection, after initial unlock.

## Style Guidelines:

- Primary color: #577399 (RGB). A muted blue, chosen to evoke a sense of calm focus appropriate for studying.
- Background color: #F2F4F8 (RGB). A light, desaturated tint of blue to provide a comfortable contrast.
- Accent color: #AE79EF (RGB). A brighter analogous color chosen to stand out and indicate action without being overwhelming.
- Body and headline font: 'PT Sans', a humanist sans-serif, for both headings and body text, balancing a modern feel with readability.
- Clear lock/unlock icons for content status display
- Use a clean, modern layout that emphasizes content, providing easy navigation and clear presentation.
- Incorporate button glows and smooth transitions for an engaging user experience.