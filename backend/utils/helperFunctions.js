const { Op } = require("sequelize");

function applySeachFilters(where, type, min, max) {
  if (max && min) {
    where[type] = {
      [Op.between]: [min, max],
    };
  } else if (max) {
    where[type] = {
      [Op.lte]: max,
    };
  } else if (min) {
    where[type] = {
      [Op.gte]: min,
    };
  }
  return where;
}

const sum = (num, num2) => {
  return num + num2;
};

module.exports = {
  applySeachFilters,
  sum,
};
