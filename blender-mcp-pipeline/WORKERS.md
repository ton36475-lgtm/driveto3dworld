# Worker isolation and handoff

A worker owns exactly one new output directory and one Blender process. Interactive MCP workers additionally own distinct local ports. Workers never write the same `.blend` file, never publish directly, and never update another worker's baseline.

| Role | Write scope | Handoff |
| --- | --- | --- |
| Structure | `build/structure-RUN/` | source revision, geometry contract, assumptions, baseline hash, structural source hash, GLB checks |
| Polish | `build/polish-RUN/` copied from accepted structure | original baseline hash, material intent, final source, changed-material list, independent structural check |
| Verify | own reports directory | source/output hashes, missing-object rejection, browser screenshots and route used |
| Merge | `public/models/` through `publish` | validated manifest, app revision, integration/browser results |

Concurrency is bounded by measured memory and CPU availability. Start with one Blender process on the Mac mini and increase only after measuring memory pressure. Four workers are not an automatic performance guarantee. Keep scene builds independent (salon props, grounds props, reference ingestion, web verification), so useful parallelism does not require simultaneous writes.

Use immutable inputs: each handoff includes `taskId`, `workerId`, `inputRevision`, `inputHashes`, `structureHash`, `outputDirectory`, `attempt`, `status`, `artifactHashes`, `checks`, and `remainingUnknowns`. A disconnected worker first checks its receipt and output hashes. Do not blindly rerun a publish or mutation on reconnect. One coordinator owns bounded retries; other layers return errors and evidence.

A hash in a worker-edited file is not independent approval. The verifier receives the expected baseline digest from the accepted handoff and rejects a replacement baseline. Structural corrections return to the structural stage with a new revision. Ordinary material changes do not get to change the floor plan, asset scale, object transforms, UV layout or topology.

MCP Studio is not included or installed by this repository. Its availability and worker behavior must be verified on the actual host. These local files do not prove the state of Hermes, Telegram, Cloudflare tunnels, another Codex session, or the user's Mac mini.
