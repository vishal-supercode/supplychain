import type { Metadata } from 'next';
import './globals.css';
import './solutions.css';
import './freshlink.css';
import './supplylens.css';
import SolutionNav from '@/components/SolutionNav';

export const metadata: Metadata = {
  title: 'Supply Chain Lab | FreightLoop · FreshLink · SupplyLens',
  description: 'Interactive research prototypes for freight, agricultural cold chains, and supplier visibility.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SolutionNav />{children}</body></html>;
}
