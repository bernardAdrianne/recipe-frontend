<script>
  import { Facebook, Instagram, Youtube, ArrowUp } from 'lucide-svelte';

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<footer class="bg-[#F9FAFB] text-[#444444] py-10 mt-12 shadow-inner relative">
  <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
    <!-- Branding -->
    <div>
      <h1 class="text-3xl font-bold text-[#222222] mb-3">ReciPinoy</h1>
      <p class="text-sm text-gray-500 leading-relaxed">
        Discover authentic Filipino recipes made simple and easy. 
        Your kitchen companion for traditional and modern Pinoy dishes.
      </p>
    </div>

    <!-- Navigation -->
    <div>
      <h2 class="text-lg font-semibold text-[#222222] mb-3">Quick Links</h2>
      <ul class="space-y-2 text-sm">
        <li><a href="/about" class="hover:text-[#1a5f17] transition">About Us</a></li>
        <li><a href="/recipes" class="hover:text-[#1a5f17] transition">Recipes</a></li>
        <li><a href="/contact" class="hover:text-[#1a5f17] transition">Contact</a></li>
        <li><a href="/privacy" class="hover:text-[#1a5f17] transition">Privacy Policy</a></li>
      </ul>
    </div>

    <!-- Support -->
    <div>
      <h2 class="text-lg font-semibold text-[#222222] mb-3">Support</h2>
      <ul class="space-y-2 text-sm">
        <li><a href="/faq" class="hover:text-[#1a5f17] transition">FAQs</a></li>
        <li><a href="/help" class="hover:text-[#1a5f17] transition">Help Center</a></li>
        <li><a href="/feedback" class="hover:text-[#1a5f17] transition">Feedback</a></li>
      </ul>
    </div>

    <!-- Social & Back to top -->
    <div class="flex flex-col items-start md:items-end space-y-4">
      <div class="flex space-x-3">
        <a href="/facebook" aria-label="Facebook"
          class="bg-white border border-gray-200 text-[#222222] p-3 rounded-full hover:bg-[#1a5f17] hover:text-white transition duration-300">
          <Facebook class="w-6 h-6" />
        </a>
        <a href="/instagram" aria-label="Instagram"
          class="bg-white border border-gray-200 text-[#222222] p-3 rounded-full hover:bg-[#1a5f17] hover:text-white transition duration-300">
          <Instagram class="w-6 h-6" />
        </a>
        <a href="/youtube" aria-label="YouTube"
          class="bg-white border border-gray-200 text-[#222222] p-3 rounded-full hover:bg-[#1a5f17] hover:text-white transition duration-300">
          <Youtube class="w-6 h-6" />
        </a>
      </div>
      <button
        on:click={scrollToTop}
        class="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-[#1a5f17] transition">
        <ArrowUp class="w-5 h-5" />
        <span>Back to top</span>
      </button>
    </div>
  </div>

  <!-- Divider & Bottom note -->
  <div class="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-500">
    © {new Date().getFullYear()} ReciPinoy. All rights reserved.
  </div>
</footer>
