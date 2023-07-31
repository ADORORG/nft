const { MongoClient } = require("mongodb");

/* 
* Adjust the previous database structure to conform with the current version
* of this application
*/
async function main() {
  const uri = process.argv[2]; // MongoDB connection URL provided as the first command-line argument

  if (!uri) {
    console.error("Provide MongoDB URL with database name");
    return;
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();

    // collections with 'owner' field
    const collectionListWithOwnerFields = [
        "nft_collections", "nft_contracts", "nft_tokens"
    ];

    // replace bidder for bids
    const bidCollection = db.collection("nft_bids");
    // replace seller and buyer for market orders
    const marketCollection = db.collection("nft_market_orders");

    // Find all items in 'Accounts' collection using a cursor
    const accountsCollection = db.collection("nft_accounts");
    const cursor = accountsCollection.find({});

    // Iterate over the 'accountsCollection' collection using the cursor and update each document
    while (await cursor.hasNext()) {
        const account = await cursor.next();

         // Update all items in 'collectionList' collection by replacing 'owner' with 'account.address'
        for (let coll of collectionListWithOwnerFields) {
            const collection = db.collection(coll);
            await collection.updateMany({owner: account._id}, {$set: {owner: account.address}});
        }

        // update bidder ref
        await bidCollection.updateMany({bidder: account._id}, {$set: {bidder: account.address}});
        // update buyer ref
        await marketCollection.updateMany({buyer: account._id}, {$set: {buyer: account.address}});
        // update seller ref
        await marketCollection.updateMany({seller: account._id}, {$set: {seller: account.address}});
    }

    console.log("Successfully updated documents in the database.");
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    // Close the connection to the database
    client.close();
  }
}

main().catch(console.log);
