<script>
  import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { isLoggedIn, userInfo } from '$src/stores/auth';
  
  const routes = [
    { label: '사용자 관리', href: '/admin/user' },
    { label: '카테고리 관리', href: '/admin/category' },
    { label: '권한 관리', href: '/admin/auth' },
    { label: '대시보드', href: '/admin/dashboard' },
  ];
  
  $: activeUrl = $page.url.pathname;

  let spanClass = 'pl-2 self-center text-md text-gray-900 whitespace-nowrap dark:text-white';
  var activeClass = "flex items-center p-2 text-base font-normal text-gray-900 bg-primary-200 dark:bg-primary-700 rounded-lg dark:text-white hover:bg-primary-100 dark:hover:bg-primary-700";

  onMount(() => {
    const unsubscribeLogin = isLoggedIn.subscribe(value => {
      if (!value) {
        goto('/');
      }
    });

    const unsubscribeUser = userInfo.subscribe(value => {
      console.log(value)
      if (!value || value.id !== 'admin') {
        goto('/');
      }
      else if (activeUrl === '/admin') {
        goto('/admin/user');
      }
    });

    return () => {
      unsubscribeLogin();
      unsubscribeUser();
    };
  });
</script>

<style>
  .layout-container {
    display: flex;
    height: 100%;
  }
  .sidebar {
    min-width: 100px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }
</style>

<main class="layout-container" >
  <div class="sidebar">
    <Sidebar class="h-full bg-white dark:bg-gray-900 dark:text-white border-r dark:border-gray-700"
             {activeUrl}>
      <SidebarWrapper class="h-full dark:bg-gray-900 dark:text-white">
        <SidebarGroup class="side-menu-item">
          {#each routes as { label, href }}
            <SidebarItem {label} {href} {spanClass}/>
          {/each}
        </SidebarGroup>
      </SidebarWrapper>
    </Sidebar>
  </div>
  <div class="content">
    <slot></slot>
  </div>
</main>
