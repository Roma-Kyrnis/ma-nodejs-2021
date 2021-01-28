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

module.exports = { arrayProducts };
