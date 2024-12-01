<script context="module">
  import { redirect } from '@sveltejs/kit';
  import { browser } from '$app/environment';

  export async function load() {
    const isAdmin = true;

    if (!isAdmin) {
      if (browser) {
        throw redirect(302, '/login');  // 관리자가 아니면 로그인 페이지로 리다이렉트
      }
    }
  }
</script>

<style>
</style>


<main>
  <p>Admin</p>
</main>
