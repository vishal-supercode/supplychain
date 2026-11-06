import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { createSupplyState } from "../lib/supplylens-data";
import {
  impactFor,
  alternativeFit,
  simulateDisruption,
} from "../lib/supplylens-logic";

test.use({
  channel: "chrome",
  baseURL: process.env.TEST_BASE_URL || "http://localhost:3011",
});

test("SupplyLens guided upstream disruption and mitigation journey", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/supplylens");
  await expect(
    page.getByRole("heading", { name: "See beyond your suppliers." }),
  ).toBeVisible();
  await expect(page.getByText("36").first()).toBeVisible();
  await page
    .getByRole("button", { name: "Run SupplyLens Demo" })
    .first()
    .click();
  await expect(
    page.getByRole("heading", { name: "Dependency & impact analysis" }),
  ).toBeVisible();
  await expect(page.getByText("Hypothetical shutdown active")).toBeVisible();
  await expect(page.getByText("12 days")).toBeVisible();
  await expect(
    page.getByText("Open purchase orders under review"),
  ).toBeVisible();
  await page.getByRole("button", { name: /Continue: network/ }).click();
  await expect(
    page.getByRole("heading", { name: "Multi-tier supplier network" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Continue demo: trace impact/ }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: /Continue demo: trace impact/ })
    .click();
  await page.getByRole("button", { name: /Continue: mitigation/ }).click();
  await expect(
    page.getByRole("heading", { name: "Mitigation & alternatives" }),
  ).toBeVisible();
  await expect(page.getByText("Qualification required").first()).toBeDisabled();
  await page
    .getByRole("button", { name: "Assign procurement action", exact: true })
    .first()
    .click();
  await expect(page.getByText(/Validate .*preferred ALT-101/)).toBeVisible();
  await page.getByRole("button", { name: "Suppliers", exact: true }).click();
  await page.getByRole("button", { name: "Add supplier" }).click();
  await page.getByLabel("Company name").fill("Prototype Test Supplier");
  await page
    .getByRole("button", { name: "Add supplier", exact: true })
    .last()
    .click();
  await expect(page.getByText("Prototype Test Supplier")).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Suppliers", exact: true }).click();
  await expect(page.getByText("Prototype Test Supplier")).toBeVisible();
  await page.getByRole("button", { name: "Reset demo data" }).click();
  await expect(page.getByText("Demo network reset.")).toBeVisible();
  expect(errors).toEqual([]);
});

test("verification evidence, relationship provenance, reports and settings persist", async ({
  page,
}) => {
  await page.goto("/supplylens");
  await page.getByRole("button", { name: "Verification", exact: true }).click();
  await page
    .getByLabel("Verification S1-02", { exact: true })
    .selectOption("Verified");
  await expect(
    page.getByText(
      "Attach a demo evidence reference before marking this supplier verified.",
    ),
  ).toBeVisible();
  await expect(
    page.getByLabel("Verification S1-02", { exact: true }),
  ).not.toHaveValue("Verified");
  await page
    .getByLabel("Evidence supplier", { exact: true })
    .selectOption("S1-02");
  await page
    .getByLabel("Evidence title", { exact: true })
    .fill("DEMO site declaration");
  await page
    .getByLabel("Evidence reference or filename", { exact: true })
    .fill("DEMO-EVIDENCE-2026");
  await page
    .getByRole("button", { name: "Attach evidence record", exact: true })
    .click();
  await page
    .getByLabel("Verification S1-02", { exact: true })
    .selectOption("Verified");
  await page
    .getByRole("button", { name: "Supplier network", exact: true })
    .click();
  await page.getByText(/Manage supplier relationships/).click();
  await page
    .getByLabel("Relationship confidence", { exact: true })
    .selectOption("Inferred");
  await page
    .getByLabel("Source or demo evidence reference", { exact: true })
    .fill("DEMO unconfirmed dependency hypothesis");
  await page
    .getByRole("button", { name: "Add relationship", exact: true })
    .click();
  await expect(
    page.getByText(
      "Relationship saved. Network and dependency analysis have been updated.",
    ),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Reports & audit", exact: true })
    .click();
  const downloadEvent = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download Open incident report", exact: true })
    .click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe("supplylens-incidents-demo.csv");
  const csv = await readFile((await download.path())!, "utf8");
  expect(csv).toContain('"Incident","Supplier","Event"');
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await page
    .getByLabel("Company name", { exact: true })
    .fill("Demo Manufacturer India");
  await page
    .getByRole("button", { name: "Save settings", exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByText("Demo Manufacturer India", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Verification", exact: true }).click();
  await expect(
    page.getByLabel("Verification S1-02", { exact: true }),
  ).toHaveValue("Verified");
});

test("demo graph, BOM exposure and qualification rules are internally consistent", () => {
  const state = createSupplyState();
  expect(state.suppliers).toHaveLength(36);
  expect(state.relationships).toHaveLength(45);
  for (const tier of ["Tier 1", "Tier 2", "Tier 3"])
    expect(state.suppliers.filter((s) => s.tier === tier)).toHaveLength(12);
  const impact = impactFor(state, "S2-01");
  expect(impact.tier1).toHaveLength(2);
  expect(impact.components).toHaveLength(4);
  expect(impact.lines).toHaveLength(2);
  expect(impact.orders).toHaveLength(3);
  expect(impact.coverage).toBe(12);
  expect(impact.supplierIds).not.toContain("S2-02");
  expect(impactFor(state, "S1-01").components).toHaveLength(4);
  for (const po of state.purchaseOrders)
    expect(
      state.components.find((c) => c.id === po.componentId)?.tier2Suppliers,
    ).toContain(po.supplierId);
  expect(alternativeFit(state, "S2-01", state.alternatives[0]).eligible).toBe(
    true,
  );
  expect(alternativeFit(state, "S2-01", state.alternatives[2]).eligible).toBe(
    false,
  );
  const disrupted = simulateDisruption(state, "S2-01");
  expect(disrupted.suppliers.find((s) => s.id === "S2-02")).toEqual(
    state.suppliers.find((s) => s.id === "S2-02"),
  );
});

test("incident notes persist and all modules render", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/supplylens");
  await page.getByRole("button", { name: /Incidents/ }).click();
  await page
    .getByRole("button", { name: "Investigate", exact: true })
    .first()
    .click();
  await page
    .getByLabel("Add investigation note")
    .fill("Procurement to confirm capacity with supplier.");
  await page.getByRole("button", { name: "Save note" }).click();
  await expect(
    page
      .getByRole("dialog")
      .getByText("Procurement to confirm capacity with supplier."),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: /Incidents/ }).click();
  await page
    .getByRole("button", { name: "Investigate", exact: true })
    .first()
    .click();
  await expect(
    page
      .getByRole("dialog")
      .getByText("Procurement to confirm capacity with supplier."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close investigation" }).click();
  for (const name of [
    "Overview",
    "Supplier network",
    "Suppliers",
    "Risk monitoring",
    "Impact analysis",
    "Risk map",
    "Verification",
    "Mitigation",
    "Analytics",
    "Reports & audit",
    "Settings",
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    await expect(page.locator("h1").first()).toBeVisible();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Overview", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "See beyond your suppliers." }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
