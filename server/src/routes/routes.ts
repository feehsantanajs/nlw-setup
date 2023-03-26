import { FastifyInstance } from 'fastify'
import { prisma } from "../lib/prisma"
import { z } from 'zod'
import dayjs from 'dayjs'


export async function appRoutes(app: FastifyInstance) {

  app.post('/habits', async (request, reply) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(
        z.number().min(0).max(6)
      )
    })
    const { title, weekDays } = createHabitBody.parse(request.body)

    const today = dayjs().startOf('day').toDate()
    await prisma.habit.create({
      data: {
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map(weekDay => {
            return {
              week_day: weekDay,
            }
          })
        }
      }
    })
  })

  app.get('/day', async (request, reply) => {
    const getDaysParams = z.object({
      date: z.coerce.date()
    })

    const { date } = getDaysParams.parse(request.query)

    const parsedDay = dayjs(date).startOf('day')
    const weekDay = parsedDay.get('day')

    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date,
        },

        weekDays: {
          some: {
            week_day: weekDay
          }
        }
      }
    })
    const day = await prisma.day.findUnique({
      where: {
        date: parsedDay.toDate(),
      },
      include: {
        dayHabits: true
      }
    })

    const completedHabits = day?.dayHabits.map(dayHabit => {
      return dayHabit.habit_id
    })
    return {
      possibleHabits,
      completedHabits
    }
  })

  app.patch('/habits/:id/toggle', async (request, reply) => {
    const toogleHabitParams = z.object({
      id: z.string().uuid(),
    })

    const { id } = toogleHabitParams.parse(request.params)

    const today = dayjs().startOf('day').toDate()

    let day = await prisma.day.findUnique({
      where: {
        date: today
      }
    })

    if (!day) {
      day = await prisma.day.create({
        data: {
          date: today,
        }
      })
    }

    //Verification if had a habit marked
    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id,
        }
      }
    })

    if (dayHabit) {
      //remover Marcação de completo
      await prisma.dayHabit.delete({
        where:{
          id:dayHabit.id,
        }
      })

    } else {
      //Completar o habito nesse dia 
      await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id,
        }
      })
    }
  })

  //Unix epoch timestamp

  app.get('/summary', async () => {
    const summary = await prisma.$queryRaw`
      SELECT D.id, D.date, (
        
        SELECT cast(count(*) as float) FROM day_Habits DH WHERE DH.day_id = D.id
      
      ) as completed ,
      (
        SELECT cast(count(*) as float) FROM habit_week_days HWD 
        JOIN habits H ON H.id = HWD.habit_id
        WHERE HWD.week_day = cast(strftime('%W',D.date/1000.0, 'unixepoch') as int)
        AND H.created_at <= D.date
      ) as amount
      FROM days D
    `

    return summary
  })
}

