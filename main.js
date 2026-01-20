/**
 * Global Citizens Engineers
 * Core JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {

  // State
  let appData = {
    members: [],
    projects: [],
    events: [],
    sparkFeed: []
  };

  // ============================================
  // Initialization & Data Loading
  // ============================================
  async function init() {
    try {
      const response = await fetch('data/members.json');
      if (response.ok) {
        appData = await response.json();

        // Router-ish logic
        if (document.getElementById('memberGrid')) {
          renderDirectory(appData.members);
        }
        if (document.getElementById('sparkFeed')) {
          renderSparkFeed(appData.sparkFeed);
        }

        console.log('Global Citizens Data Loaded');
      }
    } catch (e) {
      console.error('Failed to load data, using fallback/static content', e);
    }
  }

  init();

  // ============================================
  // Mobile Navigation Toggle
  // ============================================
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('active');

      // Animate hamburger icon
      const spans = navToggle.querySelectorAll('span');
      navToggle.classList.toggle('open');

      if (navToggle.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('open');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  // ============================================
  // Directory Rendering & Search
  // ============================================
  const searchInput = document.getElementById('searchInput');
  const filterIndustry = document.getElementById('filterIndustry');
  const filterLocation = document.getElementById('filterLocation');
  const memberGrid = document.getElementById('memberGrid');
  const memberCount = document.getElementById('memberCount');

  function renderDirectory(members) {
    if (!memberGrid) return;

    memberGrid.innerHTML = ''; // Clear loading/static state

    members.forEach((member, index) => {
      const card = document.createElement('article');
      card.className = 'card member-card';
      card.style.opacity = '0'; // For fade-in
      card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.05}s`;

      // Create tags HTML
      const tagsHtml = member.tags.map(tag =>
        `<span class="tag" onclick="filterByTag('${tag}')">${tag}</span>`
      ).join('');

      card.innerHTML = `
        <div class="card-body">
          <div style="display: flex; gap: var(--space-4); align-items: center; margin-bottom: var(--space-4);">
            <div class="member-avatar">${member.initials}</div>
            <div>
              <h3 class="member-name">${member.name}</h3>
              <p class="member-role">${member.role}</p>
            </div>
          </div>
          
          <div class="member-tags">
            ${tagsHtml}
          </div>
          
          <div style="margin-top: auto; padding-top: var(--space-4); display: flex; justify-content: space-between; align-items: center;">
            <span class="location-badge" style="font-size: var(--text-sm); color: var(--text-secondary);">
              📍 ${member.location}
            </span>
            <button class="btn-text" onclick="openConnectModal(${member.id})">Connect →</button>
          </div>
        </div>
      `;

      memberGrid.appendChild(card);
    });

    updateCount(members.length);
  }

  function updateCount(count) {
    if (memberCount) memberCount.textContent = count;
  }

  // Filter Logic
  function filterMembers() {
    if (!memberGrid) return;

    const searchTerm = searchInput?.value.toLowerCase() || '';
    const industry = filterIndustry?.value.toLowerCase() || '';
    const location = filterLocation?.value.toLowerCase() || '';

    const filtered = appData.members.filter(member => {
      const allText = `${member.name} ${member.role} ${member.tags.join(' ')}`.toLowerCase();
      const matchesSearch = !searchTerm || allText.includes(searchTerm);
      const matchesIndustry = !industry || member.industry === industry || !industry; // Simple match
      const matchesLocation = !location; // Placeholder logic

      return matchesSearch && matchesIndustry && matchesLocation;
    });

    renderDirectory(filtered);
  }

  if (searchInput) searchInput.addEventListener('input', filterMembers);
  if (filterIndustry) filterIndustry.addEventListener('change', filterMembers);

  window.filterByTag = function (tag) {
    if (searchInput) {
      searchInput.value = tag;
      filterMembers();
    }
  };

  // ============================================
  // Spark Feed Rendering
  // ============================================
  function renderSparkFeed(feed) {
    const feedContainer = document.getElementById('sparkFeed');
    if (!feedContainer) return;

    feedContainer.innerHTML = '';

    feed.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'spark-card';
      card.style.opacity = '0';
      card.style.animation = `fadeIn 0.5s var(--ease-somatic) forwards ${index * 0.1}s`;

      card.innerHTML = `
        <div class="spark-author">
          <div class="spark-avatar">${item.avatar}</div>
          <div>
            <div style="font-weight: 600; font-size: var(--text-sm);">${item.author}</div>
            <div style="color: var(--ink-muted); font-size: var(--text-xs);">${item.time}</div>
          </div>
        </div>
        <p style="font-size: var(--text-md); margin-bottom: var(--space-3); line-height: 1.5;">"${item.content}"</p>
        <div style="display: flex; gap: var(--space-2);">
          ${item.tags.map(t => `<span class="tag" style="font-size: 10px; padding: 2px 6px;">#${t}</span>`).join('')}
        </div>
      `;

      feedContainer.appendChild(card);
    });
  }

  // ============================================
  // Somatic Connect Modal
  // ============================================
  window.openConnectModal = function (memberId) {
    const member = appData.members.find(m => m.id === memberId);
    if (!member) return;

    // Remove existing if any
    const existing = document.querySelector('.modal-backdrop');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';

    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" onclick="closeModal()">✕</button>
        
        <div style="text-align: center; margin-bottom: var(--space-6);">
          <div class="member-avatar" style="width: 64px; height: 64px; font-size: 24px; margin: 0 auto var(--space-4); background: var(--tan-dark); color: var(--paper);">
            ${member.initials}
          </div>
          <h3 style="margin-bottom: var(--space-2);">Connect with ${member.name}</h3>
          <p style="color: var(--text-secondary);">${member.role}</p>
        </div>
        
        <form onsubmit="handleConnectSubmit(event)">
          <div class="form-group">
            <label class="form-label">Your Message</label>
            <textarea class="form-textarea" rows="4" placeholder="Hi ${member.name.split(' ')[0]}, I'm interested in..." required></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Your Email</label>
            <input type="email" class="form-input" placeholder="you@example.com" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Send Connection Request</button>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    // Trigger anime
    requestAnimationFrame(() => {
      modal.classList.add('active');
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  };

  window.closeModal = function () {
    const modal = document.querySelector('.modal-backdrop');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 300);
    }
  };

  window.handleConnectSubmit = function (e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.textContent;

    btn.textContent = 'Sent! ✨';
    btn.style.background = '#4ade80';
    btn.style.borderColor = '#4ade80';
    btn.disabled = true;

    setTimeout(() => {
      closeModal();
    }, 1500);
  };

  // ============================================
  // Form Handling (General)
  // ============================================
  const joinForm = document.getElementById('joinForm');
  const proposeForm = document.getElementById('proposeForm');

  function handleFormSubmit(form, formName) {
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      const submissions = JSON.parse(localStorage.getItem(`gce_${formName}`) || '[]');
      submissions.push({
        ...data,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(`gce_${formName}`, JSON.stringify(submissions));

      const button = form.querySelector('button[type="submit"]');
      const originalText = button.textContent;
      button.textContent = 'Submitted! ✓';
      button.disabled = true;
      button.style.background = '#4ade80';
      button.style.borderColor = '#4ade80';

      setTimeout(() => {
        form.reset();
        button.textContent = originalText;
        button.disabled = false;
        button.style.background = '';
        button.style.borderColor = '';
      }, 3000);
    });
  }

  handleFormSubmit(joinForm, 'join_submissions');
  handleFormSubmit(proposeForm, 'project_proposals');

  // ============================================
  // Utility: Smooth Scroll
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || !href.startsWith('#')) return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // Scroll Animations
  // ============================================
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    observer.observe(card);
  });

  // ============================================
  // Active Navigation
  // ============================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  // ============================================
  // Reading Progress Bar
  // ============================================
  if (document.body.contains(document.querySelector('article'))) {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      position: fixed;
      top: 72px;
      left: 0;
      width: 0%;
      height: 3px;
      background: var(--accent);
      z-index: 999;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const article = document.querySelector('article');
      if (!article) return;

      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const scrolled = window.scrollY - articleTop;
      const progress = Math.min(Math.max(scrolled / articleHeight * 100, 0), 100);

      progressBar.style.width = `${progress}%`;
    });
  }

  console.log('Global Citizens Engineers - Initialized (v2)');
});
