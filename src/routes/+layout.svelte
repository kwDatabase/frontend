<script>
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button, Input, DarkMode } from 'flowbite-svelte';
  import { SearchOutline } from 'flowbite-svelte-icons';
  let btnClass = 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-xl p-2';

</script>

<div class="h-screen">
  <Navbar class="border-b border-gray-300 dark:border-gray-700">
    <NavBrand href="/">
      <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Market</span>
    </NavBrand>
    <div class="flex md:order-2">
      <Button color="none" data-collapse-toggle="mobile-menu-2" aria-controls="mobile-menu-2" 
              aria-expanded="false" 
              class="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1">
        <SearchOutline class="w-5 h-5" />
      </Button>
      <div class="hidden relative md:block">
        <div class="flex absolute inset-y-0 start-0 items-center ps-3 pointer-events-none">
          <SearchOutline class="w-4 h-4" />
        </div>
        <Input id="search-navbar" class="ps-10" placeholder="Search..." />
      </div>
      <NavHamburger />
      <DarkMode {btnClass} />
    </div>
    <NavUl>
      <NavLi href="/" active={true}>Home</NavLi>
      <NavLi href="/admin">Admin</NavLi>
    </NavUl>
  </Navbar>
  <div class="h-full">
    <slot></slot>
  </div>
</div>