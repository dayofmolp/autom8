// Reading Progress Bar
document.addEventListener('DOMContentLoaded', function() {
  // Only run if we're on a post page
  if (!document.querySelector('.post-content')) return;
  
  const progressBar = document.querySelector('.reading-progress');
  const content = document.querySelector('.post-content');
  
  if (!progressBar || !content) return;
  
  // Calculate reading progress
  function updateProgress() {
    const contentBox = content.getBoundingClientRect();
    const contentHeight = contentBox.height;
    const contentTop = contentBox.top;
    const windowHeight = window.innerHeight;
    
    // How far we've scrolled through the content
    let progress = 0;
    
    if (contentTop <= 0) {
      // Content top is above viewport
      let scrolled = Math.abs(contentTop);
      progress = (scrolled / (contentHeight - windowHeight)) * 100;
    }
    
    // Clamp progress between 0 and 100
    progress = Math.min(100, Math.max(0, progress));
    
    // Update progress bar width
    progressBar.style.width = `${progress}%`;
  }
  
  // Initial update
  updateProgress();
  
  // Update on scroll
  window.addEventListener('scroll', updateProgress);
  
  // Update on resize
  window.addEventListener('resize', updateProgress);
});

// Table of Contents Active Link
document.addEventListener('DOMContentLoaded', function() {
  const headings = document.querySelectorAll('.post-content h2, .post-content h3');
  const tocLinks = document.querySelectorAll('.toc-item a');
  
  if (!headings.length || !tocLinks.length) return;
  
  // Create an array of heading positions
  const headingPositions = Array.from(headings).map(heading => {
    return {
      id: heading.id,
      top: heading.getBoundingClientRect().top + window.pageYOffset - 100 // Offset for sticky header
    };
  });
  
  // Update active TOC link on scroll
  function updateActiveTocLink() {
    const scrollPosition = window.pageYOffset;
    
    // Find the current heading
    let currentHeadingIndex = headingPositions.findIndex(heading => heading.top > scrollPosition);
    
    if (currentHeadingIndex === -1) {
      currentHeadingIndex = headingPositions.length;
    }
    
    // The heading before the current one is the active one
    currentHeadingIndex = Math.max(0, currentHeadingIndex - 1);
    
    // Remove active class from all TOC links
    tocLinks.forEach(link => {
      link.parentElement.classList.remove('active');
    });
    
    // Add active class to current TOC link
    if (currentHeadingIndex >= 0 && currentHeadingIndex < headingPositions.length) {
      const currentHeadingId = headingPositions[currentHeadingIndex].id;
      const currentTocLink = document.querySelector(`.toc-item a[href="#${currentHeadingId}"]`);
      
      if (currentTocLink) {
        currentTocLink.parentElement.classList.add('active');
      }
    }
  }
  
  // Initial update
  updateActiveTocLink();
  
  // Update on scroll
  window.addEventListener('scroll', updateActiveTocLink);
});

// Back to Top Button
document.addEventListener('DOMContentLoaded', function() {
  const backToTopButton = document.getElementById('back-to-top');
  
  if (!backToTopButton) return;
  
  // Show/hide button based on scroll position
  function toggleBackToTopButton() {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  }
  
  // Scroll to top when button is clicked
  backToTopButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Initial update
  toggleBackToTopButton();
  
  // Update on scroll
  window.addEventListener('scroll', toggleBackToTopButton);
});

// Dark Mode Toggle
document.addEventListener('DOMContentLoaded', function() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  if (!darkModeToggle) return;
  
  // Check for saved theme preference or use OS preference
  function getThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      return savedTheme;
    }
    
    return prefersDarkScheme.matches ? 'dark' : 'light';
  }
  
  // Set theme
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update toggle button
    if (darkModeToggle) {
      darkModeToggle.checked = theme === 'dark';
    }
  }
  
  // Initialize theme
  setTheme(getThemePreference());
  
  // Toggle theme when button is clicked
  darkModeToggle.addEventListener('change', function() {
    const newTheme = this.checked ? 'dark' : 'light';
    setTheme(newTheme);
  });
  
  // Update theme when OS preference changes
  prefersDarkScheme.addEventListener('change', function(e) {
    const newTheme = e.matches ? 'dark' : 'light';
    setTheme(newTheme);
  });
});

// Image Lazy Loading
document.addEventListener('DOMContentLoaded', function() {
  // Use native lazy loading if supported
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      img.setAttribute('loading', 'lazy');
    });
  } else {
    // Fallback for browsers that don't support native lazy loading
    const lazyImages = [].slice.call(document.querySelectorAll('img[data-src]'));
    
    if (!lazyImages.length) return;
    
    // Intersection Observer
    const lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.removeAttribute('data-src');
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });
    
    // Observe each lazy image
    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  }
});

// Estimated Reading Time
document.addEventListener('DOMContentLoaded', function() {
  const article = document.querySelector('.post-content');
  const readingTimeElement = document.querySelector('.post-reading-time span');
  
  if (!article || !readingTimeElement) return;
  
  // Count words in article
  const text = article.textContent;
  const wordCount = text.split(/\s+/).length;
  
  // Calculate reading time (average reading speed: 200 words per minute)
  const readingTime = Math.ceil(wordCount / 200);
  
  // Update reading time element
  readingTimeElement.textContent = readingTime + ' min read';
});

// Smooth Scrolling for Anchor Links
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Skip if href is just "#"
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
