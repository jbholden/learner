module.exports = function(sequelize, DataTypes) {
   return sequelize.define('topics', {
      id: DataTypes.INTEGER,    
      title: DataTypes.STRING,    
      description: DataTypes.TEXT,    
      understood: DataTypes.FLOAT
      reviews: DataTypes.ARRAY(DataTypes.Date),
      parent_topic: DataTypes.INTEGER,    
      sub_topics: DataTypes.ARRAY(DataTypes.INTEGER),
      images: DataTypes.ARRAY(DataTypes.INTEGER)
  }, {
    timestamps: false
  });
};
