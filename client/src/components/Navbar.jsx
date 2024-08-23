import Login from "../Login"

const Navbar = ({ userAddress, setUserAddress }) => {
  return (
    <div className="flex w-full items-center justify-between px-6 py-3 bg-[#1C1610] border border-b border-[#322921]">
      <span className="text-[#A45509] text-2xl font-semibold">DomainShift</span>
      <Login
        userAddress={userAddress}
        setUserAddress={setUserAddress}
      />
    </div>
  )
}

export default Navbar
