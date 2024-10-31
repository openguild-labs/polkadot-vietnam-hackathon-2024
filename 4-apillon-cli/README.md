# Apillon CLI

## Overview

The Apillon Bot is a command-line interface (CLI) tool designed to interact with the Apillon API, enabling users to perform a variety of tasks related to managing NFT collections, uploading files to storage, and overseeing website hosting. This README offers a comprehensive guide on how to install and utilize the bot, along with other pertinent details.

## Features

- **Mint NFT**: Mint new NFTs by specifying the collection UUID, target address, and quantity.
- **Upload Storage**: Upload files to storage by providing the bucket UUID.
- **Get Uploaded URL**: Generate upload URLs for files associated with a website UUID, and end the upload session.

## Installation

1. Navigate to the project directory:

   ```bash
   cd apillon-cli
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Usage

Before using the Apillon CLI, make sure you have obtained your authorization token from Apillon. You will be prompted to enter this token when running the program for the first time.

To start:

```bash
node index.js
```

Follow the prompts to select an action and provide any required inputs such as UUIDs, addresses, or quantities.

# Polkadot-Hackathon-2024
