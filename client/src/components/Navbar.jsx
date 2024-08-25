import Login from "../Login"
import logo from '/logo.png'

const Navbar = ({ userAddress, setUserAddress }) => {
  return (
    <div className="flex w-full items-center justify-between px-6 py-3 bg-[#1C1610] border border-b border-[#322921]">
      <img src={logo} alt="" className="h-14 w-16" />
      <Login
        userAddress={userAddress}
        setUserAddress={setUserAddress}
      />
    </div>
  )
}

export default Navbar
