import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Request,
  Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-roles.enum';

@ApiTags('Accounts Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  async createAccount(@Body() createAccountDto: CreateAccountDto, @Request() req) {
    const creatorRole = req.user.role;
    return this.accountsService.createAccount(createAccountDto, creatorRole);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all accounts' })
  @ApiResponse({ status: 200, description: 'Accounts retrieved successfully' })
  async getAllAccounts() {
    return this.accountsService.getAllAccounts();
  }

  @Get('role/:role')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COLLEGE_SUPERVISOR)
  @ApiOperation({ summary: 'Get accounts by role' })
  @ApiResponse({ status: 200, description: 'Accounts retrieved successfully' })
  async getAccountsByRole(@Param('role') role: UserRole) {
    return this.accountsService.getAccountsByRole(role);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get account by ID' })
  @ApiResponse({ status: 200, description: 'Account retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async getAccountById(@Param('id') id: string) {
    return this.accountsService.getAccountById(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update account' })
  @ApiResponse({ status: 200, description: 'Account updated successfully' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  async updateAccount(
    @Param('id') id: string, 
    @Body() updateAccountDto: UpdateAccountDto,
    @Request() req
  ) {
    const updaterRole = req.user.role;
    return this.accountsService.updateAccount(id, updateAccountDto, updaterRole);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete account (soft delete)' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - only super admin can delete accounts' })
  async deleteAccount(@Param('id') id: string, @Request() req) {
    const deleterRole = req.user.role;
    await this.accountsService.deleteAccount(id, deleterRole);
    return { message: 'Account deleted successfully' };
  }
}
