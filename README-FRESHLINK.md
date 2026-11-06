# FreshLink

FreshLink is the second prototype in the Supply Chain Lab. It demonstrates a farm-to-market cold-chain coordination workflow: register a produce batch, connect it to a farm partner, find compatible cooling capacity, assign a refrigerated vehicle, monitor temperature exceptions, and preserve a batch-level traceability record.

## The problem and proposed value

Post-harvest loss is not caused by refrigeration alone. Produce can deteriorate because collection is delayed, field heat is not removed, handling is rough, storage is unsuitable, transport is delayed, or temperature records are missing. FreshLink proposes one coordination workspace for the handoffs between farmers/FPOs, packhouses, cold stores, reefer operators and buyers.

The important product idea is coordination and evidence: choose crop-appropriate handling, reserve compatible capacity, assign enough refrigerated capacity, record exceptions and keep one batch history. It is not a replacement for physical infrastructure, food-safety expertise or validated operating protocols.

## The quickest manager demonstration

1. Open **Overview** and explain that the KPIs are illustrative network snapshots, not measured business results.
2. Click **Run FreshLink demo**. Continue the eight steps one at a time: register an 8-tonne tomato batch, schedule pickup, book a compatible packhouse, record pre-cooling, assign a reefer, raise a temperature excursion, resolve it with corrective action, and complete buyer delivery.
3. Open **Traceability** to show the batch passport and timeline created by those actions. Click **Generate QR passport** or **View QR code**.
4. Open **Temperature & alerts** to show why a threshold breach creates an inspection task rather than automatically declaring spoilage.
5. Open **Bookings** to show the storage reservation. Explain that capacity was reduced when the booking was made.
6. Use **Reset demo data** in the sidebar or Settings to replay the walkthrough.

## Side-menu guide

| Tab | Purpose and how to use it |
|---|---|
| **Overview** | The control-tower landing page: batch, shipment, facility, reefer, capacity and alert KPIs; recent activity; and the eight-step FreshLink journey. **Run FreshLink demo / Continue demo** advances exactly one scenario step. **Batch passport** opens Traceability for the selected batch. |
| **Batches** | The batch register from harvest to delivery. Search by batch, crop, FPO, farm or variety; filter by commodity and status. Click a batch ID or the arrow to open its details, update its status, see its current temperature/facility/vehicle, or open its QR passport. **Register batch** creates a batch with crop, variety, FPO, origin, harvest date, quantity, grade and buyer destination. Quantity must be positive. |
| **Farms & FPOs** | The supply-side partner directory. Search by organization/location and filter by commodity. It shows crop focus, available produce, collection status, contact and registered batches. **Add FPO** records a farm partner and its expected available produce. |
| **Cold storage** | Cooling centres, packhouses and cold stores. It shows capacity, occupied/available kilograms, supported crops, temperature band and utilization. **Add facility** adds a partner site. **Book storage** or **Reserve compatible capacity** chooses a batch, facility and quantity. FreshLink rejects unsupported crops, temperature bands and quantities above remaining capacity; a successful booking reduces facility availability and updates the batch. |
| **Refrigerated transport** | The demo reefer directory: vehicle/operator, nominal capacity, location, temperature band, current shipment and status. Search the fleet. **Assign vehicle** chooses a batch and an available vehicle; capacity must cover the entire batch. A successful assignment creates a shipment, marks the vehicle in transit and appends a batch event. This is nominal capacity validation, not live GPS or telematics validation. |
| **Temperature & alerts** | Crop-specific monitoring and exception handling. Select a monitored batch and view its configured temperature and humidity range. **Simulate warming** or **Simulate cooling** changes the demo reading; **Start live simulation** changes the reading periodically in the browser. If the reading crosses the crop range, an alert is created. **Acknowledge** records that someone has seen it. **Resolve with action** requires a corrective-action note and retains the original alert. A breach means inspect and respond—it does not prove spoilage. |
| **Shipments** | Schematic route visibility and shipment status. The map is illustrative, not GPS. **Assign vehicle** repeats the transport workflow. Select the arrow on a shipment to open that batch’s Traceability passport. |
| **Traceability** | The batch passport: origin, FPO, harvest, quantity, grade, handling target, current condition, destination, reefer and event timeline. Change the selected batch, then **Generate QR passport** or **View QR code**. The QR points back to this app’s `/freshlink?batch=...` route; it is a demo identity, not an independently certified food-safety record. |
| **Analytics** | Sample operational KPIs and charts for commodity volume, saleable quantity, first cooling, excursions, utilization, quality rejection and cost per tonne. **Export CSV** downloads the displayed demo metrics. Baseline-versus-assisted loss values are hypothetical models and must not be presented as pilot results. |
| **Bookings** | Storage reservations and their batch/facility/quantity relationship. **Book storage** opens the same compatibility-checked booking form. This prototype records operational reservations only; it does not process payments or send orders to facilities. |
| **Settings** | Browser-only company name, preferred crop coverage, temperature-exception and daily-digest preferences, plus crop handling reference ranges. **Save preferences** persists settings locally. **Reset FreshLink demo data** restores FreshLink’s original records and does not reset FreightLoop. |

## How the workflow connects

`Farms & FPOs` supplies the batch origin → `Batches` creates the identity → `Cold storage` checks crop and temperature compatibility and reserves capacity → `Refrigerated transport` checks vehicle capacity and creates a shipment → `Temperature & alerts` records exceptions and corrective action → `Shipments` shows the route record → `Traceability` presents the complete passport → `Bookings` and `Analytics` summarize the operational record.

The guided scenario uses batch **FL-26001**, tomatoes from Kolar to Bengaluru, and advances the same record through all eight stages. Events are appended to the batch timeline, so the manager can see what changed at each step.

## Important validation rules

- Crop handling is crop-specific. The demo references ranges such as tomatoes **8–12°C**, grapes **0–2°C** and bananas **13–14°C**; these are sample defaults and require expert validation before operations.
- A facility must support the crop and its temperature band, and have enough free kilograms for a booking.
- A reefer must be available and have at least the batch quantity as nominal capacity.
- A temperature excursion creates a reviewable alert; it is not an automatic quality or spoilage decision.
- Corrective action is recorded when an alert is resolved, and the original reading remains in history.

## What is real in the prototype

FreshLink has working browser interactions, form validation, capacity deductions, batch events, shipment creation, alert acknowledgement/resolution, QR generation, CSV export and local persistence through `localStorage`. Refreshing the same browser preserves demo changes.

All farmers, facilities, fleet records, quantities, temperatures, routes, KPIs and loss estimates are illustrative. There is no live sensor stream, GPS, payment, external facility booking, food-quality certification, notification delivery, authentication or backend database. A real pilot should start with one crop, one production cluster and one buyer corridor, then measure saleable yield, first-cooling time, excursion rate, rejection rate, utilization, cost per tonne and farmer realization against a defensible baseline.

## Run locally

From `D:\Project\supplychain`:

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js (normally `http://localhost:3000/freshlink`). This guide is for FreshLink only; FreightLoop has its own [README.md](README.md).
