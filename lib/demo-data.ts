export type TruckStatus = 'Available' | 'In Transit' | 'Loading' | 'Unloading' | 'Maintenance';
export type Truck = { id: string; reg: string; type: string; capacity: number; location: string; status: TruckStatus; destination: string; available: string; owner: string; driver: string; phone: string; cargo: string };
export type LoadStatus = 'Available' | 'Matched' | 'In transit' | 'Delivered';
export type Freight = { id: string; pickup: string; destination: string; cargo: string; weight: number; date: string; vehicle: string; amount: number; status: LoadStatus; shipper: string };
export type BookingStatus = 'Confirmed' | 'In transit' | 'Delivered' | 'Pending';
export type Booking = { id: string; truck: string; freight: string; shipper: string; transporter: string; pickup: string; destination: string; amount: number; status: BookingStatus };

export const initialTrucks: Truck[] = [
  { id:'TRK-001',reg:'KA 03 MN 4821',type:'Container 32 ft',capacity:16,location:'Bengaluru',status:'In Transit',destination:'Hyderabad',available:'Today, 18:30',owner:'Patil Roadways',driver:'Ramesh Patil',phone:'+91 98765 41230',cargo:'Consumer electronics' },
  { id:'TRK-002',reg:'MH 12 QT 7604',type:'Open Truck 24 ft',capacity:12,location:'Pune',status:'Available',destination:'—',available:'Today, 14:00',owner:'Western Carriers',driver:'Suresh Jadhav',phone:'+91 98220 16345',cargo:'General goods' },
  { id:'TRK-003',reg:'DL 1L AB 3218',type:'Container 32 ft',capacity:18,location:'Delhi',status:'Loading',destination:'Jaipur',available:'Today, 20:00',owner:'NorthStar Logistics',driver:'Manoj Kumar',phone:'+91 98104 22761',cargo:'Packaged foods' },
  { id:'TRK-004',reg:'TN 22 CY 9032',type:'Refrigerated 20 ft',capacity:10,location:'Chennai',status:'In Transit',destination:'Bengaluru',available:'Tomorrow, 06:00',owner:'Southern Freight Co.',driver:'Arun Kumar',phone:'+91 98401 76320',cargo:'Pharmaceuticals' },
  { id:'TRK-005',reg:'TS 08 UH 1459',type:'Open Truck 32 ft',capacity:20,location:'Hyderabad',status:'Available',destination:'—',available:'Today, 16:00',owner:'Deccan Express',driver:'Naveen Reddy',phone:'+91 98490 33881',cargo:'General goods' },
  { id:'TRK-006',reg:'GJ 01 KD 6725',type:'Container 20 ft',capacity:9,location:'Ahmedabad',status:'Unloading',destination:'Mumbai',available:'Tomorrow, 09:00',owner:'Shah Transport',driver:'Imran Shaikh',phone:'+91 98250 11408',cargo:'Textiles' },
  { id:'TRK-007',reg:'RJ 14 GP 2851',type:'Open Truck 24 ft',capacity:14,location:'Jaipur',status:'Available',destination:'—',available:'Today, 17:30',owner:'Rajasthan Roadlines',driver:'Vikram Singh',phone:'+91 94140 78422',cargo:'Building materials' },
  { id:'TRK-008',reg:'KA 51 MB 7712',type:'Container 32 ft',capacity:16,location:'Hyderabad',status:'Available',destination:'—',available:'Today, 15:30',owner:'Patil Roadways',driver:'Prakash Gowda',phone:'+91 99002 47113',cargo:'General goods' },
  { id:'TRK-009',reg:'MH 04 LK 5420',type:'Refrigerated 20 ft',capacity:12,location:'Mumbai',status:'In Transit',destination:'Pune',available:'Tomorrow, 08:00',owner:'Western Carriers',driver:'Ganesh More',phone:'+91 98205 64891',cargo:'Dairy products' },
  { id:'TRK-010',reg:'KA 01 AE 6284',type:'Open Truck 32 ft',capacity:22,location:'Bengaluru',status:'Available',destination:'—',available:'Today, 13:00',owner:'Southern Freight Co.',driver:'Shivakumar H.',phone:'+91 98450 12746',cargo:'Industrial parts' },
  { id:'TRK-011',reg:'UP 16 CT 1893',type:'Container 32 ft',capacity:18,location:'Noida',status:'In Transit',destination:'Delhi',available:'Today, 19:00',owner:'NorthStar Logistics',driver:'Ajay Yadav',phone:'+91 98110 76438',cargo:'Home appliances' },
  { id:'TRK-012',reg:'AP 39 TX 4027',type:'Open Truck 24 ft',capacity:12,location:'Vijayawada',status:'Available',destination:'—',available:'Today, 12:00',owner:'Deccan Express',driver:'Ravi Teja',phone:'+91 98480 90412',cargo:'Agri inputs' },
  { id:'TRK-013',reg:'HR 55 AG 8321',type:'Container 20 ft',capacity:10,location:'Gurugram',status:'Maintenance',destination:'—',available:'Nov 7, 10:00',owner:'NorthStar Logistics',driver:'Deepak Sharma',phone:'+91 98120 30187',cargo:'—' },
  { id:'TRK-014',reg:'MH 14 ND 2168',type:'Open Truck 32 ft',capacity:20,location:'Nashik',status:'In Transit',destination:'Pune',available:'Tomorrow, 11:00',owner:'Western Carriers',driver:'Rohit Pawar',phone:'+91 98227 56093',cargo:'Fresh produce' },
  { id:'TRK-015',reg:'KL 07 BQ 7835',type:'Refrigerated 20 ft',capacity:10,location:'Kochi',status:'Available',destination:'—',available:'Today, 16:00',owner:'Coastal Movers',driver:'Biju Thomas',phone:'+91 98470 18429',cargo:'Seafood' },
  { id:'TRK-016',reg:'WB 23 E 6129',type:'Open Truck 24 ft',capacity:13,location:'Kolkata',status:'Loading',destination:'Patna',available:'Tomorrow, 05:30',owner:'EastLine Transport',driver:'Sanjay Das',phone:'+91 98300 62847',cargo:'Industrial goods' },
  { id:'TRK-017',reg:'TS 07 GK 3305',type:'Container 20 ft',capacity:9,location:'Hyderabad',status:'Available',destination:'—',available:'Today, 19:00',owner:'Deccan Express',driver:'Kiran Rao',phone:'+91 98491 61304',cargo:'Auto components' },
  { id:'TRK-018',reg:'KA 05 MX 9470',type:'Open Truck 24 ft',capacity:14,location:'Mysuru',status:'In Transit',destination:'Bengaluru',available:'Tomorrow, 07:00',owner:'Southern Freight Co.',driver:'Basavaraj M.',phone:'+91 98442 85217',cargo:'Paper rolls' },
  { id:'TRK-019',reg:'PB 10 DL 5712',type:'Container 32 ft',capacity:18,location:'Ludhiana',status:'Available',destination:'—',available:'Today, 15:00',owner:'NorthStar Logistics',driver:'Harpreet Singh',phone:'+91 98150 71562',cargo:'Textiles' },
  { id:'TRK-020',reg:'MH 20 FG 3946',type:'Open Truck 24 ft',capacity:12,location:'Aurangabad',status:'Unloading',destination:'Nashik',available:'Tomorrow, 08:30',owner:'Shah Transport',driver:'Santosh Shinde',phone:'+91 98230 40918',cargo:'Auto parts' }
];

