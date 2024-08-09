#!/usr/bin/env node
const axios = require("axios");
const ora = require("ora");
const Table = require("cli-table3");
const colors = require("colors");
const get = require("lodash.get");

const desc = (a, b) => a.price - b.price;
const asc = (a, b) => b.price - a.price;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatCash = (val) => formatter.format(val);

if (process.argv.length < 3) {
  console.warn("please enter your openseas account address");
  return;
}

const address = process.argv[2]; //"0x2e924d2aba625bf153a2f1c5c445bb63bd0d79e1";

const assetsTable = new Table({
  head: [],
  colWidths: [36, 26, 26, 26],
});

const spinner = ora(`getting openseas assets for ${address}`).start();

assetsTable.push(
  [
    {
      colSpan: 4,
      content: `openseas assets for ${address}`.green,
      hAlign: "center",
    },
  ],
  [],
  [
    { content: "asset", hAlign: "left" },
    { content: "top offer", hAlign: "center" },
    { content: "cheapest listing", hAlign: "center" },
    { content: "last sale", hAlign: "center" },
  ],
  []
);

const getAssetInfo = async (id) => {
  const { data } = await axios.get(`https://api.opensea.io/api/v1/asset/${id}`);

  const { name, orders, last_sale } = data;
  const cleanOrders = orders.map(
    ({ maker, payment_token_contract, current_price, side }) => {
      const { symbol, usd_price } = payment_token_contract;
      const price =
        symbol === "USDC"
          ? current_price / 1000000
          : current_price / 1000000000000000000;

      return {
        username: (maker.user && maker.user.username) || maker.address,
        symbol,
        price,
        usd_price: Math.round(parseFloat(usd_price) * price * 100) / 100,
        side,
      };
    }
  );

  const listings = cleanOrders.filter((o) => o.side === 1).sort(desc);
  const offers = cleanOrders.filter((o) => o.side === 0).sort(asc);
  let lastSale = null;

  if (last_sale) {
    const lastSaleSymbol = last_sale.payment_token.symbol;
    const lastSaleTotalPrice =
      lastSaleSymbol === "USDC"
        ? last_sale.total_price / 1000000
        : last_sale.total_price / 1000000000000000000;
    lastSale = {
      symbol: lastSaleSymbol,
      price: lastSaleTotalPrice,
      lastUsdPrice: lastSaleTotalPrice * last_sale.payment_token.usd_price,
    };
  }

  const [topOffer] = offers;
  const [cheapestListing] = listings;

  return { name, topOffer, cheapestListing, lastSale };
};

const getAssetIds = async (account) => {
  const { data } = await axios.get(
    `https://api.opensea.io/api/v1/assets?owner=${account}&order_direction=desc&order_by=visitor_count&offset=0&limit=20`
  );

  const { assets } = data;
  return assets.map((a) => `${a.asset_contract.address}/${a.token_id}`);
};

const PRICES_DIRECTION = "right";

(async () => {
  const totals = {
    topOffer: 0,
    cheapestListing: 0,
    lastSale: 0,
  };
  const ids = await getAssetIds(address);

  for (id of ids) {
    const { name, topOffer, cheapestListing, lastSale } = await getAssetInfo(
      id
    );

    totals.topOffer += get(topOffer, "usd_price", 0);
    totals.cheapestListing += get(cheapestListing, "usd_price", 0);
    totals.lastSale += get(lastSale, "lastUsdPrice", 0);

    assetsTable.push([
      name.yellow,
      {
        content: topOffer
          ? `${topOffer.price} ${topOffer.symbol} (${formatCash(
              get(topOffer, "usd_price", 0)
            )})`
          : "",
        hAlign: PRICES_DIRECTION,
      },
      {
        content: cheapestListing
          ? `${cheapestListing.price} ${cheapestListing.symbol} (${formatCash(
              get(cheapestListing, "usd_price", 0)
            )})`
          : "",
        hAlign: PRICES_DIRECTION,
      },
      {
        content: lastSale
          ? `${lastSale.price} ${lastSale.symbol} (${formatCash(
              get(lastSale, "lastUsdPrice", 0)
            )})`
          : "",
        hAlign: PRICES_DIRECTION,
      },
    ]);

    await delay(500);
  }

  assetsTable.push(
    [],
    [
      {
        content: "totals".green,
        hAlign: "left",
      },
    ],
    [
      {},
      {
        content: formatCash(totals.topOffer).green,
        hAlign: PRICES_DIRECTION,
      },
      {
        content: formatCash(totals.cheapestListing).green,
        hAlign: PRICES_DIRECTION,
      },
      {
        content: formatCash(totals.lastSale).green,
        hAlign: PRICES_DIRECTION,
      },
    ]
  );
  spinner.stop();

  console.log(assetsTable.toString());
})();
