import Image from "next/image";

const prerequisites = [
  "Launchpad administrator access to both the Fiori Launchpad Designer (FLPD) and the SAP GUI backend.",
  "A trusted RFC destination (system alias) that points to the SAP ECC or S/4HANA system exposing the target transaction.",
  "The transaction code you want to expose (example used here: VA01 – Create Sales Order).",
  "Knowledge of the business catalog and group naming conventions enforced in your organization (for compliance and transport consistency).",
];

const preparation = [
  "Confirm the target backend system is reachable through the configured system alias by testing an existing SAP GUI for HTML tile.",
  "Collect semantic object and action pairs used by your UX guidelines or derive new ones that properly describe the business intent (e.g., SalesOrder/create).",
  "Identify the PFCG role that ultimately owns the catalog and group assignments; if it does not exist, plan a transportable role name ahead of time.",
  "Take note of the transport request that will capture both FLPD and PFCG changes before you begin editing content.",
];

const steps = [
  {
    title: "Open Launchpad Designer",
    id: "step-1",
    summary:
      "Enter the SAP Fiori Launchpad Designer (FLPD) to maintain catalogs, target mappings, and groups. Use the /UI2/FLPD_CUST transaction for customizing scope.",
    actions: [
      "Sign into the SAP Fiori Launchpad with a user that has administrator rights, then launch the Designer (tile or direct URL /ui2/flpd_cust).",
      "Switch to the correct client (e.g., 100) matching your customizing transport layer so that your changes land in the correct configuration space.",
      "Verify the catalog layer indicator (Customizing vs. Configuration) at the top-right to ensure you are in the intended maintenance mode.",
    ],
    screenshot: "/screenshots/step1.png",
  },
  {
    title: "Create Business Catalog",
    id: "step-2",
    summary:
      "Catalogs hold the tiles and target mappings. Create or clone a custom catalog that will host your new transaction tile.",
    actions: [
      "In FLPD, open the Catalogs tab and click the + Catalog button to start a new catalog definition.",
      "Enter a technical catalog ID (e.g., ZCAT420) and a descriptive title such as 'Sales Document Processing'.",
      "Assign the catalog to an existing transport request when prompted so the artifact can be moved across systems.",
    ],
    screenshot: "/screenshots/step2.png",
  },
  {
    title: "Add Target Mapping",
    id: "step-3",
    summary:
      "Target mappings define how the system resolves a tile click. Configure the mapping to launch the SAP GUI transaction via SAP GUI for HTML.",
    actions: [
      "Inside the new catalog, switch to the Target Mapping tab and press + to create a mapping entry.",
      "Choose Application Type = SAP GUI for HTML and set the Transaction field to your tcode (VA01 in this example).",
      "Enter a meaningful description; this shows up when other admins reuse your mapping.",
    ],
    screenshot: "/screenshots/step3.png",
  },
  {
    title: "Configure Target Parameters",
    id: "step-4",
    summary:
      "Complete semantic object, action, and system alias fields so that the resolution engine can find the backend transaction.",
    actions: [
      "Set Semantic Object = SalesOrder and Action = create (or reuse objects from your UX governance list).",
      "Select the correct System Alias that points to the SAP backend where the transaction resides.",
      "Save the mapping and confirm the status indicator shows a green checkmark, signalling a resolvable intent.",
    ],
    screenshot: "/screenshots/step4.png",
  },
  {
    title: "Create Tile",
    id: "step-5",
    summary:
      "Design the tile that business users will see. Link it to the target mapping created in the previous step.",
    actions: [
      "With the catalog still open, switch to the Tiles tab and choose + Tile. Pick the Static tile template.",
      "Fill the Tile Title (Create Sales Order), Subtitle (Optional), and Information texts to guide end users.",
      "In the Target Mapping drop-down, select the mapping you saved so the tile inherits the intent.",
    ],
    screenshot: "/screenshots/step5.png",
  },
  {
    title: "Add Tile to Group",
    id: "step-6",
    summary:
      "Groups determine where tiles show up on the launchpad homepage. Add the tile to a security-controlled group.",
    actions: [
      "Navigate to the Groups tab, open an existing custom group (or press + Group to create one).",
      "Use + Tile inside the group, search by the catalog ID (ZCAT420), and select the 'Create Sales Order' tile.",
      "Reorder the tile if necessary to meet UX layout guidance, then save your changes to the group.",
    ],
    screenshot: "/screenshots/step6.png",
  },
  {
    title: "Assign Catalog and Group to PFCG Role",
    id: "step-7",
    summary:
      "Role maintenance (transaction PFCG) exposes the catalog and group to users. Without this step, the tile remains hidden.",
    actions: [
      "Launch the SAP GUI, run transaction PFCG, and open or create role Z_FIORI_SD (copy from template roles when available).",
      "On the Menu tab choose SAP Fiori Tile Catalog > Add. Enter your catalog ID and confirm; repeat for the group assignment.",
      "Generate the role menu and maintain authorization objects (S_RFCACL, S_PERSONAS, etc.) so the user can launch VA01.",
    ],
    screenshot: "/screenshots/step7.png",
  },
  {
    title: "Test in Launchpad",
    id: "step-8",
    summary:
      "Validate the end-to-end scenario by assigning the role to a test user and launching the tile in the Fiori launchpad.",
    actions: [
      "Use transaction SU01 (or HR provisioning) to add role Z_FIORI_SD to a test user account and reset the user buffer (transaction SU56).",
      "Log into the Fiori Launchpad as the test user, refresh the home page, and locate the 'Create Sales Order' tile inside the chosen group.",
      "Click the tile and confirm the SAP GUI for HTML session starts transaction VA01 without authorization errors.",
    ],
    screenshot: "/screenshots/step8.png",
  },
];

