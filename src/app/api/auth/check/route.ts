import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'

export async function GET(req: Request) {
  const token = req.headers.get('cookie')?.split('; ').find(row => row.startsWith('token='))?.split('=')[1]

  if (!token) {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 })
  }

  try {
    verify(token, process.env.JWT_SECRET || 'fallback_secret')
    return NextResponse.json({ isAuthenticated: true })
  } catch (error) {
    console.log("An error occured", error);
    return NextResponse.json({ isAuthenticated: false }, { status: 401 })
  }
}