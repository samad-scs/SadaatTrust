import { NextResponse } from 'next/server'

import { apiResponse } from '@utils/index'

export async function GET(request: Request) {
  return NextResponse.json({ data: request?.url })
}

export async function PUT(request: Request) {
  return NextResponse.json({ data: request?.url })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!id) return apiResponse(false, 404, 'Could not find such user!', null)

  return NextResponse.json({ data: request?.url })
}
