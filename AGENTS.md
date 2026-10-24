# Trive

Expo React Native on-demand logistics & courier navigation app. Drivers receive turn-by-turn GPS navigation, slide-to-confirm parcel pickup, and shift controls. Customers track live shipments, scan barcodes, and book delivery services. Behind the UI, a C++17 graph engine executes Dijkstra, BFS, Kruskal's MST, and DFS for sub-millisecond route calculation, radial rider dispatch, and warehouse network optimization.

This file is the project's memory: it holds every decision that is still true. Plans in `prompts/` are history.

## Commands

```bash
npx expo install <package>  # ALWAYS use instead of npm install: resolves SDK-compatible versions
npx expo start              # dev server
npx expo lint               # lint
npx tsc --noEmit            # type check
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
npx eas-cli@latest <cmd>    # EAS builds, submits, and updates
g++ -O3 cpp/main_benchmark.cpp -o cpp/benchmark # standalone C++ engine benchmark
```

## Expo

- Expo ships breaking changes every SDK release, so don't trust memory. Before touching an Expo, EAS, or React Native API, check the `expo` major version in `package.json` and read `https://docs.expo.dev/versions/v<major>.0.0/`. For anything else, start from `https://docs.expo.dev/llms.txt` and follow its links.
- Routes live in `src/app/`: every file is a screen and `_layout.tsx` files define navigators. Keep components, hooks, and utils outside `src/app/`.
- `ios/` and `android/` are generated (CNG). Never create or edit them by hand; configure native behavior and permissions (Location, Camera) in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. For custom native code, use a development build (`npx expo run:android` or `npx expo run:ios`).
- Styling is NativeWind (`className`) on Tailwind CSS, configured CSS-first in `src/global.css` (imported in `src/app/_layout.tsx`). No inline hex or arbitrary class values outside tokens.
- Animations run on the UI thread via `react-native-reanimated` worklets and `react-native-gesture-handler`.

## Who owns what

Each tool has one job. Ask before moving a responsibility to a different tool.

- **Auth & Tokens:** Firebase Auth manages user authentication, phone SMS OTP, and session tokens securely persisted via `expo-secure-store`. Zero business data in Firebase.
- **Content & Catalog:** Sanity CMS provides dynamic app content (service items: Create, Calculate, Receipts, Support; announcement banners, FAQs). Read via GROQ queries with `@sanity/client`. Sanity never stores user profiles or performs routing calculations.
- **Persistent Business Data:** PostgreSQL (target database) owns transactional business data: user profiles, parcel orders, shipment history, delivery statuses, and driver shift logs.
- **Graph & Route Engine:** Pure C++17 (`cpp/`) executes all intensive graph algorithms in memory. Exposed to React Native via `src/native/routing-engine.ts` with a dual-mode high-speed TypeScript fallback. C++ never touches UI, networking, or persistence.
  - **Dijkstra's Algorithm (`cpp/Dijkstra.cpp`):** Shortest path & turn-by-turn navigation with `std::priority_queue` Min-Heap ($\mathcal{O}((V+E)\log V)$). Drives the live GPS navigation polyline and ETA metrics (`1.5 mile, 10 min, 10:05 PM`).
  - **Breadth-First Search (`cpp/BFS.cpp`):** Concentric radial search ($\mathcal{O}(V+E)$) from parcel origin to find the nearest active courier for order dispatch ("Looking for Courier").
  - **Kruskal's Algorithm (`cpp/Kruskal.cpp`):** Warehouse hub network Minimum Spanning Tree (MST) using Disjoint Set Union (DSU with path compression & union-by-rank, $\mathcal{O}(E\log E)$) for optimal inter-facility transit routing.
  - **Depth-First Search (`cpp/DFS.cpp`):** Cycle and dead-end detection for one-way street grids ($\mathcal{O}(V+E)$) and delivery pickup dependency verification.
- **Analytics & Telemetry:** PostHog (`posthog-react-native`), identified through Clerk. Tracks interaction funnels (`order_pickup_swiped`, `shift_status_toggled`, `service_grid_clicked`) and algorithm execution benchmarks (`dsa_benchmark_executed`). PostHog never blocks the app and never drives UI state.

## Rules

- Secret keys (Clerk secret key, Sanity write tokens, DB credentials) never reach the mobile client bundle. Use only `EXPO_PUBLIC_*` for client-safe keys. Never commit `.env` or `.env.local`. Keep variable templates in `.env.example`.
- Strictly zero `any`. Every function signature, state variable, and API contract must have explicit TypeScript types in `src/types/`.
- Never block the JavaScript main thread with graph computation — run calculations inside C++ or asynchronous workers.
- Never mix screen routing files (`src/app/`) with raw reusable component primitives (`src/components/`).
- Never use unstyled native alert dialogs. Use themed bottom sheets and branded feedback components.
- PostHog failures must never crash or block the app. Never send user passwords, credentials, or sensitive location traces in telemetry.
- Always trigger physical haptic feedback (`expo-haptics`) on critical gestures: slider release, shift toggle, tab change.
- Safe Area insets (`useSafeAreaInsets`) must dynamically compute top and bottom offsets for floating elements (Floating Navigation Bar, Turn HUD).
- Ask before adding or removing packages (`npx expo install`), modifying schemas/interfaces, or refactoring existing working code.
- If anything is unclear, ambiguous, or underspecified — **stop and ask the user first** with clear selectable options before writing code.

