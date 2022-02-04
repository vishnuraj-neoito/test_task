'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize: any, DataTypes: any) => {
	class Users extends Model {
		// @ts-ignore
		static associate(models) {
			Users.hasMany(models.Childs, { as: 'childs', foreignKey: 'parent_id' });
		}
	}

	Users.init(
		{
			id: {
				type: DataTypes.BIGINT,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			sequelize,
			modelName: 'Users',
		}
	);
	return Users;
};
