import React from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from '@/components/ui/button';
import { AlertTriangle, XIcon } from 'lucide-react';

export default function DeleteModal({ open, onOpenChange, onConfirm, title, description, loading = false }) {
    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <DialogPrimitive.Portal>
                {/* Custom Overlay with alpha background */}
                <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50  bg-black/80" />
                <DialogPrimitive.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border border-primary/20 bg-primary p-6 shadow-lg duration-200 sm:max-w-md text-white">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-white" />
                            </div>
                            <DialogPrimitive.Title className="text-white text-xl font-black">
                                {title || 'Confirmer la suppression'}
                            </DialogPrimitive.Title>
                        </div>
                        <DialogPrimitive.Description className="text-white/80 pt-2">
                            {description || 'Cette action est irréversible. Êtes-vous sûr de vouloir continuer ?'}
                        </DialogPrimitive.Description>
                    </div>
                    
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={loading}
                            className="bg-white text-primary hover:bg-white/90"
                        >
                            {loading ? 'Suppression...' : 'Supprimer'}
                        </Button>
                    </div>
                    
                    <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 text-white">
                        <XIcon />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}

