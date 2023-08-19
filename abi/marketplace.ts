
const marketplaceAbiV1 = [{"inputs":[{"internalType":"address payable","name":"_feeAddress","type":"address"},{"internalType":"uint96","name":"_fee","type":"uint96"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IERC721","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"address","name":"seller","type":"address"}],"name":"ListingCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IERC721","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":true,"internalType":"address","name":"bidder","type":"address"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"NewBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IERC721","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"address","name":"paymentToken","type":"address"},{"indexed":false,"internalType":"enum ERC721Marketplace.SaleType","name":"saleType","type":"uint8"}],"name":"NewListing","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IERC721","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"NewSale","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"MAX_FEE","outputs":[{"internalType":"uint96","name":"","type":"uint96"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_feeBase","outputs":[{"internalType":"uint96","name":"","type":"uint96"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC721","name":"token","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"acceptBid","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"addSupportedERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"components":[{"internalType":"enum ERC721Marketplace.OrderSide","name":"side","type":"uint8"},{"internalType":"address payable","name":"seller","type":"address"},{"internalType":"address payable","name":"buyer","type":"address"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"uint256","name":"startPrice","type":"uint256"},{"internalType":"uint256","name":"buyNowPrice","type":"uint256"},{"internalType":"uint256","name":"duration","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct ERC721Marketplace.MarketOrder","name":"order","type":"tuple"},{"internalType":"bytes","name":"orderSignature","type":"bytes"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"atomicBuyERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"components":[{"internalType":"enum ERC721Marketplace.OrderSide","name":"side","type":"uint8"},{"internalType":"address payable","name":"seller","type":"address"},{"internalType":"address payable","name":"buyer","type":"address"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"uint256","name":"startPrice","type":"uint256"},{"internalType":"uint256","name":"buyNowPrice","type":"uint256"},{"internalType":"uint256","name":"duration","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct ERC721Marketplace.MarketOrder","name":"order","type":"tuple"},{"internalType":"bytes","name":"orderSignature","type":"bytes"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"atomicBuyETH","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"contract IERC721","name":"token","type":"address"},{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"},{"internalType":"uint256[]","name":"startPrices","type":"uint256[]"},{"internalType":"uint256[]","name":"buyNowPrices","type":"uint256[]"},{"internalType":"uint256[]","name":"durations","type":"uint256[]"},{"internalType":"address[]","name":"paymentTokens","type":"address[]"}],"name":"bulkAuction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC721","name":"token","type":"address"},{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"},{"internalType":"uint256[]","name":"buyNowPrices","type":"uint256[]"},{"internalType":"address[]","name":"paymentTokens","type":"address[]"}],"name":"bulkFixedListing","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC721","name":"token","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"buyWithERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC721","name":"token","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"buyWithETH","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"contract IERC721","name":"token","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"cancelListing","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC721","name":"token","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"startPrice","type":"uint256"},{"internalType":"uint256","name":"buyNowPrice","type":"uint256"},{"internalType":"uint256","name":"duration","type":"uint256"},{"internalType":"address","name":"paymentToken","type":"address"}],"name":"createAuctionListing","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC721","name":"token","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"startPrice","type":"uint256"},{"internalType":"uint256","name":"buyNowPrice","type":"uint256"},{"internalType":"uint256","name":"duration","type":"uint256"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"uint256","name":"signatureDeadline","type":"uint256"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"createAuctionListingWithPermit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC721","name":"token","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"bidAmount","type":"uint256"}],"name":"createBidERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC721","name":"token","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"createBidETH","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"contract IERC721","name":"token","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"buyNowPrice","type":"uint256"},{"internalType":"address","name":"paymentToken","type":"address"}],"name":"createFixedListing","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC721","name":"token","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"buyNowPrice","type":"uint256"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"uint256","name":"signatureDeadline","type":"uint256"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"createFixedListingWithPermit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"components":[{"internalType":"enum ERC721Marketplace.OrderSide","name":"side","type":"uint8"},{"internalType":"address payable","name":"seller","type":"address"},{"internalType":"address payable","name":"buyer","type":"address"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"uint256","name":"startPrice","type":"uint256"},{"internalType":"uint256","name":"buyNowPrice","type":"uint256"},{"internalType":"uint256","name":"duration","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct ERC721Marketplace.MarketOrder","name":"order","type":"tuple"},{"internalType":"bytes","name":"orderSignature","type":"bytes"}],"name":"executeOfferERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"components":[{"internalType":"enum ERC721Marketplace.OrderSide","name":"side","type":"uint8"},{"internalType":"address payable","name":"seller","type":"address"},{"internalType":"address payable","name":"buyer","type":"address"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"uint256","name":"startPrice","type":"uint256"},{"internalType":"uint256","name":"buyNowPrice","type":"uint256"},{"internalType":"uint256","name":"duration","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct ERC721Marketplace.MarketOrder","name":"order","type":"tuple"},{"internalType":"bytes","name":"orderSignature","type":"bytes"},{"internalType":"bytes","name":"signature","type":"bytes"},{"internalType":"uint256","name":"signatureDeadline","type":"uint256"}],"name":"executeOfferWithPermitERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"fee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"feeReceiver","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC721","name":"token","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"finaliseAuction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC721","name":"token","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getBid","outputs":[{"components":[{"internalType":"address payable","name":"bidder","type":"address"},{"internalType":"uint256","name":"price","type":"uint256"}],"internalType":"struct ERC721Marketplace.Bid","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC721","name":"token","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getListing","outputs":[{"components":[{"internalType":"enum ERC721Marketplace.OrderSide","name":"side","type":"uint8"},{"internalType":"address payable","name":"seller","type":"address"},{"internalType":"address payable","name":"buyer","type":"address"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"uint256","name":"startPrice","type":"uint256"},{"internalType":"uint256","name":"buyNowPrice","type":"uint256"},{"internalType":"uint256","name":"duration","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct ERC721Marketplace.MarketOrder","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenContract","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"salePrice","type":"uint256"}],"name":"getRoyaltyInfo","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"isSupportedERC20","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"removeSupportedERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint96","name":"fee_","type":"uint96"}],"name":"setFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"feeReceiver_","type":"address"}],"name":"setFeeReceiver","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}] as const


/** Map abi version */
const marketplaceAbiVersionMap =  {
    // version 1
    "1": marketplaceAbiV1
} as const

/** Export abiVersionMap */
export {
    marketplaceAbiVersionMap
}

/** Export the lastest Marketplace abi as the default */
export default marketplaceAbiV1

