'use client';

import { useState } from 'react';
import Header from '@/components/app/Header';
import Footer from '@/components/app/Footer';
import HeroSection from '@/components/app/HeroSection';
import NameInputSection from '@/components/app/NameInputSection';
import PersonalitySetupSection from '@/components/app/PersonalitySetupSection';
import ChatSection from '@/components/app/ChatSection';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const [lovedOneName, setLovedOneName] = useState<string | null>(null);
  const [personalityProfile, setPersonalityProfile] = useState<string | null>(null);
  const [personaImage, setPersonaImage] = useState<string | null>(null);

  const handleNameSet = (name: string) => {
    setLovedOneName(name);
  };

  const handlePersonalitySet = (profile: string) => {
    setPersonalityProfile(profile);
  };

  const handleImageSet = (image: string | null) => {
    setPersonaImage(image);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {!lovedOneName && <Header />}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="w-full max-w-3xl mx-auto space-y-16">
          {!lovedOneName && <HeroSection />}
          
          {!lovedOneName && (
            <NameInputSection onNameSet={handleNameSet} />
          )}
          
          {lovedOneName && !personalityProfile && (
            <>
              <Separator className="my-8 bg-border/50" />
              <PersonalitySetupSection 
                onPersonalitySet={handlePersonalitySet} 
                onImageSet={handleImageSet}
                clonedName={lovedOneName} 
              />
            </>
          )}
          
          {lovedOneName && personalityProfile && (
             <>
              <div className="mb-4 text-center">
                <h2 className="text-xl font-headline font-bold text-foreground flex items-center justify-center">
                  PostScript
                  <span className="bg-primary text-primary-foreground px-1.5 py-0.5 rounded text-sm font-semibold ml-2 inline-flex items-center justify-center">
                    AI
                  </span>
                </h2>
                <p className="text-muted-foreground text-sm mt-1">Goodbye isn't the end.</p>
              </div>
              <ChatSection 
                personalityProfile={personalityProfile}
                personaImage={personaImage}
                clonedName={lovedOneName}
              />
            </>
          )}
        </div>
      </main>
      {!lovedOneName && <Footer />}
    </div>
  );
}
