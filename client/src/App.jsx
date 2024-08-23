import { useState } from "react";
import Navbar from "./components/Navbar"
import UrlForm from "./UrlForm"

function App() {
  const [userAddress, setUserAddress] = useState('');

  return (
    <div className="flex flex-col items-center justify-start h-[100vh]">
      <Navbar
        userAddress={userAddress}
        setUserAddress={setUserAddress}
      />
      <div className="flex flex-col justify-center items-center bg-gradient-to-r from-[#1C1610] via-[#2F1B1F] to-[#1C1610] w-full h-full">
        <UrlForm userAddress={userAddress} />
      </div>
    </div>
  )
}

export default App
