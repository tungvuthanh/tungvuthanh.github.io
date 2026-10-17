// Personal Academic Website - Vu Thanh Tung
// Interactive scripts: Dark mode, publication filtering, search, BibTeX copy & lightbox

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initPublicationFilters();
  initSearch();
  initBibtexButtons();
  initLightbox();
});

// Theme Management
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon('dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeIcon('light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  if (theme === 'dark') {
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    btn.setAttribute('aria-label', 'Switch to light mode');
  } else {
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    btn.setAttribute('aria-label', 'Switch to dark mode');
  }
}

// Publication Filter
function initPublicationFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const pubCards = document.querySelectorAll('.pub-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      const searchVal = document.getElementById('pub-search').value.toLowerCase().trim();

      pubCards.forEach(card => {
        const matchesCategory = filter === 'all' || card.getAttribute('data-category').split(' ').includes(filter);
        const matchesSearch = searchVal === '' || card.textContent.toLowerCase().includes(searchVal);

        if (matchesCategory && matchesSearch) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Publication Search
function initSearch() {
  const searchInput = document.getElementById('pub-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const searchVal = e.target.value.toLowerCase().trim();
    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    const pubCards = document.querySelectorAll('.pub-card');

    pubCards.forEach(card => {
      const matchesCategory = activeFilter === 'all' || card.getAttribute('data-category').split(' ').includes(activeFilter);
      const matchesSearch = searchVal === '' || card.textContent.toLowerCase().includes(searchVal);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

// BibTeX Toggling and Copying
function initBibtexButtons() {
  document.querySelectorAll('.btn-bibtex-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = btn.getAttribute('data-target');
      const drawer = document.getElementById(targetId);
      if (drawer) {
        drawer.classList.toggle('open');
      }
    });
  });

  document.querySelectorAll('.btn-bibtex-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const drawer = document.getElementById(targetId);
      if (drawer) {
        const text = drawer.textContent.trim();
        navigator.clipboard.writeText(text).then(() => {
          showToast('BibTeX citation copied to clipboard!');
        }).catch(err => {
          showToast('Failed to copy BibTeX');
        });
      }
    });
  });
}

// Toast notification
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Lightbox for Gallery
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  if (!modal || !modalImg) return;

  document.querySelectorAll('.gallery-img-wrapper').forEach(wrapper => {
    wrapper.addEventListener('click', () => {
      const img = wrapper.querySelector('img');
      if (img) {
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modal.classList.add('active');
      }
    });
  });

  modal.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
}
