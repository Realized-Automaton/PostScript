'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2, Camera } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface PersonalitySetupSectionProps {
  onPersonalitySet: (profile: string) => void;
  onImageSet: (image: string | null) => void;
  clonedName?: string; 
}

const suggestions = [
  {
    title: '✍️ Writing Style & Phrasing',
    prompt: `How did they text? Short & to the point, or long and thoughtful? Did they use lots of emojis and "lol", or have perfect grammar?`,
  },
  {
    title: '❤️ Emotional Tone',
    prompt: 'Were they generally warm and comforting, or more direct? How did they express empathy or try to cheer you up?',
  },
  {
    title: '🌳 Topics & Interests',
    prompt: 'What did they love talking about? Old movies, gardening, sports? What was their unique sense of humor like?',
  },
  {
    title: '💬 Conversational Habits',
    prompt: 'Did they reply instantly or take their time? Did they prefer short texts, voice notes, or GIFs? Did they ask deep questions?',
  },
  {
    title: '🤝 Your Unique Relationship',
    prompt: 'Did they have a special nickname for you? What inside jokes or shared memories defined your conversations?',
  },
];


const PersonalitySetupSection: React.FC<PersonalitySetupSectionProps> = ({ onPersonalitySet, onImageSet, clonedName }) => {
  const [personalityProfile, setPersonalityProfile] = useState('');
  const [personaImage, setPersonaImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPersonaImage(result);
        onImageSet(result);
        toast({
          title: "Image Selected",
          description: `The image for ${clonedName || 'the persona'} has been updated.`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!personalityProfile.trim()) {
      toast({
        title: "Missing information",
        description: "Please describe the personality and style.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); 

    // In a real app, you would also handle the personaImage upload here,
    // likely sending it to a storage service and saving the URL.
    console.log("Persona Image data URI (if set):", personaImage ? personaImage.substring(0, 50) + '...' : 'Not set');

    onPersonalitySet(personalityProfile);
    toast({
      title: "Personality Profile Saved!",
      description: `The AI will now try to emulate ${clonedName ? clonedName + "'s" : "this"} personality and style.`,
    });
    setIsLoading(false);
  };

  return (
    <div className="w-full flex flex-col bg-background text-foreground animate-fadeIn">
      <header className="p-4 md:p-6 shrink-0">
        <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-headline font-bold text-foreground pb-2 border-b-4 border-primary inline-block">
              Define Personality and Style
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl">
              Help the AI understand {clonedName ? clonedName + "'s" : "your loved one's"} nuances. The more detail, the more personal the experience.
            </p>
        </div>
      </header>
      
      <form onSubmit={handleSubmit} className="flex-grow flex flex-col px-4 pb-4 md:px-6 md:pb-6">

        <div className="shrink-0 flex flex-col items-center">
            <div className="relative w-28 h-28 group">
                <Image
                    key={personaImage || 'placeholder'} 
                    src={personaImage || "https://placehold.co/150x150.png"} 
                    alt={clonedName || 'Persona'}
                    width={112}
                    height={112}
                    className="rounded-full object-cover w-28 h-28 border-2 border-dashed border-border group-hover:border-primary transition-colors"
                    data-ai-hint={!personaImage ? "portrait person" : undefined}
                    priority
                />
                <Button 
                    onClick={triggerImageUpload} 
                    variant="outline" 
                    size="icon" 
                    className="absolute bottom-0 right-0 bg-background/60 hover:bg-background/90 text-foreground opacity-50 group-hover:opacity-100 transition-opacity rounded-full p-1.5"
                    aria-label={`Upload image for ${clonedName || 'the persona'}`}
                    type="button"
                >
                    <Camera className="w-4 h-4" />
                </Button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Upload an image of {clonedName || 'the persona'}</p>
        </div>
        
        <div className="flex-grow relative my-6 min-h-[100px]">
          <Textarea
            value={personalityProfile}
            onChange={(e) => setPersonalityProfile(e.target.value)}
            placeholder={`Describe ${clonedName ? clonedName + "'s" : "their"} personality, common phrases, writing style, interests, and important memories here...`}
            required
            className="absolute inset-0 h-full w-full bg-input border border-input-border rounded-lg p-4 resize-none text-lg leading-relaxed placeholder:text-muted-foreground/80 focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        
        <div className="shrink-0">
          <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex w-max space-x-3 pb-4">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="w-64 shrink-0 p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <h4 className="font-semibold text-foreground/90 text-sm">{suggestion.title}</h4>
                    <p className="text-xs text-foreground/70 mt-1 whitespace-pre-wrap">{suggestion.prompt}</p>
                  </div>
                ))}
              </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
           <p className="text-sm text-muted-foreground my-3 text-center">Need inspiration? Scroll through these ideas.</p>
          <Button type="submit" disabled={isLoading} className="w-full text-lg py-3 bg-primary hover:bg-primary/90">
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-5 w-s5" />
              )}
              {isLoading ? 'Saving Profile...' : `Set Profile for ${clonedName}`}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PersonalitySetupSection;
