const getFilterData = (bodyParams: any, tableParams: any) => {
	const data: any = {};
	Object.keys(bodyParams).forEach((key) => {
		data[key] = tableParams[key];
	});
	return data;
};

export const attributes = ['id', 'name', 'email'];

export default getFilterData;
