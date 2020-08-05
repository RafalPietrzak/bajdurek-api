const { Client, Config, CheckoutAPI } = require('@adyen/api-library');
const { v4: uuid } = require('uuid');
const paymentDataStore = {};
const originStore = {};

const config = new Config();
config.apiKey = process.env.adyenApiKey;
const client = new Client({ config });
client.setEnvironment("TEST");
const checkout = new CheckoutAPI(client);

findCurrency = (type) => {
  switch (type) {
    case "wechatpayqr":
    case "alipay":
      return "CNY";
    case "dotpay":
      return "PLN";
    case "boletobancario":
      return "BRL";
    default:
      return "EUR";
  }
}
exports.health = (req, res) => {
  return res.send("ok");
}
exports.handleShopperRedirect = async (req, res) => {
  // Create the payload for submitting payment details
  const payload = {};
  payload["details"] = req.method === "GET" ? req.query : req.body;
  const orderRef = req.query.orderRef;
  payload["paymentData"] = paymentDataStore[orderRef];
  delete paymentDataStore[orderRef];
  const originalHost = originStore[orderRef] || "";
  delete originStore[orderRef];

  try {
    const response = await checkout.paymentsDetails(payload);
    // Conditionally handle different result codes for the shopper
    switch (response.resultCode) {
      case "Authorised":
        res.redirect(`${originalHost}/status/success`);
        break;
      case "Pending":
      case "Received":
        res.redirect(`${originalHost}/status/pending`);
        break;
      case "Refused":
        res.redirect(`${originalHost}/status/failed`);
        break;
      default:
        res.redirect(`${originalHost}/status/error?reason=${response.resultCode}`);
        break;
    }
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.redirect(`${originalHost}/status/error?reason=${err.message}`);
  }
};
exports.config = (req, res) => {
  res.json({
    environment: "test",
    clientKey: process.env.adyenClientKey,
  });
};
exports.getPaymentMethods = async (req, res) => {
  try {
    const response = await checkout.paymentMethods({
      amount: req.body.amount,
      countryCode: req.body.countryCode,
      // shopperLocale: "en-US", 
      channel: "Web",
      merchantAccount: process.env.adyenAccount,
    });
    res.json(response);
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.status(err.statusCode).json(err.message);
  }
};
exports.initiatePayment = async (req, res) => {
  const currency = findCurrency(req.body.paymentMethod.type);
  const shopperIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    const orderRef = uuid();
    const host = req.get('Host');
    const baseUrl = req.protocol + '://' + host
    // Ideally the data passed here should be computed based on business logic
    const response = await checkout.payments({
      amount: { currency, value: 1000 }, // value is 10€ in minor units
      reference: orderRef,
      merchantAccount: process.env.adyenAccount,
      // @ts-ignore
      shopperIP,
      channel: "Web",
      additionalData: {
        // @ts-ignore
        allow3DS2: true,
      },
      returnUrl: `${baseUrl}/api/user/handleShopperRedirect?orderRef=${orderRef}`,
      browserInfo: req.body.browserInfo,
      paymentMethod: req.body.paymentMethod,
      billingAddress: req.body.billingAddress,
      origin: req.body.origin,
    });
    let paymentMethodType = req.body.paymentMethod.type;
    let resultCode = response.resultCode;
    let redirectUrl = response.redirect !== undefined ? response.redirect.url : null;
    let action = null;

    if (response.action) {
      action = response.action;
      paymentDataStore[orderRef] = action.paymentData;
      const originalHost = new URL(req.headers["referer"]);
      if (originalHost) {
        originStore[orderRef] = originalHost.origin;
      }
    }
    res.json({ paymentMethodType, resultCode, redirectUrl, action });
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.status(err.statusCode).json(err.message);
  }
};
exports.submitAdditionalDetails = async (req, res) => {
  // Create the payload for submitting payment details
  const payload = {};
  payload["details"] = req.body.details;
  payload["paymentData"] = req.body.paymentData;

  try {
    // Return the response back to client
    // (for further action handling or presenting result to shopper)
    const response = await checkout.paymentsDetails(payload);
    let resultCode = response.resultCode;
    let action = response.action || null;

    res.json({ action, resultCode });
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.status(err.statusCode).json(err.message);
  }
};

