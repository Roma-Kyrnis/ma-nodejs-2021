const {
  novaPoshta: { deliveryPrice, getWarehouses },
} = require('../lib/api_v1/index');
const {
  products: { WEIGHTS },
  nova_poshta: {
    DELIVERY_PRICE: { OFFICE_LOCATION },
  },
} = require('../config');
const { throwIfInvalid } = require('../utils');

async function getCityRef(cityName) {
  try {
    const warehouse = await getWarehouses({ CityName: cityName });
    return warehouse.data.data[0].CityRef;
  } catch (err) {
    throw throwIfInvalid(!err, 400, 'Please fill correct recipientCity');
  }
}

function getWeight({ type, quantity }) {
  const weight = WEIGHTS[type.toUpperCase()];
  return quantity * weight ? weight : WEIGHTS.DEFAULT;
}

async function countDeliveryPrice({ recipient, ...product }) {
  const priceProperties = {};

  priceProperties.CitySender = await getCityRef(OFFICE_LOCATION);
  priceProperties.CityRecipient = await getCityRef(recipient);
  priceProperties.Weight = getWeight(product);
  priceProperties.Cost = product.price * product.quantity;

  const result = await deliveryPrice(priceProperties);

  return result.data.data[0].Cost;
}

module.exports = countDeliveryPrice;
