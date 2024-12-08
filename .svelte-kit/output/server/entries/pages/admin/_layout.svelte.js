import { T as rest_props, V as fallback, R as setContext, _ as spread_attributes, Z as slot, X as bind_props, S as pop, Y as sanitize_props, Q as push, a5 as sanitize_slots, $ as getContext, a3 as attr, a0 as escape_html, a9 as ensure_array_like } from "../../../chunks/index.js";
import { twMerge } from "tailwind-merge";
import { w as writable } from "../../../chunks/index3.js";
function Sidebar($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "activeUrl",
    "asideClass",
    "nonActiveClass",
    "activeClass",
    "ariaLabel"
  ]);
  push();
  let activeUrl = fallback($$props["activeUrl"], "");
  let asideClass = fallback($$props["asideClass"], "w-64");
  let nonActiveClass = fallback($$props["nonActiveClass"], "flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700");
  let activeClass = fallback($$props["activeClass"], "flex items-center p-2 text-base font-normal text-gray-900 bg-gray-200 dark:bg-gray-700 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700");
  let ariaLabel = fallback($$props["ariaLabel"], "Sidebar");
  const activeUrlStore = writable("");
  setContext("sidebarContext", { activeClass, nonActiveClass });
  setContext("activeUrl", activeUrlStore);
  {
    activeUrlStore.set(activeUrl);
  }
  $$payload.out += `<aside${spread_attributes({
    ...$$restProps,
    class: twMerge(asideClass, $$sanitized_props.class),
    "aria-label": ariaLabel
  })}><!---->`;
  slot($$payload, $$props, "default", {}, null);
  $$payload.out += `<!----></aside>`;
  bind_props($$props, {
    activeUrl,
    asideClass,
    nonActiveClass,
    activeClass,
    ariaLabel
  });
  pop();
}
function SidebarItem($$payload, $$props) {
  const $$slots = sanitize_slots($$props);
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "action",
    "params",
    "href",
    "label",
    "spanClass",
    "activeClass",
    "nonActiveClass"
  ]);
  push();
  let active, aClass;
  let action = fallback($$props["action"], () => {
  });
  let params = fallback($$props["params"], () => ({}), true);
  let href = fallback($$props["href"], "");
  let label = fallback($$props["label"], "");
  let spanClass = fallback($$props["spanClass"], "ms-3");
  let activeClass = fallback($$props["activeClass"], () => void 0, true);
  let nonActiveClass = fallback($$props["nonActiveClass"], () => void 0, true);
  const context = getContext("sidebarContext") ?? {};
  const activeUrlStore = getContext("activeUrl");
  let sidebarUrl = "";
  activeUrlStore.subscribe((value) => {
    sidebarUrl = value;
  });
  active = sidebarUrl ? href === sidebarUrl : false;
  aClass = twMerge(active ? activeClass ?? context.activeClass : nonActiveClass ?? context.nonActiveClass, $$sanitized_props.class);
  $$payload.out += `<li><a${spread_attributes({ ...$$restProps, href, class: aClass })}><!---->`;
  slot($$payload, $$props, "icon", {}, null);
  $$payload.out += `<!----> <span${attr("class", spanClass)}>${escape_html(label)}</span> `;
  if ($$slots.subtext) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "subtext", {}, null);
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></a></li>`;
  bind_props($$props, {
    action,
    params,
    href,
    label,
    spanClass,
    activeClass,
    nonActiveClass
  });
  pop();
}
function SidebarGroup($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["ulClass", "borderClass", "border"]);
  push();
  let ulClass = fallback($$props["ulClass"], "space-y-2");
  let borderClass = fallback($$props["borderClass"], "pt-4 mt-4 border-t border-gray-200 dark:border-gray-700");
  let border = fallback($$props["border"], false);
  if (border) {
    ulClass += " " + borderClass;
  }
  $$payload.out += `<ul${spread_attributes({
    ...$$restProps,
    class: twMerge(ulClass, $$sanitized_props.class)
  })}><!---->`;
  slot($$payload, $$props, "default", {}, null);
  $$payload.out += `<!----></ul>`;
  bind_props($$props, { ulClass, borderClass, border });
  pop();
}
function SidebarWrapper($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["divClass"]);
  push();
  let divClass = fallback($$props["divClass"], "overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-800");
  $$payload.out += `<div${spread_attributes({
    ...$$restProps,
    class: twMerge(divClass, $$sanitized_props.class)
  })}><!---->`;
  slot($$payload, $$props, "default", {}, null);
  $$payload.out += `<!----></div>`;
  bind_props($$props, { divClass });
  pop();
}
function _layout($$payload, $$props) {
  const routes = [
    { label: "사용자", href: "/admin/user" },
    { label: "카테고리 관리", href: "/admin/categori" },
    { label: "권한 관리", href: "/admin/auth" },
    { label: "상품 관리", href: "/admin/product" },
    { label: "대시보드", href: "/admin/dashboard" }
  ];
  $$payload.out += `<main class="layout-container svelte-nzs9wk"><div class="sidebar svelte-nzs9wk">`;
  Sidebar($$payload, {
    class: "h-full bg-gray-800 text-white border border-gray-700",
    children: ($$payload2) => {
      SidebarWrapper($$payload2, {
        children: ($$payload3) => {
          SidebarGroup($$payload3, {
            children: ($$payload4) => {
              const each_array = ensure_array_like(routes);
              $$payload4.out += `<!--[-->`;
              for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                let { label, href } = each_array[$$index];
                SidebarItem($$payload4, { label, href });
              }
              $$payload4.out += `<!--]-->`;
            },
            $$slots: { default: true }
          });
        },
        $$slots: { default: true }
      });
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----></div> <div class="content svelte-nzs9wk"><!---->`;
  slot($$payload, $$props, "default", {}, null);
  $$payload.out += `<!----></div></main>`;
}
export {
  _layout as default
};
