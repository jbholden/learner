module.exports = function(sequelize, DataTypes) {
   return sequelize.define('top_level', {
      id: DataTypes.INTEGER,    
      name: DataTypes.STRING,    
      type: DataTypes.STRING,    
      topics: DataTypes.ARRAY(DataTypes.INTEGER),
      understood: DataTypes.FLOAT
  }, {
    timestamps: false
  });
};
