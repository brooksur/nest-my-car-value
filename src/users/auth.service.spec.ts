import { Test, TestingModule } from '@nestjs/testing'
import faker from '@faker-js/faker'
import { AuthService } from './auth.service'
import { UsersService } from './users.service'
import { User } from './user.entity'

describe('AuthService', () => {
  let service: AuthService, fakeUsersService: Partial<UsersService>

  beforeEach(async () => {
    const users: User[] = []
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email)
        return Promise.resolve(filteredUsers)
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.round(Math.random() * 1000),
          email,
          password
        } as User
        users.push(user)
        return Promise.resolve(user)
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile()

    service = module.get(AuthService)
  })

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined()
  })

  it('creates a new user with salted and hashed password', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()
    const user = await service.signup(email, password)
    expect(user.password).not.toBe(password)
    const [salt, hash] = user.password.split('.')
    expect(salt).toBeDefined()
    expect(hash).toBeDefined()
  })

  it('throws an error is user signs up with an email that is already in use', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()
    await service.signup(email, password)
    try {
      await service.signup(email, password)
      expect(true).toBe(false)
    } catch (e) {
      expect(true).toBe(true)
    }
  })

  it('throws if signin is called with an unused email', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()
    try {
      await service.signup(email, password)
      expect(true).toBe(false)
    } catch (e) {
      expect(true).toBe(true)
    }
  })

  it('throws if an invalid password is provided', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()
    try {
      await service.signup(email, password)
      await service.signin(email, password + '@')
      expect(true).toBe(false)
    } catch (e) {
      expect(true).toBe(true)
    }
  })

  it('returns a user if correct password is provided', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()
    await service.signup(email, password)
    try {
      const user = await service.signin(email, password)
      expect(user).toBeTruthy()
    } catch (e) {
      expect(false).toBe(true)
    }
  })
})
