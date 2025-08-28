require('dotenv').config();
const fs = require('fs');
const path = require('path');

function extractCloudinaryUrls(markdownText) {
  const urls = [];
  const markdownRegex = /!\[\]\((https:\/\/res\.cloudinary\.com\/[^)]+)\)/g;
  let match;
  while ((match = markdownRegex.exec(markdownText)) !== null) {
    urls.push(match[1]);
  }
  
  const imgRegex = /<img[^>]+src="(https:\/\/res\.cloudinary\.com\/[^"]+)"[^>]*>/g;
  while ((match = imgRegex.exec(markdownText)) !== null) {
    urls.push(match[1]);
  }
  
  return urls;
}

function extractOriginalFilename(cloudinaryUrl) {
  try {
    const urlParts = cloudinaryUrl.split('/');
    const filenameWithSuffix = urlParts[urlParts.length - 1];
    const lastUnderscoreIndex = filenameWithSuffix.lastIndexOf('_');
    const extension = path.extname(filenameWithSuffix);
    
    if (lastUnderscoreIndex !== -1) {
      const originalName = filenameWithSuffix.substring(0, lastUnderscoreIndex);
      return originalName + extension;
    }
    
    return filenameWithSuffix;
  } catch (error) {
    return null;
  }
}

function findMdxFiles(contentDir) {
  const mdxFiles = [];
  
  function scanDirectory(dir) {
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else if (item.endsWith('.mdx')) {
          mdxFiles.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dir}:`, error.message);
    }
  }
  
  scanDirectory(contentDir);
  return mdxFiles;
}

function replaceImageInMdxFile(mdxFilePath, originalFilename, cloudinaryUrl) {
  try {
    let content = fs.readFileSync(mdxFilePath, 'utf8');
    let wasReplaced = false;
    let replacedCount = 0;
    
    const allImageRefs = content.match(/!\[.*?\]\([^)]+\)/g);
    if (allImageRefs) {
      console.log(`  ${path.basename(mdxFilePath)} contains ${allImageRefs.length} image references`);
    }
    
    const localImageRef = `![](./img/${originalFilename})`;
    if (content.includes(localImageRef)) {
      const localRegex = new RegExp(localImageRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(localRegex);
      if (matches) {
        content = content.replace(localRegex, `<img src="${cloudinaryUrl}" alt="Cloudinary Image" width="800" height="600" style={{maxWidth: "100%", height: "auto"}} />`);
        replacedCount += matches.length;
        wasReplaced = true;
        console.log(`  Found and replaced local reference: ${localImageRef}`);
      }
    }
    
    const localImageWithAltRegex = new RegExp(`!\\[([^\\]]*)\\]\\(\\./img/${originalFilename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g');
    if (localImageWithAltRegex.test(content)) {
      const matches = content.match(localImageWithAltRegex);
      if (matches) {
        content = content.replace(localImageWithAltRegex, (match, altText) => {
          return `<img src="${cloudinaryUrl}" alt="${altText}" width="800" height="600" style={{maxWidth: "100%", height: "auto"}} />`;
        });
        replacedCount += matches.length;
        wasReplaced = true;
        console.log(`  Found and replaced local reference with alt text: ${matches[0]}`);
      }
    }
    
    const filenameWithoutExt = path.parse(originalFilename).name;
    const extension = path.extname(originalFilename);
    
    const cloudinaryPattern1 = new RegExp(`!\\[\\]\\(https://res\\.cloudinary\\.com/[^)]*${filenameWithoutExt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^)]*${extension.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^)]*\\)`, 'gi');
    
    const cloudinaryPattern2 = new RegExp(`!\\[\\]\\(https://res\\.cloudinary\\.com/[^)]*${filenameWithoutExt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^)]*\\)`, 'gi');
    
    if (cloudinaryPattern1.test(content)) {
      const matches = content.match(cloudinaryPattern1);
      if (matches) {
        content = content.replace(cloudinaryPattern1, `<img src="${cloudinaryUrl}" alt="Cloudinary Image" width="800" height="600" style={{maxWidth: "100%", height: "auto"}} />`);
        replacedCount += matches.length;
        wasReplaced = true;
        console.log(`  Found and replaced Cloudinary URL (pattern 1): ${matches[0]}`);
      }
    } else if (cloudinaryPattern2.test(content)) {
      const matches = content.match(cloudinaryPattern2);
      if (matches) {
        content = content.replace(cloudinaryPattern2, `<img src="${cloudinaryUrl}" alt="Cloudinary Image" width="800" height="600" style={{maxWidth: "100%", height: "auto"}} />`);
        replacedCount += matches.length;
        wasReplaced = true;
        console.log(`  Found and replaced Cloudinary URL (pattern 2): ${matches[0]}`);
      }
    }
    
    const cloudinaryWithAltPattern1 = new RegExp(`!\\[([^\\]]*)\\]\\(https://res\\.cloudinary\\.com/[^)]*${filenameWithoutExt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^)]*${extension.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^)]*\\)`, 'gi');
    
    const cloudinaryWithAltPattern2 = new RegExp(`!\\[([^\\]]*)\\]\\(https://res\\.cloudinary\\.com/[^)]*${filenameWithoutExt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^)]*\\)`, 'gi');
    
    // Pattern để tìm img tags hiện có
    const imgTagPattern = new RegExp(`<img[^>]+src="https://res\\.cloudinary\\.com/[^"]*${filenameWithoutExt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^"]*"[^>]*>`, 'gi');
    
    if (imgTagPattern.test(content)) {
      const matches = content.match(imgTagPattern);
      if (matches) {
        content = content.replace(imgTagPattern, `<img src="${cloudinaryUrl}" alt="Cloudinary Image" width="800" height="600" style={{maxWidth: "100%", height: "auto"}} />`);
        replacedCount += matches.length;
        wasReplaced = true;
        console.log(`  Found and replaced existing img tag: ${matches[0]}`);
      }
    } else if (cloudinaryWithAltPattern1.test(content)) {
      const matches = content.match(cloudinaryWithAltPattern1);
      if (matches) {
        content = content.replace(cloudinaryWithAltPattern1, (match, altText) => {
          return `<img src="${cloudinaryUrl}" alt="${altText}" width="800" height="600" style={{maxWidth: "100%", height: "auto"}} />`;
        });
        replacedCount += matches.length;
        wasReplaced = true;
        console.log(`  Found and replaced Cloudinary URL with alt text (pattern 1): ${matches[0]}`);
      }
    } else if (cloudinaryWithAltPattern2.test(content)) {
      const matches = content.match(cloudinaryWithAltPattern2);
      if (matches) {
        content = content.replace(cloudinaryWithAltPattern2, (match, altText) => {
          return `<img src="${cloudinaryUrl}" alt="${altText}" width="800" height="600" style={{maxWidth: "100%", height: "auto"}} />`;
        });
        replacedCount += matches.length;
        wasReplaced = true;
        console.log(`  Found and replaced Cloudinary URL with alt text (pattern 2): ${matches[0]}`);
      }
    }
    
    if (wasReplaced) {
      fs.writeFileSync(mdxFilePath, content, 'utf8');
      console.log(`  Updated: ${path.basename(mdxFilePath)} (${replacedCount} replacements)`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${mdxFilePath}:`, error.message);
    return false;
  }
}

async function replaceImagesInMdx(cloudinaryUrls, mdxFolderPath) {

  let folderPath;
  if (path.isAbsolute(mdxFolderPath)) {
    folderPath = mdxFolderPath;
  } else {
    folderPath = path.join(__dirname, '..', mdxFolderPath);
  }
  
  if (!fs.existsSync(folderPath)) {
    return;
  }
  
  const mdxFiles = findMdxFiles(folderPath);
  
  console.log(`Found ${mdxFiles.length} MDX files to scan`);
  
  let totalReplacedCount = 0;
  
  for (const cloudinaryUrl of cloudinaryUrls) {
    const originalFilename = extractOriginalFilename(cloudinaryUrl);
    if (!originalFilename) {
      console.error(`Could not extract filename from: ${cloudinaryUrl}`);
      continue;
    }
    
    console.log(`\nProcessing: ${originalFilename} -> ${cloudinaryUrl}`);
    
    let replacedCount = 0;
    for (const mdxFile of mdxFiles) {
      const wasReplaced = replaceImageInMdxFile(mdxFile, originalFilename, cloudinaryUrl);
      if (wasReplaced) {
        replacedCount++;
        totalReplacedCount++;
      }
    }
    
    if (replacedCount === 0) {
      console.log(`No files found containing: ![](./img/${originalFilename}) or existing Cloudinary URL`);
      
      console.log(`Debug: Searching for files containing "${originalFilename}"...`);
      for (const mdxFile of mdxFiles) {
        try {
          const content = fs.readFileSync(mdxFile, 'utf8');
          if (content.includes(originalFilename)) {
            console.log(`Found "${originalFilename}" in: ${path.basename(mdxFile)}`);
            
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].includes(originalFilename)) {
                console.log(`    Line ${i + 1}: ${lines[i].trim()}`);
                
                if (lines[i].includes(`./img/${originalFilename}`)) {
                  console.log(`This line contains the expected local path pattern`);
                } else {
                  console.log(`This line does NOT contain the expected local path pattern`);
                }
              }
            }
          }
        } catch (error) {
          console.error(`Error reading ${mdxFile}:`, error.message);
        }
      }
    } else {
      console.log(`Replaced in ${replacedCount} files`);
    }
  }
  console.log(`Total replacements: ${totalReplacedCount}`);
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    return;
  }
  
  if (args.length < 2) {
    console.error('Please provide both txt-file-path and mdx-folder-path');
    console.log('Usage: node replace-images-in-mdx.js <txt-file-path> <mdx-folder-path>');
    return;
  }
  
  const txtFilePath = args[0];
  const mdxFolderPath = args[1];
  
  if (!fs.existsSync(txtFilePath)) {
    console.error(`Text file not found: ${txtFilePath}`);
    return;
  }
  
  try {
    const fileContent = fs.readFileSync(txtFilePath, 'utf8');
    console.log(`Reading file: ${txtFilePath}`);
    const cloudinaryUrls = extractCloudinaryUrls(fileContent);
    
    if (cloudinaryUrls.length === 0) {
      console.error('No Cloudinary URLs found in the text file');
      return;
    }
    
    console.log(`Found ${cloudinaryUrls.length} Cloudinary URLs in file`);
    await replaceImagesInMdx(cloudinaryUrls, mdxFolderPath);
    
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  replaceImagesInMdx,
  extractOriginalFilename,
  findMdxFiles,
  extractCloudinaryUrls
};
