
import axios from "axios";

export const uploadImage = async (file: File) => {
 
   if (!file) {
     console.error('No file provided');
     return;
   }
 
   try {
     // Create a FormData object to send the file as 'multipart/form-data'
     const formData = new FormData();
     formData.append('file', file); // Append the file to the form data
 
     // Make the API request with FormData
     const response = await axios.post(
       'https://rest.unique.network/opal/v1/ipfs/upload-file',
       formData, // Send FormData as the request body
       {
         headers: {
           'Content-Type': 'multipart/form-data', // Ensure multipart/form-data header
           accept: 'application/json', // Specify that we expect JSON response
         },
       }
     );
 
     console.log(`File uploaded successfully: ${response.data.fullUrl}`);
     return response.data.fullUrl;
   } catch (error) {
     console.error('Error uploading file:', error);
     throw error; // Re-throw error to handle it elsewhere
   }
};

export const mintNow = async (
   name: string,
   desc: string,
   file: string,
   type: string,
   owner: string,
   collectionId: number
): Promise<any> => {
   const apiUrl = 'http://localhost:3000/api/mint-token';

   const requestData = {
     address: owner,
     name,
     description: desc,
     ipfsUrl: file,
     type,
     collectionId: collectionId ? collectionId : null,
   };
 
   try {
     const response = await axios.post(apiUrl, requestData);
     return response;
   } catch (error) {
     console.error('Error minting token:', error);
   }
};
