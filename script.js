class HerbXApp {
  constructor() {
    this.currentView = 'welcome';
    this.currentUnit = null;
    this.searchQuery = '';
    this.app = document.getElementById('app');

    // Herbal plant images for marquee
    this.herbalImages = [
      { src: 'img/1.jpg'},
      { src: 'img/2.jpg'},
      { src: 'img/3.jpg'},
      { src: 'img/4.jpg'},
      { src: 'img/5.jpg'},
    ];

    // App info data (still in script for basic info)
    this.appInfo = {
      "title": "SMC-HerbX Mobile Dictionary",
      "subtitle": "Your complete pocket companion to natural medicines and herbal pharmacology",
      "description": " Mobile Herbal Drugs Dictionary App SMC-HerbX Mobile Dictionary is specially designed based on the 2024 Botany Department syllabus of St. Mary's College(Autonomous), Thoothukudi.   It serves as a quick reference guide for students, teachers, and herbal enthusiasts, focusing on important herbal drug names along with their uses and examples, exactly as prescribed in the curriculum.",
      "authors": [
        {
          "name": "Dr. Sr. A. Arockia Jenecius Alphonse",
          "position": "Head & Associate Professor",
          "department": "Department of Botany",
          "institution": "St.Mary's College (Autonomous)",
          "location": "Thoothukudi-620001, Tamil Nadu, India",
          "mobile": "7094277190", 
          "email": "arockia@stmaryscollege.edu.in"
        },
        {
          "name": "Dr. A.Antony Selvi",
          "position": "Assistant Professor",
          "department": "Department of Botany",
          "institution": "St.Mary's College (Autonomous)",
          "location": "Thoothukudi-620001, Tamil Nadu, India",
          "mobile": "7094277190", 
          "email": "selvi2438@gmail.com"
        }
      ]
    };

    // Units data will be loaded from JSON
    this.unitsData = null;

    // Load units data and initialize
    this.loadUnitsData().then(() => {
      this.init();
    }).catch(error => {
      console.error('Failed to load units data:', error);
      // Show error message to user
      this.app.innerHTML = `
        <div class="error-message">
          <h2>Error Loading Data</h2>
          <p>Failed to load herbal dictionary data. Please check if units_data.json file is available.</p>
        </div>
      `;
    });
  }

  async loadUnitsData() {
    try {
      const response = await fetch('units_data.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.unitsData = await response.json();
      console.log('Units data loaded successfully:', Object.keys(this.unitsData).length, 'units');
    } catch (error) {
      console.error('Error loading units data:', error);
      throw error;
    }
  }

  init() {
    if (!this.unitsData) {
      console.error('Units data not loaded');
      return;
    }
    this.renderWelcomeScreen();
  }

  renderCollegeHeader() {
    return `
    <div class="college-header">
      <div class="college-header-content">
        <div class="college-header-with-logos" style="display: flex; align-items: center; justify-content: center; gap: var(--space-20);">
          <img src="img/clg_logo.jpg" alt="College Logo" style="width: 60px; height: 60px; object-fit: contain;">
          <div style="text-align: center;">
            <h1>St. Mary's College</h1>
            <h3>(Autonomous)</h3><br>
            <h4>Department of Botany </h4>
            <p>Thoothukudi -620001</p>
          </div>
          <img src="img/dept_logo.jpg" alt="Department Logo" style="width: 60px; height: 60px; object-fit: contain;">
        </div>
      </div>
    </div>
    `;
  }

  renderImageMarquee() {
    const doubledImages = [...this.herbalImages, ...this.herbalImages];
    return `
      <div class="image-marquee">
        <div class="marquee-content">
          ${doubledImages.map(img => `
            <div class="marquee-item">
              <img src="${img.src}" loading="lazy">
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderWelcomeScreen() {
    if (!this.unitsData) return;

    this.app.innerHTML = `
      ${this.renderCollegeHeader()}
      ${this.renderImageMarquee()}

      <div class="welcome-screen">
        <h1 class="app-title">${this.appInfo.title}</h1>
        <p class="app-subtitle">${this.appInfo.subtitle}</p>
        <div class="app-description">${this.appInfo.description}</div>
      </div>

      <div class="search-container">
        <input type="text" 
               class="search-bar" 
               placeholder="Search herbal terms across all units..." 
               autocomplete="off"
               id="global-search">
      </div>

      <div class="nav-grid" id="nav-grid">
        ${this.renderUnitCards()}
      </div>
    `;

    this.currentView = 'welcome';
    this.currentUnit = null;
    this.searchQuery = '';

    this.setupWelcomeEventListeners();
  }

  renderUnitCards() {
    if (!this.unitsData) return '';

    return Object.entries(this.unitsData).map(([unitId, unit]) => `
      <div class="unit-card" data-unit="${unitId}">
        <div class="unit-title">${unit.title}</div>
        <div class="unit-description">${unit.description}</div>
      </div>
    `).join('');
  }

  showUnit(unitId) {
    if (!this.unitsData) return;

    const unit = this.unitsData[unitId];
    if (!unit) return;

    this.currentUnit = unitId;
    this.currentView = 'unit';

    this.app.innerHTML = `
      ${this.renderCollegeHeader()}

      <div class="unit-header">
        <button class="back-btn" id="back-button">← Back</button>
        <h2 class="unit-header-title">${unit.title}</h2>
      </div>

      <div class="search-container">
        <input type="text" 
               class="search-bar" 
               placeholder="Search in ${unit.title}..." 
               autocomplete="off"
               id="unit-search">
      </div>

      <div class="entries-container" id="entries-container">
        ${this.renderEntries(unit.entries)}
      </div>
    `;

    this.setupUnitEventListeners();
  }

  showContact() {
    this.currentView = 'contact';
    this.app.innerHTML = `
      ${this.renderCollegeHeader()}

      <div class="contact-container">
        <div class="contact-card">
          <h2 style="color: var(--color-success); margin-bottom: var(--space-24); text-align: center;">Contact Information</h2>

          <div class="contact-info">
            ${this.appInfo.authors.map(author => `
              <div class="author-info">
                <div class="author-name">${author.name}</div>
                <div class="author-position">${author.position}</div>
                <div class="author-position">${author.department}</div>
                <div style="margin-top: var(--space-8);">
                  <a href="mailto:${author.email}" class="author-email">${author.email}</a>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="college-info">
            <h3 style="color: var(--color-success); margin-bottom: var(--space-12);">St. Mary's College (Autonomous)</h3>
            <p style="margin: 0; color: var(--color-text-secondary);">
              Thoothukudi-620001<br>
              Tamil Nadu, India
            </p>
            <div style="margin-top: var(--space-16); padding-top: var(--space-16); border-top: 1px solid var(--color-card-border);">
              <p style="margin: 0; font-size: var(--font-size-sm); color: var(--color-text-secondary);">
                This herbal dictionary app is specially designed based on the 2024 Botany Department syllabus 
                and serves as a comprehensive reference guide for students, teachers, and herbal enthusiasts.
              </p>
            </div>
          </div>
        </div>
        <div style="text-align: center; margin-top: var(--space-24);">
          <button class="back-btn" onclick="app.showWelcome()">← Back to Home</button>
        </div>
      </div>
    `;
  }

  setupWelcomeEventListeners() {
    const unitCards = document.querySelectorAll('.unit-card');
    unitCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const unitId = card.getAttribute('data-unit');
        this.showUnit(unitId);
      });
    });

    const globalSearch = document.getElementById('global-search');
    if (globalSearch) {
      globalSearch.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.performGlobalSearch();
      });

      globalSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.performGlobalSearch();
        }
      });
    }
  }

  setupUnitEventListeners() {
    const backButton = document.getElementById('back-button');
    if (backButton) {
      backButton.addEventListener('click', () => {
        this.showWelcome();
      });
    }

    const unitSearch = document.getElementById('unit-search');
    if (unitSearch) {
      unitSearch.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.performUnitSearch();
      });

      unitSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.performUnitSearch();
        }
      });
    }
  }

  renderEntries(entries, highlight = false) {
    if (!entries || entries.length === 0) {
      return `
        <div class="no-results">
          <div class="no-results-icon">🌿</div>
          <h3>No entries found</h3>
          <p>Try adjusting your search terms.</p>
        </div>
      `;
    }
    const sortedEntries = [...entries].sort((a, b) => a.term.localeCompare(b.term));
    return sortedEntries.map(entry => `
      <div class="entry-card">
        <div class="entry-term">${highlight ? this.highlightText(entry.term) : entry.term}</div>
        ${this.renderEntryMeta(entry)}
        <div class="entry-definition">
          ${highlight ? this.highlightText(entry.definition) : entry.definition}
        </div>
        <div class="entry-example">
          <strong>Example:</strong> ${highlight ? this.highlightText(entry.example) : entry.example}
        </div>
      </div>
    `).join('');
  }

  renderEntryMeta(entry) {
    let metaHtml = '';
    if (entry.family) {
      metaHtml += `<span class="entry-family">Family: ${entry.family}</span>`;
    }
    if (entry.usefulPart) {
      metaHtml += `<span class="entry-useful-part">Part Used: ${entry.usefulPart}</span>`;
    }
    return metaHtml ? `<div class="entry-meta">${metaHtml}</div>` : '';
  }

  performGlobalSearch() {
    if (!this.unitsData) return;

    if (!this.searchQuery) {
      const navGrid = document.getElementById('nav-grid');
      if (navGrid) {
        navGrid.innerHTML = this.renderUnitCards();
        this.setupWelcomeEventListeners();
      }
      return;
    }

    let searchResults = [];

    Object.entries(this.unitsData).forEach(([unitId, unit]) => {
      const unitResults = this.searchInEntries(unit.entries);
      unitResults.forEach(entry => {
        entry._unitTitle = unit.title;
        entry._unitId = unitId;
      });
      searchResults.push(...unitResults);
    });

    const navGrid = document.getElementById('nav-grid');
    if (navGrid) {
      if (searchResults.length > 0) {
        navGrid.innerHTML = `
          <div style="grid-column: 1 / -1;">
            <h3 style="color: var(--color-success); margin-bottom: var(--space-16);">
              Search Results (${searchResults.length} found)
            </h3>
            ${this.renderEntries(searchResults, true)}
          </div>
        `;
      } else {
        navGrid.innerHTML = `
          <div class="no-results" style="grid-column: 1 / -1;">
            <div class="no-results-icon">🔍</div>
            <h3>No results found for "${this.searchQuery}"</h3>
            <p>Try different keywords or browse by units.</p>
          </div>
        `;
      }
    }
  }

  performUnitSearch() {
    if (!this.unitsData) return;

    const unit = this.unitsData[this.currentUnit];
    if (!unit) return;
    const entriesContainer = document.getElementById('entries-container');
    if (!entriesContainer) return;
    if (!this.searchQuery) {
      entriesContainer.innerHTML = this.renderEntries(unit.entries);
      return;
    }
    const searchResults = this.searchInEntries(unit.entries);
    entriesContainer.innerHTML = this.renderEntries(searchResults, true);
  }

  searchInEntries(entries) {
    if (!this.searchQuery) return entries;
    return entries.filter(entry => {
      const searchText = this.searchQuery.toLowerCase();
      return (
        entry.term.toLowerCase().includes(searchText) ||
        entry.definition.toLowerCase().includes(searchText) ||
        entry.example.toLowerCase().includes(searchText) ||
        (entry.family && entry.family.toLowerCase().includes(searchText)) ||
        (entry.usefulPart && entry.usefulPart.toLowerCase().includes(searchText))
      );
    });
  }

  highlightText(text) {
    if (!this.searchQuery.trim()) return text;
    const regex = new RegExp(`(${this.escapeRegExp(this.searchQuery)})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  showWelcome() {
    this.renderWelcomeScreen();
  }
}

// Initialize the app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new HerbXApp();
});