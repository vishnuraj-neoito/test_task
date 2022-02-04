import HttpException from '../exceptions/HttpException';
import {
	AddCreditCardDto,
	ChargeCardDto,
	GetCreditCardByIdDto,
	TransactionsListDto,
	UpdateCardDto,
} from '../dtos/credit_card.dto';
import moment from 'moment';
import { CommonListDto } from '../dtos/child.dto';
const Users = require('../../models').Users;
const Childs = require('../../models').Childs;
const CreditCards = require('../../models').CreditCards;
const Transactions = require('../../models').Transactions;
class CreditCardService {
	public async addCreditCard(
		creditCardData: AddCreditCardDto,
		parent_id: Number
	) {
		const parent = await Users.findOne({
			where: { id: parent_id },
		});
		if (!parent) {
			throw new HttpException(404, 'Invalid user!');
		}
		const child = await Childs.findOne({
			where: { id: creditCardData.child_id },
		});
		if (!child) {
			throw new HttpException(404, 'Invalid child id');
		}
		if (child.parent_id != parent_id) {
			throw new HttpException(403, 'Unauthorized action!');
		}
		const checkExistingCard = await CreditCards.findOne({
			where: { number: creditCardData.number },
		});
		if (checkExistingCard) {
			throw new HttpException(
				400,
				'This card number is already in added. Try adding a different card.'
			);
		}
		if (creditCardData.number.trim().length <= 0) {
			throw new HttpException(400, 'Invalid card number!');
		}
		if (creditCardData.type.trim().length <= 0) {
			throw new HttpException(400, 'Invalid card type!');
		}
		if (Number(creditCardData.monthly_limit) <= 0) {
			throw new HttpException(400, 'Monthly limit should be greater than 0');
		}
		let today, expDay;
		let exMonth = creditCardData.expiration_month;
		let exYear = creditCardData.expiration_year;
		today = new Date();
		expDay = new Date();
		expDay.setFullYear(exYear, exMonth, 1);

		if (expDay < today) {
			throw new HttpException(400, 'Card is expired. Try adding another card!');
		}
		if (creditCardData.security_code.trim().length !== 3) {
			throw new HttpException(400, 'Invalid security code');
		}
		const card = await CreditCards.create({
			child_id: creditCardData.child_id,
			type: creditCardData.type,
			number: creditCardData.number,
			security_code: creditCardData.security_code,
			expiration_date: `${creditCardData.expiration_month}/${creditCardData.expiration_year}`,
			monthly_limit: creditCardData.monthly_limit,
			current_spend_amount: 0,
			current_spend_month: moment(new Date().toJSON().toString()).format(
				'MM/YYYY'
			),
		});
		return card;
	}

	public async getCreditCards(params: CommonListDto, parent_id: Number) {
		const { page, limit } = params;
		const { count, rows: data } = await CreditCards.findAndCountAll({
			limit,
			offset: limit * (page - 1),
			attributes: [
				'id',
				'child_id',
				'type',
				'number',
				'expiration_date',
				'monthly_limit',
				'current_spend_amount',
			],
			include: [
				{
					model: Childs,
					as: 'childs',
					where: { parent_id: parent_id },
					required: true,
				},
			],
		});
		return { count, data };
	}

	public async getCreditCardById(params: GetCreditCardByIdDto) {
		const { credit_card_id } = params;
		const card = await CreditCards.findOne({
			where: { id: credit_card_id },
			attributes: [
				'id',
				'child_id',
				'type',
				'number',
				'expiration_date',
				'monthly_limit',
				'current_spend_amount',
			],
		});
		if (card) {
			return card;
		} else {
			throw new HttpException(400, 'Invalid card id!');
		}
	}

