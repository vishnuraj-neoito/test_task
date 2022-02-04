'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize: any, DataTypes: any) => {
	class CreditCards extends Model {
		// @ts-ignore
		static associate(models) {
			CreditCards.belongsTo(models.Childs, {
				as: 'childs',
				foreignKey: 'child_id',
			});
			CreditCards.hasMany(models.Transactions, {
				as: 'transactions',
				foreignKey: 'credit_card_id',
			});
		}
	}

	CreditCards.init(
		{
			id: {
				type: DataTypes.BIGINT,
				primaryKey: true,
				autoIncrement: true,
			},
			child_id: {
				type: DataTypes.BIGINT,
				allowNull: false,
			},
			type: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			number: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			security_code: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			expiration_date: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			monthly_limit: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			current_spend_amount: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			current_spend_month: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			sequelize,
			modelName: 'CreditCards',
		}
	);
	return CreditCards;
};
