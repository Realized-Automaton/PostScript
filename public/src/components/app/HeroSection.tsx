import type React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="text-center pt-0 pb-10 animate-fadeIn">
      <div className="mb-8 flex justify-center">
        <Image
          src="https://i.ibb.co/7tvTKZn0/postscrpt-mobile.png"
          alt="PostScript AI mobile app preview"
          width={300} 
          height={600} 
          className="rounded-lg shadow-2xl"
          data-ai-hint="mobile app interface"
          priority 
        />
      </div>
      <h2 className="text-5xl font-headline font-bold text-foreground mb-4 flex items-center justify-center">
        PostScript
        <span className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-2xl font-semibold ml-2 inline-flex items-center justify-center">
          AI
        </span>
      </h2>
      <p className="text-xl text-primary/90 mb-2 max-w-2xl mx-auto">
        Reconnect. Remember. PostScript.
      </p>
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
        Create a digital echo of your loved ones. Preserve their voice and personality to keep their memory alive through meaningful conversations.
      </p>
      <Link href="/pricing">
          <Button size="lg" className="text-lg py-3 h-auto">
              View Plans & Pricing
              <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
      </Link>
    </section>
  );
};

export default HeroSection;
