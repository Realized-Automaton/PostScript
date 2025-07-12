
'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { personalizeChatResponse } from '@/ai/flows/personalize-chat-responses';
import { emailConversation } from '@/ai/flows/email-conversation-flow';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import AudioPlayer from './AudioPlayer';
import UpgradeDialog from './UpgradeDialog'; // New import
import { Bot, SendHorizonal, Loader2, Mail, AudioLines, Gem, MessageSquareText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  isFirst?: boolean;
}

interface ChatSectionProps {
  personalityProfile: string | null;
  personaImage: string | null;
  clonedName?: string;
}

const DAILY_CHAT_LIMIT = 5;

const ChatSection: React.FC<ChatSectionProps> = ({ personalityProfile, personaImage, clonedName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [chatCount, setChatCount] = useState(0);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLimitReached = chatCount >= DAILY_CHAT_LIMIT;
  const chatsRemaining = Math.max(0, DAILY_CHAT_LIMIT - chatCount);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement | null;
      if (viewport) {
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages]);
  
  useEffect(() => {
    if (personalityProfile && clonedName && messages.length === 0) {
       setMessages([
        {
          id: 'initial-ai-greeting',
          sender: 'ai',
          text: "I'm Ready",
          isFirst: true,
        }
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalityProfile, clonedName]);
  
  // Effect to check limit after chat count changes
  useEffect(() => {
    if (chatCount >= DAILY_CHAT_LIMIT) {
      setShowUpgradeDialog(true);
    }
  }, [chatCount]);


  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userInput.trim() || !personalityProfile || isLoading || isLimitReached) {
      if (isLimitReached) {
        setShowUpgradeDialog(true);
      }
      return;
    }

    const newUserMessage: Message = {
      id: Date.now().toString() + '-user',
      sender: 'user',
      text: userInput,
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setChatCount(prevCount => prevCount + 1);
    setUserInput('');
    inputRef.current?.focus();
    setIsLoading(true);

    try {
      const aiResult = await personalizeChatResponse({
        chatInput: newUserMessage.text,
        personalityProfile: personalityProfile,
      });

      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        sender: 'ai',
        text: aiResult.personalizedResponse,
      };
      setMessages(prev => [...prev, aiMessage]);
      setAudioSrc(null); // Clear audio on new message

    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error Getting AI Response",
        description: (error as Error).message || "An unexpected error occurred.",
        variant: "destructive",
      });
       const errorAiMessage: Message = {
        id: Date.now().toString() + '-ai-error',
        sender: 'ai',
        text: "I'm sorry, I encountered an issue while trying to respond. Please try again.",
      };
      setMessages(prev => [...prev, errorAiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareConversation = async () => {
    const recipientEmail = window.prompt("To save this conversation and return later, please enter your email address:");

    if (!recipientEmail) return;

    if (!/\S+@\S+\.\S+/.test(recipientEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsActionLoading(true);

    const conversationTranscript = messages
      .filter(msg => !msg.isFirst)
      .map(msg => {
        const sender = msg.sender === 'user' ? 'You' : clonedName;
        return `${sender}: ${msg.text}`;
      })
      .join('\n\n');

    if (!conversationTranscript) {
       toast({
        title: "Nothing to share",
        description: "The conversation is empty.",
      });
      setIsActionLoading(false);
      return;
    }
    
    try {
      const result = await emailConversation({
        recipientEmail,
        conversationTranscript,
        clonedName: clonedName || 'AI Persona',
      });

      toast({
        title: result.success ? "Success!" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Share conversation error:", error);
      toast({
        title: "Error Sharing Conversation",
        description: (error as Error).message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleConvertToSpeech = async () => {
    const lastAiMessage = [...messages].reverse().find(m => m.sender === 'ai' && !m.isFirst);

    if (!lastAiMessage) {
        toast({
            title: "No AI message to read",
            description: "Wait for the AI to respond before using this feature.",
            variant: "destructive",
        });
        return;
    }

    setIsTtsLoading(true);
    setAudioSrc(null); // Clear previous audio

    try {
        const result = await textToSpeech({ textToSpeak: lastAiMessage.text });
        setAudioSrc(result.audioDataUri);
    } catch (error) {
        console.error("TTS conversion error:", error);
        toast({
            title: "Error Generating Audio",
            description: (error as Error).message || "Could not convert the message to speech.",
            variant: "destructive",
        });
    } finally {
        setIsTtsLoading(false);
    }
  };
  
  const isTtsButtonEnabled = !isActionLoading && !isLoading && !isTtsLoading && messages.some(m => m.sender === 'ai' && !m.isFirst);
  const isSendDisabled = isLoading || isActionLoading || isTtsLoading || !userInput.trim() || isLimitReached;

  return (
    <>
    <UpgradeDialog
      isOpen={showUpgradeDialog}
      onClose={() => setShowUpgradeDialog(false)}
    />
    <Card className="w-full animate-fadeIn shadow-xl flex flex-col h-[75vh] bg-gradient-to-br from-[hsl(var(--background))] to-[hsl(var(--card))] animate-pulse-blue">
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
          <div className="p-4 flex flex-col gap-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-end gap-2 max-w-[85%]",
                  msg.sender === 'user' ? "self-end" : "self-start"
                )}
              >
                {msg.sender === 'ai' && (
                  <Avatar className="w-8 h-8 shadow shrink-0">
                    <AvatarImage src={personaImage || "https://placehold.co/100x100.png"} data-ai-hint="robot face" />
                    <AvatarFallback><Bot /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "p-3 rounded-lg shadow-md",
                    msg.sender === 'user'
                      ? "bg-card text-card-foreground"
                      : msg.isFirst
                      ? "bg-chart-2 text-primary-foreground"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  <p className="font-bold text-sm mb-1">{msg.sender === 'user' ? "You" : clonedName}</p>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
                 {msg.sender === 'user' && (
                  <Avatar className="w-8 h-8 shadow shrink-0">
                    <AvatarImage src={'https://i.ibb.co/yF98FXzZ/psai.png'} />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end gap-2 max-w-[85%] self-start">
                <Avatar className="w-8 h-8 shadow shrink-0">
                  <AvatarImage src={personaImage || "https://placehold.co/100x100.png"} data-ai-hint="robot face" />
                  <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
                <div className="p-3 rounded-lg shadow-md bg-card text-card-foreground">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-3 border-t bg-background shrink-0 flex flex-col gap-3">
        <form onSubmit={handleSendMessage} className="w-full flex items-center gap-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder={isLimitReached ? "Daily free chat limit reached" : "Write a message..."}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="flex-grow rounded-full text-base h-11 px-4"
            disabled={isLimitReached || isLoading || isActionLoading || isTtsLoading}
            aria-label="Chat input"
          />
          <Button type="submit" size="icon" disabled={isSendDisabled} className="bg-primary hover:bg-primary/90 rounded-full w-11 h-11 flex-shrink-0">
            <SendHorizonal className="w-5 h-5" />
          </Button>
        </form>
        {audioSrc && (
            <div className="w-full">
                <AudioPlayer src={audioSrc} title={`Voice of ${clonedName}`} />
            </div>
        )}
        <div className="w-full flex justify-center items-center text-xs text-muted-foreground">
            <MessageSquareText className="mr-2 h-4 w-4" />
            <span>
              Chats Remaining: {chatsRemaining} / {DAILY_CHAT_LIMIT}
            </span>
        </div>
        <div className="w-full flex flex-col sm:flex-row items-center gap-2">
            <Button 
                onClick={handleShareConversation} 
                className="w-full bg-primary hover:bg-primary/90" 
                disabled={isActionLoading || isLoading || isTtsLoading || messages.length <= 1}
            >
                <Mail className="mr-2 h-4 w-4" />
                Preserve the moment, (Save/Share)
            </Button>
            <Button 
                onClick={handleConvertToSpeech} 
                className={cn(
                    "w-full bg-primary hover:bg-primary/90",
                    isTtsButtonEnabled && "animate-button-soft-pulse"
                )} 
                disabled={!isTtsButtonEnabled}
            >
                {isTtsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AudioLines className="mr-2 h-4 w-4" />}
                Hear their voice again
            </Button>
        </div>
        <div className="w-full">
            <Link href="/pricing">
                <Button variant="outline" className="w-full">
                    <Gem className="mr-2 h-4 w-4" />
                    Upgrade for More Features
                </Button>
            </Link>
        </div>
      </CardFooter>
    </Card>
    </>
  );
};

export default ChatSection;
