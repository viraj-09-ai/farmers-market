import { useState, useRef } from "react";

export default function CropDoctor() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!image) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", image);

    try {
      // ✅ THE FIX: We use the Vercel variable. 
      // If it doesn't exist (like on your laptop), it defaults to 127.0.0.1
      const backendUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:10000";
      
      const response = await fetch(`${backendUrl}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.analysis);
      } else {
        setError(data.error || "Failed to analyze the image.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the server. Check your Vercel/Render connection.");
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20 font-sans text-gray-800">
      
      {/* HERO SECTION */}
      <div className="px-4 sm:px-10 pt-8 max-w-6xl mx-auto">
        <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-emerald-900 to-green-800 text-white rounded-[2rem] p-12 text-center shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-400/20 rounded-full blur-[80px]"></div>
          
          <h1 className="relative z-10 text-4xl sm:text-6xl font-black tracking-tight drop-shadow-lg mb-6">
            AI Crop & Soil Doctor <span className="text-emerald-400">🌿</span>
          </h1>
          <p className="relative z-10 text-lg sm:text-xl text-green-100 font-medium max-w-3xl mx-auto leading-relaxed">
            Upload a photo of your crop or farm soil. Our advanced AI will identify diseases, suggest immediate care tips, and recommend the best crops for your land.
          </p>
        </section>
      </div>

      {/* MAIN TOOL AREA */}
      <div className="px-4 sm:px-10 mt-10 max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-12">
          
          <div className="flex flex-col lg:flex-row gap-10">
            {/* LEFT COLUMN: UPLOADER */}
            <div className="flex-1 flex flex-col items-center">
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden" 
              />
              
              <div 
                onClick={triggerFileInput}
                className={`w-full h-96 rounded-[2rem] border-4 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group overflow-hidden relative ${
                  preview ? "border-green-500 bg-gray-900" : "border-gray-200 bg-gray-50 hover:bg-green-50 hover:border-green-400"
                }`}
              >
                {preview ? (
                  <>
                    <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
                      <span className="bg-white text-gray-900 font-black px-8 py-3 rounded-full shadow-2xl hover:scale-105 transition-transform">Replace Photo</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <div className="text-7xl mb-6 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300">📸</div>
                    <h3 className="text-2xl font-black text-gray-800 mb-2">Click to Upload Photo</h3>
                    <p className="text-gray-400 font-medium">Supports JPG, PNG, WEBP</p>
                  </div>
                )}
              </div>

              <button 
                onClick={handleAnalyze}
                disabled={!image || loading}
                className={`mt-8 w-full text-lg font-black py-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  !image || loading 
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                  : "bg-gray-900 text-white hover:bg-green-600 hover:shadow-green-500/30 hover:-translate-y-1 active:scale-95"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Analyzing... Please wait
                  </>
                ) : "Analyze with AI ✨"}
              </button>
            </div>

            {/* RIGHT COLUMN: RESULTS */}
            <div className="flex-1 bg-gray-50 rounded-[2rem] p-8 border border-gray-100 shadow-inner flex flex-col min-h-[500px]">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3 tracking-tight">
                📊 Diagnostic Results
              </h2>

              {error && (
                <div className="bg-red-50 text-red-700 p-5 rounded-2xl font-bold border border-red-100 mb-4 shadow-sm">
                  ❌ {error}
                </div>
              )}

              {loading && !result && !error && (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                  <div className="text-7xl animate-pulse mb-6">🧠</div>
                  <p className="font-bold text-xl text-gray-500">AI is scanning your image...</p>
                  <p className="text-sm font-medium mt-2">This usually takes about 3-5 seconds.</p>
                </div>
              )}

              {!loading && !result && !error && (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center px-4">
                  <div className="text-7xl mb-6 opacity-40">🔬</div>
                  <p className="font-bold text-xl text-gray-500 mb-2">Awaiting Image</p>
                  <p className="text-sm font-medium">Upload a farm photo and click analyze to generate your custom report.</p>
                </div>
              )}

              {result && (
                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-gray-700 leading-relaxed font-medium">
                    {result.split('\n').map((line, index) => {
                      if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
                        return <li key={index} className="ml-6 mb-3 marker:text-green-500">{line.replace(/^[*-\s]+/, '')}</li>;
                      } else if (line.trim() !== '') {
                        return <p key={index} className="mb-4 text-lg font-black text-gray-900 tracking-tight">{line.replace(/\*\*/g, '')}</p>;
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}