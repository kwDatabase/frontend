<script>
    import { Button } from 'flowbite-svelte';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    onMount(() => {
        goto('/products');
    });
</script>

<main>
    <p>Home</p>
</main>