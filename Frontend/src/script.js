const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.jsx')) filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync('d:/Sikkim-Travel-GuideMERNInternship_2025/Frontend/src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace Unsplash URLs with resized versions
  content = content.replace(/(https:\/\/images\.unsplash\.com\/[^"\'`\?{}]+)(?:\?[^"\'`]*)?(["\'`])/gi, (match, urlBase, closingQuote) => {
    return urlBase + '?w=400&q=60&auto=format&fit=crop' + closingQuote;
  });

  // Inject attributes to img tags
  content = content.replace(/<img\s([^>]+)>/gi, (match, p1) => {
    let attrs = p1;
    let isSelfClosing = match.endsWith('/>');
    
    if (isSelfClosing) {
        attrs = attrs.substring(0, attrs.length - 1).trim();
    }
    
    if (!attrs.includes('loading=')) {
        attrs += ' loading="lazy"';
    }
    if (!attrs.includes('decoding=')) {
        attrs += ' decoding="async"';
    }
    if (!/width=/.test(attrs)) {
        attrs += ' width="400"';
    }
    if (!/height=/.test(attrs)) {
        attrs += ' height="300"';
    }

    if (isSelfClosing) {
        return `<img ${attrs} />`;
    } else {
        return `<img ${attrs}></img>`; // or just `<img>` but mostly jsx requires closing or self-closing
    }
  });
  
  // Also we want to ensure any <img ...> in jsx that is not self-closed or closed gets />
  content = content.replace(/<img([^>]*(?<!\/))>(?!<\/img>)/gi, '<img$1 />');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
