/* eslint-disable react-hooks/rules-of-hooks */
// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState(
  key,
  defaultValue = '',
  {
    serialize = JSON.stringify,
    deserialize = JSON.parse
  } = {} ){

  const [state, setState] = React.useState(
    () => {
      const valueInLocalStore = window.localStorage.getItem(key)
      if (valueInLocalStore) {
        return deserialize(valueInLocalStore)
      }
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue
    }
  )

  // keep track to prev value, this provides an object that can be changed without triggering re render 
  const prevKeyRef = React.createRef(key)

  React.useEffect( ()=>{
    const prevKey = prevKeyRef.current
    // check if previous key is different and removesIt
    if(prevKey !== key){
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  },[key, prevKeyRef, serialize, state])

  return [state, setState]

}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('namer', initialName);

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input 
          value={name}
          onChange={handleChange}
          id="name"
        />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
