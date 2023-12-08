import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";



export async function AuthRoute(app: FastifyInstance) {
  app.post('/login', async (req,reply) => {
    const bodySchema = z.object({
      phone: z.string({required_error: 'Digite seu telefone celular'}).default('(DD)*****-****'),
      email: z.string({required_error: 'Digite seu E-mail'}).email({message:"Seu e-mail ja está em uso"}),
      password: z.string({required_error: 'Digite sua senha'}).min(7,{message: 'Sua senha tem que ter no minimo de 7 caracteres'})
    })

    try {
    const {email, password, phone} = bodySchema.parse(req.body)
  
    const getUser = await prisma.user.findFirst({
      where: {
        OR: [
          {email},
          {phone}
        ],
        password
      }
    })

    if(!getUser) {
      reply.status(401).send({
        error: "Unauthorized",
        message:"Você ainda não possui cadastro"
      })
    }

    console.log(getUser)
     
    return getUser
  } catch (error) {
    console.error('Error:', error);
    return reply.status(500).send({
      error: "Internal Server Error",
      message: "An error occurred while processing the request",
    });
  }
  });
  
  
  app.post('/create_user', async (req) => {
    const bodySchema = z.object({
      name: z.string({required_error: 'Nome é obrigatório'}).min(6,{message:'Digite seu nome e sobrenome'}),
      phone: z.string({required_error: 'Digite seu telefone celular'}).default('(DD)*****-****'),
      email: z.string({required_error: 'Digite seu E-mail'}).email({message:"Seu e-mail ja está em uso"}),
      password: z.string({required_error: 'Digite sua senha'}).min(7,{message: 'Sua senha tem que ter no minimo de 7 caracteres'})
    })

    const {email,name,password,phone} = bodySchema.parse(req.body)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password,
        phone,
      }
    })
    return user
  })
}