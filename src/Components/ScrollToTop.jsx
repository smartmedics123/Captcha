import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      

      // Set inline styles for smooth scrolling
      document.documentElement.style.scrollBehavior = 'smooth';
      document.body.style.scrollBehavior = 'smooth';

      // Scroll to the top
      document.body.scrollTop = 0; // For iOS Safari
      document.documentElement.scrollTop = 0; // For other browsers

      // Smooth scroll using window.scrollTo if supported
      if (typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Reset inline styles after scrolling
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = '';
        document.body.style.scrollBehavior = '';
      }, 500); // Delay ensures the scroll is complete before resetting styles
    };

    // Scroll to top whenever the pathname changes
    scrollToTop();

    // Listen for clicks on links to the same path
    const handleLinkClick = (event) => {
      const targetLink = event.target.closest('a[href]');
      if (targetLink) {
        const targetHref = targetLink.getAttribute('href');
        if (targetHref === pathname) {
          scrollToTop(); // Scroll to top again if the link points to the same path
        }
      }
    };

    // Add event listener for link clicks
    document.addEventListener('click', handleLinkClick);

    return () => {
      // Clean up the event listener on component unmount
      document.removeEventListener('click', handleLinkClick);
    };
  }, [pathname]);

  return null;
}

export default ScrollToTop;
