import { JsonController, Post, Get, Param, CurrentUser, Authorized, HttpCode, Body, Put, NotFoundError, Delete} from 'routing-controllers';
import { IsString, Length, IsOptional, IsUrl, IsDateString } from 'class-validator';
import {User} from '../users/entity';
import Event from './entity';

class validEvent {

    @IsString()
    @Length(2,15)
    name: string;

    @IsOptional()
    @IsString()
    @Length(10,100)
    description: string;
  
    @IsOptional()
    @IsDateString()
    startingTime: Date;

    @IsOptional()
    @IsDateString()
    endTime: Date;

    @IsOptional()
    @IsUrl()
    thumbnail: string;
    
}

@JsonController()
export default class EventsController {

    /*@Get('/events')
    async getEvents() {
      const today = new Date().toISOString(); 
      const upcomingEvents = await Event.query(`select * from events where end_time >= '${today}'::date`);  
      return upcomingEvents;
    }*/

    @Get('/events')
async allEvents() {
   const events = await Event.find()
  return { events }
}

    @Get('/events/:id([0-9]+)')
    getEvent(
      @Param('id') id: number
    ) {
      return Event.findOneById(id);
    }

 //   @Authorized(['admin'])
    @Authorized()
    @HttpCode(201)
    @Post('/events')
    async createEvent(
        @Body() event : validEvent,
        @CurrentUser() user: User
    ) {
        const entity = await Event.create(event);
        entity.user = user;

        const newEvent = await entity.save();
        return newEvent;
    }

    @Authorized(['admin'])
    @HttpCode(200)
    @Put('/events/:id([0-9]+)')
    async updateEvent(
        @Param('id') id: number,
        @Body() update : Partial<Event>
    ) {
        const event = await Event.findOneById(id);
        if(!event) throw new NotFoundError('Event not found!');
        
        const updatedEvent = Event.merge(event,update).save();
        return updatedEvent;
    }

    @Authorized(['admin'])
    @HttpCode(200)
    @Delete('/events/:id([0-9]+)')
    async deleteEvent(
        @Param('id') id: number
    ) {
        const event = await Event.findOneById(id);
        if(!event) throw new NotFoundError('Event not found!');
        
        return Event.remove(event);
    }
}
