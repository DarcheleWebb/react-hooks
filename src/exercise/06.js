// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'

const loadState = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected'
}

function PokemonInfo({pokemonName}) {

  const [pokemon, setPokemon] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [state, setState] = React.useState(loadState.idle)

  React.useEffect(() => {

    if (!pokemonName) return;

    setState(loadState.pending)

    fetchPokemon(pokemonName)
      .then(pokemonData => 
      { 
        setState(loadState.resolved)
        setPokemon(pokemonData) 
      })    
      .catch(error => 
      { 
        setState(loadState.rejected)
        setError(error) 
      })

  }, [pokemonName])

  switch (state) {
      case loadState.idle:
        return 'Submit a pokemon'   

      case loadState.pending:
        return <PokemonInfoFallback name={pokemonName} />   

      case loadState.resolved:
        return <PokemonDataView pokemon={pokemon} />   

      default:
      return (
        <div role="alert">
          There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        </div>
      )
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