	public async updateCreditCard(params: UpdateCardDto, parent_id: Number) {
		const { credit_card_id, monthly_limit } = params;
		const card = await CreditCards.findOne({
			where: { id: credit_card_id },
			required: true,
			attributes: [
				'id',
				'child_id',
				'type',
				'number',
				'expiration_date',
				'monthly_limit',
				'current_spend_amount',
				'current_spend_month',
			],
			include: [
				{
					model: Childs,
					as: 'childs',
					where: { parent_id: parent_id },
					required: true,
				},
			],
		});
		if (!card) {
			throw new HttpException(403, 'Card not found. unauthorized action');
		}
		if (
			moment(new Date().toJSON().toString()).format('MM/YYYY') !=
			card.current_spend_month
		) {
			card.current_spend_month = moment(new Date().toJSON().toString()).format(
				'MM/YYYY'
			);
			card.current_spend_amount = 0;
		}
		if (Number(monthly_limit) <= 0) {
			throw new HttpException(400, 'Monthly limit should be greater than 0');
		}
		if (Number(monthly_limit) < Number(card.current_spend_amount)) {
			throw new HttpException(
				400,
				`${card.current_spend_amount}  already spend on this card. please increase the limit.`
			);
		}
		card.monthly_limit = monthly_limit;
		await card.save();
		return {
			id: card.id,
			monthly_limit: card.monthly_limit,
			current_spend_amount: card.current_spend_amount,
		};
	}

	public async deleteCreditCard(params: GetCreditCardByIdDto) {
		const { credit_card_id } = params;
		const card = await CreditCards.findOne({
			where: { id: credit_card_id },
			attributes: [
				'id',
				'child_id',
				'type',
				'number',
				'expiration_date',
				'monthly_limit',
				'current_spend_amount',
			],
		});
		if (card) {
			try {
				await CreditCards.destroy({
					where: { id: credit_card_id },
				});
				return true;
			} catch (error) {
				throw new HttpException(400, 'Card deletion failed.');
			}
		} else {
			throw new HttpException(400, 'Invalid card id!');
		}
	}

	public async chargeTheCard(params: ChargeCardDto, parent_id: Number) {
		const { credit_card_id, amount } = params;
		const charging_amount: number = Number(amount);
		const card = await CreditCards.findOne({
			where: { id: credit_card_id },
			required: true,
			attributes: [
				'id',
				'child_id',
				'type',
				'number',
				'expiration_date',
				'monthly_limit',
				'current_spend_amount',
				'current_spend_month',
			],
			include: [
				{
					model: Childs,
					as: 'childs',
					where: { parent_id: parent_id },
					required: true,
				},
			],
		});
		if (!card) {
			throw new HttpException(403, 'Card not found. unauthorized action');
		}
		if (
			moment(new Date().toJSON().toString()).format('MM/YYYY') !=
			card.current_spend_month
		) {
			card.current_spend_month = moment(new Date().toJSON().toString()).format(
				'MM/YYYY'
			);
			card.current_spend_amount = 0;
		}
		if (Number(charging_amount) <= 0) {
			throw new HttpException(400, 'Charging amount should be greater than 0');
		}
		const remaining_amount: number =
			Number(card.monthly_limit) - Number(card.current_spend_amount);
		if (remaining_amount < charging_amount) {
			throw new HttpException(
				400,
				`Only ${Math.round(
					remaining_amount
				)} is remaining in the monthly limit. Please increase the monthly limit to charge more.`
			);
		}
		card.current_spend_amount =
			Number(card.current_spend_amount) + Number(charging_amount);
		await card.save();
		await Transactions.create({
			credit_card_id: credit_card_id,
			spend_amount: charging_amount,
			spend_month: moment(new Date().toJSON().toString()).format('MM/YYYY'),
		});
		return {
			id: card.id,
			number: card.number,
			monthly_limit: card.monthly_limit,
			current_spend_amount: card.current_spend_amount,
		};
	}

	public async getTransactionList(
		params: TransactionsListDto,
		parent_id: Number
	) {
		const { credit_card_id, page, limit } = params;
		const card = await CreditCards.findOne({
			where: { id: credit_card_id },
			required: true,
			attributes: [
				'id',
				'child_id',
				'type',
				'number',
				'expiration_date',
				'monthly_limit',
				'current_spend_amount',
				'current_spend_month',
			],
			include: [
				{
					model: Childs,
					as: 'childs',
					where: { parent_id: parent_id },
					required: true,
				},
			],
		});
		if (!card) {
			throw new HttpException(403, 'Card not found. unauthorized action');
		}
		const { count, rows: transactions } = await Transactions.findAndCountAll({
			limit,
			offset: limit * (page - 1),
			order: [['createdAt', 'DESC']],
			where: { credit_card_id: credit_card_id },
			required: true,
		});
		return { count, transactions };
	}
}

export default CreditCardService;
