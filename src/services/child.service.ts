import HttpException from '../exceptions/HttpException';
import {
	AddChildDto,
	CommonListDto,
	GetChildByIdDto,
	UpdateChildDto,
} from '../dtos/child.dto';
const Users = require('../../models').Users;
const Childs = require('../../models').Childs;

class ChildService {
	public async addChild(params: AddChildDto, parent_id: Number) {
		const parent = await Users.findOne({
			where: { id: parent_id },
		});
		if (!parent) {
			throw new HttpException(400, 'Invalid User!');
		}
		const child = await Childs.create({
			parent_id: parent_id,
			...params,
		});
		return child;
	}

	public async getChildList(params: CommonListDto, parent_id: Number) {
		const { page, limit } = params;
		const { count, rows: childs } = await Childs.findAndCountAll({
			limit,
			offset: limit * (page - 1),
			where: { parent_id: parent_id },
		});
		return { count, childs };
	}

	public async getChildById(params: GetChildByIdDto) {
		const { child_id } = params;
		const child = await Childs.findOne({
			where: { id: child_id },
		});
		if (child) {
			return child;
		}
		return null;
	}

	public async updateChild(childData: UpdateChildDto, parent_id: Number) {
		const child = await Childs.findOne({
			where: { id: childData?.child_id },
		});
		if (!child) {
			throw new HttpException(404, 'Invalid child id.');
		} else if (child && child.parent_id == parent_id) {
			if (childData?.name) {
				child.name = childData.name;
			}
			if (childData?.age) {
				child.age = childData.age;
			}
			await child.save();
			return child;
		} else {
			throw new HttpException(403, 'Unauthorized action!');
		}
	}

	public async deleteChild(params: GetChildByIdDto) {
		const { child_id } = params;
		const child = await Childs.findOne({
			where: { id: child_id },
		});
		if (!child) {
			throw new HttpException(400, 'Invalid child id');
		}
		try {
			await Childs.destroy({
				where: { id: child_id },
			});
			return true;
		} catch (error) {
			throw new HttpException(400, 'Child deletion failed!');
		}
	}
}

export default ChildService;
