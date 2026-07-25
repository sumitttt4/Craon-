/* oxlint-disable react/only-export-components */
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Craon Studio | AI Video Editor',
  description: 'A focused AI-assisted video editing workspace by Craon.',
};

export default function VideoEditorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
