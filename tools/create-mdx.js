#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const fileName = process.argv[2];
const targetPath = process.argv[3];

if (!fileName || !targetPath) {
  process.exit(1);
}

const fullPath = path.join(targetPath, `${fileName}.mdx`);

const targetDir = path.dirname(fullPath);
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const date = new Date().toISOString().split('T')[0];
const title = fileName
  .split('-')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');

const mdxContent = `---
title: "${title}"
description: "${title.toLowerCase()}"
date: "${date}"
author: "Cardano2vn Team"
difficulty: "beginner"
readTime: "10 min"
tags: ["cardano", "tutorial", "guide"]
---

# ${title}

## Introduction

Write a brief introduction to this topic...

## Main content

### 1. First part

Write the content for the first part...

\`\`\`javascript
// Example code if needed
console.log("Hello Cardano!");
\`\`\`

### 2. Second part

Write the content for the second part...

## Practical example

Provide a specific example...

## Summary

Summarize the important points...

## References

- [Reference 1](https://example.com)
- [Reference 2](https://example.com)

## Next

Read more about: [Next topic](/docs/...)
`;


fs.writeFileSync(fullPath, mdxContent);
const metaPath = path.join(targetDir, 'meta.json');
if (fs.existsSync(metaPath)) {
  try {
    const metaContent = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    if (!metaContent.pages.includes(fileName)) {
      metaContent.pages.push(fileName);
      fs.writeFileSync(metaPath, JSON.stringify(metaContent, null, 2));
    }
  } catch (error) {

  }
} else {
  const newMetaContent = { pages: [fileName] };
  fs.writeFileSync(metaPath, JSON.stringify(newMetaContent, null, 2));
}
console.log('\nSuccessfully created mdx file!');
console.log(`Location: ${fullPath}`);
