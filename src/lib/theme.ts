export const INTRO_SESSION_KEY = "hx-intro-seen";
export const ZEN_STORAGE_KEY = "hx-legal-zen";

/**
 * Runs in <head> before first paint (inline, first-party, no cookies):
 * - marks JS as available (enables scroll reveals);
 * - marks the home intro as already seen this session, or skips it for
 *   reduced-motion users;
 * - re-applies Zen Mode on the legal pages if the reader left it on.
 */
export const BOOT_SCRIPT = `(function(){var d=document.documentElement;d.setAttribute('data-js','');
try{if(sessionStorage.getItem('${INTRO_SESSION_KEY}')||window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.setAttribute('data-intro-seen','')}}catch(e){d.setAttribute('data-intro-seen','')}
try{if(/^\\/(privacy|terms)\\/?$/.test(location.pathname)&&localStorage.getItem('${ZEN_STORAGE_KEY}')==='1'){d.setAttribute('data-zen','')}}catch(e){}})();`;
