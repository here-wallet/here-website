export const maskedUserName = (inputValue) => {
	const value = inputValue.replace(/[^a-zA-Z0-9_.-]/g, '');
	const isValid = value.length >= 2 && (/^[A-Fa-f0-9]+$/.test(value) || /^[0-9a-z]+.near/.test(value));
	return { value, isValid };
}