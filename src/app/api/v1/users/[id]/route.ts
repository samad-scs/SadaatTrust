import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json({ data: request?.url })
}

export async function PUT(request: Request) {
  return NextResponse.json({ data: request?.url })
}

export async function DELETE(request: Request) {
  console.log('request :', request)

  return NextResponse.json({ data: request?.url })
}
