import { NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'

const users = [
  { email: 'sharmaharshitraj@gmail.com', password: 'supersecret' }
]

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const user = users.find(u => u.email === email && u.password === password)

    if (user) {
      const token = sign({ email: user.email }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' })
      const response = NextResponse.json({ success: true })
      response.cookies.set('token', token, { httpOnly: true })
      return response
    } else {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'An error occurred:', error }, { status: 500 })
  }
}