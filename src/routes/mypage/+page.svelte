<script>
    import { userInfo } from '$src/stores/auth';
  
    let user;
  
    // 사용자 정보 구독
    userInfo.subscribe(value => {
      user = value;
    });
  </script>
  
  <main>
    {#if user}
      <h1>Welcome to MyPage</h1>
      <p>ID: {user.id}</p>
      <p>Name: {user.name}</p>
    {:else}
      <p>Loading...</p>
    {/if}
  </main>
  