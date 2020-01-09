const showdown = require('showdown');
const fs = require('fs');
const path = require('path');
const top = require('./default/top');
const bottom = require('./default/bottom');

function markdown2HTML(name) {
  const converter = new showdown.Converter({ metadata: true });
  const content = fs.readFileSync(
    path.join(process.env.INIT_CWD, 'posts', `${name}.md`),
    { encoding: 'utf8' }
  );

  const html = converter.makeHtml(content);
  const metadata = converter.getMetadata();

  return { html, metadata };
}

function getPostFilenames() {
  const files = fs.readdirSync(path.join(process.env.INIT_CWD, 'posts'));
  const names = files
    .filter(file => path.extname(file) === '.md')
    .filter(file => file.charAt(0) !== '_')
    .map(file => path.basename(file, '.md'));

  return names;
}

function buildHomeHTML() {
  return `${top()}
<div id="my-social">
  <div class="main-content">
    <div class="pure-g">
      <div class="pure-u-1-4">
        <p class="social-media-name"><a href="/blog">BLOG</a></p>
      </div>
      <div class="pure-u-1-4">
        <p class="social-media-name"><a href="https://github.com/mdamaceno" target="_blank">GITHUB</a></p>
      </div>
      <div class="pure-u-1-4">
        <p class="social-media-name"><a href="https://www.linkedin.com/in/marcodamaceno/" target="_blank">LINKEDIN</a></p>
      </div>
      <div class="pure-u-1-4">
        <p class="social-media-name"><a href="https://twitter.com/mdamaceno" target="_blank">TWITTER</a></p>
      </div>
    </div>
  </div>
</div>
<div id="my-description">
  <div class="main-content">
    <div class="pure-g">
      <div class="pure-u-2-5">
        <div class="main-photo">
          <p></p>
        </div>
      </div>
      <div class="pure-u-3-5">
        <h1>Marco Damaceno</h1>
        <p>Sou um brasileiro que atualmente mora em Juiz de Fora - MG e que não gosta de chocolate e carnaval. Além disso, trabalho com desenvolvimento de software desde 2012. Desde então, venho aprimorando técnicas e adquirindo conhecimento. Minhas linguagens favoritas são Ruby, PHP e Javascript.</p>

        <p>Meu email: maadamaceno@gmail.com</p>
    </div>
  </div>
</div>
${bottom}`;
}

function buildPostsHTML(name) {
  const { html, metadata } = markdown2HTML(name);

  return `${top(metadata)}
<div class="main-content pure-g">
  <div class="pure-u-24-24">
    ${html}
  </div>
</div>
${bottom}`;
}

function getFile(name) {
  return fs.readFileSync(path.join(process.env.INIT_CWD, 'public', `${name}`));
}

module.exports = {
  markdown2HTML,
  getPostFilenames,
  buildPostsHTML,
  buildHomeHTML,
  getFile,
};
