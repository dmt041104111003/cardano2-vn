#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function findMdxFiles(dir) {
  const files = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
  }
  
  scanDirectory(dir);
  return files;
}

function fixMdxFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('---') && content.indexOf('---') === 0) {
      const firstDashIndex = content.indexOf('---');
      const secondDashIndex = content.indexOf('---', firstDashIndex + 3);
      
      if (secondDashIndex !== -1) {
        const frontmatterSection = content.substring(firstDashIndex, secondDashIndex + 3);
        if (!frontmatterSection.includes('title:')) {
          console.log(`File ${filePath} has frontmatter but missing title`);
          return false;
        }
        return true;
      }
    }

    const fileName = path.parse(filePath).name;
    const date = new Date().toISOString().split('T')[0];
    const title = fileName
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    const frontmatter = `---
        title: "${title}"
        description: "${title.toLowerCase()}"
        date: "${date}"
        author: "Cardano2vn Team"
        difficulty: "beginner"
        readTime: "10 min"
        tags: ["cardano", "tutorial"]
        ---

        `;
    
    content = frontmatter + content;
    fs.writeFileSync(filePath, content);
    
    console.log(`Fixed: ${filePath}`);
    return true;
    
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return false;
  }
}
const docsDir = 'content/docs';
let totalFiles = 0;
let fixedFiles = 0;

if (fs.existsSync(docsDir)) {
  console.log('🔍 Scanning for MDX files...');
  const mdxFiles = findMdxFiles(docsDir);
  totalFiles = mdxFiles.length;
  
  console.log(`Found ${totalFiles} MDX files`);
  
  for (const file of mdxFiles) {
    if (fixMdxFile(file)) {
      fixedFiles++;
    }
  }
  
  console.log(`\nSummary:`);
  console.log(`   Total files: ${totalFiles}`);
  console.log(`   Fixed files: ${fixedFiles}`);
  console.log(`   Already correct: ${totalFiles - fixedFiles}`);
  
} else {
  console.error('content/docs directory not found');
  process.exit(1);
}
