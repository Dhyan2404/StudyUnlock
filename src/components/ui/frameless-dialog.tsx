
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const FramelessDialog = DialogPrimitive.Root

const FramelessDialogTrigger = DialogPrimitive.Trigger

const FramelessDialogPortal = DialogPrimitive.Portal

const FramelessDialogClose = DialogPrimitive.Close

const FramelessDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
FramelessDialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const FramelessDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { sourceBounds: DOMRect | null }
>(({ className, children, sourceBounds, ...props }, ref) => {
    const [style, setStyle] = React.useState<React.CSSProperties>({});

    React.useEffect(() => {
        if(sourceBounds) {
            const targetWidth = window.innerWidth;
            const targetHeight = window.innerHeight;

            setStyle({
                top: `${sourceBounds.top}px`,
                left: `${sourceBounds.left}px`,
                width: `${sourceBounds.width}px`,
                height: `${sourceBounds.height}px`,
                '--target-width': `${targetWidth}px`,
                '--target-height': `${targetHeight}px`,
                '--target-top': '0px',
                '--target-left': '0px',
            });
        }
    }, [sourceBounds]);

    return (
        <DialogPrimitive.Portal>
            <FramelessDialogOverlay />
            <DialogPrimitive.Content
            ref={ref}
            style={style}
            className={cn(
                "fixed z-50 grid overflow-hidden bg-background p-0 shadow-lg data-[state=open]:animate-zoom-in data-[state=closed]:animate-zoom-out",
                className
            )}
            {...props}
            >
            {children}
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-6 w-6 text-white" />
                <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    )
})
FramelessDialogContent.displayName = DialogPrimitive.Content.displayName

export {
  FramelessDialog,
  FramelessDialogPortal,
  FramelessDialogOverlay,
  FramelessDialogClose,
  FramelessDialogTrigger,
  FramelessDialogContent,
}
