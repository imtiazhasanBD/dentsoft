'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket'],
    })

    setSocket(socketInstance)

    return () => {
      if (socketInstance) socketInstance.disconnect()
    }
  }, [])

  // appointment event handlers
  const useAppointmentSocket = (onUpdate) => {
    useEffect(() => {
      if (!socket) return

      const handleCreated = (data) => onUpdate('created', data)
      const handleUpdated = (data) => onUpdate('updated', data)
      const handleDeleted = (id) => onUpdate('deleted', id)

      socket.on('appointment:created', handleCreated)
      socket.on('appointment:updated', handleUpdated)
      socket.on('appointment:deleted', handleDeleted)

      return () => {
        socket.off('appointment:created', handleCreated)
        socket.off('appointment:updated', handleUpdated)
        socket.off('appointment:deleted', handleDeleted)
      }
    }, [socket, onUpdate])
  }

  return (
    <SocketContext.Provider value={{ socket, useAppointmentSocket }}>
      {children}
    </SocketContext.Provider>
  )
}