// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// import Input from '../../components/inputs/Input'
// import SpinnerLoader from '../../components/loaders/SpinnerLoader';
// import axiosInstance from '../../utils/axiosInstance';
// import { API_PATHS } from '../../utils/apiPaths';

// const CreateSessionForm = () => {
//   const [formData, setFormData] = useState({
//     role: "",
//     experience: "",
//     topicsToFocus: "",
//     description: ""
//   });

//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   const handleChange = (key, value) => {
//     setFormData((prevData) => ({
//         ...prevData,
//         [key]: value
//     }));
//   }

//   const handleCreateSession = async(e) => {
//     e.preventDefault();
//     const {role, experience, topicsToFocus} = formData;
//     if(!role || !experience || !topicsToFocus){
//         setError("Please fill all the required details !");
//         return;
//     }
//     setError("");
//     setIsLoading(true);

//     try {
//         const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {role, experience, topicsToFocus, numberOfQuestions: 10});
        
//         const generatedQuestions = aiResponse.data;

//         const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
//             ...formData,
//             questions: generatedQuestions
//         });

//         if(response.data?.session?._id){
//             navigate(`/interview-prep/${response.data?.session?._id}`);
//         }
//     }catch(error){
//         if(error.response && error.response.data.message){
//             setError(error.response.data.message);
//         }
//         else{
//             setError("Something went wrong. Please try again !");
//         }
//     }finally{
//         setIsLoading(false);
//     }
//   }
//   return (
//     <div className='w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center'>
//         <h3 className='text-lg font-semibold text-black'>Start A New Interview Journey !</h3>
//         <p className='text-xs text-slate-700 mt-1.25 mb-3'>Fill out a few quick details and unlock your personalized set of interview questions !</p>
//         <form className='flex flex-col gap-3' onSubmit={handleCreateSession} action="">
//             <Input value={formData.role} onChange={({target}) => handleChange("role", target.value)} label={"Target Role"} placeholder={"(e.g., Frontend Developer, UI/UX Designer, etc.)"} type="text" />
//             <Input value={formData.experience} onChange={({target}) => handleChange("experience", target.value)} label={"Years of Experience"} placeholder={"(e.g., 1 year, 3 years, 5+ years)"} type="number" />
//             <Input value={formData.topicsToFocus} onChange={({target}) => handleChange("topicsToFocus", target.value)} label={"Topics To Focus On"} placeholder={"(Comma-separated, e.g., Reat, Node.js, MongoDB)"} type="text" />
//             <Input value={formData.description} onChange={({target}) => handleChange("description", target.value)} label={"Description"} placeholder={"(Any specific goal or notes for this session ?)"} type="text" />
//             {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
//             <button type='submit' className='btn-primary w-full mt-2' disabled={isLoading}>{isLoading && <SpinnerLoader/>}Create Session</button>
//         </form>
//     </div>
//   )
// }

// export default CreateSessionForm


