
'use client';

import type React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ScrollText, Save, Loader2 } from 'lucide-react';

interface MemoryInputFormProps {
  clonedName?: string;
  onMemoriesSet?: (memories: Record<string, string>) => void; // Optional callback for when memories are "saved"
}

const MemoryInputForm: React.FC<MemoryInputFormProps> = ({ clonedName, onMemoriesSet }) => {
  const [personalityDetails, setPersonalityDetails] = useState('');
  const [commonPhrases, setCommonPhrases] = useState('');
  const [favoriteMemories, setFavoriteMemories] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!personalityDetails.trim() && !commonPhrases.trim() && !favoriteMemories.trim()) {
      toast({
        title: "No memories provided",
        description: "Please fill in at least one field to save memories.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate async operation (e.g., saving to Firestore)
    await new Promise(resolve => setTimeout(resolve, 750));

    const memoriesData = {
      personalityDetails,
      commonPhrases,
      favoriteMemories,
    };

    // For now, we just show a toast. Firestore integration will happen later.
    console.log("Memories data:", memoriesData); 
    if (onMemoriesSet) {
      onMemoriesSet(memoriesData);
    }

    toast({
      title: "Memories Saved!",
      description: `The AI will use these details to enrich conversations about ${clonedName || 'your loved one'}.`,
    });
    setIsLoading(false);
  };

  return (
    <Card className="w-full animate-fadeIn shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <ScrollText className="w-8 h-8 text-primary" />
          <div>
            <CardTitle className="text-2xl font-headline text-foreground">Share Their Memories</CardTitle>
            <CardDescription>
              Help the AI understand {clonedName ? clonedName + "'s" : "your loved one's"} unique stories and expressions.
              The more details you provide, the richer the experience.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="personality-details" className="text-md">
              Describe their personality, common behaviors, and typical demeanor.
            </Label>
            <Textarea
              id="personality-details"
              value={personalityDetails}
              onChange={(e) => setPersonalityDetails(e.target.value)}
              placeholder={`e.g., ${clonedName || 'They'} had a great sense of humor, always told dad jokes, and loved to read mystery novels...`}
              rows={5}
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="common-phrases" className="text-md">
              List any common phrases, sayings, or unique words they often used.
            </Label>
            <Textarea
              id="common-phrases"
              value={commonPhrases}
              onChange={(e) => setCommonPhrases(e.target.value)}
              placeholder={`e.g., "Well, I'll be...", "That's the ticket!", called everyone 'kiddo'`}
              rows={4}
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="favorite-memories" className="text-md">
              Share some important memories, anecdotes, or stories related to them. What made these moments special?
            </Label>
            <Textarea
              id="favorite-memories"
              value={favoriteMemories}
              onChange={(e) => setFavoriteMemories(e.target.value)}
              placeholder={`e.g., The time we went to the beach and built a giant sandcastle, their 50th birthday party, how they taught me to bake...`}
              rows={6}
              className="text-base"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full text-lg py-3 bg-primary hover:bg-primary/90 whitespace-normal h-auto">
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Save className="mr-2 h-5 w-5" />
            )}
            {isLoading ? 'Saving Memories...' : 'Save Memories & Enhance AI'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MemoryInputForm;
