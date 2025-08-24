# Docs Management Tools - Cardano2vn

---
## Documentation Navigation

<div align="center">
  <a href="#overview" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/Overview-Main_README-blue?style=for-the-badge" alt="Overview" />
  </a>
  <a href="scripts/WEBSOCKET_README.md" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/WebSocket-Real--time_System-orange?style=for-the-badge" alt="WebSocket Guide" />
  </a>
  <a href="tools/MARKDOWN_GUIDE_EN.md" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/Markdown_Guide-English_Guide-green?style=for-the-badge" alt="Markdown Guide" />
  </a>
  <a href="BULLY_ALGORITHM_IMPLEMENTATION.md" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/Bully_Algorithm-Distributed_System-red?style=for-the-badge" alt="Bully Algorithm" />
  </a>
  <a href="tools/README.md" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/Docs_Tools-Automation-purple?style=for-the-badge" alt="Docs Tools" />
  </a>
</div>

---

Quick tools for managing documentation files.

## Quick Start

### Upload entire folder
```bash
# Upload to specific path
npm run upload-all "C:\Users\ADMIN\Downloads\Chuong1" content/docs/getting-started/Chuong1
```

### Create new MDX file
```bash
npm run create-mdx "tutorial-guide" "content/docs/getting-started"
```
### missing titles
```bash
npm run fix-missing-titles
npm run fix-mdx-frontmatter
node tools/fix-duplicate-description.js
node tools/remove-jupyter-fields.js
node tools/fix-frontmatter-indentation.js
```

### ex
```bash
npm run upload-all "C:\Users\ADMIN\Downloads\cardanovn-portal\docs\stake-pool-course\handbook" content/docs/getting-started/docs/stake-pool-course/handbook

npm run upload-all "C:\Users\ADMIN\Downloads\cardanovn-portal\docs1\2020\01" content/docs/getting-started/docs1/2020/01
npm run upload-all "C:\Users\ADMIN\Downloads\cardanovn-portal\docs1\2020\02" content/docs/getting-started/docs1/2020/02
npm run upload-all "C:\Users\ADMIN\Downloads\cardanovn-portal\docs1\2022\01" content/docs/getting-started/docs1/2022/01
```
// quickly for
```bash
for ($i=1; $i -le 2; $i++) {
    $folder = "{0:D2}" -f $i
    npm run upload-all "C:\Users\ADMIN\Downloads\cardanovn-portal\docs1\2020\$folder" "content/docs/getting-started/docs1/2020/$folder"
}

for ($i = 1; $i -le 12; $i++) {
    $folder = "{0:D2}" -f $i
    npm run upload-all "C:\Users\ADMIN\Downloads\cardanovn-portal\docs1\2022\$folder" "content/docs/getting-started/docs1/2022/$folder"
}



```

