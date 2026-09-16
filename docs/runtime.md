# Reproducible local runtime

Use Node **24 LTS** (recommended) or **22.12+ within Node 22**, with npm 10 or
newer. The dependency tool checks this before attempting installation. Install
Node through your platform's trusted package manager or the official Node
installer. This repository does not run remote installer shell scripts or
install a system runtime for you.

From the checkout:

```sh
npm run bootstrap
npm run doctor
npm run dev
```

`dev`, `build`, `build:dev`, and `preview` run preflight automatically. A fresh
checkout, a changed lockfile/runtime, or a missing direct dependency triggers
`npm ci --ignore-scripts --include=dev --include=optional --no-audit --no-fund`.
Unchanged installations are reused. Bootstrap never changes the lockfile and
never runs dependency lifecycle scripts. The current lockfile's only declared
install script is optional `fsevents`; macOS file watching can use the fallback.
The tool verifies that Vite/rolldown, Tailwind and lightningcss native imports
work before marking the install healthy. No native rebuild exception is
currently needed. If an import fails, investigate the matching optional package
and platform rather than enabling every dependency script.

The local receipt in `node_modules/.sirinx-runtime.json` covers dependency
declarations, overrides, the lockfile, Node/npm versions and OS/architecture.
It also tracks npm's installed lockfile and checks direct package versions on
each run. It is a readiness record, **not** a cryptographic attestation of every
installed file. For a known corrupted transitive tree, remove that receipt and
run bootstrap to force a clean locked installation.

## Flags and secrets

The default portfolio needs no accounts, database credentials or API keys.
`docs/runtime-environment.example.json` is a public build-flag example for the
existing `.grok/app-env.json` wrapper; it contains no credentials. To explicitly
disable auth for a provider-controlled build, set `VITE_AUTH_ENABLED=false` in
that provider's build environment. Existing process environment values take
precedence over the local app-env file. Never put secrets in any `VITE_` value:
these values are compiled into browser code.

`APP_READY_TIMEOUT_MS` changes startup's HTTP timeout (default 60000; allowed
1000–300000). This variable is an ordinary shell/process value, not a Vite flag.
`APP_DEV_HOST=127.0.0.1` explicitly starts a loopback-only dev server when a
managed sandbox forbids network-interface enumeration. The default remains
`0.0.0.0`; this override does not change deployed or preview host settings.
For a foreground equivalent, use `npm run dev -- --host 127.0.0.1`.
No `.env` file is created or required by bootstrap.

## Startup and verification

`sh /absolute/path/to/checkout/startup.sh` works from another working directory.
It uses the existing npm/environment wrapper and preserves `0.0.0.0:8080`.
It waits for HTTP 200 containing the atelier HTML; a generic response, redirect,
404 or 500 does not count. Logs go to `.runtime/dev.log`. A failed new launch
stops only the process group it just created. It does not kill port owners or
the separate QA preview on 8081. An already responsive atelier can be reused;
the output explicitly states that HTTP checks do not prove its checkout identity.

```sh
npm run doctor -- --url http://127.0.0.1:8080
npm run verify:runtime
npm run test:runtime
npm test
npm run build
npm run typecheck
```

The HTTP verifier checks home, gallery, drive, studio and contact by default;
additional route paths may be supplied after the URL. HTTP success does not
prove WebGL, bilingual interactions, touch steering, export correctness, or
visual quality. Those need the browser and 3D-pipeline checks described in the
project's verification material. `npm run preview` starts the production-build
preview on 8081; it also runs preflight. The older `preview:restart/stop` helpers
are Linux sandbox tools and are not the portable macOS startup path.

Bootstrap serializes writers through `.runtime/dependencies.lock`; startup has
its own lock. A crashed owner's lock fails with its path and a recovery message.
Verify no install/start is active before removing the indicated stale lock.
Do not share one checkout's `node_modules` or locks across machines. Use separate
checkouts for simultaneous Blender/MCP workers. Bootstrap does not establish a
Mac mini connection, install Blender, start MCP, or certify a remote worker.

## CI boundary

The runtime workflow is configured to install from the lockfile with scripts
disabled, run unit tests, build, typecheck, and probe live dev routes on Linux
with Node 22 and 24. It then installs Chromium and runs the project's real
Playwright smoke on home, gallery, drive and forge at 360, 390, 768 and 1440 px.
Screenshots and JSON verdicts are retained for 14 days. Console errors, failed
navigation, horizontal overflow and explicitly requested baseline drift fail
the gate. Browser output paths are restricted to the checkout, so the workflow
also works under a GitHub runner path instead of assuming `/workspace`.

The build step comes before typecheck to generate TanStack's ignored route tree
on fresh checkouts. Configuring this workflow is not evidence that it has run;
report a completed workflow result before claiming its checks passed. It does
not deploy or certify macOS, connected devices, complete browser interaction
flows, production parity, or asset acceptance.