## How we build features

For a new feature or change. Work on **one feature at a time**.

1. **Understand.** Read the relevant code and design specifications. Read current Expo SDK 57 docs for APIs used.
2. **Ask.** If any requirement, edge case, or user intent is unclear, ask the user first with 2–4 clear options (recommended option first).
3. **Plan.** Outline the exact files to create/modify, interfaces needed, and steps to build.
4. **IMPORTANT: stop and wait.** Do not write application code until the user approves the plan.
5. **Build.** Implement step-by-step, adhering strictly to NativeWind design tokens and C++ memory safety.
6. **Verify.** Run `npx tsc --noEmit` and `npx expo lint`. Fix all errors before declaring done.
7. **Close out.** Provide the standard Report. Never start feature $N+1$ until feature $N$ is verified.

## Building from designs

Screens must match the UI design sample with pixel precision:

- **Screen 1: Order Details & Pickup Modal (`/order/[id]`)**:
  - Green gradient card with tracking `#F165G258`, 3D parcel graphic, and "Looking for Courier" van status badge.
  - Specifications table: Service (Express Parcel), Receiver (Emily Carter), Address (2210 Coral Way, Apt 3C), Package Type, Payment Method (Cash on Delivery).
  - Handling notes box: *"Please ensure the package is handled with care - fragile items inside."*
  - Reanimated `SlideToConfirm` interactive swipe slider ("Slide to pick up the order") with haptic feedback.
  - Action footer: "Contact support" pill button, Chat icon button, Call icon button.
- **Screen 2: Live Navigation & Active Shift (`/driver/navigation`)**:
  - Floating white turn-by-turn HUD header (`↰ 50 ft - 1024 Ocean Dr`).
  - Dark "Pause shift" pill button.
  - Stylized map with animated vehicle marker, pickup/drop pins, and pink route polyline.
  - Live **DSA Metrics HUD** displaying algorithm used (`Dijkstra [C++]`), node count, and compute latency in milliseconds.
  - Bottom trip metrics sheet (`1.5 mile`, `10 min`, `10:05 PM`) with timeline slider.
- **Screen 3: Customer & Courier Dashboard (`/(tabs)/index`)**:
  - Profile header: avatar, name ("Emily Carter"), subtitle address, notification bell.
  - Search bar: "Track your shipment..." with package/barcode scanner button.
  - Current Deliveries carousel with pastel gradient cards (`#CB1AD25`), arrival time, and 3D package visuals.
  - 4-column Services Grid: Create (box), Calculate (discount/calc), Receipts (invoice), Support (headset/lifebuoy).
  - Delivery History list (`#A856K005` Received, `#CA19WS8`) with "See all" trigger.
  - Floating dark capsule bottom nav bar with active pink glow indicator.

## Design system

- Tokens live in `src/global.css` (`@theme`). Palette:
  - Background: `#F8F9FA` / `#FFFFFF`
  - Dark Surface / Pill: `#111111`
  - Accent Pink: `#FF2D55` (pins, slider thumb, active tab dot)
  - Card Gradients: Green `#DCFCE7` to `#BBF7D0`, Coral `#FFE4E6` to `#FECDD3`, Peach `#FEF3C7` to `#FDE68A`, Lavender `#E0E7FF` to `#C7D2FE`.
- Typography: Clean modern sans-serif (Inter / SF Pro), weights driven by tokens (`font-bold`, `font-semibold`, `font-medium`), never arbitrary font sizes.
- Floating Nav: Rounded-full capsule positioned `absolute bottom-6 self-center bg-neutral-900 px-6 py-3.5 shadow-2xl`.

## Reporting

End every piece of work that changes code with this report:

- **Done:** One line on the outcome, then files changed and what changed in each.
- **Verified:** Each check with ✅ or ❌ and its evidence (`npx tsc --noEmit`, `npx expo lint`, C++ test run).
- **You need to:** Actions only the user can take (API keys, `.env` setup, dashboard toggles).
- **Test it yourself:** Numbered steps to reproduce and verify on device/simulator with `Expected:` outcome.
- **Notes:** Trade-offs, assumptions made, or next micro-feature to tackle.

## Checks

- `npx tsc --noEmit` and `npx expo lint` pass with zero errors before calling any task done.
- UI elements match design screenshot dimensions, colors, and border radii.
- Reanimated gesture sliders run smoothly at 60/120 FPS on the UI thread without dropping frames.
- C++ graph algorithms verify with unit tests in `cpp/main_benchmark.cpp`.
