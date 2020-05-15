export default function renderScreen(screen, game, requestAnimationFrame, currentPlayerId){
    //clear screen
    const context = screen.getContext('2d')
    context.fillStyle = 'white'
    context.clearRect(0, 0, 10, 10)

    for (const playerId in game.state.players){ //renderiza players
        const player = game.state.players[playerId]
        context.fillStyle = 'black'
        context.fillRect(player.x, player.y, 1, 1)
    }

    for (const fruitId in game.state.fruits){ //renderiza frutas
        const fruit = game.state.fruits[fruitId]
        context.fillStyle = 'green'
        context.fillRect(fruit.x, fruit.y, 1, 1)
    }

    //coloca a cor no meu jogador
    const currentPlayer = game.state.players[currentPlayerId]
    if(currentPlayer){
        context.fillStyle = '#f0bd4f'
        context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1)
    }

    //função otimizada para renderização do jogo
    requestAnimationFrame(() => {
        renderScreen(screen, game, requestAnimationFrame, currentPlayerId)
    })
}