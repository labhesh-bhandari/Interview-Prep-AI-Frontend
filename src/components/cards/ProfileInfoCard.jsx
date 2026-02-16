import { useContext } from 'react'
import { userContext } from '../../context/userContext'
import { useNavigate } from 'react-router-dom';

const ProfileInfoCard = () => {
  const {user, clearUser} = useContext(userContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUser();
    navigate("/");
  }
  return user && (
    <div className='flex items-center'>
        <img src={user.profileImageUrl || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"} alt="" className='w-11 h-11 bg-gray-300 rounded-full mr-3'/>
        <div>
            <div className='text-[15px] text-black font-bold leading-3'>{user.name || ""}</div>
            <button className='text-amber-600 text-sm font-semibold cursor-pointer hover:underline' onClick={handleLogout}>Logout</button>
        </div>
    </div>
  )
}

export default ProfileInfoCard