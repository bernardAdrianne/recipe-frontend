<script>
  import { Facebook, Instagram, Youtube, ArrowUp } from 'lucide-svelte';

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<footer class="bg-[#F4F4F4] text-white py-10 mt-12 shadow-inner relative">
  <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
    <h1 class="text-2xl font-bold text-[#222222]">ReciPinoy</h1>

    <div class="flex space-x-4 items-center">
      <button
        on:click={scrollToTop}
        class="bg-white text-[#222222] p-3 rounded-full hover:bg-[#1a5f17] hover:text-white transition duration-300"
        aria-label="Go to top"
      >
        <ArrowUp class="w-7 h-7" />
      </button>

      <a
        href="/facebook"
        class="bg-white text-[#222222] p-3 rounded-full hover:bg-[#1a5f17] hover:text-white transition duration-300"
        aria-label="Facebook"
      >
        <Facebook class="w-7 h-7" />
      </a>
      <a
        href="/instagram"
        class="bg-white text-[#222222] p-3 rounded-full hover:bg-[#1a5f17] hover:text-white transition duration-300"
        aria-label="Instagram"
      >
        <Instagram class="w-7 h-7" />
      </a>
      <a
        href="/youtube"
        class="bg-white text-[#222222] p-3 rounded-full hover:bg-[#1a5f17] hover:text-white transition duration-300"
        aria-label="YouTube"
      >
        <Youtube class="w-7 h-7" />
      </a>
    </div>
  </div>
</footer>
