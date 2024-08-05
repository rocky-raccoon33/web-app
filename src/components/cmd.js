const cmd = {

	GET_DEV_INFO: {
		method: "getDevInfo"
	},

	GET_DEV_STATUS: {
		method: "getDevStatus"
	},

	START_CMD: {
		method: "start",
		slotNum: 1,
		type: "TIME",
		maxPower: 0,
		pullOutStop: true,
		pullOutStopPower: 5,
		pullOutStopStartSec: 0,
		chargeFullStop: true,
		chargeFullStopPower: 10,
		chargeFullStopSec: 60,
		chargeFullStopStartSec: 0,
		remark: 123,
		frameId: 1656917083117,
		timeSec: 60
	},

	STOP_CMD: {
		method: "stop",
		slotNum: 1
	}
}

export default cmd