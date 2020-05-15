export default function createKeyboardListener(document){ //factory
    const state = {
        observers: [],
        playerId: null
    }

    function registerPlayerId(playerId) { //registra de forma dinâmica um player
        state.playerId = playerId
    }

    function subscribe(observerFunction){
        state.observers.push(observerFunction)
    }

    function notifyAll(command){
        //recebe o comando que vai propagar
        console.log(`keyboardListener -> Notifying ${state.observers.length} observers`)

        //executa cada função dos observers
        for(const observerFunction of state.observers){
            observerFunction(command)
        }
    }

    //eventos
    document.addEventListener('keydown', handleKeydown)

    function handleKeydown(event){
        const keyPressed = event.key
        
        const command = {
            type: 'move-player',
            playerId: state.playerId,
            keyPressed //keyPressed: keyPressed
        }

        notifyAll(command) //a cada keypress notifica todos os observers
    }

    return {
        subscribe,
        registerPlayerId
    }
}