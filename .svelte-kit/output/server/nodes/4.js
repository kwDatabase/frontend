import * as server from '../entries/pages/admin/_page.server.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+page.server.js";
export const imports = ["_app/immutable/nodes/4.BrnoIc3z.js","_app/immutable/chunks/disclose-version.CzAtsLgl.js","_app/immutable/chunks/runtime.BFnpSPcI.js","_app/immutable/chunks/legacy.DZ_k--3L.js"];
export const stylesheets = [];
export const fonts = [];
