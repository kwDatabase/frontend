<script>
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Input, DarkMode } from 'flowbite-svelte';
  import { SearchOutline } from 'flowbite-svelte-icons';
  import { isLoggedIn, userInfo } from '$src/stores/auth'; // 상태 관리 store
  import { goto } from '$app/navigation';

  let btnClass = 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-xl p-2';

  let loggedIn;
  let user;

  // 로그인 상태 구독
  isLoggedIn.subscribe(value => (loggedIn = value));
  userInfo.subscribe(value => (user = value));

  // 로그아웃 함수
  function logout() {
    isLoggedIn.set(false); // 로그인 상태 초기화
    userInfo.set(null); // 사용자 정보 초기화
    alert('로그아웃되었습니다.');
    goto('/'); // 메인 페이지로 이동
  }

  // 로그인 페이지로 이동
  function goToLogin() {
    goto('/login'); // 로그인 페이지로 이동
  }
</script>

<Navbar class="border border-gray-700">
  <NavBrand href="/">
    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Market</span>
  </NavBrand>
  <div class="flex md:order-2">
    <DarkMode {btnClass} />
  </div>
  <NavUl>
    <NavLi href="/" active={true}>Home</NavLi>
    <NavLi href="/admin">Admin</NavLi>
    {#if loggedIn}
      <NavLi href="/mypage">MyPage</NavLi>
      <NavLi on:click={logout}>Logout</NavLi>
    {:else}
      <NavLi on:click={goToLogin}>Login</NavLi>
    {/if}
  </NavUl>
</Navbar>
<div class="flex-1 overflow-auto">
  <slot></slot>
</div>