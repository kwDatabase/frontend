

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/auth/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.B6VpiaSP.js","_app/immutable/chunks/disclose-version.CzAtsLgl.js","_app/immutable/chunks/runtime.BFnpSPcI.js","_app/immutable/chunks/legacy.DZ_k--3L.js"];
export const stylesheets = [];
export const fonts = [];
