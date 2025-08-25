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

function fixDuplicateDescription(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('---') && content.indexOf('---') === 0) {
      const firstDashIndex = content.indexOf('---');
      const secondDashIndex = content.indexOf('---', firstDashIndex + 3);
      
      if (secondDashIndex !== -1) {
        const frontmatterSection = content.substring(firstDashIndex, secondDashIndex + 3);
        const descriptionMatches = frontmatterSection.match(/description:/g);
        
        if (descriptionMatches && descriptionMatches.length > 1) {
          console.log(`Found duplicate description in: ${filePath}`);
          const lines = frontmatterSection.split('\n');
          const newLines = [];
          let foundFirstDescription = false;
          
          for (const line of lines) {
            if (line.trim().startsWith('description:')) {
              if (!foundFirstDescription) {
                const cleanDescription = line.trim().replace(/^description:\s*/, 'description: "');
                if (!cleanDescription.includes('"')) {
                  newLines.push(cleanDescription + '"');
                } else {
                  newLines.push(cleanDescription);
                }
                foundFirstDescription = true;
              }
            } else {
              newLines.push(line);
            }
          }
          
          const newFrontmatter = newLines.join('\n');
          content = content.replace(frontmatterSection, newFrontmatter);
          fs.writeFileSync(filePath, content);
          
          console.log(`Fixed duplicate description: ${filePath}`);
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
  console.log('Scanning for MDX files with duplicate descriptions...');
  const mdxFiles = findMdxFiles(docsDir);
  totalFiles = mdxFiles.length;
  
  console.log(`Found ${totalFiles} MDX files`);
  
  for (const file of mdxFiles) {
    if (fixDuplicateDescription(file)) {
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



