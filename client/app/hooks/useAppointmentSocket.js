"use client"

import { useEffect } from "react"
import { useSocket } from "../context/socket"

export const useAppointmentSocket = (onUpdate) => {
  const socket = useSocket()

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