export const initialFreight: Freight[] = [
  {id:'FR-2401',pickup:'Hyderabad',destination:'Bengaluru',cargo:'General goods',weight:12,date:'Today, 16:00',vehicle:'Container 32 ft',amount:42800,status:'Available',shipper:'Apex Consumer Goods'},
  {id:'FR-2402',pickup:'Pune',destination:'Mumbai',cargo:'Textiles',weight:8,date:'Today, 15:30',vehicle:'Open Truck 24 ft',amount:18600,status:'Available',shipper:'Kaveri Textiles'},
  {id:'FR-2403',pickup:'Delhi',destination:'Jaipur',cargo:'Packaged foods',weight:14,date:'Today, 18:00',vehicle:'Container 32 ft',amount:29400,status:'Available',shipper:'Harvest Foods India'},
  {id:'FR-2404',pickup:'Chennai',destination:'Bengaluru',cargo:'Pharmaceuticals',weight:7,date:'Tomorrow, 07:00',vehicle:'Refrigerated 20 ft',amount:32200,status:'Available',shipper:'Medline Distributors'},
  {id:'FR-2405',pickup:'Bengaluru',destination:'Hyderabad',cargo:'Industrial parts',weight:16,date:'Today, 14:30',vehicle:'Open Truck 32 ft',amount:39600,status:'Matched',shipper:'Prism Auto Systems'},
  {id:'FR-2406',pickup:'Mumbai',destination:'Pune',cargo:'Dairy products',weight:9,date:'Today, 19:00',vehicle:'Refrigerated 20 ft',amount:24100,status:'Available',shipper:'FreshCart Foods'},
  {id:'FR-2407',pickup:'Jaipur',destination:'Delhi',cargo:'Building materials',weight:11,date:'Today, 17:00',vehicle:'Open Truck 24 ft',amount:21800,status:'Available',shipper:'RajBuild Supply'},
  {id:'FR-2408',pickup:'Hyderabad',destination:'Vijayawada',cargo:'Auto components',weight:6,date:'Tomorrow, 08:00',vehicle:'Container 20 ft',amount:17400,status:'Available',shipper:'Deccan Motors'},
  {id:'FR-2409',pickup:'Bengaluru',destination:'Chennai',cargo:'Consumer electronics',weight:10,date:'Tomorrow, 06:30',vehicle:'Container 32 ft',amount:35800,status:'Available',shipper:'Nova Electronics'},
  {id:'FR-2410',pickup:'Ahmedabad',destination:'Mumbai',cargo:'Textiles',weight:8,date:'Tomorrow, 09:00',vehicle:'Container 20 ft',amount:22600,status:'Available',shipper:'Shree Fabrics'},
  {id:'FR-2411',pickup:'Vijayawada',destination:'Hyderabad',cargo:'Agri inputs',weight:10,date:'Today, 15:00',vehicle:'Open Truck 24 ft',amount:20800,status:'Available',shipper:'GreenField Agri'},
  {id:'FR-2412',pickup:'Kochi',destination:'Bengaluru',cargo:'Seafood',weight:7,date:'Tomorrow, 05:00',vehicle:'Refrigerated 20 ft',amount:34600,status:'Available',shipper:'Malabar Fresh'},
  {id:'FR-2413',pickup:'Kolkata',destination:'Patna',cargo:'Industrial goods',weight:9,date:'Tomorrow, 06:00',vehicle:'Open Truck 24 ft',amount:26400,status:'Available',shipper:'Eastern Engineering'},
  {id:'FR-2414',pickup:'Nashik',destination:'Pune',cargo:'Fresh produce',weight:12,date:'Today, 17:30',vehicle:'Open Truck 32 ft',amount:19500,status:'Available',shipper:'Sahyadri Farms'},
  {id:'FR-2415',pickup:'Noida',destination:'Delhi',cargo:'Home appliances',weight:14,date:'Today, 20:00',vehicle:'Container 32 ft',amount:15600,status:'In transit',shipper:'Urban Home Retail'}
];

