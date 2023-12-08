import fastify from "fastify"
import cors from '@fastify/cors'
import { env } from "./env"
import { AuthRoute } from "./router/auth"

const app = fastify()

app.register(cors, {
  origin: true,
})

app.register(AuthRoute)

app.listen({
  port: 3333 || `${env.PORT}`,
  host: '0.0.0.0'
}).then(() => {
  console.log(`🛜  HTTP server ruinning on http://localhost:${env.PORT}`)
})