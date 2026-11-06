import type { Freight, Truck } from './demo-data';

export const cityCoordinates: Record<string, [number, number]> = {
  Bengaluru:[12.97,77.59],Hyderabad:[17.39,78.49],Mumbai:[19.08,72.88],Pune:[18.52,73.86],Delhi:[28.61,77.21],Jaipur:[26.91,75.79],Chennai:[13.08,80.27],Vijayawada:[16.51,80.65],Ahmedabad:[23.02,72.57],Noida:[28.54,77.39],Gurugram:[28.46,77.03],Nashik:[20,73.79],Kochi:[9.93,76.27],Kolkata:[22.57,88.36],Patna:[25.59,85.14],Mysuru:[12.3,76.64],Ludhiana:[30.9,75.86],Aurangabad:[19.88,75.34]
};

export function distance(a:string,b:string) {
  if (a===b) return 8;
  const ca=cityCoordinates[a],cb=cityCoordinates[b];
  if (!ca || !cb) return Infinity;
  const rad=Math.PI/180;
  const h=Math.sin((cb[0]-ca[0])*rad/2)**2+Math.cos(ca[0]*rad)*Math.cos(cb[0]*rad)*Math.sin((cb[1]-ca[1])*rad/2)**2;
  return Math.round(6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h))*1.18);
}

export function timeHours(value:string) {
  const time=value.match(/(\d{1,2}):(\d{2})/);
  if(!time) return 999;
  return (value.startsWith('Tomorrow')?24:value.startsWith('Today')?0:48)+Number(time[1])+Number(time[2])/60;
}

export function evaluateMatch(truck:Truck,load:Freight,returnTo?:string) {
  const pickupKm=distance(truck.location,load.pickup);
  const routeKm=distance(load.pickup,load.destination);
  const returnKm=returnTo?distance(load.destination,returnTo):0;
  const ready=timeHours(truck.available);
  const pickup=timeHours(load.date);
  const travelHours=pickupKm/45;
  const cost=Math.round(pickupKm*32+routeKm*22+1500+(returnKm||0)*20);
  const contribution=load.amount-cost;
  const blockers:string[]=[];
  if(truck.status!=='Available') blockers.push('Truck must be available after unloading');
  if(load.status!=='Available') blockers.push('Freight is already assigned');
  if(truck.type!==load.vehicle) blockers.push('Vehicle body/type does not match');
  if(truck.capacity<load.weight) blockers.push('Payload exceeds truck capacity');
  if(pickupKm>120) blockers.push('Pickup exceeds the 120 km repositioning limit');
  if(ready+travelHours>pickup+0.5) blockers.push('Cannot reach the pickup within its 30-minute demo window');
  if(returnTo && returnKm>80) blockers.push('Delivery is more than 80 km from the home corridor');
  if(contribution<3000) blockers.push('Estimated contribution is below ₹3,000');
  if(load.cargo==='Seafood' && truck.type!=='Refrigerated 20 ft') blockers.push('Seafood requires refrigerated transport');
  const breakdown=[
    {label:'Pickup proximity',points:pickupKm<=20?25:pickupKm<=60?18:pickupKm<=120?8:0,max:25,detail:`${Number.isFinite(pickupKm)?pickupKm:'Unknown'} km to pickup`},
    {label:'Route compatibility',points:returnTo?(returnKm<=20?20:returnKm<=80?12:0):20,max:20,detail:returnTo?`${load.destination} → ${returnTo}`:'Direct shipment route'},
    {label:'Vehicle & cargo',points:truck.type===load.vehicle?20:0,max:20,detail:load.vehicle},
    {label:'Payload capacity',points:truck.capacity>=load.weight?15:0,max:15,detail:`${load.weight}t of ${truck.capacity}t capacity`},
    {label:'Pickup timing',points:ready+travelHours<=pickup+0.5?10:0,max:10,detail:`Ready ${truck.available.toLowerCase()}`},
    {label:'Trip economics',points:contribution>=10000?10:contribution>=3000?6:0,max:10,detail:`₹${Number.isFinite(contribution)?contribution.toLocaleString('en-IN'):'—'} estimated contribution`}
  ];
  return {eligible:blockers.length===0,score:breakdown.reduce((n,r)=>n+r.points,0),pickupKm,routeKm,contribution,cost,blockers,breakdown};
}

export const money=(n:number)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
