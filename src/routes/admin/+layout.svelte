<script>
  import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
  
  const routes = [
    { label: '사용자', href: '/admin/user' },
    { label: '카테고리 관리', href: '/admin/categori' },
    { label: '권한 관리', href: '/admin/auth' },
    { label: '상품 관리', href: '/admin/product' },
    { label: '대시보드', href: '/admin/dashboard' },
  ];
</script>

<style>
  .layout-container {
    display: flex;
    height: 100vh;
  }
  .sidebar {
    width: 250px;
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

<main class="layout-container">
  <div class="sidebar">
    <Sidebar class="h-full bg-gray-800 text-white border border-gray-700">
      <SidebarWrapper>
        <SidebarGroup>
          {#each routes as { label, href }}
            <SidebarItem {label} {href} />
          {/each}
        </SidebarGroup>
      </SidebarWrapper>
    </Sidebar>
  </div>
  <div class="content">
    <slot></slot>
  </div>
</main>
