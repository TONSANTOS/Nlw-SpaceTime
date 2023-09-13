import { api } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // todos parâmetros que estão vindo na URL
  const { searchParams } = new URL(request.url)

  const code = searchParams.get('code')
  const redirectTo = request.cookies.get('redirectTo')?.value // informação vindo dos cookies

  const registerResponse = await api.post('/register', {
    code,
  })

  const { token } = registerResponse.data

  const redirectUrl = redirectTo ?? new URL('/', request.url)

  // 60 = 1 minuto, 24 = um dia, 30 = 30 dias
  const cookiesExpiresInSeconds = 60 * 60 * 24 * 30

  return NextResponse.redirect(redirectUrl, {
    // 'Set-Cookie' cria um cookie
    headers: {
      'Set-Cookie': `token=${token}; Path=/; max-age=${cookiesExpiresInSeconds}`, // Path siginifca que este token/cookie vai está diponivel em toda aplicação
    },
  })
}
