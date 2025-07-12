import type React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6">
      <div className="container mx-auto flex items-center justify-center">
        <h1 className="text-4xl font-headline font-bold text-foreground flex items-center">
          PostScript
          <span className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-2xl font-semibold ml-2 inline-flex items-center justify-center">
            AI
          </span>
        </h1>
      </div>
    </header>
  );
};

export default Header;
