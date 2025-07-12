import type React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 mt-12 border-t border-border">
      <div className="container mx-auto text-center text-muted-foreground">
        <div className="flex justify-center gap-4 mb-4">
            <Link href="/" className="text-sm hover:text-primary">Home</Link>
            <Link href="/pricing" className="text-sm hover:text-primary">Pricing</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Post Script. All rights reserved.</p>
        <p className="text-sm mt-1">Crafting memories, one conversation at a time.</p>
      </div>
    </footer>
  );
};

export default Footer;
