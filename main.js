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
        if (document.getElementById('projectsGrid')) {
          renderProjects(appData.projects);
        }
        if (document.getElementById('eventsGrid')) {
          renderEvents(appData.events);
        }
        if (document.getElementById('resourcesGrid')) {
          renderResources(appData.resources);
        }

      }

      console.log('Global Citizens Data Loaded');
      updateAuthUI();
    } catch (e) {
      console.error('Failed to load data, using fallback/static content', e);
    }
  }

  init();
  updateAuthUI();
  injectBottomNav();

  // ============================================
  // Mobile Bottom Nav Injection
  // ============================================
  function injectBottomNav() {
    // Only if not already present
    if (document.querySelector('.bottom-nav')) return;

    const nav = document.createElement('nav');
    nav.className = 'bottom-nav';

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const items = [
      { label: 'Home', href: 'index.html', icon: '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>' },
      { label: 'Directory', href: 'directory.html', icon: '<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>' },
      { label: 'Connect', href: 'connect.html', icon: '<path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H3V8h2v5h6v-5h2v5h8V8h2v5H11z"/>' },
      { label: 'Intel', href: 'resources.html', icon: '<path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>' }
    ];

    // Note for Connect icon: used standard mail/chat path, replaced with generic shape
    // Better Connect Icon (Flash/Bolt)
    items[2].icon = '<path d="M7 2v11h3v9l7-12h-4l4-8z"/>';

    items.forEach(item => {
      const link = document.createElement('a');
      link.href = item.href;
      link.className = 'bottom-nav-item';
      if (item.href === currentPage) link.classList.add('active');

      link.innerHTML = `
            <svg viewBox="0 0 24 24">${item.icon}</svg>
            <span>${item.label}</span>
        `;
      nav.appendChild(link);
    });

    document.body.appendChild(nav);
  }

  // ============================================
  // Auth UI Updates
  // ============================================
  function updateAuthUI() {
    const userJson = localStorage.getItem('gce_currentUser');
    if (!userJson) return;

    const user = JSON.parse(userJson);
    const navCta = document.querySelector('.nav-cta');
    const heroBtn = document.querySelector('a[href="#join"].btn-ghost');

    // Update Nav Button
    if (navCta) {
      navCta.textContent = `● ${user.name}`;
      navCta.href = '#profile'; // Placeholder for future profile page
      navCta.style.borderColor = '#4ade80';
      navCta.title = 'You are a verified member';
    }

    // Update "Join" button in Quick Actions if present
    if (heroBtn) {
      heroBtn.textContent = '✓ Membership Active';
      heroBtn.href = '#';
      heroBtn.style.color = 'var(--text-primary)';
      heroBtn.style.cursor = 'default';
    }



    // ========================================
    // LOGGED IN DASHBOARD (INDEX.HTML)
    // ========================================
    // If we are on the home page and logged in, show the Dashboard instead of the landing page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
      if (document.querySelector('.dashboard-view')) return;
      const hero = document.querySelector('.hero');
      if (hero) {
        // Hide standard landing sections
        document.querySelectorAll('body > section').forEach(el => el.style.display = 'none');

        // Inject Dashboard Container
        const dashboard = document.createElement('div');
        dashboard.className = 'container dashboard-view';
        dashboard.style.marginTop = '80px'; // Account for fixed header
        dashboard.style.minHeight = '80vh';

        dashboard.innerHTML = `
                <div class="dashboard-grid" style="display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-8); padding-top: var(--space-8);">
                    
                    <!-- Main Feed -->
                    <div style="min-height: 100vh;">
                         <div style="margin-bottom: var(--space-6); display: flex; align-items: center; justify-content: space-between;">
                            <h2 style="font-size: var(--text-2xl); margin:0;">Feed</h2>
                            <span class="eyebrow" style="opacity: 0.6;">All Updates</span>
                        </div>

                        <div id="dashboard-feed" style="display: flex; flex-direction: column; gap: var(--space-6);">
                            <!-- Injected by JS -->
                        </div>
                    </div>

                    <!-- Sidebar Actions -->
                    <div>
                        <div class="card" style="position: sticky; top: 100px; border: none; background: rgba(255,255,255,0.5); backdrop-filter: blur(10px);">
                            <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-6);">
                                <div class="member-avatar" style="width: 48px; height: 48px; font-size: 20px; background: var(--accent); color: white;">
                                    ${user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </div>
                                <div>
                                    <h4 style="margin: 0; font-size: var(--text-base);">${user.name}</h4>
                                    <span style="font-size: var(--text-xs); color: var(--ink-muted);">${user.role}</span>
                                </div>
                            </div>

                            <ul style="list-style: none; padding: 0;">
                                <li style="margin-bottom: var(--space-2);">
                                    <button onclick="openMemberProfile('${user.name}')" class="btn btn-ghost" style="width: 100%; justify-content: flex-start; padding-left: 0;">
                                        Start a Project
                                    </button>
                                </li>
                                <li style="margin-bottom: var(--space-2);">
                                    <button class="btn btn-ghost" style="width: 100%; justify-content: flex-start; padding-left: 0;">
                                        Write Article
                                    </button>
                                </li>
                                <li style="margin-top: var(--space-4); padding-top: var(--space-4); border-top: 1px solid rgba(0,0,0,0.05);">
                                     <button onclick="localStorage.removeItem('gce_currentUser'); window.location.reload();" class="btn-text" style="color: var(--ink-muted); font-size: var(--text-sm);">Sign Out</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;

        document.body.insertBefore(dashboard, document.querySelector('footer'));

        // Populate Dashboard Feed (Mix of Spark + Featured Project)
        // Wait a tick for data? No, appData might be ready, or we wait.
        // Since init() is async, data might not be ready if this runs immediately.
        // But updateAuthUI is called after init(), so maybe.
        // Let's rely on a small timeout or check appData.
        setTimeout(() => {
          const feed = document.getElementById('dashboard-feed');
          if (feed && appData.sparkFeed) {
            const latestSpark = appData.sparkFeed[0];
            const latestProject = appData.projects[0];

            feed.innerHTML = `
                        <div class="card" onclick="openProjectModal(${latestProject.id})" style="cursor: pointer; border-left: 4px solid var(--accent); margin-bottom: var(--space-4);">
                            <div style="font-size: var(--text-xs); color: var(--accent); margin-bottom: var(--space-2); text-transform: uppercase; letter-spacing: 0.05em;">Featured Project</div>
                            <h3 style="margin-bottom: var(--space-2);">${latestProject.title}</h3>
                            <p>${latestProject.description}</p>
                        </div>
                        
                        <div class="card" style="margin-bottom: var(--space-4);">
                             <div style="display: flex; gap: var(--space-3); align-items: center; margin-bottom: var(--space-3);">
                                <div class="member-avatar" style="width: 32px; height: 32px; font-size: 12px;">${latestSpark.avatar}</div>
                                <div><strong>${latestSpark.author}</strong> <span style="color: var(--ink-muted);">shared a spark</span></div>
                            </div>
                            <p>"${latestSpark.content}"</p>
                        </div>
                    `;
          }
        }, 500);
      }
    }
  }

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

      const verifiedBadge = member.verified ? `
        <span class="verified-badge" title="Verified Member">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
          </svg>
        </span>
      ` : '';

      card.innerHTML = `
        <div class="card-body">
          <div style="display: flex; gap: var(--space-4); align-items: center; margin-bottom: var(--space-4);">
            <div class="member-avatar">${member.initials}</div>
            <div>
              <div style="display: flex; align-items: center;">
                <h3 class="member-name" style="margin-bottom: 0;">${member.name}</h3>
                ${verifiedBadge}
              </div>
              <p class="member-role" style="margin-top: var(--space-1);">${member.role}</p>
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
  // ============================================
  // Somatic Connect Modal & Profiles
  // ============================================

  // Helper: Find member by name string
  window.findMemberByName = function (name) {
    if (!name) return null;
    return appData.members.find(m => m.name.toLowerCase() === name.toLowerCase());
  }

  // Open Full Profile Modal
  window.openMemberProfile = function (name) {
    let member = findMemberByName(name);

    // Check Auth State
    const userJson = localStorage.getItem('gce_currentUser');
    const currentUser = userJson ? JSON.parse(userJson) : null;

    // Fallback: If looking for self but not in directory yet
    if (!member && currentUser && (name === currentUser.name || name === 'Me')) {
      member = {
        id: 'self',
        name: currentUser.name,
        initials: currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2),
        role: currentUser.role || 'Member',
        location: 'Remote',
        tags: ['New Member'],
        verified: true,
        industry: 'General',
        bio: 'This is your profile preview. Complete your onboarding to appear in the public directory.',
        website: ''
      };
    }

    if (!member) return;

    // Remove existing
    const existing = document.querySelector('.modal-backdrop');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';

    const tagsHtml = (member.tags || []).map(t => `<span class="tag">${t}</span>`).join('');

    const isSelf = currentUser && currentUser.name === member.name;

    const vouchedText = (member.vouchedBy && member.vouchedBy.length > 0)
      ? `🛡️ <strong>Vouched by</strong> ${member.vouchedBy.slice(0, 2).join(', ')}${member.vouchedBy.length > 2 ? ' and ' + (member.vouchedBy.length - 2) + ' others' : ''}.`
      : `<span>Member since ${member.joined || '2025'}</span>`;

    modal.innerHTML = `
      <div class="modal-content profile-modal" style="max-width: 600px; padding: 0; overflow: hidden; border-radius: var(--radius-lg);">
        <button class="modal-close" onclick="closeModal()" style="z-index: 10; background: rgba(0,0,0,0.1); width: 32px; height: 32px; border-radius: 50%; color: var(--ink-primary);">✕</button>
        
        <!-- Cover -->
        <div style="height: 120px; background: var(--tan-light); border-bottom: 1px solid var(--tan-dark);"></div>

        <div style="padding: 0 32px 32px;">
            <!-- Header -->
            <div style="position: relative; top: -40px; margin-bottom: -20px;">
                <div class="member-avatar" style="width: 96px; height: 96px; font-size: 36px; border: 4px solid white; box-shadow: var(--shadow-md); background: var(--tan-dark); color: var(--paper);">
                    ${member.initials}
                </div>
                
                <div style="margin-top: var(--space-4);">
                    <h2 style="font-family: var(--font-serif); font-size: var(--text-2xl); margin: 0; display: flex; align-items: center; gap: 8px;">
                        ${member.name}
                        ${member.verified ? '<span style="color:#2563eb; font-size: 18px;" title="Verified Member">✓</span>' : ''}
                    </h2>
                    <p style="color: var(--text-secondary); margin: 4px 0 12px; font-size: var(--text-lg);">${member.role}</p>
                    
                    <div style="display: flex; gap: var(--space-4); font-size: var(--text-sm); color: var(--text-secondary);">
                        <span>📍 ${member.location}</span>
                        <span>🏢 ${member.industry}</span>
                        ${member.website ? `<span>🔗 <a href="${member.website}" target="_blank" style="text-decoration: underline;">Website</a></span>` : ''}
                    </div>
                </div>

                 <div style="margin-top: 24px; display: flex; gap: var(--space-3);">
                    ${isSelf
        ? `<button class="btn btn-secondary" style="flex:1;" onclick="alert('Profile editing coming soon')">Edit Profile</button>
                        <button class="btn btn-primary" style="flex:1;">Settings</button>`
        : `<button onclick="openConnectModal(${member.id})" class="btn btn-primary" style="flex:1;">Connect</button>
                        <button class="btn btn-ghost" style="flex:1; border: 1px solid var(--tan-dark);">Message</button>`
      }
                </div>
            </div>

            <!-- Trust Bar -->
            <div style="margin-top: 24px; padding: 12px 16px; background: #eff6ff; border-radius: 8px; font-size: var(--text-sm); color: #1e40af; display: flex; align-items: center; gap: 8px;">
                ${vouchedText}
            </div>

            <!-- Tabs (Visual Only for MVP) -->
            <div style="display: flex; border-bottom: 1px solid var(--tan-dark); margin-top: 32px;">
                <div style="padding: 12px 24px; font-weight: 600; border-bottom: 2px solid var(--ink-primary); cursor: pointer;">Overview</div>
                <div style="padding: 12px 24px; color: var(--ink-secondary); cursor: pointer;">Work</div>
                <div style="padding: 12px 24px; color: var(--ink-secondary); cursor: pointer;">Intel</div>
            </div>

            <!-- Tab Content -->
            <div style="padding-top: 24px;">
                <h4 style="font-family: var(--font-serif); margin-bottom: var(--space-3);">About</h4>
                <p style="line-height: 1.6; color: var(--text-secondary); margin-bottom: var(--space-6);">
                    ${member.bio}
                </p>

                <h4 style="font-family: var(--font-serif); margin-bottom: var(--space-3);">Specialties</h4>
                <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
                    ${tagsHtml}
                </div>
            </div>

        </div>
      </div>
    `;



    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('active'));
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  };

  // Connect Modal (Enhanced)
  window.openConnectModal = function (contextId, type = 'member') {
    let title = 'Connect';
    let subtitle = '';
    let recipientName = '';
    let recipientInitials = '';

    // Determine Context
    if (type === 'member') {
      const member = appData.members.find(m => m.id === contextId);
      if (!member) return;
      recipientName = member.name;
      recipientInitials = member.initials;
      title = `Connect with ${member.name} `;
      subtitle = member.role;
    } else if (type === 'project') {
      const project = appData.projects.find(p => p.id === contextId);
      if (!project) return;
      // Try to find proposer, otherwise generic
      const proposer = findMemberByName(project.proposer);
      recipientName = project.proposer || 'the team';
      recipientInitials = proposer ? proposer.initials : 'GC';
      title = `Discuss "${project.title}"`;
      subtitle = `Project Lead: ${project.proposer} `;
    } else if (type === 'event') {
      const event = appData.events.find(e => e.id === contextId);
      if (!event) return;
      recipientName = event.host;
      recipientInitials = event.hostInitials;
      title = `RSVP: ${event.title} `;
      subtitle = `Hosted by ${event.host} `;
    }

    // Check Auth State
    const userJson = localStorage.getItem('gce_currentUser');
    const user = userJson ? JSON.parse(userJson) : null;

    // Remove existing if any
    const existing = document.querySelector('.modal-backdrop');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';

    // Form logic: Pre-fill if user exists
    const emailValue = user ? user.email : '';
    const namePlaceholder = user ? `Hi ${recipientName.split(' ')[0]}, this is ${user.name}...` : `Hi ${recipientName.split(' ')[0]}, I'm interested in...`;

    // Message "Sent as..." badge
    const senderBadge = user ? `
        <div style="margin-bottom: var(--space-4); padding: var(--space-2) var(--space-3); background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; font-size: var(--text-xs); color: #1e40af; display: inline-flex; align-items: center; gap: 6px;">
            <span>●</span> Sending as <strong>${user.name}</strong> (${user.role})
        </div>
    ` : '';

    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" onclick="closeModal()">✕</button>
        
        <div style="text-align: center; margin-bottom: var(--space-6);">
          <div class="member-avatar" style="width: 64px; height: 64px; font-size: 24px; margin: 0 auto var(--space-4); background: var(--tan-dark); color: var(--paper);">
            ${recipientInitials}
          </div>
          <h3 style="margin-bottom: var(--space-2);">${title}</h3>
          <p style="color: var(--text-secondary);">${subtitle}</p>
        </div>
        
        <form onsubmit="handleConnectSubmit(event, '${recipientName}')">
          ${senderBadge}
          
          <div class="form-group">
            <label class="form-label">Your Message</label>
            <textarea class="form-textarea" rows="4" placeholder="${namePlaceholder}" required></textarea>
          </div>
          
          ${!user ? `
            <div class="form-group">
                <label class="form-label">Your Email</label>
                <input type="email" class="form-input" placeholder="you@example.com" value="${emailValue}" required>
            </div>
          ` : ''}
          
          <button type="submit" class="btn btn-primary" style="width: 100%;">Send Message</button>
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

  window.handleConnectSubmit = function (e, recipient) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.textContent;

    // Simulate Sending
    const form = e.target;
    // Extract message
    const message = form.querySelector('textarea').value;
    const userJson = localStorage.getItem('gce_currentUser');
    const sender = userJson ? JSON.parse(userJson).name : (form.querySelector('input[type="email"]')?.value || 'Guest');

    // Save Message
    const messages = JSON.parse(localStorage.getItem('gce_messages') || '[]');
    messages.push({
      to: recipient,
      from: sender,
      body: message,
      timestamp: new Date().toISOString(),
      read: false
    });
    localStorage.setItem('gce_messages', JSON.stringify(messages));

    btn.textContent = 'Sent! ✨';
    btn.style.background = '#4ade80';
    btn.style.borderColor = '#4ade80';
    btn.disabled = true;

    setTimeout(() => {
      closeModal();
    }, 1500);
  };

  // ============================================
  // Detailed Content Modals (Full Article View)
  // ============================================

  // Generic Full Content Modal
  function openContentModal({ title, subtitle, content, tags, actionBtn }) {
    // Remove existing
    const existing = document.querySelector('.modal-backdrop');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';

    // Use content directly (assumes safe HTML from members.json)
    const formattedContent = content;

    const tagsHtml = (tags || []).map(t => `<span class="tag">${t}</span>`).join('');

    modal.innerHTML = `
      <div class="modal-content modal-lg" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
        <button class="modal-close" onclick="closeModal()">✕</button>
        
        <header style="margin-bottom: var(--space-6); border-bottom: 1px solid var(--tan-dark); padding-bottom: var(--space-4);">
            <div style="font-size: var(--text-sm); color: var(--accent); margin-bottom: var(--space-2);">${subtitle}</div>
            <h1 style="font-family: var(--font-serif); font-size: var(--text-3xl); line-height: 1.2;">${title}</h1>
            <div style="display: flex; gap: var(--space-2); margin-top: var(--space-3);">
                ${tagsHtml}
            </div>
        </header>

        <div class="article-body" style="font-size: var(--text-lg); line-height: 1.7; margin-bottom: var(--space-8);">
            ${formattedContent}
        </div>

        <div class="modal-actions" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--tan-dark); padding-top: var(--space-4);">
            <div style="display: flex; gap: var(--space-4);">
                <button class="btn-icon" onclick="this.classList.toggle('active'); this.style.color = this.classList.contains('active') ? 'red' : '';">
                    ♥ <span style="font-size: var(--text-sm);">Like</span>
                </button>
                <button class="btn-icon">
                    💬 <span style="font-size: var(--text-sm);">Comment</span>
                </button>
            </div>
            ${actionBtn}
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('active'));
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  }

  window.openProjectModal = function (id) {
    const project = appData.projects.find(p => p.id === id);
    if (!project) return;

    openContentModal({
      title: project.title,
      subtitle: `Project by ${project.proposer}`,
      content: project.content || project.description,
      tags: project.tags,
      actionBtn: `<button onclick="openConnectModal(${project.id}, 'project')" class="btn btn-primary">Connect / Contribute</button>`
    });
  };

  window.openEventModal = function (id) {
    const event = appData.events.find(e => e.id === id);
    if (!event) return;

    openContentModal({
      title: event.title,
      subtitle: `Event hosted by ${event.host} · ${event.date}`,
      content: event.content || event.description,
      tags: [event.type],
      actionBtn: `<button onclick="openConnectModal(${event.id}, 'event')" class="btn btn-primary">RSVP Now</button>`
    });
  };

  window.openResourceModal = function (id) {
    const resource = appData.resources ? appData.resources.find(r => r.id === id) : null;
    if (!resource) return;

    openContentModal({
      title: resource.title,
      subtitle: `Written by ${resource.author} · ${resource.readTime}`,
      content: resource.content,
      tags: resource.tags,
      actionBtn: `<button class="btn btn-secondary">Bookmark</button>`
    });
  };

  // ============================================
  // Render Resources (New)
  // ============================================
  function renderResources(resources) {
    const grid = document.getElementById('resourcesGrid');
    if (!grid || !resources) return;

    grid.innerHTML = resources.map(resource => `
        <article class="card resource-card" onclick="openResourceModal(${resource.id})" style="cursor: pointer;">
          <div class="resource-icon">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
             </svg>
          </div>
          <div class="resource-content">
            <h4 class="resource-title">${resource.title}</h4>
            <p class="resource-excerpt">${resource.excerpt}</p>
            <div class="resource-meta">
              ${(resource.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
              <span>·</span>
              <span>${resource.readTime}</span>
            </div>
          </div>
        </article>
    `).join('');
  }

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

      // Save submission
      const submissions = JSON.parse(localStorage.getItem(`gce_${formName}`) || '[]');
      submissions.push({
        ...data,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(`gce_${formName}`, JSON.stringify(submissions));

      // SPECIAL: Handle Instant Signup (The "Test User" Flow)
      if (formName === 'join_submissions') {
        const currentUser = {
          name: data.name || 'New Member',
          email: data.email,
          role: data.work,
          verified: true // Auto-verify for testing
        };
        localStorage.setItem('gce_currentUser', JSON.stringify(currentUser));
        updateAuthUI(); // Refresh UI immediately
      }

      const button = form.querySelector('button[type="submit"]');
      const originalText = button.textContent;

      if (formName === 'join_submissions') {
        button.textContent = 'Welcome Aboard! 🎉';
      } else {
        button.textContent = 'Submitted! ✓';
      }

      button.disabled = true;
      button.style.background = '#4ade80';
      button.style.borderColor = '#4ade80';

      setTimeout(() => {
        form.reset();
        button.textContent = originalText;
        button.disabled = false;
        button.style.background = '';
        button.style.borderColor = '';

        // For join form, maybe scroll to top or redirect?
        if (formName === 'join_submissions') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          // Ideally reload to see all auth changes, or rely on updateAuthUI
        }
      }, 2000);
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
      top: 57px;
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

  /* =========================================
     Projects Rendering
     ========================================= */
  function renderProjects(projects) {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    projects.forEach(project => {
      let statusColor = 'var(--accent)';
      let statusText = 'Looking for Help'; // Default

      if (project.status === 'in-progress') {
        statusColor = '#4ade80';
        statusText = 'In Progress';
      }

      const tagsHtml = project.tags.map(t => `<span class="tag">${t}</span>`).join('');

      const card = document.createElement('article');
      card.className = 'card';
      card.style.borderLeft = `4px solid ${statusColor}`;

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-4);">
            <div style="flex: 1; min-width: 280px; cursor: pointer;" onclick="openProjectModal(${project.id})">
                <div style="display: flex; gap: var(--space-2); align-items: center; margin-bottom: var(--space-2);">
                    <span class="badge" style="background: ${statusColor}; color: #fff;">${statusText}</span>
                    <span style="color: var(--ink-muted); font-size: var(--text-xs);">Posted ${project.postedDate || project.startedDate}</span>
                </div>
                <h3 style="margin-bottom: var(--space-2); text-decoration: underline; text-decoration-color: transparent; transition: all 0.2s;">${project.title}</h3>
                <p style="color: var(--text-secondary); margin-bottom: var(--space-4);">${project.description}</p>
                <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
                    ${tagsHtml}
                </div>
            </div>
            <div style="text-align: right;">
                <p style="font-size: var(--text-sm); color: var(--ink-muted); margin-bottom: var(--space-2);">
                    ${project.proposer ? 'Proposed by' : 'Team'}
                </p>
                <!-- Clickable Proposer Name -->
                <p style="font-weight: 500; cursor: pointer; text-decoration: underline; text-decoration-color: var(--accent);" 
                   onclick="openMemberProfile('${project.proposer}')">
                   ${project.proposer || (project.team + ' members')}
                </p>
                <button onclick="openConnectModal(${project.id}, 'project')" class="btn btn-secondary" style="margin-top: var(--space-3);">Connect</button>
            </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  /* =========================================
     Events Rendering
     ========================================= */
  function renderEvents(events) {
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    events.forEach(event => {
      const badgeClass = event.type === 'virtual' ? 'badge-primary' : 'badge-accent';
      const badgeText = event.type === 'virtual' ? 'Virtual' : 'In-Person';

      const card = document.createElement('article');
      card.className = 'card';

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-4);">
            <span class="badge ${badgeClass}">${badgeText}</span>
            <span style="font-size: var(--text-sm); color: var(--ink-muted);">${event.date}</span>
        </div>
        <div style="cursor: pointer;" onclick="openEventModal(${event.id})">
            <h4 style="margin-bottom: var(--space-2); text-decoration: underline; text-decoration-color: transparent;">${event.title}</h4>
            <p style="color: var(--text-secondary); font-size: var(--text-sm); margin-bottom: var(--space-4);">${event.description}</p>
        </div>
        <div style="display: flex; gap: var(--space-3); align-items: center; margin-bottom: var(--space-4);">
            <div class="member-avatar" style="width: 32px; height: 32px; font-size: var(--text-sm);">${event.hostInitials}</div>
            <span style="font-size: var(--text-sm); cursor:pointer; text-decoration:underline;" onclick="openMemberProfile('${event.host}')">Hosted by ${event.host}</span>
        </div>
        <button onclick="openConnectModal(${event.id}, 'event')" class="btn btn-secondary" style="width: 100%;">RSVP</button>
      `;
      grid.appendChild(card);
    });
  }
});
