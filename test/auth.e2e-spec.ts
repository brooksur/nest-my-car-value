import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'

describe('Authentication System', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()
    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('handles a signup request', () => {
    const email = 'testt@mail.com'
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        password: 'thisisapassword'
      })
      .expect(201)
      .then((res) => {
        expect(res.body.id).toBeTruthy()
        expect(res.body.email).toBe(email)
        expect(res.body.password).toBeFalsy()
      })
  })

  it('signup as a new user then get the currently signed in user', async () => {
    const email = 'test@mail.com'

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'thisisapass' })
      .expect(201)

    const cookie = res.get('Set-Cookie')

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)

    expect(body.id).toBeTruthy()
    expect(body.email).toBe(email)
  })
})
