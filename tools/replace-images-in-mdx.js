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

function replaceRandomCloudinaryUrlsInMdxFile(mdxFilePath, cloudinaryUrls) {
  try {
    let content = fs.readFileSync(mdxFilePath, 'utf8');
    let wasReplaced = false;
    let replacedCount = 0;
    
    const cloudinaryUrlRegex = /https:\/\/res\.cloudinary\.com\/[^")\s]+/g;
    const existingUrls = content.match(cloudinaryUrlRegex);
    
    if (!existingUrls || existingUrls.length === 0) {
      return false;
    }
    
    console.log(`  ${path.basename(mdxFilePath)} contains ${existingUrls.length} Cloudinary URLs`);
    
    // Tạo danh sách URLs ngẫu nhiên không trùng lặp cho file này
    const uniqueRandomUrls = [];
    const usedIndices = new Set();
    
    // Đảm bảo có đủ URLs unique cho file này
    for (let i = 0; i < existingUrls.length; i++) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * cloudinaryUrls.length);
      } while (usedIndices.has(randomIndex));
      
      usedIndices.add(randomIndex);
      uniqueRandomUrls.push(cloudinaryUrls[randomIndex]);
    }
    
    // Thay thế từng URL hiện có bằng URL ngẫu nhiên unique
    for (let i = 0; i < existingUrls.length; i++) {
      const oldUrl = existingUrls[i];
      const newUrl = uniqueRandomUrls[i];
      
      // Thay thế trong markdown links
      const markdownRegex = new RegExp(`!\\[([^\\]]*)\\]\\(${oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g');
      if (markdownRegex.test(content)) {
        content = content.replace(markdownRegex, (match, altText) => {
          return `![${altText}](${newUrl})`;
        });
        replacedCount++;
        wasReplaced = true;
        console.log(`  Replaced markdown link: ${oldUrl} -> ${newUrl}`);
      }
      
      const imgRegex = new RegExp(`<img([^>]+)src="${oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"([^>]*)>`, 'g');
      if (imgRegex.test(content)) {
        content = content.replace(imgRegex, (match, beforeSrc, afterSrc) => {
          return `<img${beforeSrc}src="${newUrl}"${afterSrc}>`;
        });
        replacedCount++;
        wasReplaced = true;
        console.log(`  Replaced img tag: ${oldUrl} -> ${newUrl}`);
      }
    }
    
    if (wasReplaced) {
      fs.writeFileSync(mdxFilePath, content, 'utf8');
      console.log(`  Updated: ${path.basename(mdxFilePath)} (${replacedCount} replacements with ${uniqueRandomUrls.length} unique URLs)`);
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
  console.log(`Available Cloudinary URLs: ${cloudinaryUrls.length}`);
  
  let totalReplacedCount = 0;
  
  for (const mdxFile of mdxFiles) {
    const wasReplaced = replaceRandomCloudinaryUrlsInMdxFile(mdxFile, cloudinaryUrls);
    if (wasReplaced) {
      totalReplacedCount++;
    }
  }
  
  console.log(`\nTotal files with replaced URLs: ${totalReplacedCount}`);
  console.log(`Total Cloudinary URLs available: ${cloudinaryUrls.length}`);
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
  findMdxFiles,
  extractCloudinaryUrls,
  replaceRandomCloudinaryUrlsInMdxFile
};
