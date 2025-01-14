import 'dotenv/config'
import * as createThumbnail from './controllers/thumbnailControllers/createThumbnail.js'

import amqplib from 'amqplib'
const QEUE_NAME = 'creacion-thumbnails'

if (!process.env.RABBITMQ_BROKER_URL) {
  throw new Error('RABBITMQ_BROKER_URL is required')
}

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
