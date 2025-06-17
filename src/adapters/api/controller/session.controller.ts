import { Body, Controller, Post } from '@nestjs/common';
import { CurrentUser } from '../decorator/current-user.decorator';
import { ProfileRequest } from '../request/profile.request';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GenerateSessionResponse } from '../response/create-session.response';
import { GenerateSessionUseCase } from '../../../core/usecases/create-session.use-case';
import { GenerateSessionRequest } from '../request/create-session.request';
import { GenerateSessionMapper } from '../mapper/create-session.mapper';

@ApiTags('Sessions')
@Controller('/sessions')
export class SessionController {
  constructor(
    private readonly generateSessionUseCase: GenerateSessionUseCase,
  ) {}

  @Post('/generate')
  @ApiOperation({ summary: 'Generate a new personalized music session' })
  @ApiCreatedResponse({
    description: 'Session successfully generated',
    type: GenerateSessionResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input or validation error',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async generateSession(
    @CurrentUser() currentUser: ProfileRequest,
    @Body() body: GenerateSessionRequest,
  ): Promise<GenerateSessionResponse> {
    const command = GenerateSessionMapper.toDomain(body);
    const session = await this.generateSessionUseCase.execute(command);
    return GenerateSessionMapper.fromDomain(session);
  }
}