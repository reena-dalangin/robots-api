import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity()
export class Robot {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    purpose: string

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
}