import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { LuUser, LuFileText, LuUpload } from 'react-icons/lu';
import Input from '../../components/inputs/Input'
import SpinnerLoader from '../../components/loaders/SpinnerLoader';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const CreateSessionForm = () => {
  const [mode, setMode] = useState('manual'); // 'manual' | 'resume'

  // Manual form
  const [formData, setFormData] = useState({
    role: "", experience: "", topicsToFocus: "", description: ""
  });

  // Resume upload
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // ── Manual submit ──
  const handleCreateSession = async (e) => {
    e.preventDefault();
    const { role, experience, topicsToFocus } = formData;
    if (!role || !experience || !topicsToFocus) {
      setError("Please fill all the required details !");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role, experience, topicsToFocus, numberOfQuestions: 10
      });
      const generatedQuestions = aiResponse.data;
      const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        ...formData,
        questions: generatedQuestions
      });
      if (response.data?.session?._id) {
        navigate(`/interview-prep/${response.data.session._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again !");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Resume submit ──
  const handleResumeSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError("Please select a PDF resume first."); return; }
    setError("");
    setIsLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append('resume', file);
      const response = await axiosInstance.post(API_PATHS.RESUME.ANALYZE, formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data?.session?._id) {
        navigate(`/interview-prep/${response.data.session._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to analyze resume. Please try again !");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') { setFile(f); setError(''); }
    else setError('Please upload a PDF file only.');
  };

  return (
    <div className='w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>Start A New Interview Journey !</h3>
      <p className='text-xs text-slate-700 mt-1.25 mb-4'>Fill out a few quick details or upload your resume to get a personalized set of interview questions !</p>

      {/* Mode toggle */}
      <div className='flex bg-gray-100 rounded-lg p-1 gap-1 mb-5'>
        <button
          type='button'
          onClick={() => { setMode('manual'); setError(''); }}
          className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-md transition-all cursor-pointer ${mode === 'manual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <LuUser size={14} /> Fill Manually
        </button>
        <button
          type='button'
          onClick={() => { setMode('resume'); setError(''); }}
          className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-md transition-all cursor-pointer ${mode === 'resume' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <LuFileText size={14} /> Upload Resume
        </button>
      </div>

      {/* ── MANUAL MODE ── */}
      {mode === 'manual' && (
        <form className='flex flex-col gap-3' onSubmit={handleCreateSession}>
          <Input value={formData.role} onChange={({ target }) => handleChange("role", target.value)} label={"Target Role"} placeholder={"(e.g., Frontend Developer, UI/UX Designer, etc.)"} type="text" />
          <Input value={formData.experience} onChange={({ target }) => handleChange("experience", target.value)} label={"Years of Experience"} placeholder={"(e.g., 1 year, 3 years, 5+ years)"} type="number" />
          <Input value={formData.topicsToFocus} onChange={({ target }) => handleChange("topicsToFocus", target.value)} label={"Topics To Focus On"} placeholder={"(Comma-separated, e.g., React, Node.js, MongoDB)"} type="text" />
          <Input value={formData.description} onChange={({ target }) => handleChange("description", target.value)} label={"Description"} placeholder={"(Any specific goal or notes for this session ?)"} type="text" />
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
          <button type='submit' className='btn-primary w-full mt-2' disabled={isLoading}>
            {isLoading && <SpinnerLoader />} Create Session
          </button>
        </form>
      )}

      {/* ── RESUME MODE ── */}
      {mode === 'resume' && (
        <form className='flex flex-col gap-3' onSubmit={handleResumeSubmit}>
          <p className='text-xs text-gray-500 -mt-1 mb-1'>
            Upload your resume and we'll generate <span className='font-medium text-gray-700'>20 high-priority questions</span> tailored specifically to your background.
          </p>

          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${dragOver ? 'border-orange-400 bg-orange-50' : file ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/30'}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => fileInputRef.current.click()}
          >
            <input ref={fileInputRef} type='file' accept='.pdf' className='hidden' onChange={(e) => handleFile(e.target.files[0])} />
            {file ? (
              <>
                <LuFileText size={30} className='text-green-500 mx-auto mb-2' />
                <p className='text-sm font-medium text-green-700'>{file.name}</p>
                <p className='text-xs text-green-500 mt-1'>{(file.size / 1024).toFixed(1)} KB · PDF</p>
                <button
                  type='button'
                  className='text-xs text-gray-400 hover:text-red-500 mt-2 cursor-pointer'
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                >Remove</button>
              </>
            ) : (
              <>
                <LuUpload size={26} className='text-gray-300 mx-auto mb-3' />
                <p className='text-sm font-medium text-gray-600'>Drop your resume here</p>
                <p className='text-xs text-gray-400 mt-1'>or click to browse · PDF only · max 5MB</p>
              </>
            )}
          </div>

          {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
          <button type='submit' className='btn-primary w-full mt-2' disabled={isLoading || !file}>
            {isLoading && <SpinnerLoader />} Generate from Resume
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateSessionForm;