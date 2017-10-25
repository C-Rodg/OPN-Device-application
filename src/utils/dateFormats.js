export const quickDateFormat = "YYYY-MM-DDTHH:mm:ss.SSSSZ";
export const displayDateFormat = "h:mm a, MMM Do, YYYY";

export const getClockDrift = time => {
	let secs = parseInt(time, 10);
	if (secs === 0) {
		return "No clock drift...";
	}
	const days = Math.floor(secs / (3600 * 24));
	secs -= days * 3600 * 24;
	const hrs = Math.floor(secs / 3600);
	secs -= hrs * 3600;
	const mins = Math.floor(secs / 60);
	secs -= mins * 60;
	let timeArr = [];
	if (days) {
		let str = days !== 1 ? `${days} days` : "1 day";
		timeArr.push(str);
	}
	if (hrs) {
		let str = hrs !== 1 ? `${hrs} hours` : "1 hour";
		timeArr.push(str);
	}
	if (mins) {
		let str = mins !== 1 ? `${mins} minutes` : "1 minute";
		timeArr.push(str);
	}
	if (secs) {
		let str = secs !== 1 ? `${secs} seconds` : "1 second";
		timeArr.push(str);
	}
	return timeArr.join(", ");
};
