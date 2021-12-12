// @flow

export const getDateAndTime = (datetime: number): string => {
	const dateAndTime = new Date(datetime);
	const gmt = dateAndTime.toLocaleString();
	return gmt;
};
