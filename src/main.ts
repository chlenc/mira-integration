import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';
import { Provider } from 'fuels';
import { AmmMetadata, ReadonlyMiraAmm } from 'mira-dex-ts';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const RPC = process.env.RPC_URL || 'https://mainnet.fuel.network/v1/graphql';
const DEFAULT_AMM_CONTRACT_ID = "0x2e40f2b244b98ed6b8204b3de0156c6961f98525c8162f80162fcf53eebd90e7";

if (!BOT_TOKEN) {
    console.error('Please set BOT_TOKEN in the .env file');
    process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// Function to start the bot
async function startBot() {
    try {
        const provider = await Provider.create(RPC);
        const readonlyMiraAmm = new ReadonlyMiraAmm(provider, DEFAULT_AMM_CONTRACT_ID);

        bot.command('mira', async (ctx) => {
            try {
                const message = "Fetching Mira AMM metadata...";
                await ctx.reply(message);

                const metadata: AmmMetadata = await readonlyMiraAmm.ammMetadata();

                const response = `Mira AMM Metadata:
                Contract ID: ${DEFAULT_AMM_CONTRACT_ID}
                Admin: ${metadata.owner}
                Fee: ${metadata.fees}
                `;

                await ctx.reply(response);
            } catch (error) {
                console.error("Error fetching Mira metadata:", error);
                await ctx.reply("An error occurred while fetching Mira metadata.");
            }
        });

        await bot.launch();
        console.log("Bot started. Use /mira command to fetch Mira AMM metadata.");
    } catch (error) {
        console.error("Error starting the bot:", error);
    }
}

startBot();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
