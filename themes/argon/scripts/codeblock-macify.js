function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatLanguageLabel(rawLanguage) {
  const normalized = (rawLanguage || '').toLowerCase();
  const aliases = {
    bash: 'Bash',
    shell: 'Shell',
    sh: 'Shell',
    zsh: 'Zsh',
    c: 'C',
    'c++': 'C++',
    cpp: 'C++',
    cs: 'C#',
    csharp: 'C#',
    css: 'CSS',
    go: 'Go',
    html: 'HTML',
    java: 'Java',
    javascript: 'JavaScript',
    js: 'JavaScript',
    json: 'JSON',
    jsx: 'JSX',
    kotlin: 'Kotlin',
    md: 'Markdown',
    markdown: 'Markdown',
    none: 'Text',
    plain: 'Text',
    plaintext: 'Text',
    py: 'Python',
    python: 'Python',
    rb: 'Ruby',
    ruby: 'Ruby',
    rust: 'Rust',
    sql: 'SQL',
    text: 'Text',
    ts: 'TypeScript',
    tsx: 'TSX',
    typescript: 'TypeScript',
    vue: 'Vue',
    xml: 'XML',
    yaml: 'YAML',
    yml: 'YAML'
  };

  if (aliases[normalized]) {
    return aliases[normalized];
  }

  if (!rawLanguage) {
    return 'Code';
  }

  return rawLanguage.charAt(0).toUpperCase() + rawLanguage.slice(1);
}

function getPrimaryLanguage(classNames) {
  const ignored = new Set(['highlight', 'lq-codeblock', 'lq-codeblock--mac']);
  return classNames.find((name) => !ignored.has(name.toLowerCase())) || '';
}

function buildToolbar(label) {
  const escapedLabel = escapeHtml(label);
  return [
    '<div class="lq-codeblock-toolbar" aria-hidden="true">',
    '  <span class="lq-codeblock-dots">',
    '    <span class="lq-codeblock-dot lq-codeblock-dot--close"></span>',
    '    <span class="lq-codeblock-dot lq-codeblock-dot--minimize"></span>',
    '    <span class="lq-codeblock-dot lq-codeblock-dot--expand"></span>',
    '  </span>',
    `  <span class="lq-codeblock-language">${escapedLabel}</span>`,
    '</div>'
  ].join('');
}

function addMacCodeBlockChrome(content) {
  if (!content || content.indexOf('class="highlight') === -1) {
    return content;
  }

  return content.replace(/<figure class="([^"]*\bhighlight\b[^"]*)">([\s\S]*?)<\/figure>/gi, (match, classAttr, innerHtml) => {
    if (classAttr.indexOf('lq-codeblock--mac') !== -1 || innerHtml.indexOf('lq-codeblock-toolbar') !== -1) {
      return match;
    }

    const classNames = classAttr.split(/\s+/).filter(Boolean);
    const primaryLanguage = getPrimaryLanguage(classNames);
    const languageLabel = formatLanguageLabel(primaryLanguage);
    const mergedClasses = `${classAttr} lq-codeblock lq-codeblock--mac`;

    return `<figure class="${mergedClasses}" data-code-language="${escapeHtml(languageLabel)}">${buildToolbar(languageLabel)}${innerHtml}</figure>`;
  });
}

module.exports = {
  addMacCodeBlockChrome,
  formatLanguageLabel
};
