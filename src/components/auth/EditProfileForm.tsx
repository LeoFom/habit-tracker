import React, {useRef, useState } from "react";
import {useAuth} from "@/context/AuthContext";
import {AlertCircle, Camera, CheckCircle2, ChevronRight, Loader2, User, Lock} from "lucide-react";

export function EditProfileForm() {
  const { user, updateProfile, resetPassword } = useAuth();
  const userMetaData = user?.user_metadata
  // const [name, setName] = useState(user?.user_metadata?.full_name || "");
  // const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  // console.log("user",user)
  // const [user, setUser] = useState({
  //   user_metadata: {
  //     full_name: "Александр Иванов",
  //     avatar_url: null
  //   },
  //   email: "l.fomenko003@gmail.com"
  // });

  const primaryColor = "#E85D4A";
  const [name, setName] = useState(userMetaData?.full_name || "");
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState("");
  const [avatar, setAvatar] = useState(userMetaData?.avatar_url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Имитация функции обновления профиля
  const handleUpdate = async () => {
    if (!name.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      await updateProfile(name);
      setStatus("success");
      setMessage("Профиль успешно обновлен");
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3000);
    } catch (error) {
      setStatus("error");
      setMessage("Ошибка при обновлении данных");
    }
  };

  const handlePasswordReset = async () => {
    setStatus("loading");
    try {
      await resetPassword(userMetaData?.email);
      setStatus("success");
      setMessage("Инструкции отправлены на почту");
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 4000);
    } catch (error) {
      setStatus("error");
      setMessage("Не удалось отправить запрос");
    }
  };

  const handleAvatarClick = () => {
    fileInputRef?.current?.click();
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader?.result || '/');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-4 font-sans w-full max-w-[400px]">
      <div className="h-[90dvh] max-h-fit w-full max-w-md bg-white rounded-2xl shadow-xl
            border border-gray-100 overflow-x-hidden overflow-y-scroll
          "
      >
        {/* Заголовок */}
        <div className="px-6 py-4 border-b border-gray-50 bg-white">
          <h2 className="text-xl font-bold text-gray-800">Настройки профиля</h2>
          <p className="text-sm text-gray-500">Управление личной информацией</p>
        </div>

        <div className="p-6 space-y-8">
          {/* Секция Аватара */}
          <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <div
                className="w-24 h-24 rounded-full overflow-hidden border-4 bg-gray-100 flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ borderColor: `${primaryColor}15` }}
              >
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <div
                className="absolute bottom-0 right-0 p-2 rounded-full text-white shadow-lg border-2 border-white transition-opacity group-hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                <Camera size={16} />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
            <button
              onClick={handleAvatarClick}
              className="mt-3 text-xs font-bold uppercase tracking-wider transition-colors"
              style={{ color: primaryColor }}
            >
              Изменить фото
            </button>
          </div>

          {/* Поля ввода */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Ваше имя</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Введите имя"
                  style={{
                    width: "100%",
                    padding: "10px 40px 10px 36px", // Додав відступ справа для кнопки
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-bg)",
                    color: "var(--color-text-primary)",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  // className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all text-gray-800 focus:bg-white"
                  // style={{ 'color': `#E85D4A20` }}
                  onFocus={(e) => {
                    e.target.style.borderColor = primaryColor;
                    e.target.style.boxShadow = `0 0 0 4px #E85D4A20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E5E7EB';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleUpdate}
              disabled={status === "loading"}
              className="btn btn-primary"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                width: "100%",
                padding: "10px",
                marginTop: 8,
              }}
              // className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] text-white disabled:opacity-50`}
              // style={{
              //   backgroundColor: status === "success" ? "#10B981" : primaryColor,
              //   boxShadow: status === "success" ? '0 4px 14px 0 rgba(16, 185, 129, 0.39)' : `0 4px 14px 0 ${primaryColor}40`
              // }}
            >
              {status === "loading" ? (
                <Loader2 className="animate-spin" size={20} />
              ) : status === "success" ? (
                <CheckCircle2 size={20} />
              ) : null}
              {status === "loading" ? "Сохранение..." : status === "success" ? "Готово!" : "Обновить профиль"}
            </button>
          </div>

          {/* Секция Безопасности */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2 uppercase tracking-tight opacity-60">
              <Lock size={14} />
              Безопасность
            </h3>
            <button
              onClick={handlePasswordReset}
              disabled={status === "loading"}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-left group"
            >
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">Сбросить пароль</span>
                <span className="text-xs text-gray-500">Письмо придет на {userMetaData?.email || ''}</span>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Уведомления */}
        {message && (
          <div className={`mx-6 mb-6 p-4 rounded-xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-bottom-2 border ${
            status === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
          }`}>
            {status === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="font-medium">{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}