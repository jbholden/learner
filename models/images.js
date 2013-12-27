module.exports = function(sequelize, DataTypes) {
   return sequelize.define('images', {
      id: DataTypes.INTEGER,    
      data: DataTypes.BLOB
  }, {
    timestamps: false
  });
};
