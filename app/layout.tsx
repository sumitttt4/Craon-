import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'Craon | AI Video Editor',
  description:
    'Turn raw footage into polished videos with AI-directed edits, dynamic subtitles, cinematic editing, and professional color grading.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
