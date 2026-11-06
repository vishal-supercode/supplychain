# FreightLoop

FreightLoop is the first prototype in the Supply Chain Lab. It demonstrates how a fleet operator or logistics provider could match available trucks with suitable freight and find a compatible load for the return journey.

## The problem and proposed value

Trucks can travel empty after a delivery because freight demand is uneven by direction, shipment and truck information is scattered, and a nearby load may not fit the vehicle, timing or cargo requirements. Empty running adds cost without carrying freight.

FreightLoop brings sample truck availability and freight listings into one workspace. It checks whether a load is feasible for a truck, shows why a match is or is not suitable, and connects assignment with booking and delivery-status tracking. Its proposed longer-term distinction is proactive availability planning, recurring-lane collaboration and trip-level economics—not merely another load board. As the research recommends, those benefits still need validation through a focused corridor pilot.

## A quick way to present it

1. Open **Overview** and explain that the dashboard summarizes a fictional Bengaluru–Hyderabad corridor and shows sample fleet, freight and utilization indicators.
2. Select **Run demo simulation**. The scenario assigns an available Hyderabad truck to a compatible return load to Bengaluru and updates the illustrative booking and dashboard metrics.
3. Open **Freight matching** to inspect the load, select a truck and review match feasibility and scoring reasons. Explain that hard constraints can block a match; a high score does not override incompatibility.
4. Open **Bookings** to show the resulting assignment and move its status through the demo workflow. Then return to **Overview** or **Fleet analytics** to discuss the modeled utilization change.

Use **Reset demo data** in Settings before repeating the presentation.

## Side menu: what each tab is for

| Tab | What it shows and how to use it |
|---|---|
| **Overview** | At-a-glance fleet, available trucks, active loads, match and utilization indicators; corridor demand, recent activity and the demo scenario. Use **Run demo simulation** or **Try simulation** to play the return-load example. **Export report** downloads an overview CSV. |
| **Freight matching** | The open-load board and candidate truck/load match. Search or filter by pickup, destination, cargo, vehicle, weight and date. Select a load and truck to see feasibility and match reasons; choose the assignment action to create a booking. **Add freight load** publishes a sample listing. **How scoring works** explains the illustrative score. |
| **Truck management** | Search trucks and filter by status. Select a row to inspect its profile and current assignment. **Add a truck** or **Edit truck** records demo vehicle details. From a truck profile, **Find a load** opens Freight matching with that truck selected. |
| **Return loads** | Return-leg opportunities for trucks that would otherwise reposition or travel empty. Review the compatible backhaul and its route/economic summary, then assign it; **Run simulation** plays the featured corridor example. |
| **Route visibility** | A schematic view of sample corridors and truck positions. Select a corridor to focus the list/map or inspect a vehicle. **Refresh** only refreshes the simulated view—there is no GPS connection. |
| **Fleet analytics** | Charts and sample indicators for loaded/empty kilometres, utilization, corridor demand and modeled costs. Change the time range, route or vehicle filters. The baseline-versus-assisted comparison is hypothetical, not a measured saving. |
| **Bookings** | Confirmed sample matches and shipment status. Search/filter bookings and use **Update status** to move through pending, confirmed, in-transit and delivered states. Marking a booking delivered also returns its truck to available status in the demo. |
| **Settings** | Edit the local workspace name, fleet preference and notification toggles. **Save changes** stores them in this browser. **Reset demo data** restores the bundled starting trucks, freight, bookings and settings. |

The top-bar search sends matching text to the freight list. The bell opens sample notifications; **View opportunities** takes you to Return loads. On small screens, use the menu button to open or close the side navigation. Changes are saved in browser local storage, not shared with another computer or user.

## How the match recommendations work

The percentage is a transparent rule score out of 100, **not the probability a load will succeed**. The same matching engine powers both **Freight matching** and **Return loads**:

| Scoring factor | Maximum | How points are awarded |
|---|---:|---|
| Distance to pickup | 25 | 25 points if within 20 km; 18 within 60 km; 8 within 120 km; otherwise 0. |
| Route fit | 20 | Freight matching gives 20. Return loads compare delivery city with the selected home destination: 20 within 20 km, 12 within 80 km, otherwise 0. |
| Vehicle and cargo type | 20 | 20 if the truck body/type matches the load's required vehicle; otherwise 0. |
| Payload capacity | 15 | 15 if truck capacity is at least the load weight; otherwise 0. |
| Pickup timing | 10 | 10 if the truck can reach pickup by the listed time, allowing a 30-minute demo window; otherwise 0. Travel-to-pickup time is estimated at 45 km/hour. |
| Estimated trip contribution | 10 | 10 if estimated contribution is at least ₹10,000; 6 if at least ₹3,000; otherwise 0. |

**Estimated contribution** = listed freight amount − illustrative operating cost. The cost model is: pickup repositioning km × ₹32 + loaded route km × ₹22 + ₹1,500 fixed cost; Return loads also add delivery-to-home km × ₹20. Distances are approximate straight-line distances adjusted by a road factor, not map-routed quotes.

### What happens in each screen

- **Freight matching:** first select a freight row, then select an available truck in **Match with available truck**. The **Match recommendation** panel scores that specific truck/load pair and shows the factor-by-factor points, distance, estimated cost and contribution. Change the truck or load to recalculate. **Assign truck to load** is enabled only if all feasibility checks pass.
- **Return loads:** choose the truck and **Return destination**. Each available freight load is scored against that truck and the desired home corridor. The list ranks feasible loads first, then higher scores, and displays up to four options. Each percentage is the same 100-point score, with the route-fit points based on how close the load's delivery is to the selected return destination. **Accept return load** assigns a feasible option.

The score and feasibility are separate. Even with points in the score, assignment is blocked if the truck is not available, freight is already assigned, vehicle type differs, payload is too heavy, pickup is over 120 km away, timing fails, return delivery is over 80 km from the selected home destination, or estimated contribution is below ₹3,000. Seafood also requires the refrigerated truck type. Read the displayed **not feasible** reason; a higher percentage never overrides a hard constraint.

## What the prototype does—and does not do

The match logic screens sample listings against vehicle type, capacity, route and timing constraints, then gives a transparent illustrative ranking. The guided scenario uses the sample Hyderabad → Bengaluru load (FR-2401) and truck TRK-008, and updates the associated booking, truck, freight and modeled dashboard figures. Reset restores the original sample state.

All companies, trips, match rates, financial values, locations and analytics are illustrative. The prototype has no live freight exchange, fleet telematics/GPS, payments, external notifications, identity verification or real-world availability. A real pilot would need consented and verified operator data, partner workflows and measured outcomes—especially completed backhauls, empty kilometres, detours, on-time delivery and incremental contribution per trip. Digital freight marketplaces already exist; FreightLoop's differentiated planning hypothesis is not yet proven.

## Run locally

From this project folder:

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js (normally `http://localhost:3000`). The other prototype routes are separate; this guide covers FreightLoop only.
