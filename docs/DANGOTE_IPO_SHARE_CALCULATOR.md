# Dangote IPO Share Calculator

The calculator is available at `/ipo/share-calculator`. Its fee and share-price settings are in `lib/dangote-share-calculator.js` in the `DANGOTE_CALCULATOR_CONFIG` block. Staff can update the bank, FX, and other fixed USD costs there; the processing fee and share price are in the same block.

The rate is refreshed by the server scheduler registered in `instrumentation.js`. It fetches from open.er-api.com, falling back to the jsdelivr currency feed, and stores the last known good USD/NGN value in MongoDB. `RATE_REFRESH_INTERVAL_MINUTES` in the calculator config defaults to 60. A database lease prevents multiple app workers from refreshing at the same time. The read-only endpoint is `/api/exchange-rate`; the legacy `/api/dangote-ipo-rate` route is a cache-only alias. If no cached rate is available, clients can enter a manual rate. The calculator does not send or log the entered investment amount.

No rate-provider API key is required. The server needs the existing `MONGO_URL` and `DB_NAME` settings so the scheduler can store the cache.

Run the calculator and rate-cache unit tests with `node --test lib/dangote-share-calculator.test.mjs lib/dangote-rate-state.test.mjs lib/dangote-rate-service.test.mjs`.
