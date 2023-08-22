import mongoose from 'mongoose';
/* 
* Some schemas are not directly used in this cron.
* However, they are referenced in other schemas.
* These schemas must be registered manually by importing and using them
*/
import CurrencyModel from './lib/models/currency';
import { updateMarketData } from './handler/market';

mongoose.connect(process.env.DB_HOST as string).then(() => console.log('db connected')).catch(error => console.log('db connect error', error));
CurrencyModel.init();

async function marketDataHandler() {
    try {
        console.log('marketDataHandler>>>');
        await updateMarketData();
    } catch(e) {
        console.log(e);
    } finally {
        setTimeout(marketDataHandler, 10000);
    }
}

// CONSTANTLY FETCH AND UPDATE MARKET DATA
marketDataHandler();