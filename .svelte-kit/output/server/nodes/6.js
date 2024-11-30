

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/categori/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.BN1tmhpL.js","_app/immutable/chunks/disclose-version.CzAtsLgl.js","_app/immutable/chunks/runtime.BFnpSPcI.js","_app/immutable/chunks/legacy.DZ_k--3L.js"];
export const stylesheets = [];
export const fonts = [];
