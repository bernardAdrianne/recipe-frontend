<script>
  import { Facebook, Instagram, Youtube, ArrowUp } from 'lucide-svelte';

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<footer class="bg-[#0f1b2d] text-[#FFFFFF] py-10 shadow-inner relative">
  <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
    <!-- BRANDING -->
    <div>
      <h1 class="text-3xl font-semibold text-[#FFFFFF] mb-3">ReciPinoy</h1>
      <p class="text-md text-gray-400 leading-relaxed">
        Discover authentic Filipino recipes made simple and easy. 
        Your kitchen companion for traditional and modern Pinoy dishes.
      </p>
    </div>

    <!-- NAVIGATION -->
    <div>
      <h2 class="text-md font-semibold text-gray-500 mb-5">QUICK LINKS</h2>
      <ul class="space-y-2 text-sm">
        <li><a href="/about" class="text-gray-400 hover:text-[#FFFFFF] transition">ABOUT US</a></li>
        <li><a href="/recipes" class="text-gray-400 hover:text-[#FFFFFF] transition">RECIPES</a></li>
        <li><a href="/contact" class="text-gray-400 hover:text-[#FFFFFF] transition">CONBTACT</a></li>
        <li><a href="/privacy" class="text-gray-400 hover:text-[#FFFFFF] transition">Privacy Policy</a></li>
      </ul>
    </div>

    <!-- SUPPORT -->
    <div>
      <h2 class="text-md font-semibold text-gray-500 mb-5">SUPPORT</h2>
      <ul class="space-y-2 text-sm">
        <li><a href="/faq" class="text-gray-400 hover:text-[#FFFFFF] transition">FAQs</a></li>
        <li><a href="/help" class="text-gray-400 hover:text-[#FFFFFF] transition">Help Center</a></li>
        <li><a href="/feedback" class="text-gray-400 hover:text-[#FFFFFF] transition">Feedback</a></li>
      </ul>
    </div>

    <!-- SOCIAL AND BACK TO TOP -->
    <div class="flex flex-col items-start md:items-end space-y-4">
      <div class="flex space-x-3">
        <a href="/facebook" aria-label="Facebook"
          class="bg-white text-[#222222] p-3 rounded-full hover:bg-[#1a2d47] hover:text-white transition duration-300">
          <Facebook class="w-6 h-6" />
        </a>
        <a href="/instagram" aria-label="Instagram"
          class="bg-white text-[#222222] p-3 rounded-full hover:bg-[#1a2d47] hover:text-white transition duration-300">
          <Instagram class="w-6 h-6" />
        </a>
        <a href="/youtube" aria-label="YouTube"
          class="bg-white text-[#222222] p-3 rounded-full hover:bg-[#1a2d47] hover:text-white transition duration-300">
          <Youtube class="w-6 h-6" />
        </a>
      </div>
      <button
        on:click={scrollToTop}
        class="flex items-center space-x-2 text-sm font-medium text-gray-400 hover:text-[#FFFFFF] transition">
        <ArrowUp class="w-5 h-5" />
        <span>Back to top</span>
      </button>
    </div>
  </div>

<!--DIVIDER & BOTTOM NOTE -->
<div class="border-t border-gray-700 mt-8 w-3/4 mx-auto"></div>
<div class="pt-6 text-center text-sm text-gray-500">
  © {new Date().getFullYear()} ReciPinoy. All rights reserved.
</div>
</footer>
