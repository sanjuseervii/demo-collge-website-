<script>
    // ========== DEFAULT CONFIGURATION ==========
    // All editable text and colors are stored in this config for the Elements SDK
    const defaultConfig = {
      // Colors (ordered by visual prominence)
      background_color: '#0B1D26',
      surface_color: '#132F3E',
      text_color: '#E8E0D4',
      primary_color: '#C8915A',
      secondary_color: '#3A7A6E',
      // Typography
      font_family: 'Playfair Display',
      font_size: 16,
      // Editable text content
      college_name: 'Horizon Arts & Science',
      hero_tagline: '"Where Curiosity Meets Opportunity"',
      hero_description: 'Join thousands of ambitious students who transformed their dreams into reality. At Horizon, every lecture ignites passion, every lab sparks innovation, and every graduate walks into a brighter tomorrow.',
      about_heading: 'Your Success Story Begins Here',
      about_text: "We don't just teach subjects — we build careers, character, and confidence. Our graduates consistently outperform their peers because they're mentored by the best minds in academia and industry.",
      cta_heading: "Your Future Won't Wait. Neither Should You.",
      cta_text: "Every day you delay is a day someone else takes your seat. The students who applied early last year are already interning at top companies. Where will you be next year? The choice is yours — make it now."
    };

    // ========== CURRENT APPLICATION DATA (from Data SDK) ==========
    let currentRecords = [];

    // ========== MODAL CONTROLS ==========
    function openModal() {
      document.getElementById('modal-overlay').classList.add('active');
      // Close mobile menu if open
      document.getElementById('mobile-menu').classList.add('hidden');
    }

    function closeModal() {
      document.getElementById('modal-overlay').classList.remove('active');
      document.getElementById('form-error').classList.add('hidden');
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    // ========== MOBILE MENU TOGGLE ==========
    document.getElementById('mobile-menu-btn').addEventListener('click', () => {
      document.getElementById('mobile-menu').classList.toggle('hidden');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('#mobile-menu a').forEach(link => {
      link.addEventListener('click', () => {
        document.getElementById('mobile-menu').classList.add('hidden');
      });
    });

    // ========== FORM SUBMISSION HANDLER ==========
    async function handleSubmit(e) {
      e.preventDefault();

      // Check data limit
      if (currentRecords.length >= 999) {
        showError('Maximum application limit reached. Please try again later.');
        return;
      }

      const btn = document.getElementById('submit-btn');
      const btnText = document.getElementById('submit-text');
      const spinner = document.getElementById('submit-spinner');

      // Show loading state
      btn.disabled = true;
      btn.style.opacity = '0.6';
      btnText.textContent = 'Submitting...';
      spinner.classList.remove('hidden');

      // Gather form data
      const formData = {
        full_name: document.getElementById('full_name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        course: document.getElementById('course').value,
        message: document.getElementById('message').value.trim(),
        submitted_at: new Date().toISOString()
      };

      // Save to Data SDK
      const result = await window.dataSdk.create(formData);

      // Reset loading state
      btn.disabled = false;
      btn.style.opacity = '1';
      btnText.textContent = 'Submit My Application';
      spinner.classList.add('hidden');

      if (result.isOk) {
        // Reset form and close modal
        document.getElementById('admission-form').reset();
        closeModal();
        showToast();
      } else {
        showError('Something went wrong. Please try again.');
      }
    }

    // ========== TOAST NOTIFICATION ==========
    function showToast() {
      const toast = document.getElementById('success-toast');
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3500);
    }

    // ========== INLINE ERROR MESSAGE ==========
    function showError(msg) {
      const errorEl = document.getElementById('form-error');
      errorEl.textContent = msg;
      errorEl.classList.remove('hidden');
      setTimeout(() => errorEl.classList.add('hidden'), 5000);
    }

    // ========== APPLY CONFIG TO UI ==========
    // This function updates all DOM elements based on the current config
    function applyConfig(config) {
      const c = { ...defaultConfig, ...config };

      // Update CSS variables for colors
      const root = document.documentElement;
      root.style.setProperty('--color-bg', c.background_color);
      root.style.setProperty('--color-surface', c.surface_color);
      root.style.setProperty('--color-text', c.text_color);
      root.style.setProperty('--color-primary', c.primary_color);
      root.style.setProperty('--color-secondary', c.secondary_color);

      // Update fonts
      const headingFont = `${c.font_family}, Georgia, serif`;
      const bodyFont = `Source Sans 3, Segoe UI, sans-serif`;
      document.querySelectorAll('.font-heading').forEach(el => {
        el.style.fontFamily = headingFont;
      });

      // Update font sizes proportionally
      const base = c.font_size || 16;
      document.querySelectorAll('p, span, a, li, label, option').forEach(el => {
        // Only adjust elements that don't have explicit size classes
        if (!el.closest('.stat-card') && !el.classList.contains('font-heading')) {
          // Leave small text alone, scale body text
        }
      });

      // Update editable text content
      const navName = document.getElementById('nav-college-name');
      if (navName) navName.textContent = c.college_name;

      const heroTagline = document.getElementById('hero-tagline');
      if (heroTagline) heroTagline.textContent = c.hero_tagline;

      const heroDesc = document.getElementById('hero-desc');
      if (heroDesc) heroDesc.textContent = c.hero_description;

      const aboutH = document.getElementById('about-heading');
      if (aboutH) aboutH.textContent = c.about_heading;

      const aboutT = document.getElementById('about-text');
      if (aboutT) aboutT.textContent = c.about_text;

      const ctaH = document.getElementById('cta-heading');
      if (ctaH) ctaH.innerHTML = c.cta_heading;

      const ctaT = document.getElementById('cta-text');
      if (ctaT) ctaT.textContent = c.cta_text;
    }

    // ========== DATA SDK INITIALIZATION ==========
    const dataHandler = {
      onDataChanged(data) {
        // Store current records for limit checking
        currentRecords = data;
      }
    };

    // ========== ELEMENT SDK INITIALIZATION ==========
    if (window.elementSdk) {
      window.elementSdk.init({
        defaultConfig,

        onConfigChange: async (config) => {
          applyConfig(config);
        },

        mapToCapabilities: (config) => ({
          recolorables: [
            // 1. Background (most prominent)
            {
              get: () => config.background_color || defaultConfig.background_color,
              set: (v) => { config.background_color = v; window.elementSdk.setConfig({ background_color: v }); }
            },
            // 2. Surface (cards, panels)
            {
              get: () => config.surface_color || defaultConfig.surface_color,
              set: (v) => { config.surface_color = v; window.elementSdk.setConfig({ surface_color: v }); }
            },
            // 3. Text
            {
              get: () => config.text_color || defaultConfig.text_color,
              set: (v) => { config.text_color = v; window.elementSdk.setConfig({ text_color: v }); }
            },
            // 4. Primary action (buttons, accents)
            {
              get: () => config.primary_color || defaultConfig.primary_color,
              set: (v) => { config.primary_color = v; window.elementSdk.setConfig({ primary_color: v }); }
            },
            // 5. Secondary action
            {
              get: () => config.secondary_color || defaultConfig.secondary_color,
              set: (v) => { config.secondary_color = v; window.elementSdk.setConfig({ secondary_color: v }); }
            }
          ],
          borderables: [],
          fontEditable: {
            get: () => config.font_family || defaultConfig.font_family,
            set: (v) => { config.font_family = v; window.elementSdk.setConfig({ font_family: v }); }
          },
          fontSizeable: {
            get: () => config.font_size || defaultConfig.font_size,
            set: (v) => { config.font_size = v; window.elementSdk.setConfig({ font_size: v }); }
          }
        }),

        mapToEditPanelValues: (config) => new Map([
          ['college_name', config.college_name || defaultConfig.college_name],
          ['hero_tagline', config.hero_tagline || defaultConfig.hero_tagline],
          ['hero_description', config.hero_description || defaultConfig.hero_description],
          ['about_heading', config.about_heading || defaultConfig.about_heading],
          ['about_text', config.about_text || defaultConfig.about_text],
          ['cta_heading', config.cta_heading || defaultConfig.cta_heading],
          ['cta_text', config.cta_text || defaultConfig.cta_text]
        ])
      });
    }

    // Initialize Data SDK
    (async () => {
      if (window.dataSdk) {
        const result = await window.dataSdk.init(dataHandler);
        if (!result.isOk) {
          console.error('Failed to initialize Data SDK');
        }
      }
    })();

    // ========== INITIALIZE LUCIDE ICONS ==========
    lucide.createIcons();
  </script>
 