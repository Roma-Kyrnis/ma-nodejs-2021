const request = require('./axios');

const {
  nova_poshta: { API_KEY, BASE_URL, WAREHOUSES, DELIVERY_PRICE },
} = require('../../config');

function deliveryPrice(methodProperties) {
  return request({
    method: 'POST',
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      modelName: DELIVERY_PRICE.MODEL_NAME,
      calledMethod: DELIVERY_PRICE.CALLED_METHOD,
      methodProperties: {
        ServiceType: DELIVERY_PRICE.SERVICE_TYPE,
        CargoType: DELIVERY_PRICE.CARGO_TYPE,
        ...methodProperties,
      },
      apiKey: API_KEY,
    },
  });
}

function getWarehouses(methodProperties) {
  return request({
    method: 'POST',
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      modelName: WAREHOUSES.MODEL_NAME,
      calledMethod: WAREHOUSES.CALLED_METHOD,
      methodProperties: {
        PAGE: WAREHOUSES.PAGE,
        Limit: WAREHOUSES.LIMIT,
        Language: WAREHOUSES.LANGUAGE,
        ...methodProperties,
      },
      apiKey: API_KEY,
    },
  });
}

module.exports = { deliveryPrice, getWarehouses };
