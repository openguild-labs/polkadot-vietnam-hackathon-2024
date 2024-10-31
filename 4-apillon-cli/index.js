const axios = require('axios');
const readlineSync = require('readline-sync');
const fs = require('fs');

let MY_AUTHORIZATION;

function promptAuthorization() {
  MY_AUTHORIZATION = readlineSync.question('Enter your authorization token: ');
}

async function mintNFT() {
  const uuid = readlineSync.question('Enter the collection UUID: ');
  const targetAddress = readlineSync.question('Enter the target address: ');
  const quantity = readlineSync.question(
    'Enter the quantity (between 1 to 20): '
  );

  try {
    const { data } = await axios({
      url: `https://api.apillon.io/nfts/collections/${uuid}/mint`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: MY_AUTHORIZATION,
      },
      data: {
        receivingAddress: targetAddress,
        quantity: quantity,
      },
    });

    console.log(
      `Your NFT has been minted. Transaction hash: ${data.data.transactionHash}`
    );
    return data;
  } catch (error) {
    console.log('Error: ' + error.response.data.message);
  }
}

async function uploadStorage() {
  const bucketUuid = readlineSync.question('Enter the bucket UUID: ');
  const filePath = readlineSync.question('Enter the path to your image file: ');
  const imageData = fs.readFileSync(filePath).toString('base64');

  const data = {
    files: [
      {
        fileName: 'my_image.jpg',
        contentType: 'image/jpeg',
        content: imageData,
      },
    ],
  };

  const config = {
    headers: {
      Authorization: MY_AUTHORIZATION,
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.post(
      `https://api.apillon.io/storage/buckets/${bucketUuid}/upload`,
      data,
      config
    );
    console.log(
      'Your image has been uploaded with UUID: ' + response.data.data.sessionUuid
    );
  } catch (error) {
    console.error('Error:', error.response?.data?.message || error.message);
  }
}

async function getUploadedUrl(websiteUuid) {
  const data = {
    files: [
      {
        fileName: 'index.html',
        contentType: 'text/html',
      },
      {
        fileName: 'styles.css',
        contentType: 'text/css',
        path: 'assets/',
      },
    ],
  };

  const config = {
    headers: {
      Authorization: MY_AUTHORIZATION,
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.post(
      `https://api.apillon.io/hosting/websites/${websiteUuid}/upload`,
      data,
      config
    );
    console.log(
      'Your upload URL has been generated, this is the session UUID: ' +
      response.data.data.sessionUuid
    );
    return response.data.data.sessionUuid;
  } catch (error) {
    console.error(error);
  }
}

async function endUpload(websiteUuid, sessionUuid) {
  const config = {
    headers: {
      Authorization: MY_AUTHORIZATION,
      'Content-Type': 'application/json',
    },
  };

  const data = {
    files: [
      {
        fileName: 'index.html',
        contentType: 'text/html',
      },
      {
        fileName: 'styles.css',
        contentType: 'text/css',
        path: 'assets/',
      },
    ],
  };

  try {
    const response = await axios.post(
      `https://api.apillon.io/hosting/websites/${websiteUuid}/upload/${sessionUuid}/end`,
      data,
      config
    );
    console.log(response.data);
  } catch (error) {
    console.error(
      error.response.data.message,
      `<=== this means success, no worries.`
    );
  }
}

async function main() {
  promptAuthorization();

  const options = ['Mint NFT', 'Upload Storage', 'Get Uploaded URL'];
  const index = readlineSync.keyInSelect(options, 'Select an option:');

  switch (index) {
    case 0:
      await mintNFT();
      break;
    case 1:
      await uploadStorage();
      break;
    case 2:
      const websiteUuid = readlineSync.question('Enter the website UUID: ');
      const sessionUuid = await getUploadedUrl(websiteUuid);
      if (sessionUuid) {
        await endUpload(websiteUuid, sessionUuid);
      }
      break;
    default:
      console.log('Invalid option selected.');
      break;
  }
}

main();