const proTips = [
  {
    title: "Transport Strategy",
    detail:
      "Capture FLPD changes via /UI2/TRANSPORT and align transport requests with PFCG role transports to keep dependencies in sync across landscapes.",
  },
  {
    title: "Semantic Object Governance",
    detail:
      "Reusing standard semantic objects keeps search and intent-based navigation consistent. Only introduce custom objects when no fit-for-purpose standard exists.",
  },
  {
    title: "Performance",
    detail:
      "If the tcode loads slowly over SAP GUI for HTML, consider enabling SAP GUI for Windows launch (SAP Shortcut) using the appropriate target mapping option and the NWBC client.",
  },
  {
    title: "Security",
    detail:
      "Always run SU53 after test execution to verify authorizations and adjust the derived roles before handing off to end users.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-100">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 pt-16 sm:px-10 lg:px-16">
        <header className="rounded-3xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-slate-900 p-10 shadow-2xl backdrop-blur">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">
            SAP Fiori Launchpad • Transaction Tile Enablement
          </p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl lg:text-6xl">
            Create a Tile and Link It to a Transaction Code (TCode)
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-200">
            Follow this end-to-end walkthrough to expose a classic SAP GUI transaction inside the SAP Fiori Launchpad. The guide covers
            catalog creation, target mapping, tile setup, security role assignment, and post-go-live validation so you can confidently
            deliver production-ready Launchpad content.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-400/40 bg-slate-900/60 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
                What you need
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
                {prerequisites.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-200">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-cyan-400/40 bg-slate-900/60 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                Preparation checklist
              </h2>
              <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-slate-200">
                {preparation.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </header>

        <section className="flex flex-col gap-12">
          {steps.map((step, index) => (
            <article
              key={step.id}
              id={step.id}
              className="grid gap-10 rounded-3xl border border-slate-700/70 bg-slate-900/60 p-8 shadow-xl shadow-cyan-900/10 backdrop-blur sm:grid-cols-[minmax(0,1fr)] lg:grid-cols-[1.1fr_1fr]"
            >
              <div className="flex flex-col justify-center">
                <div className="mb-4 inline-flex items-center gap-3 text-emerald-200">
                  <span className="text-sm uppercase tracking-widest">Step {index + 1}</span>
                  <span className="h-px flex-1 bg-emerald-400/30" />
                </div>
                <h2 className="text-2xl font-semibold text-emerald-100 sm:text-3xl">
                  {step.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-200">
                  {step.summary}
                </p>
                <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-200">
                  {step.actions.map((action) => (
                    <li key={action} className="flex gap-3 rounded-xl border border-slate-700/60 bg-slate-900/50 p-4">
                      <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-200">
                        {index + 1}
                      </span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-950">
                  <Image
                    src={step.screenshot}
                    alt={`Screenshot for ${step.title}`}
                    fill
                    sizes="(min-width: 1024px) 400px, 100vw"
                    className="object-cover object-center"
                  />
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-700/70 bg-slate-900/60 p-8 shadow-xl shadow-emerald-900/10 backdrop-blur">
          <h2 className="text-2xl font-semibold text-emerald-100 sm:text-3xl">
            Pro tips before transport and go-live
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {proTips.map((tip) => (
              <div key={tip.title} className="rounded-2xl border border-emerald-400/30 bg-slate-950/70 p-6">
                <h3 className="text-lg font-semibold text-emerald-200">{tip.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-200">{tip.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-700/70 bg-slate-900/60 p-8 shadow-xl shadow-cyan-900/10 backdrop-blur">
          <h2 className="text-2xl font-semibold text-cyan-100 sm:text-3xl">Troubleshooting cheatsheet</h2>
          <div className="mt-6 space-y-6 text-sm leading-7 text-slate-200">
            <p>
              <strong className="text-emerald-200">Tile missing in launchpad:</strong> Verify the user inherits the catalog and group via role assignment and run transaction
              <span className="mx-1 rounded-md bg-slate-800 px-2 py-0.5 font-mono text-xs">/UI2/INVALIDATE_GLOBAL_CACHES</span> if caches are stale.
            </p>
            <p>
              <strong className="text-emerald-200">Authorization error on launch:</strong> Capture SU53 immediately after the failure or run STAUTHTRACE to identify missing
              objects related to the underlying tcode.
            </p>
            <p>
              <strong className="text-emerald-200">Wrong backend system:</strong> Confirm the system alias in the target mapping routes to the correct RFC destination and that
              the logical system is part of the defined trusted RFC list.
            </p>
            <p>
              <strong className="text-emerald-200">Tile icon or text changes:</strong> Adjust tile display properties directly in FLPD or maintain them centrally in the
              <span className="mx-1 rounded-md bg-slate-800 px-2 py-0.5 font-mono text-xs">/UI2/FLP_CONF</span> customizing table, then clear client cache.
            </p>
          </div>
        </section>

        <footer className="rounded-3xl border border-transparent bg-emerald-500/20 p-8 text-sm leading-7 text-emerald-100">
          <p>
            Delivering SAP GUI content through Fiori tiles bridges classic transactions with a consistent Launchpad experience. Use this checklist-driven
            approach whenever you onboard a new transaction so that catalogs, groups, and roles stay aligned across development, quality, and production
            systems.
          </p>
        </footer>
      </main>
    </div>
  );
}
