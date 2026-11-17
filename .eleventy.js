const i18n = require('eleventy-plugin-i18n');

module.exports = function(eleventyConfig) {
  // Define supported languages
  const languages = [
    'hu',     // Magyar
    'en',    // English (default)
    'zh', // Chinese (Simplified)
    'ja',    // Japanese
    'ko',    // Korean
    'fil',   // Filipino
    'vi',    // Vietnamese
    'id',    // Indonesian
    'ms',    // Malay
    'th',    // Thai
    'ru',    // Russian
    'uk',    // Ukrainian
    'de',    // German
    'pt'  // Portuguese (Brazil)
  ];
  const defaultLanguage = 'en';

  // Add i18n plugin
  eleventyConfig.addPlugin(i18n, {
    defaultLanguage,
    errorMode: 'allow-fallback',
    fallbackLocale: defaultLanguage,
    parser: 'json',
    parserOptions: {
      directories: ['src/_data/i18n']
    }
  });

  // Create language-specific collections
  languages.forEach(lang => {
    eleventyConfig.addCollection(`all_${lang}`, function(collectionApi) {
      return collectionApi.getAll().filter(item => {
        // For default language, include items without language prefix
        if (lang === defaultLanguage) {
          return !item.url.match(/^\/[a-z]{2}(-[A-Z]{2})?\//) || item.url.startsWith(`/${lang}/`);
        }
        return item.url.startsWith(`/${lang}/`);
      });
    });
  });

  // Add filter to localize URLs
  eleventyConfig.addFilter("localizeUrl", function(url, lang) {
    if (!url) return url;

    // Remove any existing language prefix
    url = url.replace(/^\/[a-z]{2}(-[A-Z]{2})?\//, '/');

    // For English (default language), don't add language prefix
    if (lang === defaultLanguage) {
      return url;
    }

    // For other languages, add language prefix
    const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
    return `/${lang}/${cleanUrl}`;
  });

  // Add filter to get available translations
  eleventyConfig.addFilter("getAvailableLanguages", function(page) {
    return languages.filter(lang => {
      const localizedUrl = this.localizeUrl(page.url, lang);
      return this.collections[`all_${lang}`].some(item => item.url === localizedUrl);
    });
  });

  // Add filter to get language name
  eleventyConfig.addFilter("getLanguageName", function(code) {
    const languageNames = {
      'hu': 'Magyar',
      'en': 'English',
      'zh': '简体中文',
      'ja': '日本語',
      'ko': '한국어',
      'fil': 'Filipino',
      'vi': 'Tiếng Việt',
      'id': 'Bahasa Indonesia',
      'ms': 'Bahasa Melayu',
      'th': 'ไทย',
      'ru': 'Русский',
      'uk': 'Українська',
      'de': 'Deutsch',
      'pt': 'Português (Brasil)'
    };
    return languageNames[code] || code;
  });

  // Custom filter to remove trailing slashes
  eleventyConfig.addFilter("removeTrailingSlash", function(url) {
    if(url === '/') {
      return url;
    }
    return url.endsWith('/') ? url.slice(0, -1) : url;
  });

  // Copy static files
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/sitemap.xml");

  // Add filter to check if URL starts with a string
  eleventyConfig.addFilter("startsWith", function(str, prefix) {
    return str.startsWith(prefix);
  });

  // Minimal printf-style "format" filter (Jinja-compatible subset: %d, %0Nd, %s),
  // used by the HUD templates, e.g. {{ '%02d' | format(loop.index) }}.
  eleventyConfig.addFilter("format", function(fmt, ...args) {
    let i = 0;
    return String(fmt).replace(/%(0?)(\d*)([ds%])/g, (m, zero, width, type) => {
      if (type === '%') return '%';
      let v = args[i++];
      v = type === 'd' ? String(parseInt(v, 10) || 0) : String(v ?? '');
      const w = parseInt(width, 10) || 0;
      return v.padStart(w, zero ? '0' : ' ');
    });
  });

  // True if a site-relative asset (e.g. "/assets/x.webp") exists in src/,
  // so optional images (wiki gallery) aren't rendered as broken links.
  eleventyConfig.addFilter("assetExists", function(url) {
    if (!url || !String(url).startsWith('/')) return false;
    return require('fs').existsSync(require('path').join(__dirname, 'src', String(url)));
  });

  // Add filter for ternary operation
  eleventyConfig.addFilter("ternary", function(condition, trueValue, falseValue) {
    return condition ? trueValue : falseValue;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    // Disable template parsing on HTML files so React/JSX `{{ ... }}` and
    // CSS `{ ... }` braces don't get interpreted as Liquid output tags.
    htmlTemplateEngine: false,
    markdownTemplateEngine: false
  };
};
