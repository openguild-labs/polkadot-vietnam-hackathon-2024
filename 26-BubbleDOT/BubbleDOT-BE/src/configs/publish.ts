import { Storage, LogLevel } from '@apillon/sdk';
import * as fs from 'fs';
import 'dotenv/config';
async function uploadDirectory(directoryPath: string, bucket: any) {
  const files = fs.readdirSync(directoryPath);
  const uploadPromises = files.map((fileName) => {
    const filePath = `${directoryPath}/${fileName}`;
    const fileBuffer = fs.readFileSync(filePath);
    return {
      fileName,
      contentType: 'FILE',
      content: fileBuffer,
    };
  });
  return await bucket.uploadFiles(uploadPromises);
}
async function main() {
  try {
    const storage = new Storage({
      key: process.env.APILLON_API_KEY,
      secret: process.env.APILLON_API_SECRET,
      logLevel: LogLevel.VERBOSE,
    });
    const gatewayUrl = 'https://wapo-testnet.phala.network';
    const bucket = storage.bucket(process.env.APILLON_S3_BUCKET_UUID ?? '');
    // Upload files from 'controllers' directory
    const controllersUpload = await uploadDirectory('./src/controllers', bucket);
    // Upload files from 'services' directory
    const servicesUpload = await uploadDirectory('./src/services', bucket);
    // Process the uploaded files
    const allUploads = [...controllersUpload, ...servicesUpload];
    for (const upload of allUploads) {
      let fileUuid = upload.fileUuid as string;
      let fileCID = upload.CID;
      while (fileCID == undefined) {
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
        await sleep(2000);
        const file = await bucket.file(fileUuid).get();
        if (file.CID) {
          fileCID = file.CID as string;
          console.log(`\nIf your agent requires secrets, ensure to do the following:\n1) Edit the setSecrets.ts file to add your secrets\n2) Set the variable AGENT_CID=${fileCID} in the .env file\n3) Run command: npm run set-secrets`);
        }
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
main().catch(console.error);