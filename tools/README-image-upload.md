# Image Upload Tool for Cloudinary

## Setup

1. Install dependencies:
```bash
cd tools
npm install

setup .env:
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
```

## Usage

### Basic Usage
```bash
node upload-images-to-cloudinary.js <folder-path>
```

### Examples
```bash
node upload-images-to-cloudinary.js "F:\baomat\New folder (2)\cardano2-vn\content\docs\getting-started\catalyst4students\img"
```

