// import { useState } from 'react';

import ParserPanel from "./ParserPanel"
import QueryPanel from "./QueryPanel"

function App() {

  return (
    <>
      <div className=' bg-black flex px-4 py-4 justify-between'  >
        <p className='text-white font-semibold block' >Medblocks AQL Parser</p>
        <a className='block text-blue-300' href="https://github.com/medblocks/aql-parser" >Github</a>
      </div>
      <div className="grid grid-flow-row grid-cols-4 h-[100vh]" >
        <div className="col-span-1" >
          <QueryPanel />
        </div>
        <div className="col-span-3" >
          <ParserPanel />
        </div>
      </div>
    </>
  )
}

export default App
