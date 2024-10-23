import dotenv from 'dotenv';
import fs from 'fs';
import { Provider, WalletUnlocked } from 'fuels';
import { AmmMetadata, ReadonlyMiraAmm } from 'mira-dex-ts';

dotenv.config({ path: '.env' });

const RPC = process.env.RPC_URL || 'https://mainnet.fuel.network/v1/graphql';
const SECRET_KEY = process.env.SECRET_KEY;
const DEFAULT_AMM_CONTRACT_ID =
    "0x2e40f2b244b98ed6b8204b3de0156c6961f98525c8162f80162fcf53eebd90e7";
if (!SECRET_KEY) {
    throw new Error('SECRET_KEY is not set in the environment variables');
}

describe('MiraAmm and ReadonlyMiraAmm Tests', () => {
    let provider: Provider;
    let wallet: WalletUnlocked;
    let readonlyMiraAmm: ReadonlyMiraAmm;
    let metadata: AmmMetadata;
    beforeAll(async () => {
        fs.writeFileSync('test.log', '');
        provider = await Provider.create(RPC);
        wallet = new WalletUnlocked(SECRET_KEY, provider);
        readonlyMiraAmm = new ReadonlyMiraAmm(
            provider,
            DEFAULT_AMM_CONTRACT_ID,
        );
        metadata = await readonlyMiraAmm.ammMetadata();
    });

    it('should get amm metadata', async () => {
        expect(metadata).toBeDefined();
    });
});
