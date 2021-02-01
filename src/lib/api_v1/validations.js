const { celebrate, Joi, Segments } = require('celebrate');

const arrayProducts = celebrate({
  [Segments.BODY]: Joi.array().items(
    Joi.object({
      type: Joi.string().min(3).max(256),
      color: Joi.string().min(3).max(256),
      price: Joi.number().min(0),
      priceForPair: Joi.number().min(0),
    }).or('price', 'priceForPair'),
  ),
});

const cityRefInWarehouse = Joi.object({
  data: Joi.object({
    data: Joi.array()
      .min(1)
      .items(
        Joi.object({
          CityRef: Joi.string().min(10).max(256),
        }).unknown(),
      ),
  }).unknown(),
}).unknown();

const costInDeliveryPrice = Joi.object({
  data: Joi.object({
    data: Joi.array()
      .min(1)
      .items(
        Joi.object({
          Cost: Joi.number().min(0),
        }).unknown(),
      ),
  }).unknown(),
}).unknown();

module.exports = {
  middleware: { arrayProducts },
  joiFunctions: { cityRefInWarehouse, costInDeliveryPrice },
};
