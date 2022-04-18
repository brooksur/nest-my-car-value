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
      findOne: () => {
        const user = {
          id: faker.datatype.number({ max: 10000 }),
          email: faker.internet.email(),
          password: faker.internet.password()
        } as User
        return Promise.resolve(user)
      },
      find: (email: string) => {
        const user = {
          id: faker.datatype.number({ max: 10000 }),
          email: faker.internet.email(),
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
      // signin: () => {}
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
})
