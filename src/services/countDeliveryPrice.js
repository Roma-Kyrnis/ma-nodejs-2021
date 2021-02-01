const {
  novaPoshta: { deliveryPrice, getWarehouses },
  validations: {
    joiFunctions: { cityRefInWarehouse, costInDeliveryPrice },
  },
} = require('../lib/api_v1/index');
const {
  products: { WEIGHTS },
  nova_poshta: {
    DELIVERY_PRICE: { OFFICE_LOCATION },
  },
} = require('../config');
const { throwIfInvalid } = require('../utils');

async function getCityRef(cityName) {
  const warehouse = await getWarehouses({ CityName: cityName });

  const validation = cityRefInWarehouse.validate(warehouse);

  throwIfInvalid(!validation.error, 400, 'Please fill correct recipientCity');

  return validation.value.data.data[0].CityRef;
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

  const validation = costInDeliveryPrice.validate(result);

  throwIfInvalid(!validation.error, 500, 'Cannot get valid deliveryPrice');

  return validation.value.data.data[0].Cost;
}

module.exports = countDeliveryPrice;
