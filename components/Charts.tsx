'use client';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, LineChart, Line } from 'recharts';
import { trendData, routes } from '@/lib/demo-data';

export function KilometreChart({period='This week',route='All routes'}:{period?:string;route?:string}) {
  const multiplier=(period==='This month'?4.2:period==='Last 30 days'?4.5:1)*(route==='All routes'?1:0.35);
  const data=trendData.map(v=>({...v,loaded:Math.round(v.loaded*multiplier*10),empty:Math.round(v.empty*multiplier*10)}));
  return <ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{top:15,right:10,left:-25,bottom:0}}><defs><linearGradient id="loaded" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#21a995" stopOpacity={0.22}/><stop offset="100%" stopColor="#21a995" stopOpacity={0.015}/></linearGradient></defs><CartesianGrid vertical={false} stroke="#edf0f3" strokeDasharray="4 4"/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize:11,fill:'#8a94a6'}} dy={8}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#8a94a6'}}/><Tooltip contentStyle={{borderRadius:10,border:'1px solid #e6eaf0',fontSize:12}} formatter={(value)=>`${Number(value).toLocaleString()} km`}/><Area type="monotone" dataKey="loaded" name="Loaded kilometres" stroke="#17a58e" strokeWidth={2.5} fill="url(#loaded)"/><Area type="monotone" dataKey="empty" name="Empty kilometres" stroke="#a9b7ca" strokeDasharray="5 5" strokeWidth={2} fill="transparent"/></AreaChart></ResponsiveContainer>;
}

export function UtilizationChart({period='This week',route='All routes',assisted=false}:{period?:string;route?:string;assisted?:boolean}) {
  const offset=(period==='This month'?3:period==='Last 30 days'?-2:0)+(route==='All routes'?0:4)+(assisted?8:0);
  return <ResponsiveContainer width="100%" height="100%"><BarChart data={trendData.map(v=>({...v,util:Math.min(95,v.util+offset)}))} margin={{top:15,right:10,left:-25,bottom:0}}><CartesianGrid vertical={false} stroke="#edf0f3" strokeDasharray="4 4"/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize:11,fill:'#8a94a6'}} dy={8}/><YAxis domain={[0,100]} ticks={[0,25,50,75,100]} tickFormatter={v=>`${v}%`} axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#8a94a6'}}/><Tooltip cursor={{fill:'#f3f8f6'}} formatter={value=>`${value}%`} contentStyle={{borderRadius:10,fontSize:12}}/><Bar dataKey="util" name="Utilization" fill="#21aa93" radius={[4,4,0,0]} barSize={24}/></BarChart></ResponsiveContainer>;
}

export function DemandChart({route='All routes'}:{route?:string}) {
  const data=routes.filter(r=>route==='All routes'||r.name===route).map(r=>({route:r.name.split(' → ')[0],loads:r.loads}));
  return <ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{left:-25,top:10,right:10,bottom:0}}><CartesianGrid vertical={false} stroke="#edf0f3"/><XAxis dataKey="route" tick={{fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:10}} axisLine={false} tickLine={false}/><Tooltip/><Bar dataKey="loads" name="Available loads" fill="#738ba9" radius={[4,4,0,0]} barSize={34}/></BarChart></ResponsiveContainer>;
}

export function SmallTrend({kind}:{kind:'matches'|'cost'}) {
  const data=['Jun','Jul','Aug','Sep','Oct','Nov'].map((month,i)=>({month,value:kind==='matches'?[28,36,32,48,57,64][i]:[48,46,47,42,39,36][i]}));
  return <ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{left:-20,top:10,right:10,bottom:0}}><CartesianGrid vertical={false} stroke="#edf0f3"/><XAxis dataKey="month" tick={{fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:10}} axisLine={false} tickLine={false}/><Tooltip formatter={v=>kind==='cost'?`₹${v} lakh`:v}/><Line type="monotone" dataKey="value" name={kind==='cost'?'Transport cost':'Backhaul matches'} stroke={kind==='cost'?'#728aaa':'#1aa58e'} strokeWidth={2.5} dot={{r:3,fill:'white',strokeWidth:2}}/></LineChart></ResponsiveContainer>;
}
