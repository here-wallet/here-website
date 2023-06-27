export const maskedUserName = (inputValue) => {
	const value = inputValue.replaceAll(' ', '');

	if (value.length < 2) {
		return { value, isValid: false, error: "The nickname is too short" };
	}

	if (/[^\u0000-\u007F]+$/.test(value)) {
		return { value, isValid: false, error: "Please use Latin letters" };
	}


	if (value.endsWith(".near")) {
		const lowercaseValue = value.toLowerCase();
		if (lowercaseValue.length > 32) {
			return { value, isValid: false, error: "The nickname is too long" };
		}
		if (!/^[a-z0-9._]+$/.test(lowercaseValue)) {
			return { value, isValid: false, error: "Address can only contain letters A…z and numbers 1…9" };
		}
	} else {
		if (!/^[0-9a-fA-F]+$/.test(value)) {
			return { value, isValid: false, error: "Wrong wallet address" };
		}
	}

	return { value, isValid: true };
};
