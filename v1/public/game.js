//design patterns
export default function createGame(){ //factory
    const state = { //estado inicial
        players: {},
        fruits: {},
        screen: {
            width: 10,
            height: 10
        }
    }

    //design pattern Observer
    const observers = []

    function start(){ //método para adicionar frutas a cada 2s
        const frequency = 2000
        setInterval(addFruit, frequency)
    }

    function subscribe(observerFunction){
        observers.push(observerFunction)
    }

    function notifyAll(command){
        //recebe o comando que vai propagar
        console.log(`keyboardListener -> Notifying ${observers.length} observers`)

        //executa cada função dos observers
        for(const observerFunction of observers){
            observerFunction(command)
        }
    }

    function setState(newState){
        Object.assign(state, newState) //merge do novo estado com o estado que estava na instância
    }

    function addPlayer(command){
        const playerId = command.playerId
        
        //caso tenha a posição x atribui, senão, gera uma posição aleatória
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
        const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)

        state.players[playerId] = {
            x: playerX,
            y: playerY,
        }

        //toda vez que um player conectar, avisa a todos os observers
        notifyAll({
            type: 'add-player',
            playerId,
            playerX,
            playerY
        })
    }

    function removePlayer(command){
        const playerId = command.playerId

        delete state.players[playerId]

        //toda vez que um player conectar, avisa a todos os observers
        notifyAll({
            type: 'remove-player',
            playerId,
        })
    }

    function addFruit(command){
        const fruitId = command ? command.fruitId : 'fruit-'+(Math.floor(Math.random() * 1000000000))
        const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
        const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY,
        }

        notifyAll({
            type: 'add-fruit',
            fruitId,
            fruitX,
            fruitY
        })
    }

    function removeFruit(command){
        const fruitId = command.fruitId

        delete state.fruits[fruitId]

        notifyAll({
            type: 'remove-fruit',
            fruitId
        })
    }

    function movePlayer(command){
        console.log(`game.movePlayer -> Moving ${command.playerId} with ${command.keyPressed}`)

        const acceptedMoves = {
            ArrowUp(player){ //ArrowUp(player): ArrowUp(player){ ... }
                console.log('Moving player Up')
                if(player.y - 1 >= 0){
                    player.y = player.y - 1
                }
            },
            ArrowRight(player){
                console.log('Moving player Right')
                if(player.x + 1 < state.screen.width){
                    player.x = player.x + 1
                }
            },
            ArrowDown(player){
                console.log('Moving player Down')                        
                if(player.y + 1 < state.screen.height){
                    player.y = player.y + 1
                }
            },
            ArrowLeft(player){
                console.log('Moving player Left')
                if(player.x - 1 >= 0){
                    player.x = player.x - 1
                    return
                }
            },
            z(player){ //comando de ataque

            }
        }

        const keyPressed = command.keyPressed
        const playerId = command.playerId
        const player = state.players[playerId]
        const moveFunction = acceptedMoves[keyPressed]
        
        if(player && moveFunction){ //caso seja uma tecla válida
            moveFunction(player)
            checkForFruitCollision(playerId)
            //toda vez que um player se mover, avisa a todos os observers
            notifyAll(command)
        }                
        
        return
    }

    function checkForFruitCollision(playerId){
        const player = state.players[playerId]

        for(const fruitId in state.fruits){
            const fruit = state.fruits[fruitId]
            console.log(`Checking ${playerId} and ${fruitId}`)

            if(player.x === fruit.x && player.y === fruit.y){
                console.log(`COLLISION between ${playerId} and ${fruitId}`)
                removeFruit({ fruitId })
            }
        }
    }

    return {
        setState,
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        movePlayer, //retorna uma função
        state,
        subscribe,
        start
    }
}