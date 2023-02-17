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

const initialState = {
  status: loadState.idle,
  pokemon: null,
  error: null
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  render() {
    const { error } = this.state;
    console.log('render error', error)
    if (error) {
      return <this.props.FallbackComponent error={error} />
    }

    return this.props.children; 
  }
}

function ErrorFallback({error}) {
  return (
    <div role="alert">
      There was an error caught by a boundary: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>        
  )
}

function PokemonInfo({pokemonName}) {

  const [state, setState] = React.useState(initialState)

  React.useEffect(() => {

    if (!pokemonName) return;

    setState({
      status: loadState.pending,
      pokemon: null,
      error: null
    })

    fetchPokemon(pokemonName)
      .then(pokemonData => 
      { 
        setState({
            status: loadState.resolved,
            pokemon: pokemonData,
            error: null
          })
      })    
      .catch(error => 
      { 
        setState({
          status: loadState.rejected,
          pokemon: null,
          error: error
        })        
      })

  }, [pokemonName])

  switch (state.status) {
      case loadState.idle:
        return 'Submit a pokemon'   

      case loadState.pending:
        return <PokemonInfoFallback name={pokemonName} />   

      case loadState.resolved:
        return <PokemonDataView pokemon={state.pokemon} />   

      default:
        throw state.error;
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
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
