'use client';

export default function DocumentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-1 w-full bg-background min-h-full">
      {children}
    </div>
  );
}
