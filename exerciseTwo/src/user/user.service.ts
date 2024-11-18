import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async updateUserProblems(): Promise<number> {
        const usersWithProblems = await this.userRepository.count({ where: { problem: true } });

        await this.userRepository.update({ problem: true }, { problem: false });

        return usersWithProblems;
    }
}
