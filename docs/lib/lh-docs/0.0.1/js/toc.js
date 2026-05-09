(function () {
  'use strict';

  const tocContainers = Array.from(document.querySelectorAll('.table-of-contents'));
  const tocContainer = tocContainers.find(c => !c.closest('.toc-on-top'));
  if (!tocContainer) return;

  const tocLinks = tocContainer.querySelectorAll('a[href^="#"]');
  if (tocLinks.length === 0) return;

  const footer = document.querySelector('footer.page-footer');
  const tocTopOffset = 80;
  const footerMargin = 20;
  const mainBottomOffset = 100;
  const viewportHeaderOffset = 200;

  const indicator = document.createElement('div');
  indicator.className = 'toc-indicator';
  tocContainer.appendChild(indicator);

  const headings = [];
  tocLinks.forEach(link => {
    const id = link.getAttribute('href').slice(1);
    const heading = document.getElementById(id);
    if (heading) {
      headings.push({ id, element: heading, link });
    }
  });

  if (headings.length === 0) return;

  let activeLink = null;

  function updateIndicator(link) {
    if (!link) {
      indicator.style.opacity = '0';
      return;
    }

    const tocRect = tocContainer.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    const top = linkRect.top - tocRect.top;
    const height = linkRect.height;

    indicator.style.top = top + 'px';
    indicator.style.height = height + 'px';
    indicator.style.opacity = '1';
  }

  function setActiveLink(link) {
    if (activeLink !== link) {
      if (activeLink) {
        activeLink.classList.remove('active');
      }

      activeLink = link;
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }

    updateIndicator(link);
  }

  function updateTocPosition() {
    if (!footer) return;

    const footerRect = footer.getBoundingClientRect();
    const tocRect = tocContainer.getBoundingClientRect();
    const tocBottom = tocTopOffset + tocRect.height + footerMargin;

    if (footerRect.top < tocBottom) {
      const newTop = footerRect.top - tocRect.height - footerMargin;
      tocContainer.style.top = newTop + 'px';
    } else {
      tocContainer.style.top = tocTopOffset + 'px';
    }
  }

  function onScroll() {
    const scrollY = window.scrollY;
    const mainContent = document.querySelector('main');

    let currentHeading = null;

    if (mainContent) {
      const mainRect = mainContent.getBoundingClientRect();
      const mainBottom = mainRect.bottom;
      const viewportHeight = window.innerHeight - mainBottomOffset;

      if (mainBottom <= viewportHeight) {
        currentHeading = headings[headings.length - 1].link;
        setActiveLink(currentHeading);
        updateTocPosition();
        return;
      }
    }

    for (let i = 0; i < headings.length; i++) {
      const { element, link } = headings[i];
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrollY;

      if (elementTop <= scrollY + viewportHeaderOffset) {
        currentHeading = link;
      } else {
        break;
      }
    }

    if (!currentHeading && headings.length > 0) {
      currentHeading = headings[0].link;
    }

    setActiveLink(currentHeading);
    updateTocPosition();
  }

  let ticking = false;
  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
  onScroll();
})();
