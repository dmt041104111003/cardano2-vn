#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sourceFolder = process.argv[2];
const targetSection = process.argv[3];
const targetName = process.argv[4];

if (!sourceFolder || !targetSection) {
  const docsDir = 'content/docs';
  if (fs.existsSync(docsDir)) {
    const sections = fs.readdirSync(docsDir).filter(item => 
      fs.statSync(path.join(docsDir, item)).isDirectory()
    );
    sections.forEach(section => {
    });
  }
  
  process.exit(1);
}

if (!fs.existsSync(sourceFolder)) {
  process.exit(1);
}

const isSpecificPath = targetSection.includes('/') || targetSection.includes('\\');
let docsTargetDir;

if (isSpecificPath) {
  docsTargetDir = targetSection;
  if (!fs.existsSync(docsTargetDir)) {
    fs.mkdirSync(docsTargetDir, { recursive: true });
  }
} else {
  if (!targetName) {
    process.exit(1);
  }
  
  const targetSectionPath = `content/docs/${targetSection}`;
  if (!fs.existsSync(targetSectionPath)) {
    fs.mkdirSync(targetSectionPath, { recursive: true });
  }
  
  docsTargetDir = `content/docs/${targetSection}/${targetName}`;
  if (!fs.existsSync(docsTargetDir)) {
    fs.mkdirSync(docsTargetDir, { recursive: true });
  }
}

const allItems = fs.readdirSync(sourceFolder);

allItems.forEach(item => {
  const sourceItem = path.join(sourceFolder, item);
  let targetItem = path.join(docsTargetDir, item);
  
  if (fs.statSync(sourceItem).isDirectory()) {
    try {
      const copyCommand = `xcopy "${sourceItem}" "${targetItem}" /E /I /Y /H`;
      execSync(copyCommand, { stdio: 'inherit' });
    } catch (error) {
    }
  } else {
    try {
      if (item.endsWith('.md')) {
        const newFileName = item.replace('.md', '.mdx');
        targetItem = path.join(docsTargetDir, newFileName);
      }
      
      fs.copyFileSync(sourceItem, targetItem);
      
       if (item.endsWith('.mdx') || item.endsWith('.md')) {
         let content = fs.readFileSync(targetItem, 'utf8');
         
         content = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
           if (src.startsWith('img/') && !src.startsWith('./img/')) {
             const fixedSrc = './' + src;
             return `![${alt}](${fixedSrc})`;
           }
           return match;
         });
         
         content = content.replace(/<img([^>]+)src="([^"]+)"/g, (match, attrs, src) => {
           if (src.startsWith('img/') && !src.startsWith('./img/')) {
             const fixedSrc = './' + src;
             return `<img${attrs}src="${fixedSrc}"`;
           }
           return match;
         });
         
         if (!content.includes('---')) {
           const fileName = path.parse(targetItem).name;
           const date = new Date().toISOString().split('T')[0];
           const title = fileName
             .split('-')
             .map(word => word.charAt(0).toUpperCase() + word.slice(1))
             .join(' ');
           
           const frontmatter = `---
            title: "${title}"
            description: "${title.toLowerCase()}"
            date: "${date}"
            author: "Cardano2vn Team"
            difficulty: "beginner"
            readTime: "10 min"
            tags: ["cardano", "aiken", "tutorial"]
            ---

            `;
           
           content = frontmatter + content;
         }
         
         fs.writeFileSync(targetItem, content);
       }
    } catch (error) {
    }
  }
});

const metaPath = path.join(docsTargetDir, 'meta.json');
let existingMetaContent = { pages: [] };

if (fs.existsSync(metaPath)) {
  try {
    existingMetaContent = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  } catch (error) {
  }
}

const newPages = allItems.filter(item => {
  const sourceItem = path.join(sourceFolder, item);
  return fs.statSync(sourceItem).isFile() && (item.endsWith('.mdx') || item.endsWith('.md'));
}).map(file => {
  if (file.endsWith('.md')) {
    return path.parse(file.replace('.md', '.mdx')).name;
  }
  return path.parse(file).name;
});

const updatedPages = [...existingMetaContent.pages];
newPages.forEach(page => {
  if (!updatedPages.includes(page)) {
    updatedPages.push(page);
  }
});

const metaContent = { pages: updatedPages };
fs.writeFileSync(metaPath, JSON.stringify(metaContent, null, 2));

if (!isSpecificPath) {
  const mainMetaPath = `content/docs/${targetSection}/meta.json`;
  let mainMetaContent = { pages: [] };

  if (fs.existsSync(mainMetaPath)) {
    try {
      mainMetaContent = JSON.parse(fs.readFileSync(mainMetaPath, 'utf8'));
    } catch (error) {
    }
  }

  if (!mainMetaContent.pages.includes(targetName)) {
    mainMetaContent.pages.push(targetName);
  }

  fs.writeFileSync(mainMetaPath, JSON.stringify(mainMetaContent, null, 2));
} else {
  const targetPathParts = docsTargetDir.split(path.sep);
  const docsIndex = targetPathParts.indexOf('docs');
  
  if (docsIndex !== -1 && targetPathParts.length > docsIndex + 2) {
    const sectionName = targetPathParts[docsIndex + 1]; 
    const folderName = targetPathParts[targetPathParts.length - 1]; 
    
    const sectionPath = `content/docs/${sectionName}`;
    if (!fs.existsSync(sectionPath)) {
      fs.mkdirSync(sectionPath, { recursive: true });
    }
    
    const mainMetaPath = `content/docs/${sectionName}/meta.json`;
    let mainMetaContent = { pages: [] };

    if (fs.existsSync(mainMetaPath)) {
      try {
        mainMetaContent = JSON.parse(fs.readFileSync(mainMetaPath, 'utf8'));
      } catch (error) {
      }
    }

    if (!mainMetaContent.pages.includes(folderName)) {
      mainMetaContent.pages.push(folderName);
    }

    fs.writeFileSync(mainMetaPath, JSON.stringify(mainMetaContent, null, 2));
  }
}


console.log('\nSuccessfully uploaded all files!');
console.log(`Location: ${docsTargetDir}`);
