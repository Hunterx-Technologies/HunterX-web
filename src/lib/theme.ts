export const THEME_STORAGE_KEY = "hx-theme";
export const INTRO_SESSION_KEY = "hx-intro-seen";
export const ZEN_STORAGE_KEY = "hx-legal-zen";

/**
 * Runs in <head> before first paint (inline, first-party, no cookies):
 * - applies the saved theme, else the OS preference on first visit, else dark;
 * - marks JS as available (enables scroll reveals);
 * - marks the home intro as already seen this session, or skips it for
 *   reduced-motion users;
 * - re-applies Zen Mode on the legal pages if the reader left it on.
 */
export const BOOT_SCRIPT = `(function(){var d=document.documentElement;d.setAttribute('data-js','');
try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}
d.classList.toggle('dark',t==='dark');d.style.colorScheme=t}catch(e){}
try{if(sessionStorage.getItem('${INTRO_SESSION_KEY}')||window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.setAttribute('data-intro-seen','')}}catch(e){d.setAttribute('data-intro-seen','')}
try{if(/^\\/(privacy|terms)\\/?$/.test(location.pathname)&&localStorage.getItem('${ZEN_STORAGE_KEY}')==='1'){d.setAttribute('data-zen','')}}catch(e){}})();`;
