module.exports = function(sequelize, DataTypes) {
   return sequelize.define('topic', {
      id: DataTypes.INTEGER,    
      title: DataTypes.STRING,    
      content_type: DataTypes.STRING,    
      description: DataTypes.TEXT,    
      understood: DataTypes.FLOAT,
      reviews: DataTypes.ARRAY(DataTypes.BIGINT),
      toplevel: DataTypes.INTEGER,    
      parent_topic: DataTypes.INTEGER,    
      sub_topics: DataTypes.ARRAY(DataTypes.INTEGER),
      images: DataTypes.ARRAY(DataTypes.INTEGER)
  }, {
    timestamps: false
  });
};
