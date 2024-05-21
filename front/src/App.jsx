import React, { useState } from "react";
import axios from "axios";

function App() {
  const [selectedImage, setSelectedImage] = useState(null); // عکس انتخاب شده توسط کاربر
  const [convertedImage, setConvertedImage] = useState(null); // عکس تبدیل شده دریافتی از سرور
  const [loading, setLoading] = useState(false); // وضعیت بارگذاری

  // هنگامی که کاربر یک عکس انتخاب می‌کند
  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  // تابع برای ارسال عکس به سرور و دریافت عکس تبدیل شده
  const handleUpload = async () => {
    try {
      setLoading(true); // نشان دادن وضعیت بارگذاری

      // ساخت یک FormData برای ارسال عکس به سرور
      const formData = new FormData();
      formData.append("image", selectedImage);

      // ارسال عکس به سمت سرور
      const response = await axios.post(
        "http://localhost:3000/",
        formData,
        {
          responseType: "arraybuffer",
        }
      );

      // تبدیل داده دریافتی به URL برای نمایش در تگ img
      const convertedImageBlob = new Blob([response.data], {
        type: "image/webp",
      });
      const imageSrc = URL.createObjectURL(convertedImageBlob);

      // تنظیم عکس تبدیل شده در استیت
      setConvertedImage(imageSrc);
    } catch (error) {
      console.error("خطا در آپلود عکس:", error);
    } finally {
      setLoading(false); // مخفی کردن وضعیت بارگذاری
    }
  };

  return (
    <div className="flex flex-col gap-y-4 justify-center items-center p-2 mt-8">
      <div className="flex flex-col gap-8  ">
        {/* المان input برای انتخاب عکس */}
        <label htmlFor="">File accept : jpeg-png-webp</label>
        <input
          type="file"
          className="file-input file-input-bordered w-full max-w-xs"
          onChange={handleImageChange}
          accept="image/jpeg, image/png, image/gif, image/webp"
        />
        {/* دکمه برای آپلود عکس */}
        <button
          onClick={handleUpload}
          disabled={!selectedImage || loading}
          className="btn btn-accent disabled:bg-blue-500 disabled:text-white text-white"
        >
          {loading ? (
            <>
              <span>Uploading ...</span>
              <span className="loading loading-ring loading-xs"></span>
            </>
          ) : (
            "Upload"
          )}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-y-4 gap-x-4">
        {/* نمایش عکس انتخاب شده */}
        {selectedImage && (
          <div>
            <h2 className="mb-2 text-xs">Main Picture</h2>
            <img
              className="w-[300px] md:w-[300px] h-auto"
              src={URL.createObjectURL(selectedImage)}
            />
          </div>
        )}

        {/* نمایش عکس تبدیل شده */}
        {convertedImage && (
          <div>
            <h2 className="mb-2 text-xs">Optimized Picture</h2>
            <img
              className="w-[300px] md:w-[300px] h-auto"
              src={convertedImage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
