import{ BrowserRouter, Routes, Route } from 'react-router-dom';
import{ Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/home/Dashboard';
import InterviewPrep from './pages/interview/InterviewPrep';
import UserProvider from './context/userContext';


const App = () => {
  return (
    <UserProvider>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<LandingPage />}></Route>
            <Route path='/dashboard' element={<Dashboard />}></Route>
            <Route path='/interview-prep/:sessionId' element={<InterviewPrep />}></Route>
          </Routes>
        </BrowserRouter>
        <Toaster toastOptions={{className: "", style: {fontSize: "13px",},}}></Toaster>
      </div>
    </UserProvider>
  )
}

export default App