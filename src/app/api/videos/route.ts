import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined')
}
const uri = process.env.MONGODB_URI || ''
const client = new MongoClient(uri)

const clientPromise: Promise<MongoClient> = client.connect()

async function getDb() {
  const client = await clientPromise
  return client.db('videocollections')
}

export async function GET() {
  try {
    const db = await getDb()
    const videos = await db.collection('videos').find().toArray()
    return NextResponse.json(videos)
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { youtubeId, title } = await req.json()
    const db = await getDb()
    const result = await db.collection('videos').insertOne({ youtubeId, title })
    const newVideo = { _id: result.insertedId, youtubeId, title }
    return NextResponse.json(newVideo, { status: 201 })
  } catch (error) {
    console.error('Error adding video:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}