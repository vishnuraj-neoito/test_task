'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize: any, DataTypes: any) => {
	class Transactions extends Model {
		// @ts-ignore
		static associate(models) {
			Transactions.belongsTo(models.CreditCards, {
				as: 'credit_cards',
				foreignKey: 'credit_card_id',
			});
		}
	}

	Transactions.init(
		{
			id: {
				type: DataTypes.BIGINT,
				primaryKey: true,
				autoIncrement: true,
			},
			credit_card_id: {
				type: DataTypes.BIGINT,
				allowNull: false,
			},
			spend_amount: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			spend_month: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'Transactions',
		}
	);
	return Transactions;
};
