import Fastify from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './routes/routes'


const app = Fastify()
app.register(cors)

app.register(appRoutes)

app.listen({ port: 3333 }, (err, address) => {
  if (err) {
    console.error(err)
  }
  console.log(`Server listening at ${address}`)
})