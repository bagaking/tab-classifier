module.exports = {
  name: 'Tab Classifier',
  version: '1.0.0',
  description: 'Collect tabs to md easily. ',
  author: 'bagaking',
  email: 'kinghand@foxmail.com',
  repo_url: 'https://github.com/bagaking/tab-classifier',
  manifest_version: 2,
  icons: {
    '16': 'icons/main.png',
    '48': 'icons/main.png',
    '128': 'icons/main.png'
  },
  permissions: [
    '*://*/',
    'storage',
    'contextMenus',
    'clipboardWrite',
    'clipboardRead'
  ],
  browser_action: {
    default_icon: {
      '19': 'icons/main.png',
      '38': 'icons/main.png',
      '128': 'icons/main.png'
    },
    default_title: "default title",
    default_popup: "pages/popup.html"
  },
  background: {
    persistent: false,
    scripts: ['js/background.js']
  },
  // devtools_page: 'pages/devtools.html',
  options_page: 'pages/options.html',
  content_scripts: [
    {
      js: ['js/inject.js'],
      run_at: 'document_end',
      matches: ['<all_urls>'],
      all_frames: false
    }
  ],
  content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",
  web_accessible_resources: ['js/content.js']
}
