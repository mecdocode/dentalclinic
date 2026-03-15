const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '_data', 'blog');
const outputFile = path.join(__dirname, '_data', 'blog_index.json');

// Ensure _data directory exists
if (!fs.existsSync(path.join(__dirname, '_data'))) {
  fs.mkdirSync(path.join(__dirname, '_data'));
}
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir);
}

const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));

const posts = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(blogDir, file), 'utf8');
  const slug = file.replace('.md', '');
  
  // Extract frontmatter
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const meta = { slug };
  
  if (match) {
    const lines = match[1].split(/\r?\n/);
    for (const line of lines) {
      if (!line.trim()) continue;
      const colonIndex = line.indexOf(':');
      if (colonIndex > -1) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();
        // Remove quotes if present
        if (/^['"].*['"]$/.test(value)) {
          value = value.slice(1, -1);
        }
        meta[key] = value;
      }
    }
  }
  
  posts.push(meta);
}

// Sort by date descending
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
console.log(`Generated blog index with ${posts.length} posts.`);
