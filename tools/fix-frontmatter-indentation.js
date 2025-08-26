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

function fixFrontmatterIndentation(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('---') && content.indexOf('---') === 0) {
      const firstDashIndex = content.indexOf('---');
      const secondDashIndex = content.indexOf('---', firstDashIndex + 3);
      
      if (secondDashIndex !== -1) {
        const frontmatterSection = content.substring(firstDashIndex, secondDashIndex + 3);
        const lines = frontmatterSection.split('\n');
        let hasIndentation = false;
        
        for (const line of lines) {
          if (line.trim() !== '' && line.trim() !== '---' && line.startsWith(' ')) {
            hasIndentation = true;
            break;
          }
        }
        
        if (hasIndentation) {
          console.log(`Found frontmatter with indentation in: ${filePath}`);
          const fixedLines = lines.map(line => {
            if (line.trim() === '' || line.trim() === '---') {
              return line.trim();
            }
            return line.trim();
          });
          
          const fixedFrontmatter = fixedLines.join('\n');
          content = content.replace(frontmatterSection, fixedFrontmatter);
          fs.writeFileSync(filePath, content);
          
          console.log(`Fixed frontmatter indentation: ${filePath}`);
          return true;
        }
      }
    }
    
    return false;
    
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return false;
  }
}

const docsDir = 'content/docs';
let totalFiles = 0;
let fixedFiles = 0;

if (fs.existsSync(docsDir)) {
  console.log('Scanning for MDX files with frontmatter indentation issues...');
  const mdxFiles = findMdxFiles(docsDir);
  totalFiles = mdxFiles.length;
  
  console.log(`Found ${totalFiles} MDX files`);
  
  for (const file of mdxFiles) {
    if (fixFrontmatterIndentation(file)) {
      fixedFiles++;
    }
  }
  
  console.log(`\nSummary:`);
  console.log(`   Total files: ${totalFiles}`);
  console.log(`   Fixed files: ${fixedFiles}`);
  
} else {
  console.error('content/docs directory not found');
  process.exit(1);
}





