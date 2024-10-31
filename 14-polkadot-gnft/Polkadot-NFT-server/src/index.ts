import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createCollection, getBalance, getCollection, getTokens, mintToken, burnNFT} from './service/index.js';

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(compression());
app.use(cookieParser());
app.use(cors());

// Routes
app.get('/', (res: Response) => {
    res.send('Hello, world!');
});

app.get('/api/burn', async (req: Request, res: any) => {
    const tokenId = req.query.tokenId;
    try {
        const balance = await burnNFT(Number(tokenId));
        return res.json({ balance });
    } catch (error) {
        console.error('Error burn NFT:', error);
        return res.status(500).json({ error: 'Failed to burn NFT' });
    }
});

// Define the /api/balance endpoint
app.get('/api/balance', async (req: Request, res: any) => {
    const address = req.query.address as string;

    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }

    try {
        const balance = await getBalance(address);
        return res.json({ address, balance });
    } catch (error) {
        console.error('Error fetching balance:', error);
        return res.status(500).json({ error: 'Failed to fetch balance' });
    }
});

app.get('/api/create-collection', async (req: Request, res: any) => {
    const address = req.query.address as string;
    const collectionId = req.query.collectionId;
    if (collectionId) {
        const collection = await getCollection(address,Number(collectionId));
        return res.json({collection});
    }
    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }

    try {
        const collection = await createCollection(address);
        return res.json({ address, collection });
    } catch (error) {
        console.error('Error create collection:', error);
        return res.status(500).json({ error: 'Failed to create collection' });
    }
});

app.post('/api/mint-token', async (req: Request, res: any) => {
    const address = req.body.address as string;
    const name = req.body.name;
    const description = req.body.description;
    const ipfsUrl = req.body.ipfsUrl;
    const type = req.body.type;
    const collectionId = req.body.collectionId;
    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }
    try {
        const nft = await mintToken(name, description,ipfsUrl, type, address, Number(collectionId));
        return res.json({ address, nft });
    } catch (error) {
        console.error('Error mint token:', error);
        return res.status(500).json({ error: 'Failed to mint token' });
    }
});

app.get('/api/get-tokens', async (req: Request, res: any) => {
    const collectionId = req.query.collectionId;
    try {
        const tokens = await getTokens(Number(collectionId));
        return res.json({ tokens});
    } catch (error) {
        console.error('Error get list token:', error);
        return res.status(500).json({ error: 'Failed to get list token' });
    }
});
// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

