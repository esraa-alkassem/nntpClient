const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
});

const A_USENET = sequelize.define("a_USENET", {
  agroup: { type: DataTypes.TEXT },
  id_mes: { type: DataTypes.TEXT },
  fm: { type: DataTypes.TEXT },
  sub: { type: DataTypes.TEXT },
  ref: { type: DataTypes.TEXT },
  body: { type: DataTypes.TEXT },
  bytes: { type: DataTypes.TEXT },
  lines: { type: DataTypes.TEXT },
  n_mes: { type: DataTypes.TEXT },
  d_mes: { type: DataTypes.TEXT },
  i_mes: { type: DataTypes.TEXT },
});

const insertQuery = `
  INSERT INTO a_USENET (
    agroup, id_mes, fm, sub, ref, body, bytes, lines, n_mes, d_mes, i_mes
  ) VALUES (
    :agroup, :id_mes, :fm, :sub, :ref, :body, :bytes, :lines, :n_mes, :d_mes, :i_mes
  )
`;

const browseQuery = `
  SELECT sub, ref, fm, d_mes, n_mes, id_mes
  FROM a_USENET
  WHERE agroup = :agroup
  ORDER BY sub, i_mes
`;

const bodyQuery = `
  SELECT body
  FROM a_USENET
  WHERE agroup = :agroup
  AND id_mes = :id_mes
`;

module.exports = {
  A_USENET,
  sequelize,
  insertQuery,
  browseQuery,
  bodyQuery,
};
