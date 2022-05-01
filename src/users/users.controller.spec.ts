import { Test, TestingModule } from '@nestjs/testing'
import faker from '@faker-js/faker'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { AuthService } from './auth.service'
import { User } from './user.entity'

describe('UsersController', () => {
  let controller: UsersController,
    mockUsersService: Partial<UsersService>,
    mockAuthService: Partial<AuthService>

  beforeEach(async () => {
    mockUsersService = {
      findOne: (id: number) => {
        const user = {
          id,
          email: faker.internet.email(),
          password: faker.internet.password()
        } as User
        return Promise.resolve(user)
      },
      find: (email: string) => {
        const user = {
          id: faker.datatype.number({ max: 10000 }),
          email,
          password: faker.internet.password()
        } as User
        return Promise.resolve([user])
      }
      // remove: () => {

      // },
      // update: () => {}
    }
    mockAuthService = {
      // signup: () => {},
      signin(email: string, password: string) {
        return Promise.resolve({ id: 1, email, password } as User)
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService
        },
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ],
      controllers: [UsersController]
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers(faker.internet.email())
    expect(users).toHaveLength(1)
  })

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1')
    expect(user).toBeTruthy()
  })

  it('findUser throws an error is user with given id is not found', async () => {
    mockUsersService.findOne = () => Promise.resolve(null)
    try {
      await controller.findUser('1')
      expect(false).toBe(true)
    } catch (e) {
      expect(true).toBe(true)
    }
  })

  it('signin update session object and returns user', async () => {
    const session = { userId: 0 }
    const user = await controller.signin(
      { email: 'foo@bar.com', password: 'asdf' },
      session
    )
    expect(user.id).toBe(1)
    expect(session.userId).toBe(1)
  })
})
