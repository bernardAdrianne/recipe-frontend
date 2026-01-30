<script>
    import { page } from '$app/stores';
    import { derived } from "svelte/store";
    import NavBar from "$lib/components/user/navbar.svelte";
    import Footer from "$lib/components/user/footer.svelte";
    import Contact from "$lib/components/user/contact.svelte";
    
    const isHome = derived(page, $page => $page.url.pathname === "/user/home");
</script>

<div class="bg-[#F4F6F6] flex flex-col min-h-screen">
    <NavBar />

    <main class="flex-grow">
        <slot />
    </main>

    {#if $isHome}
      <div class="flex flex-col">
        <Contact />
        <Footer />
      </div>
    {/if}
</div>
