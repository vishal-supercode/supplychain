'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Truck, Sprout, Network } from 'lucide-react';

export default function SolutionNav() {
  const path = usePathname();
  const links = [{href:'/',name:'FreightLoop',Icon:Truck},{href:'/freshlink',name:'FreshLink',Icon:Sprout},{href:'/supplylens',name:'SupplyLens',Icon:Network}];
  return <nav className="solution-nav" aria-label="Supply chain solutions"><Link href="/" className="suite-brand">SC<span> / </span>Supply chain lab</Link><div>{links.map(({href,name,Icon},i)=><Link key={href} href={href} aria-current={(href==='/'?path==='/':path.startsWith(href))?'page':undefined}><small>0{i+1}</small><Icon size={16}/><span>{name}</span></Link>)}</div><span className="suite-label">RESEARCH → PROTOTYPE</span></nav>;
}
