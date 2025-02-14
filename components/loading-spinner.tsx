import React from "react";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-73px)]">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-4 border-primary/30 border-t-transparent animate-spin"></div>
        </div>
      </div>
    </div>
  );
};
