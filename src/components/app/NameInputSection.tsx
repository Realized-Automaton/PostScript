
'use client';

import type React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label"; // Label removed
import { useToast } from "@/hooks/use-toast";
import { UserCircle, ArrowRight } from 'lucide-react';

interface NameInputSectionProps {
  onNameSet: (name: string) => void;
}

const NameInputSection: React.FC<NameInputSectionProps> = ({ onNameSet }) => {
  const [name, setName] = useState('');
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter the name.",
        variant: "destructive",
      });
      return;
    }
    onNameSet(name.trim());
    toast({
      title: "Name Set",
      description: `You can now define the personality for ${name.trim()}.`,
    });
  };

  return (
    <Card className="w-full animate-fadeIn shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <UserCircle className="w-8 h-8 text-primary" />
          <div>
            <CardTitle className="text-2xl font-headline text-foreground">Name Your Persona</CardTitle>
            <CardDescription>What is the name of the person you want to create a digital echo for?</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            {/* <Label htmlFor="persona-name" className="text-md">Their Name</Label> Removed this line */}
            <Input
              id="persona-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g., Grandma Rose, David, etc."
              required
              className="text-base"
              aria-label="Name of the person" // Added aria-label for accessibility
            />
          </div>
          <Button type="submit" className="w-full text-lg py-3 bg-primary hover:bg-primary/90 whitespace-normal h-auto">
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NameInputSection;