export const initialBookings: Booking[] = [
  {id:'BK-7801',truck:'TRK-001',freight:'FR-2405',shipper:'Prism Auto Systems',transporter:'Patil Roadways',pickup:'Bengaluru',destination:'Hyderabad',amount:39600,status:'In transit'},
  {id:'BK-7802',truck:'TRK-003',freight:'FR-2403',shipper:'Harvest Foods India',transporter:'NorthStar Logistics',pickup:'Delhi',destination:'Jaipur',amount:29400,status:'Confirmed'},
  {id:'BK-7803',truck:'TRK-004',freight:'FR-2412',shipper:'Malabar Fresh',transporter:'Southern Freight Co.',pickup:'Chennai',destination:'Bengaluru',amount:34600,status:'Pending'},
  {id:'BK-7804',truck:'TRK-006',freight:'FR-2410',shipper:'Shree Fabrics',transporter:'Shah Transport',pickup:'Ahmedabad',destination:'Mumbai',amount:22600,status:'In transit'},
  {id:'BK-7805',truck:'TRK-009',freight:'FR-2406',shipper:'FreshCart Foods',transporter:'Western Carriers',pickup:'Mumbai',destination:'Pune',amount:24100,status:'Confirmed'},
  {id:'BK-7806',truck:'TRK-011',freight:'FR-2415',shipper:'Urban Home Retail',transporter:'NorthStar Logistics',pickup:'Noida',destination:'Delhi',amount:15600,status:'Delivered'},
  {id:'BK-7807',truck:'TRK-014',freight:'FR-2414',shipper:'Sahyadri Farms',transporter:'Western Carriers',pickup:'Nashik',destination:'Pune',amount:19500,status:'In transit'},
  {id:'BK-7808',truck:'TRK-016',freight:'FR-2413',shipper:'Eastern Engineering',transporter:'EastLine Transport',pickup:'Kolkata',destination:'Patna',amount:26400,status:'Confirmed'},
  {id:'BK-7809',truck:'TRK-018',freight:'FR-2409',shipper:'Nova Electronics',transporter:'Southern Freight Co.',pickup:'Bengaluru',destination:'Chennai',amount:35800,status:'Delivered'},
  {id:'BK-7810',truck:'TRK-020',freight:'FR-2408',shipper:'Deccan Motors',transporter:'Shah Transport',pickup:'Hyderabad',destination:'Vijayawada',amount:17400,status:'Pending'}
];

export const navItems = [
  {label:'Overview', icon:'layout'}, {label:'Freight matching', icon:'match'}, {label:'Truck management', icon:'truck'},
  {label:'Return loads', icon:'return'}, {label:'Route visibility', icon:'route'}, {label:'Fleet analytics', icon:'chart'},
  {label:'Bookings', icon:'bookings'}, {label:'Settings', icon:'settings'}
];

export const trendData = [
  {day:'Mon',loaded:68,empty:32,util:62,demand:48}, {day:'Tue',loaded:74,empty:26,util:67,demand:62},
  {day:'Wed',loaded:71,empty:29,util:65,demand:54}, {day:'Thu',loaded:82,empty:18,util:73,demand:74},
  {day:'Fri',loaded:78,empty:22,util:70,demand:68}, {day:'Sat',loaded:88,empty:12,util:78,demand:86},
  {day:'Sun',loaded:76,empty:24,util:68,demand:58}
];

export const routes = [
  {name:'Bengaluru → Hyderabad', trucks:42, loads:18, km:570, fill:84},
  {name:'Mumbai → Pune', trucks:38, loads:25, km:150, fill:76},
  {name:'Delhi → Jaipur', trucks:31, loads:14, km:280, fill:68},
  {name:'Chennai → Bengaluru', trucks:27, loads:12, km:350, fill:72},
  {name:'Hyderabad → Vijayawada', trucks:22, loads:16, km:275, fill:63}
];
