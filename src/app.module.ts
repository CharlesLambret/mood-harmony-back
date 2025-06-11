
@Module({
  imports: [JwtModule.register({})],
  controllers: [UserController, ChapterController, UnitController],
  providers: [
    PrismaService,
    JwtService,
    {
      provide: 'TokenService',
      useFactory: (jwtService: JwtService) => new JwtServiceAdapter(jwtService),
      inject: [JwtService],
    },
    {
      provide: UserRepository,
      useFactory: (prisma: PrismaService) => new PrismaUserRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: ChapterRepository,
      useFactory: (prisma: PrismaService) =>
        new PrismaChapterRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: UnitRepository,
      useFactory: (prisma: PrismaService) => new PrismaUnitRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: CreateUserUseCase,
      useFactory: (userRepository: UserRepository) =>
        new CreateUserUseCase(userRepository),
      inject: [UserRepository],
    },
    {
      provide: UpdateUserTypeUseCase,
      useFactory: (userRepository: UserRepository) =>
        new UpdateUserTypeUseCase(userRepository),
      inject: [UserRepository],
    },
    {
      provide: LoginUseCase,
      useFactory: (
        userRepository: UserRepository,
        tokenService: TokenService,
        refreshTokenRepository: RefreshTokenRepository,
      ) =>
        new LoginUseCase(userRepository, refreshTokenRepository, tokenService),
      inject: [UserRepository, 'TokenService'],
    },
    {
      provide: CreateChapterUseCase,
      useFactory: (chapterRepository: ChapterRepository) =>
        new CreateChapterUseCase(chapterRepository),
      inject: [ChapterRepository],
    },
    {
      provide: UpdateChapterUseCase,
      useFactory: (chapterRepository: ChapterRepository) =>
        new UpdateChapterUseCase(chapterRepository),
      inject: [ChapterRepository],
    },
    {
      provide: GetChapterByIdUseCase,
      useFactory: (chapterRepository: ChapterRepository) =>
        new GetChapterByIdUseCase(chapterRepository),
      inject: [ChapterRepository],
    },
    {
      provide: GetChaptersUseCase,
      useFactory: (chapterRepository: ChapterRepository) =>
        new GetChaptersUseCase(chapterRepository),
      inject: [ChapterRepository],
    },
    {
      provide: CreateUnitUseCase,
      useFactory: (unitRepository: UnitRepository) =>
        new CreateUnitUseCase(unitRepository),
      inject: [UnitRepository],
    },
    {
      provide: UpdateUnitUseCase,
      useFactory: (unitRepository: UnitRepository) =>
        new UpdateUnitUseCase(unitRepository),
      inject: [UnitRepository],
    },
    {
      provide: GetUnitByIdUseCase,
      useFactory: (unitRepository: UnitRepository) =>
        new GetUnitByIdUseCase(unitRepository),
      inject: [UnitRepository],
    },
    {
      provide: getUnitsByChapterIdUseCase,
      useFactory: (unitRepository: UnitRepository) =>
        new getUnitsByChapterIdUseCase(unitRepository),
      inject: [UnitRepository],
    },
  ],
})
export class AppModule {}
