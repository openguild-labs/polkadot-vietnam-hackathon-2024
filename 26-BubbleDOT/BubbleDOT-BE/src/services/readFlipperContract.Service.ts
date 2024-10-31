import { promises as fs } from 'fs';
import path from 'path';

const findFileInProject = async (fileName: string, startDir: string = process.cwd()): Promise<string | null> => {
    const stack = [startDir];

    while (stack.length > 0) {
        const currentDir = stack.pop()!;
        const files = await fs.readdir(currentDir, { withFileTypes: true });

        for (const file of files) {
            const fullPath = path.join(currentDir, file.name);
            if (file.isDirectory()) {
                stack.push(fullPath);
            } else if (file.isFile() && file.name === fileName) {
                return fullPath;
            }
        }
    }

    return null;
};

const readFlipperContract = async (): Promise<string | null> => {
    const contractPath = await findFileInProject('flipper.contract');
    if (!contractPath) {
        console.error('flipper.contract not found');
        return null;
    }

    try {
        const data = await fs.readFile(contractPath, 'utf-8');
        const jsonData = JSON.parse(data);

        // Truy cập trường "wasm" trong cấu trúc JSON
        const wasmData = jsonData.source?.wasm;
        if (wasmData) {
            return wasmData;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error reading flipper.contract:', error);
        return null;
    }
};

export { readFlipperContract };
