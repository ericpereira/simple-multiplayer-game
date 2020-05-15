import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import socketio from 'socket.io'

const app = express()
const server = http.createServer(app)
const sockets = socketio(server) //conectando o socket.io ao servidor

//pasta com arquivos publicos
app.use(express.static('public'))

//lógica do jogo
const game = createGame()
game.start() //inicia o game, adicionando frutas

//observer, toda vez que um comando acontecer, emite para o client side
game.subscribe((command) => {
    console.log(`> Emitting ${command.type}`)
    sockets.emit(command.type, command) //emite o comando e o tipo para todos os sockets
})

console.log(game.state)

//lista de sockets conectados
//quando alguem consegue conectar, emite o evento de connection
sockets.on('connection', (socket) => { //injeta o objeto do socket
    const playerId = socket.id
    console.log(`> Player connected on Server with id: ${playerId}`)

    //quando se conecta, adiciona um novo jogador
    game.addPlayer({ playerId }) 

    //após o usuário se conectar com o servidor, emite pra ele o estado atual do jogo
    //setup é o nome do evento customizado, pode ser qualquer nome
    socket.emit('setup', game.state)

    //quando desconectar, exclui o jogador
    socket.on('disconnect', () => {
        game.removePlayer({ playerId })
        console.log(`> Player ${playerId} disconnected`)
    })

    //escuta evento de clique na tecla
    socket.on('move-player', (command) => {
        //FAZER AS VALIDAÇÕES DOS DADOS VINDOS DO CLIENT SIDE
        command.playerId = playerId //validação mínima, reescrevendo o id para o id do socket atual
        command.type = 'move-player' //reescrevendo comando para o comando de mover

        game.movePlayer(command)
    })
})

//expondo a porta 3000
server.listen(3000, () => {
    console.log('> Server listening on port: 3000')
})