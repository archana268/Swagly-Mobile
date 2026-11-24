# Swagly – First Lotus-inspired Shopping UI Iteration

This package preserves your existing Expo SDK 58 project and Swagly API service (`https://swagly.in/api`).

## Changed
- New branded Home with search shortcut, informational hero, API categories and two-column product cards
- Functional Home / Categories / Search / Cart / Account bottom navigation
- Category product listing using the existing category endpoint
- Local search over products returned by the existing home endpoint (not a server-wide search)
- Add to Cart from product cards and Product Details
- Redux cart quantity controls, removal and subtotal

## Important limitations
- Marketing hero uses original Swagly placeholder copy, not a live promotions feed
- Account and Checkout are clearly disabled pending real authentication/checkout endpoints
- Shopping cart is local Redux state and resets when the app process is restarted
- This is an initial Lotus-inspired shopping layout, not a pixel-identical copy of all Lotus screens, because publicly available store screenshots cannot expose all screens and interactions
- The original API endpoints and response shapes have been retained; the category parser supports multiple common response envelopes but requires real-device verification

## Run
1. Unzip into a separate directory, keeping your original project as a backup.
2. `npm install`
3. `npx expo-doctor`
4. `npx expo start --clear`

Do not include node_modules or temporary .expo files when sharing ZIPs.
