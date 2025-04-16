"use client"

import React, { useState, useEffect } from "react"
import { X } from "lucide-react"

interface ToastProps {
  message: string
  type: "success" | "error" | "info"
  onClose?: () => void
  duration?: number
}

export const Toast: React.FC<ToastProps> = ({ message, type = "info", onClose = () => {}, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof onClose === "function") {
        onClose()
      }
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const typeStyles = {
    success: {
      bg: "bg-white",
      border: "border-green-600",
      text: "text-green-800",
      button: "bg-green-600 text-white hover:bg-green-700",
    },
    error: {
      bg: "bg-white",
      border: "border-red-600",
      text: "text-red-800",
      button: "bg-red-600 text-white hover:bg-red-700",
    },
    info: {
      bg: "bg-white",
      border: "border-blue-800",
      text: "text-blue-800",
      button: "bg-blue-800 text-white hover:bg-blue-900",
    },
  }

  const styles = typeStyles[type]

  const handleClose = () => {
    if (typeof onClose === "function") {
      onClose()
    }
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 ${styles.bg} border-4 ${styles.border} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] transform transition-all duration-200 ease-in-out`}
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center">
          <span className={`font-bold ${styles.text} text-lg`}>{message}</span>
        </div>
        <button
          onClick={handleClose}
          className={`ml-4 p-1 ${styles.button} border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.8)] transition-all`}
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

interface ToastProviderProps {
  children: React.ReactNode
}

export type ToastType = {
  id: string
  message: string
  type: "success" | "error" | "info"
}

export const ToastContext = React.createContext<{
  showToast: (message: string, type: "success" | "error" | "info") => void
}>({
  showToast: () => {},
})

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastType[]>([])

  const showToast = (message: string, type: "success" | "error" | "info") => {
    console.log('ToastProvider.showToast llamado con:', { message, type });
    const id = Math.random().toString(36).substring(2, 9)
    console.log('Generado ID de toast:', id);
    setToasts((prev) => {
      const newToasts = [...prev, { id, message, type }];
      console.log('Nuevo estado de toasts:', newToasts);
      return newToasts;
    })
  }

  const removeToast = (id: string) => {
    console.log('Removiendo toast con ID:', id);
    setToasts((prev) => {
      const newToasts = prev.filter((toast) => toast.id !== id);
      console.log('Estado de toasts después de remover:', newToasts);
      return newToasts;
    })
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    console.error("useToast llamado fuera de un ToastProvider");
    throw new Error("useToast must be used within a ToastProvider")
  }
  console.log('useToast hook utilizado correctamente');
  return context
}

