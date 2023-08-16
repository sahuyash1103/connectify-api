const joi = require("joi");

async function validateSignupData(user) {
  let maxYear = new Date().getFullYear();

  const schema = joi.object({
    name: joi.string().min(3).max(50).required(),
    email: joi.string().min(10).max(255).required().email(),
    password: joi.string().min(8).max(255).required(),
    phone: joi.number().min(10).max(10).required(),
    about: joi.string().max(255),
    skills: joi.array().items(joi.string().max(10)),
    education: joi.array().items(
      joi.object({
        institute: joi.string().min(3).max(50).required(),
        startYear: joi.number().min(1900).max(maxYear).required(),
        endYear: joi.number().min(1900).max(maxYear).required(),
        degree: joi.string().min(3).max(50).required(),
      })
    ),
  });

  try {
    await schema.validateAsync(user);
  } catch (err) {
    return err;
  }
}

async function validateLoginData(user) {
  const schema = joi.object({
    email: joi.string().min(10).max(255).required().email(),
    password: joi.string().min(8).max(255).required(),
  });

  try {
    await schema.validateAsync(user);
  } catch (err) {
    return err;
  }
}

async function validateUserUpdateData(dataToUpdate) {
  let maxYear = new Date().getFullYear();

  const schema = joi.object({
    name: joi.string().min(3).max(50),
    email: joi.string().min(10).max(255).email(),
    password: joi.string().min(8).max(255),
    phone: joi.number().min(10).max(10),
    skills: joi.array().items(joi.string().min(3).max(10)),
    about: joi.string().max(255),
    education: joi.array().items(
      joi.object({
        institute: joi.string().min(3).max(50),
        startYear: joi.number().min(1900).max(maxYear),
        endYear: joi.number().min(1900).max(maxYear),
        degree: joi.string().min(3).max(50),
      })
    ),
  });

  try {
    await schema.validateAsync(dataToUpdate);
  } catch (err) {
    return err;
  }
}

module.exports = { validateSignupData, validateLoginData, validateUserUpdateData };
