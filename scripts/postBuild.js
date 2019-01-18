const fs = require('fs');

function setScripts() {
  // Prepare
  const distDir = fs.readdirSync('./dist');
  const indexHtmlParts = fs.readFileSync('./dist/index.html', 'utf8').split('\n');

  // Prepare files.
  let modularFiles = distDir.filter(entry => entry.includes('.mjs') && !entry.includes('.map'));
  modularFiles = modularFiles.map(entry => `  <script type="module" src="${entry}"></script>`);
  let legacyFiles = distDir.filter(entry => entry.includes('.js') && !entry.includes('.map'));
  legacyFiles = legacyFiles.map(entry => `  <script nomodule src="${entry}"></script>`);

  // Insert module builds
  const endTitle = indexHtmlParts.find((part) => part.includes('</title>'));
  const titleEndIndex = indexHtmlParts.indexOf(endTitle);
  indexHtmlParts.splice(titleEndIndex + 1, 0, ...modularFiles);

  // Insert legacy builds
  const endBody = indexHtmlParts.find((part) => part.includes('</body>'));
  const bodyEndIndex = indexHtmlParts.indexOf(endBody);
  indexHtmlParts.splice(bodyEndIndex, 1, ...legacyFiles, '</body>');

  const indexHtml = indexHtmlParts.join('\n');
  fs.unlinkSync('./dist/index.html');
  fs.writeFileSync('./dist/index.html', indexHtml)
}

setScripts();
