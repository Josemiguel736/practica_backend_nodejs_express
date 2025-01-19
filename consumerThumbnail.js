import 'dotenv/config'
import * as createThumbnail from './controllers/thumbnailControllers/createThumbnail.js'

import amqplib from 'amqplib'

if (!process.env.RABBITMQ_BROKER_URL || !process.env.QEUE_NAME) {
  throw new Error('RABBITMQ BROKER URL and QEUE NAME are required')
}
const QEUE_NAME = process.env.QEUE_NAME

const connection = await amqplib.connect(process.env.RABBITMQ_BROKER_URL)

const channel = await connection.createChannel()

channel.assertQueue(QEUE_NAME, { durable: true })

channel.prefetch(5)

channel.consume(QEUE_NAME, async (message) => {
  const payload = JSON.parse(message.content.toString())
  createThumbnail.createThumbnail(payload.imageId, Number.parseInt(payload.size), Number.parseInt(payload.sizeThumbnails))
  console.log(`Thumbnail created for image ${payload.imageId}`)
  channel.ack(message)
})

console.log(`Conected to RabbitMQ at qeue: ${QEUE_NAME}`)
console.log('Waiting for messages')
