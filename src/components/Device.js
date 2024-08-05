import * as React from 'react';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import mqtt from "mqtt"
import cmd from "./cmd"

export default function IntroDivider() {
	const [device, setDevice] = React.useState({})
	const [MQClient, setClient] = React.useState(undefined)

	const IMEI = 864710078778304
	const PUB_TOPIC = `/iot/client/iot-board/${IMEI}`

	React.useEffect(() => {
		console.log("rerender")
		const SUB_TOPIC = `/iot/server/iot-board/${IMEI}`
		const broker = "wss://mqtt.asinfo.xyz/mqtt"

		const client = mqtt.connect(broker, {
			clean: true,
			clientId: `mqtt_${Math.random.toString(16).slice(3)}`,
			username: "mqttH520210621",
			password: "xe4uLMWt0Q",
			connectTimeout: 10000,
		})

		setClient(client)

		client.on('connect', function () {
			client.subscribe([SUB_TOPIC])
		})

		client.on('error', error => console.log('Fail to connect MQTT server over WSS', error))

		client.publish(PUB_TOPIC, JSON.stringify({ method: "getDevStatus" }), { qos: 0, retain: false })
		client.on('message', function (topic, payload, packet) {
			let msg = JSON.parse(payload.toString())

			if (msg.method === "getDevStatus") {
				setDevice({ ...msg })
			}
			// Payload is Buffer
			console.log(`Topic: ${topic}, Message: ${payload.toString()}, QoS: ${packet.qos}`)
		})

		return () => {
			client.end();
		}
	}, [PUB_TOPIC])

	const currentState = function (input) {

		if (input && input.tasks && input.tasks[0]) {
			return input.tasks[0].status
		}

		return "unknown"
	}

	const executeCMD = (command) => {
		if (undefined === MQClient) {
			return
		}
		MQClient.publish(PUB_TOPIC, JSON.stringify(command), { qos: 0, retain: false })
		MQClient.publish(PUB_TOPIC, JSON.stringify(cmd.GET_DEV_STATUS), { qos: 0, retain: false })

	}


	return (
		<Grid margin={10}>
			<Card variant="outlined" sx={{ maxWidth: 360 }}>
				<Box sx={{ p: 4, alignSelf: 'center' }}>
					<Stack direction="row" justifyContent="space-between" alignItems="center">
						<Typography gutterBottom variant="h5" component="div">
							测试充电桩
						</Typography>
						<Typography gutterBottom variant="h6" component="div">
							FREE
						</Typography>
					</Stack>
					<Stack direction="column" justifyContent="space-between">
						<Typography color="text.secondary" variant="body">
							imei: {device.imei}
						</Typography>

						<Typography color="text.secondary" variant="body">
							温度: {device.temperature || "测试描述"}
						</Typography>
						<Typography color="text.secondary" variant="body">
							型号: {device.model || "测试描述"}
						</Typography>
						<Typography color="text.secondary" variant="body">
							联网类型: {device.netType || "测试描述"}
						</Typography>
						<Typography color="text.secondary" variant="body">
							信号强度: {device.signal || "测试描述"}
						</Typography>
						<Typography color="text.secondary" variant="body">
							状态: {currentState(device) || "测试描述"}
						</Typography>
					</Stack>
				</Box>
				<Divider />
				<Box sx={{ p: 3 }}>

					<Stack direction="row" spacing={2}>
						<Chip label="10:00 - 12:00" size="small" />
						<Chip label="14:00 - 15:00" size="small" />
						<Chip label="16:00 - 17:00" size="small" />
					</Stack>
				</Box>
				<Divider />
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',

						'& > *': {
							m: 1,
						},
					}}
				>
					<ButtonGroup aria-label="Basic button group">
						<Button disabled={currentState(device) !== "idle"} onClick={() => executeCMD(cmd.START_CMD)} >启动</Button>
						<Button disabled={currentState(device) === "idle"} onClick={() => executeCMD(cmd.STOP_CMD)} > 关闭</Button>
					</ButtonGroup>
				</Box>
			</Card>
		</Grid >
	);
}