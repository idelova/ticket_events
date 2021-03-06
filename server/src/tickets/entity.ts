import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'typeorm/repository/BaseEntity';
import { Exclude } from 'class-transformer';
import {User} from '../users/entity';
import Event from '../events/entity';
import Comment from '../comments/entity';

@Entity()
export class Ticket extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({nullable:true})
  price: number;

  @Column('text',{nullable:true})
  description: string;

  @Column('text',{nullable:true})
  thumbnail: string;

  @CreateDateColumn({type: 'timestamp'})
  timeOfCreation: Date ;

  @Exclude({toPlainOnly:true})
  @ManyToOne(_ => User, user => user.tickets)
  user: User;

  @Exclude({toPlainOnly:true})
  @ManyToOne(_=> Event, event => event.tickets, { onDelete: 'CASCADE' })
  event: Event;

  @OneToMany(_=> Comment, comment => comment.ticket)
  comments: Comment[];

}

@Entity()
export class TicketInfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({default: 0})
  commentsReceived: number;

  @OneToOne(_ => Ticket, { onDelete: 'CASCADE' })
  @JoinColumn()
  ticket: Ticket;

}