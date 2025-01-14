import amqplib from 'amqplib'

export async function sendThumbnail (req, res, next) {
  const EXCHANGE_NAME = 'thumbnail_exchange'
  const connection = await amqplib.connect(process.env.RABBITMQ_BROKER_URL)
  const channel = await connection.createChannel()

  let keepSending = true

  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true })

  if (!req.file) {
    next()
    return
  }
  const image = req.file.filename

  const imageSize = process.env.IMAGE_SIZE || 1000
  const thumbnailSize = process.env.THUMBNAIL_SIZE || 100
  const message = {
    imageId: image,
    size: imageSize,
    sizeThumbnails: thumbnailSize
  }
  channel.publish(EXCHANGE_NAME, '*', Buffer.from(JSON.stringify(message)))
  if (!keepSending) {
    console.warn('RABBITMQ is full, waiting for drain event')
    await new Promise(resolve => channel.on('drain', resolve))
    keepSending = channel.publish(EXCHANGE_NAME, '*', Buffer.from(JSON.stringify(message)))
  }

  console.log('Message sent')
  next()
}
