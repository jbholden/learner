module.exports = function(sequelize, DataTypes) {
   return sequelize.define('image', {
      id: DataTypes.INTEGER,    
      data: DataTypes.BLOB
  }, {
    timestamps: false
  });
};
