const INTRO_FIELDS = [
  ['summary', '这篇讲什么'],
  ['audience', '适合谁看'],
  ['takeaway', '读完你会得到']
];

const CALLOUT_LABELS = {
  '提示': 'tip',
  '注意': 'note',
  '警告': 'warning',
  '总结': 'summary',
  '结论': 'summary'
};

function getTrimmedString(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

function stripHtml(value) {
  return String(value || '').replace(/<[^>]+>/g, '');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getArticleIntroItems(post) {
  return INTRO_FIELDS.map(([field, label]) => {
    const content = getTrimmedString(post[field]);
    return content ? { label, content } : null;
  }).filter(Boolean);
}

function getArticleOutroData(post) {
  const closing = getTrimmedString(post.closing);
  const nextReadingUrl = getTrimmedString(post.next_reading);
  const nextReadingTitle = getTrimmedString(post.next_reading_title);

  if (!closing && !nextReadingUrl && !nextReadingTitle) {
    return null;
  }

  return {
    closing,
    nextReadingUrl,
    nextReadingTitle: nextReadingTitle || nextReadingUrl
  };
}

function normalizeCalloutParagraphContent(paragraphHtml) {
  const breakMatch = paragraphHtml.match(/^([\s\S]*?)<br\s*\/?>([\s\S]*)$/i);
  if (!breakMatch) {
    return null;
  }

  return {
    title: stripHtml(breakMatch[1]).trim(),
    bodyHtml: breakMatch[2].trim()
  };
}

function normalizeCalloutBlockquote(innerHtml) {
  const normalized = innerHtml.trim();
  const paragraphMatch = normalized.match(/^<p>([\s\S]*?)<\/p>([\s\S]*)$/i);
  if (!paragraphMatch) {
    return null;
  }

  const firstParagraphHtml = paragraphMatch[1].trim();
  const restHtml = paragraphMatch[2].trim();
  const breakVariant = normalizeCalloutParagraphContent(firstParagraphHtml);

  if (breakVariant) {
    return breakVariant;
  }

  if (!restHtml) {
    return null;
  }

  return {
    title: stripHtml(firstParagraphHtml).trim(),
    bodyHtml: restHtml
  };
}

function transformPortableCallouts(content) {
  if (!content || content.indexOf('<blockquote') === -1) {
    return content;
  }

  return content.replace(/<blockquote>([\s\S]*?)<\/blockquote>/gi, (match, innerHtml) => {
    const normalized = normalizeCalloutBlockquote(innerHtml);
    if (!normalized) {
      return match;
    }

    const variant = CALLOUT_LABELS[normalized.title];
    if (!variant || !normalized.bodyHtml) {
      return match;
    }

    const bodyHtml = /^<p[\s>]/i.test(normalized.bodyHtml)
      ? normalized.bodyHtml
      : `<p>${normalized.bodyHtml}</p>`;

    return [
      `<aside class="lq-callout lq-callout--${variant}" data-callout-label="${escapeHtml(normalized.title)}">`,
      `  <div class="lq-callout__title">${escapeHtml(normalized.title)}</div>`,
      `  <div class="lq-callout__body">${bodyHtml}</div>`,
      '</aside>'
    ].join('');
  });
}

module.exports = {
  getArticleIntroItems,
  getArticleOutroData,
  transformPortableCallouts
};
