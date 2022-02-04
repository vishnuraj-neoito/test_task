'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize: any, DataTypes: any) => {
	class Childs extends Model {
		// @ts-ignore
		static associate(models) {
			Childs.belongsTo(models.Users, { as: 'users', foreignKey: 'parent_id' });
			Childs.hasMany(models.CreditCards, {
				as: 'credit_cards',
				foreignKey: 'child_id',
			});
		}
	}

	Childs.init(
		{
			id: {
				type: DataTypes.BIGINT,
				primaryKey: true,
				autoIncrement: true,
			},
			parent_id: {
				type: DataTypes.BIGINT,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			age: {
				type: DataTypes.INTEGER,
				allowNull: false,
				unique: true,
			},
		},
		{
			sequelize,
			modelName: 'Childs',
		}
	);
	return Childs;
};
